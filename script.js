let playerHP = 100;
let enemyHP = 100;
let gameStarted = false;

startBtn.onclick = () => {
  playerHP = 100;
  enemyHP = 100;
  gameStarted = true;

  playerHealthBar.style.width = "100%";
  enemyHealthBar.style.width = "100%";

  resultScreen.classList.add("hidden");

  intro.classList.add("hidden");
  game.classList.remove("hidden");
};

attackBtn.onclick = () => {
  if (!gameStarted) return; // 🔥 시작 안 했으면 실행 금지

  enemyHP -= Math.random() * 20;
  playerHP -= Math.random() * 10;

  if (enemyHP < 0) enemyHP = 0;
  if (playerHP < 0) playerHP = 0;

  enemyHealthBar.style.width = enemyHP + "%";
  playerHealthBar.style.width = playerHP + "%";

  if (enemyHP <= 0) {
    gameStarted = false;
    endGame("승리!");
  } else if (playerHP <= 0) {
    gameStarted = false;
    endGame("패배...");
  }
};

function endGame(text) {
  resultScreen.classList.remove("hidden");
  resultText.textContent = text;
}
