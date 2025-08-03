// src/world/Baskets.js
import * as THREE from 'three';
import { GAME_CONFIG } from '../config/constants.js';

export class Baskets {
    constructor(parent, scale = 1.5) {
        this.parent = parent;
        this.scale = scale;
        this.hoops = [];
        this.init();
    }
    
    init() {
        // Create two baskets (left and right)
        this.createBasket(1);   // Right basket
        this.createBasket(-1);  // Left basket
    }
    
    createBasket(side) {
        const basketGroup = new THREE.Group();
        basketGroup.name = side > 0 ? 'RightBasket' : 'LeftBasket';
        
        // Create base
        this.createBase(basketGroup, side);
        
        // Create pole
        this.createPole(basketGroup, side);
        
        // Create connectors
        this.createConnectors(basketGroup, side);
        
        // Create backboard
        this.createBackboard(basketGroup, side);
        
        // Create rim
        const rimPosition = this.createRim(basketGroup, side);
        
        // Create net
        this.createNet(basketGroup, side, rimPosition);
        
        // Store hoop position for game logic
        this.hoops.push({
            position: new THREE.Vector3(
                rimPosition.x,
                GAME_CONFIG.BASKET.RIM.HEIGHT,
                0
            ),
            side: side > 0 ? 'right' : 'left'
        });
        
        this.parent.add(basketGroup);
    }
    
    createBase(group, side) {
        const config = GAME_CONFIG.BASKET.BASE;
        const geometry = new THREE.BoxGeometry(
            config.DIMENSIONS.WIDTH,
            config.DIMENSIONS.HEIGHT,
            config.DIMENSIONS.DEPTH
        );
        const material = new THREE.MeshPhongMaterial({
            color: config.COLOR,
            shininess: 100
        });
        
        const base = new THREE.Mesh(geometry, material);
        base.position.set(config.POSITION_X * this.scale * side, 0, 0);
        base.castShadow = true;
        base.receiveShadow = true;
        
        group.add(base);
    }
    
    createPole(group, side) {
        const config = GAME_CONFIG.BASKET.POLE;
        const geometry = new THREE.CylinderGeometry(
            config.RADIUS,
            config.RADIUS,
            config.HEIGHT,
            32
        );
        const material = new THREE.MeshPhongMaterial({
            color: config.COLOR,
            shininess: 100
        });
        
        const pole = new THREE.Mesh(geometry, material);
        pole.position.set(
            GAME_CONFIG.BASKET.BASE.POSITION_X * this.scale * side,
            config.POSITION_Y,
            0
        );
        pole.castShadow = true;
        
        // Add cushion padding
        this.addCushion(group, pole.position);
        
        // Add Christmas lights
        this.addChristmasLights(group, pole.position);
        
        group.add(pole);
    }
    
    createConnectors(group, side) {
        const connectorGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
        const connectorMaterial = new THREE.MeshPhongMaterial({
            color: GAME_CONFIG.BASKET.POLE.COLOR,
            shininess: 100
        });
        
        // Horizontal connector
        const horizontalConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        horizontalConnector.position.set(15.3 * this.scale * side, 4.7, 0);
        horizontalConnector.rotation.z = side > 0 ? Math.PI / 2 : -Math.PI / 2;
        
        // Diagonal support
        const diagonalConnector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        diagonalConnector.position.set(15.6 * this.scale * side, 4, 0);
        diagonalConnector.rotation.z = side > 0 ? Math.PI / 4 : -Math.PI / 4;
        
        group.add(horizontalConnector, diagonalConnector);
    }
    
    createBackboard(group, side) {
        const config = GAME_CONFIG.BASKET.BOARD;
        
        // Board connector
        const connectorGeometry = new THREE.BoxGeometry(0.3, 1, 1);
        const connectorMaterial = new THREE.MeshPhongMaterial({
            color: 0xff8f19,
            shininess: 100
        });
        const connector = new THREE.Mesh(connectorGeometry, connectorMaterial);
        connector.position.set(14.6 * this.scale * side, config.POSITION_Y, 0);
        
        // Backboard
        const boardGeometry = new THREE.BoxGeometry(
            config.DIMENSIONS.WIDTH,
            config.DIMENSIONS.HEIGHT,
            config.DIMENSIONS.DEPTH
        );
        const boardMaterial = new THREE.MeshPhongMaterial({
            color: config.COLOR,
            transparent: true,
            opacity: config.OPACITY
        });
        const board = new THREE.Mesh(boardGeometry, boardMaterial);
        board.position.set(14.5 * this.scale * side, config.POSITION_Y, 0);
        
        // Add board markings
        this.addBoardMarkings(group, side);
        
        // Add scoreboard
        this.addScoreboard(group, side);
        
        group.add(connector, board);
    }
    
    createRim(group, side) {
        const config = GAME_CONFIG.BASKET.RIM;
        const rimGeometry = new THREE.TorusGeometry(
            config.RADIUS,
            config.TUBE_RADIUS,
            16,
            100
        );
        const rimMaterial = new THREE.MeshPhongMaterial({
            color: config.COLOR,
            shininess: 100
        });
        
        const rim = new THREE.Mesh(rimGeometry, rimMaterial);
        const rimX = 13.8 * this.scale * side;
        rim.position.set(rimX, config.HEIGHT, 0);
        rim.rotation.x = Math.PI / 2;
        
        // Rim supports
        this.addRimSupports(group, side);
        
        group.add(rim);
        
        return { x: rimX, y: config.HEIGHT };
    }
    
