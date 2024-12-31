// Reference to the main menu and canvas
const mainMenu = document.getElementById('mainMenu');
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameState = "mainMenu"; // Can be 'mainMenu' or 'gameRunning' or 'popup'

// Current level selected
let currentLevel = 1;

function startGame(level) {
    gameState = "gameRunning"; // Set game state to running
    currentLevel = level;

    // Hide the main menu entirely
    mainMenu.style.display = 'none';

    // Show the canvas for the game
    canvas.style.display = 'block';
    
    // Play level audio
    playLevelAudio(level);

    // Initialize the game logic for the selected level
    initializeGame(level);
}


// Initialize the game based on the selected level
function initializeGame(level) {
    let background;

    // Customize background based on the level
    switch (level) {
        case 1:
            background = './assets/images/background.jpg';
            break;
        case 2:
            background = './assets/images/background1.jpg';
            break;
        case 3:
            background = './assets/images/background3.jpg';
            break;
        case 4:
            background = './assets/images/background2.jpg';
            break;
        case 5:
            background = './assets/images/background4.jpg';
            break;
                
        default:
            background = './assets/images/background.jpg';
    }

    // Set canvas background
    canvas.style.backgroundImage = `url(${background})`;

    // Start the game loop (already implemented in your code)
    restartGame();
}




// Audio objects
const mainMenuAudio = new Audio('./assets/audio/background.mp3');
const levelAudio = [new Audio('./assets/audio/level1.mp3'), new Audio('./assets/audio/level1.mp3'), new Audio('./assets/audio/level2.mp3'), new Audio('./assets/audio/level3.mp3'), new Audio('./assets/audio/level4.mp3')];
const arrowRamAudio = new Audio('./assets/audio/arrowRam.mp3');
const arrowEnemyAudio = new Audio('./assets/audio/arrowEnemy.mp3');
const cancelArrowAudio = new Audio('./assets/audio/cancelArrow.mp3');
const enemyDiesAudio = new Audio('./assets/audio/enemyDies.mp3');
const enemyDiesAudioRavan = new Audio('./assets/audio/enemyDies3.mp3');
const enemyHurtAudio = new Audio('./assets/audio/enemyHurt.mp3');
const gameOverPopupAudio = new Audio('./assets/audio/popup.mp3');
const enemyAudio = [
    new Audio('./assets/audio/enemy2.mp3'),
    new Audio('./assets/audio/enemy.mp3'),
    new Audio('./assets/audio/enemy1.mp3'),
    new Audio('./assets/audio/enemy3.mp3'),
    new Audio('./assets/audio/enemy4.mp3')
];



//VOLUME: METHOD 1 (manual set karna)
// // Set volume for main menu audio
// mainMenuAudio.volume = 0.5; // 50% volume

// // Set volume for level audios
// levelAudio.forEach(audio => {
//     audio.volume = 0.2; // 70% volume
// });

// // Set volume for sound effects
// arrowRamAudio.volume = 0.8; // 80% volume
// arrowEnemyAudio.volume = 0.2;
// cancelArrowAudio.volume = 0.6;
// enemyDiesAudio.volume = 0.7;
// enemyHurtAudio.volume = 0.7;
// gameOverPopupAudio.volume = 1.0; // Full volume

// // Set volume for enemy sounds
// enemyAudio.forEach(audio => {
//     audio.volume = 0.4; // 40% volume
// });
// enemyAudio[4].volume=1;


// //METHOD 2: DYNAMICALLY SET KARNA
function setGlobalVolume(volumeLevel) {
    // Ensure the volume level is between 0.0 and 1.0
    volumeLevel = Math.max(0, Math.min(volumeLevel, 1));

    mainMenuAudio.volume = volumeLevel;
    levelAudio.forEach(audio => audio.volume = volumeLevel);
    arrowRamAudio.volume = volumeLevel;
    arrowEnemyAudio.volume = volumeLevel;
    cancelArrowAudio.volume = volumeLevel;
    enemyDiesAudio.volume = volumeLevel;
    enemyDiesAudioRavan.volume = volumeLevel;
    enemyHurtAudio.volume = volumeLevel;
    gameOverPopupAudio.volume = volumeLevel;
    enemyAudio.forEach(audio => audio.volume = volumeLevel);
}

// Example usage
// setGlobalVolume(0.5); // Set all audio to 50% volume







