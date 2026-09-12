"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [email, setEmail] = useState(null);

  useEffect(() => {
    setEmail(localStorage.getItem("registeredEmail"));
  }, []);

  return (
    <div className="min-h-screen bg-orange-50 py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-3xl font-bold text-orange-800">Dashboard</h1>
          <p className="text-orange-700">Welcome, {email || "User"}!</p>
        </div>
      </div>
    </div>
  );
}
