"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { z } from "zod";
import Info from "@/components/info";
import axios from "axios";

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
};

type Errors = Partial<
  Record<"position" | "gender" | "phoneNumber", string>
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
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(STAFF_LOGGED_IN_KEY) === "true";
    const token = localStorage.getItem("access_token");

    if (!isLoggedIn || !token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      if (!id) return;
      
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/staff/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;

        setUser({
          id: data.id,
          role: "staff",
          firstName: data.fullName?.split(' ')[0] || '',
          lastName: data.fullName?.split(' ').slice(1).join(' ') || '',
          email: data.user?.email || '',
        });

        setProfile({
          position: data.position,
          gender: data.gender,
          phoneNumber: data.phoneNumber,
        });

        setEditForm({
            position: data.position,
            gender: data.gender,
            phoneNumber: data.phoneNumber,
        });

      } catch (error) {
        console.error("Failed to fetch staff data", error);
        // Handle token expiry etc
        if ((error as any).response?.status === 401) {
             localStorage.removeItem(STAFF_LOGGED_IN_KEY);
             router.push("/staff/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEdit()) return;

    setSaving(true);

    // Use validated data
    const validatedData = profileSchema.parse(editForm);

    try {
        const token = localStorage.getItem("access_token");
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/staff/${id}`, validatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfile((prev) => ({ ...prev, ...validatedData } as StaffProfile));
        setEditMode(false);
        setErrors({});
        // Optional: Add toast success here
    } catch (error) {
        console.error("Failed to update profile", error);
        // Optional: Add toast error here
    } finally {
        setSaving(false);
    }
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 py-8">
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
                <div className="grid grid-cols-1 gap-4">
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
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
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
                <div className="grid grid-cols-1 gap-4">
                  <Info label="Position" value={profile?.position || "Not provided"} />
                  <Info label="Gender" value={profile?.gender || "Not provided"} />
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <Info label="Phone Number" value={profile?.phoneNumber || "Not provided"} />
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


