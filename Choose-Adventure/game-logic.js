// Global game state, including progress and inventory.
const gameState = {
    progress: 0,         // 0: not solved, 1: left solved, 2: floor solved, 3: ceiling solved, 4: final front
    inventory: [],       // collected items
    puzzlesSolved: {},   // keyed by wall id
    currentFace: null,
    faceTimer: null,
};

// References to wall elements
const walls = {
    front: document.getElementById('front-wall'),
    back: document.getElementById('back-wall'),
    left: document.getElementById('left-wall'),
    right: document.getElementById('right-wall'),
    floor: document.getElementById('floor-wall'),
    ceiling: document.getElementById('ceiling-wall'),
};

// Update wall content
function updateWall(wallId, content) {
    walls[wallId].innerHTML = content;
}

// Update the inventory display
function updateInventoryDisplay() {
    const invElem = document.getElementById('inventory-items');
    invElem.textContent = gameState.inventory.length ? gameState.inventory.join(', ') : 'None';
}

function addToInventory(item) {
    if (!gameState.inventory.includes(item)) {
        gameState.inventory.push(item);
        updateInventoryDisplay();
    }
}

// Global handler called by cube-controls.js after a snap.
window.onFaceSnap = function(faceId) {
    gameState.currentFace = faceId;
    console.log("Snapped to face:", faceId, "Progress:", gameState.progress);
    // Check progression based on the current face.
    if (faceId === 'left' && gameState.progress === 0) {
        console.log("Triggering left puzzle (Key Enigma)");
        setupLeftPuzzle(); // advanced key puzzle on left wall
    } else if (faceId === 'floor' && gameState.progress === 1) {
        console.log("Triggering floor puzzle (Sigils of the Shadow)");
        setupFloorPuzzle(); // advanced symbols puzzle on floor
    } else if (faceId === 'ceiling' && gameState.progress === 2) {
        console.log("Triggering ceiling puzzle (Cryptic Map Riddle)");
        setupCeilingPuzzle(); // advanced map/riddle on ceiling
    } else if (faceId === 'front' && gameState.progress === 3) {
        console.log("Triggering final front slide (Escape Challenge)");
        updateFrontFinal(); // final slide on front wall
    } else {
        console.log("No progression triggered for this face.");
    }
};

// --------------------------
// Advanced Left Puzzle: "The Key Enigma"
// A 3x3 grid appears. The user must click the five images that form a cross:
// Positions (using 0-indexed grid): 1 (top-center), 3 (middle left), 4 (center), 5 (middle right), 7 (bottom-center).
function setupLeftPuzzle() {
    updateWall('left', `
        <div class="wall-text-group">
            <div class="wall-text">The Key Enigma<br>Select the five pieces whose value add to 20 and form two lines.</div>
            <div id="left-puzzle" style="display: grid; grid-template-columns: repeat(3, 30%); gap: 5%;">
                ${[1,2,3,4,5,6,7,8,9].map(i => 
                    `<img src="images/key.png" class="key_img" data-index="${i}" alt="Piece ${i}" style="width:100%; cursor:pointer;">`
                ).join('')}
            </div>
        </div>
    `);
    const required = new Set([2,3,5,7,8]);
    let selected = new Set();
    const container = document.getElementById('left-puzzle');
    container.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', () => {
            const idx = parseInt(img.getAttribute('data-index'));
            // Toggle selection
            if(selected.has(idx)) {
                selected.delete(idx);
                img.style.border = "none";
            } else {
                selected.add(idx);
                img.style.border = "3px solid lime";
            }
            // If five selections have been made, check them.
            if(selected.size === 5) {
                let correct = true;
                required.forEach(val => {
                    if(!selected.has(val)) correct = false;
                });
                if(correct) {
                    addToInventory('Rusty Key');
                    updateWall('left', `
                        <div class="wall-text-group">
                            <div class="wall-text">The pieces lock into place, and a Rusty Key is yours.</div>
                        </div>
                    `);
                    gameState.puzzlesSolved.left = true;
                    gameState.progress = 1;
                } else {
                    updateWall('left', `
                        <div class="wall-text-group">
                            <div class="wall-text">The pieces crumble... try again.</div>
                        </div>
                    `);
                    setTimeout(setupLeftPuzzle, 1500);
                }
            }
        });
    });
}

