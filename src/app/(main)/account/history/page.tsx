"use client";

import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

type Paste = {
  id: string;
  title: string;
  revocation_key: string;
  created_at: Date;
};

// Mock server fetch
const fetchServerHistory = async (): Promise<Paste[]> => {
  const token = localStorage.getItem("token");
  if (!token) return [];
  const res = await fetch("/api/account/history", {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  // Assume API returns array of { id, name, revocation_key, date }
  return data.map((item: any) => ({
    ...item,
    created_at: new Date(item.created_at),
  }));
};

// Load client pastes from localStorage
const loadClientHistory = (): Paste[] => {
  const clientPastes: Paste[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("paste_")) {
      const id = key.replace("paste_", "");
      const item = localStorage.getItem(key);
      if (item) {
        try {
          const parsed = JSON.parse(item) as {
            revocation_key: string;
            date: number;
          };
          clientPastes.push({
            id,
            title: "",
            revocation_key: parsed.revocation_key,
            created_at: new Date(parsed.date),
          });
        } catch {
          // Ignore invalid JSON
        }
      }
    }
  }
  return clientPastes;
};

type PasteTableProps<T extends Paste> = {
  title: string;
  pastes: T[];
  onOpen: (id: string) => void;
  onDelete: (id: string, revocation_key: string) => void;
  emptyMessage: string;
  loading: boolean; // NEW
};

function PasteTable<T extends Paste>({
  title,
  pastes,
  onOpen,
  onDelete,
  emptyMessage,
  loading,
}: PasteTableProps<T>) {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <TailSpin
            height={40}
            width={40}
            color="#2563eb"
            ariaLabel="loading"
          />
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pastes.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              pastes.map((paste) => (
                <tr key={paste.id} className="border-b">
                  <td className="py-2 px-4">{paste.id}</td>
                  <td className="py-2 px-4">{paste.title}</td>
                  <td className="py-2 px-4">
                    {paste.created_at.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="py-2 px-4 space-x-2">
                    <button
                      className="text-blue-600 hover:underline cursor-pointer"
                      onClick={() => onOpen(paste.id)}
                    >
                      Open
                    </button>
                    <button
                      className="text-red-600 hover:underline cursor-pointer"
                      onClick={() => onDelete(paste.id, paste.revocation_key)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </section>
  );
}

const HistoryPage: React.FC = () => {
  const [serverHistory, setServerHistory] = useState<Paste[]>([]);
  const [clientHistory, setClientHistory] = useState<Paste[]>([]);
  const [loadingServer, setLoadingServer] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoadingServer(true);
      const data = await fetchServerHistory();
      setServerHistory(data);
      setLoadingServer(false);
    };

    loadData();
    setClientHistory(loadClientHistory());
  }, []);

  const handleOpen = (id: string) => {
    window.open(`/${id}`, "_blank");
  };

  const handleDelete = async (id: string, revocationKey: string) => {
    try {
      const res = await fetch(
        `/api/pastes/${id}?revocation_key=${encodeURIComponent(revocationKey)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: localStorage.getItem("token")
              ? `Bearer ${localStorage.getItem("token")}`
              : "",
          },
        }
      );
      if (res.ok) {
        setServerHistory((prev) => prev.filter((paste) => paste.id !== id));
        setClientHistory((prev) => prev.filter((paste) => paste.id !== id));
      } else {
        // Optionally handle error
        alert("Failed to delete paste.");
      }
    } catch (error) {
      alert("Error deleting paste.");
    }
  };

  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-10 overflow-scroll">
      {hasToken ? (
        <PasteTable
          title="Account Paste History"
          pastes={serverHistory}
          onOpen={handleOpen}
          onDelete={handleDelete}
          emptyMessage="No server history found."
          loading={loadingServer}
        />
      ) : (
        <PasteTable
          title="Anonymous Paste History"
          pastes={clientHistory}
          onOpen={handleOpen}
          onDelete={handleDelete}
          emptyMessage="No client history found."
          loading={false}
        />
      )}
    </div>
  );
};

export default HistoryPage;
