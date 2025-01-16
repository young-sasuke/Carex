'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const ManageEvents = () => {
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    organizerName: "",
    location: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    contactDesignation: "",
    freeOrPaid: "Free",
    category: "",
    interests: "",
    startDate: "",
    endDate: "",
    durationInDays: "",
    eligibility: "",
    prize: "",
    stream: "",
    description: "",
  });

  useEffect(() => {
    const checkUserRole = async () => {
      const storedRole = localStorage.getItem("userRole");
      const storedUserId = localStorage.getItem("userId");

      if (storedRole === "host") {
        await fetchHostEvents(storedUserId);
        setIsLoading(false);
      } else {
        router.push("/");
      }
    };

    const fetchHostEvents = async (hostId) => {
      try {
        const response = await fetch("/api/getHostEvents", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ hostId }),
        });

        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          console.error("Failed to fetch events:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    checkUserRole();
  }, [router]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreateEvent = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setFormData({
      name: "",
      organizerName: "",
      location: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      contactDesignation: "",
      freeOrPaid: "Free",
      category: "",
      interests: "",
      startDate: "",
      endDate: "",
      durationInDays: "",
      eligibility: "",
      prize: "",
      stream: "",
      description: "",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const eventData = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      durationInDays: parseInt(formData.durationInDays),
      hostId: Number(localStorage.getItem("userId")),
    };

    try {
      const response = await fetch("/api/createEvent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        const data = await response.json();
        setEvents((prevEvents) => [...prevEvents, data.event]);
        handleClosePopup();
      } else {
        console.error("Failed to create event:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const handleEventClick = (eventId : string) => {
    router.push(`/event/${eventId}`);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Manage Events</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={handleCreateEvent}
      >
        Create Event
      </button>

      {showPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
    <div className="bg-white p-6 rounded shadow-lg w-full max-w-md max-h-screen overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
      <form onSubmit={handleFormSubmit}>
        {[
          { label: "Event Name", name: "name", type: "text" },
          { label: "Organizer's Name", name: "organizerName", type: "text" },
          { label: "Location", name: "location", type: "text" },
          { label: "Contact Name", name: "contactName", type: "text" },
          { label: "Contact Phone", name: "contactPhone", type: "text" },
          { label: "Contact Email", name: "contactEmail", type: "email" },
          { label: "Contact Designation", name: "contactDesignation", type: "text" },
          { label: "Category", name: "category", type: "text" },
          { label: "Interests (comma-separated)", name: "interests", type: "text" },
          { label: "Start Date", name: "startDate", type: "date" },
          { label: "End Date", name: "endDate", type: "date" },
          { label: "Duration (in days)", name: "durationInDays", type: "number" },
          { label: "Eligibility", name: "eligibility", type: "text" },
          { label: "Prize Amount", name: "prize", type: "text" },
          { label: "Stream", name: "stream", type: "text" },
        ].map((field) => (
          <div className="mb-4" key={field.name}>
            <label className="block text-gray-700 font-medium mb-2">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        ))}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleClosePopup}
            className="mr-3 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => (
          <div key={event.id} className="border p-4 rounded shadow-m cursor-pointer"
            onClick={() => handleEventClick(event.id)}
          >
              <h3
              className="text-lg font-semibold cursor-pointer text-blue-500 hover:underline"
              onClick={() => handleEventClick(event.id)}
            > </h3>
            <p>{event.description}</p>
            <p><strong>Date:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEvents;
