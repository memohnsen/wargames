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
// States:
// 0 - Snatch Starting List
// 1 - Snatch Attempts
// 2 - Snatch Results
// 3 - CJ Starting List
// 4 - CJ Attempts
// 5 - Total Results
let currentState = 0;

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
  playerAthlete = { name: name, weight: 96.0, snatch: snatchAttempt, cj: cjAttempt, lotNumber: 488 };

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

  // Disable the Previous button
  previousButton.disabled = true;

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
  // List of athletes with lot numbers set in the code
  let athletes = [
    { name: "Spencer", weight: 96.0, snatch: 120, cj: 150, lotNumber: 958 },
    { name: "Adam", weight: 96.0, snatch: 115, cj: 145, lotNumber: 678 },
    { name: "Angela", weight: 96.0, snatch: 118, cj: 148, lotNumber: 805 },
    { name: "David", weight: 96.0, snatch: 122, cj: 152, lotNumber: 19 },
    { name: "Nate", weight: 96.0, snatch: 110, cj: 140, lotNumber: 309 },
    { name: "Jessie", weight: 96.0, snatch: 110, cj: 141, lotNumber: 106 },
    { name: "Grace", weight: 96.0, snatch: 113, cj: 149, lotNumber: 544 },
    { name: "Jordan", weight: 96.0, snatch: 119, cj: 138, lotNumber: 99 },
    { name: "Morghan", weight: 96.0, snatch: 122, cj: 153, lotNumber: 659 },
    { name: "Maddisen", weight: 96.0, snatch: 114, cj: 144, lotNumber: 241 }
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
  let headers;

  if (lift === "total") {
    // For total results, use the requested columns
    headers = ["Lot Number", "Name", "Weight", "Snatch Best", "C&J Best", "Total"];
  } else {
    headers = ["Lot Number", "Name", "Weight"];
    for (let i = 1; i <= 3; i++) {
      headers.push(`${lift}${i}`);
    }
    headers.push(`${lift}_best`);

    // If lift is "cj", add "Total" column
    if (lift === "cj") {
      headers.push("Total");
    }
  }

  headers.forEach(headerText => {
    let th = document.createElement("th");
    th.textContent = headerText.replace("_", " ").toUpperCase();
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  competitionBoard.forEach((athlete, index) => {
    let row = document.createElement("tr");

    // Highlight the player's row
    if (athlete.name === playerAthlete.name) {
      row.classList.add("player-row");
    }

    // Lot Number cell
    let lotCell = document.createElement("td");
    lotCell.textContent = athlete.lotNumber;
    row.appendChild(lotCell);

    // Name cell
    let nameCell = document.createElement("td");
    nameCell.textContent = athlete.name;
    row.appendChild(nameCell);

    // Weight cell
    let weightCell = document.createElement("td");
    weightCell.textContent = athlete.weight;
    row.appendChild(weightCell);

    if (lift === "total") {
      // Snatch Best
      let snatchBestCell = document.createElement("td");
      snatchBestCell.textContent = athlete.snatch_best !== null ? athlete.snatch_best : "DNF";
      if (athlete.snatch_best === null) {
        snatchBestCell.classList.add("dnf");
      }
      row.appendChild(snatchBestCell);

      // C&J Best
      let cjBestCell = document.createElement("td");
      cjBestCell.textContent = athlete.cj_best !== null ? athlete.cj_best : "DNF";
      if (athlete.cj_best === null) {
        cjBestCell.classList.add("dnf");
      }
      row.appendChild(cjBestCell);

      // Total
      let totalCell = document.createElement("td");
      if (athlete.total === "DNF" || athlete.total === null) {
        totalCell.textContent = "DNF";
        totalCell.classList.add("dnf");
      } else {
        totalCell.textContent = athlete.total;
      }
      row.appendChild(totalCell);
    } else {
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
    }

    // Apply medal classes for top 3 in states 2 and 5
    if ((currentState === 2 || currentState === 5) && index < 3) {
      if (index === 0) {
        row.classList.add("first-place");
      } else if (index === 1) {
        row.classList.add("second-place");
      } else if (index === 2) {
        row.classList.add("third-place");
      }
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
      lotNumber: athlete.lotNumber, // Include lotNumber
      order: index
    }];
    athlete.currentAttemptIndex = 0;
  });

  let attempts = competitionBoard.flatMap(athlete => athlete.attempts);

  // Sort attempts by initial_weight ascending, then by attempt_num ascending, then by lotNumber ascending
  attempts.sort((a, b) => {
    if (a.initial_weight !== b.initial_weight) {
      return a.initial_weight - b.initial_weight;
    } else if (a.attempt_num !== b.attempt_num) {
      return a.attempt_num - b.attempt_num;
    } else {
      return a.lotNumber - b.lotNumber;
    }
  });

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
            // After a successful lift, minimum next weight is +3 kg
            let minNextWeight = weight + 3;
            let maxNextWeight = weight + 5; // Max increase of 5 kg
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
            lotNumber: athlete.lotNumber, // Include lotNumber
            order: attempt.order
          });
        }

        attempts.splice(i, 1);
        i--;

        if (athlete.attempts.length > athlete.currentAttemptIndex + 1) {
          athlete.currentAttemptIndex++;
          attempts.push(athlete.attempts[athlete.currentAttemptIndex]);
        }

        // Sort attempts after each update
        attempts.sort((a, b) => {
          if (a.initial_weight !== b.initial_weight) {
            return a.initial_weight - b.initial_weight;
          } else if (a.attempt_num !== b.attempt_num) {
            return a.attempt_num - b.attempt_num;
          } else {
            return a.lotNumber - b.lotNumber;
          }
        });

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

