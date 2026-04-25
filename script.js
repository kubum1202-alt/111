const startBtn = document.getElementById("start-btn");
const intro = document.getElementById("intro-screen");
const game = document.getElementById("game-container");

const playerHealthBar = document.getElementById("player-health");
const enemyHealthBar = document.getElementById("enemy-health");

const attackBtn = document.getElementById("attack");

const resultScreen = document.getElementById("result-screen");
const resultText = document.getElementById("result-message");

let playerHP = 100;
let enemyHP = 100;
let gameRunning = false;

// 🔥 시작 버튼
startBtn.addEventListener("click", () => {
  // 상태 초기화
  playerHP = 100;
  enemyHP = 100;
  gameRunning = true;

  // UI 초기화
  playerHealthBar.style.width = "100%";
  enemyHealthBar.style.width = "100%";

  resultScreen.classList.add("hidden");

  intro.classList.add("hidden");
  game.classList.remove("hidden");

  console.log("게임 시작"); // 🔍 디버그
});

// 🔥 공격 버튼
attackBtn.addEventListener("click", () => {
  if (!gameRunning) return; // 시작 전엔 실행 안됨

  // 데미지
  enemyHP -= Math.floor(Math.random() * 20);
  playerHP -= Math.floor(Math.random() * 10);

  // 최소값 제한
  if (enemyHP < 0) enemyHP = 0;
  if (playerHP < 0) playerHP = 0;

  // UI 반영
  enemyHealthBar.style.width = enemyHP + "%";
  playerHealthBar.style.width = playerHP + "%";

  console.log("플레이어:", playerHP, "적:", enemyHP); // 🔍 디버그

  // 🔥 여기서만 승패 판정
  if (enemyHP === 0) {
    gameRunning = false;
    showResult("승리!");
  } else if (playerHP === 0) {
    gameRunning = false;
    showResult("패배...");
  }
});

function showResult(text) {
  resultText.textContent = text;
  resultScreen.classList.remove("hidden");
}
