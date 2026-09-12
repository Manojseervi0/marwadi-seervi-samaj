"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaSearch, FaHeart, FaUser, FaMapMarkerAlt, FaGraduationCap, FaBriefcase, FaPlus, FaTimes,
} from "react-icons/fa";
import { useToast } from "@/lib/toast-context";

const initialMockProfiles = [
  {
    id: "mock-1",
    name: "Priya Sharma",
    age: 25,
    location: "Mumbai, Maharashtra",
    education: "MBA - Finance",
    profession: "Financial Analyst",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    interests: ["Reading", "Travel", "Cooking"],
    family: "Marwadi Seervi Samaj",
    verified: true,
  },
  {
    id: "mock-2",
    name: "Meera Patel",
    age: 28,
    location: "Ahmedabad, Gujarat",
    education: "B.Tech - Computer Science",
    profession: "Software Engineer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    interests: ["Technology", "Music", "Yoga"],
    family: "Marwadi Seervi Samaj",
    verified: true,
  },
  {
    id: "mock-3",
    name: "Anjali Gupta",
    age: 26,
    location: "Delhi, NCR",
    education: "CA",
    profession: "Chartered Accountant",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    interests: ["Finance", "Dance", "Art"],
    family: "Marwadi Seervi Samaj",
    verified: true,
  },
  {
    id: "mock-4",
    name: "Riya Jain",
    age: 24,
    location: "Pune, Maharashtra",
    education: "M.Sc - Biotechnology",
    profession: "Research Scientist",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    interests: ["Science", "Photography", "Hiking"],
    family: "Marwadi Seervi Samaj",
    verified: false,
  },
];

function Avatar({ src, name, size = 48 }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div
      className="rounded-full bg-orange-400 text-white flex items-center justify-center font-bold"
      style={{ width: size, height: size }}
    >
      {name ? name.charAt(0) : "?"}
    </div>
  );
}

