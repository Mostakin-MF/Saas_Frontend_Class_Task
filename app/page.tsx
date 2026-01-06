import Footer from "@/components/Footer";
import Navigation from "@/components/Navigation";
import Staff from "@/components/Staff";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <Navigation />
      {/* Hero Section */}
      <Staff />

      {/* Footer */}
      <Footer />
    </div>
  );
}
