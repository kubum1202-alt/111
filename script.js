const game = new Chess();
let board = null;
let gameStarted = false;

const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const startBtn = document.getElementById("startBtn");

// 상태 업데이트
function updateStatus() {
  if (!gameStarted) {
    statusEl.innerText = "게임 시작 버튼을 누르세요";
    return;
  }

  let status = "";
  const moveColor = game.turn() === "w" ? "백" : "흑";

  if (game.in_checkmate()) {
    status = `체크메이트! ${moveColor === "백" ? "흑" : "백"} 승리`;
  } else if (game.in_draw()) {
    status = "무승부!";
  } else {
    status = `${moveColor} 차례`;
    if (game.in_check()) status += " (체크!)";
  }

  statusEl.innerText = status;
}

// 드래그 시작
function onDragStart(source, piece) {
  if (!gameStarted) return false;
  if (game.game_over()) return false;

  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

// 말 놓기
function onDrop(source, target) {
  if (!gameStarted) return "snapback";

  const move = game.move({
    from: source,
    까지: target,
    promotion: "q"
  });

  if (move === null) return "snapback";

  updateStatus();
}

// 위치 동기화
function onSnapEnd() {
  board.position(game.fen());
}

// 보드 생성
board = Chessboard("board", {
  draggable: true,
  position: "start",
  onDragStart,
  onDrop,
  onSnapEnd
});

// 시작 버튼
startBtn.addEventListener("click", () => {
  game.reset();
  board.start();
  gameStarted = true;
  updateStatus();
});

// 리셋 버튼
resetBtn.addEventListener("click", () => {
  game.reset();
  board.start();
  updateStatus();
});

// 초기 상태
updateStatus();
