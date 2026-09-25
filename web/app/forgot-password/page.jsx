"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast-context";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoOtpHint, setDemoOtpHint] = useState("");

  const toast = useToast();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const handleEmailSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Please enter your email", status: "error", duration: 3000 });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      toast({
        title: "OTP Sent",
        description: data.message,
        status: "success",
        duration: 5000,
      });
      setStep(2);
    } catch (err) {
      toast({ title: "Error", description: err.message, status: "error", duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!otp.trim()) {
      toast({ title: "Please enter the 6-digit OTP", status: "error", duration: 3000 });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      setResetToken(data.resetToken);
      toast({ title: "OTP Verified", description: "Enter your new password.", status: "success", duration: 3000 });
      setStep(3);
    } catch (err) {
      toast({ title: "Verification Failed", description: err.message, status: "error", duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    if (e) e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast({ title: "Password must be at least 6 characters", status: "error", duration: 3000 });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", status: "error", duration: 3000 });
      return;
    }
    if (!resetToken) {
      toast({ title: "Session expired", description: "Please restart password reset.", status: "error", duration: 3000 });
      setStep(1);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${apiUrl}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password reset failed");

      toast({
        title: "Password Updated!",
        description: "You can now log in with your new password.",
        status: "success",
        duration: 4000,
      });
      router.push("/login");
    } catch (err) {
      toast({ title: "Reset Failed", description: err.message, status: "error", duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-white shadow-md">
      <h1 className="mb-6 text-2xl font-bold text-orange-800">Forgot Password</h1>
      <div className="flex flex-col gap-4">
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="w-full">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1.5">Enter Registered Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.com"
                  className="w-full h-11 px-4 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium"
              >
                Send Verification OTP
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="w-full">
            <div className="flex flex-col gap-4">
              <p className="text-sm text-gray-600">
                An OTP was sent to <b>{email}</b>.
              </p>
              {demoOtpHint && (
                <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded-md w-full">
                  Testing OTP: <b>{demoOtpHint}</b>
                </p>
              )}
              <div>
                <label className="block mb-1.5">Enter 6-Digit OTP</label>
                <input
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="e.g. 123456"
                  maxLength={6}
                  className="w-full h-11 px-4 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-sm text-orange-600 hover:bg-orange-50 rounded-md py-1.5"
              >
                Change Email / Resend
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordReset} className="w-full">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1.5">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full h-11 px-4 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full h-11 px-4 rounded-md border border-orange-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 rounded-md bg-orange-500 hover:bg-orange-600 disabled:opacity-70 text-white font-medium"
              >
                Reset Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
