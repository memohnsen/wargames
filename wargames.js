// List of athletes
let athletes = [
  { name: "Spencer", weight: 96.0, snatch: 120, cj: 150 },
  { name: "Adam", weight: 96.0, snatch: 115, cj: 145 },
  { name: "Angela", weight: 96.0, snatch: 118, cj: 148 },
  { name: "David", weight: 96.0, snatch: 122, cj: 152 },
  { name: "Nate", weight: 96.0, snatch: 110, cj: 140 },
  { name: "Jessie", weight: 96.0, snatch: 110, cj: 141 },
  { name: "Grace", weight: 96.0, snatch: 113, cj: 149 },
  { name: "Jordan", weight: 96.0, snatch: 119, cj: 138 },
  { name: "Morghan", weight: 96.0, snatch: 122, cj: 153 },
  { name: "Maddisen", weight: 96.0, snatch: 114, cj: 144 }
];

// Function to add coach's athlete
function addCoachAthlete(name, weight, snatch, cj) {
  athletes.push({ name: name, weight: weight, snatch: snatch, cj: cj });
}

// Add the coach's athlete
addCoachAthlete("Player", 96.0, 112, 140);

// Competition data
let competitionBoard;
let currentLift;
let outputDiv = document.getElementById("output");
let rankingsDiv = document.getElementById("rankings");

// References to weight input elements
const weightInputSection = document.getElementById("weight-input-section");
const weightInputTitle = document.getElementById("weight-input-title");
const playerWeightInput = document.getElementById("player-weight");
const submitWeightButton = document.getElementById("submit-weight");

// Variable to hold the resolve function of the player input promise
let playerInputResolve;

// Event listener for submit button
submitWeightButton.addEventListener("click", submitPlayerWeight);

// Add event listener for Enter key press in the input field
playerWeightInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    submitPlayerWeight();
  }
});

// Function to handle player weight submission
function submitPlayerWeight() {
  const weight = parseInt(playerWeightInput.value);
  if (!isNaN(weight) && weight > 0) {
    weightInputSection.style.display = "none";
    playerInputResolve(weight);
  } else {
    alert("Please enter a valid weight.");
  }
}

// Function to simulate an attempt
function simulateAttempt(weight) {
  // 60% chance of success
  return Math.random() < 0.6;
}

// Initialize competition board
function initializeCompetition() {
  competitionBoard = athletes.map(athlete => ({
    ...athlete,
    snatch1: athlete.snatch,
    snatch2: null,
    snatch3: null,
    snatch_best: null,
    cj1: athlete.cj,
    cj2: null,
    cj3: null,
    cj_best: null,
    total: null,
    attempts: [],
    currentAttemptIndex: 0
  }));
}