// Rest of the code remains the same...

// Function to display rankings
function displayRankings(lift) {
  // ... (existing code remains the same)
}

// Function to handle the "Next" button click
function handleNext() {
  if (currentState === 0) {
    // From Snatch Starting List to Snatch Attempts
    currentState = 1;
    runSnatchAttempts();
  } else if (currentState === 1) {
    // From Snatch Attempts to Snatch Results
    currentState = 2;
    showSnatchResults();
  } else if (currentState === 2) {
    // From Snatch Results to CJ Starting List
    currentState = 3;
    showCJStartingList();
  } else if (currentState === 3) {
    // From CJ Starting List to CJ Attempts
    currentState = 4;
    runCJAttempts();
  } else if (currentState === 4) {
    // From CJ Attempts to Total Results
    currentState = 5;
    showTotalResults();
  } else if (currentState === 5) {
    // Competition over
    navigationButtons.style.display = "none";
  }
}

// Function to handle the "Previous" button click
function handlePrevious() {
  if (currentState === 3) {
    // From CJ Starting List back to Snatch Results
    currentState = 2;
    showSnatchResults();
  } else if (currentState === 2) {
    // Do not allow going back further
    return;
  } else {
    // Do not allow previous in other states
    return;
  }
}

// Function to show Snatch Starting List
function showSnatchStartingList() {
  outputDiv.innerHTML = "Snatch Starting List:<br>";
  displayCompetitionBoard("snatch");
  rankingsDiv.innerHTML = "";
  navigationButtons.style.display = "block";
  previousButton.disabled = true; // Disable Previous button at the starting list
}

// Function to run Snatch Attempts
async function runSnatchAttempts() {
  outputDiv.innerHTML = "Snatch Attempts:<br>";
  rankingsDiv.innerHTML = "";
  navigationButtons.style.display = "none"; // Hide navigation buttons during processing

  // Sort the competition board for initial attempt order
  competitionBoard.sort((a, b) => {
    if (a.snatch1 !== b.snatch1) {
      return a.snatch1 - b.snatch1;
    } else if (a.attempt_num !== b.attempt_num) {
      return a.attempt_num - b.attempt_num;
    } else {
      return a.lotNumber - b.lotNumber;
    }
  });

  await processAttempts("snatch");
  navigationButtons.style.display = "block"; // Show navigation buttons after processing
  previousButton.disabled = true; // Disable Previous button
}

