/* 
This file starts at as the webpage loads and flickers the intro text in order
to recreate the effect of a neon sign.

Css classes that represent high brightness and low brightness are transitioned between
in order to create this effect.

In the end, the text slowely gets brighter over time, suddenly "blows", and then scrolls
to the next page

The function runfromtop() in circle.js is ran at the end

*/
document.addEventListener('DOMContentLoaded', () => {

  const h1s = document.querySelectorAll('#intro-text h1');
  if (h1s.length < 2) return;
  const [first, second] = h1s;

  function setClass(el, cls) {
    el.classList.remove('flicker', 'flicker-strong', 'blown');
    if (cls) el.classList.add(cls);
  }

  // Step 1: Flicker first
  function flickerFirst(count = 0) {
    setClass(first, count % 2 ? 'flicker' : '');
    if (count < 8) {
      setTimeout(() => flickerFirst(count + 1), 100);
    } else {
      setClass(first, 'flicker');
      setTimeout(() => flickerSecond(), 300);
    }
  }
  // Step 2: Flicker second
  function flickerSecond(count = 0) {
    setClass(second, count % 2 ? 'flicker' : '');
    if (count < 8) {
      setTimeout(() => flickerSecond(count + 1), 90);
    } else {
      setClass(second, 'flicker');
      setTimeout(() => bothBright(), 1100);
    }
  }
  // Step 3: Both max bright
  function bothBright() {
    setClass(first, 'flicker-strong');
    setClass(second, 'flicker-strong');
    setTimeout(() => blowOut(), 20);
  }
  // Step 4: Both blown out
  function blowOut(count = 0) {
    if (count < 2) {
      setClass(first, count % 2 ? 'blown' : 'flicker-strong');
      setClass(second, count % 2 ? 'blown' : 'flicker-strong');
      setTimeout(() => blowOut(count + 1), 30);
    } else {
      setClass(first, 'blown');
      setClass(second, 'blown');
      // Play sound when the lights blow
      const audio = new Audio('audio/NeonClip2.mp4'); 
      audio.play();
      setTimeout(() => afterBlown(), 100);

    }
  }
  function afterBlown() {
    const section2 = document.querySelector('.section2');
    if (section2) {
      // Scroll to the bottom of section2
      section2.scrollIntoView({ behavior: 'smooth', block: 'end' });
      setTimeout(squarefromtop(), 1000);

    }
  }

  // Start sequence
  setClass(first, '');
  setClass(second, '');
  setTimeout(() => flickerFirst(), 200);
});