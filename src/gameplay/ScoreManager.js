// src/gameplay/ScoreManager.js
export class ScoreManager {
    constructor() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.shotAttempts = 0;
        this.shotsMade = 0;
    }
    
    recordShot() {
        this.shotAttempts++;
        console.log('Shot attempt #', this.shotAttempts);
    }
    
    recordScore(points = 2, player = 'player') {
        this.shotsMade++;
        
        if (player === 'player') {
            this.playerScore += points;
            console.log('Player scores! Total:', this.playerScore);
        } else {
            this.computerScore += points;
        }
        
        return this.getStats();
    }
    
    getStats() {
        const accuracy = this.shotAttempts > 0 
            ? (this.shotsMade / this.shotAttempts * 100).toFixed(1)
            : '0.0';
            
        return {
            playerScore: this.playerScore,
            computerScore: this.computerScore,
            shotAttempts: this.shotAttempts,
            shotsMade: this.shotsMade,
            accuracy: accuracy
        };
    }
    
    reset() {
        this.playerScore = 0;
        this.computerScore = 0;
        this.shotAttempts = 0;
        this.shotsMade = 0;
    }
}