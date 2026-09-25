"use client";

import { useEffect, useState } from "react";
import {
  FaGraduationCap, FaBriefcase, FaUsers, FaLightbulb, FaStar, FaMapMarkerAlt, FaPlus, FaTimes,
} from "react-icons/fa";
import { useToast } from "@/lib/toast-context";
import { useAuth } from "@/lib/auth-context";

const initialJobs = [
  { id: "mock-1", title: "Software Developer", company: "TechCorp India", location: "Mumbai, Maharashtra", salary: "₹8-12 LPA", type: "Full-time", experience: "2-4 years", skills: ["JavaScript", "React", "Node.js"], posted: "Recent" },
  { id: "mock-2", title: "Financial Analyst", company: "Global Finance Ltd", location: "Delhi, NCR", salary: "₹6-10 LPA", type: "Full-time", experience: "1-3 years", skills: ["Excel", "Financial Modeling", "SQL"], posted: "Recent" },
  { id: "mock-3", title: "Marketing Manager", company: "Digital Solutions", location: "Bangalore, Karnataka", salary: "₹7-11 LPA", type: "Full-time", experience: "3-5 years", skills: ["Digital Marketing", "SEO", "Analytics"], posted: "Recent" },
];

const careerFields = [
  { id: "technology", name: "Technology", icon: FaLightbulb, color: "text-blue-500", salaryColor: "text-blue-600", opportunities: 150, avgSalary: "₹8-15 LPA" },
  { id: "finance", name: "Finance & Banking", icon: FaBriefcase, color: "text-green-500", salaryColor: "text-green-600", opportunities: 120, avgSalary: "₹6-12 LPA" },
  { id: "healthcare", name: "Healthcare", icon: FaUsers, color: "text-red-500", salaryColor: "text-red-600", opportunities: 80, avgSalary: "₹5-10 LPA" },
  { id: "education", name: "Education", icon: FaGraduationCap, color: "text-purple-500", salaryColor: "text-purple-600", opportunities: 60, avgSalary: "₹4-8 LPA" },
];

