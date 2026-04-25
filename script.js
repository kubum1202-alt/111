const game = new Chess();
let board = null;

const statusEl = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");

// 상태 업데이트
function updateStatus() {
  let status = "";

  const moveColor = game.turn() === "w" ? "백" : "흑";

  if (game.in_checkmate()) {
    status = `체크메이트! ${moveColor === "백" ? "흑" : "백"} 승리`;
    alert(status);
  } else if (game.in_draw()) {
    status = "무승부!";
    alert(status);
  } else {
    status = `${moveColor} 차례`;

    if (game.in_check()) {
      status += " (체크!)";
      alert("체크!");
    }
  }

  statusEl.innerText = status;
}

// 드래그 시작
function onDragStart(source, piece) {
  // 게임 끝났으면 못 움직임
  if (game.game_over()) return false;

  // 자기 턴 아니면 못 움직임
  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

// 말 놓기
function onDrop(source, target) {
  const move = game.move({
    from: source,
    까지: target,
    promotion: "q" // 항상 퀸으로 승격
  });

  // 불법 이동이면 되돌림
  if (move === null) return "snapback";

  updateStatus();
}

// 애니메이션 후 위치 동기화
function onSnapEnd() {
  board.position(game.fen());
}

// 체스판 설정
board = Chessboard("board", {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd
});

// 초기 상태
updateStatus();

// 리셋 버튼
resetBtn.addEventListener("click", () => {
  game.reset();
  board.start();
  updateStatus();
});
