document.addEventListener("DOMContentLoaded", () => {
    const introScreen = document.getElementById("introScreen");
    const startButton = document.getElementById("startButton");
    const gameCanvas = document.getElementById("gameCanvas");
    const ctx = gameCanvas.getContext("2d");

    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;

    let xRocket = gameCanvas.width / 2;
    let yRocket = gameCanvas.height / 2;
    let rocketWidth = 50;
    let rocketHeight = 100;
    let rocketSpeed = 5; // Reduced speed for smoother movement
    let obstacles = [];
    let obstacleSpeed = 5; // Increased speed for more challenge
    let gameRunning = false;
    let score = 0;

    let moveLeft = false;
    let moveRight = false;
    let moveUp = false;
    let moveDown = false;

    // Load images
    const rocketImg = new Image();
    const cloudImg = new Image();
    const birdImg = new Image();

    rocketImg.src = 'rocket.png';
    cloudImg.src = 'cloud.png';
    birdImg.src = 'bird.png';

    startButton.addEventListener("click", startGame);

    function startGame() {
        introScreen.style.display = "none";
        gameCanvas.style.display = "block";
        gameRunning = true;
        obstacles = [];
        score = 0;
        createObstacle();
        gameLoop();
    }

    function drawRocket() {
        ctx.drawImage(rocketImg, xRocket - rocketWidth / 2, yRocket - rocketHeight / 2, rocketWidth, rocketHeight);
    }

    function createObstacle() {
        let width, height, x, y, type, img, direction;

        if (Math.random() < 0.5) {
            // Cloud from above
            width = Math.random() * 50 + 50;
            height = width / 2;
            x = Math.random() * (gameCanvas.width - width);
            y = -height;
            type = 'cloud';
            img = cloudImg;
            direction = 0;
        } else {
            // Bird from either side
            width = Math.random() * 30 + 30;
            height = width / 1.5;
            y = Math.random() * (gameCanvas.height - height);
            if (Math.random() < 0.5) {
                x = -width;
                direction = 1;
            } else {
                x = gameCanvas.width;
                direction = -1;
            }
            type = 'bird';
            img = birdImg;
        }
        obstacles.push({ x, y, width, height, type, img, direction });
    }

    function drawObstacles() {
        obstacles.forEach(obstacle => {
            ctx.drawImage(obstacle.img, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function updateObstacles() {
        obstacles = obstacles.map(obstacle => {
            if (obstacle.type === 'cloud') {
                obstacle.y += obstacleSpeed;
            } else if (obstacle.type === 'bird') {
                obstacle.x += obstacle.direction * obstacleSpeed;
            }
            return obstacle;
        });

        obstacles = obstacles.filter(obstacle => obstacle.y < gameCanvas.height && obstacle.x < gameCanvas.width && obstacle.x + obstacle.width > 0);

        if (Math.random() < 0.05) { // Increased frequency of obstacles
            createObstacle();
        }
    }

    function checkCollision() {
        for (let obstacle of obstacles) {
            if (xRocket - rocketWidth / 2 < obstacle.x + obstacle.width &&
                xRocket + rocketWidth / 2 > obstacle.x &&
                yRocket - rocketHeight / 2 < obstacle.y + obstacle.height &&
                yRocket + rocketHeight / 2 > obstacle.y) {
                return true;
            }
        }
        return false;
    }

    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, 20);
    }

    function gameLoop() {
        if (!gameRunning) return;

        ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

        // Update rocket position
        if (moveLeft && xRocket - rocketWidth / 2 > 0) {
            xRocket -= rocketSpeed;
        }
        if (moveRight && xRocket + rocketWidth / 2 < gameCanvas.width) {
            xRocket += rocketSpeed;
        }
        if (moveUp && yRocket - rocketHeight / 2 > 0) {
            yRocket -= rocketSpeed;
        }
        if (moveDown && yRocket + rocketHeight / 2 < gameCanvas.height) {
            yRocket += rocketSpeed;
        }

        drawRocket();
        updateObstacles();
        drawObstacles();
        drawScore();

        if (checkCollision()) {
            endGame();
            return;
        }

        score++;
        requestAnimationFrame(gameLoop);
    }

    function endGame() {
        gameRunning = false;
        ctx.fillStyle = "red";
        ctx.font = "30px Arial";
        ctx.fillText("You Crashed! Reload the page to try again.", gameCanvas.width / 2 - 200, gameCanvas.height / 2);
    }

    window.addEventListener("keydown", event => {
        if (!gameRunning) return;

        if (event.key === "ArrowLeft") {
            moveLeft = true;
        }
        if (event.key === "ArrowRight") {
            moveRight = true;
        }
        if (event.key === "ArrowUp") {
            moveUp = true;
        }
        if (event.key === "ArrowDown") {
            moveDown = true;
        }
    });

    window.addEventListener("keyup", event => {
        if (!gameRunning) return;

        if (event.key === "ArrowLeft") {
            moveLeft = false;
        }
        if (event.key === "ArrowRight") {
            moveRight = false;
        }
        if (event.key === "ArrowUp") {
            moveUp = false;
        }
        if (event.key === "ArrowDown") {
            moveDown = false;
        }
    });
});
