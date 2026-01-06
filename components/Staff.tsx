import Link from "next/link";

export default function Staff() {
  return (
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


    )
}