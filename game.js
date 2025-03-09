const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed}x`;
    levelDisplay.textContent = level;
}

function createTreasure() {
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    setTimeout(() => treasure.remove(), 5000);
}

function checkCollision() {
    const treasures = document.querySelectorAll('.treasure');
    treasures.forEach(t => {
        const tRect = t.getBoundingClientRect();
        const sRect = ship.getBoundingClientRect();
        if (sRect.left < tRect.right && sRect.right > tRect.left &&
            sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
            score += 10;
            t.remove();
            updateStats();
        }
    });
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10); break;
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop();
    }
});

pauseBtn.addEventListener('click', () => {
    isGameRunning = !isGameRunning;
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop() {
    if (!isGameRunning) return;
    checkCollision();
    if (Math.random() < 0.05) createTreasure();
    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
    }
    requestAnimationFrame(gameLoop);
}

moveShip();
updateStats();
const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;
let enemies = [];
let treasures = [];
let lastTreasureTime = 0;
let lastEnemyTime = 0;

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed}x`;
    levelDisplay.textContent = level;
}

function createTreasure(timestamp) {
    if (timestamp - lastTreasureTime < 2000 / speed) return;
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    treasures.push(treasure);
    lastTreasureTime = timestamp;
    setTimeout(() => {
        treasure.remove();
        treasures = treasures.filter(t => t !== treasure);
    }, 5000);
}

function createEnemy(timestamp) {
    if (timestamp - lastEnemyTime < 3000 / speed) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    enemy.style.left = '800px';
    enemy.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, x: 800 });
    lastEnemyTime = timestamp;
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.x -= 2 * speed;
        enemy.element.style.left = `${enemy.x}px`;
        if (enemy.x < -50) {
            enemy.element.remove();
            enemies.splice(index, 1);
        }
    });
}

function checkCollision(type) {
    const sRect = ship.getBoundingClientRect();
    if (type === 'treasure') {
        treasures.forEach((t, i) => {
            const tRect = t.getBoundingClientRect();
            if (sRect.left < tRect.right && sRect.right > tRect.left &&
                sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
                score += 10 * level;
                t.remove();
                treasures.splice(i, 1);
                updateStats();
            }
        });
    } else if (type === 'enemy') {
        enemies.forEach((e, i) => {
            const eRect = e.element.getBoundingClientRect();
            if (sRect.left < eRect.right && sRect.right > eRect.left &&
                sRect.top < eRect.bottom && sRect.bottom > eRect.top) {
                lives--;
                e.element.remove();
                enemies.splice(i, 1);
                updateStats();
            }
        });
    }
}

function levelUp() {
    if (score >= level * 50) {
        level++;
        speed += 0.5;
        updateStats();
    }
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10 * speed); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10 * speed); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10 * speed); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10 * speed); break;
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop(performance.now());
    }
});

pauseBtn.addEventListener('click', () => {
    isGameRunning = !isGameRunning;
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    moveEnemies();
    checkCollision('treasure');
    checkCollision('enemy');
    levelUp();

    if (Math.random() < 0.05) createTreasure(timestamp);
    if (Math.random() < 0.03) createEnemy(timestamp);

    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function initializeGame() {
    moveShip();
    updateStats();
    gameArea.style.background = 'url("space-bg.jpg") no-repeat center';
    gameArea.style.backgroundSize = 'cover';
}

initializeGame();
const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;
let enemies = [];
let treasures = [];
let bonuses = [];
let lastTreasureTime = 0;
let lastEnemyTime = 0;
let lastBonusTime = 0;
let invincible = false;
let gameTime = 0;

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
    if (invincible) ship.style.filter = 'brightness(2)';
    else ship.style.filter = 'brightness(1)';
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed.toFixed(1)}x`;
    levelDisplay.textContent = level;
}

function createTreasure(timestamp) {
    if (timestamp - lastTreasureTime < 2000 / speed) return;
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    treasures.push(treasure);
    lastTreasureTime = timestamp;
    setTimeout(() => {
        treasure.remove();
        treasures = treasures.filter(t => t !== treasure);
    }, 5000);
}

function createEnemy(timestamp, type = 'normal') {
    if (timestamp - lastEnemyTime < 3000 / speed) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    if (type === 'fast') enemy.classList.add('fast-enemy');
    enemy.style.left = '800px';
    enemy.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, x: 800, type });
    lastEnemyTime = timestamp;
}

function createBonus(timestamp) {
    if (timestamp - lastBonusTime < 15000 / speed) return;
    const bonus = document.createElement('div');
    bonus.classList.add('bonus');
    bonus.style.left = `${Math.random() * 750}px`;
    bonus.style.top = `${Math.random() * 450}px`;
    bonus.style.background = 'green';
    bonus.style.width = '25px';
    bonus.style.height = '25px';
    gameArea.appendChild(bonus);
    bonuses.push(bonus);
    lastBonusTime = timestamp;
    setTimeout(() => {
        bonus.remove();
        bonuses = bonuses.filter(b => b !== bonus);
    }, 7000);
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const speedFactor = enemy.type === 'fast' ? 4 : 2;
        enemy.x -= speedFactor * speed;
        enemy.element.style.left = `${enemy.x}px`;
        if (enemy.x < -50) {
            enemy.element.remove();
            enemies.splice(index, 1);
        }
    });
}

function checkCollision(type) {
    const sRect = ship.getBoundingClientRect();
    if (type === 'treasure') {
        treasures.forEach((t, i) => {
            const tRect = t.getBoundingClientRect();
            if (sRect.left < tRect.right && sRect.right > tRect.left &&
                sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
                score += 10 * level;
                t.remove();
                treasures.splice(i, 1);
                updateStats();
            }
        });
    } else if (type === 'enemy') {
        enemies.forEach((e, i) => {
            const eRect = e.element.getBoundingClientRect();
            if (sRect.left < eRect.right && sRect.right > eRect.left &&
                sRect.top < eRect.bottom && sRect.bottom > eRect.top) {
                if (!invincible) {
                    lives--;
                    e.element.remove();
                    enemies.splice(i, 1);
                    updateStats();
                }
            }
        });
    } else if (type === 'bonus') {
        bonuses.forEach((b, i) => {
            const bRect = b.getBoundingClientRect();
            if (sRect.left < bRect.right && sRect.right > bRect.left &&
                sRect.top < bRect.bottom && sRect.bottom > bRect.top) {
                activateBonus();
                b.remove();
                bonuses.splice(i, 1);
            }
        });
    }
}

function activateBonus() {
    invincible = true;
    setTimeout(() => invincible = false, 5000);
    lives = Math.min(lives + 1, 5);
    updateStats();
}

function levelUp() {
    if (score >= level * 50) {
        level++;
        speed += 0.5;
        updateStats();
        changeBackground();
    }
}

function changeBackground() {
    const backgrounds = [
        'url("space-bg.jpg")',
        'url("galaxy-bg.jpg")',
        'url("nebula-bg.jpg")'
    ];
    gameArea.style.background = backgrounds[level % 3] + ' no-repeat center';
    gameArea.style.backgroundSize = 'cover';
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10 * speed); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10 * speed); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10 * speed); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10 * speed); break;
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop(performance.now());
    }
});

pauseBtn.addEventListener('click', () => {
    isGameRunning = !isGameRunning;
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    gameTime += 16;
    moveEnemies();
    checkCollision('treasure');
    checkCollision('enemy');
    checkCollision('bonus');
    levelUp();

    if (Math.random() < 0.05) createTreasure(timestamp);
    if (Math.random() < 0.03) createEnemy(timestamp, 'normal');
    if (Math.random() < 0.01) createEnemy(timestamp, 'fast');
    if (Math.random() < 0.02) createBonus(timestamp);

    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function initializeGame() {
    moveShip();
    updateStats();
    gameArea.style.background = 'url("space-bg.jpg") no-repeat center';
    gameArea.style.backgroundSize = 'cover';
    addCustomStyles();
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fast-enemy {
            width: 30px;
            height: 30px;
            background: url('fast-meteor.png') no-repeat center;
            background-size: contain;
        }
        .bonus {
            border-radius: 50%;
            animation: pulse 1s infinite;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

initializeGame();
const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;
let enemies = [];
let treasures = [];
let bonuses = [];
let particles = [];
let lastTreasureTime = 0;
let lastEnemyTime = 0;
let lastBonusTime = 0;
let invincible = false;
let gameTime = 0;
let highScore = localStorage.getItem('highScore') || 0;

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
    if (invincible) ship.style.filter = 'brightness(2) drop-shadow(0 0 5px #fff)';
    else ship.style.filter = 'brightness(1)';
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed.toFixed(1)}x`;
    levelDisplay.textContent = level;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function createTreasure(timestamp) {
    if (timestamp - lastTreasureTime < 2000 / speed) return;
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    treasures.push(treasure);
    lastTreasureTime = timestamp;
    setTimeout(() => {
        treasure.remove();
        treasures = treasures.filter(t => t !== treasure);
    }, 5000);
    createParticles(treasure.style.left, treasure.style.top, 'yellow');
}

function createEnemy(timestamp, type = 'normal') {
    if (timestamp - lastEnemyTime < 3000 / speed) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    if (type === 'fast') enemy.classList.add('fast-enemy');
    else if (type === 'zigzag') enemy.classList.add('zigzag-enemy');
    enemy.style.left = '800px';
    enemy.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, x: 800, y: parseFloat(enemy.style.top), type, angle: 0 });
    lastEnemyTime = timestamp;
}

function createBonus(timestamp, type = 'life') {
    if (timestamp - lastBonusTime < 15000 / speed) return;
    const bonus = document.createElement('div');
    bonus.classList.add('bonus');
    bonus.style.left = `${Math.random() * 750}px`;
    bonus.style.top = `${Math.random() * 450}px`;
    bonus.dataset.type = type;
    if (type === 'life') bonus.style.background = 'green';
    else if (type === 'speed') bonus.style.background = 'purple';
    bonus.style.width = '25px';
    bonus.style.height = '25px';
    gameArea.appendChild(bonus);
    bonuses.push(bonus);
    lastBonusTime = timestamp;
    setTimeout(() => {
        bonus.remove();
        bonuses = bonuses.filter(b => b !== bonus);
    }, 7000);
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const speedFactor = enemy.type === 'fast' ? 4 : enemy.type === 'zigzag' ? 3 : 2;
        enemy.x -= speedFactor * speed;
        if (enemy.type === 'zigzag') {
            enemy.angle += 0.1;
            enemy.y += Math.sin(enemy.angle) * 5;
            enemy.element.style.top = `${enemy.y}px`;
        }
        enemy.element.style.left = `${enemy.x}px`;
        if (enemy.x < -50) {
            enemy.element.remove();
            enemies.splice(index, 1);
        }
    });
}

function createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = x;
        particle.style.top = y;
        particle.style.background = color;
        particle.style.width = '5px';
        particle.style.height = '5px';
        gameArea.appendChild(particle);
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            element: particle,
            x: parseFloat(x),
            y: parseFloat(y),
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            life: 1000
        });
    }
}

function moveParticles() {
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 16;
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = p.life / 1000;
        if (p.life <= 0) {
            p.element.remove();
            particles.splice(i, 1);
        }
    });
}

function checkCollision(type) {
    const sRect = ship.getBoundingClientRect();
    if (type === 'treasure') {
        treasures.forEach((t, i) => {
            const tRect = t.getBoundingClientRect();
            if (sRect.left < tRect.right && sRect.right > tRect.left &&
                sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
                score += 10 * level;
                t.remove();
                treasures.splice(i, 1);
                updateStats();
            }
        });
    } else if (type === 'enemy') {
        enemies.forEach((e, i) => {
            const eRect = e.element.getBoundingClientRect();
            if (sRect.left < eRect.right && sRect.right > eRect.left &&
                sRect.top < eRect.bottom && sRect.bottom > eRect.top) {
                if (!invincible) {
                    lives--;
                    e.element.remove();
                    enemies.splice(i, 1);
                    createParticles(e.x + 'px', e.y + 'px', 'red');
                    updateStats();
                }
            }
        });
    } else if (type === 'bonus') {
        bonuses.forEach((b, i) => {
            const bRect = b.getBoundingClientRect();
            if (sRect.left < bRect.right && sRect.right > bRect.left &&
                sRect.top < bRect.bottom && sRect.bottom > bRect.top) {
                activateBonus(b.dataset.type);
                b.remove();
                bonuses.splice(i, 1);
            }
        });
    }
}

function activateBonus(type) {
    if (type === 'life') {
        invincible = true;
        setTimeout(() => invincible = false, 5000);
        lives = Math.min(lives + 1, 5);
    } else if (type === 'speed') {
        speed += 1;
        setTimeout(() => speed -= 1, 10000);
    }
    createParticles(shipX + 'px', shipY + 'px', 'lime');
    updateStats();
}

function levelUp() {
    if (score >= level * 50) {
        level++;
        speed += 0.5;
        updateStats();
        changeBackground();
    }
}

function changeBackground() {
    const backgrounds = [
        'url("space-bg.jpg")',
        'url("galaxy-bg.jpg")',
        'url("nebula-bg.jpg")'
    ];
    gameArea.style.background = backgrounds[level % 3] + ' no-repeat center';
    gameArea.style.backgroundSize = 'cover';
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10 * speed); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10 * speed); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10 * speed); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10 * speed); break;
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop(performance.now());
    }
});

