body {
  margin: 0;
  font-family: sans-serif;
  background: #111;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.hidden {
  display: none;
}

#intro-screen {
  background: #222;
  padding: 30px;
  border-radius: 10px;
  width: 300px;
}

.input-group {
  margin-bottom: 10px;
}

input {
  width: 100%;
  padding: 10px;
}

button {
  padding: 10px;
  cursor: pointer;
}

#game-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

#game-ui {
  position: absolute;
  top: 10px;
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.health-bar-bg {
  width: 200px;
  height: 20px;
  background: red;
}

.health-bar-fill {
  height: 100%;
  background: lime;
  width: 100%;
}

#result-screen {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