// Function to display the competition board
function displayCompetitionBoard(lift) {
  let boardDiv = document.getElementById("competition-board");
  boardDiv.innerHTML = "";

  let table = document.createElement("table");
  let headerRow = document.createElement("tr");
  let headers = ["Name", "Weight Class"];

  for (let i = 1; i <= 3; i++) {
    headers.push(`${lift}${i}`);
  }
  headers.push(`${lift}_best`);

  headers.forEach(headerText => {
    let th = document.createElement("th");
    th.textContent = headerText.replace("_", " ").toUpperCase();
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  competitionBoard.forEach(athlete => {
    let row = document.createElement("tr");

    // Name cell
    let nameCell = document.createElement("td");
    nameCell.textContent = athlete.name;
    row.appendChild(nameCell);

    // Weight cell
    let weightCell = document.createElement("td");
    weightCell.textContent = athlete.weight;
    row.appendChild(weightCell);

    // Attempt cells
    for (let i = 1; i <= 3; i++) {
      let attemptWeight = athlete[`${lift}${i}`];
      let attemptResult = athlete[`${lift}${i}_result`];

      // Weight cell
      let weightCell = document.createElement("td");
      weightCell.textContent = attemptWeight !== null ? attemptWeight : "";

      // Apply classes
      if (attemptResult === "Success") {
        weightCell.classList.add("success");
      } else if (attemptResult === "Fail") {
        weightCell.classList.add("failure");
      }

      row.appendChild(weightCell);
    }

    // Best lift cell
    let bestCell = document.createElement("td");
    bestCell.textContent = athlete[`${lift}_best`] !== null ? athlete[`${lift}_best`] : "";
    row.appendChild(bestCell);

    table.appendChild(row);
  });

  boardDiv.appendChild(table);
}

// Function to get player input
function getPlayerInput(message) {
  return new Promise((resolve) => {
    weightInputTitle.textContent = message;
    playerWeightInput.value = ""; // Clear previous input
    weightInputSection.style.display = "block";
    playerWeightInput.focus(); // Focus on the input field
    playerInputResolve = resolve;
  });
}

// Function to process attempts for a lift
async function processAttempts(lift) {
  competitionBoard.forEach((athlete, index) => {
    athlete.attempts = [{
      name: athlete.name,
      attempt_num: 1,
      weight: athlete[`${lift}1`],
      initial_weight: athlete[`${lift}1`],
      order: index
    }];
    athlete.currentAttemptIndex = 0;
  });

  let attempts = competitionBoard.flatMap(athlete => athlete.attempts);
  attempts.sort((a, b) => a.initial_weight - b.initial_weight || a.order - b.order);

  let attemptResults = [];
  let currentWeight = Math.min(...attempts.map(attempt => attempt.initial_weight));

  while (attempts.length > 0) {
    let attemptMade = false;
    for (let i = 0; i < attempts.length; i++) {
      let attempt = attempts[i];
      if (attempt.weight !== null && attempt.weight <= currentWeight) {
        let athlete = competitionBoard.find(a => a.name === attempt.name);
        let attempt_num = attempt.attempt_num;
        let weight = attempt.weight;

        if (athlete.name === "Player") {
          if (attemptResults.length > 0) {
            outputDiv.innerHTML = attemptResults.join('<br>');
            attemptResults = [];
          } else {
            outputDiv.innerHTML = "";
          }

          weight = await getPlayerInput(`Player's turn for ${lift} attempt ${attempt_num}:`);
          if (weight === null) {
            outputDiv.innerHTML += `Player skipped ${lift} attempt ${attempt_num}.<br>`;
            attempts.splice(i, 1);
            i--;
            continue;
          }
          attempt.weight = weight;

          let result = simulateAttempt(weight);
          athlete[`${lift}${attempt_num}`] = weight;
          athlete[`${lift}${attempt_num}_result`] = result ? "Success" : "Fail";

          if (result) {
            let bestCol = `${lift}_best`;
            let currentBest = athlete[bestCol];
            if (currentBest === null || weight > currentBest) {
              athlete[bestCol] = weight;
            }
          }

          outputDiv.innerHTML += `<br>${athlete.name} (${lift} attempt ${attempt_num} at ${weight} kg): ${result ? "Success" : "Fail"}<br>`;

        } else {
          let result = simulateAttempt(weight);
          athlete[`${lift}${attempt_num}`] = weight;
          athlete[`${lift}${attempt_num}_result`] = result ? "Success" : "Fail";

          if (result) {
            let bestCol = `${lift}_best`;
            let currentBest = athlete[bestCol];
            if (currentBest === null || weight > currentBest) {
              athlete[bestCol] = weight;
            }
          }

          attemptResults.push(`${athlete.name} (${lift} attempt ${attempt_num} at ${weight} kg): ${result ? "Success" : "Fail"}`);
        }

        if (attempt_num < 3) {
          let next_attempt_num = attempt_num + 1;
          let next_weight;

          if (athlete[`${lift}${attempt_num}_result`] === "Success") {
            next_weight = weight + Math.floor(Math.random() * 3) + 3;
          } else {
            next_weight = Math.random() < 0.1 ? weight + 1 : weight;
          }

          athlete[`${lift}${next_attempt_num}`] = next_weight;
          athlete.attempts.push({
            name: athlete.name,
            attempt_num: next_attempt_num,
            weight: next_weight,
            initial_weight: next_weight,
            order: attempt.order
          });
        }

        attempts.splice(i, 1);
        i--;

        if (athlete.attempts.length > athlete.currentAttemptIndex + 1) {
          athlete.currentAttemptIndex++;
          attempts.push(athlete.attempts[athlete.currentAttemptIndex]);
        }

        attempts.sort((a, b) => a.initial_weight - b.initial_weight || a.order - b.order);
        displayCompetitionBoard(lift);

        attemptMade = true;
        break;
      }
    }
    if (!attemptMade) {
      currentWeight += 1;
    }
  }

  if (attemptResults.length > 0) {
    outputDiv.innerHTML = attemptResults.join('<br>');
  }
}

// Function to display rankings
function displayRankings(lift) {
  let rankingsContainer = document.createElement("div");

  if (lift === "snatch") {
    let ranking = competitionBoard.filter(a => a.snatch_best !== null);
    ranking.sort((a, b) => b.snatch_best - a.snatch_best || a.weight - b.weight);

    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
    ["Rank", "Name", "Best Snatch"].forEach(text => {
      let th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    ranking.forEach((athlete, index) => {
      let row = document.createElement("tr");
      let rankCell = document.createElement("td");
      rankCell.textContent = index + 1;
      row.appendChild(rankCell);

      let nameCell = document.createElement("td");
      nameCell.textContent = athlete.name;
      row.appendChild(nameCell);

      let bestCell = document.createElement("td");
      bestCell.textContent = athlete.snatch_best;
      row.appendChild(bestCell);

      row.appendChild(bestCell);
      table.appendChild(row);
    });

    rankingsContainer.innerHTML = "<h2>Snatch Rankings:</h2>";
    rankingsContainer.appendChild(table);

  } else if (lift === "total") {
    competitionBoard.forEach(athlete => {
      athlete.total = (athlete.snatch_best || 0) + (athlete.cj_best || 0);
    });

    let ranking = competitionBoard.filter(a => a.total > 0);
    ranking.sort((a, b) => b.total - a.total || a.weight - b.weight);

    let table = document.createElement("table");
    let headerRow = document.createElement("tr");
    ["Rank", "Name", "Best Snatch", "Best C&J", "Total"].forEach(text => {
      let th = document.createElement("th");
      th.textContent = text;
      headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    ranking.forEach((athlete, index) => {
      let row = document.createElement("tr");
      let rankCell = document.createElement("td");
      rankCell.textContent = index + 1;
      row.appendChild(rankCell);

      let nameCell = document.createElement("td");
      nameCell.textContent = athlete.name;
      row.appendChild(nameCell);

      let snatchCell = document.createElement("td");
      snatchCell.textContent = athlete.snatch_best;
      row.appendChild(snatchCell);

      let cjCell = document.createElement("td");
      cjCell.textContent = athlete.cj_best;
      row.appendChild(cjCell);

      let totalCell = document.createElement("td");
      totalCell.textContent = athlete.total;
      row.appendChild(totalCell);

      table.appendChild(row);
    });

    rankingsContainer.innerHTML = "<h2>Total Rankings:</h2>";
    rankingsContainer.appendChild(table);
  }

  rankingsDiv.appendChild(rankingsContainer);
}

// Function to run the competition
async function runCompetition() {
  outputDiv.innerHTML = "";
  rankingsDiv.innerHTML = ""; // Clear rankings

  initializeCompetition();

  competitionBoard.sort((a, b) => a.snatch1 - b.snatch1);

  outputDiv.innerHTML += "Snatch Attempts:<br>";

  await processAttempts("snatch");

  displayRankings("snatch");

  competitionBoard.sort((a, b) => a.cj1 - b.cj1);

  outputDiv.innerHTML += "<br>Clean & Jerk Attempts:<br>";

  await processAttempts("cj");

  displayRankings("total");
}

// Event listener for the start competition button
document.getElementById("start-competition").addEventListener("click", () => {
  runCompetition();
});
