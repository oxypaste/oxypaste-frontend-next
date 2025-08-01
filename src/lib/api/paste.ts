import { Paste } from "@/lib/models/paste.model";

export async function getPaste(id: string): Promise<Paste> {
  const res = await fetch(`/api/pastes/${id}`);

  if (!res.ok) {
    throw new Error(`Failed to fetch paste with id ${id}: ${res.statusText}`);
  }

  const data: Paste = await res.json();
  return data;
}
