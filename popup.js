var simfyConnector = (function () {

  var isPlayingNow = false;

  var sendCommandToSimfyTab = function(cmd) {
      chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: cmd}, function(response) {
  //        console.log("reply form the content script: " + response.ack);
        });
      });    
  };

  return {
    playNext: function() { sendCommandToSimfyTab("SIMFY_PLAY_NEXT"); },
    playPrevious: function() { sendCommandToSimfyTab("SIMFY_PLAY_PREVIOUS"); },
    playToggle: function() { sendCommandToSimfyTab("SIMFY_PLAY_TOGGLE"); },

    updateTrackInfo: function(request) {
      $('span.track_title').html(request.track_title);
      $('span.track_artist_name').html(" by " + request.artist_name);
    },

    refreshTrackInfo: function() {
      chrome.runtime.getBackgroundPage(function(wnd) {
        var trackInfo = wnd.state.getTrackInfo();
        if (!_.isEmpty(trackInfo.track_title) && !_.isEmpty(trackInfo.artist_name)) {
          $('span.track_title').html(trackInfo.track_title);
          $('span.track_artist_name').html(" by " + trackInfo.artist_name);          
        }
      });
    },
    setIsPlayingNow: function(value) {
      if (value != isPlayingNow) {
        var img_class = (value) ? "pause" : "play";
        $("#simfy_play img").attr("class", img_class);
        isPlayingNow = value;
      }
    }
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
      console.log("popup received SIMFY_NEW_TRACK");
      simfyConnector.updateTrackInfo(request);
      sendResponse({ack: "SIMFY_NEW_TRACK"});
    } else if (request.type == "SIMFY_PLAYER_IS_PLAYING") {
      simfyConnector.setIsPlayingNow(request.value);
      console.log("popup received SIMFY_PLAYER_IS_PLAYING");
    }
    
  });

