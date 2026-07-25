// ==============================
// import：共通処理を読み込む
// ==============================

// CSVを安全にパースする処理
import { parseCsv } from "./utils/parseCsv.js";

// タイトルの頭文字から「あ行・か行…」を判定する処理
import { getKanaGroup } from "./utils/kana.js";

// 「システムで絞り込み」を共通化した処理
import { setupSystemFilter } from "./utils/systemFilter.js";


// ==============================
// 定数定義（このJSの設定）
// ==============================

// 読み込むCSVファイル
const CSV_PATH = "./data/gm.csv";

// 絞り込みに使うCSVの列名
const FILTER_KEY = "システム";

// テーブルに表示する列（この順で表示される）
const COLUMNS = ["タイトル", "システム","PL通過","回し経験","部屋","PC人数","要素"];


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

    // 各行に「五十音グループ」を追加
    rows.forEach(row => {
      row._kana = getKanaGroup(row["ふりがな"]);
    });

    // 五十音 → ふりがな の順でソート
    rows.sort((a, b) =>
      a._kana.localeCompare(b._kana, "ja") ||
      a["ふりがな"].localeCompare(b["ふりがな"], "ja")
    );

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

  // ---------- ヘッダー行 ----------
  const headerTr = document.createElement("tr");

  COLUMNS.forEach(col => {
    const th = document.createElement("th");
    th.textContent = col;
    headerTr.appendChild(th);
  });

  thead.appendChild(headerTr);

  // ---------- 中身 ----------
  let currentKana = "";

  rows.forEach(row => {

    // 五十音の切り替わりで見出し行を入れる
    if (row._kana !== currentKana) {
      currentKana = row._kana;

      const kanaTr = document.createElement("tr");
      const kanaTd = document.createElement("td");

      kanaTr.classList.add("kana-row");
      kanaTd.classList.add("kana-cell");

      kanaTd.colSpan = COLUMNS.length;
      kanaTd.textContent = `${currentKana}行`;

      kanaTr.appendChild(kanaTd);
      tbody.appendChild(kanaTr);
    }

    // データ行
    const tr = document.createElement("tr");

    COLUMNS.forEach(col => {
      const td = document.createElement("td");
      td.textContent = row[col] ?? "";

      td.classList.add(`col-${col}`);
      
      tr.appendChild(td);
    });
  

    //行に「システム名クラス」を付ける
    tr.dataset.system = row["システム"];
   
  tbody.appendChild(tr);
  });
}
