"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faCheck } from "@fortawesome/free-solid-svg-icons";
import { TailSpin } from "react-loader-spinner";

type FieldProps = {
  label: string;
  value: string;
  fieldKey: string;
  copyable?: boolean;
  copiedField: string | null;
  onCopy: (value: string, fieldKey: string) => void;
};

function Field({
  label,
  value,
  fieldKey,
  copyable = false,
  copiedField,
  onCopy,
}: FieldProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 shadow-md border border-white/10 transition duration-300 hover:shadow-lg group relative">
      <h2 className="text-sm font-medium text-gray-400 mb-1">{label}</h2>
      <div className="flex items-center justify-between space-x-3">
        <p className="text-white text-sm break-all font-mono">{value}</p>
        {copyable && (
          <button
            onClick={() => onCopy(value, fieldKey)}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition duration-200 cursor-pointer"
          >
            <FontAwesomeIcon
              icon={copiedField === fieldKey ? faCheck : faClipboard}
              className={`w-5 h-5 ${
                copiedField === fieldKey ? "text-green-400 scale-110" : ""
              } transition-transform duration-300`}
            />
          </button>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  const { user } = useUser();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (value: string, fieldKey: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  if (!user)
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <TailSpin strokeWidth={2} color="#222731" ariaLabel="loading" />
      </div>
    );

  return (
    <main className="max-w-xl mx-auto mt-20 px-8 py-10 bg-gray-900 rounded-2xl shadow-xl text-white relative overflow-hidden font-inter">
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-purple-700/20 rounded-full filter blur-3xl z-0" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-10 border-b border-white/10 pb-4">
          Account Overview
        </h1>

        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {user.username?.[0].toUpperCase() || "U"}
          </div>

          <div>
            <p className="text-xl font-semibold tracking-tight">
              @{user.username}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Member since{" "}
              {new Date(user.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <section className="space-y-6">
          <Field
            label="User ID"
            value={user.id}
            fieldKey="id"
            copyable
            copiedField={copiedField}
            onCopy={handleCopy}
          />
          <Field
            label="Username"
            value={user.username}
            fieldKey="username"
            copyable
            copiedField={copiedField}
            onCopy={handleCopy}
          />
          <Field
            label="Joined Date"
            value={new Date(user.created_at).toDateString()}
            fieldKey="joinedDate"
            copiedField={copiedField}
            onCopy={handleCopy}
          />
          <Field
            label="Statistics"
            value={user.statistics + " pastes created"}
            fieldKey="statistics"
            copiedField={copiedField}
            onCopy={handleCopy}
          />
        </section>
      </div>
    </main>
  );
}
