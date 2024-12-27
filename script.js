const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 600;

// Game variables
let rama = { 
    x: 50, 
    y: 300, 
    width: 75, 
    height: 75, 
    speed: 5, 
    isAttacking: false 
};
let enemies = [];
let arrows = [];
let score = 0;
let highestScore = 0;
let isGameOver = false;
let wasAttacking = false; // Tracks the previous attacking state

// Load images
const ramaRelaxedImg = new Image();
ramaRelaxedImg.src = './assets/images/rama_relaxed.png';

const ramaAttackImg = new Image();
ramaAttackImg.src = './assets/images/rama_attack.png';

const enemyImg = new Image();
enemyImg.src = './assets/images/enemy.png';

const enemy2Img = new Image();
enemy2Img.src = './assets/images/enemy2.png';

const enemy3Img = new Image();
enemy3Img.src = './assets/images/enemy3.png';

const enemy4Img = new Image();
enemy4Img.src = './assets/images/enemy4.png';

const arrowImg = new Image();
arrowImg.src = './assets/images/arrow.png';


// Event listeners
document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp" && rama.y > 0) rama.y -= 20; // Restrict movement off-screen
    if (e.code === "ArrowDown" && rama.y < canvas.height - rama.height) rama.y += 20; // Restrict movement off-screen
    if (e.code === "Space") rama.isAttacking = true;
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") rama.isAttacking = false;
});

// Functions
function drawHalo(x, y, width, height) {
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = "yellow";
    ctx.strokeStyle = "rgba(255, 255, 0, 0.5)";
    ctx.lineWidth = 10;
    ctx.strokeRect(x - 5, y - 5, width + 10, height + 10); // Slightly larger than Shree Ram
    ctx.restore();
}

function drawRama() {
    drawHalo(rama.x, rama.y, rama.width, rama.height);
    const ramaImg = rama.isAttacking ? ramaAttackImg : ramaRelaxedImg;
    ctx.drawImage(ramaImg, rama.x, rama.y, rama.width, rama.height);
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        const enemyImgToDraw = enemy.type === 1 ? enemyImg : (enemy.type === 2 ? enemy2Img : (enemy.type === 3 ? enemy3Img : enemy4Img));
        ctx.drawImage(enemyImgToDraw, enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.x -= enemy.speed;

        if (enemy.x < -enemy.width) enemies.splice(index, 1);
        if (checkCollision(rama, enemy)) isGameOver = true;
    });
}

function drawArrows() {
    arrows.forEach((arrow, arrowIndex) => {
        ctx.save(); // Save the current drawing state

        // Glow/hallo effect
        ctx.shadowBlur = 8;
        ctx.shadowColor = "yellow";

        ctx.drawImage(arrowImg, arrow.x, arrow.y-16, arrow.width * 4, arrow.height * 4); 

        ctx.restore(); // Restore the drawing state to remove the glow effect from other elements

        // Arrow movementt
        arrow.x += arrow.speed;

        // Remove the arrow when it goes off-screen
        if (arrow.x > canvas.width) arrows.splice(arrowIndex, 1);

        // Check for collisions with enemies
        enemies.forEach((enemy, enemyIndex) => {
            if (checkCollision(arrow, enemy)) {
                enemy.health -= 1;
                if (enemy.health <= 0) {
                    enemies.splice(enemyIndex, 1);
                    score += enemy.type === 1 ? 10 : (enemy.type === 2 ? 20 : (enemy.type === 3 ? 30 : 50));
                }
                arrows.splice(arrowIndex, 1); // Remove the arrow after hitting an enemy
            }
        });
    });
}




// function spawnEnemy() {
//     const randomValue = Math.random();
//     let enemyType = randomValue < 0.6 ? 1 : (randomValue < 0.9 ? 2 : 3);
//     const enemy = {
//         x: canvas.width,
//         y: Math.random() * (canvas.height - 50),
//         width: 50,
//         height: 50,
//         speed: enemyType === 1 ? 3 : (enemyType === 2 ? 2 : 1.5),
//         type: enemyType,
//         health: enemyType === 1 ? 1 : (enemyType === 2 ? 2 : 3)
//     };
//     enemies.push(enemy);
// }
function spawnEnemy() {
    const randomValue = Math.random();
    let enemyType = randomValue < 0.3 ? 1 : (randomValue < 0.6 ? 2 : (randomValue < 0.9 ? 3 : 4));
    const enemy = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 50),
        width: enemyType === 1 ? 40 : (enemyType === 2 ? 80 : (enemyType === 3 ? 150 : 250)),
        height: enemyType === 1 ? 40 : (enemyType === 2 ? 80 : (enemyType === 3 ? 150 : 250)),
        speed: enemyType === 1 ? 4 : (enemyType === 2 ? 3 : (enemyType === 3 ? 2 : 1)),
        type: enemyType,
        health: enemyType === 1 ? 1 : (enemyType === 2 ? 2 : (enemyType === 3 ? 3 : 10))
    };
    enemies.push(enemy);
}

function shootArrow() {
    const arrow = { x: rama.x + rama.width, y: rama.y + rama.height / 2 - 5, width: 20, height: 5, speed: 20 };
    arrows.push(arrow);
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function showGameOverPopup() {
    // Display the popup
    document.getElementById("scoreDisplay").innerText = `Your Score: ${score}`;
    highestScore = Math.max(highestScore, score);
    document.getElementById("highScoreDisplay").innerText = `Highest Score: ${highestScore}`;
    document.getElementById("gameOverPopup").classList.remove("hidden"); // Show popup
}

function restartGame() {
    score = 0;
    isGameOver = false;
    enemies = [];
    arrows = [];
    rama.y = 300;
    document.getElementById("gameOverPopup").classList.add("hidden"); // Hide popup
}

document.getElementById("playAgainButton").addEventListener("click", restartGame);

function update() {
    if (isGameOver) {
        showGameOverPopup(); // Only show the popup when the game is over
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (wasAttacking && !rama.isAttacking) shootArrow();
    wasAttacking = rama.isAttacking;

    drawRama();
    drawEnemies();
    drawArrows();

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

setInterval(spawnEnemy, 2000);
setInterval(update, 1000 / 60);
