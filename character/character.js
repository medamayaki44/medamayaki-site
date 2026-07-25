const params = new URLSearchParams(location.search);
const id = params.get("id");

console.log(location.search);
console.log(id);

if (!id) {
  location.href = "../pc-list.html";
}

fetch(`json/${id}.json`)
  .then(res => {

    if (!res.ok) {
      throw new Error("json not found");
    }
    return res.json();
  })
  .then(data => {
    initCharacter(data);
  })
  .catch(() => {
    showComingSoon();
  });

function initCharacter(data) {

  // 色
  document.documentElement.style.setProperty(
    "--main-color",
    data.color
  );

  // 名前
  document.getElementById("pc-name").textContent =
    data.name;

  document.getElementById("pc-kana").textContent =
    data.kana;
  
  document.getElementById("pc-romaji").textContent =
    data.romaji;

  document.getElementById("pc-id").textContent =
    data.id;

  // 画像
  document.getElementById("pc-image").src =
    data.image;

  // 前後移動
  const num =
    Number(id.replace("pc", ""));

  const prev =
    String(num - 1).padStart(3, "0");

  const next =
    String(num + 1).padStart(3, "0");

  document.getElementById("prev-id").href =
    `character.html?id=pc${prev}`;

  document.getElementById("next-id").href =
    `character.html?id=pc${next}`;

  // 基本情報
  document.getElementById("basic-info").innerHTML =
    "<h3>基本情報</h3>" +
    Object.entries(data.basic)
      .map(
        ([k, v]) =>
          `<p>${k}：${v}</p>`
      )
      .join("");

  // 能力値
  createRadar(data);

  // パラメーター
  createPersonality(data);

  // シナリオ
  document.getElementById("scenario-list").innerHTML =
    "<h3>通過シナリオ</h3>" +
    `<ul class="scenario">
      ${
        data.scenarios
          .map(s => `<li>${s}</li>`)
          .join("")
      }
    </ul>`;

  // リンク
  document.getElementById("pc-links").innerHTML =
    data.links
    .map(l => {
      if (l.url) {
        return `
          <a href="${l.url}" target="_blank">${l.name}
          </a>
        `;
      }

      return `
        <span class="link-disabled">
          ${l.name}
        </span>
      `;
    })
    .join("");

}


//能力値(レーダーチャート)
function createRadar(data) {

  new Chart(
    document.getElementById("radarChart"),
    {
      type: "radar",

      data: {
        labels:
          Object.keys(data.stats),

        datasets: [
          {
            label: "能力値",

            data:
              Object.values(data.stats),

            backgroundColor:
              `rgba(${data.color},0.2)`,

            borderColor:
              `rgb(${data.color})`
          }
        ]
      },

      options: {
        responsive: true,
        maintainAspectRatio: true,
        
        scales: {
          r: {
            min: 0,
            max: 20,

            ticks: {
              stepSize: 5
            },

            grid: {
              color:
                `rgba(${data.color},0.5)`
            }
          }
        }
      }
    }
  );

}

//パラメーター(人間面)
function createPersonality(data) {

  const max = 7;

  document.getElementById(
    "personality"
  ).innerHTML =

    "<h3>パラメーター</h3>" +

    data.personality
      .map(p => {

        const percent =
          ((p.value - 1) / (max - 1)) * 100;

        return `
          <div class="param-row">

            <div class="param-name">
              ${p.name}
            </div>

            <div class="param-bar-area">

              <span class="param-label left">
                ${p.left}
              </span>

              <div class="param-bar">

                <div class="param-dots">
                  ${
                    Array.from(
                      { length: max }
                    )
                    .map(() => "<span></span>")
                    .join("")
                  }
                </div>

                <div
                  class="param-point"
                  style="left:${percent}%"
                ></div>

              </div>

              <span class="param-label right">
                ${p.right}
              </span>

            </div>

          </div>
        `;

      })
      .join("");

}

//jsonがまだないとき用
function showComingSoon() {

  document.querySelector(".container").innerHTML = `
    <div class="coming-soon">
      <h1>準備中</h1>
      
      <p>
      Character Data Missing<br>
      この探索者の記録はまだ保管されていません
      </p>
      <a href="javascript:history.back()" class="back-button">
        前ページに戻る
      </a>
    </div>
  `;
}