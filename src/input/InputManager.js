// src/input/InputManager.js
import { EventEmitter } from '../utils/EventEmitter.js';

export class InputManager extends EventEmitter {
    constructor() {
        super();
        this.keys = {};
        
        // Bind methods
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        
        this.init();
    }
    
    init() {
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown);
        document.addEventListener('keyup', this.handleKeyUp);
    }
    
    handleKeyDown(e) {
        // Prevent key repeat
        if (this.keys[e.key]) return;
        
        this.keys[e.key] = true;
        
        // Emit specific events based on key
        switch(e.key) {
            case ' ':
                this.emit('shoot');
                e.preventDefault();
                break;
            case 'r':
            case 'R':
                this.emit('reset');
                break;
            case 'o':
            case 'O':
                this.emit('toggleCamera');
                break;
            case 'w':
            case 'W':
                this.emit('powerUp');
                break;
            case 's':
            case 'S':
                this.emit('powerDown');
                break;
        }
    }
    
    handleKeyUp(e) {
        this.keys[e.key] = false;
    }
    
    update() {
        // Check for continuous movement
        const movement = { x: 0, z: 0 };
        
        if (this.keys['ArrowLeft']) movement.x -= 1;
        if (this.keys['ArrowRight']) movement.x += 1;
        if (this.keys['ArrowUp']) movement.z -= 1;
        if (this.keys['ArrowDown']) movement.z += 1;
        
        if (movement.x !== 0 || movement.z !== 0) {
            this.emit('move', movement);
        }
    }
    
    destroy() {
        document.removeEventListener('keydown', this.handleKeyDown);
        document.removeEventListener('keyup', this.handleKeyUp);
    }
}