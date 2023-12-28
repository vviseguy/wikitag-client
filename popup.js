// Logic to populate player list and start game button functionality (you need to implement this)
// This might involve using Chrome's messaging API for communication between extension pages or content scripts
let username, roomCode;
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
    document.getElementById('sign-in-page').classList.add('hidden');
    document.getElementById('join-room-page').classList.add('hidden');
    document.getElementById('room-page').classList.add('hidden');
    document.getElementById('game-page').classList.add('hidden');
}

// Function to send messages to the Service Worker
async function tellServiceWorker(obj){
    let response = await chrome.runtime.sendMessage(obj);
    if (response.error) return new Error(response.message);
    
    return response;
}

// Function to set username globally
function setUsername(username){
    Array.from(document.getElementsByClassName('display-username'))
            .forEach((el) => el.innerText = username);
}
// Function to set roomCode globally
function setRoomCode(roomCode){
    Array.from(document.getElementsByClassName('display-room-code'))
            .forEach((el) => el.innerText = roomCode || 'No room code');
}

// Function to sign in
function signIn() {
    showLoadingScreen(); // Show loading screen

    const providedName = document.getElementById('username').value;
    tellServiceWorker({eventType:"sign-in", username:providedName}).then((response) => {

        // Logic to sign in using entered username
        username = response.username;

        // Hide previous page, show room page
        hidePreviousRoom();
        document.getElementById('join-room-page').classList.remove('hidden');

        // Update username everywhere on page
        setUsername(username);
        
        hideLoadingScreen(); // Hide loading screen after response
    }).catch(error => {
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    });
}

// Function to join a room
function joinRoom() {
    showLoadingScreen(); // Show loading screen
    const providedCode = document.getElementById('room-code').value;
    tellServiceWorker({eventType:"join", roomCode:providedCode}).then((response) => {

        // Logic to join the room
        roomCode = response.roomCode;

        // Hide previous page, show room page
        hidePreviousRoom();
        document.getElementById('room-page').classList.remove('hidden');

        // Update the roomCode everywhere on page
        setRoomCode(roomCode);
        
        hideLoadingScreen(); // Hide loading screen after response
    }).catch(error => {
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    });
}

// Function to create a room
function createRoom() {
    showLoadingScreen(); // Show loading screen
    tellServiceWorker({eventType:"create"}).then((response) => {

        // Logic to process newly created room
        roomCode = response.roomCode;

        // Hide previous page, show room page
        hidePreviousRoom();
        document.getElementById('room-page').classList.remove('hidden');

        // Update the roomCode everywhere on page
        setRoomCode(roomCode);

        hideLoadingScreen(); // Hide loading screen after response
    }).catch(error => {
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    });
}

// Function to start the game
async function activateGame() {
    showLoadingScreen(); // Show loading screen
    tellServiceWorker({eventType:"start"}).then(async () => {
        // see startGame()
    }).catch(error => {
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    });
}

// Function to react to start game event
async function beginGame(roleList) {
    showLoadingScreen(); // Show loading screen
    try {

        // For demonstration, setting a random role (modify as needed)
        const roles = ['Villager', 'Werewolf', 'Seer', 'Doctor'];
        const randomRole = roleList[username] || roles[Math.floor(Math.random() * roles.length)];
        
        chrome.scripting.executeScript({
            target: { tabId: await chrome.tabs.query({active: true, currentWindow: true}).then((o)=>o[0].id) },
            files: ['inject.js']
        });

        hidePreviousRoom(); // Hide previous room content
        document.getElementById('game-page').classList.remove('hidden');
        document.getElementById('display-role').innerText = randomRole;
        
        hideLoadingScreen(); // Hide loading screen after response
    }
    catch(error){
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    };
}


// Function to end the game and close the extension
function endGame() {
    showLoadingScreen(); // Show loading screen
    tellServiceWorker({eventType:"leave"}).then(async () => {

        // Close the extension window/tab (adjust based on the Chrome extension's specific close behavior)
        window.close();
    }).catch(error => {
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    });
}

// Function to sign out and go back to the join room page
function signOut() {
    showLoadingScreen(); // Show loading screen
    tellServiceWorker({eventType:"sign-out"}).then(async () => {

        // Hide previous page, show join room page
        hidePreviousRoom(); // Hide previous room content
        document.getElementById('sign-in-page').classList.remove('hidden');
    }).catch(error => {
        hideLoadingScreen(); // Hide loading screen on error
        console.error('Error:', error);
    });
}

// Attach event listeners for onclick attributes
document.getElementById('sign-in-button').addEventListener('click', signIn);
document.getElementById('join-room-button').addEventListener('click', joinRoom);
document.getElementById('create-room-button').addEventListener('click', createRoom);
document.getElementById('start-game-button').addEventListener('click', activateGame);
document.getElementById('sign-out-button').addEventListener('click', signOut);
document.getElementById('end-game-button').addEventListener('click', endGame);

// Initially hide the loading screen on page load
document.addEventListener('DOMContentLoaded', function () {
    hideLoadingScreen();
});