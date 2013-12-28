var simfyConnector = {

  playNext: function() {
    chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "PLAY_NEXT"}, function(response) {
//        console.log("reply form the content script: " + response.ack);
      });
    });
  },

  playPrevious: function() {
    chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "PLAY_PREVIOUS"}, function(response) {
//        console.log("reply form the content script: " + response.ack);
      });
    });
  },

  playToggle: function() {
    chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {command: "PLAY_TOGGLE"}, function(response) {
//      console.log("reply form the content script: " + response.ack);
      });
    });
  }

};

$(document).ready(function() {
  $("#simfy_next").click(simfyConnector.playNext);
  $("#simfy_prev").click(simfyConnector.playPrevious);
  $("#simfy_play").click(simfyConnector.playToggle);
});

