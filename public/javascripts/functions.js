var cc = document.getElementById('image').getContext('2d');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var imageOverlay = document.getElementById('image-overlay');
var overlayCCImg = imageOverlay.getContext('2d');

// tracking for head motion
var ctrack = new clm.tracker();
ctrack.init();

// tracking for picture face landmarks
var ctrackImage = new clm.tracker({stopOnConvergence : true});
ctrackImage.init();

var drawRequest;

function animateClean() {
  ctrackImage.start(document.getElementById('image'));
  if (ctrack.getCurrentPosition()) {
    ctrack.draw(imageOverlay);
  }
  drawImageLoop();
}

function drawImageLoop() {
  var positions = ctrackImage.getCurrentPosition();
  drawRequest = requestAnimFrame(drawImageLoop);

  if (positions) {
    // Skin Tone
      var skinToneData = cc.getImageData(positions[41][0], positions[41][1], 1, 1).data;
      var skinToneColor = `rgba(${skinToneData[0]}, ${skinToneData[1]}, ${skinToneData[2]}, ${skinToneData[3]})`;
      // set right eye background color and html
      document.getElementById('skin-tone').innerHTML = skinToneColor;
      document.getElementById('skin-tone-box').style.backgroundColor = skinToneColor;
    // Left Eye
      var leftEyeData = cc.getImageData(positions[27][0], (positions[27][1] + positions[26][1]) / 2, 1, 1).data;
      var leftEyeColor = `rgba(${leftEyeData[0]}, ${leftEyeData[1]}, ${leftEyeData[2]}, ${leftEyeData[3]})`;
      // set left eye background color and html
      document.getElementById('left-eye').innerHTML = leftEyeColor;
      document.getElementById('left-eye-box').style.backgroundColor = leftEyeColor;

    // Right Eye
      var rightEyeData = cc.getImageData(positions[32][0], (positions[31][1] + positions[26][1]) / 2, 1, 1).data;
      var rightEyeColor = `rgba(${rightEyeData[0]}, ${rightEyeData[1]}, ${rightEyeData[2]}, ${rightEyeData[3]})`;
      // set right eye background color and html
      document.getElementById('right-eye').innerHTML = rightEyeColor;
      document.getElementById('right-eye-box').style.backgroundColor = rightEyeColor;
  }
}

// detect if tracker has converged
document.addEventListener("clmtrackrConverged", function(event) {
  document.getElementById('convergence').innerHTML = "READY";
  document.getElementById('convergence').style.backgroundColor = "#00FF00";
  // stop drawloop
  cancelRequestAnimFrame(drawRequest);
}, false);

// update stats on iteration
document.addEventListener("clmtrackrIteration", function(event) {
}, false);

/*----- video stream functions -----*/
var vid = document.getElementById('videoel');
var vid_width = vid.width;
var vid_height = vid.height;
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
/*********** Setup of video/webcam and checking for webGL support *********/
function enablestart() {
  var startbutton = document.getElementById('startbutton');
  startbutton.value = "Take Snapshot";
  startbutton.disabled = null;
}
var insertAltVideo = function(video) {
  // insert alternate video if getUserMedia not available
  if (supports_video()) {
    if (supports_webm_video()) {
      video.src = "./media/cap12_edit.webm";
    } else if (supports_h264_baseline_video()) {
      video.src = "./media/cap12_edit.mp4";
    } else {
      return false;
    }
    return true;
  } else return false;
}

function adjustVideoProportions() {
  // resize overlay and video if proportions of video are not 4:3
  // keep same height, just change width
  var proportion = vid.videoWidth/vid.videoHeight;
  vid_width = Math.round(vid_height * proportion);
  vid.width = vid_width;
  overlay.width = vid_width;
}
function gumSuccess( stream ) {
  // add camera stream if getUserMedia succeeded
  if ("srcObject" in vid) {
    vid.srcObject = stream;
  } else {
    vid.src = (window.URL && window.URL.createObjectURL(stream));
  }
  vid.onloadedmetadata = function() {
    adjustVideoProportions();
    vid.play();
  }
  vid.onresize = function() {
    adjustVideoProportions();
    if (trackingStarted) {
      ctrack.stop();
      ctrack.reset();
      ctrack.start(vid);
    }
  }
}
function gumFail() {
  // fall back to video if getUserMedia failed
  insertAltVideo(vid);
  document.getElementById('gum').className = "hide";
  document.getElementById('nogum').className = "nohide";
  alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
}
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
// set up video
if (navigator.mediaDevices) {
  navigator.mediaDevices.getUserMedia({video : true}).then(gumSuccess).catch(gumFail);
} else if (navigator.getUserMedia) {
  navigator.getUserMedia({video : true}, gumSuccess, gumFail);
} else {
  insertAltVideo(vid);
  document.getElementById('gum').className = "hide";
  document.getElementById('nogum').className = "nohide";
  alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");
}
vid.addEventListener('canplay', enablestart, false);
/*********** Code for face tracking *********/
var ctrack = new clm.tracker();
ctrack.init();
var trackingStarted = false;
function startVideo() {
  // start video
  vid.play();
  // start tracking
  ctrack.start(vid);
  trackingStarted = true;
  // start loop to draw face
  drawLoop();
}

function drawLoop() {
  requestAnimFrame(drawLoop);
  overlayCC.clearRect(0, 0, vid_width, vid_height);
  //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
  if (ctrack.getCurrentPosition()) {
    ctrack.draw(overlay);
  }
}
// Start facial tracking onload
startVideo()

function snapShot(){
  var hidden_canvas = document.querySelector('canvas#image'),
  video = document.getElementById('videoel'),
  image =  document.getElementById('image'),
  vidBlock = document.querySelector('video')

  // Get the size of the video.
  width = video.videoWidth,
  height = video.videoHeight,
  context = hidden_canvas.getContext('2d');

  // Set the canvas to the same dimensions as the video.
  hidden_canvas.width = width;
  hidden_canvas.height = height;

  // Draw a copy of the current frame from the video on the canvas.
  context.drawImage(video, 0, 0, width, height);
  overlayCCImg.clearRect(0, 0, width, height);

  // Get an image dataURL from the canvas.
  var imageDataURL = hidden_canvas.toDataURL('image/png');

  // Set the dataURL as source of an image element, showing the captured photo.
  image.setAttribute('src', imageDataURL);
  // calculation feature colors and image overlay
  animateClean();
}
