// References to HTML elements
const outputDiv = document.getElementById("output");
const rankingsDiv = document.getElementById("rankings");
const playerNameInput = document.getElementById("player-name");
const snatchAttemptInput = document.getElementById("snatch-attempt");
const cjAttemptInput = document.getElementById("cj-attempt");
const setPlayerNameButton = document.getElementById("set-player-name");
const startCompetitionButton = document.getElementById("start-competition");
const resetCompetitionButton = document.getElementById("reset-competition");

// References to weight input elements
const weightInputSection = document.getElementById("weight-input-section");
const weightInputTitle = document.getElementById("weight-input-title");
const playerWeightInput = document.getElementById("player-weight");
const submitWeightButton = document.getElementById("submit-weight");

// References to navigation buttons
const navigationButtons = document.getElementById("navigation-buttons");
const nextButton = document.getElementById("next-button");
const previousButton = document.getElementById("previous-button");

// Variable to hold the resolve function of the player input promise
let playerInputResolve;

// Player's athlete object
let playerAthlete;

// Variable to keep track of the current state
let currentState = 0; // 0: Snatch Results, 1: CJ Starting List, 2: CJ Attempts

// Event listener for the Set Name and Attempts button
setPlayerNameButton.addEventListener("click", setPlayerName);

// Event listener for the Start Competition button
startCompetitionButton.addEventListener("click", () => {
  runCompetition();
});

// Event listener for the Reset Competition button
resetCompetitionButton.addEventListener("click", resetCompetition);

// Event listener for submit weight button
submitWeightButton.addEventListener("click", submitPlayerWeight);

// Event listeners for navigation buttons
nextButton.addEventListener("click", handleNext);
previousButton.addEventListener("click", handlePrevious);

// Add event listener for Enter key press in the weight input field
playerWeightInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    submitPlayerWeight();
  }
});

// Add event listener for Enter key press in the name and attempt input fields
[playerNameInput, snatchAttemptInput, cjAttemptInput].forEach(input => {
  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      setPlayerName();
    }
  });
});

// Function to set the player's name and first attempts
function setPlayerName() {
  const name = playerNameInput.value.trim();
  const snatchAttempt = parseInt(snatchAttemptInput.value);
  const cjAttempt = parseInt(cjAttemptInput.value);

  if (name === "") {
    alert("Please enter a valid name.");
    return;
  }

  // Validate snatch attempt
  if (isNaN(snatchAttempt) || snatchAttempt < 110 || snatchAttempt > 130) {
    alert("Please enter a valid Snatch 1st Attempt between 110 kg and 130 kg.");
    return;
  }

  // Validate clean & jerk attempt
  if (isNaN(cjAttempt) || cjAttempt < 140 || cjAttempt > 155) {
    alert("Please enter a valid Clean & Jerk 1st Attempt between 140 kg and 155 kg.");
    return;
  }

  // Create the player's athlete object with the specified first attempts
  playerAthlete = { name: name, weight: 96.0, snatch: snatchAttempt, cj: cjAttempt };

  // Enable the Start Competition button
  startCompetitionButton.disabled = false;

  // Disable the name and attempt input sections
  playerNameInput.disabled = true;
  snatchAttemptInput.disabled = true;
  cjAttemptInput.disabled = true;
  setPlayerNameButton.disabled = true;
}

// Function to reset the competition
function resetCompetition() {
  // Reset all variables and UI elements to their initial states
  playerNameInput.value = "";
  snatchAttemptInput.value = "";
  cjAttemptInput.value = "";
  playerNameInput.disabled = false;
  snatchAttemptInput.disabled = false;
  cjAttemptInput.disabled = false;
  setPlayerNameButton.disabled = false;
  startCompetitionButton.disabled = true;

  outputDiv.innerHTML = "";
  rankingsDiv.innerHTML = "";
  document.getElementById("competition-board").innerHTML = "";
  weightInputSection.style.display = "none";
  navigationButtons.style.display = "none";
  currentState = 0;

  // Reset player athlete
  playerAthlete = null;
}

// Function to handle player weight submission
function submitPlayerWeight() {
  const weight = parseInt(playerWeightInput.value);
  const minWeight = parseInt(playerWeightInput.min);
  const maxWeight = parseInt(playerWeightInput.max);
  if (!isNaN(weight) && weight >= minWeight && weight <= maxWeight) {
    weightInputSection.style.display = "none";
    playerInputResolve(weight);
  } else {
    alert(`Please enter a valid weight between ${minWeight} kg and ${maxWeight} kg.`);
  }
}

// Function to get player input
function getPlayerInput(message, minWeight, maxWeight) {
  return new Promise((resolve) => {
    weightInputTitle.textContent = message;
    playerWeightInput.value = ""; // Clear previous input
    playerWeightInput.min = minWeight;
    playerWeightInput.max = maxWeight;
    playerWeightInput.placeholder = `${minWeight} kg - ${maxWeight} kg`;
    weightInputSection.style.display = "block";
    playerWeightInput.focus(); // Focus on the input field
    playerInputResolve = resolve;
  });
}

