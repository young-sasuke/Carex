// app/explore/page.tsx

"use client";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Users, Eye, Clock, Heart, PlusCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const randRegisterd = Math.floor(Math.random() * 500)
const randImpression = Math.floor(Math.random() * 10000)

export default function Explore() {
  const [eventsData, setEventsData] = useState([]); // Store fetched data
  const [sortBy, setSortBy] = useState("prize");
  const [filterBy, setFilterBy] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { user } = useUser();
  const [wishlist, setWishlist] = useState(new Set());
  const [wishlistAnimation, setWishlistAnimation] = useState<number | null>(null);

  const handleWishlistToggle = (eventId: number) => {
    setWishlist((prev) => {
      const updated = new Set(prev);
      if (updated.has(eventId)) {
        updated.delete(eventId);
      } else {
        updated.add(eventId);
      }
      return updated;
    });

    // Trigger animation for this event 
    setWishlistAnimation(eventId);
    setTimeout(() => setWishlistAnimation(null), 300); // Reset animation state
  };


  
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/getEvents");
        const data = await response.json();
  
        // List of images in the same order as the events
        const images = [
          "/assets/agnitraya.jpg",
          "/assets/brainsprit.jpg",
          "/assets/eureka.jpg",
          "/assets/investibot.jpg",
          "/assets/kpi combat.jpg",
          "/assets/loreal.jpg",
          "/assets/swimming.jpg",
          "/assets/talent_park.jpg",
        ];
  
        // Assign images to events iteratively
        const eventsWithImages = data.map((event: any, index: number) => ({
          ...event,
          eventImage: images[index % images.length], // Cycle through images if events > images
        }));
  
        setEventsData(eventsWithImages);
        setSelectedEvent(eventsWithImages[0]); // Set the first event as default selected
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    }
  
    fetchEvents();
  }, []);


  const handleRegister = async (eventId: number) => {
    // Retrieve user data from localStorage
    console.log(`userId : ${localStorage.getItem("userId")}, role : ${localStorage.getItem("userRole")}`)
    // Ensure the userId and role are available
    if (!user) {
      alert("User not logged in.");
      return;
    }

    if (!localStorage.getItem("userId") || localStorage.getItem("userRole")){
      if (user?.primaryEmailAddress) {
        try {
          localStorage.removeItem("userRole");
          localStorage.removeItem("userId");

          const storedRole = localStorage.getItem("userRole");
          const storedUserId = localStorage.getItem("userId");

          if (storedRole && storedUserId) {
          } else {
            const response = await fetch("/api/getUserRole", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
            });

            if (response.ok) {
              const data = await response.json();
              const userRole = data.role.toLowerCase();
              localStorage.setItem("userRole", userRole);
              localStorage.setItem("userId", data.hostId);
              console.log(localStorage.getItem("userRole"));
              console.log(localStorage.getItem("userId"));
            } else {
              console.error("Failed to fetch user role:", response.statusText);
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      }
    }

    const userId = localStorage.getItem("userId")
    const role = localStorage.getItem("userRole")
    
    // Prepare registration data
    const registrationData = {
      userId: Number(userId),
      eventId,
      role,
    };
  
    try {
      const response = await fetch("/api/registerEvent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message); // Show success message
      } else {
        alert(data.message); // Show error message
      }
    } catch (error) {
      console.error("Error registering for event:", error);
      alert("An error occurred while registering.");
    }
  };
  const sortedEvents = [...eventsData].sort((a, b) => b[sortBy] - a[sortBy]);
  const filteredEvents =
    filterBy === "All" ? sortedEvents : sortedEvents.filter((event) => event.category.includes(filterBy));

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex space-x-4">
          <select
            className="p-2 border rounded"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="prize">Sort by Prize Money</option>
            <option value="registeredCount">Sort by Registered Count</option>
            <option value="start">Sort by Date</option>
          </select>

          <select
            className="p-2 border rounded"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="coding">coding</option>
            <option value="AI">AI</option>
            <option value="entreprenuship">entreprenuship</option>
            <option value="case competition">case competition</option>
            <option value="guitar">guitar</option>
            <option value="keyboard">keyboard</option>
            <option value="debate">debate</option>


          </select>
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-1/2">
          <div className="grid grid-cols-1 gap-8">
            {filteredEvents.map((event: any, index: number) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer ${
                  selectedEvent === event ? "border-l-4 border-blue-500" : ""
                }`}
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex">
                  <img src={event.eventImage || "https://via.placeholder.com/150"} alt={event.name} className="w-1/3 h-32 object-cover" />
                  <div className="p-4 w-2/3">
                    <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                    <p className="text-gray-600 mb-2">{event.organizerName || "Host Name"}</p>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={16} className="mr-1" />
                      {event.location}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 font-semibold">₹{Number(event.prize).toLocaleString()}</span>
                      {/*<div className="flex items-center text-gray-600">
                        <Users size={16} className="mr-1" />
                        {event.participants?.length || 0} Registered
                      </div>*/}
                      <div className="flex items-center text-gray-600">
                        <Clock size={16} className="mr-1" />
                        {new Date(event.startDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-100 p-2 flex flex-wrap gap-2">
                  {event.flags?.map((flag: string, flagIndex: number) => (
                    <span key={flagIndex} className="bg-white px-2 py-1 rounded text-sm">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2">
          {selectedEvent && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={selectedEvent.eventImage || "https://via.placeholder.com/150"} alt={selectedEvent.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-3xl font-bold mb-2">{selectedEvent.name}</h2>
                <p className="text-xl text-gray-600 mb-4">{selectedEvent.organizerName || "Host Name"}</p>
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full mr-2">
                    {selectedEvent.category || "Type"}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin size={18} className="mr-1" />
                    {selectedEvent.location}
                  </div>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <div className="text-3xl font-bold">₹{Number(selectedEvent.prize).toLocaleString()}</div>
                  <div className="flex space-x-2">
                  <button
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      wishlist.has(selectedEvent.id)
                        ? "bg-red-200"
                        : "bg-gray-200"
                    } transition-all duration-300 ${
                      wishlistAnimation === selectedEvent.id
                        ? "animate-pulse"
                        : ""
                    }`}
                    onClick={() => handleWishlistToggle(selectedEvent.id)}
                  >
                    <Heart
                      size={20}
                      className={`${
                        wishlist.has(selectedEvent.id)
                          ? "text-red-500"
                          : "text-gray-600"
                      }`}
                      fill={
                        wishlist.has(selectedEvent.id) ? "currentColor" : "none"
                      }
                    />
                  </button>
                    <button className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200">
                      <PlusCircle size={20} />
                    </button>
                  </div>
                </div>
                <button 
                  className="w-full bg-blue-500 text-white py-3 rounded-full text-lg font-semibold hover:bg-blue-600 transition duration-300 mb-6"
                  onClick={() => handleRegister(selectedEvent.id)}>
                  
                  Register
                </button>
                <div className="grid grid-cols-3 gap-4 text-center mb-6">
                  <div>
                    <p className="text-gray-600 flex items-center justify-center">
                      <Users className="mr-2" size={18} />
                      Registered
                    </p>
                    <p className="font-semibold">{randRegisterd}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 flex items-center justify-center">
                      <Calendar className="mr-2" size={18} />
                      Date
                    </p>
                    <p className="font-semibold">{new Date(selectedEvent.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 flex items-center justify-center">
                      <Eye className="mr-2" size={18} />
                      Impressions
                    </p>
                    <p className="font-semibold">{randImpression}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Duration</h3>
                  <p>{selectedEvent.durationInDays || "N/A"}</p>
                </div>
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">Eligibility</h3>
                  <p>{selectedEvent.eligibility}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
