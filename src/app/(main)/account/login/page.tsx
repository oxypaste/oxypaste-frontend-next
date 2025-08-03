"use client";

import React, { useState } from "react";
import { useRecaptcha } from "@/hooks/useReCaptcha";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import PasswordField from "@/components/auth/PasswordField";
import AuthFormContainer from "@/components/auth/AuthFormContainer";
import InputField from "@/components/auth/InputField";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { recaptchaToken, resetRecaptcha, RecaptchaComponent } = useRecaptcha();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!recaptchaToken) {
      setError("Please complete the CAPTCHA.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("recaptcha_token", recaptchaToken);

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        body: formData,
      });

      const contentType = response.headers.get("Content-Type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await response.json() : null;

      if (response.status === 200 && data?.sessionToken) {
        localStorage.setItem("token", data.sessionToken);
        localStorage.setItem("expireAt", data.expireAt);
        window.location.href = "/";
      } else if (response.status > 400 && data?.error) {
        setError(data.error);
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
      resetRecaptcha();
    }
  };

  return (
    <AuthFormContainer title="Welcome Back" error={error}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          icon={<User className="w-5 h-5" />}
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
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
          {loading ? "Logging In..." : "Log In"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Dont have an account?{" "}
        <a href="/account/signup" className="text-blue-400 hover:underline">
          Sign Up
        </a>
      </p>
    </AuthFormContainer>
  );
};

export default LoginPage;
