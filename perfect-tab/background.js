//Clicking on the extension icon will restore the last session
chrome.browserAction.onClicked.addListener((tab) => {
    chrome.sessions.restore();
})
//check
