import {OrbitControls} from '../lib/OrbitControls.js'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// Set background color
scene.background = new THREE.Color(0x000000);

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Enable shadows
renderer.shadowMap.enabled = true;
directionalLight.castShadow = true;

function degrees_to_radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

// Create basketball court
function createBasketballCourt(scale = 1) {
  const textureLoader = new THREE.TextureLoader();
  const baseColorMap = textureLoader.load('src/textures/floor2/ParquetFlooring02_4K_BaseColor.png');
  const normalMap = textureLoader.load('src/textures/floor2/ParquetFlooring02_4K_Normal.png');
  const aoMap = textureLoader.load('src/textures/floor2/ParquetFlooring02_4K_AO.png');

  // Set texture tiling and wrapping
  [baseColorMap, normalMap, aoMap].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 4);
  });

  // Create material for the court floor
  const courtMaterial = new THREE.MeshPhongMaterial({
    map: baseColorMap,
    normalMap: normalMap,
    aoMap: aoMap,
    shininess: 50,
  });

  const courtGroup = new THREE.Group()
  // Court floor - just a simple brown surface
  const courtGeometry = new THREE.BoxGeometry(30 * scale, 0.2, 15 * scale);
  // const courtMaterial = new THREE.MeshPhongMaterial({ 
  //   color: 0xc68642,  // Brown wood color
  //   shininess: 50
  // });
  const court = new THREE.Mesh(courtGeometry, courtMaterial);
  court.receiveShadow = true;
  scene.add(court);

  // Load parquet texture maps
  const outOfBoundstextureLoader = new THREE.TextureLoader();
  const outOfBoundsbaseColorMap = outOfBoundstextureLoader.load('src/textures/floor2/ParquetFlooring07_4K_BaseColor.png');
  const outOfBoundsnormalMap = outOfBoundstextureLoader.load('src/textures/floor2/ParquetFlooring07_4K_Normal.png');
  const outOfBoundsaoMap = outOfBoundstextureLoader.load('src/textures/floor2/ParquetFlooring07_4K_AO.png');

  // Set texture wrapping and tiling
  [outOfBoundsbaseColorMap, outOfBoundsnormalMap, outOfBoundsaoMap].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 4); // You can increase for more tiling in out-of-bounds
  });

  // === Out-of-bounds court ===
  const outOfBoundsCourtPartGeometry = new THREE.BoxGeometry(36 * scale, 0.1, 18 * scale);
  const outOfBoundsCourtPartMaterial = new THREE.MeshPhongMaterial({
    map: outOfBoundsbaseColorMap,
    normalMap: outOfBoundsnormalMap,
    aoMap: outOfBoundsaoMap,
    shininess: 50
  });
  const outOfBoundsCourt = new THREE.Mesh(outOfBoundsCourtPartGeometry, outOfBoundsCourtPartMaterial);
  outOfBoundsCourt.receiveShadow = true;
  scene.add(outOfBoundsCourt);
  // //will add white lines to indicate the end of the real court and the out of bounds area 
  // //the 2 shorter lines
  // const outOfBoundsLengthLineGeometry = new THREE.BoxGeometry(0.2 * scale, 0.01, 15 * scale);
  // const outOfBoundsLengthLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  // const outOfBoundsLineOne = new THREE.Mesh(outOfBoundsLengthLineGeometry, outOfBoundsLengthLineMaterial);
  // outOfBoundsLineOne.position.set(15 * scale, 0.1 * scale, 0);
  // const outOfBoundsLineTwo = new THREE.Mesh(outOfBoundsLengthLineGeometry, outOfBoundsLengthLineMaterial);
  // outOfBoundsLineTwo.position.set(-15 * scale, 0.1 * scale, 0);

  // //the 2 longer lines
  // const outOfBoundsWidthLineGeometry = new THREE.BoxGeometry(30 * scale, 0.01, 0.2 * scale);
  // const outOfBoundsWidthLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  // const outOfBoundsLineThree = new THREE.Mesh(outOfBoundsWidthLineGeometry, outOfBoundsWidthLineMaterial);
  // outOfBoundsLineThree.position.set(0, 0.1, 7.5 * scale);
  // const outOfBoundsLineFour = new THREE.Mesh(outOfBoundsWidthLineGeometry, outOfBoundsWidthLineMaterial);
  // outOfBoundsLineFour.position.set(0, 0.1, -7.5 * scale);

  // courtGroup.add(outOfBoundsLineOne);
  // courtGroup.add(outOfBoundsLineTwo);
  // courtGroup.add(outOfBoundsLineThree);
  // courtGroup.add(outOfBoundsLineFour);

  // scene.add(courtGroup)

  // Note: All court lines, hoops, and other elements have been removed
  // Students will need to implement these features
  createCourtLines()
  createBasketball()
  createBaskets(1.5)
  createProjectors();
  createBenches();
  createStadiumSeating();
}

