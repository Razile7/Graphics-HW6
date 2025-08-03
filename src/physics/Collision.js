// src/physics/Collision.js
import * as THREE from 'three';

export class Collision {
    constructor() {
        this.BALL_RADIUS = 0.5;
        this.RIM_RADIUS = 0.7;
        this.RIM_TUBE_RADIUS = 0.1;
        this.BACKBOARD_BOUNCE = 0.7;
        this.RIM_BOUNCE = 0.5;
    }
    
    // Check if ball hits the backboard
    checkBackboardCollision(ballPos, ballVelocity, hoops) {
        for (const hoop of hoops) {
            // Backboard dimensions (from your constants)
            const backboardX = hoop.side === 'right' ? 14.5 * 1.5 : -14.5 * 1.5;
            const backboardY = 4.7; // Center Y
            const backboardHalfHeight = 1.5;
            const backboardHalfWidth = 2;
            
            // Check if ball is close to backboard X position
            const distToBackboard = Math.abs(ballPos.x - backboardX);
            
            if (distToBackboard < this.BALL_RADIUS + 0.05) { // 0.05 is half backboard thickness
                // Check if within backboard bounds
                if (ballPos.y > backboardY - backboardHalfHeight && 
                    ballPos.y < backboardY + backboardHalfHeight &&
                    Math.abs(ballPos.z) < backboardHalfWidth) {
                    
                    // Ball hit the backboard!
                    console.log('Backboard collision!');
                    
                    // Reverse X velocity and dampen
                    ballVelocity.x *= -this.BACKBOARD_BOUNCE;
                    
                    // Push ball away from backboard
                    if (hoop.side === 'right') {
                        ballPos.x = backboardX - this.BALL_RADIUS - 0.06;
                    } else {
                        ballPos.x = backboardX + this.BALL_RADIUS + 0.06;
                    }
                    
                    return true;
                }
            }
        }
        return false;
    }
    
    // Check if ball hits the rim
    checkRimCollision(ballPos, ballVelocity, hoops) {
        for (const hoop of hoops) {
            const rimCenter = hoop.position;
            
            // Calculate distance from ball center to rim center in XZ plane
            const dx = ballPos.x - rimCenter.x;
            const dz = ballPos.z - rimCenter.z;
            const horizontalDist = Math.sqrt(dx * dx + dz * dz);
            
            // Check if ball is at rim height
            const heightDiff = Math.abs(ballPos.y - rimCenter.y);
            
            if (heightDiff < this.BALL_RADIUS + this.RIM_TUBE_RADIUS) {
                // Check if ball hits the rim (between inner and outer edge)
                const innerEdge = this.RIM_RADIUS - this.RIM_TUBE_RADIUS;
                const outerEdge = this.RIM_RADIUS + this.RIM_TUBE_RADIUS;
                
                if (horizontalDist > innerEdge - this.BALL_RADIUS && 
                    horizontalDist < outerEdge + this.BALL_RADIUS) {
                    
                    console.log('Rim collision!');
                    
                    // Calculate bounce direction
                    const normal = new THREE.Vector3(dx, 0, dz).normalize();
                    
                    // Reflect velocity
                    const dot = ballVelocity.dot(normal);
                    ballVelocity.sub(normal.multiplyScalar(2 * dot));
                    
                    // Dampen the bounce
                    ballVelocity.multiplyScalar(this.RIM_BOUNCE);
                    
                    // Add some upward velocity
                    ballVelocity.y = Math.abs(ballVelocity.y) * 0.5;
                    
                    // Push ball away from rim
                    const pushDirection = new THREE.Vector3(dx, 0, dz).normalize();
                    const targetDist = horizontalDist < this.RIM_RADIUS ? 
                        innerEdge - this.BALL_RADIUS - 0.05 : 
                        outerEdge + this.BALL_RADIUS + 0.05;
                    
                    ballPos.x = rimCenter.x + pushDirection.x * targetDist;
                    ballPos.z = rimCenter.z + pushDirection.z * targetDist;
                    
                    return true;
                }
            }
        }
        return false;
    }
    
    // Check if ball goes through hoop cleanly
    checkCleanShot(ballPos, ballVelocity, hoops) {
        // Only check when ball is falling
        if (ballVelocity.y > 0) return false;
        
        for (const hoop of hoops) {
            const rimCenter = hoop.position;
            
            // Check if ball is passing through rim height
            if (Math.abs(ballPos.y - rimCenter.y) < 0.3) {
                // Calculate distance from rim center
                const dx = ballPos.x - rimCenter.x;
                const dz = ballPos.z - rimCenter.z;
                const horizontalDist = Math.sqrt(dx * dx + dz * dz);
                
                // Ball must be well inside the rim
                if (horizontalDist < this.RIM_RADIUS - this.BALL_RADIUS - 0.1) {
                    return true;
                }
            }
        }
        return false;
    }
}