"use client";

interface RoleSelectorProps {
  selectedRole: "attendee" | "staff";
  onRoleChange: (role: "attendee" | "staff") => void;
}

export default function RoleSelector({
  selectedRole,
  onRoleChange,
}: RoleSelectorProps) {
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
        Register as:
      </label>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onRoleChange("attendee")}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
            selectedRole === "attendee"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Attendee
        </button>
        <button
          type="button"
          onClick={() => onRoleChange("staff")}
          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition ${
            selectedRole === "staff"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          Staff
        </button>
      </div>
    </div>
  );
}
