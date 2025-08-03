// src/world/CourtLines.js
import * as THREE from 'three';
import { GAME_CONFIG } from '../config/constants.js';

export class CourtLines {
    constructor(parent, scale = 1.5) {
        this.parent = parent;
        this.scale = scale;
        this.init();
    }
    
    init() {
        const config = GAME_CONFIG.COURT;
        const lineColor = config.LINE_COLOR;
        const lineMaterial = new THREE.MeshBasicMaterial({ color: lineColor });
        const arcMaterial = new THREE.MeshBasicMaterial({ 
            color: lineColor, 
            side: THREE.DoubleSide 
        });
        
        // Court dimensions
        const courtLength = 30 * this.scale;
        const courtWidth = 15 * this.scale;
        const lineThickness = config.LINE_THICKNESS * this.scale;
        const lineHeight = config.LINE_HEIGHT * this.scale;
        const lineElevation = config.LINE_ELEVATION * this.scale;
        
        // Create boundary lines
        this.createBoundaryLines(courtLength, courtWidth, lineThickness, lineHeight, lineElevation, lineMaterial);
        
        // Create center line and circle
        this.createCenterElements(courtLength, courtWidth, lineThickness, lineHeight, lineElevation, lineMaterial, arcMaterial);
        
        // Create key/paint areas
        this.createKeyAreas(courtLength, courtWidth, lineThickness, lineHeight, lineElevation, lineMaterial);
        
        // Create free throw circles
        this.createFreeThrowCircles(courtLength, lineElevation, arcMaterial);
        
        // Create three-point lines
        this.createThreePointLines(courtLength, lineThickness, lineHeight, lineElevation, lineMaterial, arcMaterial);
    }
    
    createBoundaryLines(courtLength, courtWidth, lineThickness, lineHeight, lineElevation, lineMaterial) {
        // Sidelines (running along X-axis)
        const sidelineGeom = new THREE.BoxGeometry(courtLength, lineHeight, lineThickness);
        const topSideline = new THREE.Mesh(sidelineGeom, lineMaterial);
        const bottomSideline = new THREE.Mesh(sidelineGeom, lineMaterial);
        topSideline.position.set(0, lineElevation, courtWidth/2);
        bottomSideline.position.set(0, lineElevation, -courtWidth/2);
        
        // Baselines (running along Z-axis)
        const baselineGeom = new THREE.BoxGeometry(lineThickness, lineHeight, courtWidth);
        const leftBaseline = new THREE.Mesh(baselineGeom, lineMaterial);
        const rightBaseline = new THREE.Mesh(baselineGeom, lineMaterial);
        leftBaseline.position.set(-courtLength/2, lineElevation, 0);
        rightBaseline.position.set(courtLength/2, lineElevation, 0);
        
        this.parent.add(topSideline, bottomSideline, leftBaseline, rightBaseline);
    }
    
    createCenterElements(courtLength, courtWidth, lineThickness, lineHeight, lineElevation, lineMaterial, arcMaterial) {
        // Center line
        const centerLine = new THREE.Mesh(
            new THREE.BoxGeometry(lineThickness, lineHeight, courtWidth), 
            lineMaterial
        );
        centerLine.position.set(0, lineElevation, 0);
        
        // Center circle
        const centerCircleRadius = 1.8 * this.scale;
        const centerCircle = new THREE.Mesh(
            new THREE.RingGeometry(
                centerCircleRadius - lineThickness/2,
                centerCircleRadius + lineThickness/2, 
                64
            ),
            arcMaterial
        );
        centerCircle.rotation.x = -Math.PI / 2;
        centerCircle.position.set(0, lineElevation + 0.01 * this.scale, 0);
        
        this.parent.add(centerLine, centerCircle);
    }
    
    createKeyAreas(courtLength, courtWidth, lineThickness, lineHeight, lineElevation, lineMaterial) {
        const keyWidth = 3.6 * this.scale;
        const keyLength = 5.8 * this.scale;
        
        // Left key
        const leftKeyEnd = new THREE.Mesh(
            new THREE.BoxGeometry(lineThickness, lineHeight, keyWidth), 
            lineMaterial
        );
        leftKeyEnd.position.set(-courtLength/2 + keyLength, lineElevation, 0);
        
        const leftKeyTop = new THREE.Mesh(
            new THREE.BoxGeometry(keyLength, lineHeight, lineThickness), 
            lineMaterial
        );
        leftKeyTop.position.set(-courtLength/2 + keyLength/2, lineElevation, keyWidth/2);
        
        const leftKeyBottom = new THREE.Mesh(
            new THREE.BoxGeometry(keyLength, lineHeight, lineThickness), 
            lineMaterial
        );
        leftKeyBottom.position.set(-courtLength/2 + keyLength/2, lineElevation, -keyWidth/2);
        
        // Right key (mirror of left)
        const rightKeyEnd = new THREE.Mesh(
            new THREE.BoxGeometry(lineThickness, lineHeight, keyWidth), 
            lineMaterial
        );
        rightKeyEnd.position.set(courtLength/2 - keyLength, lineElevation, 0);
        
        const rightKeyTop = new THREE.Mesh(
            new THREE.BoxGeometry(keyLength, lineHeight, lineThickness), 
            lineMaterial
        );
        rightKeyTop.position.set(courtLength/2 - keyLength/2, lineElevation, keyWidth/2);
        
        const rightKeyBottom = new THREE.Mesh(
            new THREE.BoxGeometry(keyLength, lineHeight, lineThickness), 
            lineMaterial
        );
        rightKeyBottom.position.set(courtLength/2 - keyLength/2, lineElevation, -keyWidth/2);
        
        this.parent.add(leftKeyEnd, leftKeyTop, leftKeyBottom);
        this.parent.add(rightKeyEnd, rightKeyTop, rightKeyBottom);
    }
    
