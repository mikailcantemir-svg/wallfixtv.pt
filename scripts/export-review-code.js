const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "review-export");
const OUT_FILE = path.join(OUT_DIR, "CODIGO_COMPLETO_WALLFIXTV_REVIEW.md");

const MAIN_FILES = [
  { file: "index.html", lang: "html" },
  { file: "styles.css", lang: "css" },
  { file: "script.js", lang: "javascript" },
  { file: "sitemap.xml", lang: "xml" },
  { file: "robots.txt", lang: "txt" },
  { file: "CNAME", lang: "txt" },
  { file: "README.md", lang: "markdown" },
];

const ASSET_DIRS = [
  "assets/images",
  "assets/icons",
  "assets/logos",
];

const BINARY_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".ico",
  ".bmp",
  ".avif",
]);

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function formatDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    date.getFullYear(),
    "-",
    pad(date.getMonth() + 1),
    "-",
    pad(date.getDate()),
    " ",
    pad(date.getHours()),
    ":",
    pad(date.getMinutes()),
    ":",
    pad(date.getSeconds()),
  ].join("");
}

function escapeFence(content) {
  return content.replace(/```/g, "``\\`");
}

function addCodeBlock(lines, title, lang, content) {
  lines.push(`## ${title}`);
  lines.push("");
  lines.push(`\`\`\`${lang}`);
  lines.push(escapeFence(content));
  lines.push("```");
  lines.push("");
}

function listDirectoryAssets(relativeDir) {
  const absoluteDir = path.join(ROOT, relativeDir);
  const entries = [];

  if (!fileExists(absoluteDir)) {
    return { missing: true, entries };
  }

  const files = fs
    .readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "pt"));

  for (const fileName of files) {
    const relativePath = path.posix.join(relativeDir.replace(/\\/g, "/"), fileName);
    const absolutePath = path.join(absoluteDir, fileName);
    const extension = path.extname(fileName).toLowerCase();
    const stats = fs.statSync(absolutePath);

    entries.push({
      relativePath,
      absolutePath,
      fileName,
      extension,
      type: extension ? extension.slice(1) : "sem extensão",
      sizeBytes: stats.size,
    });
  }

  return { missing: false, entries };
}

function buildAssetInventory(lines) {
  lines.push("## Inventário de assets");
  lines.push("");
  lines.push(
    "Nota: ficheiros binários (PNG, JPG, WEBP, etc.) são listados apenas por caminho. Ficheiros SVG incluem o código completo abaixo."
  );
  lines.push("");

  const svgBlocks = [];

  for (const relativeDir of ASSET_DIRS) {
    const { missing, entries } = listDirectoryAssets(relativeDir);

    lines.push(`### ${relativeDir}/`);
    lines.push("");

    if (missing) {
      lines.push("_Pasta não encontrada._");
      lines.push("");
      continue;
    }

    if (entries.length === 0) {
      lines.push("_Sem ficheiros nesta pasta._");
      lines.push("");
      continue;
    }

    for (const entry of entries) {
      if (BINARY_EXTENSIONS.has(entry.extension)) {
        lines.push(
          `- \`${entry.relativePath}\` — tipo: **${entry.type}**, tamanho: ${entry.sizeBytes} bytes`
        );
        continue;
      }

      if (entry.extension === ".svg") {
        lines.push(
          `- \`${entry.relativePath}\` — tipo: **svg**, tamanho: ${entry.sizeBytes} bytes (código incluído abaixo)`
        );
        svgBlocks.push(entry);
        continue;
      }

      lines.push(
        `- \`${entry.relativePath}\` — tipo: **${entry.type || "desconhecido"}**, tamanho: ${entry.sizeBytes} bytes`
      );
    }

    lines.push("");
  }

  if (svgBlocks.length > 0) {
    lines.push("## Ficheiros SVG (código completo)");
    lines.push("");

    for (const entry of svgBlocks) {
      const content = readText(entry.absolutePath);
      addCodeBlock(lines, entry.relativePath, "svg", content);
    }
  }
}

function buildReviewExport() {
  const lines = [];
  const exportedAt = new Date();

  lines.push("# WallFixTV.pt — Código completo para revisão");
  lines.push("");
  lines.push(`**Exportado em:** ${formatDateTime(exportedAt)}`);
  lines.push("**Uso:** ficheiro local apenas para revisão. Não publicar no GitHub.");
  lines.push("");
  lines.push("---");
  lines.push("");

  for (const item of MAIN_FILES) {
    const absolutePath = path.join(ROOT, item.file);

    if (!fileExists(absolutePath)) {
      lines.push(`## ${item.file}`);
      lines.push("");
      lines.push("_Ficheiro não encontrado._");
      lines.push("");
      continue;
    }

    const content = readText(absolutePath);
    addCodeBlock(lines, item.file, item.lang, content);
  }

  buildAssetInventory(lines);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(OUT_FILE, lines.join("\n"), "utf8");

  return {
    outFile: OUT_FILE,
    exportedAt: formatDateTime(exportedAt),
    sizeBytes: fs.statSync(OUT_FILE).size,
  };
}

const result = buildReviewExport();

console.log("Exportação de revisão concluída.");
console.log(`Ficheiro: ${result.outFile}`);
console.log(`Data: ${result.exportedAt}`);
console.log(`Tamanho: ${result.sizeBytes} bytes`);
