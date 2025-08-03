// src/ui/UIManager.js
export class UIManager {
    constructor() {
        this.scoreDisplay = null;
        this.controlsDisplay = null;
        this.powerDisplay = null;
        this.statsDisplay = null;
        this.statusMessage = null;
        this.init();
    }
    
    init() {
        // Get existing UI elements
        this.playerScoreEl = document.getElementById('player-score');
        this.powerValueEl = document.getElementById('power-value');

        // Statistics elements
        this.shotsMadeEl = document.getElementById('shots-made');
        this.shotAttemptsEl = document.getElementById('shot-attempts');
        this.accuracyEl = document.getElementById('accuracy');

        // Status message element
        this.statusMessageEl = document.getElementById('status-message');

        // Remove temporary displays if they exist
        const tempPowerDisplay = document.getElementById('power-display');
        const tempTestDisplay = document.getElementById('test-display');
        if (tempPowerDisplay) tempPowerDisplay.remove();
        if (tempTestDisplay) tempTestDisplay.remove();

        console.log('UIManager initialized with all elements');
    }
    
    // Method to update all statistics at once
    updateStats(stats) {
        if (this.shotsMadeEl) this.shotsMadeEl.textContent = stats.shotsMade;
        if (this.shotAttemptsEl) this.shotAttemptsEl.textContent = stats.shotAttempts;
        if (this.accuracyEl) {
            this.accuracyEl.textContent = `${stats.accuracy}%`;

            // Color code accuracy
            const accuracy = parseFloat(stats.accuracy);
            if (accuracy >= 70) {
                this.accuracyEl.style.color = '#00ff00'; // Green for excellent
            } else if (accuracy >= 50) {
                this.accuracyEl.style.color = '#ffff00'; // Yellow for good
            } else if (accuracy >= 30) {
                this.accuracyEl.style.color = '#ffa500'; // Orange for fair
            } else {
                this.accuracyEl.style.color = '#ff0000'; // Red for poor
            }
        }
    }
    
    updateScore(score) {
        if (this.playerScoreEl) this.playerScoreEl.textContent = score;
    }
    
    updatePower(power) {
        if (this.powerValueEl) {
            this.powerValueEl.textContent = `${power}%`;
            // Change color based on power level
            if (power < 30) {
                this.powerValueEl.style.color = '#00ff00'; // Green for low
            } else if (power < 70) {
                this.powerValueEl.style.color = '#ffff00'; // Yellow for medium
            } else {
                this.powerValueEl.style.color = '#ff0000'; // Red for high
            }

            // Add subtle visual feedback - brief highlight
            this.powerValueEl.style.transform = 'scale(1.1)';
            this.powerValueEl.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                this.powerValueEl.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    showMessage(message, type = 'info', duration = 2000) {
        if (!this.statusMessageEl) return;

        // Clear any existing timeout
        if (this.messageTimeout) {
            clearTimeout(this.messageTimeout);
        }

        // Set message content and style
        this.statusMessageEl.textContent = message;
        this.statusMessageEl.className = '';

        // Set color based on type
        if (type === 'success') {
            this.statusMessageEl.classList.add('status-success');
        } else if (type === 'error') {
            this.statusMessageEl.classList.add('status-error');
        } else {
            this.statusMessageEl.classList.add('status-info');
        }

        // Show message
        this.statusMessageEl.style.opacity = '1';

        // Hide after duration
        this.messageTimeout = setTimeout(() => {
            this.statusMessageEl.style.opacity = '0';
        }, duration);
    }

    // Method to show shot feedback with specific styling
    showShotFeedback(made, points = 0) {
        if (made) {
            this.showMessage(`SHOT MADE! +${points} points`, 'success', 2000);
        } else {
            this.showMessage('MISSED SHOT', 'error', 1500);
        }
    }

    // Method to show subtle reset feedback (optional)
    showResetFeedback() {
        // Could add a small visual indicator here if needed
        console.log('Basketball position reset');
    }
}