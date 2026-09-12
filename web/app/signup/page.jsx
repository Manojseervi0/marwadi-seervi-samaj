"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useToast } from "@/lib/toast-context";

export default function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { t } = useTranslation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({ title: t("common.error"), description: "Please fill in all fields", status: "error", duration: 3000 });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast({ title: t("common.error"), description: "Passwords do not match", status: "error", duration: 3000 });
      return;
    }
    if (!agreeTerms) {
      toast({ title: t("common.error"), description: "Please agree to the terms and conditions", status: "error", duration: 3000 });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      toast({ title: t("common.success"), description: "Account created successfully!", status: "success", duration: 3000 });
      router.push("/login");
    } catch (err) {
      toast({ title: t("common.error"), description: err.message, status: "error", duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="max-w-md w-full mx-auto py-8 px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold text-orange-800">{t("signup_page.title")}</h1>
            <p className="text-orange-600 text-lg">{t("signup_page.subtitle")}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl w-full border-2 border-orange-200">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-orange-800 mb-1.5">{t("signup_page.full_name")}</label>
                  <input
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full h-12 px-4 rounded-md border border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-orange-800 mb-1.5">{t("signup_page.email")}</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full h-12 px-4 rounded-md border border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-orange-800 mb-1.5">{t("signup_page.password")}</label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 rounded-md border border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-orange-800 mb-1.5">{t("signup_page.confirm_password")}</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full h-12 px-4 rounded-md border border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <label className="flex items-center gap-2 text-orange-700 text-sm">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="accent-orange-500"
                  />
                  {t("signup_page.agree_terms")}
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium"
                >
                  {isLoading ? t("common.loading") : t("signup_page.create_account")}
                </button>
              </div>
            </form>

            <div className="flex justify-center gap-2 mt-6">
              <span className="text-orange-700">{t("signup_page.already_have_account")}</span>
              <Link href="/login" className="text-orange-600 font-bold">
                {t("signup_page.sign_in")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
