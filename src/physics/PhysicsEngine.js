// src/physics/PhysicsEngine.js
import { Collision } from './Collision.js';

export class PhysicsEngine {
    constructor() {
        // Physics constants
        this.GRAVITY = -9.8 * 2; // Scaled for game feel
        this.BOUNCE_DAMPING = 0.6;
        this.GROUND_Y = 0.5; // Basketball radius above court
        this.GROUND_FRICTION = 0.95;
        
        // Add collision detector
        this.collision = new Collision();
    }
    
    applyGravity(velocity, deltaTime) {
        velocity.y += this.GRAVITY * deltaTime;
        return velocity;
    }
    
    checkGroundCollision(position, velocity) {
        if (position.y <= this.GROUND_Y) {
            position.y = this.GROUND_Y;
            
            if (velocity.y < 0) {
                // Bounce
                velocity.y *= -this.BOUNCE_DAMPING;
                
                // Stop tiny bounces
                if (Math.abs(velocity.y) < 0.1) {
                    velocity.y = 0;
                }
            }
            
            // Apply friction when on ground
            velocity.x *= this.GROUND_FRICTION;
            velocity.z *= this.GROUND_FRICTION;
        }
        
        return { position, velocity };
    }
    
    // New method to check all collisions
    checkCollisions(position, velocity, hoops) {
        // Check backboard collision
        this.collision.checkBackboardCollision(position, velocity, hoops);
        
        // Check rim collision
        this.collision.checkRimCollision(position, velocity, hoops);
        
        // Return if it's a clean shot
        return this.collision.checkCleanShot(position, velocity, hoops);
    }
}