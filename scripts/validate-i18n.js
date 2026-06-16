"use strict";

const fs = require("fs");
const path = require("path");
const { LANGUAGES } = require("./i18n-data.js");

const REQUIRED_SECTIONS = [
  "meta", "header", "hero", "services", "zones", "included", "process",
  "why", "gallery", "faq", "footer", "modal", "whatsapp", "jsonLd",
];

const REQUIRED_LANGS = ["pt", "en", "es", "fr"];

function walkKeys(obj, prefix, issues) {
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => walkKeys(item, `${prefix}[${i}]`, issues));
    return;
  }
  const keys = Object.keys(obj);
  const seen = new Set();
  for (const key of keys) {
    if (seen.has(key)) {
      issues.duplicateKeys.push(`${prefix}${key}`);
    }
    seen.add(key);
    walkKeys(obj[key], `${prefix}${key}.`, issues);
  }
}

function checkEmptyStrings(obj, prefix, issues) {
  if (typeof obj === "string") {
    if (!obj.trim()) issues.emptyStrings.push(prefix.slice(0, -1));
    return;
  }
  if (!obj || typeof obj !== "object") return;
  if (Array.isArray(obj)) {
    obj.forEach((item, i) => checkEmptyStrings(item, `${prefix}[${i}].`, issues));
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    checkEmptyStrings(value, `${prefix}${key}.`, issues);
  }
}

const issues = { duplicateKeys: [], emptyStrings: [], missingSections: [], missingLangs: [] };

for (const lang of REQUIRED_LANGS) {
  if (!LANGUAGES[lang]) {
    issues.missingLangs.push(lang);
    continue;
  }
  for (const section of REQUIRED_SECTIONS) {
    if (!LANGUAGES[lang][section]) {
      issues.missingSections.push(`${lang}.${section}`);
    }
  }
  walkKeys(LANGUAGES[lang], `${lang}.`, issues);
  checkEmptyStrings(LANGUAGES[lang], `${lang}.`, issues);
}

// Parse source for literal duplicate keys (JS allows last wins - detect in source)
const source = fs.readFileSync(path.join(__dirname, "i18n-data.js"), "utf8");
const sourceDupes = [];
for (const lang of REQUIRED_LANGS) {
  const start = source.indexOf(`\n  ${lang}: {`);
  const end = source.indexOf(`\n  },`, start);
  const block = source.slice(start, end > start ? end : start + 50000);
  const lines = block.split("\n");
  const stack = [{ depth: 2, keys: new Set() }];
  for (const line of lines) {
    const indent = line.match(/^(\s*)/)[1].length;
    const keyMatch = line.match(/^(\s*)([a-zA-Z0-9_]+):\s/);
    if (!keyMatch) continue;
    const key = keyMatch[2];
    const depth = indent.length;
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    const parent = stack[stack.length - 1];
    if (parent.keys.has(key)) {
      sourceDupes.push(`${lang} duplicate key "${key}" at indent ${depth}`);
    }
    parent.keys.add(key);
    if (line.trim().endsWith("{")) {
      stack.push({ depth, keys: new Set() });
    }
  }
}

const preferred = {
  en: "safe, level and with clean cable management",
  es: "seguro, nivelado y con cables organizados",
  fr: "sécurisée, alignée et avec câbles organisés",
};

console.log("=== i18n validation ===");
console.log("Duplicate keys (object walk):", issues.duplicateKeys.length ? issues.duplicateKeys : "none");
console.log("Empty strings:", issues.emptyStrings.length ? issues.emptyStrings.slice(0, 20) : "none");
console.log("Missing sections:", issues.missingSections.length ? issues.missingSections : "none");
console.log("Source duplicate keys:", sourceDupes.length ? sourceDupes : "none");
for (const [lang, expected] of Object.entries(preferred)) {
  const actual = LANGUAGES[lang]?.hero?.heroHighlight;
  console.log(`${lang} heroHighlight:`, actual === expected ? "OK" : `MISMATCH (${actual})`);
}

process.exit(
  issues.duplicateKeys.length ||
  issues.missingSections.length ||
  issues.missingLangs.length ||
  sourceDupes.length
    ? 1
    : 0
);
