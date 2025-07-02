/* 
This file first declares a global div called solarsystem to hold the planets it and 
center text in 3-d space inside the planet

The first function spawns squares from the top of random color, moves them down
into a sphere shape using the golden ratio to evenly space them

This sphere is then shrunk and regrown to reveal a sun coloring

Using the enter key moves the program along and moves the sun down to the left
spawns in 9 planets just as the sun did, and a rotatesphere function makes all
of these planets rotate like a planet

These planets squares are then pushed towards the middle until the last square reaches.

To color these planets like the planets of the solar system, I use mod opperators to randomly
but paternally color different sections of the planets based on their own real life looks
as well as using vertical positioning to create long bands of color

once the last square reaches the center, a function in info.js is called
*/
N = 250;
let R = 200;
let rchange = 0;
let perspective = 400;
let planet = 0;
const planetCount = 9;
const planetSpacing = window.innerWidth/10;
let stopAnimation = false;
let ringsCompleted = 0;
let stepState = 0;

const solarSystem = document.createElement('div');
solarSystem.id = "solarSystem";
solarSystem.style.position = "absolute";
solarSystem.style.left = "0";
solarSystem.style.top = "0";
solarSystem.style.width = "100%";
solarSystem.style.height = "100%";
solarSystem.style.transformStyle = "preserve-3d";

const section2 = document.querySelector('.section2');
section2.appendChild(solarSystem);

let currentCenter = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2
};

function getCenter() {
  return currentCenter;
}


function animateCenterTo(newX, newY, steps) {
  const startX = currentCenter.x;
  const startY = currentCenter.y;
  const dx = (newX - startX) / steps;
  const dy = (newY - startY) / steps;
  let count = 0;

  function step() {
    if (count < steps) {
      currentCenter.x += dx;
      currentCenter.y += dy;
      count++;
      requestAnimationFrame(step);
    } else {
      currentCenter.x = newX;
      currentCenter.y = newY;
    }
  }
  step();
}

function squarefromtop() {
  const frag = document.createDocumentFragment();
  const centerX = getCenter().x;
  const baseLeft = centerX - R - 30;

  for (let i = 0; i < (N); i++) {
    const box = document.createElement("div");
    box.className = "pictureBox";
    box.style.top = "-50px";
    box.style.left = baseLeft + "px";
    box.style.width = "50px";
    box.style.height = "50px";
    box.style.backgroundColor = `hsl(${(i * 360 / 500)}, 100%, 50%)`;

    frag.appendChild(box);

    setTimeout(((b, idx) => () => movePicDown(b, idx))(box, i), i * 6); 
  }

  solarSystem.appendChild(frag);
}


function movePicDown(box, index) {
  let position = 0;
  const maxPosition = window.innerHeight / 2;

  function step() {
    if (position < maxPosition) {
      position += 20;
      box.style.top = position + "px";
      requestAnimationFrame(step);
    } else {
      moveCircle(box, index);
    }
  }
  requestAnimationFrame(step);
}

function moveCircle(box, index) {
  let angle = 180;
  const radius = R + 30;

  function step() {
    const { x: centerX, y: centerY } = getCenter();
    angle -= 20;
    const x = radius * Math.cos(angle * Math.PI / 180);
    const y = radius * Math.sin(angle * Math.PI / 180);
    box.style.left = (centerX + x) + "px";
    box.style.top = (centerY + y) + "px";

    if (angle > 90) {

      requestAnimationFrame(step);
    } else {
      box.classList.replace("pictureBox", "pictureBox3dSun");
      moveSphere(box, index, angle);
    }
  }

  requestAnimationFrame(step);
}
function moveSphere(box, index, initialTheta) {
  let theta = initialTheta;
  const phi = Math.acos(1 - 2 * (index + 0.5) / N);
  const thetaOffset = (Math.PI * (3 - Math.sqrt(5)) * 2);
  const baseTheta = index * thetaOffset;

  function step3d() {
    if (stopAnimation) return;

    theta += 0.015;
    const { x: centerX, y: centerY } = getCenter();

    const radTheta = baseTheta + theta;
    const x3d = R * Math.sin(phi) * Math.cos(radTheta);
    const y3d = R * Math.cos(phi);
    const z3d = R * Math.sin(phi) * Math.sin(radTheta);

    const scale = perspective / (perspective + z3d);
    box.style.left = (centerX + x3d * scale) + "px";
    box.style.top = (centerY + y3d * scale) + "px";
    box.style.transform = `scale(${scale})`;
    box.style.opacity = scale.toFixed(2);
    box.style.zIndex = Math.round(scale * 1000);
    requestAnimationFrame(step3d);
  
  }

  requestAnimationFrame(step3d);
  if(index === N-1 && stepState === 0){
    window.addEventListener("keydown", handleKeyPress, { once: true });
  }
}


