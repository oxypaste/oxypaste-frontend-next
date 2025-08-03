"use client";

import React, { useEffect, useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { APP_CONFIG } from "../../../../../app.config";
import { useRecaptcha } from "@/hooks/useReCaptcha";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import InputField from "@/components/auth/InputField";
import PasswordField from "@/components/auth/PasswordField";

const SignupPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { recaptchaToken, resetRecaptcha, RecaptchaComponent } = useRecaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!recaptchaToken) {
      setError("Please complete the CAPTCHA.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("recaptcha_token", recaptchaToken);

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("Content-Type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await response.json() : null;

      if (response.status === 202 && data) {
        if (data.token) {
          // Email verification is disabled: complete registration manually
          const verifyResp = await fetch(
            `/api/user/verify/?token=${encodeURIComponent(data.token)}`,
            {
              method: "GET",
            }
          );

          if (verifyResp.ok) {
            window.location.href = "/account/login";
          } else {
            setError("Failed to verify your account. Please try again.");
          }
        } else {
          // Email verification required
          setMessage(
            "Account created. Please check your email to verify your account."
          );
        }
      } else if (response.status === 201 && data?.id && data?.createdAt) {
        // Fallback: traditional 201
        window.location.href = "/account/login";
      } else if (
        (response.status === 400 || response.status === 409) &&
        data?.error
      ) {
        setError(data.error);
      } else {
        throw new Error("Unexpected response");
      }
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
      resetRecaptcha();
    }
  };

  return (
    <AuthFormContainer
      title="Create Your Account"
      error={error}
      message={message}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={<User className="w-5 h-5" />}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <InputField
          icon={<Mail className="w-5 h-5" />}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <PasswordField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {RecaptchaComponent}

        <button
          type="submit"
          disabled={loading}
          className={`cursor-pointer w-full py-2 px-4 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{" "}
        <a href="/account/login" className="text-blue-400 hover:underline">
          Log in
        </a>
      </p>

      <p className="text-center text-xs text-gray-400 mt-6">
        Before signing up, please read the{" "}
        <a
          href={"/" + APP_CONFIG.TERMS_AND_CONDITIONS_DOCUMENT}
          className="text-blue-400 hover:underline"
        >
          Terms and Conditions
        </a>{" "}
        &{" "}
        <a
          href={"/" + APP_CONFIG.PRIVACY_POLICY_DOCUMENT}
          className="text-blue-400 hover:underline"
        >
          Privacy Policy
        </a>
      </p>
    </AuthFormContainer>
  );
};

export default SignupPage;
