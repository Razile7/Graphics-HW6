// src/gameplay/ShotMechanics.js
import * as THREE from 'three';

export class ShotMechanics {
    constructor(basketball, hoops) {
        this.basketball = basketball;
        this.hoops = hoops;
    }
    
    calculateShotVelocity(power) {
        // Find nearest hoop
        const nearestHoop = this.getNearestHoop();
        
        const ballPos = this.basketball.mesh.position;
        const hoopPos = nearestHoop.position;
        
        // Calculate direction to hoop
        const direction = new THREE.Vector3();
        direction.subVectors(hoopPos, ballPos);
        
        // Calculate horizontal distance
        const horizontalDistance = Math.sqrt(
            direction.x ** 2 + direction.z ** 2
        );
        
        // Calculate height difference (hoop is at y=4, ball starts around y=2)
        const heightDifference = hoopPos.y - ballPos.y;
        
        // Normalize horizontal direction
        direction.y = 0;
        direction.normalize();
        
        // Calculate initial velocity based on power and distance
        const powerFactor = power / 100;
        
        // REDUCED horizontal speed for narrower arc
        const baseSpeed = 5 + horizontalDistance * 0.15; // Reduced from 8 + 0.3
        const finalSpeed = baseSpeed + powerFactor * 3; // Reduced from 5
        
        // Calculate required arc height (keeping it high)
        const minArcHeight = heightDifference + 8; // Increased for more vertical arc
        const distanceFactor = horizontalDistance * 0.3; // Slightly increased
        const powerBoost = powerFactor * 2; // Reduced from 3
        
        // Final arc height calculation
        const arcHeight = minArcHeight + distanceFactor + powerBoost;
        
        // Create velocity vector
        const velocity = new THREE.Vector3(
            direction.x * finalSpeed,
            arcHeight,
            direction.z * finalSpeed
        );
        
        console.log('Shot calculations:');
        console.log('- Distance to hoop:', horizontalDistance);
        console.log('- Height difference:', heightDifference);
        console.log('- Arc height:', arcHeight);
        console.log('- Horizontal speed:', finalSpeed);
        console.log('- Shot velocity:', velocity);
        
        return velocity;
    }
    
    getNearestHoop() {
        const ballPos = this.basketball.mesh.position;
        let nearestHoop = this.hoops[0];
        let minDistance = ballPos.distanceTo(this.hoops[0].position);
        
        for (let i = 1; i < this.hoops.length; i++) {
            const distance = ballPos.distanceTo(this.hoops[i].position);
            if (distance < minDistance) {
                minDistance = distance;
                nearestHoop = this.hoops[i];
            }
        }
        
        console.log('Nearest hoop:', nearestHoop.side, 'at position:', nearestHoop.position);
        
        return nearestHoop;
    }
    
    checkScore(ballPosition, ballVelocity) {
        // Only check when ball is falling (negative Y velocity)
        if (ballVelocity.y > 0) {
            return { scored: false, hoop: null };
        }
        
        for (const hoop of this.hoops) {
            const hoopPos = hoop.position;
            
            // Check if ball is near hoop height (within range)
            const heightDifference = Math.abs(ballPosition.y - hoopPos.y);
            if (heightDifference < 0.5) { // Within 0.5 units of hoop height
                
                // Check horizontal distance from hoop center
                const horizontalDistance = Math.sqrt(
                    (ballPosition.x - hoopPos.x) ** 2 + 
                    (ballPosition.z - hoopPos.z) ** 2
                );
                
                // Hoop radius is about 0.7, ball must pass through
                if (horizontalDistance < 0.6) {
                    console.log('SCORE! Ball went through the hoop!');
                    return { scored: true, hoop: hoop };
                }
            }
        }
        
        return { scored: false, hoop: null };
    }
}