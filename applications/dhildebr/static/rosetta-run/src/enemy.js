// Whether each lane is currently filled with an enemy
var laneFill = [null, null, false, false, false, null];

/*
 * Creates an enemy of the given name in the given lane. The leftmost lane is
 * numbered one; thus, if a large enmy like Stark is spawned in lane 0, they
 * will be halfway off the left edge. Similarly, a large enemy in the final lane
 * will be off the right edge.
 */
function Enemy(game, name, lane)
{
	var x = LANE_MARGIN + ((lane - 1) * LANE_WIDTH);
	var y = (name === "Stark") ? -(ENEMY_SIZE_LARGE) : -(ENEMY_SIZE_SMALL);
	
	Phaser.Sprite.call(this, game, x, y, name, 0, enemies);
	game.add.existing(this);
	
	game.physics.arcade.enable(this);
	this.body.velocity.y = gameSpeed + game.rnd.realInRange(-3, 3);
	
	this.name = name;
	this.lane = lane;
	if(name !== "Stark")
		laneFill[this.lane] = true;
	
	this.animations.add("AstridAnim", [2, 1, 0, 1, 2, 3, 4, 3], 8, true);
	this.animations.add("BrutusAnim", [0, 1, 2, 3, 4, 5, 4, 3, 2, 1], 8, true);
	this.animations.add("DebbieAnim", [0, 1, 2, 3, 2, 1], 6, true);
	this.animations.add("StarkAnim", [0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1], 15, true);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

/*
 * Returns a number for a random lane, the value of which depends on whether
 * the enemy is large enough to occupy two. If the enemy is large, the lane will
 * be either the last, or the zero-th, placing it, in either case, halfway off
 * the screen. Otherwise, small enemies will be placed in the lanes 2 through 
 * NUM_LANES - 1. This function assumes there are at least three lanes.
 */
function randomLane(isLarge, game)
{
	var lane;
	var i = 0;
	
	do
	{
		lane = (isLarge) ? game.rnd.integerInRange(0, 1) * NUM_LANES : game.rnd.integerInRange(2, NUM_LANES - 1);
		if(++i >= 500) return (isLarge) ? 0 : 2;
	}
	while((isLarge) ? laneFill[lane] || laneFill[lane + 1] : laneFill[lane]);
	
	return lane;
}

/*
 * If the enemy has left the bottom of the screen, respawns them at the top
 * again, after a bit of randomized delay.
 */
Enemy.prototype.checkRespawn = function()
{
	if(this.y > this.game.height && Math.random() < 0.2)
	{
		var newName = (this.name === "Stark") ? "Stark" : this.game.rnd.pick(["Astrid", "Brutus", "Debbie"]);
		var lane = randomLane(newName === "Stark", this.game);
		var x = LANE_MARGIN + ((lane - 1) * LANE_WIDTH);
		var y = (newName === "Stark") ? -(ENEMY_SIZE_LARGE) : -(ENEMY_SIZE_SMALL);
		
		if(newName !== "Stark") laneFill[this.lane] = false;
		
		this.name = newName;
		this.lane = lane;
		
		if(newName !== "Stark") laneFill[this.lane] = true;
		
		this.reset(x, y);
		this.loadTexture(newName);
		this.body.velocity.y = gameSpeed + game.rnd.realInRange(-3, 3);
	}
}

/*
 * Checks whether the enemy should be respawned, and handles collision.
 */
Enemy.prototype.update = function()
{
	this.checkRespawn();
	this.animations.play(this.name + "Anim");
	this.game.physics.arcade.overlap(this, player, function()
	{
		if(player.invincibilityTime <= 0) // Non-invincible collision
		{
			switch(this.name)
			{
				case "Astrid":
					player.damage(10);
				break;
				case "Brutus":
					player.damage(15);
				break;
				case "Debbie":
					player.damage(5);
				break;
				case "Stark":
					player.damage(20);
				break;
			}
			
			updateHealthText(Math.max(player.health, 0));
			if(!(player.alive)) this.game.state.start("GameOverState", true, false, player.score);
		}
		else // Invincible collison
		{
			player.score += this.game.rnd.integerInRange(3, 7);
			updateScoreText(player.score);
		}
		
		this.y = this.game.world.height;
		enemyCollideSFX.play();
	}, null, this);
}