function handleKeyPress(event, index) {
  if (event.key === "Enter") {
    // Remove the event listener to avoid multiple triggers
    window.removeEventListener("keydown", handleKeyPress);

    switch (stepState) {
      case 0:
        colorchange(index);
        break;
      case 1:
        zoomout();
        squarefromtopP2_9(0);
        squarefromtopP2_9(1);
        squarefromtopP2_9(2);
        squarefromtopP2_9(3);
        squarefromtopP2_9(4);
        squarefromtopP2_9(5);
        squarefromtopP2_9(6);
        squarefromtopP2_9(7);
        squarefromtopP2_9(8);
        break;
      case 2:
        stopAnimation = true;
        ZoomP1();
        
        break;

    }

    stepState++;
  }
}

function colorchange(index) {
  const allBoxes = document.querySelectorAll(".pictureBox3dSun");
  const steps = 15;
  const targetR = R * 0.01;
  const delta = (targetR - R) / steps;
  let count = 0;

  function animateRadius() {
    if (count >= steps) {
      colorchange2();
      return;
    }

    R += delta;
    if (count > 13) {
      allBoxes.forEach((box) => {
        box.style.width = "5px";
        box.style.height = "5px";
        box.style.backgroundColor = "white";
      });
    } else {
      allBoxes.forEach((box) => box.style.backgroundColor = "white");
    }

    count++;
    requestAnimationFrame(animateRadius);
  }

  requestAnimationFrame(animateRadius);
}

function colorchange2() {
  const allBoxes = document.querySelectorAll(".pictureBox3dSun");
  const steps = 15;
  const targetR = 200;
  const delta = (targetR - R) / steps;
  let count = 0;

  function animateRadius() {
    if (count >= steps) {
      window.addEventListener("keydown", handleKeyPress, { once: true });
      return;
    }

    R += delta;

    allBoxes.forEach((box, i) => {
      if (count > 5) {
        box.style.width = "50px";
        box.style.height = "50px";
      }
      box.style.backgroundColor = 'rgb(255, 255, 0)';
      if ((i % 10) === 0) {
         box.style.boxShadow = "0 0 40px 20px rgba(255, 255, 100, 0.9)";
      } else {
        box.style.boxShadow = "none";
      }
    });

    count++;
    requestAnimationFrame(animateRadius);
  }

  requestAnimationFrame(animateRadius);
}


function zoomout() {
  const allBoxes = document.querySelectorAll(".pictureBox3dSun");
  const steps = 10;
  const targetR = 50;
  const delta = (targetR - R) / steps;

  let count = 0;

  animateCenterTo(75, window.innerHeight / 2, steps);
  
  function animateRadius() {
    if (count >= steps) {
      return;
    }

    R += delta;
    count++;

    allBoxes.forEach((box) => {
      if (count > 8) {
        box.style.width = "20px";
        box.style.height = "20px";
      }
    });

    requestAnimationFrame(animateRadius);
  }

  animateRadius();
}

