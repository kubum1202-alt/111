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

startBtn.onclick = () => {
  intro.classList.add("hidden");
  game.classList.remove("hidden");
};

attackBtn.onclick = () => {
  enemyHP -= Math.random() * 20;
  playerHP -= Math.random() * 10;

  if (enemyHP < 0) enemyHP = 0;
  if (playerHP < 0) playerHP = 0;

  enemyHealthBar.style.width = enemyHP + "%";
  playerHealthBar.style.width = playerHP + "%";

  if (enemyHP <= 0) {
    endGame("승리!");
  } else if (playerHP <= 0) {
    endGame("패배...");
  }
};

function endGame(text) {
  resultScreen.classList.remove("hidden");
  resultText.textContent = text;
}
