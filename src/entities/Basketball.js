// src/entities/Basketball.js
import * as THREE from 'three';
import { GAME_CONFIG } from '../config/constants.js';
import { AssetLoader } from '../utils/AssetLoader.js';

export class Basketball {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.assetLoader = new AssetLoader();
        this.init();
    }
    
    init() {
        const config = GAME_CONFIG.BASKETBALL;
        // Create basketball geometry
        const geometry = new THREE.SphereGeometry(
            config.RADIUS,
            config.SEGMENTS.WIDTH,
            config.SEGMENTS.HEIGHT
        );
        
        // Create basic material for now
        const material = new THREE.MeshPhongMaterial({
            color: config.COLOR,
            shininess: 5
        });
        
        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.castShadow = true;
        
        // Add basketball lines
        this.addBasketballLines();
        
        // Set position
        const pos = config.START_POSITION;
        this.mesh.position.set(pos.x, pos.y, pos.z);
        
        // Add to scene
        this.scene.add(this.mesh);
        
        // Load textures asynchronously
        this.loadTextures();
    }
    
    addBasketballLines() {
        const config = GAME_CONFIG.BASKETBALL;
        
        const ringGeometry = new THREE.CylinderGeometry(
            config.RADIUS + config.RING_OFFSET,
            config.RADIUS + config.RING_OFFSET,
            config.RING_HEIGHT,
            32,
            1,
            true
        );
        
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: config.RING_COLOR
        });
        
        // Create three rings at different angles
        const angles = [0, Math.PI / 3, 2 * Math.PI / 3];
        
        angles.forEach(angle => {
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.rotation.z = angle;
            this.mesh.add(ring);
        });
    }
    
    async loadTextures() {
        const textures = await this.assetLoader.loadBasketballTextures();
        
        if (textures.base || textures.normal || textures.ao) {
            // Update material with loaded textures
            if (textures.base) this.mesh.material.map = textures.base;
            if (textures.normal) this.mesh.material.normalMap = textures.normal;
            if (textures.ao) this.mesh.material.aoMap = textures.ao;
            
            this.mesh.material.needsUpdate = true;
        }
    }
    
    setVelocity(velocity) {
        this.velocity.copy(velocity);
    }
    
    getVelocity() {
        return this.velocity.clone();
    }
    
    // ADD THIS NEW METHOD:
    update(deltaTime) {
        // Update rotation based on velocity
        if (this.velocity.length() > 0.1) {
            // Calculate rotation axis (perpendicular to movement on ground)
            const rotationAxis = new THREE.Vector3(
                -this.velocity.z,
                0,
                this.velocity.x
            ).normalize();
            
            // Rotation speed proportional to horizontal velocity
            const horizontalSpeed = Math.sqrt(
                this.velocity.x ** 2 + this.velocity.z ** 2
            );
            const rotationSpeed = horizontalSpeed * 2; // Adjust multiplier as needed
            
            // Apply rotation
            if (rotationSpeed > 0.01) {
                this.mesh.rotateOnWorldAxis(rotationAxis, rotationSpeed * deltaTime);
            }
        }
    }
}