pauseBtn.addEventListener('click', () => {
    isGameRunning = !isGameRunning;
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    gameTime += 16;
    moveEnemies();
    moveParticles();
    checkCollision('treasure');
    checkCollision('enemy');
    checkCollision('bonus');
    levelUp();

    if (Math.random() < 0.05) createTreasure(timestamp);
    if (Math.random() < 0.03) createEnemy(timestamp, 'normal');
    if (Math.random() < 0.01) createEnemy(timestamp, 'fast');
    if (Math.random() < 0.008) createEnemy(timestamp, 'zigzag');
    if (Math.random() < 0.015) createBonus(timestamp, 'life');
    if (Math.random() < 0.01) createBonus(timestamp, 'speed');

    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function initializeGame() {
    moveShip();
    updateStats();
    gameArea.style.background = 'url("space-bg.jpg") no-repeat center';
    gameArea.style.backgroundSize = 'cover';
    addCustomStyles();
    displayHighScore();
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fast-enemy {
            width: 30px;
            height: 30px;
            background: url('fast-meteor.png') no-repeat center;
            background-size: contain;
        }
        .zigzag-enemy {
            width: 35px;
            height: 35px;
            background: url('zigzag-enemy.png') no-repeat center;
            background-size: contain;
        }
        .bonus {
            border-radius: 50%;
            animation: pulse 1s infinite;
        }
        .particle {
            position: absolute;
            border-radius: 50%;
        }
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

function displayHighScore() {
    const highScoreDisplay = document.createElement('div');
    highScoreDisplay.classList.add('stat-item');
    highScoreDisplay.innerHTML = `<span>Eng yuqori ochko:</span> <span>${highScore}</span>`;
    document.querySelector('.stats-panel').appendChild(highScoreDisplay);
}

initializeGame();
const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;
let enemies = [];
let treasures = [];
let bonuses = [];
let particles = [];
let lasers = [];
let lastTreasureTime = 0;
let lastEnemyTime = 0;
let lastBonusTime = 0;
let lastLaserTime = 0;
let invincible = false;
let gameTime = 0;
let highScore = localStorage.getItem('highScore') || 0;
let totalTreasures = 0;
let totalEnemiesDestroyed = 0;

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
    if (invincible) ship.style.filter = 'brightness(2) drop-shadow(0 0 5px #fff)';
    else ship.style.filter = 'brightness(1)';
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed.toFixed(1)}x`;
    levelDisplay.textContent = level;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function createTreasure(timestamp) {
    if (timestamp - lastTreasureTime < 2000 / speed) return;
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    treasures.push(treasure);
    totalTreasures++;
    lastTreasureTime = timestamp;
    setTimeout(() => {
        treasure.remove();
        treasures = treasures.filter(t => t !== treasure);
    }, 5000);
    createParticles(treasure.style.left, treasure.style.top, 'yellow');
    playSound('treasure');
}

function createEnemy(timestamp, type = 'normal') {
    if (timestamp - lastEnemyTime < 3000 / speed) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    if (type === 'fast') enemy.classList.add('fast-enemy');
    else if (type === 'zigzag') enemy.classList.add('zigzag-enemy');
    else if (type === 'smart') enemy.classList.add('smart-enemy');
    enemy.style.left = '800px';
    enemy.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, x: 800, y: parseFloat(enemy.style.top), type, angle: 0 });
    lastEnemyTime = timestamp;
}

function createBonus(timestamp, type = 'life') {
    if (timestamp - lastBonusTime < 15000 / speed) return;
    const bonus = document.createElement('div');
    bonus.classList.add('bonus');
    bonus.style.left = `${Math.random() * 750}px`;
    bonus.style.top = `${Math.random() * 450}px`;
    bonus.dataset.type = type;
    if (type === 'life') bonus.style.background = 'green';
    else if (type === 'speed') bonus.style.background = 'purple';
    else if (type === 'laser') bonus.style.background = 'cyan';
    bonus.style.width = '25px';
    bonus.style.height = '25px';
    gameArea.appendChild(bonus);
    bonuses.push(bonus);
    lastBonusTime = timestamp;
    setTimeout(() => {
        bonus.remove();
        bonuses = bonuses.filter(b => b !== bonus);
    }, 7000);
}

function createLaser(timestamp) {
    if (timestamp - lastLaserTime < 500 / speed || !isGameRunning) return;
    const laser = document.createElement('div');
    laser.classList.add('laser');
    laser.style.left = `${shipX + 50}px`;
    laser.style.top = `${shipY + 20}px`;
    gameArea.appendChild(laser);
    lasers.push({ element: laser, x: shipX + 50 });
    lastLaserTime = timestamp;
    playSound('laser');
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const speedFactor = enemy.type === 'fast' ? 4 : enemy.type === 'zigzag' ? 3 : enemy.type === 'smart' ? 2.5 : 2;
        enemy.x -= speedFactor * speed;
        if (enemy.type === 'zigzag') {
            enemy.angle += 0.1;
            enemy.y += Math.sin(enemy.angle) * 5;
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'smart') {
            const dy = shipY - enemy.y;
            enemy.y += dy > 0 ? 2 : -2;
            enemy.y = Math.max(0, Math.min(450, enemy.y));
            enemy.element.style.top = `${enemy.y}px`;
        }
        enemy.element.style.left = `${enemy.x}px`;
        if (enemy.x < -50) {
            enemy.element.remove();
            enemies.splice(index, 1);
        }
    });
}

function moveLasers() {
    lasers.forEach((laser, index) => {
        laser.x += 10 * speed;
        laser.element.style.left = `${laser.x}px`;
        if (laser.x > 800) {
            laser.element.remove();
            lasers.splice(index, 1);
        }
    });
}

function createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = x;
        particle.style.top = y;
        particle.style.background = color;
        particle.style.width = '5px';
        particle.style.height = '5px';
        gameArea.appendChild(particle);
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            element: particle,
            x: parseFloat(x),
            y: parseFloat(y),
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            life: 1000
        });
    }
}

function moveParticles() {
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 16;
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = p.life / 1000;
        if (p.life <= 0) {
            p.element.remove();
            particles.splice(i, 1);
        }
    });
}

function checkCollision(type) {
    const sRect = ship.getBoundingClientRect();
    if (type === 'treasure') {
        treasures.forEach((t, i) => {
            const tRect = t.getBoundingClientRect();
            if (sRect.left < tRect.right && sRect.right > tRect.left &&
                sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
                score += 10 * level;
                t.remove();
                treasures.splice(i, 1);
                updateStats();
            }
        });
    } else if (type === 'enemy') {
        enemies.forEach((e, i) => {
            const eRect = e.element.getBoundingClientRect();
            if (sRect.left < eRect.right && sRect.right > eRect.left &&
                sRect.top < eRect.bottom && sRect.bottom > eRect.top) {
                if (!invincible) {
                    lives--;
                    e.element.remove();
                    enemies.splice(i, 1);
                    createParticles(e.x + 'px', e.y + 'px', 'red');
                    updateStats();
                    playSound('hit');
                }
            }
        });
    } else if (type === 'bonus') {
        bonuses.forEach((b, i) => {
            const bRect = b.getBoundingClientRect();
            if (sRect.left < bRect.right && sRect.right > bRect.left &&
                sRect.top < bRect.bottom && sRect.bottom > bRect.top) {
                activateBonus(b.dataset.type);
                b.remove();
                bonuses.splice(i, 1);
            }
        });
    } else if (type === 'laser') {
        lasers.forEach((l, i) => {
            const lRect = l.element.getBoundingClientRect();
            enemies.forEach((e, j) => {
                const eRect = e.element.getBoundingClientRect();
                if (lRect.left < eRect.right && lRect.right > eRect.left &&
                    lRect.top < eRect.bottom && lRect.bottom > eRect.top) {
                    score += 5;
                    totalEnemiesDestroyed++;
                    e.element.remove();
                    l.element.remove();
                    enemies.splice(j, 1);
                    lasers.splice(i, 1);
                    createParticles(e.x + 'px', e.y + 'px', 'orange');
                    updateStats();
                    playSound('explosion');
                }
            });
        });
    }
}

function activateBonus(type) {
    if (type === 'life') {
        invincible = true;
        setTimeout(() => invincible = false, 5000);
        lives = Math.min(lives + 1, 5);
    } else if (type === 'speed') {
        speed += 1;
        setTimeout(() => speed -= 1, 10000);
    } else if (type === 'laser') {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createLaser(performance.now()), i * 200);
        }
    }
    createParticles(shipX + 'px', shipY + 'px', 'lime');
    updateStats();
    playSound('bonus');
}

function levelUp() {
    if (score >= level * 50) {
        level++;
        speed += 0.5;
        updateStats();
        changeBackground();
    }
}

function changeBackground() {
    const backgrounds = [
        'url("space-bg.jpg")',
        'url("galaxy-bg.jpg")',
        'url("nebula-bg.jpg")',
        'url("blackhole-bg.jpg")'
    ];
    gameArea.style.background = backgrounds[level % 4] + ' no-repeat center';
    gameArea.style.backgroundSize = 'cover';
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10 * speed); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10 * speed); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10 * speed); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10 * speed); break;
        case ' ': createLaser(performance.now()); break; // Bo'shliq tugmasi bilan lazer otish
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop(performance.now());
    }
});

pauseBtn.addEventListener('click', () => {
    isGameRunning = !isGameRunning;
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    gameTime += 16;
    moveEnemies();
    moveLasers();
    moveParticles();
    checkCollision('treasure');
    checkCollision('enemy');
    checkCollision('bonus');
    checkCollision('laser');
    levelUp();

    if (Math.random() < 0.05) createTreasure(timestamp);
    if (Math.random() < 0.03) createEnemy(timestamp, 'normal');
    if (Math.random() < 0.01) createEnemy(timestamp, 'fast');
    if (Math.random() < 0.008) createEnemy(timestamp, 'zigzag');
    if (Math.random() < 0.005) createEnemy(timestamp, 'smart');
    if (Math.random() < 0.015) createBonus(timestamp, 'life');
    if (Math.random() < 0.01) createBonus(timestamp, 'speed');
    if (Math.random() < 0.008) createBonus(timestamp, 'laser');

    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
        displayGameStats();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function initializeGame() {
    moveShip();
    updateStats();
    gameArea.style.background = 'url("space-bg.jpg") no-repeat center';
    gameArea.style.backgroundSize = 'cover';
    addCustomStyles();
    displayHighScore();
    preloadSounds();
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fast-enemy { width: 30px; height: 30px; background: url('fast-meteor.png') no-repeat center; background-size: contain; }
        .zigzag-enemy { width: 35px; height: 35px; background: url('zigzag-enemy.png') no-repeat center; background-size: contain; }
        .smart-enemy { width: 40px; height: 40px; background: url('smart-enemy.png') no-repeat center; background-size: contain; }
        .bonus { border-radius: 50%; animation: pulse 1s infinite; }
        .particle { position: absolute; border-radius: 50%; }
        .laser { position: absolute; width: 20px; height: 5px; background: red; border-radius: 2px; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
    `;
    document.head.appendChild(style);
}

function displayHighScore() {
    const highScoreDisplay = document.createElement('div');
    highScoreDisplay.classList.add('stat-item');
    highScoreDisplay.innerHTML = `<span>Eng yuqori ochko:</span> <span>${highScore}</span>`;
    document.querySelector('.stats-panel').appendChild(highScoreDisplay);
}

function displayGameStats() {
    const stats = document.createElement('p');
    stats.textContent = `Vaqt: ${(gameTime / 1000).toFixed(1)}s | Xazinalar: ${totalTreasures} | Yo'q qilingan dushmanlar: ${totalEnemiesDestroyed}`;
    gameOverModal.appendChild(stats);
}

function preloadSounds() {
    window.sounds = {
        treasure: new Audio('treasure.mp3'),
        hit: new Audio('hit.mp3'),
        explosion: new Audio('explosion.mp3'),
        bonus: new Audio('bonus.mp3'),
        laser: new Audio('laser.mp3')
    };
}

function playSound(type) {
    if (window.sounds && window.sounds[type]) {
        window.sounds[type].currentTime = 0;
        window.sounds[type].play().catch(() => {});
    }
}

initializeGame();
const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;
let enemies = [];
let treasures = [];
let bonuses = [];
let particles = [];
let lasers = [];
let shields = [];
let lastTreasureTime = 0;
let lastEnemyTime = 0;
let lastBonusTime = 0;
let lastLaserTime = 0;
let lastShieldTime = 0;
let invincible = false;
let gameTime = 0;
let highScore = localStorage.getItem('highScore') || 0;
let totalTreasures = 0;
let totalEnemiesDestroyed = 0;
let bossActive = false;

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
    if (invincible) ship.style.filter = 'brightness(2) drop-shadow(0 0 5px #fff)';
    else ship.style.filter = 'brightness(1)';
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed.toFixed(1)}x`;
    levelDisplay.textContent = level;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function createTreasure(timestamp) {
    if (timestamp - lastTreasureTime < 2000 / speed || bossActive) return;
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    treasures.push(treasure);
    totalTreasures++;
    lastTreasureTime = timestamp;
    setTimeout(() => {
        treasure.remove();
        treasures = treasures.filter(t => t !== treasure);
    }, 5000);
    createParticles(treasure.style.left, treasure.style.top, 'yellow');
    playSound('treasure');
}

function createEnemy(timestamp, type = 'normal') {
    if (timestamp - lastEnemyTime < 3000 / speed || bossActive) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    if (type === 'fast') enemy.classList.add('fast-enemy');
    else if (type === 'zigzag') enemy.classList.add('zigzag-enemy');
    else if (type === 'smart') enemy.classList.add('smart-enemy');
    else if (type === 'boss') enemy.classList.add('boss-enemy');
    enemy.style.left = '800px';
    enemy.style.top = `${Math.random() * 450}px`;
    const health = type === 'boss' ? 50 : 1;
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, x: 800, y: parseFloat(enemy.style.top), type, angle: 0, health });
    lastEnemyTime = timestamp;
    if (type === 'boss') bossActive = true;
}

function createBonus(timestamp, type = 'life') {
    if (timestamp - lastBonusTime < 15000 / speed || bossActive) return;
    const bonus = document.createElement('div');
    bonus.classList.add('bonus');
    bonus.style.left = `${Math.random() * 750}px`;
    bonus.style.top = `${Math.random() * 450}px`;
    bonus.dataset.type = type;
    if (type === 'life') bonus.style.background = 'green';
    else if (type === 'speed') bonus.style.background = 'purple';
    else if (type === 'laser') bonus.style.background = 'cyan';
    else if (type === 'shield') bonus.style.background = 'blue';
    bonus.style.width = '25px';
    bonus.style.height = '25px';
    gameArea.appendChild(bonus);
    bonuses.push(bonus);
    lastBonusTime = timestamp;
    setTimeout(() => {
        bonus.remove();
        bonuses = bonuses.filter(b => b !== bonus);
    }, 7000);
}

function createLaser(timestamp, type = 'normal') {
    if (timestamp - lastLaserTime < 500 / speed || !isGameRunning) return;
    const laser = document.createElement('div');
    laser.classList.add('laser');
    laser.dataset.type = type;
    laser.style.left = `${shipX + 50}px`;
    laser.style.top = `${shipY + 20}px`;
    if (type === 'power') laser.style.background = 'yellow';
    gameArea.appendChild(laser);
    lasers.push({ element: laser, x: shipX + 50, type });
    lastLaserTime = timestamp;
    playSound('laser');
}

function createShield(timestamp) {
    if (timestamp - lastShieldTime < 10000 || shields.length > 0) return;
    const shield = document.createElement('div');
    shield.classList.add('shield');
    shield.style.left = `${shipX}px`;
    shield.style.top = `${shipY}px`;
    gameArea.appendChild(shield);
    shields.push(shield);
    lastShieldTime = timestamp;
    setTimeout(() => {
        shield.remove();
        shields = shields.filter(s => s !== shield);
    }, 5000);
    playSound('shield');
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const speedFactor = enemy.type === 'fast' ? 4 : enemy.type === 'zigzag' ? 3 : enemy.type === 'smart' ? 2.5 : enemy.type === 'boss' ? 1 : 2;
        enemy.x -= speedFactor * speed;
        if (enemy.type === 'zigzag') {
            enemy.angle += 0.1;
            enemy.y += Math.sin(enemy.angle) * 5;
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'smart') {
            const dy = shipY - enemy.y;
            enemy.y += dy > 0 ? 2 : -2;
            enemy.y = Math.max(0, Math.min(450, enemy.y));
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'boss') {
            enemy.y = 200 + Math.sin(enemy.angle) * 100;
            enemy.angle += 0.05;
            enemy.element.style.top = `${enemy.y}px`;
        }
        enemy.element.style.left = `${enemy.x}px`;
        if (enemy.x < -50 || enemy.health <= 0) {
            if (enemy.type === 'boss' && enemy.health <= 0) bossActive = false;
            enemy.element.remove();
            enemies.splice(index, 1);
        }
    });
}

function moveLasers() {
    lasers.forEach((laser, index) => {
        laser.x += 10 * speed;
        laser.element.style.left = `${laser.x}px`;
        if (laser.x > 800) {
            laser.element.remove();
            lasers.splice(index, 1);
        }
    });
}

function moveShields() {
    shields.forEach(shield => {
        shield.style.left = `${shipX}px`;
        shield.style.top = `${shipY}px`;
    });
}

function createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = x;
        particle.style.top = y;
        particle.style.background = color;
        particle.style.width = '5px';
        particle.style.height = '5px';
        gameArea.appendChild(particle);
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            element: particle,
            x: parseFloat(x),
            y: parseFloat(y),
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            life: 1000
        });
    }
}

function moveParticles() {
    particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 16;
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = p.life / 1000;
        if (p.life <= 0) {
            p.element.remove();
            particles.splice(i, 1);
        }
    });
}

function checkCollision(type) {
    const sRect = ship.getBoundingClientRect();
    if (type === 'treasure') {
        treasures.forEach((t, i) => {
            const tRect = t.getBoundingClientRect();
            if (sRect.left < tRect.right && sRect.right > tRect.left &&
                sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
                score += 10 * level;
                t.remove();
                treasures.splice(i, 1);
                updateStats();
            }
        });
    } else if (type === 'enemy') {
        enemies.forEach((e, i) => {
            const eRect = e.element.getBoundingClientRect();
            if (sRect.left < eRect.right && sRect.right > eRect.left &&
                sRect.top < eRect.bottom && sRect.bottom > eRect.top) {
                if (!invincible && shields.length === 0) {
                    lives--;
                    e.element.remove();
                    enemies.splice(i, 1);
                    createParticles(e.x + 'px', e.y + 'px', 'red');
                    updateStats();
                    playSound('hit');
                }
            }
        });
    } else if (type === 'bonus') {
        bonuses.forEach((b, i) => {
            const bRect = b.getBoundingClientRect();
            if (sRect.left < bRect.right && sRect.right > bRect.left &&
                sRect.top < bRect.bottom && sRect.bottom > bRect.top) {
                activateBonus(b.dataset.type);
                b.remove();
                bonuses.splice(i, 1);
            }
        });
    } else if (type === 'laser') {
        lasers.forEach((l, i) => {
            const lRect = l.element.getBoundingClientRect();
            enemies.forEach((e, j) => {
                const eRect = e.element.getBoundingClientRect();
                if (lRect.left < eRect.right && lRect.right > eRect.left &&
                    lRect.top < eRect.bottom && lRect.bottom > eRect.top) {
                    e.health -= l.type === 'power' ? 5 : 1;
                    score += 5;
                    totalEnemiesDestroyed++;
                    l.element.remove();
                    lasers.splice(i, 1);
                    if (e.health <= 0) {
                        e.element.remove();
                        enemies.splice(j, 1);
                        createParticles(e.x + 'px', e.y + 'px', 'orange');
                    }
                    updateStats();
                    playSound('explosion');
                }
            });
        });
    }
}

function activateBonus(type) {
    if (type === 'life') {
        invincible = true;
        setTimeout(() => invincible = false, 5000);
        lives = Math.min(lives + 1, 5);
    } else if (type === 'speed') {
        speed += 1;
        setTimeout(() => speed -= 1, 10000);
    } else if (type === 'laser') {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createLaser(performance.now(), 'power'), i * 200);
        }
    } else if (type === 'shield') {
        createShield(performance.now());
    }
    createParticles(shipX + 'px', shipY + 'px', 'lime');
    updateStats();
    playSound('bonus');
}

function levelUp() {
    if (score >= level * 50) {
        level++;
        speed += 0.5;
        updateStats();
        changeBackground();
        if (level % 5 === 0) {
            createEnemy(performance.now(), 'boss');
            playSound('boss');
        }
        showLevelTransition();
    }
}

function changeBackground() {
    const backgrounds = [
        'url("space-bg.jpg")',
        'url("galaxy-bg.jpg")',
        'url("nebula-bg.jpg")',
        'url("blackhole-bg.jpg")',
        'url("starfield-bg.jpg")'
    ];
    gameArea.style.background = backgrounds[level % 5] + ' no-repeat center';
    gameArea.style.backgroundSize = 'cover';
}

function showLevelTransition() {
    const transition = document.createElement('div');
    transition.classList.add('level-transition');
    transition.textContent = `Daraja ${level}`;
    gameArea.appendChild(transition);
    setTimeout(() => transition.remove(), 2000);
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning) return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10 * speed); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10 * speed); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10 * speed); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10 * speed); break;
        case ' ': createLaser(performance.now()); break;
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop(performance.now());
    }
});

pauseBtn.addEventListener('click', () => {
    isGameRunning = !isGameRunning;
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    gameTime += 16;
    moveEnemies();
    moveLasers();
    moveShields();
    moveParticles();
    checkCollision('treasure');
    checkCollision('enemy');
    checkCollision('bonus');
    checkCollision('laser');
    levelUp();

    if (Math.random() < 0.05) createTreasure(timestamp);
    if (Math.random() < 0.03) createEnemy(timestamp, 'normal');
    if (Math.random() < 0.01) createEnemy(timestamp, 'fast');
    if (Math.random() < 0.008) createEnemy(timestamp, 'zigzag');
    if (Math.random() < 0.005) createEnemy(timestamp, 'smart');
    if (Math.random() < 0.015) createBonus(timestamp, 'life');
    if (Math.random() < 0.01) createBonus(timestamp, 'speed');
    if (Math.random() < 0.008) createBonus(timestamp, 'laser');
    if (Math.random() < 0.006) createBonus(timestamp, 'shield');

    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
        displayGameStats();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function initializeGame() {
    moveShip();
    updateStats();
    gameArea.style.background = 'url("space-bg.jpg") no-repeat center';
    gameArea.style.backgroundSize = 'cover';
    addCustomStyles();
    displayHighScore();
    preloadSounds();
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fast-enemy { width: 30px; height: 30px; background: url('fast-meteor.png') no-repeat center; background-size: contain; }
        .zigzag-enemy { width: 35px; height: 35px; background: url('zigzag-enemy.png') no-repeat center; background-size: contain; }
        .smart-enemy { width: 40px; height: 40px; background: url('smart-enemy.png') no-repeat center; background-size: contain; }
        .boss-enemy { width: 100px; height: 100px; background: url('boss.png') no-repeat center; background-size: contain; }
        .bonus { border-radius: 50%; animation: pulse 1s infinite; }
        .particle { position: absolute; border-radius: 50%; }
        .laser { position: absolute; width: 20px; height: 5px; background: red; border-radius: 2px; }
        .shield { position: absolute; width: 60px; height: 60px; background: rgba(0, 0, 255, 0.3); border-radius: 50%; }
        .level-transition { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; color: #fff; text-shadow: 0 0 10px #000; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
    `;
    document.head.appendChild(style);
}