// Function to simulate an attempt with variable success rates
function simulateAttempt(lift, attempt_num) {
  let probability;
  if (attempt_num === 1) {
    probability = 0.75; // 75% for first attempt
  } else if (attempt_num === 2) {
    probability = 0.6;  // 60% for second attempt
  } else if (attempt_num === 3) {
    probability = 0.5;  // 50% for third attempt
  } else {
    probability = 0.6;  // Default to 60% if undefined
  }
  return Math.random() < probability;
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
    { name: "Jordan", weight: 119.0, snatch: 119, cj: 138 },
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

    // Highlight the player's row
    if (athlete.name === playerAthlete.name) {
      row.classList.add("player-row");
    }

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

          // Determine last attempt weight and result
          let lastAttemptWeight;
          let lastAttemptResult;
          if (attempt_num === 1) {
            lastAttemptWeight = athlete[`${lift}1`];
            lastAttemptResult = athlete[`${lift}1_result`];
          } else {
            lastAttemptWeight = athlete[`${lift}${attempt_num - 1}`];
            lastAttemptResult = athlete[`${lift}${attempt_num - 1}_result`];
          }

          // Set minWeight based on last attempt result
          let minWeight;
          if (lastAttemptResult === "Success") {
            minWeight = lastAttemptWeight + 1;
          } else {
            minWeight = lastAttemptWeight;
          }
          let maxWeight = lastAttemptWeight + 10;

          weight = await getPlayerInput(`${playerAthlete.name}'s turn for ${lift} attempt ${attempt_num}:`, minWeight, maxWeight);
          if (weight === null) {
            outputDiv.innerHTML += `${playerAthlete.name} skipped ${lift} attempt ${attempt_num}.<br>`;
            attempts.splice(i, 1);
            i--;
            continue;
          }
          attempt.weight = weight;

          let result = simulateAttempt(lift, attempt_num);
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
          let result = simulateAttempt(lift, attempt_num);
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
            // After a successful lift, minimum next weight is +1 kg
            let minNextWeight = weight + 1;
            let maxNextWeight = weight + 5; // Assuming a max increase of 5 kg
            next_weight = minNextWeight + Math.floor(Math.random() * (maxNextWeight - minNextWeight + 1));
          } else {
            // After a missed lift, same weight with a 10% chance of increasing by 1 kg
            if (Math.random() < 0.1) {
              next_weight = weight + 1;
            } else {
              next_weight = weight;
            }
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

      // Highlight the player's row
      if (athlete.name === playerAthlete.name) {
        row.classList.add("player-row");
      }

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

      // Highlight the player's row
      if (athlete.name === playerAthlete.name) {
        row.classList.add("player-row");
      }

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
  rankingsDiv.innerHTML = ""; // Clear previous rankings
  rankingsDiv.appendChild(rankingsContainer);
}

// Function to handle the "Next" button click
function handleNext() {
  if (currentState === 0) {
    // From Snatch Results to CJ Starting List
    currentState = 1;
    showCJStartingList();
  } else if (currentState === 1) {
    // From CJ Starting List to CJ Attempts
    currentState = 2;
    runCJAttempts();
  } else if (currentState === 2) {
    // No further action
    navigationButtons.style.display = "none";
  }
}

// Function to handle the "Previous" button click
function handlePrevious() {
  if (currentState === 1) {
    // From CJ Starting List back to Snatch Results
    currentState = 0;
    showSnatchResults();
  } else if (currentState === 2) {
    // From CJ Attempts back to CJ Starting List
    currentState = 1;
    showCJStartingList();
  }
}

// Function to show Snatch Results
function showSnatchResults() {
  outputDiv.innerHTML = "Snatch Attempts:<br>";
  displayCompetitionBoard("snatch");
  displayRankings("snatch");
  navigationButtons.style.display = "block";
}

// Function to show Clean & Jerk Starting List
function showCJStartingList() {
  outputDiv.innerHTML = "<br>Clean & Jerk Starting List:<br>";
  displayCompetitionBoard("cj");
  rankingsDiv.innerHTML = "";
  navigationButtons.style.display = "block";
}

// Function to run Clean & Jerk Attempts
async function runCJAttempts() {
  outputDiv.innerHTML = "<br>Clean & Jerk Attempts:<br>";
  rankingsDiv.innerHTML = "";
  navigationButtons.style.display = "none"; // Hide navigation buttons during processing
  competitionBoard.sort((a, b) => a.cj1 - b.cj1);
  await processAttempts("cj");
  displayRankings("total");
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

  // Display snatch rankings and competition board
  displayRankings("snatch");
  displayCompetitionBoard("snatch");

  // Show navigation buttons
  currentState = 0;
  navigationButtons.style.display = "block";
}
