// src/Game.js
import * as THREE from 'three';
import { SceneManager } from './core/SceneManager.js';
import { Court } from './world/Court.js';
import { Basketball } from './entities/Basketball.js';
import { Environment } from './world/Environment.js';
import { InputManager } from './input/InputManager.js';
import { UIManager } from './ui/UIManager.js';
import { PhysicsEngine } from './physics/PhysicsEngine.js';
import { ShotMechanics } from './gameplay/ShotMechanics.js';
import { ScoreManager } from './gameplay/ScoreManager.js';
import { GAME_CONFIG } from './config/constants.js';

export class Game {
    constructor() {
        this.sceneManager = null;
        this.court = null;
        this.basketball = null;
        this.environment = null;
        this.inputManager = null;
        this.uiManager = null;
        this.physicsEngine = null;
        this.shotMechanics = null;
        this.scoreManager = null;
        this.isOrbitEnabled = true;
        
        // Physics test flag
        this.isPhysicsActive = false;
        this.isShooting = false;
        this.hasScored = false; // Track if we already scored this shot
        
        // Game state
        this.shotPower = 50;
        
        // Timing
        this.lastTime = performance.now();
        
        this.init();
    }
    
    init() {
        console.log('Initializing Basketball Court Game...');
        
        try {
            // Initialize managers
            this.sceneManager = new SceneManager();
            this.uiManager = new UIManager();
            this.inputManager = new InputManager();
            this.scoreManager = new ScoreManager();
            
            // Create game world
            this.court = new Court(this.sceneManager.scene, 1.5);
            this.basketball = new Basketball(this.sceneManager.scene);
            this.environment = new Environment(this.sceneManager.scene, 1.5);
            
            // Initialize physics
            this.physicsEngine = new PhysicsEngine();
            console.log('Physics engine created');
            
            // Initialize shot mechanics with hoops
            this.shotMechanics = new ShotMechanics(
                this.basketball,
                this.court.getHoops()
            );
            console.log('Shot mechanics initialized');
            
            // Setup controls
            this.setupControls();
            
            // Initialize UI
            this.uiManager.updatePower(this.shotPower);
            this.updateUI();
            
            console.log('Game initialization complete!');
            
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }
    
    setupControls() {
        // Camera toggle
        this.inputManager.on('toggleCamera', () => {
            this.sceneManager.toggleOrbitControls();
            this.isOrbitEnabled = !this.isOrbitEnabled;
        });
        
        // Basketball movement
        this.inputManager.on('move', (movement) => {
            if (this.basketball && this.basketball.mesh && !this.isShooting) {
                const speed = 0.2;
                this.basketball.mesh.position.x += movement.x * speed;
                this.basketball.mesh.position.z += movement.z * speed;
                
                // Keep basketball within court bounds (use actual court dimensions)
                const courtLength = GAME_CONFIG.COURT.FLOOR_DIMENSIONS.LENGTH * 1.5; // 45
                const courtWidth = GAME_CONFIG.COURT.FLOOR_DIMENSIONS.WIDTH * 1.5;   // 22.5
                const bounds = {
                    minX: -courtLength / 2,
                    maxX: courtLength / 2,
                    minZ: -courtWidth / 2,
                    maxZ: courtWidth / 2
                };
                this.basketball.mesh.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, this.basketball.mesh.position.x));
                this.basketball.mesh.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, this.basketball.mesh.position.z));
            }
        });
        
        // Shot power adjustment
        this.inputManager.on('powerUp', () => {
            this.shotPower = Math.min(100, this.shotPower + 5);
            this.uiManager.updatePower(this.shotPower);
            // No center message for power adjustment
        });

        this.inputManager.on('powerDown', () => {
            this.shotPower = Math.max(0, this.shotPower - 5);
            this.uiManager.updatePower(this.shotPower);
            // No center message for power adjustment
        });
        
        // Shooting - now with actual physics!
        this.inputManager.on('shoot', () => {
            // Only shoot if not already shooting
            if (!this.isShooting && !this.isPhysicsActive) {
                console.log('Shooting with power:', this.shotPower);
                
                // Record shot attempt
                this.scoreManager.recordShot();
                this.updateUI(); // Update UI to show new attempt count

                // Calculate shot velocity
                const shotVelocity = this.shotMechanics.calculateShotVelocity(this.shotPower);

                // Set the velocity and enable physics
                this.basketball.setVelocity(shotVelocity);
                this.isPhysicsActive = true;
                this.isShooting = true;
                this.hasScored = false; // Reset score flag for new shot

                this.uiManager.showMessage(`SHOOTING! Power: ${this.shotPower}%`, 'info', 1000);
            }
        });
        
        // Reset basketball position
        this.inputManager.on('reset', () => {
            if (this.basketball && this.basketball.mesh) {
                const startPos = { x: 0, y: 2, z: 0 };
                this.basketball.mesh.position.set(startPos.x, startPos.y, startPos.z);
                this.basketball.setVelocity(new THREE.Vector3(0, 0, 0)); // Reset velocity
                this.shotPower = 50;
                this.isPhysicsActive = false; // Stop physics
                this.isShooting = false; // Reset shooting flag
                this.hasScored = false; // Reset score flag
                this.uiManager.updatePower(this.shotPower);
                // No center message for reset
            }
        });
        
        // Test physics - press 'T' to drop the ball
        document.addEventListener('keydown', (e) => {
            if (e.key === 't' || e.key === 'T') {
                console.log('Test drop with spin!');
                this.basketball.mesh.position.y = 5; // Lift ball up
                // Give it some horizontal velocity too
                this.basketball.setVelocity(new THREE.Vector3(3, 0, 2)); // Moving diagonally
                this.isPhysicsActive = true; // Enable physics
            }
        });
    }
    
    updateUI() {
        const stats = this.scoreManager.getStats();
        this.uiManager.updateScore(stats.playerScore);
        this.uiManager.updateStats(stats);
    }
    
    start() {
        // Initialize UI with starting values
        this.updateUI();
        this.uiManager.updatePower(this.shotPower);
        this.animate();
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Calculate delta time
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update input
        if (this.inputManager) this.inputManager.update();
        
        // Test physics
        if (this.isPhysicsActive && this.basketball) {
            // Get current velocity
            let velocity = this.basketball.getVelocity();
            
            // Apply gravity
            velocity = this.physicsEngine.applyGravity(velocity, deltaTime);
            
            // Update position BEFORE collision checks
            const oldPosition = this.basketball.mesh.position.clone();
            this.basketball.mesh.position.add(velocity.clone().multiplyScalar(deltaTime));
            
            // Check collisions with rim and backboard
            const hoops = this.court.getHoops();
            const isCleanShot = this.physicsEngine.checkCollisions(
                this.basketball.mesh.position,
                velocity,
                hoops
            );
            
            // Check ground collision
            const result = this.physicsEngine.checkGroundCollision(
                this.basketball.mesh.position,
                velocity
            );
            
            // Update basketball with final position and velocity
            this.basketball.mesh.position.copy(result.position);
            this.basketball.setVelocity(result.velocity);
            
            // Check for score if we're shooting and haven't scored yet
            if (this.isShooting && !this.hasScored && isCleanShot) {
                this.hasScored = true;
                this.scoreManager.recordScore(2, 'player');
                this.updateUI();
                this.uiManager.showShotFeedback(true, 2);
            }
            
            // Stop physics when ball stops bouncing
            if (Math.abs(result.velocity.y) < 0.01 && result.position.y <= this.physicsEngine.GROUND_Y) {
                this.isPhysicsActive = false;
                
                // Show miss message if we didn't score
                if (this.isShooting && !this.hasScored) {
                    this.uiManager.showShotFeedback(false);
                    this.updateUI(); // Update UI to show miss
                }
                
                this.isShooting = false; // Reset shooting flag
                console.log('Ball stopped');
            }
        }
        
        // Update basketball (rotation animation)
        if (this.basketball) {
            this.basketball.update(deltaTime);
        }
        
        // Render scene
        this.sceneManager.render();
    }
}