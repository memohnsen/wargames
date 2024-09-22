// References to HTML elements
const outputDiv = document.getElementById("output");
const rankingsDiv = document.getElementById("rankings");
const playerNameInput = document.getElementById("player-name");
const setPlayerNameButton = document.getElementById("set-player-name");
const startCompetitionButton = document.getElementById("start-competition");
const resetCompetitionButton = document.getElementById("reset-competition");

// References to weight input elements
const weightInputSection = document.getElementById("weight-input-section");
const weightInputTitle = document.getElementById("weight-input-title");
const playerWeightInput = document.getElementById("player-weight");
const submitWeightButton = document.getElementById("submit-weight");

// Variable to hold the resolve function of the player input promise
let playerInputResolve;

// Player's athlete object
let playerAthlete;

// Event listener for the Set Name button
setPlayerNameButton.addEventListener("click", setPlayerName);

// Event listener for the Start Competition button
startCompetitionButton.addEventListener("click", () => {
  runCompetition();
});

// Event listener for the Reset Competition button
resetCompetitionButton.addEventListener("click", resetCompetition);

// Event listener for submit weight button
submitWeightButton.addEventListener("click", submitPlayerWeight);

// Add event listener for Enter key press in the weight input field
playerWeightInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    submitPlayerWeight();
  }
});

// Add event listener for Enter key press in the name input field
playerNameInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    setPlayerName();
  }
});

// Function to set the player's name
function setPlayerName() {
  const name = playerNameInput.value.trim();
  if (name !== "") {
    // Create the player's athlete object
    playerAthlete = { name: name, weight: 96.0, snatch: 112, cj: 140 };
    // Enable the Start Competition button
    startCompetitionButton.disabled = false;
    // Disable the name input section
    playerNameInput.disabled = true;
    setPlayerNameButton.disabled = true;
    // Optionally, hide the name input section
    // document.getElementById("player-name-section").style.display = "none";
  } else {
    alert("Please enter a valid name.");
  }
}

// Function to reset the competition
function resetCompetition() {
  // Reset all variables and UI elements to their initial states
  playerNameInput.value = "";
  playerNameInput.disabled = false;
  setPlayerNameButton.disabled = false;
  startCompetitionButton.disabled = true;

  outputDiv.innerHTML = "";
  rankingsDiv.innerHTML = "";
  document.getElementById("competition-board").innerHTML = "";
  weightInputSection.style.display = "none";
  document.getElementById("next-button").style.display = "none";

  // Reset player athlete
  playerAthlete = null;
}

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

// Function to simulate an attempt
function simulateAttempt(weight) {
  // 60% chance of success
  return Math.random() < 0.6;
}