function createProjectors() {
  const hangHeight = 15;
  const projectorParams = [
    {
      pos:    { x:  15, y: hangHeight, z: 0 },
      target: { x:  -2, y: 0,          z: 0 }   // aim at right hoop
    },
    {
      pos:    { x: -15, y: hangHeight, z: 0 },
      target: { x: 2, y: 0,          z: 0 }   // aim at left hoop
    }
  ];

  const housingGeo = new THREE.BoxGeometry(1.0, 0.5, 1.0);
  const housingMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    metalness: 0.7,
    roughness: 0.2
  });

  projectorParams.forEach(p => {
    // 1) Housing
    const projector = new THREE.Mesh(housingGeo, housingMat);
    projector.position.set(p.pos.x, p.pos.y, p.pos.z);
    scene.add(projector);

    // 2) Lens (optional)
    //    … your lens code here …

    // 3) SpotLight
    const spot = new THREE.SpotLight(0xffffff, 4, 20, Math.PI/6, 0.2, 1);
    spot.position.set(p.pos.x, p.pos.y, p.pos.z);
    spot.castShadow = true;

    // 4) Create a dedicated target object and position it
    const targetObject = new THREE.Object3D();
    targetObject.position.set(p.target.x, p.target.y, p.target.z);
    scene.add(targetObject);

    // 5) Tell the light to use that target
    spot.target = targetObject;
    scene.add(spot);
  });
}

function createBenches() {
  const benchGroup = new THREE.Group();
  const length     = 6;     // bench length (along X)
  const seatHeight = 0.1;   // bench seat thickness
  const depth      = 0.5;   // bench depth (along Z)
  const legHeight  = 0.4;   // height of legs
  const legRadius  = 0.05;  // leg radius

  // shared material for wood look
  const benchMat = new THREE.MeshPhongMaterial({ color: 0x8B4513, shininess: 30 });
  const seatGeo  = new THREE.BoxGeometry(length, seatHeight, depth);
  const legGeo   = new THREE.CylinderGeometry(legRadius, legRadius, legHeight, 16);

  // How far out on Z to place benches (9 = half court + half OOB depth)
  const benchZOffset = 9 + depth/2 +3;

  [1, -1].forEach(zSign => {
    // create seat
    const seat = new THREE.Mesh(seatGeo, benchMat);
    seat.position.set(
      0,
      legHeight + seatHeight/2,
      zSign * benchZOffset
    );
    seat.castShadow = seat.receiveShadow = true;
    benchGroup.add(seat);

    // create 4 legs at the corners
    [1, -1].forEach(xSign => {
      [1, -1].forEach(zCorner => {
        const leg = new THREE.Mesh(legGeo, benchMat);
        leg.position.set(
          xSign * (length/2 - legRadius*2),
          legHeight/2,
          zSign * benchZOffset + zCorner * (depth/2 - legRadius)
        );
        leg.castShadow = leg.receiveShadow = true;
        benchGroup.add(leg);
      });
    });
  });

  scene.add(benchGroup);
}

function createStadiumSeating() {
  const seatingGroup    = new THREE.Group();
  const rows            = 6;
  const seatWidth       = 0.5;
  const seatDepth       = 0.5;
  const seatHeight      = 0.2;
  const rowHeightInc    = 0.5;
  const rowDepthInc     = 0.6;

  // 1) Total X-span of your benches (court plus out-of-bounds)
  const totalWidth      = 36;                     // e.g. your out-of-bounds area is 36 units across
  const seatsPerRow     = Math.floor(totalWidth / seatWidth);
  // 2) Starting X so that seats cover [–totalWidth/2 … +totalWidth/2]
  const startX          = -totalWidth/2 + seatWidth/2;

  // 3) Z-offset just beyond OOB
  const oobDepth        = 9;                       // half of your 18-unit OOB depth
  const startOffsetZ    = oobDepth + seatDepth/2 + 0.5 + 5;

  [1, -1].forEach(side => {
    for (let row = 0; row < rows; row++) {
      const y = seatHeight/2 + row * rowHeightInc;
      const z = side * (startOffsetZ + row * rowDepthInc);

      for (let j = 0; j < seatsPerRow; j++) {
        const x = startX + j * seatWidth;
        const seatGeo = new THREE.BoxGeometry(seatWidth, seatHeight, seatDepth);
        const seatMat = new THREE.MeshPhongMaterial({ color: 0x555555, shininess: 10 });
        const seat    = new THREE.Mesh(seatGeo, seatMat);
        seat.position.set(x, y, z);
        seat.castShadow = seat.receiveShadow = true;
        seatingGroup.add(seat);
      }
    }
  });

  scene.add(seatingGroup);
}

