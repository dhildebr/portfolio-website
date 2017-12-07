/*
 * Spawns a random variant of Sam the Sample in a random lane.
 */
function Sample(game)
{
	var name = game.rnd.pick(["Sam", "Samuel", "Samson"]);
	var lane = game.rnd.integerInRange(1, NUM_LANES);
	var x = LANE_MARGIN + ((lane - 1) * LANE_WIDTH) + ((LANE_WIDTH / 2) - 16);
	var y = -32;
	
	Phaser.Sprite.call(this, game, x, y, name, 0, samples);
	game.add.existing(this);
	this.name = name;
	this.lane = lane;
	
	game.physics.arcade.enable(this);
	this.body.velocity.y = gameSpeed + game.rnd.realInRange(-3, 3);
}

Sample.prototype = Object.create(Phaser.Sprite.prototype);
Sample.prototype.constructor = Sample;

Sample.prototype.update = function()
{
	if(this.y > this.game.world.height)
	{
		this.kill();
		samples.remove(this, true);
	}
	else
	{
		this.game.physics.arcade.overlap(this, enemies);
		this.game.physics.arcade.overlap(this, samples);
		this.game.physics.arcade.overlap(this, stars);
		this.game.physics.arcade.overlap(this, player, function()
		{
			switch(this.name)
			{
				case "Sam":
					player.score += 10;
				break;
				case "Samuel":
					player.score += 20;
				break;
				case "Samson":
					player.score += 30;
				break;
			}
			
			scoreText.text = "Score: " + player.score;
			sampleGetSFX.play();
			
			this.kill();
			samples.remove(this, true);
		}, null, this);
	}
}
