export const SHORTCUTS = {
  SAVE: ["Control", "s"],         // Ctrl + S
  EDIT: ["Control", "e"],         // Ctrl + E
  NEW: ["Control", "Shift", "n"],          // Ctrl + Shift + N
  RAW: ["Control", "Shift", "r"],      // Ctrl + Shift + R
  SHARE: ["Control", "Shift", "s"] // Ctrl + Shift + S
};

export const LANGUAGE_OPTIONS: { label: string; value: string }[] = [
  { label: "Auto Detect", value: "" },
  { label: "Plaintext", value: "plaintext" },
  { label: "JavaScript", value: "javascript" },
  { label: "CSS", value: "css" },
  { label: "Python", value: "python" },
  { label: "TypeScript", value: "typescript" },
  { label: "Java", value: "java" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rs" },
  { label: "PHP", value: "php" },
  { label: "Ruby", value: "ruby" },
  { label: "Bash", value: "bash" },
  { label: "JSON", value: "json" },
  { label: "YAML", value: "yaml" },
  { label: "Markdown", value: "markdown" },
];

export async function getPaste(id: string): Promise<{ content: string; language?: string, title?: string }> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/pastes/${id}`);
    if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error);
    }
    const data = await res.json();
    return {
        content: data.content || '',
        language: data.language,
        title: data.title,
    };
}