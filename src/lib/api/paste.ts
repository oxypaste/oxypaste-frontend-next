import { Language, Paste } from "@/lib/models/paste.model";
import { toLanguageEnum } from "@/utils/editor-commons";

interface CreatePasteOptions {
  title: string;
  content: string;
  public: boolean;
  language: Language;
  token?: string;
}

export async function createPaste({
  title,
  content,
  public: isPublic,
  language,
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
      language: language || "",
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }

  const data: Paste = await res.json();
  return {
    ...data,
    language: toLanguageEnum(data.language),
  };
}

export async function getPaste(id: string): Promise<Paste> {
  const res = await fetch(`/api/pastes/${id}`);

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Failed to fetch paste with ID ${id}`);
  }

  const data = await res.json();

  return {
    ...data,
    language: toLanguageEnum(data.language),
  };
}