function displayHighScore() {
    const highScoreDisplay = document.createElement('div');
    highScoreDisplay.classList.add('stat-item');
    highScoreDisplay.innerHTML = `<span>Eng yuqori ochko:</span> <span>${highScore}</span>`;
    document.querySelector('.stats-panel').appendChild(highScoreDisplay);
}

function displayGameStats() {
    const stats = document.createElement('p');
    stats.textContent = `Vaqt: ${(gameTime / 1000).toFixed(1)}s | Xazinalar: ${totalTreasures} | Yo'q qilingan dushmanlar: ${totalEnemiesDestroyed}`;
    gameOverModal.appendChild(stats);
}

function preloadSounds() {
    window.sounds = {
        treasure: new Audio('treasure.mp3'),
        hit: new Audio('hit.mp3'),
        explosion: new Audio('explosion.mp3'),
        bonus: new Audio('bonus.mp3'),
        laser: new Audio('laser.mp3'),
        shield: new Audio('shield.mp3'),
        boss: new Audio('boss.mp3')
    };
}

function playSound(type) {
    if (window.sounds && window.sounds[type]) {
        window.sounds[type].currentTime = 0;
        window.sounds[type].play().catch(() => {});
    }
}

initializeGame();
const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;
let enemies = [];
let treasures = [];
let bonuses = [];
let particles = [];
let lasers = [];
let shields = [];
let bossAttacks = [];
let lastTreasureTime = 0;
let lastEnemyTime = 0;
let lastBonusTime = 0;
let lastLaserTime = 0;
let lastShieldTime = 0;
let lastBossAttackTime = 0;
let invincible = false;
let gameTime = 0;
let highScore = localStorage.getItem('highScore') || 0;
let totalTreasures = 0;
let totalEnemiesDestroyed = 0;
let bossActive = false;
let slowMotion = false;

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
    if (invincible) ship.style.filter = 'brightness(2) drop-shadow(0 0 5px #fff)';
    else ship.style.filter = 'brightness(1)';
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed.toFixed(1)}x`;
    levelDisplay.textContent = level;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function createTreasure(timestamp) {
    if (timestamp - lastTreasureTime < 2000 / speed || bossActive) return;
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    treasures.push(treasure);
    totalTreasures++;
    lastTreasureTime = timestamp;
    setTimeout(() => {
        treasure.remove();
        treasures = treasures.filter(t => t !== treasure);
    }, 5000);
    createParticles(treasure.style.left, treasure.style.top, 'yellow');
    playSound('treasure');
}

function createEnemy(timestamp, type = 'normal') {
    if (timestamp - lastEnemyTime < 3000 / (speed * (1 + level * 0.1)) || bossActive) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    if (type === 'fast') enemy.classList.add('fast-enemy');
    else if (type === 'zigzag') enemy.classList.add('zigzag-enemy');
    else if (type === 'smart') enemy.classList.add('smart-enemy');
    else if (type === 'boss') enemy.classList.add('boss-enemy');
    enemy.style.left = '800px';
    enemy.style.top = `${Math.random() * 450}px`;
    const health = type === 'boss' ? 50 : 1;
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, x: 800, y: parseFloat(enemy.style.top), type, angle: 0, health });
    lastEnemyTime = timestamp;
    if (type === 'boss') bossActive = true;
}

function createBonus(timestamp, type = 'life') {
    if (timestamp - lastBonusTime < 15000 / speed || bossActive) return;
    const bonus = document.createElement('div');
    bonus.classList.add('bonus');
    bonus.style.left = `${Math.random() * 750}px`;
    bonus.style.top = `${Math.random() * 450}px`;
    bonus.dataset.type = type;
    if (type === 'life') bonus.style.background = 'green';
    else if (type === 'speed') bonus.style.background = 'purple';
    else if (type === 'laser') bonus.style.background = 'cyan';
    else if (type === 'shield') bonus.style.background = 'blue';
    else if (type === 'slow') bonus.style.background = 'silver';
    bonus.style.width = '25px';
    bonus.style.height = '25px';
    gameArea.appendChild(bonus);
    bonuses.push(bonus);
    lastBonusTime = timestamp;
    setTimeout(() => {
        bonus.remove();
        bonuses = bonuses.filter(b => b !== bonus);
    }, 7000);
}

function createLaser(timestamp, type = 'normal') {
    if (timestamp - lastLaserTime < 500 / speed || !isGameRunning) return;
    const laser = document.createElement('div');
    laser.classList.add('laser');
    laser.dataset.type = type;
    laser.style.left = `${shipX + 50}px`;
    laser.style.top = `${shipY + 20}px`;
    if (type === 'power') laser.style.background = 'yellow';
    gameArea.appendChild(laser);
    lasers.push({ element: laser, x: shipX + 50, type });
    lastLaserTime = timestamp;
    playSound('laser');
}

function createShield(timestamp) {
    if (timestamp - lastShieldTime < 10000 || shields.length > 0) return;
    const shield = document.createElement('div');
    shield.classList.add('shield');
    shield.style.left = `${shipX}px`;
    shield.style.top = `${shipY}px`;
    gameArea.appendChild(shield);
    shields.push(shield);
    lastShieldTime = timestamp;
    setTimeout(() => {
        shield.remove();
        shields = shields.filter(s => s !== shield);
    }, 5000);
    playSound('shield');
}

function createBossAttack(timestamp) {
    if (timestamp - lastBossAttackTime < 2000 || !bossActive) return;
    const boss = enemies.find(e => e.type === 'boss');
    if (!boss) return;
    const attack = document.createElement('div');
    attack.classList.add('boss-attack');
    attack.style.left = `${boss.x}px`;
    attack.style.top = `${boss.y + 50}px`;
    gameArea.appendChild(attack);
    bossAttacks.push({ element: attack, x: boss.x, y: boss.y + 50 });
    lastBossAttackTime = timestamp;
    playSound('boss-attack');
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const speedFactor = slowMotion ? 0.5 : enemy.type === 'fast' ? 4 : enemy.type === 'zigzag' ? 3 : enemy.type === 'smart' ? 2.5 : enemy.type === 'boss' ? 1 : 2;
        enemy.x -= speedFactor * speed;
        if (enemy.type === 'zigzag') {
            enemy.angle += 0.1;
            enemy.y += Math.sin(enemy.angle) * 5;
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'smart') {
            const dy = shipY - enemy.y;
            enemy.y += dy > 0 ? 2 : -2;
            enemy.y = Math.max(0, Math.min(450, enemy.y));
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'boss') {
            enemy.y = 200 + Math.sin(enemy.angle) * 100;
            enemy.angle += 0.05;
            enemy.element.style.top = `${enemy.y}px`;
            if (enemy.x < 600) enemy.x = 600; // Boss chegarasi
        }
        enemy.element.style.left = `${enemy.x}px`;
        if (enemy.x < -50 || enemy.health <= 0) {
            if (enemy.type === 'boss' && enemy.health <= 0) bossActive = false;
            enemy.element.remove();
            enemies.splice(index, 1);
        }
    });
}

function moveLasers() {
    lasers.forEach((laser, index) => {
        laser.x += (slowMotion ? 5 : 10) * speed;
        laser.element.style.left = `${laser.x}px`;
        if (laser.x > 800) {
            laser.element.remove();
            lasers.splice(index, 1);
        }
    });
}

function moveShields() {
    shields.forEach(shield => {
        shield.style.left = `${shipX}px`;
        shield.style.top = `${shipY}px`;
    });
}

function moveBossAttacks() {
    bossAttacks.forEach((attack, index) => {
        attack.x -= (slowMotion ? 2 : 4) * speed;
        attack.element.style.left = `${attack.x}px`;
        if (attack.x < -20) {
            attack.element.remove();
            bossAttacks.splice(index, 1);
        }
    });
}

function createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = x;
        particle.style.top = y;
        particle.style.background = color;
        particle.style.width = '5px';
        particle.style.height = '5px';
        gameArea.appendChild(particle);
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            element: particle,
            x: parseFloat(x),
            y: parseFloat(y),
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            life: 1000
        });
    }
}

function moveParticles() {
    particles.forEach((p, i) => {
        p.x += p.vx * (slowMotion ? 0.5 : 1);
        p.y += p.vy * (slowMotion ? 0.5 : 1);
        p.life -= 16;
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = p.life / 1000;
        if (p.life <= 0) {
            p.element.remove();
            particles.splice(i, 1);
        }
    });
}

function checkCollision(type) {
    const sRect = ship.getBoundingClientRect();
    if (type === 'treasure') {
        treasures.forEach((t, i) => {
            const tRect = t.getBoundingClientRect();
            if (sRect.left < tRect.right && sRect.right > tRect.left &&
                sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
                score += 10 * level;
                t.remove();
                treasures.splice(i, 1);
                updateStats();
            }
        });
    } else if (type === 'enemy') {
        enemies.forEach((e, i) => {
            const eRect = e.element.getBoundingClientRect();
            if (sRect.left < eRect.right && sRect.right > eRect.left &&
                sRect.top < eRect.bottom && sRect.bottom > eRect.top) {
                if (!invincible && shields.length === 0) {
                    lives--;
                    e.element.remove();
                    enemies.splice(i, 1);
                    createParticles(e.x + 'px', e.y + 'px', 'red');
                    updateStats();
                    playSound('hit');
                }
            }
        });
    } else if (type === 'bonus') {
        bonuses.forEach((b, i) => {
            const bRect = b.getBoundingClientRect();
            if (sRect.left < bRect.right && sRect.right > bRect.left &&
                sRect.top < bRect.bottom && sRect.bottom > bRect.top) {
                activateBonus(b.dataset.type);
                b.remove();
                bonuses.splice(i, 1);
            }
        });
    } else if (type === 'laser') {
        lasers.forEach((l, i) => {
            const lRect = l.element.getBoundingClientRect();
            enemies.forEach((e, j) => {
                const eRect = e.element.getBoundingClientRect();
                if (lRect.left < eRect.right && lRect.right > eRect.left &&
                    lRect.top < eRect.bottom && lRect.bottom > eRect.top) {
                    e.health -= l.type === 'power' ? 5 : 1;
                    score += 5;
                    totalEnemiesDestroyed++;
                    l.element.remove();
                    lasers.splice(i, 1);
                    if (e.health <= 0) {
                        e.element.remove();
                        enemies.splice(j, 1);
                        createParticles(e.x + 'px', e.y + 'px', 'orange');
                    }
                    updateStats();
                    playSound('explosion');
                }
            });
        });
    } else if (type === 'boss-attack') {
        bossAttacks.forEach((a, i) => {
            const aRect = a.element.getBoundingClientRect();
            if (sRect.left < aRect.right && sRect.right > aRect.left &&
                sRect.top < aRect.bottom && sRect.bottom > aRect.top) {
                if (!invincible && shields.length === 0) {
                    lives--;
                    a.element.remove();
                    bossAttacks.splice(i, 1);
                    updateStats();
                    playSound('hit');
                }
            }
        });
    }
}

function activateBonus(type) {
    if (type === 'life') {
        invincible = true;
        setTimeout(() => invincible = false, 5000);
        lives = Math.min(lives + 1, 5);
    } else if (type === 'speed') {
        speed += 1;
        setTimeout(() => speed -= 1, 10000);
    } else if (type === 'laser') {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createLaser(performance.now(), 'power'), i * 200);
        }
    } else if (type === 'shield') {
        createShield(performance.now());
    } else if (type === 'slow') {
        slowMotion = true;
        setTimeout(() => slowMotion = false, 5000);
    }
    createParticles(shipX + 'px', shipY + 'px', 'lime');
    updateStats();
    playSound('bonus');
}

function levelUp() {
    if (score >= level * 50) {
        level++;
        speed += 0.5;
        updateStats();
        changeBackground();
        if (level % 5 === 0) {
            createEnemy(performance.now(), 'boss');
            playSound('boss');
        }
        showLevelTransition();
    }
}

function changeBackground() {
    const backgrounds = [
        'url("space-bg.jpg")',
        'url("galaxy-bg.jpg")',
        'url("nebula-bg.jpg")',
        'url("blackhole-bg.jpg")',
        'url("starfield-bg.jpg")'
    ];
    gameArea.style.background = backgrounds[level % 5] + ' no-repeat center';
    gameArea.style.backgroundSize = 'cover';
}

function showLevelTransition() {
    const transition = document.createElement('div');
    transition.classList.add('level-transition');
    transition.textContent = `Daraja ${level}`;
    gameArea.appendChild(transition);
    setTimeout(() => transition.remove(), 2000);
}

function showPauseMenu() {
    const pauseMenu = document.createElement('div');
    pauseMenu.classList.add('pause-menu');
    pauseMenu.innerHTML = `
        <h2>O'yin to'xtatildi</h2>
        <button id="resume-btn">Davom etish</button>
        <button id="quit-btn">Chiqish</button>
    `;
    gameArea.appendChild(pauseMenu);
    document.getElementById('resume-btn').addEventListener('click', () => {
        isGameRunning = true;
        pauseMenu.remove();
        gameLoop(performance.now());
    });
    document.getElementById('quit-btn').addEventListener('click', () => location.reload());
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning && e.key !== 'Escape') return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10 * speed); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10 * speed); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10 * speed); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10 * speed); break;
        case ' ': createLaser(performance.now()); break;
        case 'Escape': if (isGameRunning) { isGameRunning = false; showPauseMenu(); } break;
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop(performance.now());
    }
});

pauseBtn.addEventListener('click', () => {
    if (isGameRunning) {
        isGameRunning = false;
        showPauseMenu();
    }
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    gameTime += 16;
    moveEnemies();
    moveLasers();
    moveShields();
    moveBossAttacks();
    moveParticles();
    checkCollision('treasure');
    checkCollision('enemy');
    checkCollision('bonus');
    checkCollision('laser');
    checkCollision('boss-attack');
    levelUp();

    if (Math.random() < 0.05) createTreasure(timestamp);
    if (Math.random() < 0.03) createEnemy(timestamp, 'normal');
    if (Math.random() < 0.01) createEnemy(timestamp, 'fast');
    if (Math.random() < 0.008) createEnemy(timestamp, 'zigzag');
    if (Math.random() < 0.005) createEnemy(timestamp, 'smart');
    if (Math.random() < 0.015) createBonus(timestamp, 'life');
    if (Math.random() < 0.01) createBonus(timestamp, 'speed');
    if (Math.random() < 0.008) createBonus(timestamp, 'laser');
    if (Math.random() < 0.006) createBonus(timestamp, 'shield');
    if (Math.random() < 0.004) createBonus(timestamp, 'slow');
    if (bossActive) createBossAttack(timestamp);

    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
        displayGameStats();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function initializeGame() {
    moveShip();
    updateStats();
    gameArea.style.background = 'url("space-bg.jpg") no-repeat center';
    gameArea.style.backgroundSize = 'cover';
    addCustomStyles();
    displayHighScore();
    preloadSounds();
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fast-enemy { width: 30px; height: 30px; background: url('fast-meteor.png') no-repeat center; background-size: contain; }
        .zigzag-enemy { width: 35px; height: 35px; background: url('zigzag-enemy.png') no-repeat center; background-size: contain; }
        .smart-enemy { width: 40px; height: 40px; background: url('smart-enemy.png') no-repeat center; background-size: contain; }
        .boss-enemy { width: 100px; height: 100px; background: url('boss.png') no-repeat center; background-size: contain; }
        .bonus { border-radius: 50%; animation: pulse 1s infinite; }
        .particle { position: absolute; border-radius: 50%; }
        .laser { position: absolute; width: 20px; height: 5px; background: red; border-radius: 2px; }
        .shield { position: absolute; width: 60px; height: 60px; background: rgba(0, 0, 255, 0.3); border-radius: 50%; }
        .boss-attack { position: absolute; width: 30px; height: 30px; background: purple; border-radius: 50%; }
        .level-transition { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; color: #fff; text-shadow: 0 0 10px #000; }
        .pause-menu { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.9); padding: 20px; border-radius: 10px; text-align: center; color: #fff; }
        .pause-menu button { margin: 10px; padding: 10px 20px; background: #1e90ff; border: none; color: #fff; border-radius: 5px; cursor: pointer; }
        .pause-menu button:hover { background: #4169e1; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
    `;
    document.head.appendChild(style);
}

