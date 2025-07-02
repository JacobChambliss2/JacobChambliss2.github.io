let yaw = 0;   // initial yaw (Y axis)
let pitch = 0; // initial pitch (X axis)
const room = document.getElementById('room');

const SNAP_ANGLE = 15; // degrees, combined axis distance

// All possible face configurations (yaw, pitch)
const faces = [
  [0, 0],      // front
  [90, 0],     // right
  [180, 0],    // back
  [-90, 0],    // left
  [0, 90],     // ceiling
  [0, -90],    // floor
  [90, 90],    // ceiling-right corner
  [-90, 90],   // ceiling-left corner
  [180, 90],   // ceiling-back corner
  [90, -90],   // floor-right corner
  [-90, -90],  // floor-left corner
  [180, -90],  // floor-back corner
];

let lastSnappedFace = null;
let snapCooldown = false;

function snapToFace() {
  let minDist = Infinity;
  let closestFace = null;
  for (let i = 0; i < faces.length; i++) {
    const [fy, fp] = faces[i];
    let yawDiff = (((yaw - fy + 540) % 360) - 180);
    let pitchDiff = pitch - fp;
    const dist = Math.sqrt(yawDiff * yawDiff + pitchDiff * pitchDiff);
    if (dist < minDist) {
      minDist = dist;
      closestFace = { yaw: fy, pitch: fp, idx: i };
    }
  }
  if (
    minDist < SNAP_ANGLE &&
    (lastSnappedFace === null || lastSnappedFace !== closestFace.idx)
  ) {
    yaw = closestFace.yaw;
    pitch = closestFace.pitch;
    lastSnappedFace = closestFace.idx;
    snapCooldown = true;
    setTimeout(() => {
      snapCooldown = false;
    }, 500);
    // After snapping, call onFaceSnap with the determined active face.
    if (window.onFaceSnap) {
      window.onFaceSnap(getActiveFace());
    }
  } else if (minDist >= SNAP_ANGLE) {
    lastSnappedFace = null;
  }
}

// Determine active face based on yaw and pitch
function getActiveFace() {
  // If pitch is extreme, choose ceiling or floor
  if (pitch >= 45) return 'ceiling';
  if (pitch <= -45) return 'floor';
  // Otherwise, use yaw to determine horizontal face
  let normYaw = (yaw % 360 + 360) % 360;
  if (normYaw >= 315 || normYaw < 45) return 'front';
  if (normYaw >= 45 && normYaw < 135) return 'right';
  if (normYaw >= 135 && normYaw < 225) return 'back';
  if (normYaw >= 225 && normYaw < 315) return 'left';
  return 'front'; // fallback
}

function updateTransform() {
  room.style.transform = `rotateY(${yaw}deg) rotateX(${pitch}deg)`;
}

document.addEventListener('keydown', (e) => {
  if (snapCooldown) {
    e.preventDefault();
    return;
  }
  const step = 10;
  if (e.key === 'ArrowLeft') {
    yaw -= step;
  } else if (e.key === 'ArrowRight') {
    yaw += step;
  } else if (e.key === 'ArrowUp') {
    pitch = Math.max(pitch - step, -89);
  } else if (e.key === 'ArrowDown') {
    pitch = Math.min(pitch + step, 89);
  } else {
    return;
  }
  snapToFace();
  updateTransform();
  e.preventDefault();
});

// Initialize transform on load
updateTransform();
