// 변수 및 초기화
let timerInterval;
let timeRemaining;
let isGameOver = false;
let selectedNumbers = [];
let currentCell;

// 구구단 빙고 게임 시작 함수
function startGame(gugudan) {
  resetGame();
  generateBingoBoard(gugudan);
  startTimer();
}

// 빙고판 생성 함수
function generateBingoBoard(gugudan) {
  const bingoBoard = document.getElementById("bingoBoard");
  bingoBoard.innerHTML = "";

  const bingoProblems = getShuffledBingoProblems(gugudan);

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.textContent = bingoProblems[i];
    cell.addEventListener("click", () => checkNumber(cell));
    bingoBoard.appendChild(cell);
  }

  // 빙고판 셀 순서 랜덤 섞기
  for (let i = bingoBoard.children.length; i >= 0; i--) {
    bingoBoard.appendChild(bingoBoard.children[Math.random() * i | 0]);
  }
}

// 구구단에 해당하는 빙고 문제 배열 생성 함수
function getShuffledBingoProblems(gugudan) {
  const bingoProblems = [];
  const allProblems = [];

  // 해당 구구단의 모든 문제를 배열에 추가
  for (let i = 1; i <= 9; i++) {
    allProblems.push(`${gugudan} x ${i}`);
  }

  // 문제 배열을 랜덤하게 섞어서 빙고 문제 배열로 생성
  while (allProblems.length > 0) {
    const randomIndex = Math.floor(Math.random() * allProblems.length);
    bingoProblems.push(allProblems.splice(randomIndex, 1)[0]);
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

  let isBingo = false;

  // 가로줄 빙고 확인
  for (let i = 0; i < 9; i += 3) {
    if (
      cells[i].classList.contains("marked") &&
      cells[i + 1].classList.contains("marked") &&
      cells[i + 2].classList.contains("marked")
    ) {
      isBingo = true;
    }
  }

  // 세로줄 빙고 확인
  for (let i = 0; i < 3; i++) {
    if (
      cells[i].classList.contains("marked") &&
      cells[i + 3].classList.contains("marked") &&
      cells[i + 6].classList.contains("marked")
    ) {
      isBingo = true;
    }
  }

  // 대각선 빙고 확인
  if (
    cells[0].classList.contains("marked") &&
    cells[4].classList.contains("marked") &&
    cells[8].classList.contains("marked")
  ) {
    isBingo = true;
  }

  if (
    cells[2].classList.contains("marked") &&
    cells[4].classList.contains("marked") &&
    cells[6].classList.contains("marked")
  ) {
    isBingo = true;
  }

  if (isBingo) {
    isGameOver = true;
    stopTimer();
    displayGameOverMessage(true);
  }
}

// 게임 종료 메시지 표시 함수
function displayGameOverMessage(isBingo) {
  showModal(isBingo ? "<span>😍</span> Bingo" : "<span>💥</span> try again.");  
}

// 메시지 모달 창 표시 함수
function showModal(message) {
  const messageModal = document.getElementById("messageModal");
  const messageText = document.getElementById("messageText");
  messageText.innerHTML = message;
  messageModal.style.display = "flex";
}

// 메시지 모달 창 닫기 함수
function closeMessageModal() {
  const messageModal = document.getElementById("messageModal");
  messageModal.style.display = "none";
}

// 타이머 시작 함수
function startTimer() {
  timeRemaining = 30;
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
  const gaugeWidth = (timeRemaining / 30) * 100;
  timerGauge.style.width = `${gaugeWidth}%`;  
}

// 타이머 정지 함수
function stopTimer() {
  clearInterval(timerInterval);
}

// 게임 초기화 함수
function resetGame() {
  stopTimer();
  timeRemaining = 30;
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


startGame(2);