'use client';

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const EventDetails = ({ params }: { params: { id: string } }) => {
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  // Redirect to homepage if user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user]);

  // Fetch event details
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/getEventDetails?id=${params.id}`);
        if (response.ok) {
          const data = await response.json();
          console.log(data)
          setEvent(data.event);
        } else {
          console.error("Failed to fetch event details");
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventDetails();
  }, [params.id]);

  // Show loading state
  if (isLoading) {
    return <p>Loading event details...</p>;
  }

  // Show error if event not found
  if (!event) {
    return <p>Event not found.</p>;
  }

  // Render event details
  return (
    <div className="p-5">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto">
    <h1 className="text-4xl font-bold text-blue-600 mb-6 text-center">{event.name}</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <p>
        <strong className="text-gray-700">Organizer:</strong> {event.organizerName}
      </p>
      <p>
        <strong className="text-gray-700">Location:</strong> {event.location}
      </p>
      <p>
        <strong className="text-gray-700">Contact Name:</strong> {event.contactName}
      </p>
      <p>
        <strong className="text-gray-700">Contact Phone:</strong> {event.contactPhone}
      </p>
      <p>
        <strong className="text-gray-700">Contact Email:</strong> {event.contactEmail}
      </p>
      <p>
        <strong className="text-gray-700">Contact Designation:</strong> {event.contactDesignation}
      </p>
      <p>
        <strong className="text-gray-700">Category:</strong> {event.category}
      </p>
      <p>
        <strong className="text-gray-700">Free or Paid:</strong> {event.freeOrPaid}
      </p>
      <p>
        <strong className="text-gray-700">Interests:</strong> {event.interests}
      </p>
      <p>
        <strong className="text-gray-700">Start Date:</strong> {new Date(event.startDate).toLocaleDateString()}
      </p>
      <p>
        <strong className="text-gray-700">End Date:</strong> {new Date(event.endDate).toLocaleDateString()}
      </p>
      <p>
        <strong className="text-gray-700">Duration (Days):</strong> {event.durationInDays}
      </p>
      <p>
        <strong className="text-gray-700">Eligibility:</strong> {event.eligibility}
      </p>
      <p>
        <strong className="text-gray-700">Prize:</strong> {event.prize}
      </p>
      <p>
        <strong className="text-gray-700">Stream:</strong> {event.stream}
      </p>
  </div>
  <div className="mt-6">
    <p className="text-lg">
      <strong className="text-gray-700">Description:</strong>
      <span className="text-gray-600 block mt-2">{event.description}</span>
    </p>
  </div>
</div>


      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Participants</h2>
        {event.participants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {event.participants.map((participant) => (
              <div key={participant.id} className="border p-4 rounded shadow-md">
                <p><strong>Username:</strong> {participant.data.username || "N/A"}</p>
                <p><strong>Age:</strong> {participant.data.age || "N/A"}</p>
                <p><strong>Grade:</strong> {participant.data.grade || "N/A"}</p>
                <p><strong>Stream:</strong> {participant.data.stream || "N/A"}</p>
                <p><strong>School Name:</strong> {participant.data.schoolName || "N/A"}</p>
                {participant.data.preferences && (
                  <div>
                    <p><strong>Preferences:</strong></p>
                    <p>- Location: {participant.data.preferences.location || "N/A"}</p>
                    <p>- Free or Paid: {participant.data.preferences.freeOrPaid || "N/A"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No participants have registered for this event yet.</p>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