// --------------------------
// Advanced Floor Puzzle: "Sigils of the Shadow"
// A 2x2 grid of symbols is shown. The correct order is clockwise from top-left.
function setupFloorPuzzle() {
    updateWall('floor', `
        <div class="wall-text-group">
            <div class="wall-text">The Sigils of the Shadow<br>Click the symbols in clockwise order starting at top-left.</div>
            <div class="sigils" id="floor-puzzle" style="display: grid; grid-template-columns: repeat(2, 45%); gap: 10%;">
                <img src="images/sigil1.png" data-order="1" alt="Sigil 1" style="width:100%; cursor:pointer;">
                <img src="images/sigil2.png" data-order="2" alt="Sigil 2" style="width:100%; cursor:pointer;">
                <img src="images/sigil2.png" data-order="4" alt="Sigil 4" style="width:100%; cursor:pointer;">
                <img src="images/sigil1.png" data-order="3" alt="Sigil 3" style="width:100%; cursor:pointer;">
            </div>
        </div>
    `);
    const container = document.getElementById('floor-puzzle');
    let clickSequence = [];
    container.querySelectorAll('img').forEach(img => {
        img.addEventListener('click', () => {
            clickSequence.push(parseInt(img.getAttribute('data-order')));
            if(clickSequence.length === 4) {
                if(clickSequence.join() === [1,2,3,4].join()) {
                    addToInventory('Silver Symbol');
                    updateWall('floor', `
                        <div class="wall-text-group">
                            <div class="wall-text">The sigils align, gifting you a Silver Symbol.</div>
                        </div>
                    `);
                    gameState.puzzlesSolved.floor = true;
                    gameState.progress = 2;
                } else {
                    updateWall('floor', `
                        <div class="wall-text-group">
                            <div class="wall-text">The sigils fade... the order was wrong.</div>
                        </div>
                    `);
                    setTimeout(setupFloorPuzzle, 1500);
                }
            }
        });
    });
}

// --------------------------
// Advanced Ceiling Puzzle: "The Cryptic Map Riddle"
// The ceiling now displays a mysterious map with three hotspots that must be clicked in the correct order.
// For example, required sequence: hotspot A, then hotspot B, then hotspot C.
function setupCeilingPuzzle() {
    updateWall('ceiling', `
        <div class="wall-text-group">
            <div class="wall-text">The Cryptic Map Riddle<br>Click the landmarks in order: Mountain, Lake, Forest.</div>
            <div id="ceiling-puzzle" style="position: relative;">
                <img src="images/map.jpg" alt="Map" style="width:100%;">
                <!-- Overlay clickable hotspots positioned absolutely -->
                <div data-order="1" class="hotspot" style="position: absolute; top:30%; left:28%; width:23%; height:40%; cursor:pointer; border: 10px solid transparent;"></div>
                <div data-order="2" class="hotspot" style="position: absolute; top:12%; left:73%; width:12%; height:18%; cursor:pointer; border: 10px solid transparent;"></div>
                <div data-order="3" class="hotspot" style="position: absolute; top:32%; left:50%; width:17%; height:35%; cursor:pointer; border: 2px solid transparent;"></div>
            </div>
        </div>
    `);
    const container = document.getElementById('ceiling-puzzle');
    let clickSequence = [];
    container.querySelectorAll('.hotspot').forEach(hotspot => {
        hotspot.addEventListener('click', () => {
            hotspot.style.border = "2px solid lime";  // Visual feedback
            clickSequence.push(parseInt(hotspot.getAttribute('data-order')));
            if(clickSequence.length === 3) {
                if(clickSequence.join() === [1,2,3].join()) {
                    updateWall('ceiling', `
                        <div class="wall-text-group">
                            <div class="wall-text">The map reveals a hidden passage.</div>
                        </div>
                    `);
                    gameState.progress = 3;
                } else {
                    updateWall('ceiling', `
                        <div class="wall-text-group">
                            <div class="wall-text">The landmarks blur... the riddle remains unsolved.</div>
                        </div>
                    `);
                    setTimeout(setupCeilingPuzzle, 1500);
                }
            }
        });
    });
}

// --------------------------
// Final Front Slide: Escape Challenge
function updateFrontFinal() {
    if (gameState.inventory.includes('Rusty Key') && gameState.inventory.includes('Silver Symbol') && gameState.progress >= 3) {
        updateWall('front', `
            <div class="wall-text-group">
                <button id="escape-button" style="font-size: 5vmin; padding: 10px 20px; cursor: pointer;">Do You Dare Escape?</button>
            </div>
        `);
        document.getElementById('escape-button').addEventListener('click', () => {
            updateWall('front', `
                <div class="wall-text-group">
                    <img src="images/escape.jpg" alt="Escape" style="width:100%; height:100%;">
                </div>
            `);
        });
        gameState.progress = 4;
    } else {
        updateWall('front', `
            <div class="wall-text-group">
                <div class="wall-text">You still lack the necessary clues to escape...</div>
            </div>
        `);
    }
}
