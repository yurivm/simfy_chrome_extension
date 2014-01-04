var state = (function() {
  var isPlayingNow = false;
  var extensionEnabled = true;

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
    setIsPlayingNow: function(ispn) { isPlayingNow = ispn; },
    getIsPlayingNow: function() { return isPlayingNow; },
    enableExtension: function() { 
      extensionEnabled = true; 
      chrome.browserAction.setIcon({path: "img/icon_19.png"});
    },
    disableExtension: function() { 
      extensionEnabled = false; 
      chrome.browserAction.setIcon({path: "img/icon_19_disabled.png"});
    },
    isExtensionEnabled: function() {
      return extensionEnabled;
    },
    checkIfSimfyTabIsOpen: function(tab) {
      chrome.tabs.query({url: "*://www.simfy.de/*"}, function(tabs) {
        if (tabs.length == 0) {
          state.disableExtension();
        } else {
          state.enableExtension();
        }
      });      
    }
  };
})();


//receive new track messages from the content script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "SIMFY_NEW_TRACK") {
      state.setTrackInfo(request);
      var title = request.track_title + " by " + request.artist_name;
      chrome.browserAction.setTitle({title: title});
    } else if (request.type == "SIMFY_PLAYER_IS_PLAYING") {
      state.setIsPlayingNow(request.value);
      // var iconPath = (request.value) ? "img/icon_play_2_38.png" : "img/icon_pause_2_38.png";
      // chrome.browserAction.setIcon({path: iconPath});
      var background_color = (request.value) ? "#0B610B" : "#8A0808";
      var badge_text = (request.value) ? "PLAY" : "STOP";
      chrome.browserAction.setBadgeText({text: badge_text});
      chrome.browserAction.setBadgeBackgroundColor({color: background_color});
      if (!request.value) {
        chrome.browserAction.setTitle({title: "simfy player controls"});
      }
    }
    
});

//keep track of the simfy tab and disable the icon if it is absent
state.checkIfSimfyTabIsOpen();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if (tab.status == "complete") {
    state.checkIfSimfyTabIsOpen();
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
  state.checkIfSimfyTabIsOpen();
});

