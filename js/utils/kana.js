/* ========= 共通処理：五十音判定 ========= */

export function getKanaGroup(kana = "") {
  const first = kana.trim()[0];
  if (!first) return "その他";
  if ("あいうヴえお".includes(first)) return "あ";
  if ("かがきぎくぐけげこご".includes(first)) return "か";
  if ("さざしじすずせぜそぞ".includes(first)) return "さ";
  if ("たちつてとだぢづでど".includes(first)) return "た";
  if ("なにぬねの".includes(first)) return "な";
  if ("はばぱひびぴふぶぷへべぺほぼぽ".includes(first)) return "は";
  if ("まみむめも".includes(first)) return "ま";
  if ("やゆよ".includes(first)) return "や";
  if ("らりるれろ".includes(first)) return "ら";
  if ("わをん".includes(first)) return "わ";
  return "その他";
}