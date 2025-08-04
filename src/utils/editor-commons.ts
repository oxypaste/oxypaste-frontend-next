import { Language } from "@/lib/models/paste.model";

import JavascriptPlain from "react-devicons/JavaScript/plain";
import Css3Plain from "react-devicons/Css3/plain";
import PythonPlain from "react-devicons/Python/plain";
import TypescriptPlain from "react-devicons/Typescript/plain";
import JavaPlain from "react-devicons/Java/plain";
import COriginal from "react-devicons/C/original";
import CplusplusPlain from "react-devicons/Cplusplus/plain";
import GoPlain from "react-devicons/Go/plain";
import RustOriginal from "react-devicons/Rust/original";
import PhpPlain from "react-devicons/PHP/plain";
import RubyPlain from "react-devicons/Ruby/plain";
import BashPlain from "react-devicons/Bash/plain";
import JsonPlain from "react-devicons/Json/plain";
import YamlPlain from "react-devicons/Yaml/plain";
import MarkdownOriginal from "react-devicons/Markdown/original";

export const SHORTCUTS = {
  SAVE: ["Control", "s"], // Ctrl + S
  EDIT: ["Control", "e"], // Ctrl + E
  NEW: ["Control", "Shift", "n"], // Ctrl + Shift + N
  RAW: ["Control", "Shift", "r"], // Ctrl + Shift + R
  SHARE: ["Control", "Shift", "s"], // Ctrl + Shift + S
};

export const LANGUAGE_OPTIONS: {
  label: string;
  value: Language;
  icon?: React.ElementType;
}[] = [
  { label: "Auto Detect", value: Language.AutoDetect },
  { label: "Plaintext", value: Language.Plaintext },
  { label: "JavaScript", value: Language.JavaScript, icon: JavascriptPlain },
  { label: "CSS", value: Language.CSS, icon: Css3Plain },
  { label: "Python", value: Language.Python, icon: PythonPlain },
  { label: "TypeScript", value: Language.TypeScript, icon: TypescriptPlain },
  { label: "Java", value: Language.Java, icon: JavaPlain },
  { label: "C", value: Language.C, icon: COriginal },
  { label: "C++", value: Language.Cpp, icon: CplusplusPlain },
  { label: "Go", value: Language.Go, icon: GoPlain },
  { label: "Rust", value: Language.Rust, icon: RustOriginal },
  { label: "PHP", value: Language.PHP, icon: PhpPlain },
  { label: "Ruby", value: Language.Ruby, icon: RubyPlain },
  { label: "Bash", value: Language.Bash, icon: BashPlain },
  { label: "JSON", value: Language.JSON, icon: JsonPlain },
  { label: "YAML", value: Language.YAML, icon: YamlPlain },
  { label: "Markdown", value: Language.Markdown, icon: MarkdownOriginal },
];

export function toLanguageEnum(value: string): Language {
  const normalized = value?.trim().toLowerCase();

  for (const lang of Object.values(Language)) {
    if (lang === normalized) {
      return lang as Language;
    }
  }

  return Language.AutoDetect;
}

export function getIcon(language?: Language): React.ElementType | undefined {
  const option = LANGUAGE_OPTIONS.find((option) => option.value === language);
  return option?.icon;
}