const mentors = [
  { id: 1, name: "Rajesh Kumar", role: "Senior Software Engineer", company: "Google", experience: "8 years", expertise: ["React", "Node.js", "AWS"], rating: 4.8, sessions: 45, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: 2, name: "Priya Sharma", role: "Financial Analyst", company: "Morgan Stanley", experience: "6 years", expertise: ["Investment Banking", "Financial Modeling", "Excel"], rating: 4.9, sessions: 32, image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
  { id: 3, name: "Amit Patel", role: "Product Manager", company: "Amazon", experience: "7 years", expertise: ["Product Strategy", "Agile", "Data Analysis"], rating: 4.7, sessions: 28, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
];

export default function CareerHelpPage() {
  const { isAuthenticated } = useAuth();
  const [jobOpportunities, setJobOpportunities] = useState(initialJobs);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [newJob, setNewJob] = useState({
    title: "", company: "", location: "", salary: "", type: "Full-time", experience: "", skills: "", description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${apiUrl}/api/career`);
      if (res.ok) {
        const data = await res.json();
        if (data.opportunities && data.opportunities.length > 0) {
          setJobOpportunities(data.opportunities);
        }
      }
    } catch (err) {
      console.warn("Using local jobs fallback:", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast({ title: "Authentication Required", description: "Please log in to post a career opportunity", status: "warning", duration: 3000 });
      return;
    }

    setIsSubmitting(true);
    try {
      const skillsArray = newJob.skills ? newJob.skills.split(",").map((s) => s.trim()) : [];
      const res = await fetch(`${apiUrl}/api/career`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...newJob, skills: skillsArray }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to post job");

      toast({ title: "Opportunity Posted!", description: "Your career opportunity has been published.", status: "success", duration: 3000 });
      setJobOpportunities((prev) => [data.opportunity, ...prev]);
      setIsOpen(false);
      setNewJob({ title: "", company: "", location: "", salary: "", type: "Full-time", experience: "", skills: "", description: "" });
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error", duration: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBookSession = () => {
    toast({ title: "Session Booked!", description: "The mentor will contact you within 24 hours.", status: "success", duration: 3000 });
  };

  const handleApplyJob = () => {
    toast({ title: "Application Submitted!", description: "Your application has been sent to the employer.", status: "success", duration: 3000 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold">Career Aspiration & Guidance</h1>
          <p className="text-xl max-w-2xl">
            Get expert career guidance, connect with mentors, and discover job opportunities tailored for our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById("mentors-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base font-medium bg-white/90 hover:bg-white text-orange-700 rounded-md px-6 py-3"
            >
              Find a Mentor
            </button>
            <button
              onClick={() => document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" })}
              className="text-base font-medium border border-white text-white rounded-md px-6 py-3"
            >
              Browse Jobs
            </button>
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 text-base font-medium bg-orange-500 hover:bg-orange-400 border border-white/40 rounded-md px-6 py-3"
            >
              <FaPlus /> Post Job
            </button>
          </div>
        </div>
      </div>

      {/* Career Fields Section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">Popular Career Fields</h2>
            <p className="text-lg text-orange-600 max-w-2xl">Explore trending career opportunities and get insights into different industries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
            {careerFields.map((field) => (
              <div key={field.id} className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6 text-center">
                <field.icon className={`mx-auto mb-4 ${field.color}`} size={48} />
                <h3 className="text-lg font-bold mb-3 text-orange-800">{field.name}</h3>
                <div className="flex flex-col gap-2">
                  <p className="text-orange-600">{field.opportunities} opportunities</p>
                  <p className={`font-bold ${field.salaryColor}`}>{field.avgSalary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mentors Section */}
      <div id="mentors-section" className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">Expert Mentors</h2>
            <p className="text-lg text-orange-600 max-w-2xl">Connect with experienced professionals from our community for personalized career guidance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={mentor.image} alt={mentor.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <h3 className="text-lg font-bold text-orange-800">{mentor.name}</h3>
                    <p className="text-sm text-orange-600">{mentor.role} at {mentor.company}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400" />
                  <span className="font-bold">{mentor.rating}</span>
                  <span className="text-orange-600">({mentor.sessions} sessions)</span>
                </div>

                <div>
                  <p className="font-medium mb-2 text-orange-700">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((skill) => (
                      <span key={skill} className="text-xs bg-orange-100 text-orange-700 rounded px-2 py-1">{skill}</span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBookSession}
                  className="w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 text-white font-medium transition-transform hover:-translate-y-0.5"
                >
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Opportunities Section */}
      <div id="jobs-section" className="py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">Latest Job Opportunities</h2>
            <p className="text-lg text-orange-600 max-w-2xl">Discover job openings from companies that value our community</p>
          </div>

          {isLoading ? (
            <div className="h-10 w-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
          ) : (
            <div className="flex flex-col gap-6 w-full">
              {jobOpportunities.map((job) => {
                const keyId = job._id || job.id;
                return (
                  <div key={keyId} className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6 w-full flex flex-col gap-4">
                    <div className="flex justify-between items-start w-full gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-orange-800">{job.title}</h3>
                        <p className="text-orange-600">{job.company}</p>
                      </div>
                      <span className="text-xs font-semibold bg-green-100 text-green-800 rounded px-2 py-1 whitespace-nowrap">
                        {job.type || "Full-time"}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-6">
                      {job.location && (
                        <span className="flex items-center gap-2 text-orange-700">
                          <FaMapMarkerAlt className="text-orange-500" /> {job.location}
                        </span>
                      )}
                      {job.salary && <span className="font-bold text-green-600">{job.salary}</span>}
                      {job.experience && <span className="text-orange-600">{job.experience} experience</span>}
                    </div>

                    {job.description && <p className="text-gray-600 text-sm">{job.description}</p>}

                    {job.skills && job.skills.length > 0 && (
                      <div>
                        <p className="font-medium mb-2 text-orange-700">Required Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, idx) => (
                            <span key={idx} className="text-xs bg-orange-100 text-orange-700 rounded px-2 py-1">{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end w-full">
                      <button
                        onClick={handleApplyJob}
                        className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-md px-4 py-2"
                      >
                        Apply Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Post Job Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 pb-2">
              <h2 className="text-xl font-bold text-orange-800">Post Career Opportunity</h2>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
                <FaTimes />
              </button>
            </div>
            <div className="p-6 pt-2">
              <form onSubmit={handlePostJob}>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Job Title</label>
                    <input
                      required
                      placeholder="e.g. Senior Frontend Developer"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Company Name</label>
                    <input
                      required
                      placeholder="e.g. Acme Innovations"
                      value={newJob.company}
                      onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Location</label>
                    <input
                      placeholder="e.g. Mumbai, Maharashtra (or Remote)"
                      value={newJob.location}
                      onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Salary Range</label>
                    <input
                      placeholder="e.g. ₹8-12 LPA"
                      value={newJob.salary}
                      onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Required Skills (comma separated)</label>
                    <input
                      placeholder="e.g. React, Node.js, TypeScript"
                      value={newJob.skills}
                      onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                      className="w-full h-11 px-3 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block mb-1.5 text-sm font-medium">Description</label>
                    <textarea
                      placeholder="Job responsibilities and qualifications..."
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium"
                  >
                    {isSubmitting ? "Publishing..." : "Publish Opportunity"}
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
