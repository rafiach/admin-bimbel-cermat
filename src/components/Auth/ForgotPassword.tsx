"use client";

import { EmailIcon } from "@/assets/icons";
import { requestPasswordReset } from "@/lib/auth/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import InputGroup from "../FormElements/InputGroup";

export default function ForgotPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const callbackURL = searchParams.get("callbackUrl") || "/auth/reset-password";

      const result = await requestPasswordReset({
        email,
        redirectTo: callbackURL,
      });

      if (result.error) {
        throw new Error(result.error.message || "Failed to send reset email");
      }

      toast.success("Password reset email sent! Check your inbox.");
      router.push("/auth/sign-in");
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send reset email";
      setError(message);
      toast.error(`Error: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup
        type="email"
        label="Email"
        className="mb-4 [&_input]:py-3.75"
        placeholder="Enter your email"
        name="email"
        handleChange={(e) => setEmail(e.target.value)}
        value={email}
        icon={<EmailIcon />}
      />

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={loading}
          className="hover:bg-opacity-90 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          Send Reset Link
          {loading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent dark:border-primary dark:border-t-transparent" />
          )}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  );
}
