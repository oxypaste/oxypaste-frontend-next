export interface Paste {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  public: boolean;
  content: string;
  language: Language;
}

export enum Language {
  AutoDetect = "",
  Plaintext = "plaintext",
  JavaScript = "javascript",
  CSS = "css",
  Python = "python",
  TypeScript = "typescript",
  Java = "java",
  C = "c",
  Cpp = "cpp",
  Go = "go",
  Rust = "rs",
  PHP = "php",
  Ruby = "ruby",
  Bash = "bash",
  JSON = "json",
  YAML = "yaml",
  Markdown = "markdown",
}
