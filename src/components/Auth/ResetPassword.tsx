"use client";

import { PasswordIcon } from "@/assets/icons";
import { resetPassword } from "@/lib/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import InputGroup from "../FormElements/InputGroup";

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Invalid or missing reset token.</p>
        <p className="mt-2 text-sm text-gray-500">Please request a new password reset link.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword({
        newPassword: password,
        token,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to reset password");
      }

      toast.success("Password reset successful! Please sign in with your new password.");
      router.push("/auth/sign-in");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to reset password";
      setError(message);
      toast.error(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="password"
        label="New Password"
        className="mb-4 [&_input]:py-3.75"
        placeholder="Enter new password"
        name="password"
        handleChange={(e) => setPassword(e.target.value)}
        value={password}
        icon={<PasswordIcon />}
      />

      <InputGroup
        type="password"
        label="Confirm New Password"
        className="mb-5 [&_input]:py-3.75"
        placeholder="Confirm new password"
        name="confirmPassword"
        handleChange={(e) => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        icon={<PasswordIcon />}
      />

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="hover:bg-opacity-90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          Reset Password
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
