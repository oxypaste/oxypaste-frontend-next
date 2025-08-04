"use client";

import React, { useEffect, useState, Fragment } from "react";
import { TailSpin } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faClipboard,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Swal from "sweetalert2";

type TokenView = {
  id: string;
  name: string;
  createdAt: string;
  expiresAt: string | null;
};

const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetch(url, {
    ...options,
    headers,
  });
};

const swalDarkOptions = {
  background: "#1a202c",
  color: "#e2e8f0",
};

const extractErrorMessage = async (res: Response): Promise<string> => {
  try {
    const data = await res.json();
    return data.error || data.message || "An unknown error occurred";
  } catch {
    return "An unknown error occurred";
  }
};

export default function TokenPage() {
  const [tokens, setTokens] = useState<TokenView[]>([]);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [doesExpire, setDoesExpire] = useState(false);
  const [expiryDuration, setExpiryDuration] = useState<string>("");

  const fetchTokens = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/user/token/list");
      if (!res.ok) {
        const errorMsg = await extractErrorMessage(res);
        await Swal.fire({
          ...swalDarkOptions,
          icon: "error",
          title: "Error",
          text: errorMsg,
        });
        throw new Error(errorMsg);
      }
      const data = await res.json();
      setTokens(data);
    } catch (err) {
      console.error("Token fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);

    try {
      const params = new URLSearchParams({ name: name.trim() });
      if (doesExpire && expiryDuration.trim()) {
        const days = parseInt(expiryDuration.trim(), 10);
        if (!isNaN(days) && days > 0) {
          params.append("expiry_duration", (days * 86400).toString()); // seconds
        }
      }

      const res = await fetchWithAuth(
        `/api/user/token/create?${params.toString()}`,
        { method: "POST" }
      );

      if (!res.ok) {
        const errorMsg = await extractErrorMessage(res);
        await Swal.fire({
          ...swalDarkOptions,
          icon: "error",
          title: "Failed to create token",
          text: errorMsg,
        });
        return;
      }

      const data = await res.json();
      setCreatedToken(data.token);
      await fetchTokens();
      setName("");
      setExpiryDuration("");
      setDoesExpire(false);
    } catch (err) {
      console.error("Create token error:", err);
      await Swal.fire({
        ...swalDarkOptions,
        icon: "error",
        title: "Error",
        text: "Something went wrong while creating the token",
      });
    } finally {
      setCreating(false);
    }
  };

  const confirmRevoke = async (tokenId: string, tokenName: string) => {
    const result = await Swal.fire({
      ...swalDarkOptions,
      title: `Revoke token "${tokenName}"?`,
      text: "Are you sure you want to revoke this token? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, revoke it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await handleRevoke(tokenId);
    }
  };

  const handleRevoke = async (tokenId: string) => {
    const params = new URLSearchParams({ token: tokenId });
    try {
      const res = await fetchWithAuth(
        `/api/user/token/revoke?${params.toString()}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const errorMsg = await extractErrorMessage(res);
        await Swal.fire({
          ...swalDarkOptions,
          icon: "error",
          title: "Failed to revoke token",
          text: errorMsg,
        });
        return;
      }
      await Swal.fire({
        ...swalDarkOptions,
        icon: "success",
        title: "Revoked!",
        text: "The token has been revoked.",
      });
      fetchTokens();
    } catch (err) {
      console.error("Revoke token error:", err);
      await Swal.fire({
        ...swalDarkOptions,
        icon: "error",
        title: "Error",
        text: "Something went wrong while revoking the token",
      });
    }
  };

  const confirmRevokeAll = async () => {
    const result = await Swal.fire({
      ...swalDarkOptions,
      title: "Revoke all tokens?",
      text: "Are you sure you want to revoke ALL your tokens? This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, revoke all",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      await handleRevokeAll();
    }
  };

  const handleRevokeAll = async () => {
    try {
      const res = await fetchWithAuth("/api/user/token/revoke-all", {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorMsg = await extractErrorMessage(res);
        await Swal.fire({
          ...swalDarkOptions,
          icon: "error",
          title: "Failed to revoke all tokens",
          text: errorMsg,
        });
        return;
      }
      await Swal.fire({
        ...swalDarkOptions,
        icon: "success",
        title: "Revoked!",
        text: "All tokens have been revoked.",
      });
      fetchTokens();
    } catch (err) {
      console.error("Revoke all tokens error:", err);
      await Swal.fire({
        ...swalDarkOptions,
        icon: "error",
        title: "Error",
        text: "Something went wrong while revoking all tokens",
      });
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(value);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-white">
      <h1 className="text-3xl font-bold mb-6">API Tokens</h1>

      {/* Create Token */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Token name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-grow px-4 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
          />
          <button
            onClick={handleCreate}
            disabled={creating}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md font-medium text-white transition cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2" />
            {creating ? "Creating..." : "Create"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={doesExpire}
            onChange={() => setDoesExpire(!doesExpire)}
            className="cursor-pointer"
          />
          <label
            onClick={() => setDoesExpire(!doesExpire)}
            className="text-sm cursor-pointer"
          >
            Does expire
          </label>

          {doesExpire && (
            <input
              type="number"
              min="1"
              placeholder="Expiry (in Days)"
              value={expiryDuration}
              onChange={(e) => setExpiryDuration(e.target.value)}
              className="ml-4 px-3 py-1 rounded-md bg-gray-800 border border-gray-700 text-white w-48"
            />
          )}
        </div>
      </div>

      {/* Token List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <TailSpin height={40} width={40} color="#aaa" />
        </div>
      ) : tokens.length === 0 ? (
        <p className="text-gray-400">No API tokens found.</p>
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => (
            <div
              key={token.id}
              className="bg-white/5 border border-white/10 rounded-lg px-5 py-4 flex justify-between items-center"
            >
              <div className="text-sm">
                <p className="font-mono break-all">{token.name}</p>
                <p className="text-xs text-gray-400">
                  ID: <span className="break-all">{token.id}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Created: {new Date(token.createdAt).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  Expires:{" "}
                  {(token.expiresAt &&
                    new Date(token.expiresAt).toLocaleString()) ||
                    "Never"}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleCopy(token.id)}
                  className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                  <FontAwesomeIcon
                    icon={copied === token.name ? faCheck : faClipboard}
                    className={`w-5 h-5 ${
                      copied === token.name ? "text-green-400 scale-110" : ""
                    } transition-transform`}
                  />
                </button>

                <button
                  onClick={() => confirmRevoke(token.id, token.name)}
                  className="text-red-500 hover:text-red-400 transition cursor-pointer"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Revoke All */}
      {tokens.length > 0 && (
        <div className="mt-10">
          <button
            onClick={confirmRevokeAll}
            className="text-sm text-red-400 underline hover:text-red-300 transition cursor-pointer"
          >
            Revoke All Tokens
          </button>
        </div>
      )}

      {/* Token Modal */}
      <Transition show={!!createdToken} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setCreatedToken(null)}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-28">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-auto shadow-xl transition-all">
                <DialogTitle className="text-lg font-semibold text-yellow-400 mb-4">
                  Token Created
                </DialogTitle>
                <p className="text-sm text-gray-300 mb-3">
                  This is your API token. Copy it now — you won’t be able to
                  view it again.
                </p>

                <div className="bg-gray-800 px-4 py-2 rounded-md flex justify-between items-center">
                  <code className="font-mono text-sm break-all text-white">
                    {createdToken}
                  </code>
                  <button
                    onClick={() => createdToken && handleCopy(createdToken)}
                    className="text-gray-400 hover:text-white ml-3 cursor-pointer"
                  >
                    <FontAwesomeIcon
                      icon={copied === createdToken ? faCheck : faClipboard}
                      className={`w-5 h-5 ${
                        copied === createdToken
                          ? "text-green-400 scale-110"
                          : ""
                      } transition-transform`}
                    />
                  </button>
                </div>

                <div className="mt-6 text-right">
                  <button
                    onClick={() => setCreatedToken(null)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-md font-medium text-white text-sm transition cursor-pointer"
                  >
                    I have copied it
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </main>
  );
}
