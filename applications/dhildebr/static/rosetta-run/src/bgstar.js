/*
 * Creates a new background star.
 */
function BGStar(game)
{
	Phaser.Sprite.call(this, game, game.world.randomX, game.world.randomY,
		game.rnd.pick(["BGStar1", "BGStar2", "BGStar3", "BGStar4", "BGStar5"]));
	game.add.existing(this);
	game.physics.arcade.enable(this);
	this.body.velocity.y = 250;
}

BGStar.prototype = Object.create(Phaser.Sprite.prototype);
BGStar.prototype.constructor = BGStar;

/*
 * Handles star respawning.
 */
BGStar.prototype.update = function()
{
	if(this.y > this.game.world.height)
	{
		this.x = this.game.world.randomX;
		this.y = this.game.rnd.integerInRange(-1, -20);
	}
}
