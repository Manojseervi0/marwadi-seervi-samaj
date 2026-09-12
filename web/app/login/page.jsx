"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { t } = useTranslation();
  const { login } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: t("common.error"), description: "Please fill in all fields", status: "error", duration: 3000 });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("authToken", data.token);
      localStorage.setItem("registeredEmail", email);
      if (data.user && data.user.role) {
        localStorage.setItem("userRole", data.user.role);
      }
      login(email);
      toast({ title: t("common.success"), description: "Login successful!", status: "success", duration: 3000 });
      router.push("/dashboard");
    } catch (err) {
      toast({ title: t("common.error"), description: err.message, status: "error", duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast({ title: "Google Login", description: "Google login functionality would be implemented here", status: "info", duration: 3000 });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
      <div className="max-w-md w-full mx-auto py-8 px-4">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold text-orange-800">{t("login_page.title")}</h1>
            <p className="text-orange-600 text-lg">{t("login_page.subtitle")}</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-xl w-full border-2 border-orange-200">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div>
                  <label className="block text-orange-800 mb-1.5">{t("login_page.email")}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-12 px-4 rounded-md border border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-orange-800 mb-1.5">{t("login_page.password")}</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 rounded-md border border-orange-300 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                <div className="flex justify-between items-center w-full">
                  <label className="flex items-center gap-2 text-orange-700">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-orange-500"
                    />
                    {t("login_page.remember_me")}
                  </label>
                  <Link href="/forgot-password" className="text-orange-600">
                    {t("login_page.forgot_password")}
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium"
                >
                  {isLoading ? t("common.loading") : t("login_page.sign_in")}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-3 my-6">
              <hr className="flex-1 border-orange-300" />
              <span className="text-orange-600 text-sm font-medium">{t("login_page.or")}</span>
              <hr className="flex-1 border-orange-300" />
            </div>

            <button
              onClick={handleGoogleLogin}
              className="w-full h-12 rounded-md border border-orange-500 text-orange-600 hover:bg-orange-50 flex items-center justify-center gap-2 font-medium"
            >
              <FaGoogle /> {t("login_page.continue_with_google")}
            </button>

            <div className="flex justify-center gap-2 mt-6">
              <span className="text-orange-700">{t("login_page.no_account")}</span>
              <Link href="/signup" className="text-orange-600 font-bold">
                {t("login_page.sign_up")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
