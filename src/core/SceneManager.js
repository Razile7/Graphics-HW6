// src/core/SceneManager.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GAME_CONFIG } from '../config/constants.js';

export class SceneManager {
    constructor(container) {
        this.container = container || document.body;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        this.init();
    }
    
    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(GAME_CONFIG.SCENE.BACKGROUND_COLOR);
        
        // Create camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(
            GAME_CONFIG.CAMERA.FOV,
            aspect,
            GAME_CONFIG.CAMERA.NEAR,
            GAME_CONFIG.CAMERA.FAR
        );
        
        // Set camera position
        const camPos = GAME_CONFIG.CAMERA.START_POSITION;
        this.camera.position.set(camPos.x, camPos.y, camPos.z);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = GAME_CONFIG.SCENE.SHADOW_ENABLED;
        this.container.appendChild(this.renderer.domElement);
        
        // Create orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enabled = true;
        
        // Add lights
        this.setupLights();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupLights() {
        // Ambient light
        const ambientConfig = GAME_CONFIG.LIGHTING.AMBIENT;
        const ambientLight = new THREE.AmbientLight(
            ambientConfig.COLOR,
            ambientConfig.INTENSITY
        );
        this.scene.add(ambientLight);
        
        // Directional light
        const dirConfig = GAME_CONFIG.LIGHTING.DIRECTIONAL;
        const directionalLight = new THREE.DirectionalLight(
            dirConfig.COLOR,
            dirConfig.INTENSITY
        );
        directionalLight.position.set(
            dirConfig.POSITION.x,
            dirConfig.POSITION.y,
            dirConfig.POSITION.z
        );
        directionalLight.castShadow = dirConfig.CAST_SHADOW;
        this.scene.add(directionalLight);
    }
    
    handleResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
    }
    
    toggleOrbitControls() {
        this.controls.enabled = !this.controls.enabled;
    }
    
    render() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
    
    destroy() {
        window.removeEventListener('resize', this.handleResize);
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}