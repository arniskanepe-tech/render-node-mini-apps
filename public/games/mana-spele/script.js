const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let compare = [];
let message = "";
let isChecking = false;
let bestScore = 0;
let currentScore = 0;

let now = 60;
let timerMessage = "";
let space = "";

let W = 250;
let H = 250;
let xPositions = [300, 600, 900, 1200, 1500];
let yPositions = [250, 550, 850, 1150];
//50
let timerId = null;

const music = new Audio("Background.mp3");
music.loop = true;
music.volume = 0.5;

const frontImages = {
    1: "sky/earth.png",
    2: "sky/jupiter.png",
    3: "sky/mars.png",
    4: "sky/mercury.png",
    5: "sky/moon.png",
    6: "sky/neptune.png",
    7: "sky/saturn.png",
    8: "sky/star.png",
    9: "sky/uranus.png",
    10:"sky/venus.png"
};

const loadedFrontImages = {};
for (let val = 1; val <= 10; val++) {
    const img = new Image();
    img.src = frontImages[val];
    loadedFrontImages[val] = img;
}


const imgBack = new Image();
imgBack.src = "blue.png";

function getPointer(e) {  //ŠEIT---------------------------------------------------------
  const rect = canvas.getBoundingClientRect();

  // kompensē 5px borderu, lai nebūtu nobīdes
  const cs = getComputedStyle(canvas);
  const bl = parseFloat(cs.borderLeftWidth)  || 0;
  const bt = parseFloat(cs.borderTopWidth)   || 0;
  const br = parseFloat(cs.borderRightWidth) || 0;
  const bb = parseFloat(cs.borderBottomWidth)|| 0;

  const cssW = rect.width  - bl - br;             // redzamais platums bez bordera
  const cssH = rect.height - bt - bb;             // redzamais augstums bez bordera
  const scaleX = canvas.width  / cssW;            // 2000 / redzamais platums
  const scaleY = canvas.height / cssH;            // 1600 / redzamais augstums

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;

  return {
    x: (clientX - rect.left - bl) * scaleX,
    y: (clientY - rect.top  - bt) * scaleY
  };
}

// Shuffle utility
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}



// Timer
function startTimer() {
    if (timerId !== null) return;
    timerId = setInterval(() => {
        if(now > 0){
            now--;
            music.play();
            timerMessage = now + " seconds left";
        } else {
            clearInterval(timerId);
            timerId = null;
            timerMessage = "Time is up";
            space = "press space to restart";
            music.pause();
            music.currentTime = 0;
        }
    }, 1000);
}

function stopTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
    }
}

// Initialize rectangles and values
let values = [];
for (let i = 1; i <= 10; i++) values.push(i, i);
shuffleArray(values);

let rects = [];
let index = 0;
for (let xi = 0; xi < xPositions.length; xi++) {
    for (let yi = 0; yi < yPositions.length; yi++) {
        rects.push({
            x: xPositions[xi],
            y: yPositions[yi],
            value: values[index],
            color: "black" // black = hidden, red = revealed, #5a0e0d = matched
        });
        index++;
    }
}

// Restart game
function restartGame() {
    space = "";
    music.play();
    compare = [];
    message = "";
    isChecking = false;
    now = 60;
    currentScore = 0;
    timerMessage = "";
    stopTimer();

    rects.forEach(rect => rect.color = "black");

    let newValues = [];
    for (let i = 1; i <= 10; i++) newValues.push(i, i);
    shuffleArray(newValues);

    rects.forEach((rect, idx) => rect.value = newValues[idx]);
}

// Win check
function checkWin() {
    return rects.every(rect => rect.color === "#5a0e0d");
}

// Draw all cards
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rects.forEach(rect => {
        if (rect.color === "black") {
            ctx.drawImage(imgBack, rect.x, rect.y, W, H); // back of card
        } else if (rect.color === "red") {
            const frontImg = loadedFrontImages[rect.value]; // get image for this card’s value
    ctx.drawImage(frontImg, rect.x, rect.y, W, H);
        } else if (rect.color === "#5a0e0d") {
            ctx.clearRect(rect.x, rect.y, W, H); // matched — disappear
        }
    });

    // Score
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Score: " + currentScore, 50, 150);
    ctx.fillText("Best: " + bestScore, 50, 200);

    // Timer
    if (timerMessage) {
        ctx.fillText(timerMessage, 900, 100);
    }

    // Win message
    if (message) {
        ctx.font = "bold 80px Arial";
        ctx.fillText(message, 800, 750);
    }

    if (space) {
        ctx.font = "bold 80px Arial";
		ctx.fillStyle = "white";
        ctx.fillText(space, 600, 850);
    }

    requestAnimationFrame(draw);
}

draw();

// Keyboard for restart
document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
        restartGame();
    }
});

// Click handling
canvas.addEventListener("click", (e) => {
    if (timerId === null) startTimer();
    if (isChecking) return;

    const { x: mouseX, y: mouseY } = getPointer(e); // ← svarīgi! //seit=-------------------------------------

    rects.forEach(rect => {
        if (
            mouseX >= rect.x &&
            mouseX <= rect.x + W &&
            mouseY >= rect.y &&
            mouseY <= rect.y + H
        ) {
            if (rect.color === "black" && compare.length < 2) {
                rect.color = "red";
                compare.push(rect);
            }
        }
    });

    if (compare.length === 2) {
        isChecking = true;
        if (compare[0].value === compare[1].value) {
            setTimeout(() => {
                compare.forEach(r => r.color = "#5a0e0d");
                currentScore += 10;
                compare = [];
                isChecking = false;

                if (checkWin()) {
                    music.pause();
                    music.currentTime = 0;
                    stopTimer();
                    if (now > 0) currentScore += now;

                    message = "YOU WIN!";
                    space = "press space to restart";

                    if (currentScore > bestScore) bestScore = currentScore;
                }
            }, 1000);
        } else {
            setTimeout(() => {
                compare.forEach(r => r.color = "black");
                compare = [];
                isChecking = false;
            }, 1000);
        }
    }

});