function squarefromtopP2_9(indexP) {
  const frag = document.createDocumentFragment();
  const left = ((25)+(1+indexP) * planetSpacing) + "px";
  N = 150;
  for (let i = 0; i < N; i++) {

    const box = document.createElement("div");
    box.style.top = "-50px";
    box.style.left = left;
    box.style.width = "20px";
    box.style.height = "20px";

    switch (indexP) {
  // Mercury: cratered rocky surface with some bigger crater patches
  case 0: {
    box.classList = "pictureBox3dMercury";
    if ((i % 31) < 5) box.style.backgroundColor = "rgb(90, 90, 90)";        // crater clusters
    else if ((i % 13) === 0) box.style.backgroundColor = "rgb(169, 169, 169)"; // lighter plains
    else if ((i % 7) < 3) box.style.backgroundColor = "rgb(120, 110, 100)";   // rocky patches
    else box.style.backgroundColor = "rgb(140, 140, 140)";                   // base gray
    break;
  }

  // Venus: thick yellowish clouds with swirling bright and dark patches
  case 1: {
    box.classList = "pictureBox3dVenus";
    let modVal = i % 40;
    if (modVal < 6) box.style.backgroundColor = "rgb(210, 190, 110)";       // bright sulfuric clusters
    else if (modVal >= 10 && modVal < 17) box.style.backgroundColor = "rgb(170, 140, 80)"; // darker swirls
    else if ((i + 5) % 11 === 0) box.style.backgroundColor = "rgb(220, 210, 140)";          // light clouds
    else box.style.backgroundColor = "rgb(200, 180, 100)";                   // base yellowish
    break;
  }

  // Earth: blue oceans, green landmasses, white clouds — clumped for continents & clouds
  case 2: {
    box.classList = "pictureBox3dEarth";
    let rowLength = 15; // approximate "width" for pattern rows
    let row = Math.floor(i / rowLength);
    let col = i % rowLength;

    // Create landmass clusters (like continents)
    // Example: rows 3-7 and cols 5-10 mostly land, else ocean
    let isLand = (row >= 3 && row <= 7 && col >= 5 && col <= 10);
    
    // Add some land outliers near edges (islands)
    if ((row === 2 && col === 4) || (row === 8 && col === 11)) isLand = true;

    // Clouds — semi-random clumps using mod
    let isCloud = ((i + 7) % 37 < 4) || ((i + 11) % 29 < 3);

    if (isCloud) {
      box.style.backgroundColor = "rgba(255, 255, 255, 0.85)";  // white clouds with some transparency
    } else if (isLand) {
      if ((i % 7) < 5) box.style.backgroundColor = "rgb(34, 139, 34)"; // dark green forests
      else box.style.backgroundColor = "rgb(144, 238, 144)";           // lighter green grasslands
    } else {
      box.style.backgroundColor = "rgb(30, 144, 255)";                 // deep ocean blue
    }
    break;
  }

  // Mars: red dusty surface with volcanic and canyon clusters
  case 3: {
    box.classList = "pictureBox3dMars";

    let cluster = i % 25;
    if (cluster < 6) box.style.backgroundColor = "rgb(130, 50, 40)";       // volcanic dark clusters
    else if (cluster >= 15 && cluster < 20) box.style.backgroundColor = "rgb(180, 60, 50)"; // dusty patches
    else box.style.backgroundColor = "rgb(200, 80, 60)";                   // red plains
    break;
  }

  // Jupiter: horizontal banded pattern with Great Red Spot clump
  case 4: {
    box.classList = "pictureBox3dJupiter";

    let rowLength = 20;
    let row = Math.floor(i / rowLength);

    // Great Red Spot: cluster around row 10, cols 8-12
    let col = i % rowLength;
    if (row === 10 && col >= 8 && col <= 12) {
      box.style.backgroundColor = "rgb(165, 42, 42)"; // Great Red Spot (reddish)
    } else if (row % 4 === 0) {
      box.style.backgroundColor = "rgb(255, 248, 220)"; // cream light bands
    } else if (row % 4 === 1) {
      box.style.backgroundColor = "rgb(205, 133, 63)";  // brown bands
    } else if (row % 4 === 2) {
      box.style.backgroundColor = "rgb(244, 164, 96)";  // orange bands
    } else {
      box.style.backgroundColor = "rgb(222, 184, 135)"; // base sandy color
    }
    break;
  }

  // Saturn: pale gold bands with subtle variation
  case 5: {
    box.classList = "pictureBox3dSaturn";

    let rowLength = 20;
    let row = Math.floor(i / rowLength);
    let col = i % rowLength;

    // Bands with gradual gradients
    if (row % 6 < 2) {
      box.style.backgroundColor = `rgb(${218 + col % 10}, ${165 + col % 10}, ${32 + col % 10})`; // gold band
    } else if (row % 6 < 4) {
      box.style.backgroundColor = `rgb(${255 - col % 15}, ${239 - col % 15}, ${148 - col % 15})`; // pale yellow
    } else {
      box.style.backgroundColor = `rgb(${184 + col % 5}, ${134 + col % 5}, ${11 + col % 5})`;     // darker bands
    }
    break;
  }

  // Uranus: pale blue-green fairly uniform with light patches
  case 6: {
    box.classList = "pictureBox3dUranus";

    let cluster = i % 35;
    if (cluster < 6) box.style.backgroundColor = "rgb(176, 224, 230)";    // light cyan patches
    else if (cluster >= 20 && cluster < 26) box.style.backgroundColor = "rgb(143, 188, 143)"; // pale greenish areas
    else box.style.backgroundColor = "rgb(175, 238, 238)";               // base pale turquoise
    break;
  }

  // Neptune: deep blue with lighter patches
  case 7: {
    box.classList = "pictureBox3dNeptune";

    let cluster = i % 33;
    if (cluster < 5) box.style.backgroundColor = "rgb(25, 25, 112)";     // deep blue spots
    else if (cluster >= 20 && cluster < 25) box.style.backgroundColor = "rgb(72, 61, 139)";  // darker blue
    else box.style.backgroundColor = "rgb(0, 0, 139)";                   // base dark blue
    break;
  }

  // Pluto: icy with brownish rocky patches and some lighter ice
  case 8: {
    box.classList = "pictureBox3dPluto";

    let cluster = i % 27;
    if (cluster < 6) box.style.backgroundColor = "rgb(205, 192, 176)";   // icy plains
    else if (cluster >= 12 && cluster < 18) box.style.backgroundColor = "rgb(139, 115, 85)";  // rocky patches
    else if (cluster >= 22) box.style.backgroundColor = "rgb(222, 184, 135)";                 // lighter brownish
    else box.style.backgroundColor = "rgb(188, 143, 143)";                   // muted pinkish base
    break;
  }

  default:
    box.style.backgroundColor = "rgb(128, 128, 128)"; // fallback gray
 }

    frag.appendChild(box);
    setTimeout(((b, idx) => () => movePicDownP2_9(b, idx, indexP))(box, i), i * 6);
  }

solarSystem.appendChild(frag);
}


