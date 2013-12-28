var simfyConnector = (function () {

  var setTrackInfo = function(request) {
    console.log("setting : " + request.track_title + " " + request.artist_name);
    localStorage.track_title = request.track_title;
    localStorage.artist_name = request.artist_name;
  }

  var getTrackInfo = function() {
    console.log("reading");
    var tt = localStorage.track_title;
    var an = localStorage.artist_name;
    console.log(tt);
    console.log(an);
    return {
      track_title: tt,
      artist_name: an
    }
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
      info = getTrackInfo();
      $('span.track_title').html(info.track_title);
      $('span.track_artist_name').html(" von " + info.artist_name);
    },

    trackTitle: function() {
      return currentTrackTitle;
    },

    isTrackInfoDefined: function() {
      info = getTrackInfo();
      return (!_.isUndefined(info.track_title) && !_.isUndefined(info.artist_name));
    },
  };

})();

$(document).ready(function() {
  $("#simfy_next").click(simfyConnector.playNext);
  $("#simfy_prev").click(simfyConnector.playPrevious);
  $("#simfy_play").click(simfyConnector.playToggle);
});

// 

if (simfyConnector.isTrackInfoDefined()) {
  simfyConnector.refreshTrackInfo();
}

//receive new track messages from the content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "SIMFY_NEW_TRACK") {
      // $('span.track_title').html(request.track_title);
      // $('span.track_artist_name').html(" von " + request.artist_name);
      simfyConnector.updateTrackInfo(request);
      //$("#simfy_song").html(request.track_title + " von " + request.artist_name + " (" + request.length + ")");  
      sendResponse({ack: "SIMFY_NEW_TRACK"});
    }
    
  });