    createFreeThrowCircles(courtLength, lineElevation, arcMaterial) {
        const keyLength = 5.8 * this.scale;
        const ftRadius = 1.8 * this.scale;
        const lineThickness = GAME_CONFIG.COURT.LINE_THICKNESS * this.scale;
        
        // Left free throw circle
        const leftFTCircle = new THREE.Mesh(
            new THREE.RingGeometry(
                ftRadius - lineThickness/2, 
                ftRadius + lineThickness/2, 
                64
            ),
            arcMaterial
        );
        leftFTCircle.rotation.x = -Math.PI / 2;
        leftFTCircle.position.set(-courtLength/2 + keyLength, lineElevation + 0.01 * this.scale, 0);
        
        // Right free throw circle
        const rightFTCircle = new THREE.Mesh(
            new THREE.RingGeometry(
                ftRadius - lineThickness/2, 
                ftRadius + lineThickness/2, 
                64
            ),
            arcMaterial
        );
        rightFTCircle.rotation.x = -Math.PI / 2;
        rightFTCircle.position.set(courtLength/2 - keyLength, lineElevation + 0.01 * this.scale, 0);
        
        // Add key semicircles
        const keyCircleRadius = 1.8 * this.scale;
        
        const leftKeyCircle = new THREE.Mesh(
            new THREE.RingGeometry(
                keyCircleRadius - lineThickness/2,
                keyCircleRadius + lineThickness/2, 
                64, 1, -Math.PI/2, Math.PI
            ),
            arcMaterial
        );
        leftKeyCircle.rotation.x = -Math.PI / 2;
        leftKeyCircle.position.set(-courtLength/2 + keyLength, lineElevation + 0.01 * this.scale, 0);
        
        const rightKeyCircle = new THREE.Mesh(
            new THREE.RingGeometry(
                keyCircleRadius - lineThickness/2,
                keyCircleRadius + lineThickness/2, 
                64, 1, Math.PI/2, Math.PI
            ),
            arcMaterial
        );
        rightKeyCircle.rotation.x = -Math.PI / 2;
        rightKeyCircle.position.set(courtLength/2 - keyLength, lineElevation + 0.01 * this.scale, 0);
        
        this.parent.add(leftFTCircle, rightFTCircle, leftKeyCircle, rightKeyCircle);
    }
    
    createThreePointLines(courtLength, lineThickness, lineHeight, lineElevation, lineMaterial, arcMaterial) {
        const tpRadius = 5.7 * this.scale;
        
        // Three-point arcs
        const leftTPArc = new THREE.Mesh(
            new THREE.RingGeometry(
                tpRadius - lineThickness/2, 
                tpRadius + lineThickness/2, 
                64, 1, -Math.PI/2 + 0.25, Math.PI - 0.5
            ),
            arcMaterial
        );
        leftTPArc.rotation.x = -Math.PI / 2;
        leftTPArc.position.set(-courtLength/2 + 4, lineElevation + 0.01 * this.scale, 0);
        
        const rightTPArc = new THREE.Mesh(
            new THREE.RingGeometry(
                tpRadius - lineThickness/2, 
                tpRadius + lineThickness/2, 
                64, 1, Math.PI/2 + 0.25, Math.PI - 0.5
            ),
            arcMaterial
        );
        rightTPArc.rotation.x = -Math.PI / 2;
        rightTPArc.position.set(courtLength/2 - 4, lineElevation + 0.01 * this.scale, 0);
        
        // Three-point straight sections
        const tpStraightLength = 4.2 * this.scale;
        const tpStraightDistance = 3.0 * this.scale;
        
        // Left three-point lines
        const leftTPTop = new THREE.Mesh(
            new THREE.BoxGeometry(tpStraightLength - 0.15, lineHeight, lineThickness), 
            lineMaterial
        );
        leftTPTop.position.set(-courtLength/2 + tpStraightLength/2, lineElevation, tpStraightDistance + 3.76);
        
        const leftTPBottom = new THREE.Mesh(
            new THREE.BoxGeometry(tpStraightLength - 0.15, lineHeight, lineThickness), 
            lineMaterial
        );
        leftTPBottom.position.set(-courtLength/2 + tpStraightLength/2, lineElevation, -tpStraightDistance - 3.76);
        
        // Right three-point lines
        const rightTPTop = new THREE.Mesh(
            new THREE.BoxGeometry(tpStraightLength - 0.15, lineHeight, lineThickness), 
            lineMaterial
        );
        rightTPTop.position.set(courtLength/2 - tpStraightLength/2, lineElevation, tpStraightDistance + 3.76);
        
        const rightTPBottom = new THREE.Mesh(
            new THREE.BoxGeometry(tpStraightLength - 0.15, lineHeight, lineThickness), 
            lineMaterial
        );
        rightTPBottom.position.set(courtLength/2 - tpStraightLength/2, lineElevation, -tpStraightDistance - 3.76);
        
        this.parent.add(leftTPArc, rightTPArc);
        this.parent.add(leftTPTop, leftTPBottom, rightTPTop, rightTPBottom);
    }
}