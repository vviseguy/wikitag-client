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

// fetch('http://localhost:3000/hi/hi',{
// method:"POST",
// headers: {"Content-Type": "application/json"},
// body: JSON.stringify({neighbors:"hi"})        
// }).then((r)=>r.json());