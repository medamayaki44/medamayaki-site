/* ========= PCページ詳細表示 ========= */

const params = new URLSearchParams(location.search);
const pcId = params.get("id");

fetch("./data/pc.csv")
  .then(res => res.text())
  .then(text => {
    const { rows } = parseCsv(text);
    const pc = rows.find(r => r.id === pcId);
    renderPc(pc);
  });


function renderPc(pc) {
  const container = document.getElementById("pc-detail");
  container.innerHTML = `
    <h1>${pc["名前"]}</h1>
    <p>システム：${pc["システム"]}</p>
    <p>PL：${pc["PL"]}</p>
    <p>${pc["概要"]}</p>
  `;
}