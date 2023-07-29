// 변수 및 초기화
let timerInterval;
let timeRemaining;
let isGameOver = false;
let selectedNumbers = [];
let currentCell;
let cellCount = 3;

// 구구단 빙고 게임 시작 함수
function startGame(gugudan) {
  cellCount = gugudan;	
  resetGame();
  generateBingoBoard();
  startTimer();
}

// 빙고판 생성 함수
function generateBingoBoard() {
  const bingoBoard = document.getElementById("bingoBoard");
  bingoBoard.innerHTML = "";
  bingoBoard.style.gridTemplateColumns = "repeat(" + cellCount + ", 1fr)";

  const bingoProblems = getShuffledBingoProblems();

  for (let i = 0; i < bingoProblems.length; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = bingoProblems[i];
	cell.style.width = "calc(" + (29- (cellCount-3)*6) +"vw - 20px)";
	cell.style.height = cell.style.width;
	cell.style.fontSize = (10 - cellCount) +"vw";

    cell.addEventListener("click", () => checkNumber(cell));
    bingoBoard.appendChild(cell);
  }

  // 빙고판 셀 순서 랜덤 섞기
  for (let i = bingoBoard.children.length; i >= 0; i--) {
    bingoBoard.appendChild(bingoBoard.children[Math.random() * i | 0]);
  }
}

// 구구단에 해당하는 빙고 문제 배열 생성 함수
function getShuffledBingoProblems() {
  const bingoProblems = [];

  // 해당 구구단의 모든 문제를 배열에 추가
  for (let i = 1; i <= cellCount * cellCount; i++) {
    let gu1 = Math.ceil(Math.random()*9);  
    let gu2 = Math.ceil(Math.random()*9);  
    bingoProblems.push(`${gu1} x ${gu2}`);
  }

  return bingoProblems;
}

// 숫자 체크 함수
function checkNumber(cell) {
  if (!isGameOver && !selectedNumbers.includes(cell.textContent)) {
  if (cell.classList.length>1) return;  
    currentCell = cell;
    openInputModal();
  }
}

// 결과 입력 모달 열기
function openInputModal() {
  const inputModal = document.getElementById("inputModal");
  inputModal.style.display = "flex";
  const inputText = document.getElementById("result");
  inputText.focus();
  inputText.value="";
}

// 결과 입력 모달 닫기
function closeInputModal() {
  const inputModal = document.getElementById("inputModal");
  inputModal.style.display = "none";
  currentCell = null;
}

function handleInputKeyDown(event) {
  if (event.key === "Enter") {
    submitResult();
  }
}

// 결과 입력 처리 함수
function submitResult() {
  const inputResult = document.getElementById("result").value;
  if (inputResult.trim() === "") return;
  
    const result = eval(currentCell.textContent.replace("x", "*"));
    if (Number(inputResult) === result) {
      selectedNumbers.push(currentCell.textContent);
      currentCell.classList.add("marked");
      checkBingo();
    } else {
      currentCell.classList.add("wrong");
    }

    closeInputModal();
  
}

// 빙고 여부 확인 함수
function checkBingo() {
  const bingoBoard = document.getElementById("bingoBoard");
  const cells = bingoBoard.getElementsByClassName("cell");

  for (let i = 0; i < cellCount; i++) {
    if ( horizonBingo(cells, i*cellCount) || verticalBingo(cells, i)) {
      isGameOver = true;
      stopTimer();
      displayGameOverMessage(true);  
      return;
    }
  }

  if ( diagonal_1(cells) || diagonal_2(cells)) {
    isGameOver = true;
    stopTimer();
    displayGameOverMessage(true);  
  }
}


// 가로줄 빙고 확인
function horizonBingo(cells, index) {
  for (let i = 0; i < cellCount; i++) {
	  //console.info(`horizonBingo ${index+i}`);
    if (!cells[index+i].classList.contains("marked")) return false;
  }
  return true;
}
  // 세로줄 빙고 확인
function verticalBingo(cells, index) {
  for (let i = 0; i < cellCount; i++) {
	//console.info(`verticalBingo ${index+i*cellCount}`);
    if (!cells[index+i*cellCount].classList.contains("marked")) return false;
  }
  return true;
}
 // 대각선 빙고 확인
function diagonal_1(cells) {
  for (let i = 0; i < cellCount; i++) {
	//console.info(`diagonal_1 ${i * (cellCount+1)}`);
    if (!cells[i * (cellCount+1)].classList.contains("marked")) return false;
  }
  return true;
}

function diagonal_2(cells) {
  for (let i = 1; i <= cellCount; i++) {
	//console.info(`diagonal_2 ${i * (cellCount-1)}`);
    if (!cells[i * (cellCount-1)].classList.contains("marked")) return false;
  }
  return true;
}

// 게임 종료 메시지 표시 함수
function displayGameOverMessage(isBingo) {
  showModal(isBingo ? "축하합니다! 빙고를 완성하셨습니다." : "실패했습니다! 조금더 노력합시다.");
}

// 메시지 모달 창 표시 함수
function showModal(message) {
  const messageModal = document.getElementById("messageModal");
  const messageText = document.getElementById("messageText");
  messageText.textContent = message;
  messageModal.style.display = "flex";
}

// 메시지 모달 창 닫기 함수
function closeMessageModal() {
  const messageModal = document.getElementById("messageModal");
  messageModal.style.display = "none";
}

// 타이머 시작 함수
function startTimer() {
  timeRemaining = 10 * cellCount;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();
    if (timeRemaining === 0) {
      stopTimer();
      isGameOver = true;
      displayGameOverMessage(false);
    }
  }, 1000);
}

// 타이머 업데이트 함수
function updateTimerDisplay() {
  const timerDisplay = document.getElementById("timerDisplay");
  timerDisplay.textContent = `${timeRemaining}초`;
  const timerGauge = document.getElementById("timerGauge");
  const gaugeWidth = (timeRemaining / (10*cellCount)) * 100;
  timerGauge.style.width = `${gaugeWidth}%`;  
}

// 타이머 정지 함수
function stopTimer() {
  clearInterval(timerInterval);
}

// 게임 초기화 함수
function resetGame() {
  stopTimer();
  timeRemaining = 10 * cellCount;
  isGameOver = false;
  selectedNumbers = [];
  currentCell = null;

  const bingoBoard = document.getElementById("bingoBoard");
  bingoBoard.innerHTML = "";

  const cells = document.getElementsByClassName("cell");
  for (let i = 0; i < cells.length; i++) {
    cells[i].classList.remove("marked", "wrong");
  }

  closeInputModal();
  closeMessageModal();
}


startGame(3);