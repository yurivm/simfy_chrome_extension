var simfyConnector = (function () {

  var isPlayingNow = false;

  var sendCommandToSimfyTab = function(cmd) {
      chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: cmd}, function(response) {
  //        console.log("reply form the content script: " + response.ack);
        });
      });    
  };
  var setPlayButtonClass = function(isPlaying) {
    var img_class = (isPlaying) ? "pause" : "play";
    $("#simfy_play img").attr("class", img_class);
  };

  return {
    playNext: function() { sendCommandToSimfyTab("SIMFY_PLAY_NEXT"); },
    playPrevious: function() { sendCommandToSimfyTab("SIMFY_PLAY_PREVIOUS"); },
    playToggle: function() { sendCommandToSimfyTab("SIMFY_PLAY_TOGGLE"); },

    refreshTrackInfo: function() {
      chrome.runtime.getBackgroundPage(function(wnd) {
        var trackInfo = wnd.state.getTrackInfo();
        if (!_.isEmpty(trackInfo.track_title) && !_.isEmpty(trackInfo.artist_name)) {
          $('span.track_title').html(trackInfo.track_title);
          $('span.track_artist_name').html(" by " + trackInfo.artist_name);          
        }
      });
    },
    refreshIsPlayingNow: function() {
      chrome.runtime.getBackgroundPage(function(wnd) {
        var isPlayingNow = wnd.state.getIsPlayingNow();
        setPlayButtonClass(isPlayingNow);
      });
    },

    setIsPlayingNow: function(value) {
      if (value != isPlayingNow) {
        setPlayButtonClass(value);
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
// refresh the play button state
simfyConnector.refreshIsPlayingNow();
//check if the extension is enabled


//receive new track messages from the content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "SIMFY_NEW_TRACK") {
      simfyConnector.refreshTrackInfo();
      sendResponse({ack: "SIMFY_NEW_TRACK"});
    } else if (request.type == "SIMFY_PLAYER_IS_PLAYING") {
      simfyConnector.setIsPlayingNow(request.value);
    }
    
  });