function movePicDownP2_9(box, index, indexP) {
  let position = 0;
  const maxPosition = window.innerHeight / 2;

  function step() {
    if (position < maxPosition) {
      position += 20;
      box.style.top = position + "px";
      requestAnimationFrame(step);
    } else {
      moveCircleP2_9(box, index, indexP);
    }
  }

  requestAnimationFrame(step);
}


function moveCircleP2_9(box, index, indexP) {
  let angle = 180;
  const radius = R;
  const { x: centerX, y: centerY } = getCenterP2_9(indexP);

  function step() {
    angle -= 20;
    const x = radius * Math.cos(angle * Math.PI / 180);
    const y = radius * Math.sin(angle * Math.PI / 180);
    box.style.left = (centerX + x) + "px";
    box.style.top = (centerY + y) + "px";

    if (angle > 90) {
      requestAnimationFrame(step);
    } else {
      moveSphereP2_9(box, index, angle, indexP);
    }
  }

  requestAnimationFrame(step);
}


function moveSphereP2_9(box, index, initialTheta, indexP) {
  let theta = initialTheta;
  const phi = Math.acos(1 - 2 * (index + 0.5) / N);
  const thetaOffset = (Math.PI * (3 - Math.sqrt(5)) * 2);
  const baseTheta = index * thetaOffset;

  function step3d() {
    if (stopAnimation) return;

    theta += 0.015;
    const { x: centerX, y: centerY } = getCenterP2_9(indexP);

    const radTheta = baseTheta + theta;
    const x3d = R * Math.sin(phi) * Math.cos(radTheta);
    const y3d = R * Math.cos(phi);
    const z3d = R * Math.sin(phi) * Math.sin(radTheta);

    const scale = perspective / (perspective + z3d);
    box.style.left = (centerX + x3d * scale) + "px";
    box.style.top = (centerY + y3d * scale) + "px";
    box.style.transform = `scale(${scale})`;
    box.style.opacity = scale.toFixed(2);
    box.style.zIndex = Math.round(scale * 1000);
    requestAnimationFrame(step3d);
  
  }

  requestAnimationFrame(step3d);

  if (index === (N - 1)) {
    ringsCompleted++;
    if (ringsCompleted === planetCount) {
      // All 9 rings are now in 3D motion:
      window.addEventListener("keydown", handleKeyPress, { once: true });
    }
  }
}

function getCenterP2_9(indexP) {
    return {
    x: (75+(1+indexP)*planetSpacing),
    y: window.innerHeight / 2
    };
}

// FPS Counter
const fpsDiv = document.createElement('div');
fpsDiv.style.position = 'fixed';
fpsDiv.style.top = '10px';
fpsDiv.style.right = '20px';
fpsDiv.style.background = 'rgba(0,0,0,0.7)';
fpsDiv.style.color = '#fff';
fpsDiv.style.padding = '4px 10px';
fpsDiv.style.fontFamily = 'monospace';
fpsDiv.style.fontSize = '16px';
fpsDiv.style.zIndex = 9999;
fpsDiv.innerText = 'FPS: 0';
document.body.appendChild(fpsDiv);

let lastFrame = performance.now();
let frames = 0;
let lastFpsUpdate = performance.now();

function updateFps() {
  frames++;
  const now = performance.now();
  if (now - lastFpsUpdate > 500) {
    const fps = Math.round((frames * 1000) / (now - lastFpsUpdate));
    fpsDiv.innerText = `FPS: ${fps}`;
    frames = 0;
    lastFpsUpdate = now;
  }
  requestAnimationFrame(updateFps);
}
updateFps();

