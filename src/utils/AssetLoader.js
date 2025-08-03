// src/utils/AssetLoader.js
import * as THREE from 'three';
import { ASSET_PATHS } from '../config/assets.js';

export class AssetLoader {
    constructor() {
        this.textureLoader = new THREE.TextureLoader();
        this.loadingManager = new THREE.LoadingManager();
        this.textures = {};
    }
    
    async loadTexture(path) {
        try {
            const texture = await this.textureLoader.loadAsync(path);
            return texture;
        } catch (error) {
            console.warn(`Failed to load texture: ${path}`, error);
            return null;
        }
    }
    
    async loadTextureSet(basePath, normalPath, aoPath, options = {}) {
        try {
            const [baseTexture, normalTexture, aoTexture] = await Promise.all([
                basePath ? this.loadTexture(basePath) : null,
                normalPath ? this.loadTexture(normalPath) : null,
                aoPath ? this.loadTexture(aoPath) : null
            ]);
            
            // Apply options to all textures
            const textures = [baseTexture, normalTexture, aoTexture].filter(t => t);
            textures.forEach(texture => {
                if (options.repeat) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(options.repeat.x, options.repeat.y);
                }
            });
            
            return {
                base: baseTexture,
                normal: normalTexture,
                ao: aoTexture
            };
        } catch (error) {
            console.error('Failed to load texture set:', error);
            return { base: null, normal: null, ao: null };
        }
    }
    
    async loadCourtTextures() {
        const paths = ASSET_PATHS.TEXTURES.FLOOR;
        
        const [courtTextures, outOfBoundsTextures] = await Promise.all([
            this.loadTextureSet(
                paths.COURT_BASE,
                paths.COURT_NORMAL,
                paths.COURT_AO,
                { repeat: { x: 8, y: 4 } }
            ),
            this.loadTextureSet(
                paths.OUT_OF_BOUNDS_BASE,
                paths.OUT_OF_BOUNDS_NORMAL,
                paths.OUT_OF_BOUNDS_AO,
                { repeat: { x: 8, y: 4 } }
            )
        ]);
        
        return { courtTextures, outOfBoundsTextures };
    }
    
    async loadBasketballTextures() {
        const paths = ASSET_PATHS.TEXTURES.BALL;
        
        return await this.loadTextureSet(
            paths.BASE,
            paths.NORMAL,
            paths.AO,
            { repeat: { x: 8, y: 4 } }
        );
    }
}