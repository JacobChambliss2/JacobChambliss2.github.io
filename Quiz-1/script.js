const questions = document.querySelectorAll(".question");
const answers = document.querySelectorAll(".answer");
const body = document.querySelector("body");
let currentQ = 0;
const choices = [];

// Show the first question initially
questions[currentQ].classList.add("visible");

// Add click listener to each answer
answers.forEach(btn => {
    btn.addEventListener("click", () => {
        // Store the selected answer's text
        choices.push(btn.textContent.trim());

        // Hide current question
        questions[currentQ].classList.remove("visible");

        // Move to next question if available
        currentQ++;
        if (currentQ < questions.length) {
            questions[currentQ].classList.add("visible");
        } else {
            // All questions answered — show result
            showResult(choices);
        }
    });
});

function showResult(choices) {
    const resultDiv = document.getElementById("result");
    resultDiv.style.textAlign = "center";
    resultDiv.style.marginTop = "20px";

    let deck = "";
    let cards = [];

    if (choices[0] === "Slow" && choices[1] === "Ground" && choices[2] === "Offense") {
        deck = "Giant Double Prince";
        cards = ["Giant", "Dark Prince", "Prince", "Mega Minion", "Zap", "Arrows", "Electro Wizard", "Tornado"];
    } else if (choices[0] === "Slow" && choices[1] === "Ground" && choices[2] === "Defense") {
        deck = "Golem Beatdown";
        cards = ["Golem", "Baby Dragon", "Night Witch", "Tornado", "Lightning", "Bomber", "Phoenix", "Barbarian Barrel"];
    } else if (choices[0] === "Slow" && choices[1] === "Air" && choices[2] === "Offense") {
        deck = "LavaLoon";
        cards = ["Lava Hound", "Balloon", "Mega Minion", "Tombstone", "Zap", "Fireball", "Skeleton Dragons", "Guards"];
    } else if (choices[0] === "Slow" && choices[1] === "Air" && choices[2] === "Defense") {
        deck = "Lava Hound Control";
        cards = ["Lava Hound", "Inferno Dragon", "Flying Machine", "Tombstone", "Barbarian Barrel", "Arrows", "Fireball", "Guards"];
    } else if (choices[0] === "Rush" && choices[1] === "Ground" && choices[2] === "Offense") {
        deck = "Hog Cycle";
        cards = ["Hog Rider", "Ice Spirit", "Skeletons", "Cannon", "Log", "Fireball", "Musketeer", "Ice Golem"];
    } else if (choices[0] === "Rush" && choices[1] === "Ground" && choices[2] === "Defense") {
        deck = "Miner Control";
        cards = ["Miner", "Bomb Tower", "Poison", "Wall Breakers", "Magic Archer", "Log", "Skeletons", "Ice Spirit"];
    } else if (choices[0] === "Rush" && choices[1] === "Air" && choices[2] === "Offense") {
        deck = "Balloon Cycle";
        cards = ["Balloon", "Ice Golem", "Musketeer", "Cannon", "Ice Spirit", "Fireball", "Skeletons", "Log"];
    } else if (choices[0] === "Rush" && choices[1] === "Air" && choices[2] === "Defense") {
        deck = "Electro Dragon Control";
        cards = ["Electro Dragon", "Baby Dragon", "Tornado", "Bowler", "Ice Wizard", "Lightning", "Tombstone", "Barbarian Barrel"];
    } else {
        deck = "Unknown Deck";
        cards = ["No matching cards"];
    }

    resultDiv.innerHTML = `
        <h2>Your Deck: <strong>${deck}</strong></h2>
        <ul>${cards.map(card => `<li>${card}</li>`).join("")}</ul>
    `;
}


