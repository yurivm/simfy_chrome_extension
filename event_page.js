var state = (function() {
  var isPlayingNow = false;
  
  return {
    setTrackInfo: function(trackInfo) {
      localStorage['trackInfo.track_title'] = trackInfo.track_title;
      localStorage['trackInfo.artist_name'] = trackInfo.artist_name;
    },
    getTrackInfo: function() {
      return {
        track_title: localStorage['trackInfo.track_title'],
        artist_name: localStorage['trackInfo.artist_name']
      };
    },
    setIsPlayingNow: function(ispn) {
      isPlayingNow = ispn;
    },
    getIsPlayingNow: function() {
      return isPlayingNow;
    }
  };
})();


//receive new track messages from the content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "SIMFY_NEW_TRACK") {
      state.setTrackInfo(request);
    } else if (request.type == "SIMFY_PLAYER_IS_PLAYING") {
      state.setIsPlayingNow(request.value);
      var background_color = (request.value) ? "#0B610B" : "#8A0808";
      var badge_text = (request.value) ? "PLAY" : "STOP";
      chrome.browserAction.setBadgeText({text: badge_text});
      chrome.browserAction.setBadgeBackgroundColor({color: background_color});
    }
    
  });