function displayHighScore() {
    const highScoreDisplay = document.createElement('div');
    highScoreDisplay.classList.add('stat-item');
    highScoreDisplay.innerHTML = `<span>Eng yuqori ochko:</span> <span>${highScore}</span>`;
    document.querySelector('.stats-panel').appendChild(highScoreDisplay);
}

function displayGameStats() {
    const stats = document.createElement('p');
    stats.textContent = `Vaqt: ${(gameTime / 1000).toFixed(1)}s | Xazinalar: ${totalTreasures} | Yo'q qilingan dushmanlar: ${totalEnemiesDestroyed} | Daraja: ${level}`;
    gameOverModal.appendChild(stats);
}

function preloadSounds() {
    window.sounds = {
        treasure: new Audio('treasure.mp3'),
        hit: new Audio('hit.mp3'),
        explosion: new Audio('explosion.mp3'),
        bonus: new Audio('bonus.mp3'),
        laser: new Audio('laser.mp3'),
        shield: new Audio('shield.mp3'),
        boss: new Audio('boss.mp3'),
        'boss-attack': new Audio('boss-attack.mp3')
    };
}

function playSound(type) {
    if (window.sounds && window.sounds[type]) {
        window.sounds[type].currentTime = 0;
        window.sounds[type].play().catch(() => {});
    }
}