function createCourtLines(scale = 1.5) {
  const lineColor = 0xffffff;
  const lineMaterial = new THREE.MeshBasicMaterial({ color: lineColor });
  const arcMaterial = new THREE.MeshBasicMaterial({ color: lineColor, side: THREE.DoubleSide });

  // Court dimensions matching your createBasketballCourt function
  const courtLength = 30 * scale; // X-axis (length)
  const courtWidth = 15 * scale;  // Z-axis (width)
  const lineThickness = 0.1 * scale;
  const lineHeight = 0.01 * scale;
  const lineElevation = 0.11 * scale;
  
  // === Court Boundary ===
  // Sidelines (running along X-axis - the longer sides)
  const sidelineGeom = new THREE.BoxGeometry(courtLength, lineHeight, lineThickness);
  const topSideline = new THREE.Mesh(sidelineGeom, lineMaterial);
  const bottomSideline = new THREE.Mesh(sidelineGeom, lineMaterial);
  topSideline.position.set(0, lineElevation, courtWidth/2);
  bottomSideline.position.set(0, lineElevation, -courtWidth/2);
  
  // Baselines (running along Z-axis - the shorter ends)
  const baselineGeom = new THREE.BoxGeometry(lineThickness, lineHeight, courtWidth);
  const leftBaseline = new THREE.Mesh(baselineGeom, lineMaterial);
  const rightBaseline = new THREE.Mesh(baselineGeom, lineMaterial);
  leftBaseline.position.set(-courtLength/2, lineElevation, 0);
  rightBaseline.position.set(courtLength/2, lineElevation, 0);
  
  scene.add(topSideline, bottomSideline, leftBaseline, rightBaseline);

  // === Center Line & Circle ===
  const centerLine = new THREE.Mesh(new THREE.BoxGeometry(lineThickness, lineHeight, courtWidth), lineMaterial);
  centerLine.position.set(0, lineElevation, 0);
  
  const centerCircleRadius = 1.8 * scale;
  const centerCircle = new THREE.Mesh(
    new THREE.RingGeometry(centerCircleRadius - lineThickness/2, centerCircleRadius + lineThickness/2, 64), 
    arcMaterial
  );
  centerCircle.rotation.x = -Math.PI / 2;
  centerCircle.position.set(0, lineElevation + 0.01 * scale, 0);
  
  scene.add(centerLine, centerCircle);

  // === Key/Paint Areas (both sides) ===
  const keyWidth = 3.6 * scale;   // Z-axis width
  const keyLength = 5.8 * scale;  // X-axis length
  
  // Left key (negative X)
  const leftKeyEnd = new THREE.Mesh(new THREE.BoxGeometry(lineThickness, lineHeight, keyWidth), lineMaterial);
  leftKeyEnd.position.set(-courtLength/2 + keyLength, lineElevation, 0);
  
  const leftKeyTop = new THREE.Mesh(new THREE.BoxGeometry(keyLength, lineHeight, lineThickness), lineMaterial);
  leftKeyTop.position.set(-courtLength/2 + keyLength/2, lineElevation, keyWidth/2);
  
  const leftKeyBottom = new THREE.Mesh(new THREE.BoxGeometry(keyLength, lineHeight, lineThickness), lineMaterial);
  leftKeyBottom.position.set(-courtLength/2 + keyLength/2, lineElevation, -keyWidth/2);
  
  // Right key (positive X)
  const rightKeyEnd = new THREE.Mesh(new THREE.BoxGeometry(lineThickness, lineHeight, keyWidth), lineMaterial);
  rightKeyEnd.position.set(courtLength/2 - keyLength, lineElevation, 0);
  
  const rightKeyTop = new THREE.Mesh(new THREE.BoxGeometry(keyLength, lineHeight, lineThickness), lineMaterial);
  rightKeyTop.position.set(courtLength/2 - keyLength/2, lineElevation, keyWidth/2);
  
  const rightKeyBottom = new THREE.Mesh(new THREE.BoxGeometry(keyLength, lineHeight, lineThickness), lineMaterial);
  rightKeyBottom.position.set(courtLength/2 - keyLength/2, lineElevation, -keyWidth/2);
  
  scene.add(leftKeyEnd, leftKeyTop, leftKeyBottom);
  scene.add(rightKeyEnd, rightKeyTop, rightKeyBottom);

  // === Free Throw Circles ===
  const ftRadius = 1.8 * scale;
  const leftFTCircle = new THREE.Mesh(
    new THREE.RingGeometry(ftRadius - lineThickness/2, ftRadius + lineThickness/2, 64), 
    arcMaterial
  );
  leftFTCircle.rotation.x = -Math.PI / 2;
  leftFTCircle.position.set(-courtLength/2 + keyLength, lineElevation + 0.01 * scale, 0);
  
  const rightFTCircle = new THREE.Mesh(
    new THREE.RingGeometry(ftRadius - lineThickness/2, ftRadius + lineThickness/2, 64), 
    arcMaterial
  );
  rightFTCircle.rotation.x = -Math.PI / 2;
  rightFTCircle.position.set(courtLength/2 - keyLength, lineElevation + 0.01 * scale, 0);
  
  scene.add(leftFTCircle, rightFTCircle);

  // === Three-Point Arcs ===
  const tpRadius = 5.7 * scale;
  
  // Left three-point arc (semicircle facing right)
  const leftTPArc = new THREE.Mesh(
    new THREE.RingGeometry(tpRadius - lineThickness/2, tpRadius + lineThickness/2, 64, 1, -Math.PI/2 + 0.25, Math.PI - 0.5), 
    arcMaterial
  );
  leftTPArc.rotation.x = -Math.PI / 2;
  leftTPArc.position.set(-courtLength/2 + 4, lineElevation + 0.01 * scale, 0);
  
  // Right three-point arc (semicircle facing left)
  const rightTPArc = new THREE.Mesh(
    new THREE.RingGeometry(tpRadius - lineThickness/2, tpRadius + lineThickness/2, 64, 1, Math.PI/2 + 0.25, Math.PI - 0.5), 
    arcMaterial
  );
  rightTPArc.rotation.x = -Math.PI / 2;
  rightTPArc.position.set(courtLength/2 - 4 , lineElevation + 0.01 * scale, 0);
  
  scene.add(leftTPArc, rightTPArc);

  // === Three-Point Straight Sections ===
  const tpStraightLength = 4.2 * scale;
  const tpStraightDistance = 3.0 * scale; // distance from center to straight line
  
  // Left three-point straight lines
  const leftTPTop = new THREE.Mesh(new THREE.BoxGeometry(tpStraightLength - 0.15, lineHeight, lineThickness), lineMaterial);
  leftTPTop.position.set(-courtLength/2 + tpStraightLength/2, lineElevation, tpStraightDistance + 3.76);
  
  const leftTPBottom = new THREE.Mesh(new THREE.BoxGeometry(tpStraightLength - 0.15, lineHeight, lineThickness), lineMaterial);
  leftTPBottom.position.set(-courtLength/2 + tpStraightLength/2, lineElevation, -tpStraightDistance - 3.76);
  
  // Right three-point straight lines
  const rightTPTop = new THREE.Mesh(new THREE.BoxGeometry(tpStraightLength - 0.15, lineHeight, lineThickness), lineMaterial);
  rightTPTop.position.set(courtLength/2 - tpStraightLength/2, lineElevation, tpStraightDistance + 3.76);
  
  const rightTPBottom = new THREE.Mesh(new THREE.BoxGeometry(tpStraightLength - 0.15, lineHeight, lineThickness), lineMaterial);
  rightTPBottom.position.set(courtLength/2 - tpStraightLength/2, lineElevation, -tpStraightDistance - 3.76);
  
  scene.add(leftTPTop, leftTPBottom, rightTPTop, rightTPBottom);

  // === Free Throw Lane Circle Extensions ===
  const keyCircleRadius = 1.8 * scale;
  
  // Left key semicircle (facing right, top half)
  const leftKeyCircle = new THREE.Mesh(
    new THREE.RingGeometry(keyCircleRadius - lineThickness/2, keyCircleRadius + lineThickness/2, 64, 1, -Math.PI/2, Math.PI), 
    arcMaterial
  );
  leftKeyCircle.rotation.x = -Math.PI / 2;
  leftKeyCircle.position.set(-courtLength/2 + keyLength, lineElevation + 0.01 * scale, 0);
  
  // Right key semicircle (facing left, top half)
  const rightKeyCircle = new THREE.Mesh(
    new THREE.RingGeometry(keyCircleRadius - lineThickness/2, keyCircleRadius + lineThickness/2, 64, 1, Math.PI/2, Math.PI), 
    arcMaterial
  );
  rightKeyCircle.rotation.x = -Math.PI / 2;
  rightKeyCircle.position.set(courtLength/2 - keyLength, lineElevation + 0.01 * scale, 0);
  
  scene.add(leftKeyCircle, rightKeyCircle);
}


