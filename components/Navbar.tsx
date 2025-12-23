import Link from "next/link";
import { ReactNode } from "react";

interface NavbarProps {
  showAuth?: boolean;
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
}

export function Navbar({
  showAuth = true,
  isLoggedIn = false,
  userName = "",
  onLogout,
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          EventHub
        </Link>
        <div className="flex gap-4 items-center">
          {showAuth && !isLoggedIn && (
            <>
              <Link
                href="/auth/login"
                className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Register
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <span className="text-gray-700 dark:text-gray-300">{userName}</span>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