    createNet(group, side, rimPosition) {
        const config = GAME_CONFIG.BASKET.NET;
        const netGeometry = new THREE.CylinderGeometry(
            config.TOP_RADIUS,
            config.BOTTOM_RADIUS,
            config.HEIGHT,
            32,
            1,
            true
        );
        const netMaterial = new THREE.MeshBasicMaterial({
            color: config.COLOR,
            wireframe: true
        });
        
        const net = new THREE.Mesh(netGeometry, netMaterial);
        net.position.set(rimPosition.x, 3.3, 0);
        
        group.add(net);
    }
    
    addBoardMarkings(group, side) {
        const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const scale = this.scale;
        
        // Small rectangle markings
        const smallParallelGeom = new THREE.BoxGeometry(0.02, 0.03, 1.1);
        const smallPerpGeom = new THREE.BoxGeometry(0.02, 1.1, 0.03);
        
        // Create small rectangle
        const positions = [
            { y: 5.2, z: 0 },
            { y: 4.2, z: 0 },
            { y: 4.7, z: 0.4 * scale },
            { y: 4.7, z: -0.4 * scale }
        ];
        
        positions.forEach((pos, index) => {
            const geom = index < 2 ? smallParallelGeom : smallPerpGeom;
            const marking = new THREE.Mesh(geom, markingMaterial);
            marking.position.set(14.5 * scale * side, pos.y, pos.z);
            group.add(marking);
        });
        
        // Large rectangle markings
        const bigParallelGeom = new THREE.BoxGeometry(0.02, 0.03, 4.1);
        const bigPerpGeom = new THREE.BoxGeometry(0.02, 3.1, 0.03);
        
        const bigPositions = [
            { y: 6.2, z: 0 },
            { y: 3.2, z: 0 },
            { y: 4.7, z: 2 },
            { y: 4.7, z: -2 }
        ];
        
        bigPositions.forEach((pos, index) => {
            const geom = index < 2 ? bigParallelGeom : bigPerpGeom;
            const marking = new THREE.Mesh(geom, markingMaterial);
            marking.position.set(14.5 * scale * side, pos.y, pos.z);
            group.add(marking);
        });
    }
    
    addRimSupports(group, side) {
        const supportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 32);
        const supportMaterial = new THREE.MeshBasicMaterial({
            color: 0xff8f19,
            shininess: 100
        });
        
        // Rim to board connector
        const connectorGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.8);
        const connector = new THREE.Mesh(connectorGeometry, supportMaterial);
        connector.position.set(14.5 * this.scale * side, 3.8, 0);
        
        // Support beams
        const support1 = new THREE.Mesh(supportGeometry, supportMaterial);
        support1.position.set(14.3 * this.scale * side, 3.7, 0.5);
        support1.rotation.z = side > 0 ? Math.PI / 3 : -Math.PI / 3;
        support1.rotation.y = side > 0 ? Math.PI / 8 : -Math.PI / 8;
        
        const support2 = new THREE.Mesh(supportGeometry, supportMaterial);
        support2.position.set(14.3 * this.scale * side, 3.7, -0.5);
        support2.rotation.z = side > 0 ? Math.PI / 3 : -Math.PI / 3;
        support2.rotation.y = side > 0 ? -Math.PI / 8 : Math.PI / 8;
        
        group.add(connector, support1, support2);
    }
    
    addCushion(group, polePosition) {
        const cushionMaterial = new THREE.MeshPhongMaterial({
            color: 0x1565c0,
            shininess: 10
        });
        const cushionHeight = 1.2;
        const cushionOffsetY = 1.0;
        const cushionGeometry = new THREE.CylinderGeometry(0.4, 0.4, cushionHeight, 16);
        
        const cushion = new THREE.Mesh(cushionGeometry, cushionMaterial);
        cushion.position.set(
            polePosition.x,
            cushionOffsetY + cushionHeight/2,
            polePosition.z
        );
        cushion.castShadow = true;
        cushion.receiveShadow = true;
        
        group.add(cushion);
    }
    
    addChristmasLights(group, polePosition) {
        const config = GAME_CONFIG.ENVIRONMENT.CHRISTMAS_LIGHTS;
        const bulbGeometry = new THREE.SphereGeometry(config.BULB_RADIUS, 8, 8);
        const bulbRadius = 0.5;
        const bulbHeight = 2.4;
        
        for (let i = 0; i < config.BULBS_PER_POLE; i++) {
            const angle = (i / config.BULBS_PER_POLE) * Math.PI * 2;
            const x = polePosition.x + bulbRadius * Math.cos(angle);
            const y = bulbHeight;
            const z = bulbRadius * Math.sin(angle);
            
            const color = config.COLORS[i % config.COLORS.length];
            const bulbMaterial = new THREE.MeshBasicMaterial({
                color: color,
                emissive: color,
                emissiveIntensity: 1
            });
            
            const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
            bulb.position.set(x, y, z);
            group.add(bulb);
            
            // Add glow
            const glow = new THREE.PointLight(color, 0.3, 2);
            glow.position.copy(bulb.position);
            group.add(glow);
        }
    }
    
    addScoreboard(group, side) {
        // Create canvas for scoreboard
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = 'red';
        ctx.font = 'bold 48px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('00 : 00', 128, 32);
        
        const boardTexture = new THREE.CanvasTexture(canvas);
        boardTexture.minFilter = THREE.LinearFilter;
        boardTexture.needsUpdate = true;
        
        const scoreGeometry = new THREE.PlaneGeometry(2.0, 0.6);
        const scoreMaterial = new THREE.MeshBasicMaterial({
            map: boardTexture,
            side: THREE.DoubleSide
        });
        
        const scoreboard = new THREE.Mesh(scoreGeometry, scoreMaterial);
        scoreboard.position.set(14.3 * this.scale * side, 6.5, 0);
        scoreboard.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
        
        group.add(scoreboard);
    }
    
    getHoops() {
        return this.hoops;
    }
}