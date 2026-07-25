/* ========= PCページリンク作成 ========= */

import { parseCsv } from "./utils/parseCsv.js";

let allRows = [];

/* ========= CSV読み込み ========= */
fetch("./data/pc.csv")
  .then(res => res.text())
  .then(text => {
    const { rows } = parseCsv(text);

    // id降順ソート
    rows.sort((a, b) => getIdNumber(b.id) - getIdNumber(a.id));

    allRows = rows;

    setupSystemFilter(rows);
    renderTable(rows);
  });

  /* ========= idから数字だけ取り出す ========= */
function getIdNumber(id) {
  return Number(id.replace(/\D/g, ""));
}

  /* ========= システム絞り込み ========= */
function setupSystemFilter(rows) {
  const select = document.getElementById("filter-select");

  const systems = [...new Set(rows.map(r => r["システム"]))];

  systems.forEach(sys => {
    const option = document.createElement("option");
    option.value = sys;
    option.textContent = sys;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const value = select.value;

    const filtered = value
      ? allRows.filter(r => r["システム"] === value)
      : allRows;

    renderTable(filtered);
  });
}

  /* ========= 一覧描画 ========= */
function renderTable(rows) {
  
  // 一覧を入れる場所
  const container = document.getElementById("pc-list");

  // 一旦空にする
  container.innerHTML = "";

  rows.forEach(pc => {

  /* ========= 1人分の枠 ========= */
  const item = document.createElement("div");
  item.className = "pc-item";

   // システム名をdata属性へ
  item.dataset.system = pc["システム"];

  /* ========= HTML生成 ========= */
  item.innerHTML = `
    <div class="pc-main">

      <a href="character/character.html?id=${pc.id}">
        ${pc["名前"]}
      </a> 
    </div>

    <div class="pc-sub">
      <span class="system">
        ${pc["システム"]}
      </span>

      <span>
        ${pc["年齢"] || "-"}歳
      </span>

      <span>
        ${pc["性別"] || "-"}
      </span>

      <span>
        ${pc["誕生日"] || "-"}
      </span>

      <span>
        ${pc["職業"] || "-"}
      </span>

    </div>
    `;

    container.appendChild(item);
  });
}