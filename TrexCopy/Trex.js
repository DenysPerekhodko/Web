$(document).ready(function() {
    let isJumping = false;
    const maxJumpHeight = 70;
    const jumpDuration = 500;
    const fallDuration = 500;
    const playerRadius = 40;
    let wallSpeed = 15;
    const wallSpeedIncrement = 0.5;
    const updateRate = 16;
    let jumpInterval = null;
    let gameOver = false;
    let score = 0;

    const wrapperWidth = $("#wrapper").width();
    const wrapperHeight = $("#wrapper").height();
    const wallWidth = wrapperWidth * 0.05;
    const wallHeight = wrapperHeight * 0.2; 

    $("#wrapper").css({
        margin: "0 auto",
        border: "solid black",
        width: "80vw",
        height: "80vh",
        position: "relative",
        overflow: "hidden"
    });

    $("#player").css({
        width: playerRadius * 2 + "px",
        height: playerRadius * 2 + "px",
        position: "absolute",
        bottom: "0%",
        left: "10%",
        border: "solid black",
        "border-radius": "50%",
        background: "blue"
    });

    $("#wall").css({
        width: wallWidth + "px",
        height: wallHeight + "px",
        position: "absolute",
        bottom: "0%",
        right: "0%",
        background: "red"
    });

    $("<div id='game-over' style='display: none;'>Game Over. Press Enter to Restart.</div>").css({
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "24px",
        color: "red",
        border: "2px solid black",
        padding: "10px",
        backgroundColor: "white"
    }).appendTo("#wrapper");

    $("<div id='score'>Score: 0</div>").css({
        position: "absolute",
        top: "10px",
        left: "10px",
        fontSize: "24px",
        color: "black"
    }).appendTo("#wrapper");

    function isCollision(circlePos, circleRadius, rectPos, rectWidth, rectHeight) {
        const nearestX = Math.max(rectPos.x, Math.min(circlePos.x, rectPos.x + rectWidth));
        const nearestY = Math.max(rectPos.y, Math.min(circlePos.y, rectPos.y + rectHeight));
        const deltaX = circlePos.x - nearestX;
        const deltaY = circlePos.y - nearestY;
        return (deltaX * deltaX + deltaY * deltaY) <= (circleRadius * circleRadius);
    }

    function updateWallPosition() {
        if (!gameOver) {
            let wall = $("#wall");
            let currentRight = parseFloat(wall.css("right"));
            wall.css("right", (currentRight + wallSpeed) + "px");
            if (wall.offset().left + wall.outerWidth() <= 0) {
                wall.css("right", "-" + wall.outerWidth() + "px");
                wallSpeed += wallSpeedIncrement;
                score++;
                $("#score").text("Score: " + score);
            }
        }
    }

    function checkCollision() {
        let player = $("#player");
        let wall = $("#wall");
        let playerPos = {
            x: player.offset().left + playerRadius,
            y: player.offset().top + playerRadius
        };
        let wallPos = {
            x: wall.offset().left,
            y: wall.offset().top,
            width: wall.outerWidth(),
            height: wall.outerHeight()
        };
        if (isCollision(playerPos, playerRadius, wallPos, wallPos.width, wallPos.height)) {
            console.log("Kolizja z ścianą!");
            $("#game-over").show();
            gameOver = true;
        }
    }

    $(document).keydown(function(event) {
        if (event.keyCode === 32 && !isJumping && !gameOver) {
            event.preventDefault();
            isJumping = true;
            jump();
        } else if (event.keyCode === 13 && gameOver) { 
            $("#game-over").hide();
            $("#player").css({ bottom: "0%" });
            $("#wall").css({ right: "0%" });
            wallSpeed = 2; 
            score = 0;
            $("#score").text("Score: " + score);
            isJumping = false;
            gameOver = false;
        }
    });

    function jump() {
        if (jumpInterval) {
            clearInterval(jumpInterval);
        }

        let jumpHeight = 0;
        let jumpStart = Date.now();

        jumpInterval = setInterval(function() {
            let jumpTime = Date.now() - jumpStart;
            jumpHeight = Math.min((jumpTime / jumpDuration) * maxJumpHeight, maxJumpHeight);
            $("#player").css({ bottom: jumpHeight + "%" });

            if (jumpTime >= jumpDuration) {
                clearInterval(jumpInterval);
                fall();
            }
        }, updateRate);
    }

    function fall() {
        $("#player").animate({ bottom: "0%" }, fallDuration, function() {
            isJumping = false;
        });
    }

    $(document).keyup(function(event) {
        if (event.keyCode === 32 && isJumping) {
            isJumping = false;
            clearInterval(jumpInterval);
            fall();
        }
    });

    setInterval(function() {
        updateWallPosition();
        checkCollision();
    }, updateRate);
});