initializeGame();
const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;
let enemies = [];
let treasures = [];
let bonuses = [];
let particles = [];
let lasers = [];
let shields = [];
let bossAttacks = [];
let crystals = 0;
let lastTreasureTime = 0;
let lastEnemyTime = 0;
let lastBonusTime = 0;
let lastLaserTime = 0;
let lastShieldTime = 0;
let lastBossAttackTime = 0;
let lastMinionTime = 0;
let invincible = false;
let gameTime = 0;
let highScore = localStorage.getItem('highScore') || 0;
let totalTreasures = 0;
let totalEnemiesDestroyed = 0;
let bossActive = false;
let slowMotion = false;
let bossPhase = 1;

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
    if (invincible) ship.style.filter = 'brightness(2) drop-shadow(0 0 5px #fff)';
    else ship.style.filter = 'brightness(1)';
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed.toFixed(1)}x`;
    levelDisplay.textContent = level;
    document.getElementById('crystal-count').textContent = crystals;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function createTreasure(timestamp) {
    if (timestamp - lastTreasureTime < 2000 / speed || bossActive) return;
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    treasures.push(treasure);
    totalTreasures++;
    lastTreasureTime = timestamp;
    setTimeout(() => {
        treasure.remove();
        treasures = treasures.filter(t => t !== treasure);
    }, 5000);
    createParticles(treasure.style.left, treasure.style.top, 'yellow');
    playSound('treasure');
}

function createEnemy(timestamp, type = 'normal') {
    if (timestamp - lastEnemyTime < 3000 / (speed * (1 + level * 0.1)) || bossActive) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    if (type === 'fast') enemy.classList.add('fast-enemy');
    else if (type === 'zigzag') enemy.classList.add('zigzag-enemy');
    else if (type === 'smart') enemy.classList.add('smart-enemy');
    else if (type === 'boss') enemy.classList.add('boss-enemy');
    else if (type === 'minion') enemy.classList.add('minion-enemy');
    enemy.style.left = '800px';
    enemy.style.top = `${Math.random() * 450}px`;
    const health = type === 'boss' ? 50 : type === 'minion' ? 2 : 1;
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, x: 800, y: parseFloat(enemy.style.top), type, angle: 0, health });
    lastEnemyTime = timestamp;
    if (type === 'boss') bossActive = true;
}

function createMinions(timestamp) {
    if (timestamp - lastMinionTime < 5000 || !bossActive) return;
    for (let i = 0; i < 2; i++) {
        createEnemy(timestamp, 'minion');
    }
    lastMinionTime = timestamp;
}

function createBonus(timestamp, type = 'life') {
    if (timestamp - lastBonusTime < 15000 / speed || bossActive) return;
    const bonus = document.createElement('div');
    bonus.classList.add('bonus');
    bonus.style.left = `${Math.random() * 750}px`;
    bonus.style.top = `${Math.random() * 450}px`;
    bonus.dataset.type = type;
    if (type === 'life') bonus.style.background = 'green';
    else if (type === 'speed') bonus.style.background = 'purple';
    else if (type === 'laser') bonus.style.background = 'cyan';
    else if (type === 'shield') bonus.style.background = 'blue';
    else if (type === 'slow') bonus.style.background = 'silver';
    else if (type === 'crystal') bonus.style.background = 'pink';
    bonus.style.width = '25px';
    bonus.style.height = '25px';
    gameArea.appendChild(bonus);
    bonuses.push(bonus);
    lastBonusTime = timestamp;
    setTimeout(() => {
        bonus.remove();
        bonuses = bonuses.filter(b => b !== bonus);
    }, 7000);
}

function createLaser(timestamp, type = 'normal') {
    if (timestamp - lastLaserTime < 500 / speed || !isGameRunning) return;
    const laser = document.createElement('div');
    laser.classList.add('laser');
    laser.dataset.type = type;
    laser.style.left = `${shipX + 50}px`;
    laser.style.top = `${shipY + 20}px`;
    if (type === 'power') laser.style.background = 'yellow';
    else if (type === 'homing') laser.style.background = 'green';
    gameArea.appendChild(laser);
    lasers.push({ element: laser, x: shipX + 50, y: shipY + 20, type });
    lastLaserTime = timestamp;
    playSound('laser');
}

function createShield(timestamp) {
    if (timestamp - lastShieldTime < 10000 || shields.length > 0) return;
    const shield = document.createElement('div');
    shield.classList.add('shield');
    shield.style.left = `${shipX}px`;
    shield.style.top = `${shipY}px`;
    gameArea.appendChild(shield);
    shields.push(shield);
    lastShieldTime = timestamp;
    setTimeout(() => {
        shield.remove();
        shields = shields.filter(s => s !== shield);
    }, 5000);
    playSound('shield');
}

function createBossAttack(timestamp) {
    if (timestamp - lastBossAttackTime < (bossPhase === 1 ? 2000 : 1000) || !bossActive) return;
    const boss = enemies.find(e => e.type === 'boss');
    if (!boss) return;
    const attack = document.createElement('div');
    attack.classList.add('boss-attack');
    attack.style.left = `${boss.x}px`;
    attack.style.top = `${boss.y + 50}px`;
    gameArea.appendChild(attack);
    bossAttacks.push({ element: attack, x: boss.x, y: boss.y + 50 });
    lastBossAttackTime = timestamp;
    playSound('boss-attack');
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const speedFactor = slowMotion ? 0.5 : enemy.type === 'fast' ? 4 : enemy.type === 'zigzag' ? 3 : enemy.type === 'smart' ? 2.5 : enemy.type === 'boss' ? 1 : enemy.type === 'minion' ? 3.5 : 2;
        enemy.x -= speedFactor * speed;
        if (enemy.type === 'zigzag') {
            enemy.angle += 0.1;
            enemy.y += Math.sin(enemy.angle) * 5;
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'smart') {
            const dy = shipY - enemy.y;
            enemy.y += dy > 0 ? 2 : -2;
            enemy.y = Math.max(0, Math.min(450, enemy.y));
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'boss') {
            enemy.y = 200 + Math.sin(enemy.angle) * (bossPhase === 1 ? 100 : 150);
            enemy.angle += bossPhase === 1 ? 0.05 : 0.07;
            enemy.element.style.top = `${enemy.y}px`;
            if (enemy.x < 600) enemy.x = 600;
            if (enemy.health <= 25 && bossPhase === 1) bossPhase = 2;
        }
        enemy.element.style.left = `${enemy.x}px`;
        if (enemy.x < -50 || enemy.health <= 0) {
            if (enemy.type === 'boss' && enemy.health <= 0) {
                bossActive = false;
                bossPhase = 1;
                crystals += 50;
            }
            enemy.element.remove();
            enemies.splice(index, 1);
        }
    });
}

function moveLasers() {
    lasers.forEach((laser, index) => {
        if (laser.type === 'homing') {
            const nearestEnemy = enemies.reduce((closest, e) => {
                const dist = Math.hypot(e.x - laser.x, e.y - laser.y);
                return dist < Math.hypot(closest.x - laser.x, closest.y - laser.y) ? e : closest;
            }, { x: laser.x + 100, y: laser.y });
            const dx = nearestEnemy.x - laser.x;
            const dy = nearestEnemy.y - laser.y;
            const angle = Math.atan2(dy, dx);
            laser.x += Math.cos(angle) * 5 * speed;
            laser.y += Math.sin(angle) * 5 * speed;
            laser.element.style.left = `${laser.x}px`;
            laser.element.style.top = `${laser.y}px`;
        } else {
            laser.x += (slowMotion ? 5 : 10) * speed;
            laser.element.style.left = `${laser.x}px`;
        }
        if (laser.x > 800 || laser.y < 0 || laser.y > 500) {
            laser.element.remove();
            lasers.splice(index, 1);
        }
    });
}

function moveShields() {
    shields.forEach(shield => {
        shield.style.left = `${shipX}px`;
        shield.style.top = `${shipY}px`;
    });
}

function moveBossAttacks() {
    bossAttacks.forEach((attack, index) => {
        attack.x -= (slowMotion ? 2 : 4) * speed * (bossPhase === 1 ? 1 : 1.5);
        attack.element.style.left = `${attack.x}px`;
        if (attack.x < -20) {
            attack.element.remove();
            bossAttacks.splice(index, 1);
        }
    });
}

function createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = x;
        particle.style.top = y;
        particle.style.background = color;
        particle.style.width = '5px';
        particle.style.height = '5px';
        gameArea.appendChild(particle);
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            element: particle,
            x: parseFloat(x),
            y: parseFloat(y),
            vx: Math.cos(angle) * 2,
            vy: Math.sin(angle) * 2,
            life: 1000
        });
    }
}

function moveParticles() {
    particles.forEach((p, i) => {
        p.x += p.vx * (slowMotion ? 0.5 : 1);
        p.y += p.vy * (slowMotion ? 0.5 : 1);
        p.life -= 16;
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = p.life / 1000;
        if (p.life <= 0) {
            p.element.remove();
            particles.splice(i, 1);
        }
    });
}

function checkCollision(type) {
    const sRect = ship.getBoundingClientRect();
    if (type === 'treasure') {
        treasures.forEach((t, i) => {
            const tRect = t.getBoundingClientRect();
            if (sRect.left < tRect.right && sRect.right > tRect.left &&
                sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
                score += 10 * level;
                t.remove();
                treasures.splice(i, 1);
                updateStats();
            }
        });
    } else if (type === 'enemy') {
        enemies.forEach((e, i) => {
            const eRect = e.element.getBoundingClientRect();
            if (sRect.left < eRect.right && sRect.right > eRect.left &&
                sRect.top < eRect.bottom && sRect.bottom > eRect.top) {
                if (!invincible && shields.length === 0) {
                    lives--;
                    e.element.remove();
                    enemies.splice(i, 1);
                    createParticles(e.x + 'px', e.y + 'px', 'red');
                    updateStats();
                    playSound('hit');
                }
            }
        });
    } else if (type === 'bonus') {
        bonuses.forEach((b, i) => {
            const bRect = b.getBoundingClientRect();
            if (sRect.left < bRect.right && sRect.right > bRect.left &&
                sRect.top < bRect.bottom && sRect.bottom > bRect.top) {
                activateBonus(b.dataset.type);
                b.remove();
                bonuses.splice(i, 1);
            }
        });
    } else if (type === 'laser') {
        lasers.forEach((l, i) => {
            const lRect = l.element.getBoundingClientRect();
            enemies.forEach((e, j) => {
                const eRect = e.element.getBoundingClientRect();
                if (lRect.left < eRect.right && lRect.right > eRect.left &&
                    lRect.top < eRect.bottom && lRect.bottom > eRect.top) {
                    e.health -= l.type === 'power' ? 5 : l.type === 'homing' ? 3 : 1;
                    score += 5;
                    totalEnemiesDestroyed++;
                    l.element.remove();
                    lasers.splice(i, 1);
                    if (e.health <= 0) {
                        e.element.remove();
                        enemies.splice(j, 1);
                        createParticles(e.x + 'px', e.y + 'px', 'orange');
                        if (e.type !== 'boss') crystals += 1;
                    }
                    updateStats();
                    playSound('explosion');
                }
            });
        });
    } else if (type === 'boss-attack') {
        bossAttacks.forEach((a, i) => {
            const aRect = a.element.getBoundingClientRect();
            if (sRect.left < aRect.right && sRect.right > aRect.left &&
                sRect.top < aRect.bottom && sRect.bottom > aRect.top) {
                if (!invincible && shields.length === 0) {
                    lives--;
                    a.element.remove();
                    bossAttacks.splice(i, 1);
                    updateStats();
                    playSound('hit');
                }
            }
        });
    }
}

function activateBonus(type) {
    if (type === 'life') {
        invincible = true;
        setTimeout(() => invincible = false, 5000);
        lives = Math.min(lives + 1, 5);
    } else if (type === 'speed') {
        speed += 1;
        setTimeout(() => speed -= 1, 10000);
    } else if (type === 'laser') {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createLaser(performance.now(), 'power'), i * 200);
        }
    } else if (type === 'shield') {
        createShield(performance.now());
    } else if (type === 'slow') {
        slowMotion = true;
        setTimeout(() => slowMotion = false, 5000);
    } else if (type === 'crystal') {
        crystals += 10;
    }
    createParticles(shipX + 'px', shipY + 'px', 'lime');
    updateStats();
    playSound('bonus');
}

function levelUp() {
    if (score >= level * 50) {
        level++;
        speed += 0.5;
        updateStats();
        changeBackground();
        if (level % 5 === 0) {
            createEnemy(performance.now(), 'boss');
            playSound('boss');
        }
        showLevelTransition();
    }
}

function changeBackground() {
    const backgrounds = [
        'url("space-bg.jpg")',
        'url("galaxy-bg.jpg")',
        'url("nebula-bg.jpg")',
        'url("blackhole-bg.jpg")',
        'url("starfield-bg.jpg")'
    ];
    gameArea.style.background = backgrounds[level % 5] + ' no-repeat center';
    gameArea.style.backgroundSize = 'cover';
}

function showLevelTransition() {
    const transition = document.createElement('div');
    transition.classList.add('level-transition');
    transition.textContent = `Daraja ${level}`;
    gameArea.appendChild(transition);
    setTimeout(() => transition.remove(), 2000);
}

function showPauseMenu() {
    const pauseMenu = document.createElement('div');
    pauseMenu.classList.add('pause-menu');
    pauseMenu.innerHTML = `
        <h2>O'yin to'xtatildi</h2>
        <button id="resume-btn">Davom etish</button>
        <button id="quit-btn">Chiqish</button>
    `;
    gameArea.appendChild(pauseMenu);
    document.getElementById('resume-btn').addEventListener('click', () => {
        isGameRunning = true;
        pauseMenu.remove();
        gameLoop(performance.now());
    });
    document.getElementById('quit-btn').addEventListener('click', () => location.reload());
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning && e.key !== 'Escape') return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10 * speed); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10 * speed); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10 * speed); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10 * speed); break;
        case ' ': createLaser(performance.now()); break;
        case 'h': createLaser(performance.now(), 'homing'); break; // 'H' bilan homing lazer
        case 'Escape': if (isGameRunning) { isGameRunning = false; showPauseMenu(); } break;
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop(performance.now());
    }
});

pauseBtn.addEventListener('click', () => {
    if (isGameRunning) {
        isGameRunning = false;
        showPauseMenu();
    }
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    gameTime += 16;
    moveEnemies();
    moveLasers();
    moveShields();
    moveBossAttacks();
    moveParticles();
    checkCollision('treasure');
    checkCollision('enemy');
    checkCollision('bonus');
    checkCollision('laser');
    checkCollision('boss-attack');
    levelUp();
    if (bossActive) createMinions(timestamp);

    if (Math.random() < 0.05) createTreasure(timestamp);
    if (Math.random() < 0.03) createEnemy(timestamp, 'normal');
    if (Math.random() < 0.01) createEnemy(timestamp, 'fast');
    if (Math.random() < 0.008) createEnemy(timestamp, 'zigzag');
    if (Math.random() < 0.005) createEnemy(timestamp, 'smart');
    if (Math.random() < 0.015) createBonus(timestamp, 'life');
    if (Math.random() < 0.01) createBonus(timestamp, 'speed');
    if (Math.random() < 0.008) createBonus(timestamp, 'laser');
    if (Math.random() < 0.006) createBonus(timestamp, 'shield');
    if (Math.random() < 0.004) createBonus(timestamp, 'slow');
    if (Math.random() < 0.003) createBonus(timestamp, 'crystal');
    if (bossActive) createBossAttack(timestamp);

    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
        displayGameStats();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function initializeGame() {
    moveShip();
    updateStats();
    gameArea.style.background = 'url("space-bg.jpg") no-repeat center';
    gameArea.style.backgroundSize = 'cover';
    addCustomStyles();
    displayHighScore();
    addCrystalCounter();
    preloadSounds();
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fast-enemy { width: 30px; height: 30px; background: url('fast-meteor.png') no-repeat center; background-size: contain; }
        .zigzag-enemy { width: 35px; height: 35px; background: url('zigzag-enemy.png') no-repeat center; background-size: contain; }
        .smart-enemy { width: 40px; height: 40px; background: url('smart-enemy.png') no-repeat center; background-size: contain; }
        .boss-enemy { width: 100px; height: 100px; background: url('boss.png') no-repeat center; background-size: contain; }
        .minion-enemy { width: 20px; height: 20px; background: url('minion.png') no-repeat center; background-size: contain; }
        .bonus { border-radius: 50%; animation: pulse 1s infinite; }
        .particle { position: absolute; border-radius: 50%; }
        .laser { position: absolute; width: 20px; height: 5px; background: red; border-radius: 2px; }
        .shield { position: absolute; width: 60px; height: 60px; background: rgba(0, 0, 255, 0.3); border-radius: 50%; }
        .boss-attack { position: absolute; width: 30px; height: 30px; background: purple; border-radius: 50%; }
        .level-transition { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; color: #fff; text-shadow: 0 0 10px #000; }
        .pause-menu { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.9); padding: 20px; border-radius: 10px; text-align: center; color: #fff; }
        .pause-menu button { margin: 10px; padding: 10px 20px; background: #1e90ff; border: none; color: #fff; border-radius: 5px; cursor: pointer; }
        .pause-menu button:hover { background: #4169e1; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
    `;
    document.head.appendChild(style);
}

function displayHighScore() {
    const highScoreDisplay = document.createElement('div');
    highScoreDisplay.classList.add('stat-item');
    highScoreDisplay.innerHTML = `<span>Eng yuqori ochko:</span> <span>${highScore}</span>`;
    document.querySelector('.stats-panel').appendChild(highScoreDisplay);
}

function addCrystalCounter() {
    const crystalDisplay = document.createElement('div');
    crystalDisplay.classList.add('stat-item');
    crystalDisplay.innerHTML = `<span>Kristallar:</span> <span id="crystal-count">${crystals}</span>`;
    document.querySelector('.stats-panel').appendChild(crystalDisplay);
}

function displayGameStats() {
    const stats = document.createElement('p');
    stats.textContent = `Vaqt: ${(gameTime / 1000).toFixed(1)}s | Xazinalar: ${totalTreasures} | Yo'q qilingan dushmanlar: ${totalEnemiesDestroyed} | Daraja: ${level} | Kristallar: ${crystals}`;
    gameOverModal.appendChild(stats);
}

function preloadSounds() {
    window.sounds = {
        treasure: new Audio('treasure.mp3'),
        hit: new Audio('hit.mp3'),
        explosion: new Audio('explosion.mp3'),
        bonus: new Audio('bonus.mp3'),
        laser: new Audio('laser.mp3'),
        shield: new Audio('shield.mp3'),
        boss: new Audio('boss.mp3'),
        'boss-attack': new Audio('boss-attack.mp3')
    };
}

function playSound(type) {
    if (window.sounds && window.sounds[type]) {
        window.sounds[type].currentTime = 0;
        window.sounds[type].play().catch(() => {});
    }
}