function createBasketball() {
  // this will create the actual ball with leather texture
  const BasketballGeometry = new THREE.SphereGeometry(0.5, 32, 16);

  const textureLoader = new THREE.TextureLoader();
  
  // Load leather texture maps
  const leatherAlbedo = textureLoader.load('src/textures/ball/ball.png');
  const leatherNormal = textureLoader.load('src/textures/ball/black-leather_normal-ogl.png');
  const leatherAO = textureLoader.load('src/textures/black-leather_ao.png');
  
  [leatherAlbedo, leatherNormal, leatherAO].forEach(tex => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 4);
  });
  const BasketballMaterial = new THREE.MeshPhongMaterial({
  map: leatherAlbedo,
  normalMap: leatherNormal,
  aoMap: leatherAO,
  color: 0xff6600,
  // emissive: 0xffa431,
  shininess: 5
  });
  
  const Basketball = new THREE.Mesh(BasketballGeometry, BasketballMaterial);
  Basketball.position.set(0, 2, 0);
  Basketball.castShadow = true;
  scene.add(Basketball);
  
  // this will create the lines - important: dont use scene.add() - use basketball.add to make the basketball the parent of the lines
  // this will make it so the lines are in the local coordinates of the basketball instead of the global coordinates
  // and they will move with the ball when it moves 
  // we will use 3 cylinders that surround the ball 
  const ballRingGeometry = new THREE.CylinderGeometry(0.502, 0.502, 0.02, 32, 1, true);
  const ballRingMaterial = new THREE.MeshBasicMaterial({color: 0x000000}); 
  const ballRingOne = new THREE.Mesh(ballRingGeometry, ballRingMaterial);
  const ballRingTwo = new THREE.Mesh(ballRingGeometry, ballRingMaterial);
  const ballRingThree = new THREE.Mesh(ballRingGeometry, ballRingMaterial);
  ballRingTwo.rotation.z = Math.PI / 3;
  ballRingThree.rotation.z = 2 * Math.PI / 3;

  Basketball.add(ballRingOne);
  Basketball.add(ballRingTwo);
  Basketball.add(ballRingThree);
}
function createBaskets(scale = 1) {
  //we will create a base, a pole, a board, a ring and a net 
  // everything is double and mirrored for two side of the court 
  const courtGroup = new THREE.Group()
  //this is the base 
  const basketBaseGeometry = new THREE.BoxGeometry(2, 0.5, 2);
  const basketBaseMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, shininess: 100});

  const basketBaseOne = new THREE.Mesh(basketBaseGeometry, basketBaseMaterial);
  basketBaseOne.position.set(16.1 * scale, 0, 0);

  const basketBaseTwo = new THREE.Mesh(basketBaseGeometry, basketBaseMaterial);
  basketBaseTwo.position.set(-16.1 * scale, 0, 0);

  courtGroup.add(basketBaseOne);
  courtGroup.add(basketBaseTwo);

  //this is the support pole
  const basketPoleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 4.7, 32);
  const basketPoleMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, shininess: 100});

  const basketPoleOne = new THREE.Mesh(basketPoleGeometry, basketPoleMaterial);
  basketPoleOne.position.set(16.1 * scale, 2.5, 0);

  const basketPoleTwo = new THREE.Mesh(basketPoleGeometry, basketPoleMaterial);
  basketPoleTwo.position.set(-16.1 * scale, 2.5, 0);

  courtGroup.add(basketPoleOne);
  courtGroup.add(basketPoleTwo);

  //this is the connector between the pole and the board, and a support 45 degree cylinder
  const basketConnectorGeometry = new THREE.CylinderGeometry(0.2, 0.2, 2, 32);
  const basketConnectorMaterial = new THREE.MeshPhongMaterial({color: 0xff0000, shininess: 100});

  const basketConnectorOne = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorOne.position.set(15.3 * scale, 4.7, 0);

  const basketConnectorTwo = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorTwo.position.set(-15.3 * scale, 4.7, 0);

  basketConnectorOne.rotation.z = Math.PI / 2;
  basketConnectorTwo.rotation.z = -Math.PI / 2;

  const basketConnectorThree = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorThree.position.set(15.6 * scale, 4, 0);

  const basketConnectorFour = new THREE.Mesh(basketConnectorGeometry, basketConnectorMaterial);
  basketConnectorFour.position.set(-15.6 * scale, 4, 0);

  basketConnectorThree.rotation.z = Math.PI / 4;
  basketConnectorFour.rotation.z = -Math.PI / 4;

  courtGroup.add(basketConnectorOne);
  courtGroup.add(basketConnectorTwo);
  courtGroup.add(basketConnectorThree);
  courtGroup.add(basketConnectorFour);

  const cushionMaterial = new THREE.MeshPhongMaterial({ color: 0x1565c0, shininess: 10 });
  const cushionHeight = 1.2;   // height of the padding
  const cushionOffsetY = 1.0;  // how far up from ground
  const cushionGeo = new THREE.CylinderGeometry(0.4, 0.4, cushionHeight, 16);

  [basketPoleOne, basketPoleTwo].forEach(pole => {
    const cushion = new THREE.Mesh(cushionGeo, cushionMaterial);
    cushion.position.set(pole.position.x, cushionOffsetY + cushionHeight/2, pole.position.z);
    cushion.castShadow = cushion.receiveShadow = true;
    scene.add(cushion);
  });

  // 4) String of colorful Christmas lights around each pole
