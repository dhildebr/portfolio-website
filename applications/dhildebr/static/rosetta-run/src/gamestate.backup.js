var startScreenState = new Phaser.State();
var instructionState = new Phaser.State();
var gameplayState = new Phaser.State();
var gameOverState = new Phaser.State();

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

startScreenState.preload = function()
{
	this.game.load.image("StartScreen", "assets/menus/Start_Screen.png");
	this.game.load.spritesheet("StartButton", "assets/buttons/Start_Button.png", 128, 64);
}

startScreenState.create = function()
{
	this.game.add.image(0, 0, "StartScreen");
	this.game.add.button((game.world.width / 2) - 64, game.world.height - 96, "StartButton", function()
	{
		game.state.start("InstructionState");
	}, this, 1, 0, 2, 3);
	
	// Swallow and ignore up and down arrow keys
	this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
	this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
	
	this.continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

startScreenState.update = function()
{
	if(this.continueKey.downDuration(1000))
	{
		this.continueKey.reset();
		this.game.input.keyboard.removeKey(Phaser.Keyboard.ENTER);
		this.game.state.start("InstructionState");
	}
}

// ~ ~ ~ ~ ~ Start Screen ~ ~ ~ ~ ~
// ~ ~ ~ ~ ~ Instructions ~ ~ ~ ~ ~ 

instructionState.preload = function()
{
	this.game.load.image("Instructions", "assets/menus/Instructions.jpg");
	this.game.load.spritesheet("ContinueButton", "assets/buttons/Continue_Button.png", 128, 64);
}

instructionState.create = function()
{
	this.game.add.image(0, 0, "Instructions");
	this.game.add.button(this.game.world.width - 128, this.game.world.height - 64, "ContinueButton", function()
	{
		this.game.state.start("GameplayState");
	}, this, 1, 0, 2, 3);
	
	this.continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

instructionState.update = function()
{
	if(this.continueKey.downDuration(1000))
	{
		this.continueKey.reset();
		this.game.input.keyboard.removeKey(Phaser.Keyboard.ENTER);
		this.game.state.start("GameplayState");
	}
}

// ~ ~ ~ ~ ~ Instructions ~ ~ ~ ~ ~
// ~ ~ ~ ~ ~ Gameplay ~ ~ ~ ~ ~ 

gameplayState.preload = function()
{
	this.game.load.image("Background", "assets/Background.jpg");
	this.game.load.image("BGStar1", "assets/stars/SmallStar1.png");
	this.game.load.image("BGStar2", "assets/stars/SmallStar2.png");
	this.game.load.image("BGStar3", "assets/stars/SmallStar3.png");
	this.game.load.image("BGStar4", "assets/stars/SmallStar4.png");
	this.game.load.image("BGStar5", "assets/stars/SmallStar5.png");
	
	this.game.load.atlasJSONHash("Rosetta", "assets/characters/Rosetta.png", "assets/characters/Rosetta_Data.json");
	
	this.game.load.spritesheet("Astrid", "assets/characters/Astrid.png", ENEMY_SIZE_SMALL, 57);
	this.game.load.spritesheet("Brutus", "assets/characters/Brutus.png", ENEMY_SIZE_SMALL, 80);
	this.game.load.spritesheet("Debbie", "assets/characters/Debbie.png", ENEMY_SIZE_SMALL, 60);
	this.game.load.spritesheet("Stark", "assets/characters/Stark.png", ENEMY_SIZE_LARGE, ENEMY_SIZE_LARGE);
	
	this.game.load.image("Sam", "assets/pickups/Sam.png");
	this.game.load.image("Samuel", "assets/pickups/Samuel.png");
	this.game.load.image("Samson", "assets/pickups/Samson.png");
	this.game.load.spritesheet("InvinciStar", "assets/pickups/InvinciStar.png", 32, 32);
	
	this.game.load.image("PauseMenu1", "assets/menus/PauseMenu1.png");
	this.game.load.image("PauseMenu2", "assets/menus/PauseMenu2.png");
	this.game.load.image("PauseMenu3", "assets/menus/PauseMenu3.png");
	
	this.game.load.audio("GameplayBGMusic", "assets/audio/plosko_gameplayBGMusic.mp3");
	this.game.load.audio("InvinciblityMusic", "assets/audio/burning-mir_invincibilitymusic.wav");
	this.game.load.audio("EnemyCollideSFX", "assets/audio/qubodup_enemycollide.mp3");
	this.game.load.audio("SampleGetSFX", "assets/audio/gameaudio_sampleget.wav");
}

gameplayState.create = function()
{
	game.add.image(0, 0, "Background");
	for(var i = 0; i < 100; i++)
		new BGStar(this.game);
	
	player = new Player(this.game);
	enemies = game.add.group();
	samples = game.add.group();
	stars = game.add.group();
	
	new Enemy(this.game, "Stark", 0);
	new Enemy(this.game, "Astrid", 2);
	new Enemy(this.game, "Debbie", 4);
	
	currentBGMusic = this.game.add.audio("GameplayBGMusic", 1, true);
	enemyCollideSFX = this.game.add.audio("EnemyCollideSFX", 1, false);
	sampleGetSFX = this.game.add.audio("SampleGetSFX", 1, false);
	currentBGMusic.play();
	
	healthText = this.game.add.text(5, 5, "Health: " + player.health, stdTextStyle);
	scoreText = this.game.add.text(5, 30, "Score: " + player.score, stdTextStyle);
	
	this.pauseKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
	this.pauseImg = null;
}

gameplayState.update = function()
{
	increaseSpeed();
	if(Math.random() < 0.0025) new Sample(this.game);
	if(Math.random() < 0.0005) new InvinciStar(this.game);
	if(this.pauseKey.downDuration(1000))
	{
		this.pauseKey.reset();
		this.game.paused = true;
	}
	else if(this.pauseImg !== null)
	{
		this.game.world.remove(this.pauseImg);
		this.pauseImg = null;
	}
}

gameplayState.paused = function()
{
	this.pauseImg = this.game.add.image(0, 0, "PauseMenu" + this.game.rnd.integerInRange(1, 3));
}

gameplayState.pauseUpdate = function()
{
	if(this.pauseKey.downDuration(1000))
	{
		this.game.world.remove(this.pauseImg);
		this.pauseImg = null;
		this.pauseKey.reset();
		this.game.paused = false;
	}
	else if(this.resetKey.downDuration(1000))
	{
		this.game.state.start("StartScreenState");
		this.game.paused = false;
	}
}

gameplayState.shutdown = function()
{
	currentBGMusic.stop();
}

// ~ ~ ~ ~ ~ Gameplay ~ ~ ~ ~ ~
// ~ ~ ~ ~ ~ Game Over ~ ~ ~ ~ ~ 

gameOverState.init = function(finalScore)
{
	this.finalScore = finalScore;
}

gameOverState.preload = function()
{
	this.game.load.image("GameOver", "assets/menus/Game_Over.png");
	this.game.load.spritesheet("RestartButton", "assets/buttons/Restart_Button.png");
}

gameOverState.create = function()
{
	this.game.add.image(0, 0, "GameOver");
	this.game.add.button(game.world.width - 128, game.world.height - 64, "RestartButton", function()
	{
		this.game.state.start("StartScreenState");
	}, this, 1, 0, 2, 3);
	this.game.add.text(5, this.game.world.height - 25,
		"Final Score: " + this.finalScore, stdTextStyle);
	
	this.continueKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
}

gameOverState.update = function()
{
	if(this.continueKey.downDuration(1000))
	{
		this.continueKey.reset();
		this.game.input.keyboard.removeKey(Phaser.Keyboard.ENTER);
		this.game.state.start("StartScreenState");
	}
}
