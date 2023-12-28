// const HOST_SUFFIX = ".coppermind.net"
const HOST_SUFFIX = ".wikipedia.org"
// function test(){
//     alert("hi");
//     console.log("1");
// }
// Only allow clicking on valid sites
chrome.runtime.onInstalled.addListener(() => {
    chrome.action.disable();

    chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
        let exampleRule = {
            conditions: [
                new chrome.declarativeContent.PageStateMatcher({
                    pageUrl: {hostSuffix: HOST_SUFFIX},
                })
            ],
            actions: [new chrome.declarativeContent.ShowAction()],
        };

        let rules = [exampleRule];
        chrome.declarativeContent.onPageChanged.addRules(rules);

        
    });
});

// on sign in, open a websocket connection to the server

// on sign out, send a sign out message to the server, removing him from the game, and terminate the connection

// send player updates

// on join without room code, create room

// mock
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    try {
        switch(message.eventType){
            case "sign-in":
                sendResponse({ username: message.username || "[Unnamed User]"});
                break;
            case "leave":
            case "sign-out":
                sendResponse({ })
                break;
            case "join":
                sendResponse({ roomCode: message.roomCode });
                break;
            case "create":
                sendResponse({ roomCode: "123456" });
                break;
            case "begin":
                sendResponse({ });
                break;
            default:
                throw new Error("Service Worker: Invalid chrome runtime message\n" + e);
        }
    }
    catch(e){
        sendResponse({ error: true, message:e });
    }
    
    return true;
});
// much thanks to https://stackoverflow.com/questions/74330556/chrome-extension-how-to-interact-between-the-main-extension-popup-default-pop

// chrome.action.onClicked.addListener((tab) => {
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ['inject.js']
//     });

//     // chrome.scripting.executeScript({
//     //     target: { tabId: tab.id },
//     //     func: test
//     //   }).then(() => console.log("script injected in all frames"));
// });

// prove that service workers can make POST requests
// fetch('http://localhost:3000/hi/hi',{
//     method:"POST",
//     headers: {"Content-Type": "application/json"},
//     body: JSON.stringify({neighbors:["hi"]})        
// }).then((r)=>r.json());