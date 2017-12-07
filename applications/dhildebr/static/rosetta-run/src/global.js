// Game area dimensions; lane properties
var GAME_WIDTH = 400, GAME_HEIGHT = 600;
var NUM_LANES = 5, LANE_MARGIN = 5;
var LANE_WIDTH = GAME_WIDTH / NUM_LANES;

// Game reference
var game;

// Player, enemy, sample, and invincistar references
var player, enemies, samples, stars;

// Standard dimensions for various types of sprite
var PLAYER_SIZE = 64;
var ENEMY_SIZE_SMALL = LANE_WIDTH - (2 * LANE_MARGIN);
var ENEMY_SIZE_LARGE = (2 * LANE_WIDTH) - (2 * LANE_MARGIN);

// Current and maximum game speeds; speed increment
var gameSpeed = 100, maxSpeed = 300;
var speedIncrement = 0.01;

// HUD text and styling
var healthText, scoreText;
var stdTextStyle = {font: "20px Arial Bold", fill: "#f2bc18", align: "left"};

// Game sound references
var currentBGMusic;
var enemyCollideSFX, sampleGetSFX;

/*
 * Increments the speed of the game.
 */
function increaseSpeed()
{
	if(gameSpeed < maxSpeed)
	{
		gameSpeed = Math.min(gameSpeed + speedIncrement, maxSpeed);
	}
}

/*
 * Updates the player's health following a change.
 */
function updateHealthText(health)
{
	healthText.text = "Health: " + health;
}

/*
 * Updates the player's score following a change.
 */
function updateScoreText(score)
{
	scoreText.text = "Score: " + score;
}