// Function to play background audio for the main menu
function playMainMenuAudio() {
    mainMenuAudio.loop = true;
    mainMenuAudio.play();
}

document.addEventListener("DOMContentLoaded", () => {
    mainMenuAudio.loop = true;
    mainMenuAudio.play().catch(err => console.error("Audio autoplay blocked:", err));
});

// Function to play level audio
function playLevelAudio(level) {
    if (mainMenuAudio) mainMenuAudio.pause();
    levelAudio.forEach((audio, index) => {
        if (audio) audio.pause();
        if (index === level && audio) {
            audio.loop = true;
            audio.play();
        }
    });
} 

// Function to play audio effects
// function playAudioEffect(audio) {
//     if (audio) {
//         const clone = audio.cloneNode(); // Avoid overlapping
//         clone.play();
//     }
// }
function playAudioEffect(audio) {
    if (!audio) {
        console.error("Invalid audio passed to playAudioEffect");
        return;
    }
    try {
        const clone = audio.cloneNode(); // Avoid overlapping
        clone.play();
    } catch (error) {
        console.error("Error playing audio effect:", error);
    }
}

function playEnemyAudio(enemyType) {
    // enemyAudio.forEach((audio, index) => {
    //     if (audio) audio.pause();
    //     if (index === enemyType && audio) {
    //         audio.loop = true;
    //         audio.play();
    //     }
    // });
    enemyAudio[enemyType].loop = true;
    enemyAudio[enemyType].play();
}


// Function to play background audio for the Popup when the game is over
function playgameOverPopupAudio() {
    gameOverPopupAudio.loop = true;
    gameOverPopupAudio.play();
}

canvas.width = 1200;
canvas.height = 600;

// Game variables
let rama = { 
    x: 50, 
    y: 300, 
    width: 75, 
    height: 75, 
    speed: 5, 
    isAttacking: false,
    health: 10, // Health starts at 100% 
    maxHealth: 10,
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

// Load enemy projectile images
const arrowEnemyImg = new Image();
arrowEnemyImg.src = './assets/images/arrow_enemy1.png';

const fireballImg = new Image();
fireballImg.src = './assets/images/fire.png';

const lighteningImg = new Image();
lighteningImg.src = './assets/images/lightening.png';

// Enemy projectiles array
let enemyProjectiles = [];


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

function drawHealthBar(x, y, width, health, color,maxHealth) {
    // const barWidth = width * (health/10); // Health bar proportional to health(health/10, because 10 is the max health kyuki)
    const barWidth = width * (health/maxHealth);
    const barHeight = 10; // Height of the health bar

    // Draw the background (gray for remaining health space)
    ctx.fillStyle = "gray";
    ctx.fillRect(x, y - 10, width, barHeight);

    // Draw the actual health (green or red depending on character)
    ctx.fillStyle = color;
    ctx.fillRect(x, y - 10, barWidth, barHeight);
}


function drawRama() {
    drawHalo(rama.x, rama.y, rama.width, rama.height);
    const ramaImg = rama.isAttacking ? ramaAttackImg : ramaRelaxedImg;
    ctx.drawImage(ramaImg, rama.x, rama.y, rama.width, rama.height);
    drawHealthBar(rama.x, rama.y, rama.width, rama.health, "green",rama.maxHealth);
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        const enemyImgToDraw = enemy.type === 1 ? enemyImg : (enemy.type === 2 ? enemy2Img : (enemy.type === 3 ? enemy3Img : enemy4Img));
        ctx.drawImage(enemyImgToDraw, enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.x -= enemy.speed;

        drawHealthBar(enemy.x, enemy.y, enemy.width, enemy.health, "red",enemy.maxHealth);

        if (enemy.x < -enemy.width){ 
            enemies.splice(index, 1);
            // Pause the enemy audio
            enemyAudio[enemy.type].pause();
            enemyAudio[enemy.type].currentTime = 0; // Reset audio playback position
        }
        if (checkCollision(rama, enemy)) ramaTakesDamage(1);    
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
                playAudioEffect(enemyHurtAudio);
                if (enemy.health <= 0) {
                    enemies.splice(enemyIndex, 1);
                    score += enemy.type === 1 ? 10 : (enemy.type === 2 ? 20 : (enemy.type === 3 ? 30 : 50));
                    enemy.type === 4 ? playAudioEffect(enemyDiesAudioRavan) : playAudioEffect(enemyDiesAudio);
                    
                    
                    // Pause the enemy audio
                    enemyAudio[enemy.type].pause();
                    enemyAudio[enemy.type].currentTime = 0; // Reset audio playback position

                          
                }
                arrows.splice(arrowIndex, 1); // Remove the arrow after hitting an enemy
            }
        });
    });
}


