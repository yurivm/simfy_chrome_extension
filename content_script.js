console.log("o hai, this is the content script");

var playToggle = function() {
  console.log("togglePlayer()");
  if (Core.EI.player_is_playing) {
    Core.EI.pausePlayback();
  } else {
    Core.EI.resumePlayback();
  }
};

var playNext = function() {
    console.log("playNext()");
    Core.EI.playNext();
};

var playPrevious = function() {
    console.log("playPrevious()");
    Core.EI.playPrevious();
};


var injectScriptFunction = function(func) {
  var script = document.createElement('script');
  script.textContent = '(' + func + ')()';
  (document.head||document.documentElement).appendChild(script);
  script.parentNode.removeChild(script);
}


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
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