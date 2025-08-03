// src/world/Court.js
import * as THREE from 'three';
import { GAME_CONFIG } from '../config/constants.js';
import { CourtLines } from './CourtLines.js';
import { Baskets } from './Baskets.js';
import { AssetLoader } from '../utils/AssetLoader.js';

export class Court {
    constructor(scene, scale = 1.5) {
        this.scene = scene;
        this.scale = scale;
        this.group = new THREE.Group();
        this.group.name = 'Court';
        this.hoops = [];
        this.assetLoader = new AssetLoader();
        this.init();
    }
    
    init() {
        // Create court floor
        this.createCourtFloor();
        
        // Create out of bounds area
        this.createOutOfBounds();
        
        // Add court lines
        this.courtLines = new CourtLines(this.group, this.scale);
        
        // Add baskets
        this.baskets = new Baskets(this.group, this.scale);
        this.hoops = this.baskets.getHoops();
        
        // Add to scene
        this.scene.add(this.group);
        
        // Load textures asynchronously
        this.loadTextures();
    }
    
    createCourtFloor() {
        const dims = GAME_CONFIG.COURT.FLOOR_DIMENSIONS;
        
        const geometry = new THREE.BoxGeometry(
            dims.LENGTH * this.scale,
            dims.HEIGHT,
            dims.WIDTH * this.scale
        );
        
        // Basic material for now
        const material = new THREE.MeshPhongMaterial({
            color: 0xc68642,
            shininess: 50
        });
        
        const court = new THREE.Mesh(geometry, material);
        court.receiveShadow = true;
        court.name = 'CourtFloor';
        this.courtFloor = court; // Store reference for texture update
        this.group.add(court);
    }
    
    createOutOfBounds() {
        const dims = GAME_CONFIG.COURT.OUT_OF_BOUNDS_DIMENSIONS;
        
        const geometry = new THREE.BoxGeometry(
            dims.LENGTH * this.scale,
            dims.HEIGHT,
            dims.WIDTH * this.scale
        );
        
        const material = new THREE.MeshPhongMaterial({
            color: 0x8B6F47,
            shininess: 50
        });
        
        const outOfBounds = new THREE.Mesh(geometry, material);
        outOfBounds.position.y = -0.05;
        outOfBounds.receiveShadow = true;
        outOfBounds.name = 'OutOfBounds';
        this.outOfBounds = outOfBounds; // Store reference for texture update
        this.group.add(outOfBounds);
    }
    
    async loadTextures() {
        const { courtTextures, outOfBoundsTextures } = await this.assetLoader.loadCourtTextures();
        
        // Update court floor material
        if (this.courtFloor && courtTextures.base) {
            if (courtTextures.base) this.courtFloor.material.map = courtTextures.base;
            if (courtTextures.normal) this.courtFloor.material.normalMap = courtTextures.normal;
            if (courtTextures.ao) this.courtFloor.material.aoMap = courtTextures.ao;
            this.courtFloor.material.needsUpdate = true;
        }
        
        // Update out of bounds material
        if (this.outOfBounds && outOfBoundsTextures.base) {
            if (outOfBoundsTextures.base) this.outOfBounds.material.map = outOfBoundsTextures.base;
            if (outOfBoundsTextures.normal) this.outOfBounds.material.normalMap = outOfBoundsTextures.normal;
            if (outOfBoundsTextures.ao) this.outOfBounds.material.aoMap = outOfBoundsTextures.ao;
            this.outOfBounds.material.needsUpdate = true;
        }
    }
    
    getHoops() {
        return this.hoops;
    }
}