initializeGame();
const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;
let enemies = [];
let treasures = [];
let bonuses = [];
let particles = [];
let lasers = [];
let shields = [];
let bossAttacks = [];
let crystals = 0;
let lastTreasureTime = 0;
let lastEnemyTime = 0;
let lastBonusTime = 0;
let lastLaserTime = 0;
let lastShieldTime = 0;
let lastBossAttackTime = 0;
let lastMinionTime = 0;
let invincible = false;
let gameTime = 0;
let highScore = localStorage.getItem('highScore') || 0;
let totalTreasures = 0;
let totalEnemiesDestroyed = 0;
let bossActive = false;
let slowMotion = false;
let bossPhase = 1;
let upgrades = { laserSpeed: 1, shieldDuration: 1, maxLives: 3 };

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
    if (invincible) ship.style.filter = 'brightness(2) drop-shadow(0 0 5px #fff)';
    else ship.style.filter = 'brightness(1)';
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed.toFixed(1)}x`;
    levelDisplay.textContent = level;
    document.getElementById('crystal-count').textContent = crystals;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function createTreasure(timestamp) {
    if (timestamp - lastTreasureTime < 2000 / speed || bossActive) return;
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    treasures.push(treasure);
    totalTreasures++;
    lastTreasureTime = timestamp;
    setTimeout(() => {
        treasure.remove();
        treasures = treasures.filter(t => t !== treasure);
    }, 5000);
    createParticles(treasure.style.left, treasure.style.top, 'yellow', 5);
    playSound('treasure');
}

function createEnemy(timestamp, type = 'normal') {
    if (timestamp - lastEnemyTime < 3000 / (speed * (1 + level * 0.1)) || bossActive) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    if (type === 'fast') enemy.classList.add('fast-enemy');
    else if (type === 'zigzag') enemy.classList.add('zigzag-enemy');
    else if (type === 'smart') enemy.classList.add('smart-enemy');
    else if (type === 'boss') enemy.classList.add('boss-enemy');
    else if (type === 'minion') enemy.classList.add('minion-enemy');
    enemy.style.left = '800px';
    enemy.style.top = `${Math.random() * 450}px`;
    const health = type === 'boss' ? 75 : type === 'minion' ? 2 : 1;
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, x: 800, y: parseFloat(enemy.style.top), type, angle: 0, health });
    lastEnemyTime = timestamp;
    if (type === 'boss') bossActive = true;
}

function createMinions(timestamp) {
    if (timestamp - lastMinionTime < 5000 || !bossActive) return;
    for (let i = 0; i < (bossPhase === 3 ? 3 : 2); i++) {
        createEnemy(timestamp, 'minion');
    }
    lastMinionTime = timestamp;
}

function createBonus(timestamp, type = 'life') {
    if (timestamp - lastBonusTime < 15000 / speed || bossActive) return;
    const bonus = document.createElement('div');
    bonus.classList.add('bonus');
    bonus.style.left = `${Math.random() * 750}px`;
    bonus.style.top = `${Math.random() * 450}px`;
    bonus.dataset.type = type;
    if (type === 'life') bonus.style.background = 'green';
    else if (type === 'speed') bonus.style.background = 'purple';
    else if (type === 'laser') bonus.style.background = 'cyan';
    else if (type === 'shield') bonus.style.background = 'blue';
    else if (type === 'slow') bonus.style.background = 'silver';
    else if (type === 'crystal') bonus.style.background = 'pink';
    bonus.style.width = '25px';
    bonus.style.height = '25px';
    gameArea.appendChild(bonus);
    bonuses.push(bonus);
    lastBonusTime = timestamp;
    setTimeout(() => {
        bonus.remove();
        bonuses = bonuses.filter(b => b !== bonus);
    }, 7000);
}

function createLaser(timestamp, type = 'normal') {
    if (timestamp - lastLaserTime < 500 / (speed * upgrades.laserSpeed) || !isGameRunning) return;
    const laser = document.createElement('div');
    laser.classList.add('laser');
    laser.dataset.type = type;
    laser.style.left = `${shipX + 50}px`;
    laser.style.top = `${shipY + 20}px`;
    if (type === 'power') laser.style.background = 'yellow';
    else if (type === 'homing') laser.style.background = 'green';
    gameArea.appendChild(laser);
    lasers.push({ element: laser, x: shipX + 50, y: shipY + 20, type });
    lastLaserTime = timestamp;
    playSound('laser');
}

function createShield(timestamp) {
    if (timestamp - lastShieldTime < 10000 || shields.length > 0) return;
    const shield = document.createElement('div');
    shield.classList.add('shield');
    shield.style.left = `${shipX}px`;
    shield.style.top = `${shipY}px`;
    gameArea.appendChild(shield);
    shields.push(shield);
    lastShieldTime = timestamp;
    setTimeout(() => {
        shield.remove();
        shields = shields.filter(s => s !== shield);
    }, 5000 * upgrades.shieldDuration);
    playSound('shield');
}

function createBossAttack(timestamp) {
    if (timestamp - lastBossAttackTime < (bossPhase === 1 ? 2000 : bossPhase === 2 ? 1000 : 500) || !bossActive) return;
    const boss = enemies.find(e => e.type === 'boss');
    if (!boss) return;
    const attack = document.createElement('div');
    attack.classList.add('boss-attack');
    attack.style.left = `${boss.x}px`;
    attack.style.top = `${boss.y + 50}px`;
    attack.dataset.phase = bossPhase;
    if (bossPhase === 3) attack.style.background = 'red';
    gameArea.appendChild(attack);
    bossAttacks.push({ element: attack, x: boss.x, y: boss.y + 50, phase: bossPhase });
    lastBossAttackTime = timestamp;
    playSound('boss-attack');
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const speedFactor = slowMotion ? 0.5 : enemy.type === 'fast' ? 4 : enemy.type === 'zigzag' ? 3 : enemy.type === 'smart' ? 2.5 : enemy.type === 'boss' ? 1 : enemy.type === 'minion' ? 3.5 : 2;
        enemy.x -= speedFactor * speed;
        if (enemy.type === 'zigzag') {
            enemy.angle += 0.1;
            enemy.y += Math.sin(enemy.angle) * 5;
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'smart') {
            const dy = shipY - enemy.y;
            enemy.y += dy > 0 ? 2 : -2;
            enemy.y = Math.max(0, Math.min(450, enemy.y));
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'boss') {
            enemy.y = 200 + Math.sin(enemy.angle) * (bossPhase === 1 ? 100 : bossPhase === 2 ? 150 : 200);
            enemy.angle += bossPhase === 1 ? 0.05 : bossPhase === 2 ? 0.07 : 0.09;
            enemy.element.style.top = `${enemy.y}px`;
            if (enemy.x < 600) enemy.x = 600;
            if (enemy.health <= 50 && bossPhase === 1) bossPhase = 2;
            else if (enemy.health <= 25 && bossPhase === 2) bossPhase = 3;
        }
        enemy.element.style.left = `${enemy.x}px`;
        if (enemy.x < -50 || enemy.health <= 0) {
            if (enemy.type === 'boss' && enemy.health <= 0) {
                bossActive = false;
                bossPhase = 1;
                crystals += 50;
            }
            enemy.element.remove();
            enemies.splice(index, 1);
        }
    });
}

function moveLasers() {
    lasers.forEach((laser, index) => {
        if (laser.type === 'homing') {
            const nearestEnemy = enemies.reduce((closest, e) => {
                const dist = Math.hypot(e.x - laser.x, e.y - laser.y);
                return dist < Math.hypot(closest.x - laser.x, closest.y - laser.y) ? e : closest;
            }, { x: laser.x + 100, y: laser.y });
            const dx = nearestEnemy.x - laser.x;
            const dy = nearestEnemy.y - laser.y;
            const angle = Math.atan2(dy, dx);
            laser.x += Math.cos(angle) * 5 * speed * upgrades.laserSpeed;
            laser.y += Math.sin(angle) * 5 * speed * upgrades.laserSpeed;
            laser.element.style.left = `${laser.x}px`;
            laser.element.style.top = `${laser.y}px`;
        } else {
            laser.x += (slowMotion ? 5 : 10) * speed * upgrades.laserSpeed;
            laser.element.style.left = `${laser.x}px`;
        }
        if (laser.x > 800 || laser.y < 0 || laser.y > 500) {
            laser.element.remove();
            lasers.splice(index, 1);
        }
    });
}

function moveShields() {
    shields.forEach(shield => {
        shield.style.left = `${shipX}px`;
        shield.style.top = `${shipY}px`;
    });
}

function moveBossAttacks() {
    bossAttacks.forEach((attack, index) => {
        attack.x -= (slowMotion ? 2 : attack.phase === 1 ? 4 : attack.phase === 2 ? 6 : 8) * speed;
        if (attack.phase === 3) {
            attack.y += Math.sin(attack.x * 0.05) * 5;
            attack.element.style.top = `${attack.y}px`;
        }
        attack.element.style.left = `${attack.x}px`;
        if (attack.x < -20) {
            attack.element.remove();
            bossAttacks.splice(index, 1);
        }
    });
}

function createParticles(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = x;
        particle.style.top = y;
        particle.style.background = color;
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = `${Math.random() * 5 + 2}px`;
        gameArea.appendChild(particle);
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            element: particle,
            x: parseFloat(x),
            y: parseFloat(y),
            vx: Math.cos(angle) * (Math.random() * 2 + 1),
            vy: Math.sin(angle) * (Math.random() * 2 + 1),
            life: Math.random() * 1000 + 500
        });
    }
}

function moveParticles() {
    particles.forEach((p, i) => {
        p.x += p.vx * (slowMotion ? 0.5 : 1);
        p.y += p.vy * (slowMotion ? 0.5 : 1);
        p.life -= 16;
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = p.life / 1000;
        if (p.life <= 0) {
            p.element.remove();
            particles.splice(i, 1);
        }
    });
}

function checkCollision(type) {
    const sRect = ship.getBoundingClientRect();
    if (type === 'treasure') {
        treasures.forEach((t, i) => {
            const tRect = t.getBoundingClientRect();
            if (sRect.left < tRect.right && sRect.right > tRect.left &&
                sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
                score += 10 * level;
                t.remove();
                treasures.splice(i, 1);
                updateStats();
            }
        });
    } else if (type === 'enemy') {
        enemies.forEach((e, i) => {
            const eRect = e.element.getBoundingClientRect();
            if (sRect.left < eRect.right && sRect.right > eRect.left &&
                sRect.top < eRect.bottom && sRect.bottom > eRect.top) {
                if (!invincible && shields.length === 0) {
                    lives--;
                    e.element.remove();
                    enemies.splice(i, 1);
                    createParticles(e.x + 'px', e.y + 'px', 'red', 10);
                    updateStats();
                    playSound('hit');
                }
            }
        });
    } else if (type === 'bonus') {
        bonuses.forEach((b, i) => {
            const bRect = b.getBoundingClientRect();
            if (sRect.left < bRect.right && sRect.right > bRect.left &&
                sRect.top < bRect.bottom && sRect.bottom > bRect.top) {
                activateBonus(b.dataset.type);
                b.remove();
                bonuses.splice(i, 1);
            }
        });
    } else if (type === 'laser') {
        lasers.forEach((l, i) => {
            const lRect = l.element.getBoundingClientRect();
            enemies.forEach((e, j) => {
                const eRect = e.element.getBoundingClientRect();
                if (lRect.left < eRect.right && lRect.right > eRect.left &&
                    lRect.top < eRect.bottom && lRect.bottom > eRect.top) {
                    e.health -= l.type === 'power' ? 5 : l.type === 'homing' ? 3 : 1;
                    score += 5;
                    totalEnemiesDestroyed++;
                    l.element.remove();
                    lasers.splice(i, 1);
                    if (e.health <= 0) {
                        e.element.remove();
                        enemies.splice(j, 1);
                        createParticles(e.x + 'px', e.y + 'px', 'orange', 10);
                        if (e.type !== 'boss') crystals += 1;
                    }
                    updateStats();
                    playSound('explosion');
                }
            });
        });
    } else if (type === 'boss-attack') {
        bossAttacks.forEach((a, i) => {
            const aRect = a.element.getBoundingClientRect();
            if (sRect.left < aRect.right && sRect.right > aRect.left &&
                sRect.top < aRect.bottom && sRect.bottom > aRect.top) {
                if (!invincible && shields.length === 0) {
                    lives--;
                    a.element.remove();
                    bossAttacks.splice(i, 1);
                    updateStats();
                    playSound('hit');
                }
            }
        });
    }
}

function activateBonus(type) {
    if (type === 'life') {
        invincible = true;
        setTimeout(() => invincible = false, 5000);
        lives = Math.min(lives + 1, upgrades.maxLives);
    } else if (type === 'speed') {
        speed += 1;
        setTimeout(() => speed -= 1, 10000);
    } else if (type === 'laser') {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createLaser(performance.now(), 'power'), i * 200);
        }
    } else if (type === 'shield') {
        createShield(performance.now());
    } else if (type === 'slow') {
        slowMotion = true;
        setTimeout(() => slowMotion = false, 5000);
    } else if (type === 'crystal') {
        crystals += 10;
    }
    createParticles(shipX + 'px', shipY + 'px', 'lime', 8);
    updateStats();
    playSound('bonus');
}

function levelUp() {
    if (score >= level * 50) {
        level++;
        speed += 0.5;
        updateStats();
        changeBackground();
        if (level % 5 === 0) {
            createEnemy(performance.now(), 'boss');
            playSound('boss');
        }
        showLevelTransition();
    }
}

function changeBackground() {
    const backgrounds = [
        'url("space-bg.jpg")',
        'url("galaxy-bg.jpg")',
        'url("nebula-bg.jpg")',
        'url("blackhole-bg.jpg")',
        'url("starfield-bg.jpg")'
    ];
    gameArea.style.background = backgrounds[level % 5] + ' no-repeat center';
    gameArea.style.backgroundSize = 'cover';
}

function showLevelTransition() {
    const transition = document.createElement('div');
    transition.classList.add('level-transition');
    transition.textContent = `Daraja ${level}`;
    gameArea.appendChild(transition);
    setTimeout(() => transition.remove(), 2000);
}

function showPauseMenu() {
    const pauseMenu = document.createElement('div');
    pauseMenu.classList.add('pause-menu');
    pauseMenu.innerHTML = `
        <h2>O'yin to'xtatildi</h2>
        <button id="resume-btn">Davom etish</button>
        <button id="shop-btn">Do'kon</button>
        <button id="quit-btn">Chiqish</button>
    `;
    gameArea.appendChild(pauseMenu);
    document.getElementById('resume-btn').addEventListener('click', () => {
        isGameRunning = true;
        pauseMenu.remove();
        gameLoop(performance.now());
    });
    document.getElementById('shop-btn').addEventListener('click', () => {
        pauseMenu.remove();
        showShopMenu();
    });
    document.getElementById('quit-btn').addEventListener('click', () => location.reload());
}

function showShopMenu() {
    const shopMenu = document.createElement('div');
    shopMenu.classList.add('pause-menu');
    shopMenu.innerHTML = `
        <h2>Do'kon</h2>
        <p>Kristallar: <span id="shop-crystals">${crystals}</span></p>
        <button id="upgrade-laser">Lazer tezligi (+0.5) - 20 kristal</button>
        <button id="upgrade-shield">Qalqon davomiyligi (+0.5) - 30 kristal</button>
        <button id="upgrade-lives">Maksimal hayot (+1) - 50 kristal</button>
        <button id="back-btn">Orqaga</button>
    `;
    gameArea.appendChild(shopMenu);
    document.getElementById('upgrade-laser').addEventListener('click', () => {
        if (crystals >= 20) {
            crystals -= 20;
            upgrades.laserSpeed += 0.5;
            updateShopCrystals(shopMenu);
        }
    });
    document.getElementById('upgrade-shield').addEventListener('click', () => {
        if (crystals >= 30) {
            crystals -= 30;
            upgrades.shieldDuration += 0.5;
            updateShopCrystals(shopMenu);
        }
    });
    document.getElementById('upgrade-lives').addEventListener('click', () => {
        if (crystals >= 50) {
            crystals -= 50;
            upgrades.maxLives += 1;
            updateShopCrystals(shopMenu);
        }
    });
    document.getElementById('back-btn').addEventListener('click', () => {
        shopMenu.remove();
        showPauseMenu();
    });
}

function updateShopCrystals(menu) {
    menu.querySelector('#shop-crystals').textContent = crystals;
    updateStats();
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning && e.key !== 'Escape') return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10 * speed); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10 * speed); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10 * speed); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10 * speed); break;
        case ' ': createLaser(performance.now()); break;
        case 'h': createLaser(performance.now(), 'homing'); break;
        case 'Escape': if (isGameRunning) { isGameRunning = false; showPauseMenu(); } break;
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop(performance.now());
    }
});

pauseBtn.addEventListener('click', () => {
    if (isGameRunning) {
        isGameRunning = false;
        showPauseMenu();
    }
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    gameTime += 16;
    moveEnemies();
    moveLasers();
    moveShields();
    moveBossAttacks();
    moveParticles();
    checkCollision('treasure');
    checkCollision('enemy');
    checkCollision('bonus');
    checkCollision('laser');
    checkCollision('boss-attack');
    levelUp();
    if (bossActive) createMinions(timestamp);

    if (Math.random() < 0.05) createTreasure(timestamp);
    if (Math.random() < 0.03) createEnemy(timestamp, 'normal');
    if (Math.random() < 0.01) createEnemy(timestamp, 'fast');
    if (Math.random() < 0.008) createEnemy(timestamp, 'zigzag');
    if (Math.random() < 0.005) createEnemy(timestamp, 'smart');
    if (Math.random() < 0.015) createBonus(timestamp, 'life');
    if (Math.random() < 0.01) createBonus(timestamp, 'speed');
    if (Math.random() < 0.008) createBonus(timestamp, 'laser');
    if (Math.random() < 0.006) createBonus(timestamp, 'shield');
    if (Math.random() < 0.004) createBonus(timestamp, 'slow');
    if (Math.random() < 0.003) createBonus(timestamp, 'crystal');
    if (bossActive) createBossAttack(timestamp);

    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
        displayGameStats();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function initializeGame() {
    moveShip();
    updateStats();
    gameArea.style.background = 'url("space-bg.jpg") no-repeat center';
    gameArea.style.backgroundSize = 'cover';
    addCustomStyles();
    displayHighScore();
    addCrystalCounter();
    preloadSounds();
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fast-enemy { width: 30px; height: 30px; background: url('fast-meteor.png') no-repeat center; background-size: contain; }
        .zigzag-enemy { width: 35px; height: 35px; background: url('zigzag-enemy.png') no-repeat center; background-size: contain; }
        .smart-enemy { width: 40px; height: 40px; background: url('smart-enemy.png') no-repeat center; background-size: contain; }
        .boss-enemy { width: 100px; height: 100px; background: url('boss.png') no-repeat center; background-size: contain; }
        .minion-enemy { width: 20px; height: 20px; background: url('minion.png') no-repeat center; background-size: contain; }
        .bonus { border-radius: 50%; animation: pulse 1s infinite; }
        .particle { position: absolute; border-radius: 50%; }
        .laser { position: absolute; width: 20px; height: 5px; background: red; border-radius: 2px; }
        .shield { position: absolute; width: 60px; height: 60px; background: rgba(0, 0, 255, 0.3); border-radius: 50%; }
        .boss-attack { position: absolute; width: 30px; height: 30px; background: purple; border-radius: 50%; }
        .level-transition { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; color: #fff; text-shadow: 0 0 10px #000; }
        .pause-menu { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.9); padding: 20px; border-radius: 10px; text-align: center; color: #fff; }
        .pause-menu button { margin: 10px; padding: 10px 20px; background: #1e90ff; border: none; color: #fff; border-radius: 5px; cursor: pointer; }
        .pause-menu button:hover { background: #4169e1; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
    `;
    document.head.appendChild(style);
}

