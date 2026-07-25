// ==============================
// import：共通処理を読み込む
// ==============================

// CSVを安全にパースする処理
import { parseCsv } from "./utils/parseCsv.js";

// 「システムで絞り込み」を共通化した処理
import { setupSystemFilter } from "./utils/systemFilter.js";


// ==============================
// 定数定義（このJSの設定）
// ==============================

// 読み込むCSVファイル
const CSV_PATH = "./data/desired.csv";

// 絞り込みに使うCSVの列名
const FILTER_KEY = "システム";

// テーブルに表示する列（この順で表示される）
const COLUMNS = ["タイトル", "URL"];


// ==============================
// 状態保持用変数
// ==============================

// 「すべての行」を保持する（絞り込み解除用）
let allRows = [];


// ==============================
// メイン処理：CSVを読み込む
// ==============================

fetch(CSV_PATH)
  .then(res => res.text())
  .then(text => {

    // CSVを { headers, rows } の形に変換
    const { rows } = parseCsv(text);



    // 全件データとして保存
    allRows = rows;

    // システム絞り込みUIを初期化
    setupSystemFilter({
      rows,               // 初期表示用
      allRows,            // 全件（絞り込み解除用）
      filterKey: FILTER_KEY,
      onChange: renderTable // ← 絞り込み時に呼ばれる
    });

    // 初期表示
    renderTable(rows);
  });


// ==============================
// 表を描画する処理
// ==============================

function renderTable(rows) {

  const thead = document.querySelector("#data-table thead");
  const tbody = document.querySelector("#data-table tbody");

  // 一旦中身を空にする
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // ---------- 中身 ----------
  let currentKana = "";

  rows.forEach(row => {

    // データ行
    const tr = document.createElement("tr");

    COLUMNS.forEach(col => {
      const td = document.createElement("td");

      if (col === "URL") {
        if (row[col]) {
        const link = document.createElement("a");

        link.href = row[col];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "🔗";   // アイコン表示

        td.appendChild(link);
       }
      } else {
        td.textContent = row[col] ?? "";
      }

      td.classList.add(`col-${col}`);
      tr.appendChild(td);
    });
  

    //行に「システム名クラス」を付ける
    tr.dataset.system = row["システム"];
    
    tbody.appendChild(tr);
  });
}
