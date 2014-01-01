var simfyConnector = (function () {

  var isPlayingNow = false;

  var setTrackInfo = function(request) {
    chrome.storage.local.set({simfy_track_info:request}, function() {
      //console.log("yes we did store the track info");
    });
  };

  return {
    playNext: function() {
      chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "SIMFY_PLAY_NEXT"}, function(response) {
  //        console.log("reply form the content script: " + response.ack);
        });
      });
    },

    playPrevious: function() {
      chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "SIMFY_PLAY_PREVIOUS"}, function(response) {
  //        console.log("reply form the content script: " + response.ack);
        });
      });
    },

    playToggle: function() {
      chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {command: "SIMFY_PLAY_TOGGLE"}, function(response) {
          //TODO switch play/pause status
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
    setIsPlayingNow: function(value) {
      if (value != isPlayingNow) {
        var img_class = (value) ? "pause" : "play";
        // var badge_text = (value) ? "PLAY" : "STOP";
        // var background_color = (value) ? "#0B610B" : "#8A0808";
        $("#simfy_play img").attr("class", img_class);
        //chrome.browserAction.setBadgeText({text: badge_text});
        //chrome.browserAction.setBadgeBackgroundColor({color: background_color});
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
      simfyConnector.updateTrackInfo(request);
      sendResponse({ack: "SIMFY_NEW_TRACK"});
    } else if (request.type == "SIMFY_PLAYER_IS_PLAYING") {
      simfyConnector.setIsPlayingNow(request.value);
    }
    
  });

