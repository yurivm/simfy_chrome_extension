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

//receive new track messages from the content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "SIMFY_NEW_TRACK") {
      $('span.track_title').html(request.track_title);
      $('span.track_artist_name').html(" von " + request.artist_name);
      //$("#simfy_song").html(request.track_title + " von " + request.artist_name + " (" + request.length + ")");  
      sendResponse({ack: "SIMFY_NEW_TRACK"});
    }
    
  });

