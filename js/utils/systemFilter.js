/* ========= 共通処理：システムフィルター ========= */

export function setupSystemFilter({
  rows,
  allRows,
  filterKey = "システム",
  selectId = "filter-select",
  onChange
}) {
  const select = document.getElementById(selectId);
  if (!select) return;

  // 初期化（再描画対策）
  select.innerHTML = '<option value="">すべて</option>';

  const values = [...new Set(rows.map(r => r[filterKey]).filter(Boolean))];

  values.forEach(v => {
    const option = document.createElement("option");
    option.value = v;
    option.textContent = v;
    select.appendChild(option);
  });

  select.addEventListener("change", () => {
    const value = select.value;

    const filtered = value
      ? allRows.filter(r => r[filterKey] === value)
      : allRows;

    onChange(filtered);
  });
}