// Function to show Snatch Results
function showSnatchResults() {
  outputDiv.innerHTML = "Snatch Results:<br>";

  // Sort competitionBoard from heaviest to lightest snatch_best
  competitionBoard.sort((a, b) => {
    // Handle DNF cases
    if (hasMissedAllAttempts(a, "snatch")) return 1;
    if (hasMissedAllAttempts(b, "snatch")) return -1;
    if (a.snatch_best === null) return 1;
    if (b.snatch_best === null) return -1;

    // Both have snatch_best
    if (b.snatch_best !== a.snatch_best) {
      return b.snatch_best - a.snatch_best;
    } else {
      return a.lotNumber - b.lotNumber; // Lower lot number wins tie
    }
  });

  displayCompetitionBoard("snatch");
  displayRankings("snatch");
  navigationButtons.style.display = "block";
  previousButton.disabled = true; // Disable Previous button
}

// Function to show Clean & Jerk Starting List
function showCJStartingList() {
  outputDiv.innerHTML = "Clean & Jerk Starting List:<br>";
  displayCompetitionBoard("cj");
  rankingsDiv.innerHTML = "";
  navigationButtons.style.display = "block";
  previousButton.disabled = false; // Enable Previous button
}

// Function to run Clean & Jerk Attempts
async function runCJAttempts() {
  outputDiv.innerHTML = "Clean & Jerk Attempts:<br>";
  rankingsDiv.innerHTML = "";
  navigationButtons.style.display = "none"; // Hide navigation buttons during processing

  // Sort the competition board for initial attempt order
  competitionBoard.sort((a, b) => {
    if (a.cj1 !== b.cj1) {
      return a.cj1 - b.cj1;
    } else if (a.attempt_num !== b.attempt_num) {
      return a.attempt_num - b.attempt_num;
    } else {
      return a.lotNumber - b.lotNumber;
    }
  });

  await processAttempts("cj");
  navigationButtons.style.display = "block"; // Show navigation buttons after processing
  previousButton.disabled = true; // Disable Previous button
}

// Function to show Total Results
function showTotalResults() {
  outputDiv.innerHTML = "Competition Results:<br>";

  // Calculate totals and handle DNF cases
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

  // Sort competitionBoard descending by total
  competitionBoard.sort((a, b) => {
    // Handle DNF cases
    if (a.total === "DNF" && b.total === "DNF") return 0;
    if (a.total === "DNF") return 1;
    if (b.total === "DNF") return -1;

    // Both totals are numbers
    if (b.total !== a.total) {
      return b.total - a.total;
    } else {
      return a.lotNumber - b.lotNumber; // Lower lot number wins tie
    }
  });

  // Display the competition board with the requested columns
  displayCompetitionBoard("total");

  // Optionally, display rankings
  displayRankings("total");

  navigationButtons.style.display = "none"; // Hide navigation buttons after competition ends
}

// Function to run the competition
function runCompetition() {
  outputDiv.innerHTML = "";
  rankingsDiv.innerHTML = ""; // Clear rankings
  document.getElementById("competition-board").innerHTML = ""; // Clear competition board

  initializeCompetition();

  // Show Snatch Starting List
  currentState = 0;
  showSnatchStartingList();
}

// Modal Popup Logic
window.addEventListener('load', function() {
  // Get the modal
  const modal = document.getElementById('popup-modal');

  // Get the <span> element that closes the modal
  const closeModalButton = document.getElementById('close-modal');

  // When the page loads, open the modal
  modal.style.display = 'block';

  // When the user clicks on <span> (x), close the modal
  closeModalButton.onclick = function() {
    modal.style.display = 'none';
  };

  // When the user clicks anywhere outside of the modal content, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
});
