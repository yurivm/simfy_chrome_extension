var simfyConnector = {

  playNext: function() {
    console.log("playNext clicked");
    chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "PLAY_NEXT"}, function(response) {
        console.log("reply form the content script: " + response.ack);
      });
    });
//     window.postMessage({ type: "SIMFY_EXTENSION_CMD", command: "PLAY_NEXT" }, "*");
  },

  playPrevious: function() {
    console.log("playPrevious clicked");
    chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "PLAY_PREVIOUS"}, function(response) {
        console.log("reply form the content script: " + response.ack);
      });
    });
    //window.postMessage({ type: "SIMFY_EXTENSION_CMD", command: "PLAY_PREVIOUS" }, "*");
  },

  playToggle: function() {
    console.log("play clicked");
    chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "PLAY_TOGGLE"}, function(response) {
      console.log("reply form the content script: " + response.ack);
      });
    });
    //window.postMessage({ type: "SIMFY_EXTENSION_CMD", command: "PLAY_RESUME" }, "*");
  }

};

console.log("popup js started");
$(document).ready(function() {
  $("#simfy_next").click(simfyConnector.playNext);
  $("#simfy_prev").click(simfyConnector.playPrevious);
  $("#simfy_play").click(simfyConnector.playToggle);
});

