import Link from "next/link";

export default function Navigation() {
  return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            EventHub
          </h1>

          {/* STAFF only */}
          <div className="flex gap-3 flex-wrap justify-end">
            <Link
              href="/staff/login"
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Staff Login
            </Link>

            <Link
              href="/staff/register"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Staff Register
            </Link>
          </div>
        </div>
      </nav>

    )
}
