/*
 * Creates an invincibility star in a random lane.
 */
function InvinciStar(game)
{
	var name = "InvinciStar";
	var lane = game.rnd.integerInRange(1, NUM_LANES);
	var x = LANE_MARGIN + ((lane - 1) * LANE_WIDTH);
	var y = -2 * ENEMY_SIZE_LARGE;
	
	Phaser.Sprite.call(this, game, x, y, "InvinciStar", 0, stars);
	game.add.existing(this);
	this.name = name;
	this.lane = lane;
	
	game.physics.arcade.enable(this);
	this.body.velocity.y = gameSpeed + game.rnd.realInRange(-3, 3);
	
	this.animations.add("InvinciStarAnim", [0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1], 10, true);
}

InvinciStar.prototype = Object.create(Phaser.Sprite.prototype);
InvinciStar.prototype.constructor = InvinciStar;

InvinciStar.prototype.update = function()
{
	if(this.y > this.game.world.height)
	{
		this.kill();
		stars.remove(this, true);
	}
	else
	{
		this.game.physics.arcade.overlap(this, player, function()
		{
			player.invincibilityTime = 600;
			
			currentBGMusic.stop();
			this.game.world.remove(currentBGMusic);
			currentBGMusic = this.game.add.audio("InvinciblityMusic", 1, true);
			currentBGMusic.play();
			
			this.kill();
			stars.remove(this, true);
		}, null, this);
		
		this.animations.play("InvinciStarAnim");
	}
}
