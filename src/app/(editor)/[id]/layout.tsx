// app/(main)/[id]/layout.tsx
import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return {
      title: "Paste not found",
      description: "The paste you're looking for may not exist.",
    };
  }

  const meta = await res.json();

  return {
    title: `OxyPaste - ${meta.title}`,
    description: `Code snippet '${meta.title}' written in '${meta.language}'`,
  };
}

export default function PasteLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
