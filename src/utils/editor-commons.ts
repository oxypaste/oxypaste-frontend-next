import { Language } from "@/lib/models/paste.model";

export const SHORTCUTS = {
  SAVE: ["Control", "s"], // Ctrl + S
  EDIT: ["Control", "e"], // Ctrl + E
  NEW: ["Control", "Shift", "n"], // Ctrl + Shift + N
  RAW: ["Control", "Shift", "r"], // Ctrl + Shift + R
  SHARE: ["Control", "Shift", "s"], // Ctrl + Shift + S
};

export const LANGUAGE_OPTIONS: { label: string; value: Language }[] = [
  { label: "Auto Detect", value: Language.AutoDetect },
  { label: "Plaintext", value: Language.Plaintext },
  { label: "JavaScript", value: Language.JavaScript },
  { label: "CSS", value: Language.CSS },
  { label: "Python", value: Language.Python },
  { label: "TypeScript", value: Language.TypeScript },
  { label: "Java", value: Language.Java },
  { label: "C", value: Language.C },
  { label: "C++", value: Language.Cpp },
  { label: "Go", value: Language.Go },
  { label: "Rust", value: Language.Rust },
  { label: "PHP", value: Language.PHP },
  { label: "Ruby", value: Language.Ruby },
  { label: "Bash", value: Language.Bash },
  { label: "JSON", value: Language.JSON },
  { label: "YAML", value: Language.YAML },
  { label: "Markdown", value: Language.Markdown },
];

export function toLanguageEnum(value: string): Language {
  const normalized = value?.trim().toLowerCase();

  // Iterate through all values of the Language enum
  for (const lang of Object.values(Language)) {
    if (lang === normalized) {
      return lang as Language;
    }
  }

  // Default fallback
  return Language.AutoDetect;
}
