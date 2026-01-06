import { text } from "stream/consumers";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <h1 className="text-6xl font-bold text-red-800 mb-4">404</h1>
      <p className="text-xl text-gray-600">Attendee Not Found</p>
    </div>
  );
}   