// Function to spawn an enemy projectile
function enemyShoot(enemy) {
    const projectile = {
        x: enemy.x,
        y: enemy.y + enemy.height / 2 - 5,
        width: 50,
        height: 50,
        width: enemy.type === 1 ? 40 : (enemy.type === 2 ? 50 : (enemy.type === 3 ? 60 : 100)),
        height: enemy.type === 1 ? 40 : (enemy.type === 2 ? 50 : (enemy.type === 3 ? 60 : 100)),
        speed: 5,
        // type: Math.random() < 0.5 ? 'arrow' : 'fireball' // Randomly choose between arrow or fireball
        type: enemy.type === 1 ? 'fireball' : (enemy.type === 2 ? 'fireball' : (enemy.type === 3 ? 'lightening' : 'arrow')), // According to the type of enemy
    };
    enemyProjectiles.push(projectile);
    playEnemyAudio(enemy.type);// Play enemy projectile sound
}

// Update and draw enemy projectiles
function drawEnemyProjectiles() {
    enemyProjectiles.forEach((projectile, index) => {
        // Choose the image based on projectile type
        const projectileImg = projectile.type === 'arrow' ? arrowEnemyImg : (projectile.type === 'fireball' ? fireballImg: lighteningImg);

        // Draw the projectile
        ctx.drawImage(projectileImg, projectile.x, projectile.y-20, projectile.width, projectile.height);

        // Move the projectile
        projectile.x -= projectile.speed;

        // Remove projectiles that go off-screen
        if (projectile.x < -projectile.width) {
            enemyProjectiles.splice(index, 1);
        }

        // Check for collision with Rama
        if (checkCollision(projectile, rama)) {
            ramaTakesDamage(1); // Trigger game over
            enemyProjectiles.splice(index, 1); // Remove the projectile
        }
    });
}

// Modify the enemy spawning function to make them shoot
function spawnEnemy() {
    if (gameState !== "gameRunning") return; // Only spawn enemies if the game is running
    const randomValue = Math.random();
    let enemyType = randomValue < 0.3 ? 1 : (randomValue < 0.6 ? 2 : (randomValue < 0.9 ? 3 : 4));
    const enemy = {
        x: canvas.width,
        y: Math.random() * (canvas.height - 50),
        width: enemyType === 1 ? 40 : (enemyType === 2 ? 80 : (enemyType === 3 ? 150 : 250)),
        height: enemyType === 1 ? 40 : (enemyType === 2 ? 80 : (enemyType === 3 ? 150 : 250)),
        speed: enemyType === 1 ? 4 : (enemyType === 2 ? 3 : (enemyType === 3 ? 2 : 1)),
        type: enemyType,
        health: enemyType === 1 ? 1 : (enemyType === 2 ? 2 : (enemyType === 3 ? 3 : 10)),
        maxHealth: enemyType === 1 ? 1 : (enemyType === 2 ? 2 : (enemyType === 3 ? 3 : 10))
    };
    enemies.push(enemy);

    playEnemyAudio(enemyType);
    
    // Make the enemy shoot periodically
    setInterval(() => {
        if (enemies.includes(enemy) && !isGameOver && gameState === "gameRunning") {
            enemyShoot(enemy);
            
            // enemyAudio.forEach((audio, index) => {
            //     if (audio) audio.pause();
            //     if (index === level && audio) {
            //         audio.loop = true;
            //         audio.play();
            //     }
            // }
        }
    }, 2000 + Math.random() * 1000); // Random delay for shooting
}

function shootArrow() {
    const arrow = { x: rama.x + rama.width, y: rama.y + rama.height / 2 - 5, width: 20, height: 5, speed: 20 };
    arrows.push(arrow);
    playAudioEffect(arrowRamAudio); // Play Rama's arrow sound
}


function ramaTakesDamage(damage) {
    rama.health -= damage;
    if (rama.health <= 0) {
        rama.health = 0; // Ensure health does not go below 0
        isGameOver = true; // Trigger game over when health reaches 0
        showGameOverPopup();
    }
}