// Initialize competition board
let competitionBoard;
function initializeCompetition() {
  // List of athletes (excluding the player's athlete for now)
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

  // Add the player's athlete to the list
  athletes.push(playerAthlete);

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

// Function to check if an athlete has missed all attempts in a lift
function hasMissedAllAttempts(athlete, lift) {
  return (
    athlete[`${lift}1_result`] === "Fail" &&
    athlete[`${lift}2_result`] === "Fail" &&
    athlete[`${lift}3_result`] === "Fail" &&
    athlete[`${lift}1`] !== null &&
    athlete[`${lift}2`] !== null &&
    athlete[`${lift}3`] !== null
  );
}

// Function to display the competition board
function displayCompetitionBoard(lift) {
  let boardDiv = document.getElementById("competition-board");
  boardDiv.innerHTML = "";

  let table = document.createElement("table");
  let headerRow = document.createElement("tr");
  let headers = ["Name", "Weight"];

  for (let i = 1; i <= 3; i++) {
    headers.push(`${lift}${i}`);
  }
  headers.push(`${lift}_best`);

  // If lift is "cj", add "Total" column
  if (lift === "cj") {
    headers.push("Total");
  }

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
    let allAttemptsMade = athlete[`${lift}1`] !== null && athlete[`${lift}2`] !== null && athlete[`${lift}3`] !== null;
    if (allAttemptsMade && athlete[`${lift}_best`] === null && hasMissedAllAttempts(athlete, lift)) {
      bestCell.textContent = "DNF";
      bestCell.classList.add("dnf");
    } else {
      bestCell.textContent = athlete[`${lift}_best`] !== null ? athlete[`${lift}_best`] : "";
    }
    row.appendChild(bestCell);

    // If lift is "cj", add "Total" cell
    if (lift === "cj") {
      let totalCell = document.createElement("td");
      let snatchBest = athlete["snatch_best"];
      let cjBest = athlete["cj_best"];
      let allSnatchAttemptsMade = hasMissedAllAttempts(athlete, "snatch") || athlete["snatch_best"] !== null;
      let allCjAttemptsMade = hasMissedAllAttempts(athlete, "cj") || athlete["cj_best"] !== null;

      if (allSnatchAttemptsMade && allCjAttemptsMade) {
        if (snatchBest === null || cjBest === null) {
          totalCell.textContent = "DNF";
          totalCell.classList.add("dnf");
        } else {
          totalCell.textContent = snatchBest + cjBest;
        }
      } else {
        totalCell.textContent = "";
      }
      row.appendChild(totalCell);
    }

    table.appendChild(row);
  });

  boardDiv.appendChild(table);
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

        if (athlete.name === playerAthlete.name) {
          if (attemptResults.length > 0) {
            outputDiv.innerHTML = attemptResults.join('<br>');
            attemptResults = [];
          } else {
            outputDiv.innerHTML = "";
          }

          weight = await getPlayerInput(`${playerAthlete.name}'s turn for ${lift} attempt ${attempt_num}:`);
          if (weight === null) {
            outputDiv.innerHTML += `${playerAthlete.name} skipped ${lift} attempt ${attempt_num}.<br>`;
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
  // Create a container for the rankings
  let rankingsContainer = document.createElement("div");

  if (lift === "snatch") {
    let ranking = competitionBoard.slice();

    ranking.sort((a, b) => {
      // Handle DNF cases
      if (hasMissedAllAttempts(a, "snatch")) return 1;
      if (hasMissedAllAttempts(b, "snatch")) return -1;

      // Both have snatch_best
      return b.snatch_best - a.snatch_best || a.weight - b.weight;
    });

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
      rankCell.textContent = hasMissedAllAttempts(athlete, "snatch") ? "" : index + 1;
      row.appendChild(rankCell);

      let nameCell = document.createElement("td");
      nameCell.textContent = athlete.name;
      row.appendChild(nameCell);

      let bestCell = document.createElement("td");
      if (hasMissedAllAttempts(athlete, "snatch")) {
        bestCell.textContent = "DNF";
        bestCell.classList.add("dnf");
      } else {
        bestCell.textContent = athlete.snatch_best !== null ? athlete.snatch_best : "";
      }
      row.appendChild(bestCell);

      table.appendChild(row);
    });

    rankingsContainer.innerHTML = "<h2>Snatch Rankings:</h2>";
    rankingsContainer.appendChild(table);

  } else if (lift === "total") {
    competitionBoard.forEach(athlete => {
      if (
        (hasMissedAllAttempts(athlete, "snatch") || athlete.snatch_best === null) ||
        (hasMissedAllAttempts(athlete, "cj") || athlete.cj_best === null)
      ) {
        athlete.total = "DNF";
      } else {
        athlete.total = athlete.snatch_best + athlete.cj_best;
      }
    });

    let ranking = competitionBoard.slice();

    ranking.sort((a, b) => {
      // Handle DNF cases
      if (a.total === "DNF" && b.total === "DNF") return 0;
      if (a.total === "DNF") return 1;
      if (b.total === "DNF") return -1;

      // Both totals are numbers
      return b.total - a.total || a.weight - b.weight;
    });

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
      rankCell.textContent = athlete.total === "DNF" ? "" : index + 1;
      row.appendChild(rankCell);

      let nameCell = document.createElement("td");
      nameCell.textContent = athlete.name;
      row.appendChild(nameCell);

      let snatchCell = document.createElement("td");
      if (hasMissedAllAttempts(athlete, "snatch")) {
        snatchCell.textContent = "DNF";
        snatchCell.classList.add("dnf");
      } else {
        snatchCell.textContent = athlete.snatch_best !== null ? athlete.snatch_best : "";
      }
      row.appendChild(snatchCell);

      let cjCell = document.createElement("td");
      if (hasMissedAllAttempts(athlete, "cj")) {
        cjCell.textContent = "DNF";
        cjCell.classList.add("dnf");
      } else {
        cjCell.textContent = athlete.cj_best !== null ? athlete.cj_best : "";
      }
      row.appendChild(cjCell);

      let totalCell = document.createElement("td");
      if (athlete.total === "DNF") {
        totalCell.textContent = "DNF";
        totalCell.classList.add("dnf");
      } else {
        totalCell.textContent = athlete.total;
      }
      row.appendChild(totalCell);

      table.appendChild(row);
    });

    rankingsContainer.innerHTML = "<h2>Total Rankings:</h2>";
    rankingsContainer.appendChild(table);
  }

  // Append rankings to the rankingsDiv
  rankingsDiv.appendChild(rankingsContainer);
}

// Function to wait for the "Next" button click
function waitForNextButton() {
  return new Promise((resolve) => {
    const nextButton = document.getElementById("next-button");
    nextButton.style.display = "block"; // Show the button

    nextButton.addEventListener("click", function handleClick() {
      nextButton.style.display = "none"; // Hide the button
      nextButton.removeEventListener("click", handleClick); // Remove the listener
      resolve();
    });
  });
}

// Function to run the competition
async function runCompetition() {
  outputDiv.innerHTML = "";
  rankingsDiv.innerHTML = ""; // Clear rankings
  document.getElementById("competition-board").innerHTML = ""; // Clear competition board

  initializeCompetition();

  competitionBoard.sort((a, b) => a.snatch1 - b.snatch1);

  outputDiv.innerHTML += "Snatch Attempts:<br>";

  await processAttempts("snatch");

  // Display snatch rankings
  displayRankings("snatch");

  // Display competition board and show "Next" button
  displayCompetitionBoard("snatch");

  // Wait for user to click "Next" before proceeding
  await waitForNextButton();

  // Proceed to clean and jerks
  competitionBoard.sort((a, b) => a.cj1 - b.cj1);

  outputDiv.innerHTML += "<br>Clean & Jerk Attempts:<br>";

  await processAttempts("cj");

  // Clear previous rankings (snatch rankings)
  rankingsDiv.innerHTML = "";

  // Display total rankings
  displayRankings("total");
}
