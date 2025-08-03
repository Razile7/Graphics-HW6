// src/main.js
import { Game } from './Game.js';

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing Basketball Court...');
    
    // Create and start the game
    const game = new Game();
    game.start();
    
    console.log('Game started!');
});