const bulbGeometry = new THREE.SphereGeometry(0.05, 8, 8);
const bulbColors   = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];  // red, green, blue, yellow, magenta
const bulbsPerPole = 20;   // total bulbs per pole
const bulbRadius   = 0.5;  // how far out from the pole center they sit
const bulbHeight   = 2.4;  // height above ground to string them

[basketPoleOne, basketPoleTwo].forEach(pole => {
  for (let i = 0; i < bulbsPerPole; i++) {
    // compute angle around pole
    const angle = (i / bulbsPerPole) * Math.PI * 2;
    const x = pole.position.x + bulbRadius * Math.cos(angle);
    const y = bulbHeight;
    const z = bulbRadius * Math.sin(angle);

    // pick a cycling color
    const color = bulbColors[i % bulbColors.length];
    const bulbMaterial = new THREE.MeshBasicMaterial({
      color: color,
      emissive: color,
      emissiveIntensity: 1
    });

    // create the little bulb
    const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
    bulb.position.set(x, y, z);
    scene.add(bulb);

    // add a faint point light so they glow
    const glow = new THREE.PointLight(color, 0.3, 2);
    glow.position.copy(bulb.position);
    scene.add(glow);
  }
});

const boardCanvas = document.createElement('canvas');
  boardCanvas.width  = 256;
  boardCanvas.height = 64;
  const ctx = boardCanvas.getContext('2d');
  ctx.fillStyle      = 'black';
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle      = 'red';
  ctx.font           = 'bold 48px monospace';
  ctx.textAlign      = 'center';
  ctx.textBaseline   = 'middle';
  ctx.fillText('00 : 00', 128, 32);

  // 2) Texture
  const boardTexture = new THREE.CanvasTexture(boardCanvas);
  boardTexture.minFilter = THREE.LinearFilter;
  boardTexture.needsUpdate = true;

  // 3) Bigger plane geometry
  const scoreGeo = new THREE.PlaneGeometry(2.0, 0.6);  // wider & taller
  const scoreMat = new THREE.MeshBasicMaterial({
    map: boardTexture,
    side: THREE.DoubleSide
  });

  // 4) Pos-X backboard scoreboard
  const scoreOne = new THREE.Mesh(scoreGeo, scoreMat);
  scoreOne.position.set(14.3 * scale, 6.5, 0);     // moved 0.25 units farther out, raised a bit
  scoreOne.rotation.y = -Math.PI / 2;      // still facing the court
  scene.add(scoreOne);

  // 5) Neg-X backboard scoreboard
  const scoreTwo = scoreOne.clone();
  scoreTwo.position.set(-14.3 * scale, 6.5, 0);
  scoreTwo.rotation.y =  Math.PI / 2;
  scene.add(scoreTwo);



  
  //this is the base connector between the poles and the board
  const boardConnectorGeometry = new THREE.BoxGeometry(0.3, 1, 1);
  const boardConnectorMaterial = new THREE.MeshPhongMaterial({color: 0xff8f19, shininess: 100});

  const boardConnectorOne = new THREE.Mesh(boardConnectorGeometry, boardConnectorMaterial);
  boardConnectorOne.position.set(14.6 * scale, 4.7, 0);

  const boardConnectorTwo = new THREE.Mesh(boardConnectorGeometry, boardConnectorMaterial);
  boardConnectorTwo.position.set(-14.6 * scale, 4.7, 0);

  courtGroup.add(boardConnectorOne);
  courtGroup.add(boardConnectorTwo);
  

  //this is the board 
  const basketBoardGeometry = new THREE.BoxGeometry(0.05, 3, 4);
  const basketBoardMaterial = new THREE.MeshPhongMaterial({color: 0xa9a9a9, transparent: true, opacity: 0.40});

  const basketBoardOne = new THREE.Mesh(basketBoardGeometry, basketBoardMaterial);
  basketBoardOne.position.set(14.5 * scale, 4.7, 0);
  const basketBoardTwo = new THREE.Mesh(basketBoardGeometry, basketBoardMaterial);
  basketBoardTwo.position.set(-14.5 * scale, 4.7, 0);

  courtGroup.add(basketBoardOne);
  courtGroup.add(basketBoardTwo);


  //this is the marking on the board itself - the white square in the middle of the board
  
  //the positive x board
  //the parallel to the y axis
  const smallParallelMarkingOneGeometry = new THREE.BoxGeometry(0.02, 0.03, 1.1); 
  const smallParallelMarkingOneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 

  
  const smallParallelMarkingOne = new THREE.Mesh(smallParallelMarkingOneGeometry, smallParallelMarkingOneMaterial); 
  smallParallelMarkingOne.position.set(14.5 * scale, 5.2, 0)
  const smallParallelMarkingTwo = new THREE.Mesh(smallParallelMarkingOneGeometry, smallParallelMarkingOneMaterial); 
  smallParallelMarkingTwo.position.set(14.5 * scale, 4.2, 0)

  courtGroup.add(smallParallelMarkingOne)
  courtGroup.add(smallParallelMarkingTwo)

  //the perpendicular to the y axis
  const smallPerpMarkingOneGeometry = new THREE.BoxGeometry(0.02, 1.1, 0.03); 
  const smallPerpMarkingOneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 

  const smallPerpMarkingOne = new THREE.Mesh(smallPerpMarkingOneGeometry, smallPerpMarkingOneMaterial); 
  smallPerpMarkingOne.position.set(14.5 * scale, 4.7, 0.4 * scale)
  const smallPerpMarkingTwo = new THREE.Mesh(smallPerpMarkingOneGeometry, smallPerpMarkingOneMaterial); 
  smallPerpMarkingTwo.position.set(14.5 * scale, 4.7, -0.4 * scale)

  courtGroup.add(smallPerpMarkingOne)
  courtGroup.add(smallPerpMarkingTwo)

  //the negative x board
  //the parallel to the y axis
  const smallParallelMarkingthree = new THREE.Mesh(smallParallelMarkingOneGeometry, smallParallelMarkingOneMaterial); 
  smallParallelMarkingthree.position.set(-14.5 * scale, 5.2, 0)
  const smallParallelMarkingfour = new THREE.Mesh(smallParallelMarkingOneGeometry, smallParallelMarkingOneMaterial); 
  smallParallelMarkingfour.position.set(-14.5 * scale, 4.2, 0)

  courtGroup.add(smallParallelMarkingthree)
  courtGroup.add(smallParallelMarkingfour)

  //the perpendicular to the y axis
  const smallPerpMarkingthree = new THREE.Mesh(smallPerpMarkingOneGeometry, smallPerpMarkingOneMaterial); 
  smallPerpMarkingthree.position.set(-14.5 * scale, 4.7, 0.4 * scale)
  const smallPerpMarkingFour = new THREE.Mesh(smallPerpMarkingOneGeometry, smallPerpMarkingOneMaterial); 
  smallPerpMarkingFour.position.set(-14.5 * scale, 4.7, -0.4 * scale)

  courtGroup.add(smallPerpMarkingthree)
  courtGroup.add(smallPerpMarkingFour)


  //the positive x board
  //the parallel to the y axis
  const bigParallelMarkingOneGeometry = new THREE.BoxGeometry(0.02, 0.03, 4.1); 
  const bigParallelMarkingOneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 

  const bigParallelMarkingOne = new THREE.Mesh(bigParallelMarkingOneGeometry, bigParallelMarkingOneMaterial); 
  bigParallelMarkingOne.position.set(14.5 * scale, 6.2, 0)
  const bigParallelMarkingTwo = new THREE.Mesh(bigParallelMarkingOneGeometry, bigParallelMarkingOneMaterial); 
  bigParallelMarkingTwo.position.set(14.5 * scale, 3.2, 0)

  courtGroup.add(bigParallelMarkingOne)
  courtGroup.add(bigParallelMarkingTwo)

  //the perpendicular to the y axis
  const bigPerpMarkingOneGeometry = new THREE.BoxGeometry(0.02, 3.1, 0.03); 
  const bigPerpMarkingOneMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} ); 

  const bigPerpMarkingOne = new THREE.Mesh(bigPerpMarkingOneGeometry, bigPerpMarkingOneMaterial); 
  bigPerpMarkingOne.position.set(14.5 * scale, 4.7, 2)
  const bigPerpMarkingTwo = new THREE.Mesh(bigPerpMarkingOneGeometry, bigPerpMarkingOneMaterial); 
  bigPerpMarkingTwo.position.set(14.5 * scale, 4.7, -2)

  courtGroup.add(bigPerpMarkingOne)
  courtGroup.add(bigPerpMarkingTwo)

  //the negative x board
  //the parallel to the y axis
  const bigParallelMarkingthree = new THREE.Mesh(bigParallelMarkingOneGeometry, bigParallelMarkingOneMaterial); 
  bigParallelMarkingthree.position.set(-14.5 * scale, 6.2, 0)
  const bigParallelMarkingfour = new THREE.Mesh(bigParallelMarkingOneGeometry, bigParallelMarkingOneMaterial); 
  bigParallelMarkingfour.position.set(-14.5 * scale, 3.2, 0)

  courtGroup.add(bigParallelMarkingthree)
  courtGroup.add(bigParallelMarkingfour)

  //the perpendicular to the y axis
  const bigPerpMarkingthree = new THREE.Mesh(bigPerpMarkingOneGeometry, bigPerpMarkingOneMaterial); 
  bigPerpMarkingthree.position.set(-14.5 * scale, 4.7, 2 )
  const bigPerpMarkingFour = new THREE.Mesh(bigPerpMarkingOneGeometry, bigPerpMarkingOneMaterial); 
  bigPerpMarkingFour.position.set(-14.5 * scale, 4.7, -2 )

  courtGroup.add(bigPerpMarkingthree)
  courtGroup.add(bigPerpMarkingFour)


  //this is the rim
  const rimGeometry = new THREE.TorusGeometry(0.7, 0.1, 16, 100); 
  const rimMaterial = new THREE.MeshPhongMaterial({color: 0xff8f19, shininess: 100}); 

  const rimOne = new THREE.Mesh(rimGeometry, rimMaterial);
  rimOne.position.set(13.8 * scale, 4, 0);
  const rimTwo = new THREE.Mesh(rimGeometry, rimMaterial);
  rimTwo.position.set(-13.8 * scale, 4, 0);

  rimOne.rotation.x = Math.PI / 2;
  rimTwo.rotation.x = Math.PI / 2;

  courtGroup.add(rimOne);
  courtGroup.add(rimTwo);

  // there are metal support beams for the rim with a connector to the board
  //this is the rim to board connector
  const rimConnectorGeometry = new THREE.BoxGeometry(0.1, 0.7, 0.8);
  const rimConnectorMaterial = new THREE.MeshBasicMaterial( {color: 0xff8f19, shininess: 100} );

  const rimConnectorOne = new THREE.Mesh(rimConnectorGeometry, rimConnectorMaterial);
  rimConnectorOne.position.set(14.5 * scale, 3.8, 0)
  const rimConnectorTwo = new THREE.Mesh(rimConnectorGeometry, rimConnectorMaterial);
  rimConnectorTwo.position.set(-14.5 * scale, 3.8, 0)

  courtGroup.add(rimConnectorOne)
  courtGroup.add(rimConnectorTwo)
  
  //these are the small metal beams
  const rimSupportGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 32); 
  const rimSupportMaterial = new THREE.MeshBasicMaterial( {color: 0xff8f19, shininess: 100} ); 

  //for the positive x basket
  const rimSupportOne = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportOne.position.set(14.3 * scale, 3.7, 0.5 )
  rimSupportOne.rotation.z = Math.PI / 3
  rimSupportOne.rotation.y = Math.PI / 8

  const rimSupportTwo = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportTwo.position.set(14.3 * scale, 3.7, -0.5 )
  rimSupportTwo.rotation.z = Math.PI / 3
  rimSupportTwo.rotation.y = -Math.PI / 8

  courtGroup.add(rimSupportOne)
  courtGroup.add(rimSupportTwo)

  //for the negative x basket
  const rimSupportThree = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportThree.position.set(-14.3 * scale, 3.7, 0.5)
  rimSupportThree.rotation.z = -Math.PI / 3
  rimSupportThree.rotation.y = -Math.PI / 8

  const rimSupportFour = new THREE.Mesh(rimSupportGeometry, rimSupportMaterial);
  rimSupportFour.position.set(-14.3 * scale, 3.7, -0.5)
  rimSupportFour.rotation.z = -Math.PI / 3
  rimSupportFour.rotation.y = Math.PI / 8

  courtGroup.add(rimSupportThree)
  courtGroup.add(rimSupportFour)


  //this is the net - i'll do a cylinder with unequal edge radii, hollow and wireframe
  const netGeometry = new THREE.CylinderGeometry(0.7, 0.5, 1.2, 32, 1, true); 
  const netMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: true}); 

  const netOne = new THREE.Mesh( netGeometry, netMaterial );
  netOne.position.set(rimOne.position.x, 3.3, 0);
  const netTwo = new THREE.Mesh( netGeometry, netMaterial );
  netTwo.position.set(rimTwo.position.x, 3.3, 0);

  courtGroup.add(netOne);
  courtGroup.add(netTwo);

  scene.add(courtGroup)
}

// Create all elements
createBasketballCourt(1.5);

// Set camera position for better view
const cameraTranslate = new THREE.Matrix4();
cameraTranslate.makeTranslation(0, 15, 30);
camera.applyMatrix4(cameraTranslate);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
let isOrbitEnabled = true;

// Instructions display
const instructionsElement = document.createElement('div');
instructionsElement.style.position = 'absolute';
instructionsElement.style.bottom = '20px';
instructionsElement.style.left = '20px';
instructionsElement.style.color = 'white';
instructionsElement.style.fontSize = '16px';
instructionsElement.style.fontFamily = 'Arial, sans-serif';
instructionsElement.style.textAlign = 'left';
instructionsElement.innerHTML = `
`;
document.body.appendChild(instructionsElement);





// Handle key events
function handleKeyDown(e) {
  if (e.key === "o") {
    isOrbitEnabled = !isOrbitEnabled;
  }
}

document.addEventListener('keydown', handleKeyDown);

// Animation function
function animate() {
  requestAnimationFrame(animate);
  
  // Update controls
  controls.enabled = isOrbitEnabled;
  controls.update();
  
  renderer.render(scene, camera);
}

animate();