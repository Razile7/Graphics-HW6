// src/config/constants.js
export const GAME_CONFIG = {
    // Scene settings
    SCENE: {
        BACKGROUND_COLOR: 0x000000,
        SHADOW_ENABLED: true
    },
    
    // Camera settings
    CAMERA: {
        FOV: 75,
        NEAR: 0.1,
        FAR: 1000,
        START_POSITION: { x: 0, y: 15, z: 30 }
    },
    
    // Lighting
    LIGHTING: {
        AMBIENT: {
            COLOR: 0xffffff,
            INTENSITY: 0.5
        },
        DIRECTIONAL: {
            COLOR: 0xffffff,
            INTENSITY: 0.8,
            POSITION: { x: 10, y: 20, z: 15 },
            CAST_SHADOW: true
        }
    },
    
    // Court dimensions 
    COURT: {
        SCALE: 1.5,  // Default scale 
        FLOOR_DIMENSIONS: { 
            LENGTH: 30,  // X-axis
            HEIGHT: 0.2,
            WIDTH: 15    // Z-axis
        },
        OUT_OF_BOUNDS_DIMENSIONS: {
            LENGTH: 36,
            HEIGHT: 0.1,
            WIDTH: 18
        },
        LINE_COLOR: 0xffffff,
        LINE_THICKNESS: 0.1,
        LINE_HEIGHT: 0.01,
        LINE_ELEVATION: 0.11
    },
    
    // Basketball properties
    BASKETBALL: {
        RADIUS: 0.5,
        SEGMENTS: { WIDTH: 32, HEIGHT: 16 },
        COLOR: 0xff6600,
        START_POSITION: { x: 0, y: 2, z: 0 },
        RING_COLOR: 0x000000,
        RING_OFFSET: 0.002,
        RING_HEIGHT: 0.02
    },
    
    // Basket/Hoop properties
    BASKET: {
        BASE: {
            DIMENSIONS: { WIDTH: 2, HEIGHT: 0.5, DEPTH: 2 },
            COLOR: 0xff0000,
            POSITION_X: 16.1  // Will be multiplied by scale
        },
        POLE: {
            RADIUS: 0.2,
            HEIGHT: 4.7,
            COLOR: 0xff0000,
            POSITION_Y: 2.5
        },
        RIM: {
            RADIUS: 0.7,
            TUBE_RADIUS: 0.1,
            COLOR: 0xff8f19,
            HEIGHT: 4
        },
        BOARD: {
            DIMENSIONS: { WIDTH: 0.05, HEIGHT: 3, DEPTH: 4 },
            COLOR: 0xa9a9a9,
            OPACITY: 0.40,
            POSITION_Y: 4.7
        },
        NET: {
            TOP_RADIUS: 0.7,
            BOTTOM_RADIUS: 0.5,
            HEIGHT: 1.2,
            COLOR: 0xffffff
        }
    },
    
    // Environment elements
    ENVIRONMENT: {
        PROJECTOR: {
            HEIGHT: 15,
            HOUSING_COLOR: 0x333333,
            LIGHT_INTENSITY: 4
        },
        BENCH: {
            LENGTH: 6,
            SEAT_HEIGHT: 0.1,
            DEPTH: 0.5,
            LEG_HEIGHT: 0.4,
            COLOR: 0x8B4513
        },
        SEATING: {
            ROWS: 6,
            SEAT_WIDTH: 0.5,
            SEAT_DEPTH: 0.5,
            COLOR: 0x555555
        },
        CHRISTMAS_LIGHTS: {
            COLORS: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff],
            BULB_RADIUS: 0.05,
            BULBS_PER_POLE: 20
        }
    }
};

// Texture repeat settings
export const TEXTURE_CONFIG = {
    COURT_FLOOR: {
        REPEAT: { x: 8, y: 4 }
    }
};

// Math utilities
export const MATH_UTILS = {
    DEGREES_TO_RADIANS: (degrees) => degrees * (Math.PI / 180)
};