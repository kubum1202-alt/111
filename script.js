// --- DOM 요소 선택 ---
const introScreen = document.getElementById('intro-screen');
const gameContainer = document.getElementById('game-container');
const enemyNameInput = document.getElementById('enemy-name-input');
const startBtn = document.getElementById('start-btn');
const enemyNameDisplay = document.getElementById('enemy-name-display');

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const playerHealthBar = document.getElementById('player-health');
const enemyHealthBar = document.getElementById('enemy-health');

const resultScreen = document.getElementById('result-screen');
const resultMessage = document.getElementById('result-message');
const restartBtn = document.getElementById('restart-btn');

// --- 캔버스 크기 설정 (16:9 비율) ---
canvas.width = 1024;
canvas.height = 576;

// --- 전역 게임 변수 ---
const gravity = 0.7; // 중력 값
let animationId; // 애니메이션 루프 ID
let isGameOver = false;
let enemyNameStr = "보스"; // 기본 적 이름

// --- 입력 키 상태 추적 객체 ---
const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false }
};

// ==========================================
// 캐릭터 클래스 정의 (Fighter)
// ==========================================
class Fighter {
    constructor({ position, velocity, color, isPlayer }) {
        this.position = position;
        this.velocity = velocity;
        this.width = 50;
        this.height = 150;
        this.color = color;
        this.isPlayer = isPlayer;
        
        // 바라보는 방향 (플레이어는 오른쪽, 적은 왼쪽을 기본으로 봄)
        this.facing = isPlayer ? 'right' : 'left'; 

        // 공격 판정 박스 (Hitbox) 설정
        this.attackBox = {
            position: { x: this.position.x, y: this.position.y },
            width: 100, // 공격 사거리
            height: 50
        };
        
        this.isAttacking = false;
        this.health = 100;
        this.speed = 5; // 이동 속도
    }

    // 캐릭터 그리기
    draw() {
        // 1. 캐릭터 몸체(직사각형) 그리기
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

        // 2. 공격 중일 때 타격 박스(Hitbox) 그리기
        if (this.isAttacking) {
            ctx.fillStyle = 'rgba(255, 255, 0, 0.5)'; // 반투명 노란색
            ctx.fillRect(
                this.attackBox.position.x, 
                this.attackBox.position.y, 
                this.attackBox.width, 
                this.attackBox.height
            );
        }
    }

    // 매 프레임 위치 및 상태 업데이트
    update() {
        this.draw();

        // 공격 박스의 위치를 캐릭터가 바라보는 방향에 맞춰 업데이트
        if (this.facing === 'right') {
            this.attackBox.position.x = this.position.x + this.width; // 캐릭터 오른쪽
        } else {
            this.attackBox.position.x = this.position.x - this.attackBox.width; // 캐릭터 왼쪽
        }
        this.attackBox.position.y = this.position.y + 20; // 살짝 위쪽에 공격 박스 생성

        // X축 이동 적용
        this.position.x += this.velocity.x;
        
        // Y축 이동 및 중력 적용
        this.position.y += this.velocity.y;

        // 바닥 충돌 판정 (캔버스 하단에서 일정 높이 위를 바닥으로 설정)
        const groundLevel = canvas.height - 50;
        if (this.position.y + this.height + this.velocity.y >= groundLevel) {
            this.velocity.y = 0;
            this.position.y = groundLevel - this.height; // 바닥에 고정
        } else {
            this.velocity.y += gravity; // 공중에 있으면 중력 가속도 추가
        }

        // 화면 밖으로 나가지 못하게 제한 (벽 충돌)
        if (this.position.x <= 0) this.position.x = 0;
        if (this.position.x + this.width >= canvas.width) this.position.x = canvas.width - this.width;
    }

