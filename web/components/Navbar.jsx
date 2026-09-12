"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGlobe } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { isAuthenticated, email, logout } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === "hi" ? "en" : "hi";
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("registeredEmail");
    localStorage.removeItem("userRole");
    logout();
    router.push("/login");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/matrimony", label: "Matrimony" },
    { to: "/career-help", label: "Career Help" },
    { to: "/women-empowerment", label: "Women Empowerment" },
    { to: "/temples", label: "Temples" },
    { to: "/community-forum", label: "Community Forum" },
  ];

  return (
    <div
      className="sticky top-0 z-[100] bg-white border-b border-orange-100 px-4 md:px-8 py-2"
      style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center flex-wrap gap-4">
        {/* Logo — far left */}
        <Link href="/" className="hover:no-underline">
          <img
            src="/logo-full.png"
            alt="Marwadi Seervi Samaj"
            className="h-[38px] md:h-[48px] w-auto object-contain"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              e.currentTarget.nextSibling.style.display = "block";
            }}
          />
          <span className="hidden text-xl font-bold text-orange-700">
            Marwadi Seervi Samaj
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex flex-wrap gap-7 ml-2 md:ml-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className="relative text-sm font-semibold text-gray-700 hover:no-underline hover:text-orange-600
                after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-0
                after:bg-orange-500 after:transition-[width] after:duration-200 hover:after:w-full"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex-1" />

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 text-sm font-medium text-orange-700 hover:bg-orange-50 rounded-md px-3 py-1.5"
          >
            <FaGlobe />
            {i18n.language === "hi" ? "EN" : "हिं"}
          </button>

          {isAuthenticated ? (
            <>
              <span className="hidden md:block text-sm text-gray-600">{email}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-orange-600 border border-orange-500 hover:bg-orange-50 rounded-full px-5 py-1.5"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-gray-700">
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-full px-5 py-1.5"
                style={{ boxShadow: "0 2px 8px rgba(234,88,12,0.3)" }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}