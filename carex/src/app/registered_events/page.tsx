// app/events/ParticipatedEvents.tsx

"use client";
import { useEffect, useState } from "react";

type Event = {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  eligibility: string;
  prize: string;
  host: {
    email: string;
  };
};

export default function ParticipatedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    const userId = localStorage.getItem("userId");

    // Redirect if not a student or user ID is missing
    if (userRole !== "student" || !userId) {
      alert("Access restricted to students only.");
      return;
    }

    // Fetch participated events
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getParticipatedEvents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: Number(userId) }),
        });
        const data = await response.json();

        if (response.ok) {
          setEvents(data);
        } else {
          console.error("Failed to fetch events:", data.message);
        }
      } catch (error) {
        console.error("Error fetching participated events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">My Participated Events</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
              <p className="text-gray-600 mb-2">Host: {event.host.email}</p>
              <p className="text-gray-600 mb-2">
                Location: {event.location}
              </p>
              <p className="text-gray-600 mb-2">
                Date: {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-gray-600 mb-2">Prize: ₹{event.prize}</p>
              <p className="text-gray-600 mb-2">Eligibility: {event.eligibility}</p>
              <p className="text-gray-600 mb-4">{event.description}</p>
            </div>
          ))
        ) : (
          <p>No participated events found.</p>
        )}
      </div>
    </div>
  );
}
