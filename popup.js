// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Global variable containing the query we'd like to pass to Flickr. In this
 * case, kittens!
 *
 * @type {string}
 */
var QUERY = 'kittens';

var simfyConnector = {

  playNext: function() {
    console.log("playNext clicked");
     window.postMessage({ type: "SIMFY_EXTENSION_CMD", command: "PLAY_NEXT" }, "*");
  },

  playPrevious: function() {
    console.log("playPrevious clicked");
    window.postMessage({ type: "SIMFY_EXTENSION_CMD", command: "PLAY_PREVIOUS" }, "*");
  },

  pause: function() {
    console.log("pause clicked");
    window.postMessage({ type: "SIMFY_EXTENSION_CMD", command: "PLAY_PAUSE" }, "*");
  },

  play: function() {
    console.log("play clicked");
    window.postMessage({ type: "SIMFY_EXTENSION_CMD", command: "PLAY_RESUME" }, "*");
  }

};

// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById("simfy_next").addEventListener("click", simfyConnector.playNext, false);
  document.getElementById("simfy_prev").addEventListener("click", simfyConnector.playPrevious, false);
  document.getElementById("simfy_play").addEventListener("click", simfyConnector.play, false);
});
// $(document).ready(function() {
//   $("#simfy_next").click(simfyConnector.playNext);
//   $("#simfy_prev").click(simfyConnector.playPrevious);
//   $("#simfy_play").click(simfyConnector.play);
// });

