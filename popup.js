// Logic to populate player list and start game button functionality (you need to implement this)
// This might involve using Chrome's messaging API for communication between extension pages or content scripts

let addPlayerListener;
let removePlayerListener;
// Example function to add players to the list (replace it with actual logic)
function addPlayerToList(playerName) {
    const playerList = document.getElementById('player-list');
    const listItem = document.createElement('li');
    listItem.appendChild(document.createTextNode(playerName));
    playerList.appendChild(listItem);
}

// Function to remove a player from the list
function removePlayer(playerName) {
    // Replace 'playerName' with the actual name of the player you want to remove from the list
    const playerList = document.getElementById('player-list');
    const playerToRemove = playerList.querySelector(`li[data-name="${playerName}"]`);

    if (playerToRemove) {
        playerList.removeChild(playerToRemove);
    }
}

// Function to update the player list with a new set of players
function updatePlayerList(updatedPlayers) {
    const playerList = document.getElementById('player-list');
    playerList.innerHTML = ''; // Clear the existing player list

    // Add the updated players to the list
    updatedPlayers.forEach(player => {
        const listItem = document.createElement('li');
        listItem.setAttribute('data-name', player);
        listItem.textContent = player;
        playerList.appendChild(listItem);
    });
}

// Function to simulate a delay/response or timeout
function simulateResponse() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, 300); // Timeout set to 2 seconds (2000 milliseconds)
    });
}

// Function to show the loading screen
function showLoadingScreen() {
    document.getElementById('loading-screen').classList.remove('hidden');
}

// Function to hide the loading screen
function hideLoadingScreen() {
    document.getElementById('loading-screen').classList.add('hidden');
}

// Function to hide the previous room content
function hidePreviousRoom() {
    document.getElementById('join-room-page').classList.add('hidden');
    document.getElementById('room-page').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
}

async function tellServiceWorker(obj){
    return await chrome.runtime.sendMessage(obj);
}

// Function to join a room
function joinRoom() {
    showLoadingScreen(); // Show loading screen
    simulateResponse().then(() => {

        // Simulated response or actual logic to join the room
        // Logic to join room using entered username and room code
        const username = document.getElementById('username').value;
        const roomCode = document.getElementById('room-code').value;

        // Hide previous page, show room page
        hidePreviousRoom();
        document.getElementById('room-page').classList.remove('hidden');

        // Display username and room code in the room page
        document.getElementById('display-username').innerText = username;
        document.getElementById('display-room-code').innerText = roomCode || 'No room code';

        hideLoadingScreen(); // Hide loading screen after response
    }).catch(error => {
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    });
}

// Function to create a room
function createRoom() {
    showLoadingScreen(); // Show loading screen
    tellServiceWorker({type:"join",roomCode:""}).then((obj) => {

        // Simulated response or actual logic to create the room
        // Logic to create a room using entered username
        const username = document.getElementById('username').value;
        const roomCode = obj.roomCode;
        // Hide previous page, show room page
        hidePreviousRoom();
        document.getElementById('room-page').classList.remove('hidden');

        // Display username in the room page
        document.getElementById('display-username').innerText = username;
        document.getElementById('display-room-code').innerText = roomCode;

        hideLoadingScreen(); // Hide loading screen after response
    }).catch(error => {
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    });
}

// Function to start the game and display player's role
async function startGame() {
    showLoadingScreen(); // Show loading screen
    simulateResponse().then(async () => {

        // For demonstration, setting a random role (modify as needed)
        const roles = ['Villager', 'Werewolf', 'Seer', 'Doctor'];
        const randomRole = roles[Math.floor(Math.random() * roles.length)];
        
        chrome.scripting.executeScript({
            target: { tabId: await chrome.tabs.query({active: true, currentWindow: true}).then((o)=>o[0].id) },
            files: ['inject.js']
        });

        hidePreviousRoom(); // Hide previous room content
        document.getElementById('game-page').classList.remove('hidden');
        document.getElementById('display-role').innerText = randomRole;
        
        hideLoadingScreen(); // Hide loading screen after response
    }).catch(error => {
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    });
}

// Function to end the game and close the extension
function endGame() {
    // Perform any necessary clean-up or end-game logic

    // Close the extension window/tab (adjust based on the Chrome extension's specific close behavior)
    window.close();
}

// Function to sign out and go back to the join room page
function signOut() {
    // Hide previous page, show join room page
    hidePreviousRoom(); // Hide previous room content
    document.getElementById('join-room-page').classList.remove('hidden');
}

// Attach event listeners for onclick attributes
document.getElementById('join-room-button').addEventListener('click', joinRoom);
document.getElementById('create-room-button').addEventListener('click', createRoom);
document.getElementById('start-game-button').addEventListener('click', startGame);
document.getElementById('sign-out-button').addEventListener('click', signOut);
document.getElementById('end-game-button').addEventListener('click', endGame);

// Initially hide the loading screen on page load
document.addEventListener('DOMContentLoaded', function () {
    hideLoadingScreen();
});