export default function MatrimonyPage() {
  const searchParams = useSearchParams();
  const [profiles, setProfiles] = useState(initialMockProfiles);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [newProfile, setNewProfile] = useState({
    name: "", age: "", location: "", education: "", profession: "",
    family: "Marwadi Seervi Samaj", interests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiUrl}/api/matrimony`);
      if (res.ok) {
        const data = await res.json();
        if (data.profiles && data.profiles.length > 0) {
          setProfiles(data.profiles);
        }
      }
    } catch (err) {
      console.warn("Using local profiles fallback:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchTerm(q);
      (async () => {
        try {
          setIsLoading(true);
          const res = await fetch(`${apiUrl}/api/matrimony/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: q }),
          });
          if (res.ok) {
            const data = await res.json();
            setProfiles(data.profiles || []);
          }
        } catch (err) {
          console.warn("Search-from-home failed:", err.message);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      fetchProfiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      let minAge = null;
      let maxAge = null;
      if (selectedAge) {
        const [min, max] = selectedAge.split("-");
        minAge = min;
        maxAge = max;
      }

      const res = await fetch(`${apiUrl}/api/matrimony/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: searchTerm || undefined,
          location: selectedLocation || undefined,
          minAge,
          maxAge,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setProfiles(data.profiles || []);
      } else {
        let filtered = [...initialMockProfiles];
        if (searchTerm) {
          filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        if (selectedLocation) {
          filtered = filtered.filter((p) => p.location.toLowerCase().includes(selectedLocation.toLowerCase()));
        }
        if (selectedAge) {
          const [min, max] = selectedAge.split("-").map(Number);
          filtered = filtered.filter((p) => p.age >= min && p.age <= max);
        }
        setProfiles(filtered);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a matrimony profile",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const interestsArray = newProfile.interests
        ? newProfile.interests.split(",").map((i) => i.trim())
        : [];
      const res = await fetch(`${apiUrl}/api/matrimony`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newProfile,
          age: Number(newProfile.age),
          interests: interestsArray,
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create profile");

      toast({ title: "Profile Created!", description: "Your matrimony profile is now listed.", status: "success", duration: 3000 });
      setProfiles((prev) => [data.profile, ...prev]);
      setIsOpen(false);
      setNewProfile({ name: "", age: "", location: "", education: "", profession: "", family: "Marwadi Seervi Samaj", interests: "" });
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error", duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConnect = () => {
    toast({ title: "Connection Request Sent!", description: "The family will be notified of your interest.", status: "success", duration: 3000 });
  };

  const handleShortlist = () => {
    toast({ title: "Added to Shortlist!", description: "Profile has been added to your shortlist.", status: "success", duration: 3000 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold">Find Your Perfect Life Partner</h1>
          <p className="text-xl max-w-2xl">
            Connect with families from the Marwadi Seervi Samaj community. Trusted matrimony services for a lifetime of happiness.
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 text-base font-medium bg-white/90 hover:bg-white text-orange-700 rounded-md px-6 py-3"
            >
              <FaPlus /> Create Profile
            </button>
            <button
              onClick={() => document.getElementById("profiles-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base font-medium border border-white text-white rounded-md px-6 py-3"
            >
              View Profiles
            </button>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6">
            <h2 className="text-2xl font-bold text-orange-800 mb-4">Search Profiles</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="mb-2 font-medium text-orange-700">Search by Name</p>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                  <input
                    placeholder="Enter name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full h-11 pl-9 pr-3 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 font-medium text-orange-700">Age Range</p>
                <select
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select age range</option>
                  <option value="20-25">20-25 years</option>
                  <option value="26-30">26-30 years</option>
                  <option value="31-35">31-35 years</option>
                  <option value="36-40">36-40 years</option>
                </select>
              </div>

              <div>
                <p className="mb-2 font-medium text-orange-700">Location</p>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full h-11 px-3 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select location</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="ahmedabad">Ahmedabad</option>
                  <option value="pune">Pune</option>
                  <option value="bangalore">Bangalore</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="mt-6 w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium flex items-center justify-center gap-2"
            >
              <FaSearch /> {isLoading ? "Searching..." : "Search Profiles"}
            </button>
          </div>
        </div>
      </div>

      {/* Profiles Section */}
      <div id="profiles-section" className="py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">Featured Profiles</h2>
            <p className="text-orange-600">Discover compatible profiles from our trusted community</p>
          </div>

          {isLoading ? (
            <div className="my-8 h-10 w-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          ) : profiles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-orange-700">No profiles found matching your search criteria.</p>
              <button
                onClick={fetchProfiles}
                className="mt-4 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md px-4 py-2"
              >
                Reset Search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {profiles.map((profile) => {
                const keyId = profile._id || profile.id;
                return (
                  <div key={keyId} className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar src={profile.image} name={profile.name} size={56} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-orange-800">{profile.name}</h3>
                          {profile.verified && (
                            <span className="text-xs font-semibold bg-green-100 text-green-800 rounded px-2 py-0.5">Verified</span>
                          )}
                        </div>
                        <p className="text-sm text-orange-600">{profile.age} years • {profile.location}</p>
                      </div>
                    </div>

                    <hr className="border-orange-200" />

                    <div className="flex flex-col gap-2">
                      {profile.education && (
                        <div className="flex items-center gap-2 text-orange-700">
                          <FaGraduationCap className="text-blue-500" /> {profile.education}
                        </div>
                      )}
                      {profile.profession && (
                        <div className="flex items-center gap-2 text-orange-700">
                          <FaBriefcase className="text-green-500" /> {profile.profession}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-orange-700">
                        <FaMapMarkerAlt className="text-orange-500" /> {profile.location}
                      </div>
                    </div>

                    {profile.interests && profile.interests.length > 0 && (
                      <div>
                        <p className="font-medium mb-2 text-orange-700">Interests</p>
                        <div className="flex flex-wrap gap-2">
                          {profile.interests.map((interest, idx) => (
                            <span key={idx} className="text-xs bg-orange-100 text-orange-700 rounded px-2 py-1">
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <hr className="border-orange-200" />

                    <div className="flex gap-4">
                      <button
                        onClick={() => handleShortlist(keyId)}
                        className="flex-1 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded-md py-2 text-sm font-medium"
                      >
                        Shortlist
                      </button>
                      <button
                        onClick={() => handleConnect(keyId)}
                        className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 text-sm font-medium"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12">
          <h2 className="text-3xl font-bold text-orange-800">Why Choose Our Matrimony Service?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: FaUser, title: "Verified Profiles", description: "All profiles are verified and authenticated for your safety" },
              { icon: FaHeart, title: "Community Focused", description: "Connect with families from the Marwadi Seervi Samaj community" },
              { icon: FaSearch, title: "Advanced Matching", description: "Smart algorithms to find your perfect life partner" },
            ].map((feature, index) => (
              <div key={index} className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6 text-center">
                <feature.icon className="mx-auto mb-4 text-orange-500" size={40} />
                <h3 className="text-lg font-bold mb-3 text-orange-800">{feature.title}</h3>
                <p className="text-orange-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Profile Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-2">
              <h2 className="text-xl font-bold text-orange-800">Create Matrimony Profile</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 pt-2">
              <form onSubmit={handleCreateProfile}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Full Name</label>
                    <input
                      required
                      placeholder="Enter full name"
                      value={newProfile.name}
                      onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Age</label>
                    <input
                      required
                      type="number"
                      placeholder="Age (e.g. 25)"
                      value={newProfile.age}
                      onChange={(e) => setNewProfile({ ...newProfile, age: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Location</label>
                    <input
                      required
                      placeholder="City, State"
                      value={newProfile.location}
                      onChange={(e) => setNewProfile({ ...newProfile, location: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Education</label>
                    <input
                      placeholder="e.g. B.Tech / MBA"
                      value={newProfile.education}
                      onChange={(e) => setNewProfile({ ...newProfile, education: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Profession</label>
                    <input
                      placeholder="e.g. Software Engineer"
                      value={newProfile.profession}
                      onChange={(e) => setNewProfile({ ...newProfile, profession: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Interests (comma separated)</label>
                    <input
                      placeholder="e.g. Reading, Travel, Music"
                      value={newProfile.interests}
                      onChange={(e) => setNewProfile({ ...newProfile, interests: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Profile"}
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
