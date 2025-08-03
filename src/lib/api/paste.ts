import { Paste } from "@/lib/models/paste.model";

interface CreatePasteOptions {
  title: string;
  content: string;
  public: boolean;
  token?: string;
}

export async function createPaste({
  title,
  content,
  public: isPublic,
  token,
}: CreatePasteOptions): Promise<Paste> {
  const res = await fetch("/api/pastes/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify({
      title,
      content,
      public: isPublic,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }

  const data: Paste = await res.json();
  return data;
}

export async function getPaste(id: string): Promise<Paste> {
  const res = await fetch(`/api/pastes/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch paste with id ${id}: ${res.statusText}`);
  }

  const data: Paste = await res.json();
  return data;
}
