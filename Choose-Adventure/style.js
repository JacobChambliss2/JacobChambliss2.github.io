function inspect(choice) {
  const text = document.getElementById("storyText");
  
  switch(choice) {
    case 'left':
      text.innerText = "The left wall is adorned with mysterious symbols. They glow gently in the dim light.";
      break;
    case 'right':
      text.innerText = "The right wall appears smooth, yet you notice subtle scratches as if something once escaped.";
      break;
    case 'floor':
      text.innerText = "The floor is cold and made of stone, each tile perfectly aligned with its neighbor.";
      break;
    default:
      text.innerText = "You sit silently, absorbing the details of your surroundings.";
  }
}