function displayHighScore() {
    const highScoreDisplay = document.createElement('div');
    highScoreDisplay.classList.add('stat-item');
    highScoreDisplay.innerHTML = `<span>Eng yuqori ochko:</span> <span>${highScore}</span>`;
    document.querySelector('.stats-panel').appendChild(highScoreDisplay);
}

function addCrystalCounter() {
    const crystalDisplay = document.createElement('div');
    crystalDisplay.classList.add('stat-item');
    crystalDisplay.innerHTML = `<span>Kristallar:</span> <span id="crystal-count">${crystals}</span>`;
    document.querySelector('.stats-panel').appendChild(crystalDisplay);
}

function displayGameStats() {
    const stats = document.createElement('p');
    stats.textContent = `Vaqt: ${(gameTime / 1000).toFixed(1)}s | Xazinalar: ${totalTreasures} | Yo'q qilingan dushmanlar: ${totalEnemiesDestroyed} | Daraja: ${level} | Kristallar: ${crystals}`;
    gameOverModal.appendChild(stats);
}

function preloadSounds() {
    window.sounds = {
        treasure: new Audio('treasure.mp3'),
        hit: new Audio('hit.mp3'),
        explosion: new Audio('explosion.mp3'),
        bonus: new Audio('bonus.mp3'),
        laser: new Audio('laser.mp3'),
        shield: new Audio('shield.mp3'),
        boss: new Audio('boss.mp3'),
        'boss-attack': new Audio('boss-attack.mp3')
    };
}

function playSound(type) {
    if (window.sounds && window.sounds[type]) {
        window.sounds[type].currentTime = 0;
        window.sounds[type].play().catch(() => {});
    }
}

initializeGame();
const ship = document.getElementById('player-ship');
const gameArea = document.querySelector('.game-area');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const speedDisplay = document.getElementById('speed');
const levelDisplay = document.getElementById('level');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const gameOverModal = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const restartBtn = document.getElementById('restart-btn');

let score = 0;
let lives = 3;
let speed = 1;
let level = 1;
let shipX = 80;
let shipY = 250;
let isGameRunning = false;
let enemies = [];
let treasures = [];
let bonuses = [];
let particles = [];
let lasers = [];
let shields = [];
let bossAttacks = [];
let crystals = 0;
let lastTreasureTime = 0;
let lastEnemyTime = 0;
let lastBonusTime = 0;
let lastLaserTime = 0;
let lastShieldTime = 0;
let lastBossAttackTime = 0;
let lastMinionTime = 0;
let lastWeaponSwitchTime = 0;
let invincible = false;
let gameTime = 0;
let highScore = localStorage.getItem('highScore') || 0;
let totalTreasures = 0;
let totalEnemiesDestroyed = 0;
let bossActive = false;
let slowMotion = false;
let bossPhase = 1;
let upgrades = { laserSpeed: 1, shieldDuration: 1, maxLives: 3 };
let currentWeapon = 'normal'; // normal, power, homing, spread
let weaponCooldowns = { normal: 500, power: 800, homing: 1000, spread: 600 };

function moveShip() {
    ship.style.left = `${shipX}px`;
    ship.style.top = `${shipY}px`;
    if (invincible) ship.style.filter = 'brightness(2) drop-shadow(0 0 5px #fff)';
    else ship.style.filter = 'brightness(1)';
}

function updateStats() {
    scoreDisplay.textContent = score;
    livesDisplay.textContent = lives;
    speedDisplay.textContent = `${speed.toFixed(1)}x`;
    levelDisplay.textContent = level;
    document.getElementById('crystal-count').textContent = crystals;
    document.getElementById('weapon-display').textContent = currentWeapon.toUpperCase();
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
    }
}

function createTreasure(timestamp) {
    if (timestamp - lastTreasureTime < 2000 / speed || bossActive) return;
    const treasure = document.createElement('div');
    treasure.classList.add('treasure');
    treasure.style.left = `${Math.random() * 750}px`;
    treasure.style.top = `${Math.random() * 450}px`;
    gameArea.appendChild(treasure);
    treasures.push(treasure);
    totalTreasures++;
    lastTreasureTime = timestamp;
    setTimeout(() => {
        treasure.remove();
        treasures = treasures.filter(t => t !== treasure);
    }, 5000);
    createParticles(treasure.style.left, treasure.style.top, 'yellow', 5);
    playSound('treasure');
}

function createEnemy(timestamp, type = 'normal') {
    if (timestamp - lastEnemyTime < 3000 / (speed * (1 + level * 0.1)) || bossActive) return;
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    if (type === 'fast') enemy.classList.add('fast-enemy');
    else if (type === 'zigzag') enemy.classList.add('zigzag-enemy');
    else if (type === 'smart') enemy.classList.add('smart-enemy');
    else if (type === 'boss') enemy.classList.add('boss-enemy');
    else if (type === 'minion') enemy.classList.add('minion-enemy');
    enemy.style.left = '800px';
    enemy.style.top = `${Math.random() * 450}px`;
    const health = type === 'boss' ? 100 : type === 'minion' ? 2 : 1;
    gameArea.appendChild(enemy);
    enemies.push({ element: enemy, x: 800, y: parseFloat(enemy.style.top), type, angle: 0, health, behavior: type === 'smart' ? 'pursue' : 'linear' });
    lastEnemyTime = timestamp;
    if (type === 'boss') bossActive = true;
}

function createMinions(timestamp) {
    if (timestamp - lastMinionTime < 5000 / (bossPhase === 3 ? 2 : 1) || !bossActive) return;
    for (let i = 0; i < (bossPhase === 3 ? 4 : bossPhase === 2 ? 3 : 2); i++) {
        createEnemy(timestamp, 'minion');
    }
    lastMinionTime = timestamp;
}

function createBonus(timestamp, type = 'life') {
    if (timestamp - lastBonusTime < 15000 / speed || bossActive) return;
    const bonus = document.createElement('div');
    bonus.classList.add('bonus');
    bonus.style.left = `${Math.random() * 750}px`;
    bonus.style.top = `${Math.random() * 450}px`;
    bonus.dataset.type = type;
    if (type === 'life') bonus.style.background = 'green';
    else if (type === 'speed') bonus.style.background = 'purple';
    else if (type === 'laser') bonus.style.background = 'cyan';
    else if (type === 'shield') bonus.style.background = 'blue';
    else if (type === 'slow') bonus.style.background = 'silver';
    else if (type === 'crystal') bonus.style.background = 'pink';
    else if (type === 'weapon') bonus.style.background = 'gold';
    bonus.style.width = '25px';
    bonus.style.height = '25px';
    gameArea.appendChild(bonus);
    bonuses.push(bonus);
    lastBonusTime = timestamp;
    setTimeout(() => {
        bonus.remove();
        bonuses = bonuses.filter(b => b !== bonus);
    }, 7000);
}

function createLaser(timestamp, type = currentWeapon) {
    if (timestamp - lastLaserTime < weaponCooldowns[type] / (speed * upgrades.laserSpeed) || !isGameRunning) return;
    const laser = document.createElement('div');
    laser.classList.add('laser');
    laser.dataset.type = type;
    laser.style.left = `${shipX + 50}px`;
    laser.style.top = `${shipY + 20}px`;
    if (type === 'power') laser.style.background = 'yellow';
    else if (type === 'homing') laser.style.background = 'green';
    else if (type === 'spread') {
        for (let i = -1; i <= 1; i++) {
            const spreadLaser = document.createElement('div');
            spreadLaser.classList.add('laser');
            spreadLaser.dataset.type = 'spread';
            spreadLaser.style.left = `${shipX + 50}px`;
            spreadLaser.style.top = `${shipY + 20 + i * 10}px`;
            spreadLaser.style.background = 'orange';
            gameArea.appendChild(spreadLaser);
            lasers.push({ element: spreadLaser, x: shipX + 50, y: shipY + 20 + i * 10, type, spreadAngle: i * 0.2 });
        }
    }
    if (type !== 'spread') {
        gameArea.appendChild(laser);
        lasers.push({ element: laser, x: shipX + 50, y: shipY + 20, type });
    }
    lastLaserTime = timestamp;
    playSound('laser');
}

function createShield(timestamp) {
    if (timestamp - lastShieldTime < 10000 || shields.length > 0) return;
    const shield = document.createElement('div');
    shield.classList.add('shield');
    shield.style.left = `${shipX}px`;
    shield.style.top = `${shipY}px`;
    gameArea.appendChild(shield);
    shields.push(shield);
    lastShieldTime = timestamp;
    setTimeout(() => {
        shield.remove();
        shields = shields.filter(s => s !== shield);
    }, 5000 * upgrades.shieldDuration);
    playSound('shield');
}

function createBossAttack(timestamp) {
    if (timestamp - lastBossAttackTime < (bossPhase === 1 ? 2000 : bossPhase === 2 ? 1000 : 500) || !bossActive) return;
    const boss = enemies.find(e => e.type === 'boss');
    if (!boss) return;
    const attack = document.createElement('div');
    attack.classList.add('boss-attack');
    attack.style.left = `${boss.x}px`;
    attack.style.top = `${boss.y + 50}px`;
    attack.dataset.phase = bossPhase;
    if (bossPhase === 3) attack.style.background = 'red';
    gameArea.appendChild(attack);
    bossAttacks.push({ element: attack, x: boss.x, y: boss.y + 50, phase: bossPhase });
    if (bossPhase === 3) {
        for (let i = -1; i <= 1; i += 2) {
            const extraAttack = document.createElement('div');
            extraAttack.classList.add('boss-attack');
            extraAttack.style.left = `${boss.x}px`;
            extraAttack.style.top = `${boss.y + 50}px`;
            extraAttack.dataset.phase = 3;
            extraAttack.style.background = 'red';
            gameArea.appendChild(extraAttack);
            bossAttacks.push({ element: extraAttack, x: boss.x, y: boss.y + 50, phase: 3, angle: i * 0.3 });
        }
    }
    lastBossAttackTime = timestamp;
    playSound('boss-attack');
}

function moveEnemies() {
    enemies.forEach((enemy, index) => {
        const speedFactor = slowMotion ? 0.5 : enemy.type === 'fast' ? 4 : enemy.type === 'zigzag' ? 3 : enemy.type === 'smart' ? 2.5 : enemy.type === 'boss' ? 1 : enemy.type === 'minion' ? 3.5 : 2;
        enemy.x -= speedFactor * speed;
        if (enemy.type === 'zigzag') {
            enemy.angle += 0.1;
            enemy.y += Math.sin(enemy.angle) * 5;
            enemy.element.style.top = `${enemy.y}px`;
        } else if (enemy.type === 'smart') {
            if (enemy.behavior === 'pursue') {
                const dx = shipX - enemy.x;
                const dy = shipY - enemy.y;
                const angle = Math.atan2(dy, dx);
                enemy.x += Math.cos(angle) * 1.5;
                enemy.y += Math.sin(angle) * 1.5;
                enemy.y = Math.max(0, Math.min(450, enemy.y));
                enemy.element.style.top = `${enemy.y}px`;
            }
        } else if (enemy.type === 'boss') {
            enemy.y = 200 + Math.sin(enemy.angle) * (bossPhase === 1 ? 100 : bossPhase === 2 ? 150 : 200);
            enemy.angle += bossPhase === 1 ? 0.05 : bossPhase === 2 ? 0.07 : 0.09;
            enemy.element.style.top = `${enemy.y}px`;
            if (enemy.x < 600) enemy.x = 600;
            if (enemy.health <= 75 && bossPhase === 1) bossPhase = 2;
            else if (enemy.health <= 50 && bossPhase === 2) bossPhase = 3;
        }
        enemy.element.style.left = `${enemy.x}px`;
        if (enemy.x < -50 || enemy.health <= 0) {
            if (enemy.type === 'boss' && enemy.health <= 0) {
                bossActive = false;
                bossPhase = 1;
                crystals += 100;
                showBossDefeatAnimation();
            }
            enemy.element.remove();
            enemies.splice(index, 1);
        }
    });
}

function moveLasers() {
    lasers.forEach((laser, index) => {
        if (laser.type === 'homing') {
            const nearestEnemy = enemies.reduce((closest, e) => {
                const dist = Math.hypot(e.x - laser.x, e.y - laser.y);
                return dist < Math.hypot(closest.x - laser.x, closest.y - laser.y) ? e : closest;
            }, { x: laser.x + 100, y: laser.y });
            const dx = nearestEnemy.x - laser.x;
            const dy = nearestEnemy.y - laser.y;
            const angle = Math.atan2(dy, dx);
            laser.x += Math.cos(angle) * 5 * speed * upgrades.laserSpeed;
            laser.y += Math.sin(angle) * 5 * speed * upgrades.laserSpeed;
            laser.element.style.left = `${laser.x}px`;
            laser.element.style.top = `${laser.y}px`;
        } else if (laser.type === 'spread') {
            laser.x += (slowMotion ? 5 : 10) * speed * upgrades.laserSpeed;
            laser.y += laser.spreadAngle * 5 * speed;
            laser.element.style.left = `${laser.x}px`;
            laser.element.style.top = `${laser.y}px`;
        } else {
            laser.x += (slowMotion ? 5 : 10) * speed * upgrades.laserSpeed;
            laser.element.style.left = `${laser.x}px`;
        }
        if (laser.x > 800 || laser.y < 0 || laser.y > 500) {
            laser.element.remove();
            lasers.splice(index, 1);
        }
    });
}

function moveShields() {
    shields.forEach(shield => {
        shield.style.left = `${shipX}px`;
        shield.style.top = `${shipY}px`;
    });
}

function moveBossAttacks() {
    bossAttacks.forEach((attack, index) => {
        const speedFactor = slowMotion ? 2 : attack.phase === 1 ? 4 : attack.phase === 2 ? 6 : 8;
        attack.x -= speedFactor * speed;
        if (attack.phase === 3 && attack.angle) {
            attack.y += Math.sin(attack.x * 0.05) * 5 + attack.angle * 5;
            attack.element.style.top = `${attack.y}px`;
        } else if (attack.phase === 3) {
            attack.y += Math.sin(attack.x * 0.05) * 5;
            attack.element.style.top = `${attack.y}px`;
        }
        attack.element.style.left = `${attack.x}px`;
        if (attack.x < -20 || attack.y < 0 || attack.y > 500) {
            attack.element.remove();
            bossAttacks.splice(index, 1);
        }
    });
}

function createParticles(x, y, color, count = 5) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.left = x;
        particle.style.top = y;
        particle.style.background = color;
        particle.style.width = `${Math.random() * 5 + 2}px`;
        particle.style.height = `${Math.random() * 5 + 2}px`;
        gameArea.appendChild(particle);
        const angle = Math.random() * Math.PI * 2;
        particles.push({
            element: particle,
            x: parseFloat(x),
            y: parseFloat(y),
            vx: Math.cos(angle) * (Math.random() * 2 + 1),
            vy: Math.sin(angle) * (Math.random() * 2 + 1),
            life: Math.random() * 1000 + 500
        });
    }
}

