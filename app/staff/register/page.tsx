"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

type StaffPosition = "CHECKER" | "SUPERVISOR" | "SUPPORT";

const StaffPositionValues = {
  CHECKER: "CHECKER",
  SUPERVISOR: "SUPERVISOR", 
  SUPPORT: "SUPPORT",
} as const;

type StaffUser = {
  id: string;
  role: "staff";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type StaffProfile = {
  position: StaffPosition;
  gender: string;
  phoneNumber: string;
  address: string;
};

const staffRegisterSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email address"),
    phoneNumber: z
      .string()
      .trim()
      .min(1, "Phone number is required")
      .regex(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number"),
    address: z
      .string()
      .trim()
      .min(1, "Address is required")
      .min(5, "Address is too short"),
    position: z.nativeEnum(StaffPositionValues, { message: "Position is required" }),
    gender: z.string().min(1, "Gender is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type Errors = Partial<
  Record<
    | "firstName"
    | "lastName"
    | "email"
    | "password"
    | "confirmPassword"
    | "position"
    | "gender"
    | "phoneNumber"
    | "address",
    string
  >
>;

const STAFF_USER_KEY = "eventhub_staff_user";
const STAFF_PROFILE_KEY = "eventhub_staff_profile";
const STAFF_LOGGED_IN_KEY = "eventhub_staff_isLoggedIn";

export default function StaffRegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    position: "CHECKER" as StaffPosition,
    gender: "",
    phoneNumber: "",
    address: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const parseResult = staffRegisterSchema.safeParse(form);

    if (parseResult.success) {
      setErrors({});
      return true;
    }

    const fieldErrors = parseResult.error.flatten().fieldErrors as Record<string, string[]>;
    const e: Errors = {};

    for (const [key, messages] of Object.entries(fieldErrors)) {
      if (messages?.length) {
        e[key as keyof Errors] = messages[0];
      }
    }

    setErrors(e);
    return false;
  };

  // ✅ FIXED: Validate directly in handleSubmit - no separate result state
  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    
    // Validate and get result IMMEDIATELY
    const parseResult = staffRegisterSchema.safeParse(form);
    
    if (!parseResult.success) {
      // Show field errors
      const fieldErrors = parseResult.error.flatten().fieldErrors as Record<string, string[]>;
      const e: Errors = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages?.length) {
          e[key as keyof Errors] = messages[0];
        }
      }
      setErrors(e);
      return;
    }

    // ✅ parseResult.data is guaranteed valid here
    const validatedData = parseResult.data;
    
    setLoading(true);
    setErrors({});

    const id = Date.now().toString();

    const user: StaffUser = {
      id,
      role: "staff",
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      password: validatedData.password,
    };

    const profile: StaffProfile = {
      position: validatedData.position,
      gender: validatedData.gender,
      phoneNumber: validatedData.phoneNumber,
      address: validatedData.address,
    };

    localStorage.setItem(STAFF_USER_KEY, JSON.stringify(user));
    localStorage.setItem(STAFF_PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(STAFF_LOGGED_IN_KEY, "true");

    setLoading(false);
    router.push(`/staff/${id}`);
  };

  const inputClass = (field: keyof Errors) =>
    `w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
     focus:outline-none focus:ring-2 ${
       errors[field]
         ? "border border-red-500 focus:ring-red-500"
         : "border border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
     }`;

  const ErrorText = ({ field }: { field: keyof Errors }) =>
    errors[field] ? <p className="mt-1 text-xs text-red-600">{errors[field]}</p> : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">EventHub</h1>
          <p className="text-gray-600 dark:text-gray-400">Create staff account</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name *</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  className={inputClass("firstName")}
                  placeholder="Sample"
                />
                <ErrorText field="firstName" />
              </div>

              <div>
                <label className="text-sm font-medium">Last Name *</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  className={inputClass("lastName")}
                  placeholder="Sample"
                />
                <ErrorText field="lastName" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                className={inputClass("email")}
                placeholder="username@example.com"
              />
              <ErrorText field="email" />
            </div>

            <div>
              <label className="text-sm font-medium">Phone Number *</label>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={onChange}
                className={inputClass("phoneNumber")}
                placeholder="+8801XXXXXXXXX"
              />
              <ErrorText field="phoneNumber" />
            </div>

            <div>
              <label className="text-sm font-medium">Address *</label>
              <input
                name="address"
                value={form.address}
                onChange={onChange}
                className={inputClass("address")}
                placeholder="Street, Area, City"
              />
              <ErrorText field="address" />
            </div>

            <div>
              <label className="text-sm font-medium">Position *</label>
              <select
                name="position"
                value={form.position}
                onChange={onChange}
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
                value={form.gender}
                onChange={onChange}
                className={inputClass("gender")}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              <ErrorText field="gender" />
            </div>

            <div>
              <label className="text-sm font-medium">Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={onChange}
                className={inputClass("password")}
              />
              <ErrorText field="password" />
            </div>

            <div>
              <label className="text-sm font-medium">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={onChange}
                className={inputClass("confirmPassword")}
              />
              <ErrorText field="confirmPassword" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Staff Account"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm">
            Already staff?{" "}
            <Link href="/staff/login" className="text-indigo-600 hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-gray-500 hover:text-indigo-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
