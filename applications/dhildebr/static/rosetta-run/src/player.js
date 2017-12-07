/*
 * Initializes the player.
 */
function Player(game)
{
	Phaser.Sprite.call(this, game, game.world.centerX / 2, game.height - 150, "Rosetta", 0);
	game.add.existing(this);
	
	// Gravitation and acceleration
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;
	this.body.gravity.x = 0;
	this.body.gravity.y = 0;
	this.body.velocity.x = 0;
	this.body.velocity.y = 0;
	this.body.bounce.x = 0;
	this.body.bounce.y = 0;
	
	// Gameplay variables
	this.health = 100;
	this.score = 0;
	this.timeScoreDelay = 0;
	this.invincibilityTime = 0;
	
	// Player controls
	this.keys =
	{
		letterLeft: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
		arrowLeft: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
		letterRight: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
		arrowRight: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
	};
	
	this.animations.add("left", [18, 19, 20, 21, 20, 19], 10, true);
	this.animations.add("idle", [14, 15, 16, 17, 16, 15], 10, true);
	this.animations.add("right", [22, 23, 24, 25, 24, 23], 10, true);
	this.animations.add("invincible", [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
		12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ,1], 20, true);
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

/*
 * Checks for playter input and handles score gained with time and invincibility.
 */
Player.prototype.update = function()
{
	// Increase score with time
	if(++this.timeScoreDelay >= 60)
	{
		this.timeScoreDelay = 0;
		updateScoreText(++this.score);
	}
	
	// Invincibility
	if(this.invincibilityTime > 0)
	{
		this.animations.currentAnim.speed = this.invincibilityTime / 3;
		if(this.invincibilityTime-- === 1)
		{
			currentBGMusic.stop();
			this.game.world.remove(currentBGMusic);
			currentBGMusic = this.game.add.audio("GameplayBGMusic", 1, true);
			currentBGMusic.play();
			
			this.animations.currentAnim.speed = 20;
		}
	}
	
	// Movement
	if((this.keys.letterLeft.isDown || this.keys.arrowLeft.isDown)
		&& !(this.keys.letterRight.isDown || this.keys.arrowRight.isDown)) // Move left
	{
		this.body.velocity.x = -200;
		if(this.invincibilityTime > 0)
			this.animations.play("invincible");
		else
			this.animations.play("left");
	}
	else if((this.keys.letterRight.isDown || this.keys.arrowRight.isDown)
		&& !(this.keys.letterLeft.isDown || this.keys.arrowLeft.isDown)) // Move right
	{
		this.body.velocity.x = 200;
		if(this.invincibilityTime > 0)
			this.animations.play("invincible");
		else
			this.animations.play("right");
	}
	else // Idle
	{
		this.body.velocity.x = 0;
		if(this.invincibilityTime > 0)
			this.animations.play("invincible");
		else
			this.animations.play("idle");
	}
}
