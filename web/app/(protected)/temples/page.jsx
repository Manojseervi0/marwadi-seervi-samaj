"use client";

import { useEffect, useState } from "react";
import {
  FaSearch, FaMapMarkerAlt, FaClock, FaPhone, FaGlobe, FaStar, FaPrayingHands, FaPlus, FaTimes,
} from "react-icons/fa";
import { useToast } from "@/lib/toast-context";

const initialTemples = [
  { id: "mock-1", name: "Shri Swaminarayan Mandir", type: "Swaminarayan Temple", city: "Mumbai", address: "Bandra West, Mumbai, Maharashtra", description: "A beautiful temple dedicated to Lord Swaminarayan with intricate architecture and peaceful atmosphere.", image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", rating: 4.8, reviews: 156, timings: "5:00 AM - 9:00 PM", phone: "+91 22 2640 1234", website: "www.swaminarayanmumbai.org", features: ["Aarti", "Prasad", "Parking", "Library"], specialDays: ["Ekadashi", "Purnima", "Janmashtami"] },
  { id: "mock-2", name: "Shri Krishna Mandir", type: "Krishna Temple", city: "Ahmedabad", address: "Navrangpura, Ahmedabad, Gujarat", description: "Ancient temple with spiritual significance and regular bhajan sessions.", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", rating: 4.6, reviews: 89, timings: "6:00 AM - 8:00 PM", phone: "+91 79 2640 5678", website: "www.krishnamandir.org", features: ["Bhajan", "Prasad", "Garden", "Meditation"], specialDays: ["Krishna Janmashtami", "Radha Ashtami", "Govardhan Puja"] },
  { id: "mock-3", name: "Shri Hanuman Mandir", type: "Hanuman Temple", city: "Delhi", address: "Connaught Place, New Delhi", description: "Famous Hanuman temple known for its spiritual energy and Tuesday special prayers.", image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", rating: 4.7, reviews: 234, timings: "4:00 AM - 10:00 PM", phone: "+91 11 2345 6789", website: "www.hanumanmandir.org", features: ["Tuesday Special", "Prasad", "Parking", "Canteen"], specialDays: ["Hanuman Jayanti", "Mangalvar", "Purnima"] },
  { id: "mock-4", name: "Shri Ganesh Mandir", type: "Ganesh Temple", city: "Pune", address: "Koregaon Park, Pune, Maharashtra", description: "Peaceful Ganesh temple with beautiful architecture and regular cultural programs.", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", rating: 4.5, reviews: 67, timings: "5:30 AM - 9:30 PM", phone: "+91 20 2640 9012", website: "www.ganeshmandir.org", features: ["Aarti", "Prasad", "Library", "Cultural Events"], specialDays: ["Ganesh Chaturthi", "Sankashti", "Angarki"] },
];

const cities = ["Mumbai", "Delhi", "Ahmedabad", "Pune", "Bangalore", "Chennai"];
const templeTypes = ["Swaminarayan Temple", "Krishna Temple", "Hanuman Temple", "Ganesh Temple", "All Temples"];

const events = [
  { title: "Krishna Janmashtami", date: "August 26, 2024", temple: "Shri Krishna Mandir", description: "Celebration of Lord Krishna's birth with special prayers and cultural programs" },
  { title: "Ganesh Chaturthi", date: "September 7, 2024", temple: "Shri Ganesh Mandir", description: "Installation and worship of Lord Ganesh with traditional rituals" },
  { title: "Hanuman Jayanti", date: "April 23, 2024", temple: "Shri Hanuman Mandir", description: "Birth celebration of Lord Hanuman with special prayers and bhajans" },
];

export default function TempleDetailsPage() {
  const [temples, setTemples] = useState(initialTemples);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [newTemple, setNewTemple] = useState({
    name: "", city: "", type: "Krishna Temple", address: "", description: "",
    timings: "6:00 AM - 8:00 PM", phone: "", website: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    setIsAdmin(localStorage.getItem("userRole") === "admin");
    fetchTemples();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTemples = async (params = {}) => {
    try {
      setIsLoading(true);
      const query = new URLSearchParams();
      if (params.city) query.append("city", params.city);
      if (params.type && params.type !== "All Temples") query.append("type", params.type);
      if (params.search) query.append("search", params.search);

      const url = `${apiUrl}/api/temples${query.toString() ? `?${query.toString()}` : ""}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.temples && data.temples.length > 0) {
          setTemples(data.temples);
          return;
        }
      }
      let filtered = [...initialTemples];
      if (params.search) {
        filtered = filtered.filter((t) => t.name.toLowerCase().includes(params.search.toLowerCase()));
      }
      if (params.city) {
        filtered = filtered.filter((t) => t.city.toLowerCase() === params.city.toLowerCase());
      }
      if (params.type && params.type !== "All Temples") {
        filtered = filtered.filter((t) => t.type.toLowerCase().includes(params.type.toLowerCase()));
      }
      setTemples(filtered);
    } catch (err) {
      console.warn("Using local temples fallback:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchTemples({ search: searchTerm, city: selectedCity, type: selectedType });
  };

  const handleAddTemple = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({ title: "Authentication Required", description: "Please log in as an administrator to add temples", status: "warning", duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiUrl}/api/temples`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...newTemple,
          image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          features: ["Aarti", "Prasad", "Parking"],
          specialDays: ["Purnima", "Ekadashi"],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add temple");

      toast({ title: "Temple Added!", description: "New temple listed successfully.", status: "success", duration: 3000 });
      setTemples((prev) => [data.temple, ...prev]);
      setIsOpen(false);
      setNewTemple({ name: "", city: "", type: "Krishna Temple", address: "", description: "", timings: "6:00 AM - 8:00 PM", phone: "", website: "" });
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error", duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContact = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      toast({ title: "Contact Information", description: "Phone number not available", status: "info", duration: 2000 });
    }
  };

  const handleVisit = (website) => {
    if (!website) {
      toast({ title: "Website", description: "No official website link available", status: "info", duration: 2000 });
      return;
    }
    const url = website.startsWith("http://") || website.startsWith("https://") ? website : `https://${website}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold">Religious Centers & Temples</h1>
          <p className="text-xl max-w-2xl">
            Discover sacred places, temples, and spiritual centers within our community. Find peace, guidance, and connect with your faith.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById("temples-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base font-medium bg-white/90 hover:bg-white text-orange-700 rounded-md px-6 py-3"
            >
              Find Temples
            </button>
            <button
              onClick={() => document.getElementById("events-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base font-medium border border-white text-white rounded-md px-6 py-3"
            >
              Events Calendar
            </button>
            {isAdmin && (
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-base font-medium bg-orange-500 hover:bg-orange-400 border border-white/40 rounded-md px-6 py-3"
              >
                <FaPlus /> Add Temple
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6">
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Find Religious Centers</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="mb-2 font-medium text-orange-700">Search by Name</p>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input
                    placeholder="Enter temple name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 font-medium text-orange-700">City</p>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 font-medium text-orange-700">Temple Type</p>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select type</option>
                  {templeTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="mt-6 w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium flex items-center justify-center gap-2"
            >
              <FaSearch /> {isLoading ? "Searching..." : "Search Temples"}
            </button>
          </div>
        </div>
      </div>

      {/* Temples Section */}
      <div id="temples-section" className="py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">Featured Religious Centers</h2>
            <p className="text-orange-600">Discover sacred places and spiritual centers in your area</p>
          </div>

          {isLoading ? (
            <div className="my-8 h-10 w-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          ) : temples.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-orange-700">No temples found matching your filter criteria.</p>
              <button
                onClick={() => fetchTemples()}
                className="mt-4 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-4 py-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-8 w-full">
              {temples.map((temple) => {
                const keyId = temple._id || temple.id;
                return (
                  <div key={keyId} className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={temple.image || "https://images.unsplash.com/photo-1542810634-71277d95dcbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
                        alt={temple.name}
                        className="rounded-lg w-full h-[220px] object-cover"
                      />

                      <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="text-2xl font-bold text-orange-800">{temple.name}</h3>
                            <p className="text-orange-600">{temple.type}</p>
                          </div>
                          <span className="text-xs font-semibold bg-orange-100 text-orange-800 rounded px-2 py-1 whitespace-nowrap">
                            {temple.city}
                          </span>
                        </div>

                        <p className="text-orange-600">{temple.description}</p>

                        <div className="flex flex-wrap gap-6">
                          {temple.rating ? (
                            <span className="flex items-center gap-1.5">
                              <FaStar className="text-yellow-400" />
                              <span className="font-bold">{temple.rating}</span>
                              {temple.reviews && <span className="text-orange-600">({temple.reviews} reviews)</span>}
                            </span>
                          ) : null}
                          {temple.timings && (
                            <span className="flex items-center gap-2 text-orange-700">
                              <FaClock className="text-orange-500" /> {temple.timings}
                            </span>
                          )}
                        </div>

                        {temple.address && (
                          <span className="flex items-center gap-2 text-orange-700">
                            <FaMapMarkerAlt className="text-red-500" /> {temple.address}
                          </span>
                        )}

                        {temple.features && temple.features.length > 0 && (
                          <div>
                            <p className="font-medium mb-2 text-orange-700">Features</p>
                            <div className="flex flex-wrap gap-2">
                              {temple.features.map((feature, idx) => (
                                <span key={idx} className="text-xs bg-orange-100 text-orange-700 rounded px-2 py-1">{feature}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        {temple.specialDays && temple.specialDays.length > 0 && (
                          <div>
                            <p className="font-medium mb-2 text-orange-700">Special Days</p>
                            <div className="flex flex-wrap gap-2">
                              {temple.specialDays.map((day, idx) => (
                                <span key={idx} className="text-xs bg-green-100 text-green-700 rounded px-2 py-1">{day}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-4 pt-2">
                          {temple.phone && (
                            <button
                              onClick={() => handleContact(temple.phone)}
                              className="flex items-center gap-2 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-4 py-2 text-sm"
                            >
                              <FaPhone /> Contact
                            </button>
                          )}
                          {temple.website && (
                            <button
                              onClick={() => handleVisit(temple.website)}
                              className="flex items-center gap-2 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-4 py-2 text-sm"
                            >
                              <FaGlobe /> Website
                            </button>
                          )}
                          <button
                            onClick={() => toast({ title: temple.name, description: `Address: ${temple.address || temple.city}`, status: "info", duration: 3000 })}
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md px-4 py-2 text-sm"
                          >
                            <FaPrayingHands /> Visit Temple
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Events Section */}
      <div id="events-section" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">Upcoming Religious Events</h2>
            <p className="text-lg text-orange-600 max-w-2xl">Stay updated with religious events, festivals, and special ceremonies</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <div key={index} className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6 flex flex-col gap-4">
                <span className="inline-block w-fit text-xs font-semibold bg-orange-100 text-orange-800 rounded px-2 py-1">{event.date}</span>
                <h3 className="text-lg font-bold text-orange-800">{event.title}</h3>
                <p className="text-sm text-orange-600">{event.temple}</p>
                <p className="text-orange-600">{event.description}</p>
                <button
                  onClick={() => toast({ title: event.title, description: `${event.description} at ${event.temple} on ${event.date}`, status: "info", duration: 4000 })}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 text-sm font-medium"
                >
                  Event Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Temple Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-2">
              <h2 className="text-xl font-bold text-orange-800">Add Temple / Religious Center</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 pt-2">
              <form onSubmit={handleAddTemple}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Temple Name</label>
                    <input
                      required
                      placeholder="e.g. Shri Aai Mataji Mandir"
                      value={newTemple.name}
                      onChange={(e) => setNewTemple({ ...newTemple, name: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">City</label>
                    <input
                      required
                      placeholder="e.g. Jodhpur, Rajasthan"
                      value={newTemple.city}
                      onChange={(e) => setNewTemple({ ...newTemple, city: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Temple Type</label>
                    <input
                      placeholder="e.g. Aai Mataji Temple"
                      value={newTemple.type}
                      onChange={(e) => setNewTemple({ ...newTemple, type: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Address</label>
                    <input
                      placeholder="Street / Area address"
                      value={newTemple.address}
                      onChange={(e) => setNewTemple({ ...newTemple, address: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Timings</label>
                    <input
                      placeholder="e.g. 5:30 AM - 9:00 PM"
                      value={newTemple.timings}
                      onChange={(e) => setNewTemple({ ...newTemple, timings: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Phone Number</label>
                    <input
                      placeholder="+91..."
                      value={newTemple.phone}
                      onChange={(e) => setNewTemple({ ...newTemple, phone: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Website</label>
                    <input
                      placeholder="https://..."
                      value={newTemple.website}
                      onChange={(e) => setNewTemple({ ...newTemple, website: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium"
                  >
                    {isSubmitting ? "Saving..." : "Save Temple"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-white border-t-2 border-orange-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-orange-600 text-sm text-center font-medium">© 2024 Marwadi Seervi Samaj. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
