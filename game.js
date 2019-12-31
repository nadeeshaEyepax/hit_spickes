var game;
var gameOptions = {
    triangleBase: 60,
    ballSpeed: 7,
    jumpForce: 10
}

var scoreText;
var gameOverText;
var score = 0;
var gameOver = false;

window.onload = function() {
    var gameConfig = {
       type: Phaser.AUTO,
       width: gameOptions.triangleBase * 9.5,
       height: gameOptions.triangleBase * 15.5,
       backgroundColor: 0x000000,
       scene: playGame,
       physics: {
           default: "matter",
           matter: {
               debug: false
           }
        }
    }

    game = new Phaser.Game(gameConfig);
    window.focus();
    resize();
    window.addEventListener("resize", resize, false);
}

class playGame extends Phaser.Scene{
    constructor(){
        super("PlayGame");
    }

    preload(){
        this.load.image("spike", "assets/spike.png");
        this.load.image("wall", "assets/wall.png");
        this.load.image("ball", "assets/ball.png");
    }

    create(){
        var spikeDistance = gameOptions.triangleBase * 1.25;
        this.leftSpikes = [];
        this.rightSpikes = [];
        for(var i = 0; i < 11; i++){
            if(i < 7){
                this.addSpike(gameOptions.triangleBase + i * spikeDistance, game.config.height - gameOptions.triangleBase / 2);
                this.addSpike(gameOptions.triangleBase + i * spikeDistance, gameOptions.triangleBase / 2);
            }
            this.leftSpikes.push(this.addSpike(- gameOptions.triangleBase / 4, gameOptions.triangleBase * 1.5 + i * spikeDistance));
            this.rightSpikes.push(this.addSpike(game.config.width + gameOptions.triangleBase / 4, gameOptions.triangleBase * 1.5 + i * spikeDistance));
        }

        this.addWall(gameOptions.triangleBase / 4, game.config.height / 2, gameOptions.triangleBase / 2, game.config.height, "leftwall");
        this.addWall(game.config.width - gameOptions.triangleBase / 4, game.config.height / 2, gameOptions.triangleBase / 2, game.config.height, "rightwall");
        this.addWall(game.config.width / 2, gameOptions.triangleBase / 4, game.config.width - gameOptions.triangleBase, gameOptions.triangleBase / 2, "");
        this.addWall(game.config.width / 2, game.config.height - gameOptions.triangleBase / 4, game.config.width - gameOptions.triangleBase, gameOptions.triangleBase / 2, "");
        var ballTexture = this.textures.get("ball");
        this.ball = this.matter.add.image(game.config.width / 4, game.config.height / 2, "ball");
        this.ball.setScale(gameOptions.triangleBase / ballTexture.source[0].width);
        this.ball.setBody({
            type: "circle",
            radius: gameOptions.triangleBase / 2
        });

        this.ball.setScale(gameOptions.triangleBase / ballTexture.source[0].width);
        this.ball.setVelocity(gameOptions.ballSpeed, 0);

        this.keEnter = this.input.keyboard.on("keyup_ENTER", this.jump, this);

        this.matter.world.on("collisionstart", function (e, b1, b2) {
            if(b1.label == "spike" || b2.label == "spike"){
                resetScore();
                gameOver = true;
                // startTimer();
                // gameOverText = this.add.text(game.config.width/3, game.config.height/2, 'Game Over', { fontSize: '50px', fill: '#FFF' });
                this.scene.start("PlayGame");

            }
            if(b1.label == "leftwall" || b2.label == "leftwall"){
                updateScore ();
                this.setSpikes(true);
                this.ball.setVelocity(gameOptions.ballSpeed, this.ball.body.velocity.y);
            }
            if(b1.label == "rightwall" || b2.label == "rightwall"){
                updateScore ();
                this.setSpikes(false);
                this.ball.setVelocity(-gameOptions.ballSpeed, this.ball.body.velocity.y);
            }
        }, this);

        scoreText = this.add.text(16, 1, 'SCORE: 0', { fontSize: '34px', fill: '#FFF' });
    }

    addWall(x, y, w, h, label){
        // if(!gameOver) {
            var wallTexture = this.textures.get("wall");
            var wall = this.matter.add.image(x, y, "wall", null, {
                isStatic: true,
                label: label
            });
            wall.setScale(w / wallTexture.source[0].width, h / wallTexture.source[0].width);
        // }
    }

    addSpike(x, y){
        var spikeTexture = this.textures.get("spike");
        var squareSize = gameOptions.triangleBase / Math.sqrt(2);
        var squareScale = squareSize / spikeTexture.source[0].width;
        var spike = this.matter.add.image(x, y, "spike", null, {
            isStatic: true,
            label: "spike"
        });
        spike.setScale(squareScale);
        spike.rotation = Math.PI / 4;
        return spike;
    }

    setSpikes(isRight){
        for(var i = 0; i < 11; i++){
            if(isRight){
                this.rightSpikes[i].x = game.config.width + gameOptions.triangleBase / 4;
            }
            else{
                this.leftSpikes[i].x = - gameOptions.triangleBase / 4;
            }
        }
        var randomPositions = Phaser.Utils.Array.NumberArray(0, 10);
        var numberOfSpikes = Phaser.Math.Between(3, 6);
        for(i = 0; i < numberOfSpikes; i++){
            var randomSpike = Phaser.Utils.Array.RemoveRandomElement(randomPositions);
            if(isRight){
                this.rightSpikes[randomSpike].x = game.config.width - gameOptions.triangleBase / 2;
            }
            else{
                this.leftSpikes[randomSpike].x = gameOptions.triangleBase / 2;
            }
        }
    }

    jump(){
        this.ball.setVelocity((this.ball.body.velocity.x > 0) ? gameOptions.ballSpeed : -gameOptions.ballSpeed, -gameOptions.jumpForce);
    }

    update(){
        this.ball.setVelocity((this.ball.body.velocity.x > 0) ? gameOptions.ballSpeed : -gameOptions.ballSpeed, this.ball.body.velocity.y);

        // if(gameOver){
        //     gameOverText = this.add.text(game.config.width/3, game.config.height/2, 'Game Over', { fontSize: '50px', fill: '#FFF' });
        //     gameOptions.ballSpeed = 0;
        //     this.ball.setVisible(false);
        //     // alert('Restart Again!')
        //
        //     if(this.keEnter.isDown){
        //         console.log('PRESS KEY Again');
        //         gameOptions.ballSpeed = 7;
        //         this.ball.setVisible(true);
        //         this.scene.start("PlayGame");
        //     }
        //
        // }
    }

};

function resize(){
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}

function updateScore () {
    score += 2;
    scoreText.setText('SCORE: ' + score);
}

function resetScore(){
    score = 0;
}


function startTimer () {
    timer.start();
    setTimeout(stopTimer,5000);
    alert('going to wait for 5 second');
}

function stopTimer () {
    alert('finally wait is over');
    timer.stop();
}



