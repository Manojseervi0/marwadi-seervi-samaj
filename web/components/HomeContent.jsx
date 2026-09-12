"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  FaHeart, FaGraduationCap, FaPrayingHands, FaComments,
  FaSearch, FaStar,
} from "react-icons/fa";

export default function HomeContent() {
  const router = useRouter();
  const { t } = useTranslation();
  const [memberSearch, setMemberSearch] = useState("");

  const handleMemberSearch = () => {
    if (memberSearch.trim()) {
      router.push(`/matrimony?search=${encodeURIComponent(memberSearch.trim())}`);
    }
  };

  const features = [
    { icon: FaHeart, title: t("homepage.matrimony_services"), description: t("homepage.matrimony_description"), color: "text-red-500", to: "/matrimony" },
    { icon: FaGraduationCap, title: t("homepage.career_guidance"), description: t("homepage.career_description"), color: "text-blue-500", to: "/career-help" },
    { icon: FaPrayingHands, title: t("homepage.religious_centers"), description: t("homepage.religious_description"), color: "text-orange-500", to: "/temples" },
    { icon: FaComments, title: t("homepage.community_forum"), description: t("homepage.forum_description"), color: "text-green-500", to: "/community-forum" },
  ];

  const stats = [
    { label: t("homepage.active_members"), value: "10,000+" },
    { label: t("homepage.successful_matches"), value: "2,500+" },
    { label: t("homepage.temples_listed"), value: "150+" },
    { label: t("homepage.career_mentors"), value: "200+" },
  ];

  const newsItems = [
    { title: "Samaj Annual Meet — Registrations Open", date: "Coming soon", excerpt: "Details about this year's annual gathering, venue and schedule will be announced shortly." },
    { title: "New Career Mentorship Program", date: "Coming soon", excerpt: "A structured mentorship initiative connecting samaj professionals with students." },
    { title: "Temple Renovation Fund Update", date: "Coming soon", excerpt: "Progress update on ongoing community-funded temple renovation work." },
  ];

  const team = [
    { name: "President", role: "Samaj President" },
    { name: "Secretary", role: "General Secretary" },
    { name: "Treasurer", role: "Finance & Treasury" },
    { name: "IT Coordinator", role: "Website & Tech" },
  ];

  const testimonials = [
    { text: t("homepage.testimonial_text"), name: t("homepage.community_member") },
    { text: "Found genuine job leads through the career section — very helpful for freshers.", name: "Community Member" },
    { text: "The temple directory helped us plan our family visit while travelling.", name: "Community Member" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      {/* Top announcement strip */}
      <div className="bg-orange-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-sm text-center font-medium">
            📢 Samaj ki agli meeting: details coming soon — stay tuned!
          </p>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 flex flex-col items-center md:items-start gap-6 text-center md:text-left">
              <h1 className="text-4xl font-bold">{t("homepage.slide1_title")}</h1>
              <p className="text-xl opacity-95 max-w-lg">{t("homepage.slide1_subtitle")}</p>

              <div className="relative w-full max-w-md">
                <input
                  placeholder="Find Seervi Members by name..."
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMemberSearch()}
                  className="w-full h-12 rounded-md bg-white text-gray-800 pl-4 pr-16 outline-none"
                />
                <button
                  onClick={handleMemberSearch}
                  className="absolute right-1.5 top-1.5 h-9 px-3 bg-orange-500 hover:bg-orange-600 text-white rounded"
                >
                  <FaSearch />
                </button>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push("/community-forum")}
                  className="text-base font-medium bg-white/90 hover:bg-white text-orange-700 rounded-md px-6 py-3"
                >
                  {t("homepage.explore_community")}
                </button>
                <button
                  onClick={() => router.push("/signup")}
                  className="text-base font-medium border border-white text-white rounded-md px-6 py-3"
                >
                  {t("homepage.get_started")}
                </button>
              </div>
            </div>

            <div className="hidden md:flex flex-1 justify-center items-center relative">
              <div className="absolute w-[380px] h-[380px] rounded-full bg-white/20 blur-xl" />
              <img
                src="/logo-icon.png"
                alt="Aai Mataji"
                className="max-w-[360px] rounded-full relative border-[6px] border-white/50"
                style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <h3 className="text-4xl font-bold text-orange-500 mb-2">{stat.value}</h3>
                <p className="text-orange-600 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Community News */}
      <div className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-2">Samaj News & Announcements</h2>
            <p className="text-orange-600">Latest updates from the community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {newsItems.map((item, idx) => (
              <div key={idx} className="bg-white shadow-md rounded-xl border-2 border-orange-200 p-6">
                <span className="inline-block text-xs font-semibold bg-orange-100 text-orange-800 rounded px-2 py-1 mb-3">
                  {item.date}
                </span>
                <h3 className="text-lg font-bold text-orange-800 mb-2">{item.title}</h3>
                <p className="text-orange-600 text-sm">{item.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-4">{t("homepage.our_services")}</h2>
            <p className="text-lg text-orange-600 max-w-2xl">{t("homepage.services_subtitle")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                onClick={() => router.push(feature.to)}
                className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6 text-center cursor-pointer
                  transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <feature.icon className={`mx-auto mb-4 ${feature.color}`} size={48} />
                <h3 className="text-lg font-bold mb-3 text-orange-800">{feature.title}</h3>
                <p className="text-orange-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-12">
          <h2 className="text-3xl font-bold text-orange-800">{t("homepage.testimonials_title")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, idx) => (
              <div key={idx} className="bg-white shadow-lg rounded-xl border-2 border-orange-200 p-6">
                <div className="flex mb-4 gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar key={star} className="text-yellow-400" />
                  ))}
                </div>
                <p className="mb-4 italic text-orange-700">&quot;{item.text}&quot;</p>
                <p className="font-bold text-orange-700">- {item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Committee / Team */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-orange-800 mb-2">Samaj Committee</h2>
            <p className="text-orange-600">People behind the community</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div key={idx} className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-orange-400 text-white flex items-center justify-center text-xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <p className="font-bold text-orange-800">{member.name}</p>
                <p className="text-sm text-orange-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold">{t("homepage.cta_title")}</h2>
          <p className="text-lg max-w-2xl">{t("homepage.cta_subtitle")}</p>
          <button
            onClick={() => router.push("/signup")}
            className="text-base font-medium bg-white/90 hover:bg-white text-orange-700 rounded-md px-6 py-3"
          >
            {t("homepage.get_started")}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t-2 border-orange-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-orange-600 text-sm text-center font-medium">
            © 2026 Marwadi Seervi Samaj. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
