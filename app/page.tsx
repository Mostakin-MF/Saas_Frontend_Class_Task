import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
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

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Manage Your Events{" "}
            <span className="text-indigo-600">Effortlessly</span>
          </h2>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Staff portal demo: register staff, sign in, and manage staff profiles.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/staff/register"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Create Staff Account
            </Link>

            <Link
              href="/staff/login"
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-50 dark:hover:bg-gray-800 transition font-semibold"
            >
              Staff Sign In
            </Link>

            {/* Optional demo link (only if you have /staff/[id] page) */}
            <Link
              href="/staff/1"
              className="px-8 py-3 border-2 border-gray-900 text-gray-900 dark:text-white dark:border-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition font-semibold"
            >
              Staff Profile (Demo)
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-gray-300 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; 2025 EventHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