function moveParticles() {
    particles.forEach((p, i) => {
        p.x += p.vx * (slowMotion ? 0.5 : 1);
        p.y += p.vy * (slowMotion ? 0.5 : 1);
        p.life -= 16;
        p.element.style.left = `${p.x}px`;
        p.element.style.top = `${p.y}px`;
        p.element.style.opacity = p.life / 1000;
        if (p.life <= 0) {
            p.element.remove();
            particles.splice(i, 1);
        }
    });
}

function checkCollision(type) {
    const sRect = ship.getBoundingClientRect();
    if (type === 'treasure') {
        treasures.forEach((t, i) => {
            const tRect = t.getBoundingClientRect();
            if (sRect.left < tRect.right && sRect.right > tRect.left &&
                sRect.top < tRect.bottom && sRect.bottom > tRect.top) {
                score += 10 * level;
                t.remove();
                treasures.splice(i, 1);
                updateStats();
            }
        });
    } else if (type === 'enemy') {
        enemies.forEach((e, i) => {
            const eRect = e.element.getBoundingClientRect();
            if (sRect.left < eRect.right && sRect.right > eRect.left &&
                sRect.top < eRect.bottom && sRect.bottom > eRect.top) {
                if (!invincible && shields.length === 0) {
                    lives--;
                    e.element.remove();
                    enemies.splice(i, 1);
                    createParticles(e.x + 'px', e.y + 'px', 'red', 10);
                    updateStats();
                    playSound('hit');
                }
            }
        });
    } else if (type === 'bonus') {
        bonuses.forEach((b, i) => {
            const bRect = b.getBoundingClientRect();
            if (sRect.left < bRect.right && sRect.right > bRect.left &&
                sRect.top < bRect.bottom && sRect.bottom > bRect.top) {
                activateBonus(b.dataset.type);
                b.remove();
                bonuses.splice(i, 1);
            }
        });
    } else if (type === 'laser') {
        lasers.forEach((l, i) => {
            const lRect = l.element.getBoundingClientRect();
            enemies.forEach((e, j) => {
                const eRect = e.element.getBoundingClientRect();
                if (lRect.left < eRect.right && lRect.right > eRect.left &&
                    lRect.top < eRect.bottom && lRect.bottom > eRect.top) {
                    const damage = l.type === 'power' ? 5 : l.type === 'homing' ? 3 : l.type === 'spread' ? 2 : 1;
                    e.health -= damage;
                    score += 5;
                    totalEnemiesDestroyed++;
                    l.element.remove();
                    lasers.splice(i, 1);
                    if (e.health <= 0) {
                        e.element.remove();
                        enemies.splice(j, 1);
                        createParticles(e.x + 'px', e.y + 'px', 'orange', 10);
                        if (e.type !== 'boss') crystals += 1;
                    }
                    updateStats();
                    playSound('explosion');
                }
            });
        });
    } else if (type === 'boss-attack') {
        bossAttacks.forEach((a, i) => {
            const aRect = a.element.getBoundingClientRect();
            if (sRect.left < aRect.right && sRect.right > aRect.left &&
                sRect.top < aRect.bottom && sRect.bottom > aRect.top) {
                if (!invincible && shields.length === 0) {
                    lives--;
                    a.element.remove();
                    bossAttacks.splice(i, 1);
                    updateStats();
                    playSound('hit');
                }
            }
        });
    }
}

function activateBonus(type) {
    if (type === 'life') {
        invincible = true;
        setTimeout(() => invincible = false, 5000);
        lives = Math.min(lives + 1, upgrades.maxLives);
    } else if (type === 'speed') {
        speed += 1;
        setTimeout(() => speed -= 1, 10000);
    } else if (type === 'laser') {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => createLaser(performance.now(), 'power'), i * 200);
        }
    } else if (type === 'shield') {
        createShield(performance.now());
    } else if (type === 'slow') {
        slowMotion = true;
        setTimeout(() => slowMotion = false, 5000);
    } else if (type === 'crystal') {
        crystals += 10;
    } else if (type === 'weapon') {
        const weapons = ['power', 'homing', 'spread'];
        currentWeapon = weapons[Math.floor(Math.random() * weapons.length)];
        setTimeout(() => currentWeapon = 'normal', 10000);
    }
    createParticles(shipX + 'px', shipY + 'px', 'lime', 8);
    updateStats();
    playSound('bonus');
}

function levelUp() {
    if (score >= level * 50) {
        level++;
        speed += 0.5;
        updateStats();
        changeBackground();
        if (level % 5 === 0) {
            createEnemy(performance.now(), 'boss');
            playSound('boss');
        }
        showLevelTransition();
    }
}

function changeBackground() {
    const backgrounds = [
        'url("space-bg.jpg")',
        'url("galaxy-bg.jpg")',
        'url("nebula-bg.jpg")',
        'url("blackhole-bg.jpg")',
        'url("starfield-bg.jpg")'
    ];
    gameArea.style.background = backgrounds[level % 5] + ' no-repeat center';
    gameArea.style.backgroundSize = 'cover';
}

function showLevelTransition() {
    const transition = document.createElement('div');
    transition.classList.add('level-transition');
    transition.textContent = `Daraja ${level}`;
    gameArea.appendChild(transition);
    setTimeout(() => transition.remove(), 2000);
}

function showBossDefeatAnimation() {
    const animation = document.createElement('div');
    animation.classList.add('boss-defeat');
    animation.textContent = 'BOSS YO\'Q QILINDI!';
    gameArea.appendChild(animation);
    createParticles('600px', '250px', 'red', 20);
    setTimeout(() => animation.remove(), 3000);
}

function showPauseMenu() {
    const pauseMenu = document.createElement('div');
    pauseMenu.classList.add('pause-menu');
    pauseMenu.innerHTML = `
        <h2>O'yin to'xtatildi</h2>
        <button id="resume-btn">Davom etish</button>
        <button id="shop-btn">Do'kon</button>
        <button id="quit-btn">Chiqish</button>
    `;
    gameArea.appendChild(pauseMenu);
    document.getElementById('resume-btn').addEventListener('click', () => {
        isGameRunning = true;
        pauseMenu.remove();
        gameLoop(performance.now());
    });
    document.getElementById('shop-btn').addEventListener('click', () => {
        pauseMenu.remove();
        showShopMenu();
    });
    document.getElementById('quit-btn').addEventListener('click', () => location.reload());
}

function showShopMenu() {
    const shopMenu = document.createElement('div');
    shopMenu.classList.add('pause-menu');
    shopMenu.innerHTML = `
        <h2>Do'kon</h2>
        <p>Kristallar: <span id="shop-crystals">${crystals}</span></p>
        <button id="upgrade-laser">Lazer tezligi (+0.5) - 20 kristal</button>
        <button id="upgrade-shield">Qalqon davomiyligi (+0.5) - 30 kristal</button>
        <button id="upgrade-lives">Maksimal hayot (+1) - 50 kristal</button>
        <button id="buy-life">Hayot sotib olish (+1) - 25 kristal</button>
        <button id="back-btn">Orqaga</button>
    `;
    gameArea.appendChild(shopMenu);
    document.getElementById('upgrade-laser').addEventListener('click', () => {
        if (crystals >= 20) {
            crystals -= 20;
            upgrades.laserSpeed += 0.5;
            updateShopCrystals(shopMenu);
        }
    });
    document.getElementById('upgrade-shield').addEventListener('click', () => {
        if (crystals >= 30) {
            crystals -= 30;
            upgrades.shieldDuration += 0.5;
            updateShopCrystals(shopMenu);
        }
    });
    document.getElementById('upgrade-lives').addEventListener('click', () => {
        if (crystals >= 50) {
            crystals -= 50;
            upgrades.maxLives += 1;
            updateShopCrystals(shopMenu);
        }
    });
    document.getElementById('buy-life').addEventListener('click', () => {
        if (crystals >= 25 && lives < upgrades.maxLives) {
            crystals -= 25;
            lives += 1;
            updateShopCrystals(shopMenu);
        }
    });
    document.getElementById('back-btn').addEventListener('click', () => {
        shopMenu.remove();
        showPauseMenu();
    });
}

function updateShopCrystals(menu) {
    menu.querySelector('#shop-crystals').textContent = crystals;
    updateStats();
}

document.addEventListener('keydown', (e) => {
    if (!isGameRunning && e.key !== 'Escape') return;
    switch (e.key) {
        case 'ArrowUp': shipY = Math.max(0, shipY - 10 * speed); break;
        case 'ArrowDown': shipY = Math.min(450, shipY + 10 * speed); break;
        case 'ArrowLeft': shipX = Math.max(0, shipX - 10 * speed); break;
        case 'ArrowRight': shipX = Math.min(750, shipX + 10 * speed); break;
        case ' ': createLaser(performance.now()); break;
        case 'h': createLaser(performance.now(), 'homing'); break;
        case '1': if (timestamp - lastWeaponSwitchTime > 1000) { currentWeapon = 'normal'; lastWeaponSwitchTime = performance.now(); } break;
        case '2': if (timestamp - lastWeaponSwitchTime > 1000) { currentWeapon = 'power'; lastWeaponSwitchTime = performance.now(); } break;
        case '3': if (timestamp - lastWeaponSwitchTime > 1000) { currentWeapon = 'homing'; lastWeaponSwitchTime = performance.now(); } break;
        case '4': if (timestamp - lastWeaponSwitchTime > 1000) { currentWeapon = 'spread'; lastWeaponSwitchTime = performance.now(); } break;
        case 'Escape': if (isGameRunning) { isGameRunning = false; showPauseMenu(); } break;
    }
    moveShip();
});

startBtn.addEventListener('click', () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gameLoop(performance.now());
    }
});

pauseBtn.addEventListener('click', () => {
    if (isGameRunning) {
        isGameRunning = false;
        showPauseMenu();
    }
});

restartBtn.addEventListener('click', () => {
    location.reload();
});

function gameLoop(timestamp) {
    if (!isGameRunning) return;

    gameTime += 16;
    moveEnemies();
    moveLasers();
    moveShields();
    moveBossAttacks();
    moveParticles();
    checkCollision('treasure');
    checkCollision('enemy');
    checkCollision('bonus');
    checkCollision('laser');
    checkCollision('boss-attack');
    levelUp();
    if (bossActive) createMinions(timestamp);

    if (Math.random() < 0.05) createTreasure(timestamp);
    if (Math.random() < 0.03) createEnemy(timestamp, 'normal');
    if (Math.random() < 0.01) createEnemy(timestamp, 'fast');
    if (Math.random() < 0.008) createEnemy(timestamp, 'zigzag');
    if (Math.random() < 0.005) createEnemy(timestamp, 'smart');
    if (Math.random() < 0.015) createBonus(timestamp, 'life');
    if (Math.random() < 0.01) createBonus(timestamp, 'speed');
    if (Math.random() < 0.008) createBonus(timestamp, 'laser');
    if (Math.random() < 0.006) createBonus(timestamp, 'shield');
    if (Math.random() < 0.004) createBonus(timestamp, 'slow');
    if (Math.random() < 0.003) createBonus(timestamp, 'crystal');
    if (Math.random() < 0.002) createBonus(timestamp, 'weapon');
    if (bossActive) createBossAttack(timestamp);

    if (lives <= 0) {
        isGameRunning = false;
        gameOverModal.style.display = 'block';
        finalScore.textContent = score;
        displayGameStats();
        showGameOverAnimation();
    } else {
        requestAnimationFrame(gameLoop);
    }
}

function showGameOverAnimation() {
    const animation = document.createElement('div');
    animation.classList.add('game-over-anim');
    animation.textContent = 'O\'YIN TUGADI!';
    gameArea.appendChild(animation);
    createParticles('400px', '250px', 'red', 30);
    setTimeout(() => animation.remove(), 3000);
}

function initializeGame() {
    moveShip();
    updateStats();
    gameArea.style.background = 'url("space-bg.jpg") no-repeat center';
    gameArea.style.backgroundSize = 'cover';
    addCustomStyles();
    displayHighScore();
    addCrystalCounter();
    addWeaponDisplay();
    preloadSounds();
}

function addCustomStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .fast-enemy { width: 30px; height: 30px; background: url('fast-meteor.png') no-repeat center; background-size: contain; }
        .zigzag-enemy { width: 35px; height: 35px; background: url('zigzag-enemy.png') no-repeat center; background-size: contain; }
        .smart-enemy { width: 40px; height: 40px; background: url('smart-enemy.png') no-repeat center; background-size: contain; }
        .boss-enemy { width: 100px; height: 100px; background: url('boss.png') no-repeat center; background-size: contain; }
        .minion-enemy { width: 20px; height: 20px; background: url('minion.png') no-repeat center; background-size: contain; }
        .bonus { border-radius: 50%; animation: pulse 1s infinite; }
        .particle { position: absolute; border-radius: 50%; }
        .laser { position: absolute; width: 20px; height: 5px; background: red; border-radius: 2px; }
        .shield { position: absolute; width: 60px; height: 60px; background: rgba(0, 0, 255, 0.3); border-radius: 50%; }
        .boss-attack { position: absolute; width: 30px; height: 30px; background: purple; border-radius: 50%; }
        .level-transition { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; color: #fff; text-shadow: 0 0 10px #000; }
        .boss-defeat { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; color: #ff0; text-shadow: 0 0 10px #f00; }
        .game-over-anim { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 40px; color: #f00; text-shadow: 0 0 10px #000; }
        .pause-menu { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.9); padding: 20px; border-radius: 10px; text-align: center; color: #fff; }
        .pause-menu button { margin: 10px; padding: 10px 20px; background: #1e90ff; border: none; color: #fff; border-radius: 5px; cursor: pointer; }
        .pause-menu button:hover { background: #4169e1; }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
    `;
    document.head.appendChild(style);
}

function displayHighScore() {
    const highScoreDisplay = document.createElement('div');
    highScoreDisplay.classList.add('stat-item');
    highScoreDisplay.innerHTML = `<span>Eng yuqori ochko:</span> <span>${highScore}</span>`;
    document.querySelector('.stats-panel').appendChild(highScoreDisplay);
}

function addCrystalCounter() {
    const crystalDisplay = document.createElement('div');
    crystalDisplay.classList.add('stat-item');
    crystalDisplay.innerHTML = `<span>Kristallar:</span> <span id="crystal-count">${crystals}</span>`;
    document.querySelector('.stats-panel').appendChild(crystalDisplay);
}

function addWeaponDisplay() {
    const weaponDisplay = document.createElement('div');
    weaponDisplay.classList.add('stat-item');
    weaponDisplay.innerHTML = `<span>Qurol:</span> <span id="weapon-display">${currentWeapon.toUpperCase()}</span>`;
    document.querySelector('.stats-panel').appendChild(weaponDisplay);
}

function displayGameStats() {
    const stats = document.createElement('p');
    stats.textContent = `Vaqt: ${(gameTime / 1000).toFixed(1)}s | Xazinalar: ${totalTreasures} | Yo'q qilingan dushmanlar: ${totalEnemiesDestroyed} | Daraja: ${level} | Kristallar: ${crystals}`;
    gameOverModal.appendChild(stats);
}

function preloadSounds() {
    window.sounds = {
        treasure: new Audio('treasure.mp3'),
        hit: new Audio('hit.mp3'),
        explosion: new Audio('explosion.mp3'),
        bonus: new Audio('bonus.mp3'),
        laser: new Audio('laser.mp3'),
        shield: new Audio('shield.mp3'),
        boss: new Audio('boss.mp3'),
        'boss-attack': new Audio('boss-attack.mp3')
    };
}

function playSound(type) {
    if (window.sounds && window.sounds[type]) {
        window.sounds[type].currentTime = 0;
        window.sounds[type].play().catch(() => {});
    }
}

initializeGame();