    // 공격 실행 메서드
    attack() {
        this.isAttacking = true;
        // 0.1초(100ms) 후에 공격 판정 해제
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

// ==========================================
// 게임 객체 초기화 및 상태 관리
// ==========================================
let player;
let enemy;

// 게임 초기 세팅 함수
function initGame() {
    isGameOver = false;
    
    // 플레이어 객체 생성 (왼쪽, 파란색)
    player = new Fighter({
        position: { x: 100, y: 0 },
        velocity: { x: 0, y: 0 },
        color: '#3498db',
        isPlayer: true
    });

    // 적 객체 생성 (오른쪽, 빨간색)
    enemy = new Fighter({
        position: { x: canvas.width - 150, y: 0 },
        velocity: { x: 0, y: 0 },
        color: '#e74c3c',
        isPlayer: false
    });

    // UI 체력바 초기화
    playerHealthBar.style.width = '100%';
    enemyHealthBar.style.width = '100%';
    resultScreen.classList.add('hidden');
    
    // 이전에 실행 중이던 애니메이션이 있다면 중지
    if(animationId) cancelAnimationFrame(animationId);
    
    // 게임 루프 시작
    animate();
}

// 충돌 판정 함수 (AABB 방식: 사각형과 사각형이 겹치는지 확인)
function rectangularCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

// 게임 종료 및 승패 결정 처리
function determineWinner() {
    isGameOver = true;
    resultScreen.classList.remove('hidden'); // 결과창 표시
    
    if (player.health === enemy.health) {
        resultMessage.innerText = "무승부!";
    } else if (player.health > enemy.health) {
        resultMessage.innerText = "승리!";
        resultMessage.style.color = '#2ed573';
    } else {
        resultMessage.innerText = `${enemyNameStr}에게 패배...`;
        resultMessage.style.color = '#ff4757';
    }
}

// ==========================================
// 메인 게임 루프 (매 프레임마다 실행됨)
// ==========================================
function animate() {
    if (isGameOver) return; // 게임 오버면 루프 중지
    animationId = requestAnimationFrame(animate);

    // 이전 프레임 지우고 배경 새로 그리기 (잔상 제거용)
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 바닥 선 그리기
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

    // 캐릭터 업데이트(이동 및 렌더링)
    player.update();
    enemy.update();

    // ------------------------------------------
    // 플레이어 이동 로직 처리
    // ------------------------------------------
    player.velocity.x = 0; // 기본적으로 안 움직임
    
    if (keys.a.pressed || keys.ArrowLeft.pressed) {
        player.velocity.x = -player.speed;
        player.facing = 'left';
    } else if (keys.d.pressed || keys.ArrowRight.pressed) {
        player.velocity.x = player.speed;
        player.facing = 'right';
    }

    // ------------------------------------------
    // 적 AI 로직 구현
    // ------------------------------------------
    // 적과 플레이어 사이의 거리 계산
    const distanceX = player.position.x - enemy.position.x;
    
    // 사정거리(100)보다 멀면 플레이어 쪽으로 이동
    if (Math.abs(distanceX) > 90) {
        if (distanceX > 0) { // 플레이어가 오른쪽에 있음
            enemy.velocity.x = enemy.speed * 0.6; // 속도를 살짝 낮춤
            enemy.facing = 'right';
        } else {             // 플레이어가 왼쪽에 있음
            enemy.velocity.x = -enemy.speed * 0.6;
            enemy.facing = 'left';
        }
    } else {
        // 사정거리 안에 들어오면 이동 멈춤
        enemy.velocity.x = 0;
        
        // 무조건 공격하지 않고, 랜덤한 확률로 공격 (타이밍 조절)
        if (Math.random() < 0.05 && !enemy.isAttacking) {
            enemy.attack();
        }
    }

    // ------------------------------------------
    // 타격(충돌) 판정 및 체력 감소 로직
    // ------------------------------------------
    // 1. 플레이어가 적을 때렸을 때
    if (player.isAttacking && rectangularCollision({ rectangle1: player, rectangle2: enemy })) {
        player.isAttacking = false; // 중복 타격 방지
        enemy.health -= 10;         // 데미지 10
        enemyHealthBar.style.width = enemy.health + '%'; // 체력바 UI 업데이트
    }

    // 2. 적이 플레이어를 때렸을 때
    if (enemy.isAttacking && rectangularCollision({ rectangle1: enemy, rectangle2: player })) {
        enemy.isAttacking = false;
        player.health -= 15;        // 보스니까 데미지가 더 셈 (15)
        playerHealthBar.style.width = player.health + '%';
    }

    // ------------------------------------------
    // 승패 판정 (누군가의 체력이 0 이하로 떨어졌는가?)
    // ------------------------------------------
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner();
    }
}

// ==========================================
// 이벤트 리스너 설정
// ==========================================

// 키보드 누를 때 이벤트 (이동, 점프, 공격)
window.addEventListener('keydown', (event) => {
    if(isGameOver) return;

    switch (event.key) {
        // 플레이어 좌우 이동
        case 'a': case 'A': keys.a.pressed = true; break;
        case 'd': case 'D': keys.d.pressed = true; break;
        case 'ArrowLeft': keys.ArrowLeft.pressed = true; break;
        case 'ArrowRight': keys.ArrowRight.pressed = true; break;
        
        // 플레이어 점프 (바닥에 있을 때만 가능하도록)
        case 'w': case 'W': case 'ArrowUp':
            if (player.velocity.y === 0) { 
                player.velocity.y = -15; // 위로 힘을 가함
            }
            break;
            
        // 플레이어 공격 (스페이스바)
        case ' ':
            if (!player.isAttacking) player.attack();
            break;
    }
});

// 키보드 뗄 때 이벤트 (이동 멈춤)
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a': case 'A': keys.a.pressed = false; break;
        case 'd': case 'D': keys.d.pressed = false; break;
        case 'ArrowLeft': keys.ArrowLeft.pressed = false; break;
        case 'ArrowRight': keys.ArrowRight.pressed = false; break;
    }
});

// 시작 화면 -> 게임 시작 버튼 클릭 이벤트
startBtn.addEventListener('click', () => {
    const inputName = enemyNameInput.value.trim();
    if (inputName !== "") {
        enemyNameStr = inputName; // 입력값이 있으면 해당 이름 사용
    } else {
        enemyNameStr = "보스"; // 없으면 기본값
    }
    
    // UI 업데이트 및 화면 전환
    enemyNameDisplay.innerText = enemyNameStr;
    introScreen.classList.add('hidden');
    gameContainer.classList.remove('hidden');

    initGame(); // 게임 실행
});

// 결과 화면 -> 다시 하기 버튼 클릭 이벤트
restartBtn.addEventListener('click', () => {
    // 키 입력 상태 초기화
    keys.a.pressed = false;
    keys.d.pressed = false;
    keys.ArrowLeft.pressed = false;
    keys.ArrowRight.pressed = false;

    // 초기 시작 화면으로 복귀
    gameContainer.classList.add('hidden');
    introScreen.classList.remove('hidden');
});