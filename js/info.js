/*

All squares now combine into one array, and a new sphere is spawned using all of them

The new sphere now transitions between colorings of the planets and going inside of them using the enter key

Text is created and centered as well as image div's inside the planet in order to only show them whenever inside

The majority of content is displayed here, each planet showing either a section of text or pictures

The function, using mod operators for the count of what planet is currently shown, infinitly goes inside and back 
out showing all planets in order 

This file contains all content on the page and an updated coloring for planets based on the increase of squares
*/
let indexPlanet = 0;
let stepState2 = 0;
let finishedBoxes = [];
let planetR = 200;

let paragraph = document.createElement('p');
let header = document.createElement('h1');    

const enterPrompt = document.createElement("div");
enterPrompt.id = "enterPrompt";
enterPrompt.textContent = "Press ENTER to continue";
document.getElementById("solarSystem").appendChild(enterPrompt);

document.getElementById("solarSystem").appendChild(header);
document.getElementById("solarSystem").appendChild(paragraph);

function ZoomP1() {
  const R = 20;
  const targetR = 25;
  const steps = 100;
  const delta = (targetR - R) / steps;
  const perspective = 400;

  const allBoxes = [
    ...document.querySelectorAll(".pictureBox3dSun"),
    ...document.querySelectorAll(".pictureBox3dMercury"),
    ...document.querySelectorAll(".pictureBox3dVenus"),
    ...document.querySelectorAll(".pictureBox3dEarth"),
    ...document.querySelectorAll(".pictureBox3dMars"),
    ...document.querySelectorAll(".pictureBox3dJupiter"),
    ...document.querySelectorAll(".pictureBox3dSaturn"),
    ...document.querySelectorAll(".pictureBox3dUranus"),
    ...document.querySelectorAll(".pictureBox3dNeptune"),
    ...document.querySelectorAll(".pictureBox3dPluto")
  ];

  const N = allBoxes.length;
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  allBoxes.forEach((box, index) => {

    box.style.position = "absolute";

    if (!box.style.left || !box.style.top) {
      const rect = box.getBoundingClientRect();
      box.style.left = `${rect.left}px`;
      box.style.top = `${rect.top}px`;
    }

    box.style.width = `${R}px`;
    box.style.height = `${R}px`;

    animateToCenter(box, index);
  });

  function animateToCenter(box, index) {
    const startX = parseFloat(box.style.left);
    const startY = parseFloat(box.style.top);
    const dx = (centerX - startX) / steps;
    const dy = (centerY - startY) / steps;

    let count = 0;
    let currentR = R;

    function step() {
      if (count < steps) {
        const left = parseFloat(box.style.left);
        const top = parseFloat(box.style.top);

        box.style.left = (left + dx) + "px";
        box.style.top = (top + dy) + "px";

        currentR += delta;
        box.style.width = `${currentR}px`;
        box.style.height = `${currentR}px`;

        count++;
        requestAnimationFrame(step);
      } else {
        
        changeColor3(box, index)
        moveSphere3(box, index, N);
        finishedBoxes.push({ box, index });

      }
    }

    step();
  }

function changeColor3(box,i){
  box.style.boxShadow = "none";

switch (indexPlanet) {
  case 0:{
    box.style.backgroundColor = "rgb(255, 255, 0)";
      if ((i % 30) === 0) {
        console.log("what")
         box.style.boxShadow = "0 0 40px 20px rgba(255, 255, 100, 0.9)";
      } else {
        box.style.boxShadow = "none";
      }
    break;
  }
  // Mercury: cratered rocky surface with bigger crater patches
  case 1: {

    if ((i % 185) < 30) box.style.backgroundColor = "rgb(90, 90, 90)";        // crater clusters (scaled up)
    else if ((i % 78) === 0) box.style.backgroundColor = "rgb(169, 169, 169)"; // lighter plains
    else if ((i % 42) < 18) box.style.backgroundColor = "rgb(120, 110, 100)";  // rocky patches
    else box.style.backgroundColor = "rgb(140, 140, 140)";                    // base gray
    break;
  }

  // Venus: thick yellowish clouds with swirling bright and dark patches
  case 2: {
    let modVal = i % 160;
    if (modVal < 24) box.style.backgroundColor = "rgb(210, 190, 110)";        // bright sulfuric clusters
    else if (modVal >= 40 && modVal < 68) box.style.backgroundColor = "rgb(170, 140, 80)"; // darker swirls
    else if ((i + 5) % 44 === 0) box.style.backgroundColor = "rgb(220, 210, 140)";         // light clouds
    else box.style.backgroundColor = "rgb(200, 180, 100)";                    // base yellowish
    break;
  }

  // Earth: blue oceans, green landmasses, white clouds — clumped for continents & clouds
  case 3: {
    let rowLength = 40; // scaled row length for pattern rows (was 15)
    let row = Math.floor(i / rowLength);
    let col = i % rowLength;

    // Create landmass clusters (like continents)
    // Adjusted row/col ranges for bigger grid
    let isLand = (row >= 10 && row <= 25 && col >= 15 && col <= 28);

    // Add some land outliers near edges (islands)
    if ((row === 8 && col === 12) || (row === 27 && col === 30)) isLand = true;

    // Clouds — semi-random clumps using mod
    let isCloud = ((i + 7) % 95 < 12) || ((i + 11) % 75 < 9);

    if (isCloud) {
      box.style.backgroundColor = "rgba(255, 255, 255, 0.85)";  // white clouds with some transparency
    } else if (isLand) {
      if ((i % 18) < 13) box.style.backgroundColor = "rgb(34, 139, 34)"; // dark green forests
      else box.style.backgroundColor = "rgb(144, 238, 144)";           // lighter green grasslands
    } else {
      box.style.backgroundColor = "rgb(30, 144, 255)";                 // deep ocean blue
    }
    break;
  }

  // Mars: red dusty surface with volcanic and canyon clusters
  case 4: {

    let cluster = i % 125;
    if (cluster < 30) box.style.backgroundColor = "rgb(130, 50, 40)";       // volcanic dark clusters
    else if (cluster >= 75 && cluster < 100) box.style.backgroundColor = "rgb(180, 60, 50)"; // dusty patches
    else box.style.backgroundColor = "rgb(200, 80, 60)";                   // red plains
    break;
  }

  // Jupiter: horizontal banded pattern with Great Red Spot clump
  case 5: {

    let rowLength = 50;  // scaled row length 
    let row = Math.floor(i / rowLength);
    let col = i % rowLength;

    // Great Red Spot: cluster around row 25, cols 20-30 (scaled)
    if (row === 25 && col >= 20 && col <= 30) {
      box.style.backgroundColor = "rgb(165, 42, 42)"; // Great Red Spot (reddish)
    } else if (row % 10 < 3) {
      box.style.backgroundColor = "rgb(255, 248, 220)"; // cream light bands
    } else if (row % 10 < 5) {
      box.style.backgroundColor = "rgb(205, 133, 63)";  // brown bands
    } else if (row % 10 < 8) {
      box.style.backgroundColor = "rgb(244, 164, 96)";  // orange bands
    } else {
      box.style.backgroundColor = "rgb(222, 184, 135)"; // base sandy color
    }
    break;
  }

  // Saturn: pale gold bands with subtle variation
  case 6: {

    let rowLength = 50;  // scaled (was 20)
    let row = Math.floor(i / rowLength);
    let col = i % rowLength;

    // Bands with gradual gradients
    if (row % 15 < 5) {
      box.style.backgroundColor = `rgb(${218 + col % 10}, ${165 + col % 10}, ${32 + col % 10})`; // gold band
    } else if (row % 15 < 10) {
      box.style.backgroundColor = `rgb(${255 - col % 15}, ${239 - col % 15}, ${148 - col % 15})`; // pale yellow
    } else {
      box.style.backgroundColor = `rgb(${184 + col % 5}, ${134 + col % 5}, ${11 + col % 5})`;     // darker bands
    }
    break;
  }

  // Uranus: pale blue-green fairly uniform with light patches
  case 7: {

    let cluster = i % 150;
    if (cluster < 30) box.style.backgroundColor = "rgb(176, 224, 230)";    // light cyan patches
    else if (cluster >= 85 && cluster < 110) box.style.backgroundColor = "rgb(143, 188, 143)"; // pale greenish areas
    else box.style.backgroundColor = "rgb(175, 238, 238)";               // base pale turquoise
    break;
  }

  // Neptune: deep blue with lighter patches
  case 8: {

    let cluster = i % 140;
    if (cluster < 25) box.style.backgroundColor = "rgb(25, 25, 112)";     // deep blue spots
    else if (cluster >= 85 && cluster < 110) box.style.backgroundColor = "rgb(72, 61, 139)";  // darker blue
    else box.style.backgroundColor = "rgb(0, 0, 139)";                   // base dark blue
    break;
  }

  // Pluto: icy with brownish rocky patches and some lighter ice
  case 9: {

    let cluster = i % 120;
    if (cluster < 30) box.style.backgroundColor = "rgb(205, 192, 176)";   // icy plains
    else if (cluster >= 54 && cluster < 80) box.style.backgroundColor = "rgb(139, 115, 85)";  // rocky patches
    else if (cluster >= 88) box.style.backgroundColor = "rgb(222, 184, 135)";                 // lighter brownish
    else box.style.backgroundColor = "rgb(188, 143, 143)";                   // muted pinkish base
    break;
  }

  default:
    box.style.backgroundColor = "rgb(128, 128, 128)"; // fallback gray
}

    window.addEventListener("keydown", handleKeyPress2);

    
}

function moveSphere3(box, index, total) {
    const thetaOffset = (Math.PI * (3 - Math.sqrt(5))) * 2;
    const baseTheta = index * thetaOffset;
    const phi = Math.acos(1 - 2 * (index + 0.5) / total);
    let theta = 90;

    function getCenter() {
      return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

function step3d() {
  theta += 0.015;
  const { x: cx, y: cy } = getCenter();

  const radTheta = baseTheta + theta;
  const x3d = planetR * Math.sin(phi) * Math.cos(radTheta);
  const y3d = planetR * Math.cos(phi);
  const z3d = planetR * Math.sin(phi) * Math.sin(radTheta);

  const scaleFactor = perspective + z3d;

  if (scaleFactor <= 1) {
    box.style.display = "none";
  } else {
    box.style.display = "block";

    const scale = perspective / scaleFactor;
    box.style.left = `${cx + x3d * scale}px`;
    box.style.top = `${cy + y3d * scale}px`;
    box.style.transform = `scale(${scale})`;
    box.style.opacity = scale.toFixed(2);
    box.style.zIndex = Math.round(scale * 1000);
  }

  requestAnimationFrame(step3d);
}

    requestAnimationFrame(step3d);
  }

let entercount = 0;

function handleKeyPress2(event) {
  if (event.key === "Enter") {

    if((entercount%2)===1){
        indexPlanet = (indexPlanet + 1) % 10;
        console.log(indexPlanet)

        finishedBoxes.forEach(({ box, index }) => {
            changeColor3(box, index);
        });
    }
    finishedBoxes.forEach(({ box, index }) => {
        if (parseInt(box.style.width) !== 70){
                box.style.width = "70px";
                box.style.height = "70px";
            }
            else{
                box.style.width = "25px";
                box.style.height = "25px";
            }
        });
    showtext(entercount);
    entercount =(entercount+1)%20;
  }
}

}

function showtext(entercount){
    if((entercount%2)=== 0){
        planetR = 500;
    }
    else{
        planetR = 200;
    }

switch (entercount) {
    case 0: {
      header.hidden = false;
      paragraph.hidden = false;
        header.textContent = "About Me"
        header.style.color = "#FFD700";

        paragraph.textContent = "I am a senior at Castle Highschool with a passion for coding and ping-pong.";
        paragraph.style.color = "#FFD700"; // Gold text
        paragraph.style.backgroundColor = "rgba(0, 0, 0, 0.7)"; // Semi-transparent black bg

        break;
    }
    case 1: {
      header.hidden = true;
      paragraph.hidden = true;

      break;
    }
    case 2: {    
      header.hidden = false;
      paragraph.hidden = true;
      header.innerHTML = "Action Shots:";
      header.style.top = "10%";

      paragraph.innerHTML = "";
      
      header.style.color = "#333333"; // Dark gray text
      header.style.padding = "3% 3%";
      header.style.backgroundColor = "rgba(255, 255, 255, 0.8)"; // Semi-transparent white bg

      const imageDiv = document.createElement("div");
      imageDiv.className = "imageContainer";
      imageDiv.id = "actionShots";
      const imageSources = [
        "images/IMG_0636.png",
        "images/help.png",
        "images/working.png",
        "images/Pong.png"
      ];
      imageSources.forEach(src => {
        const img = document.createElement("img");
        img.src = src;
        imageDiv.appendChild(img);
      });
      document.getElementById("solarSystem").appendChild(imageDiv);
      break;
    }
    case 3: {
      header.hidden = true;
      paragraph.hidden = true;
      const oldImageDiv = document.getElementById("actionShots");
      if (oldImageDiv) oldImageDiv.remove();
      break;
    }
    case 4: {
      const oldSkills = document.getElementById("skills");
      if (oldSkills) oldSkills.remove();

      header.hidden = false;
      paragraph.hidden = true;
      header.style.backgroundColor = "rgba(60, 40, 10, 0.7)";
      header.textContent = "Technical Skills";
      header.style.color = "#FFF5CC";

      const imageDiv = document.createElement("div");
      imageDiv.className = "imageCircleContainer";
      imageDiv.id = "skills";

      const canvas = document.createElement("canvas");
      canvas.width = 575;
      canvas.height = 575;
      canvas.className = "skillLines";
      canvas.style.position = "absolute";
      canvas.style.top = "0";
      canvas.style.left = "0";
      imageDiv.style.position = "relative"; // Needed to align canvas and images

      imageDiv.appendChild(canvas);

      const imageSources = [
        "images/csharp.png",
        "images/css.png",
        "images/python.png",
        "images/java.png",
        "images/js.png"
      ];

      const iconElements = [];
      const radius = 210;

      imageSources.forEach((src, index, arr) => {
        const img = document.createElement("img");
        img.src = src;
        img.className = "circleSkillIcon";

        const angle = (index / arr.length) * 2 * Math.PI;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;

        img.style.position = "absolute";
        img.style.left = `calc(50% + ${x}px - 75px)`;
        img.style.top = `calc(50% + ${y}px - 75px)`;

        imageDiv.appendChild(img);
        iconElements.push(img);
      });

      document.getElementById("solarSystem").appendChild(imageDiv);

      // Wait until images are rendered
      requestAnimationFrame(() => {
        const iconPositions = [];
        const canvasRect = canvas.getBoundingClientRect();

        iconElements.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2 - canvasRect.left;
          const centerY = rect.top + rect.height / 2 - canvasRect.top;
          iconPositions.push({ x: centerX, y: centerY });
        });

        const ctx = canvas.getContext("2d");
        ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
        ctx.lineWidth = 5;

        ctx.beginPath();
        let i = 0;
        const visited = new Set();
        ctx.moveTo(iconPositions[i].x, iconPositions[i].y);
        do {
          i = (i + 2) % iconPositions.length;
          ctx.lineTo(iconPositions[i].x, iconPositions[i].y);
          visited.add(i);
        } while (!visited.has((i + 2) % iconPositions.length));
        ctx.closePath();
        ctx.stroke();
      });

      break;
    }

    case 5: {
      header.hidden = true;
      paragraph.hidden = true;
      const oldImageDiv2 = document.getElementById("skills");
      if (oldImageDiv2) oldImageDiv2.remove();
      break;
    }
case 6: {
  header.hidden = false;
  paragraph.hidden = false; 
  header.style.backgroundColor = "rgba(0, 0, 50, 0.7)"; 

  header.textContent = "Projects";
  header.style.color = "#A7D8FF"; 

  const imageDiv = document.createElement("div");
  imageDiv.className = "container5";  // renamed from imageContainer
  imageDiv.id = "projects";

  const imageSources = [
    "images/escape.png",
    "images/clash.png"

  ];

  // Example links — replace these with your actual project URLs
  const projectLinks = [
    "Choose-Adventure/index.html",
    "Quiz/index.html",

  ];

  imageSources.forEach((src, index) => {
    const link = document.createElement("a");
    link.href = projectLinks[index];
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "projectLink";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Screenshot of project ${index + 1}`;

    link.appendChild(img);
    imageDiv.appendChild(link);
  });

  document.getElementById("solarSystem").appendChild(imageDiv);
  break;
}

    case 7: {
      header.hidden = true;
      paragraph.hidden = true;
      const oldImageDiv2 = document.getElementById("projects");
      if (oldImageDiv2) oldImageDiv2.remove();
      break;
    }
    case 8: {
      header.hidden = false;
      paragraph.hidden = false; 
      header.style.backgroundColor = "rgba(80, 0, 0, 0.7)"; // Dark red transparent bg
      header.textContent = "Projects";
      header.style.color = "##FFFDD0"; 
      
      const imageDiv = document.createElement("div");
      imageDiv.className = "container5";  // renamed from imageContainer
      imageDiv.id = "projects";

      const imageSources = [
        "images/mower.png",
        "images/race.png"
      ];

      // Example links — replace these with your actual project URLs
      const projectLinks = [
        "Jacob_Unit-2-Project/index.html",
        "Mowing/index.html"
      ];

      imageSources.forEach((src, index) => {
        const link = document.createElement("a");
        link.href = projectLinks[index];
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "projectLink";

        const img = document.createElement("img");
        img.src = src;
        img.alt = `Screenshot of project ${index + 1}`;

        link.appendChild(img);
        imageDiv.appendChild(link);
      });

      document.getElementById("solarSystem").appendChild(imageDiv);
        break;
    }
    case 9: {
      header.hidden = true;
      paragraph.hidden = true;
      const oldImageDiv2 = document.getElementById("projects");
      if (oldImageDiv2) oldImageDiv2.remove();
      break;
    }
case 10: {
  header.hidden = false;
  paragraph.hidden = false;

  header.textContent = "Contact Me";
  header.style.color = "#FFD6A0"; // Warm cream-gold like Jupiter's bands
  header.style.backgroundColor = "rgba(80, 30, 0, 0.7)"; // Deep reddish-brown overlay

  paragraph.textContent = "Reach out and start a conversion:";
  paragraph.style.color = "#FFD6A0";
  paragraph.style.backgroundColor = "rgba(80, 30, 0, 0.7)";

  const button = document.createElement("button");
  button.textContent = "Email Me";
  button.className = "contactButtonJupiter";
  button.id = "contactbutton";
  button.onclick = () => {
    window.location.href = "mailto:jacob.w.chambliss@gmail.com"; 
  };

  button.style.position = "absolute";
  button.style.paddingTop = "10px";
  button.style.top = "71%";
  button.style.left = "50%";
  button.style.transform = "translate(-50%, -50%)";
  button.style.zIndex = "1002";

  document.getElementById("solarSystem").appendChild(button);
  break;
}

    case 11: {
      header.hidden = true;
      paragraph.hidden = true;
      break;
    }
    case 12: {
      header.hidden = false;
      paragraph.hidden = false; 
        header.style.color = "#FFF8E1"; 
        paragraph.style.color = "#FFF8E1"; // Off-white text
        paragraph.style.backgroundColor = "rgba(100, 80, 40, 0.7)"; // Brownish transparent bg
        break;
    }
    case 13: {
      header.hidden = true;
      paragraph.hidden = true;
      break;
    }
    case 14: {
      header.hidden = false;
      paragraph.hidden = false; 
      header.style.backgroundColor = "rgb(25, 25, 112)";
        header.style.color = "#C4F0F0"; 
        paragraph.style.color = "#C4F0F0"; // Pale cyan text
        paragraph.style.backgroundColor = "rgba(20, 50, 50, 0.6)"; // Dark teal transparent bg
        const buttt = document.getElementById("contactbutton");
        if (buttt) {
          buttt.style.background = "linear-gradient(135deg,rgb(0, 0, 139), rgb(72, 61, 139))";
        }
        break;
    }
    case 15: {
      header.hidden = true;
      paragraph.hidden = true;
      break;
    }
    case 16: {
      header.hidden = false;
      paragraph.hidden = false; 
        header.style.color = "#B0D9FF";
        paragraph.style.color = "#B0D9FF"; // Light blue text
        const buttt = document.getElementById("contactbutton");
        if (buttt) {
          buttt.style.background = "linear-gradient(135deg,rgb(0, 0, 139), rgb(72, 61, 139))";
        }
        paragraph.style.backgroundColor = "rgba(0, 0, 80, 0.7)"; // Deep navy transparent bg
        break;
    }
    case 17: {
      header.hidden = true;
      paragraph.hidden = true;
      break;
    }
    case 18: {
      header.hidden = false;
      paragraph.hidden = false; 
        header.style.color = "#D3D3D3";
        paragraph.style.color = "#D3D3D3"; // Light gray text
        const buttt = document.getElementById("contactbutton");
        if (buttt) {
          buttt.style.background = "linear-gradient(135deg,rgb(50,50,50), rgba(50,50,50,.7))";
        }
        header.style.backgroundColor = "rgba(50, 50, 50, 0.7)"; // Dark gray transparent bg
        paragraph.style.backgroundColor = "rgba(50, 50, 50, 0.7)"; // Dark gray transparent bg
        break;
    }
    case 19: {
      header.hidden = true;
      paragraph.hidden = true;
      const oldImageDiv2 = document.getElementById("contactbutton");
      if (oldImageDiv2) oldImageDiv2.remove();
      break;
    }
}

}