function enemyTakesDamage(enemyIndex, damage) {
    enemies[enemyIndex].health -= damage;
    if (enemies[enemyIndex].health <= 0) {
        // Pause all enemy audio
        enemyAudio.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0; // Reset audio playback position
            }
        });
        enemies.splice(enemyIndex, 1); // Remove enemy if health is 0
        playAudioEffect(enemyDiesAudio);
    }
    else playAudioEffect(enemyHurtAudio);
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
    
    
    // Pause all enemy audio
    enemyAudio.forEach(audio => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset audio playback position
        }
    });
}

// Restart game logic
function restartGame() {
    score = 0;
    isGameOver = false;
    enemies = [];
    arrows = [];
    rama.y = 300;
    rama.health=10;
    enemyProjectiles = []; // Clear enemy projectiles
    
    // Stop all level audio
    levelAudio.forEach(audio => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset audio playback position
        }
    });
    if (gameOverPopupAudio) gameOverPopupAudio.pause();

    // Pause all enemy audio
    enemyAudio.forEach(audio => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset audio playback position
        }
    });
    
    // mainMenuAudio.volume = 0.5;
    // levelAudio.forEach(audio => {
    //     if (audio) audio.volume = 0.5;
    // });

    playLevelAudio(currentLevel);

    // Hide the game over popup and start the update loop
    document.getElementById('gameOverPopup').classList.add('hidden');
    update();
}

function backToMainMenu() {

    gameState = "mainMenu"; // Set the game state to main menu

    score = 0;
    isGameOver = true;
    enemies = [];
    arrows = [];
    rama.y = 300;
    rama.health=10;
    enemyProjectiles = []; // Clear enemy projectiles
    
    // Hide the game over popup and start the update loop
    document.getElementById('gameOverPopup').classList.add("hidden");
    
    mainMenu.style.display = 'block';
    document.getElementById("gameOverPopup").style.display = 'none';
    canvas.style.display = 'none';

    // // Pause all level audio
    // levelAudio.forEach(audio => {
    //     if (audio) {
    //         audio.pause();
    //         audio.currentTime = 0; // Reset audio playback position
    //     }
    // });
    // Stop level audio
    if (levelAudio[currentLevel]) levelAudio[currentLevel].pause();
    if (gameOverPopupAudio) gameOverPopupAudio.pause();

    // Pause all enemy audio
    enemyAudio.forEach(audio => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0; // Reset audio playback position
        }
    });

    // Play main menu audio on initial load
    playMainMenuAudio();
    
    // update();
}

document.getElementById("playAgainButton").addEventListener("click", restartGame);
document.getElementById("backToMainMenuButton").addEventListener("click", backToMainMenu);


function update() {

    if (gameState !== "gameRunning") return; // Stop the update loop if not in gameRunning state

    // if (isGameOver) {
    //     showGameOverPopup(); // Only show the popup when the game is over
    //    // Pause all level audio
    //     levelAudio.forEach(audio => {
    //         if (audio) {
    //             audio.pause();
    //             audio.currentTime = 0; // Reset audio playback position
    //         }
    //     });

    //     return;
    // }

    if (isGameOver) {
        showGameOverPopup();
        playgameOverPopupAudio(gameOverPopupAudio);
        if (levelAudio[currentLevel]) levelAudio[currentLevel].pause();
        // Pause all enemy audio
        enemyAudio.forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0; // Reset audio playback position
            }
        });
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (wasAttacking && !rama.isAttacking) shootArrow();
    wasAttacking = rama.isAttacking;
    
    drawRama();
    drawEnemies();
    drawEnemyProjectiles();
    drawArrows();
    
    // Handle collisions
    arrows.forEach((arrow, arrowIndex) => {
        enemyProjectiles.forEach((projectile, projectileIndex) => {
            if (checkCollision(arrow, projectile)) {
                arrows.splice(arrowIndex, 1);
                enemyProjectiles.splice(projectileIndex, 1);
                playAudioEffect(cancelArrowAudio); // Play cancel sound
            }
        });
    });

    enemyProjectiles.forEach((projectile, index) => {
        if (checkCollision(rama, projectile)) {
            isGameOver = true;
            enemyProjectiles.splice(index, 1);
        }
    });

    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

playMainMenuAudio();

setInterval(spawnEnemy, 2000);
setInterval(update, 1000 / 60);