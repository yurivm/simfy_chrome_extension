var playToggle = function() {
  if (Core.EI.player_is_playing) {
    Core.EI.pausePlayback();
  } else {
    Core.EI.resumePlayback();
  }
};

var playNext = function() {
    Core.EI.playNext();
};

var playPrevious = function() {
    Core.EI.playPrevious();
};

var onNewTrack = function(artist_name, track_title, track_version_title, album_title, track_id, album_id, length) {
  window.postMessage({ type: "SIMFY_NEW_TRACK", artist_name: artist_name, track_title: track_title, track_version_title: track_version_title, album_title: album_title, track_id: track_id, album_id: album_id, length: length }, "*");
};

var simfyExtensionStatusChecker = null;

var playerStatusCheck = function() {
  setInterval(function() {
    window.postMessage({type: "SIMFY_PLAYER_IS_PLAYING", value: Core.EI.player_is_playing}, "*");
  }, 500);
};

var injectScriptFunction = function(func) {
  var script = document.createElement('script');
  script.textContent = (_.isString(func)) ? func : '(' + func + ')()';
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
};

//inject our own on New Track listener
injectScriptFunction("Core.EI.call_newActiveTrack = " + onNewTrack );
//ping the player periodically
injectScriptFunction(playerStatusCheck);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var ack = request.command;
    switch(request.command) {
      case "PLAY_NEXT":
        injectScriptFunction(playNext);
        break;
      case "PLAY_PREVIOUS":
        injectScriptFunction(playPrevious);
        break;
      case "PLAY_TOGGLE":
        injectScriptFunction(playToggle);
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