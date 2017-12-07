window.onload = function()
{
	game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "game-frame", {});
  
	game.state.add("StartScreenState", startScreenState);
	game.state.add("InstructionState", instructionState);
	game.state.add("GameplayState", gameplayState);
	game.state.add("GameOverState", gameOverState);
	game.state.start("StartScreenState");
}
