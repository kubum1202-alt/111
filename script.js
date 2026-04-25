* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Malgun Gothic', sans-serif;
}

body {
  background-color: #111;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  color: white;
  touch-action: none;
}

.hidden {
  display: none !important;
}

/* 시작 화면 */
#intro-screen {
  background: #222;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 0 20px rgba(0,0,0,0.8);
  width: 90%;
  max-width: 500px;
}

#intro-screen h1 {
  text-align: center;
  color: #ff4757;
  margin-bottom: 20px;
  font-size: 2.5rem;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  color: #ccc;
  font-weight: bold;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
  border: none;
  border-radius: 5px;
}

#start-btn {
  width: 100%;
  padding: 15px;
  font-size: 1.3rem;
  font-weight: bold;
  margin-top: 10px;
  background-color: #2ed573;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

/* 게임 화면 */
#game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #333;
}

#game-canvas {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #4a4a4a;
  display: block;
}

/* UI */
#game-ui {
  position: absolute;
  top: 20px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 5%;
  pointer-events: none;
  z-index: 5;
}

.health-container {
  width: 40%;
  max-width: 400px;
}

.name-꼬리표 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 5px;
  text-shadow: 2px 2px 4px black;
}

.enemy-ui {
  text-align: right;
}

.health-bar-bg {
  width: 100%;
  height: 30px;
  background: #ff4757;
  border: 3px solid #fff;
  border-radius: 5px;
  overflow: hidden;
}

.health-bar-fill {
  height: 100%;
  background: #2ed573;
  width: 100%;
  transition: width 0.2s ease-out;
}

.enemy-ui .health-bar-fill {
  float: right;
}

/* 결과 화면 */
#result-screen {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

#result-message {
  font-size: 4rem;
  margin-bottom: 30px;
}

#restart-btn {
  padding: 15px 40px;
  font-size: 1.5rem;
  background: #ffa502;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

/* 모바일 컨트롤 */
#mobile-controls {
  position: absolute;
  bottom: 30px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 5;
}

#mobile-controls button {
  width: 70px;
  height: 70px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 50%;
  background: rgba(255,255,255,0.3);
  color: white;
  border: 2px solid white;
  user-select: none;
}

#mobile-controls button:active {
  background: rgba(255,255,255,0.6);
}

.d-pad, .action-pad {
  display: flex;
  gap: 15px;
}

/* PC에서는 숨김 */
@media (min-width: 800px) {
  #mobile-controls {
    display: none;
  }
}
