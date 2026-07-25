/* ========= 共通処理：CSVパーサ ========= */


export function parseCsv(text) {
  const lines = text
    .replace(/^\uFEFF/, "") // BOM除去
    .split("\n")
    .map(l => l.trim())
    .filter(l => l !== "");

  const headers = splitLine(lines[0]).map(h => h.trim()).filter(Boolean);

  const rows = lines.slice(1).map(line => {
    const cells = splitLine(line);
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (cells[i] ?? "").trim();
    });
    return row;
  });

  return { headers, rows };
}

function splitLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}
