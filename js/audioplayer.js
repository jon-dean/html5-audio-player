var audioPlayer   = document.getElementById('audioPlayer');
var scrubBar      = document.getElementById('scrubBar');
var elapsedTime   = document.getElementById('elapsedTime');
var remainingTime = document.getElementById('remainingTime');
var playPause     = document.getElementById('playPause');
var trackLength;

// Set up a listener so we can get the track data once it's loaded
audioPlayer.addEventListener('loadedmetadata', function() {
  // Get the length for the current track
  trackLength = Math.round(audioPlayer.duration);

  // Set the initial elapsed and remaining times for the track
  elapsedTime.innerHTML   = formatTrackTime(audioPlayer.currentTime);
  remainingTime.innerHTML = '-' + formatTrackTime(trackLength - audioPlayer.currentTime);
});

// Set up a listener to watch for play / pause and display the correct image
playPause.addEventListener('click', function() {
  // Let's check to see if we're already playing
  if (audioPlayer.paused) {
    // Start playing and switch the class to show the pause button
    audioPlayer.play();
    playPause.className = 'pause';
  } else {
    // Pause playing and switch the class to show the play button
    audioPlayer.pause();
    playPause.className = 'play';
  }
});

// Track the elapsed time for the playing audio
audioPlayer.ontimeupdate = function() {
  // Update the scrub bar with the elapsed time
  scrubBar.value = Math.floor((100 / trackLength) * audioPlayer.currentTime);

  // Update the elapsed and remaining time elements
  elapsedTime.innerHTML   = formatTrackTime(audioPlayer.currentTime);
  remainingTime.innerHTML = '-' + formatTrackTime(trackLength - audioPlayer.currentTime + 1);
};

// Set up some listeners for when the user changes the scrub bar time
// by dragging the slider or clicking in the scrub bar progress area
scrubBar.addEventListener('input', function() {
  changeTrackCurrentTime();
  scrubBar.addEventListener('change', changeTrackCurrentTime);
});
scrubBar.addEventListener('change', function() {
  changeTrackCurrentTime();
  scrubBar.removeEventListener('input', changeTrackCurrentTime);
}); 

// Change the track's current time to match the user's selected time
var changeTrackCurrentTime = function() {
  audioPlayer.currentTime = Math.floor((scrubBar.value / 100) * trackLength);
};

// Format the time so it shows nicely to the user
function formatTrackTime(timeToFormat) {
  var minutes = Math.floor((timeToFormat) / 60);
  var seconds = Math.floor(timeToFormat % 60);
  seconds = (seconds >= 10) ? seconds : '0' + seconds;
  return minutes + ':' + seconds;
}

// Let's reset everything once the track has ended
audioPlayer.addEventListener('ended', function() {
  audioPlayer.currentTime = 0;
  elapsedTime.innerHTML   = formatTrackTime(audioPlayer.currentTime);
  remainingTime.innerHTML = '-' + formatTrackTime(trackLength - audioPlayer.currentTime);
  playPause.className = 'play';
});