var playerControlFunctions = (function(){
  return {
    playToggle: function() {
      if (Core.EI.player_is_playing) {
        Core.EI.pausePlayback();
      } else {
        Core.EI.resumePlayback();
      }
    },
    playNext: function() { Core.EI.playNext(); },
    playPrevious: function() { Core.EI.playPrevious(); },
    onNewTrack: function(artist_name, track_title, track_version_title, album_title, track_id, album_id, length) {
        window.postMessage({ type: "SIMFY_NEW_TRACK", artist_name: artist_name, track_title: track_title, track_version_title: track_version_title, album_title: album_title, track_id: track_id, album_id: album_id, length: length }, "*");
    },

  };

})();
// I would gladly use alarms. But Chrome limits alarms to at most once every 1 minute. 
var playerTimerFunctions = (function() {
  return {
    playerStatusCheck: function() {
      simfyExtensionStatusChecker = setInterval(function() {
        window.postMessage({type: "SIMFY_PLAYER_IS_PLAYING", value: Core.EI.player_is_playing}, "*");
      }, 500);
    },
    resetStatusCheck: function() {
      if (typeof simfyExtensionStatusChecker != "undefined") {
        clearInterval(simfyExtensionStatusChecker);
      }
    }

  };
})();

var injectScriptFunction = function(func) {
  var script = document.createElement('script');
  script.textContent = (_.isString(func)) ? func : '(' + func + ')()';
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
};

//inject our own on New Track listener
injectScriptFunction("Core.EI.call_newActiveTrack = " + playerControlFunctions.onNewTrack );
//remove the status checker if it existed previously
injectScriptFunction(playerTimerFunctions.resetStatusCheck);
//ping the player periodically
injectScriptFunction("var simfyExtensionStatusChecker = null;");
injectScriptFunction(playerTimerFunctions.playerStatusCheck);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var ack = request.command;
    switch(request.command) {
      case "SIMFY_PLAY_NEXT":
        injectScriptFunction(playerControlFunctions.playNext);
        break;
      case "SIMFY_PLAY_PREVIOUS":
        injectScriptFunction(playerControlFunctions.playPrevious);
        break;
      case "SIMFY_PLAY_TOGGLE":
        injectScriptFunction(playerControlFunctions.playToggle);
        break;
      default:
        ack = "WHARRGARBL";
    }
    sendResponse({ack: ack});
});

//listen to the messages from the simfy tab. We will then send them to the popup. To Scratching your left ear with the right hand over the head while being asked about your outside of the box thinking examples similar it is. To the dark side it potentially may lead.

window.addEventListener("message", function(event) {
  // We only accept messages from ourselves
  if (event.source != window)
    return;
  var forwardMessageType = ["SIMFY_NEW_TRACK", "SIMFY_PLAYER_IS_PLAYING"];
  //forward the messages to the popup
  if (event.data.type && (_.indexOf(forwardMessageType,event.data.type) != -1)) {
    chrome.runtime.sendMessage(event.data, function(response) {
      //  console.log(response.ack);
    });
  }
}, false);