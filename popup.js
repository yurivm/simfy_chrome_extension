var simfyConnector = (function () {

  var setTrackInfo = function(request) {
    chrome.storage.local.set({simfy_track_info:request}, function() {
      //console.log("yes we did store the track info");
    });
  }

  return {
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
    },

    updateTrackInfo: function(request) {
      $('span.track_title').html(request.track_title);
      $('span.track_artist_name').html(" von " + request.artist_name);
      setTrackInfo(request);
    },

    refreshTrackInfo: function() {
      chrome.storage.local.get("simfy_track_info", function(value) {
        if (!_.isEmpty(value) && !_.isUndefined(value.simfy_track_info)) {
          $('span.track_title').html(value.simfy_track_info.track_title);
          $('span.track_artist_name').html(" von " + value.simfy_track_info.artist_name);
        }
      });
    },

  };

})();

$(document).ready(function() {
  $("#simfy_next").click(simfyConnector.playNext);
  $("#simfy_prev").click(simfyConnector.playPrevious);
  $("#simfy_play").click(simfyConnector.playToggle);
});

// display the last played track info
simfyConnector.refreshTrackInfo();

//receive new track messages from the content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "SIMFY_NEW_TRACK") {
      simfyConnector.updateTrackInfo(request);
      sendResponse({ack: "SIMFY_NEW_TRACK"});
    }
    
  });

