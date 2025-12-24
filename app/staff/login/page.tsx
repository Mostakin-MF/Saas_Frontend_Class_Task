"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";

type StaffUser = {
  id: string;
  role: "staff";
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type Errors = Partial<Record<"email" | "password", string>>;

const STAFF_USER_KEY = "eventhub_staff_user";
const STAFF_LOGGED_IN_KEY = "eventhub_staff_isLoggedIn";

// ✅ Zod schema replaces all manual validation
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export default function StaffLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  // ✅ Zod validation replaces manual validate()
  const validate = () => {
    const result = loginSchema.safeParse({ email, password });

    if (result.success) {
      setErrors({});
      return true;
    }

    // Convert Zod errors to Errors type
    const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
    const e: Errors = {};

    for (const [key, messages] of Object.entries(fieldErrors)) {
      if (messages?.length && (key === "email" || key === "password")) {
        e[key as keyof Errors] = messages[0];
      }
    }

    setErrors(e);
    return false;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // Zod already validated, use result.data (trimmed)
    const validatedData = loginSchema.parse({ email, password });

    const user = safeParse<StaffUser>(localStorage.getItem(STAFF_USER_KEY));
    if (!user) {
      setErrors({ email: "No staff account found. Please register first." });
      setLoading(false);
      return;
    }

    // ✅ Use validatedData.email (already trimmed by Zod)
    const ok = user.email === validatedData.email && user.password === validatedData.password;
    if (!ok) {
      setErrors({ password: "Invalid email or password" });
      setLoading(false);
      return;
    }

    localStorage.setItem(STAFF_LOGGED_IN_KEY, "true");
    setLoading(false);
    router.push(`/staff/${user.id}`);
  };

  const inputClass = (field: keyof Errors) =>
    `w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
     focus:outline-none focus:ring-2 ${
       errors[field]
         ? "border border-red-500 focus:ring-red-500"
         : "border border-gray-300 dark:border-gray-600 focus:ring-indigo-500"
     }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">EventHub</h1>
          <p className="text-gray-600 dark:text-gray-400">Staff sign in</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium">Email *</label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors((p) => ({ ...p, email: "" }));
                }}
                className={inputClass("email")}
                placeholder="staff@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Password *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((p) => ({ ...p, password: "" }));
                }}
                className={inputClass("password")}
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Signing in..." : "Sign In (Staff)"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              New staff?{" "}
              <Link href="/staff/register" className="text-indigo-600 hover:underline font-semibold">
                Register
              </Link>
            </p>
          </div>
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
