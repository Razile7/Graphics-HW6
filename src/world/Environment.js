// src/world/Environment.js
import * as THREE from 'three';
import { GAME_CONFIG } from '../config/constants.js';

export class Environment {
    constructor(scene, scale = 1.5) {
        this.scene = scene;
        this.scale = scale;
        this.init();
    }
    
    init() {
        // Create projectors
        this.createProjectors();
        
        // Create benches
        this.createBenches();
        
        // Create stadium seating
        this.createStadiumSeating();
    }
    
    createProjectors() {
        const config = GAME_CONFIG.ENVIRONMENT.PROJECTOR;
        const hangHeight = config.HEIGHT;
        
        const projectorParams = [
            {
                pos: { x: 15, y: hangHeight, z: 0 },
                target: { x: -2, y: 0, z: 0 } // aim at right hoop
            },
            {
                pos: { x: -15, y: hangHeight, z: 0 },
                target: { x: 2, y: 0, z: 0 } // aim at left hoop
            }
        ];
        
        const housingGeo = new THREE.BoxGeometry(1.0, 0.5, 1.0);
        const housingMat = new THREE.MeshStandardMaterial({
            color: config.HOUSING_COLOR,
            metalness: 0.7,
            roughness: 0.2
        });
        
        projectorParams.forEach(p => {
            // Housing
            const projector = new THREE.Mesh(housingGeo, housingMat);
            projector.position.set(p.pos.x, p.pos.y, p.pos.z);
            projector.castShadow = true;
            this.scene.add(projector);
            
            // Lens
            const lensGeo = new THREE.CylinderGeometry(0.3, 0.25, 0.2, 32);
            const lensMat = new THREE.MeshPhongMaterial({
                color: 0x222222,
                shininess: 100
            });
            const lens = new THREE.Mesh(lensGeo, lensMat);
            lens.position.set(p.pos.x, p.pos.y - 0.35, p.pos.z);
            lens.rotation.z = Math.PI / 2;
            this.scene.add(lens);
            
            // SpotLight
            const spot = new THREE.SpotLight(
                0xffffff, 
                config.LIGHT_INTENSITY, 
                20, 
                Math.PI/6, 
                0.2, 
                1
            );
            spot.position.set(p.pos.x, p.pos.y, p.pos.z);
            spot.castShadow = true;
            
            // Create target object
            const targetObject = new THREE.Object3D();
            targetObject.position.set(p.target.x, p.target.y, p.target.z);
            this.scene.add(targetObject);
            
            // Point light at target
            spot.target = targetObject;
            this.scene.add(spot);
        });
    }
    
    createBenches() {
        const config = GAME_CONFIG.ENVIRONMENT.BENCH;
        const benchGroup = new THREE.Group();
        benchGroup.name = 'Benches';
        
        const length = config.LENGTH;
        const seatHeight = config.SEAT_HEIGHT;
        const depth = config.DEPTH;
        const legHeight = config.LEG_HEIGHT;
        const legRadius = 0.05;
        
        // Bench material
        const benchMat = new THREE.MeshPhongMaterial({ 
            color: config.COLOR, 
            shininess: 30 
        });
        
        const seatGeo = new THREE.BoxGeometry(length, seatHeight, depth);
        const legGeo = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 16);
        
        // Position benches on both sides
        const benchZOffset = 9 + depth/2 + 3;
        
        [1, -1].forEach(zSign => {
            // Create seat
            const seat = new THREE.Mesh(seatGeo, benchMat);
            seat.position.set(
                0,
                legHeight + seatHeight/2,
                zSign * benchZOffset
            );
            seat.castShadow = true;
            seat.receiveShadow = true;
            benchGroup.add(seat);
            
            // Create 4 legs at corners
            [1, -1].forEach(xSign => {
                [1, -1].forEach(zCorner => {
                    const leg = new THREE.Mesh(legGeo, benchMat);
                    leg.position.set(
                        xSign * (length/2 - legRadius*2),
                        legHeight/2,
                        zSign * benchZOffset + zCorner * (depth/2 - legRadius)
                    );
                    leg.castShadow = true;
                    leg.receiveShadow = true;
                    benchGroup.add(leg);
                });
            });
        });
        
        this.scene.add(benchGroup);
    }
    
    createStadiumSeating() {
        const config = GAME_CONFIG.ENVIRONMENT.SEATING;
        const seatingGroup = new THREE.Group();
        seatingGroup.name = 'StadiumSeating';
        
        const rows = config.ROWS;
        const seatWidth = config.SEAT_WIDTH;
        const seatDepth = config.SEAT_DEPTH;
        const seatHeight = 0.2;
        const rowHeightInc = 0.5;
        const rowDepthInc = 0.6;
        
        // Total width to cover
        const totalWidth = 36; // Out-of-bounds width
        const seatsPerRow = Math.floor(totalWidth / seatWidth);
        const startX = -totalWidth/2 + seatWidth/2;
        
        // Starting position beyond out-of-bounds
        const oobDepth = 9; // Half of 18-unit OOB depth
        const startOffsetZ = oobDepth + seatDepth/2 + 0.5 + 5;
        
        // Create seats on both sides
        [1, -1].forEach(side => {
            for (let row = 0; row < rows; row++) {
                const y = seatHeight/2 + row * rowHeightInc;
                const z = side * (startOffsetZ + row * rowDepthInc);
                
                for (let j = 0; j < seatsPerRow; j++) {
                    const x = startX + j * seatWidth;
                    
                    // Alternate seat colors for visual interest
                    const seatColor = (row + j) % 2 === 0 ? 0x555555 : 0x666666;
                    
                    const seatGeo = new THREE.BoxGeometry(
                        seatWidth, 
                        seatHeight, 
                        seatDepth
                    );
                    const seatMat = new THREE.MeshPhongMaterial({ 
                        color: seatColor, 
                        shininess: 10 
                    });
                    const seat = new THREE.Mesh(seatGeo, seatMat);
                    seat.position.set(x, y, z);
                    seat.castShadow = true;
                    seat.receiveShadow = true;
                    seatingGroup.add(seat);
                }
            }
        });
        
        this.scene.add(seatingGroup);
    }
}