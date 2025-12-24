"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import Info from "@/components/info";

type StaffUser = {
  id: string;
  role: "staff";
  firstName: string;
  lastName: string;
  email: string;
};

type StaffPosition = "CHECKER" | "SUPERVISOR" | "SUPPORT";

type StaffProfile = {
  position: StaffPosition;
  gender: string;
  phoneNumber: string;
  address: string;
};

type Errors = Partial<
  Record<"position" | "gender" | "phoneNumber" | "address", string>
>;

const STAFF_USER_KEY = "eventhub_staff_user";
const STAFF_PROFILE_KEY = "eventhub_staff_profile";
const STAFF_LOGGED_IN_KEY = "eventhub_staff_isLoggedIn";

// Use StaffPositionValues object for z.nativeEnum()
const StaffPositionValues = {
  CHECKER: "CHECKER",
  SUPERVISOR: "SUPERVISOR",
  SUPPORT: "SUPPORT",
} as const;

//Zod schema
const profileSchema = z.object({
  position: z.nativeEnum(StaffPositionValues, { message: "Position is required" }),
  gender: z.string().min(1, "Gender is required"),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number"),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .min(5, "Address must be at least 5 characters"),
});

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function StaffProfilePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id as string | undefined;

  const [user, setUser] = useState<StaffUser | null>(null);
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    position: "CHECKER" as StaffPosition,
    gender: "",
    phoneNumber: "",
    address: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(STAFF_LOGGED_IN_KEY) === "true";
    const u = safeParse<any>(localStorage.getItem(STAFF_USER_KEY));
    const p = safeParse<StaffProfile>(localStorage.getItem(STAFF_PROFILE_KEY));

    if (!isLoggedIn || !u) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    // If URL id != stored user id, treat as not logged in (no data)
    if (id && u?.id && u.id !== id) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }


    setUser({
      id: u.id,
      role: "staff",
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
    });

    const defaultProfile: StaffProfile = {
      position: "CHECKER",
      gender: "",
      phoneNumber: "",
      address: "",
    };

    const currentProfile = p ?? defaultProfile;
    setProfile(currentProfile);

    // Populate edit form with current profile
    setEditForm(currentProfile);

    setLoading(false);
  }, [id, router]);

  const handleLogout = () => {
    localStorage.removeItem(STAFF_LOGGED_IN_KEY);
    router.push("/staff/login");
  };

  const validateEdit = () => {
    const result = profileSchema.safeParse(editForm);

    if (result.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
    const e: Errors = {};

    for (const [key, messages] of Object.entries(fieldErrors)) {
      if (messages?.length) {
        e[key as keyof Errors] = messages[0];
      }
    }

    setErrors(e);
    return false;
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEdit()) return;

    setSaving(true);

    // Use validated data
    const validatedData = profileSchema.parse(editForm);

    localStorage.setItem(STAFF_PROFILE_KEY, JSON.stringify(validatedData));
    setProfile(validatedData);
    
    setEditMode(false);
    setSaving(false);
    setErrors({});
  };

  const inputClass = (field: keyof Errors) =>
    `w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
     focus:outline-none focus:ring-2 ${
       errors[field]
         ? "border border-red-500 focus:ring-red-500"
         : "border border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
     }`;

  const ErrorText = ({ field }: { field: keyof Errors }) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
    ) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="mb-4">Please log in as staff to view this page</p>
          <Link href="/staff/login" className="text-indigo-600 hover:underline">
            Go to Staff Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              Staff Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Staff dashboard info</p>
          </div>

          <div className="space-x-2">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditMode(false);
                  setErrors({});
                }}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
          {/* Basic Info - Read Only */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Basic Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <Info label="First Name" value={user.firstName || "-"} />
              <Info label="Last Name" value={user.lastName || "-"} />
            </div>
            <div className="mt-4">
              <Info label="Email" value={user.email || "-"} />
            </div>
          </div>

          <hr className="border-gray-300 dark:border-gray-600" />

          {/* Edit Profile Form / Display */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Staff Details
            </h2>

            {editMode ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Position *</label>
                    <select
                      name="position"
                      value={editForm.position}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          position: e.target.value as StaffPosition,
                        }))
                      }
                      className={inputClass("position")}
                    >
                      <option value="CHECKER">Checker</option>
                      <option value="SUPERVISOR">Supervisor</option>
                      <option value="SUPPORT">Support</option>
                    </select>
                    <ErrorText field="position" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Gender *</label>
                    <select
                      name="gender"
                      value={editForm.gender}
                      onChange={(e) =>
                        setEditForm((prev) => ({
                          ...prev,
                          gender: e.target.value,
                        }))
                      }
                      className={inputClass("gender")}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ErrorText field="gender" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Phone Number *</label>
                  <input
                    name="phoneNumber"
                    value={editForm.phoneNumber}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                    className={inputClass("phoneNumber")}
                    placeholder="+8801XXXXXXXXX"
                  />
                  <ErrorText field="phoneNumber" />
                </div>

                <div>
                  <label className="text-sm font-medium">Address *</label>
                  <input
                    name="address"
                    value={editForm.address}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className={inputClass("address")}
                    placeholder="Street, Area, City"
                  />
                  <ErrorText field="address" />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:bg-gray-400"
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <Info label="Position" value={profile?.position || "Not provided"} />
                  <Info label="Gender" value={profile?.gender || "Not provided"} />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Info label="Phone Number" value={profile?.phoneNumber || "Not provided"} />
                  <Info label="Address" value={profile?.address || "Not provided"} />
                </div>
              </>
            )}
          </div>

          {!editMode && (
            <div className="pt-6 border-t border-gray-300 dark:border-gray-600">
              <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                ← Back to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


