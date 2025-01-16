import Link from "next/link";

export default function SearchBanner() {
  return (
    <div className="bg-gradient-to-r from-blue-400 to-green-400 p-10 rounded-md text-center text-white">
      <h2 className="text-3xl font-bold">Explore Your Future Career</h2>
      <p>Discover opportunities that match your passion and skills</p>
      <div className="mt-6">
        <Link href="/Explore">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-8 py-3 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
            Explore Events
          </button>
        </Link>
      </div>
    </div>
  );
}

  