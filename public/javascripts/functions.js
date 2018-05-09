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

function averageColor(array) {
  var sum = array.reduce(function(a, b) { return a + b; });
  return Math.floor(sum / array.length);
}

function drawImageLoop() {
  var positions = ctrackImage.getCurrentPosition();
  drawRequest = requestAnimFrame(drawImageLoop);

  if (positions) {
    // Skin Tone
      // left brow points
      var leftBrowPoint2 = cc.getImageData(positions[20][0], positions[20][1], 1, 1).data;
      var leftBrowPoint3 = cc.getImageData(positions[21][0], positions[21][1], 1, 1).data;
      // right brow points
      var rightBrowPoint2 = cc.getImageData(positions[16][0], positions[16][1], 1, 1).data;
      var rightBrowPoint3 = cc.getImageData(positions[17][0], positions[17][1], 1, 1).data;

      var r = averageColor([leftBrowPoint2[0], leftBrowPoint3[0], rightBrowPoint2[0], rightBrowPoint3[0]]);
      var g = averageColor([leftBrowPoint2[1], leftBrowPoint3[1], rightBrowPoint2[1], rightBrowPoint3[1]]);
      var b = averageColor([leftBrowPoint2[2], leftBrowPoint3[2], rightBrowPoint2[2], rightBrowPoint3[2]]);
      var hairColor = `rgb(${r}, ${g}, ${b})`;
      // set right eye background color and html
      document.getElementById('hair').innerHTML = hairColor;
      document.getElementById('hair-box').style.backgroundColor = hairColor;
    // Skin Tone
      var skinTonePoint1 = cc.getImageData(positions[33][0], positions[33][1], 1, 1).data;
      var skinTonePoint2 = cc.getImageData(positions[41][0], positions[41][1], 1, 1).data;
      var skinTonePoint3 = cc.getImageData(positions[62][0], positions[62][1], 1, 1).data;
      // rgb averages
      var r = averageColor([skinTonePoint1[0], skinTonePoint2[0], skinTonePoint3[0]]);
      var g = averageColor([skinTonePoint1[1], skinTonePoint2[1], skinTonePoint3[1]]);
      var b = averageColor([skinTonePoint1[2], skinTonePoint2[2], skinTonePoint3[2]]);
      var skinToneColor = `rgb(${r}, ${g}, ${b})`;
      // set right eye background color and html
      document.getElementById('skin-tone').innerHTML = skinToneColor;
      document.getElementById('skin-tone-box').style.backgroundColor = skinToneColor;
    // Left Eye
      // data points
      var leftEyePoint1 = cc.getImageData(positions[27][0], (positions[27][1] + positions[26][1]) / 2, 1, 1).data;
      var leftEyePoint2 = cc.getImageData(positions[27][0], ((positions[27][1] + positions[26][1]) / 2) + 2, 1, 1).data;
      var leftEyePoint3 = cc.getImageData(positions[27][0], ((positions[27][1] + positions[26][1]) / 2) + 1, 1, 1).data;
      var leftEyePoint4 = cc.getImageData(positions[27][0], ((positions[27][1] + positions[26][1]) / 2) - 2, 1, 1).data;
      var leftEyePoint5 = cc.getImageData(positions[27][0], ((positions[27][1] + positions[26][1]) / 2) - 1, 1, 1).data;
      // rgb averages
      var r = averageColor([leftEyePoint1[0], leftEyePoint2[0], leftEyePoint3[0], leftEyePoint4[0], leftEyePoint5[0]]);
      var g = averageColor([leftEyePoint1[1], leftEyePoint2[1], leftEyePoint3[1], leftEyePoint4[1], leftEyePoint5[1]]);
      var b = averageColor([leftEyePoint1[2], leftEyePoint2[2], leftEyePoint3[2], leftEyePoint4[2], leftEyePoint5[2]]);
      var leftEyeColor = `rgb(${r}, ${g}, ${b})`;
      // set left eye background color and html
      document.getElementById('left-eye').innerHTML = leftEyeColor;
      document.getElementById('left-eye-box').style.backgroundColor = leftEyeColor;

    // Right Eye
      // data points
      var rightEyePoint1 = cc.getImageData(positions[32][0], (positions[32][1] + positions[31][1]) / 2, 1, 1).data;
      var rightEyePoint2 = cc.getImageData(positions[32][0], ((positions[32][1] + positions[31][1]) / 2) + 2, 1, 1).data;
      var rightEyePoint3 = cc.getImageData(positions[32][0], ((positions[32][1] + positions[31][1]) / 2) + 1, 1, 1).data;
      var rightEyePoint4 = cc.getImageData(positions[32][0], ((positions[32][1] + positions[31][1]) / 2) - 2, 1, 1).data;
      var rightEyePoint5 = cc.getImageData(positions[32][0], ((positions[32][1] + positions[31][1]) / 2) - 1, 1, 1).data;
      // rgb averages
      var r = averageColor([rightEyePoint1[0], rightEyePoint2[0], rightEyePoint3[0], rightEyePoint4[0], rightEyePoint5[0]]);
      var g = averageColor([rightEyePoint1[1], rightEyePoint2[1], rightEyePoint3[1], rightEyePoint4[1], rightEyePoint5[1]]);
      var b = averageColor([rightEyePoint1[2], rightEyePoint2[2], rightEyePoint3[2], rightEyePoint4[2], rightEyePoint5[2]]);
      var rightEyeColor = `rgb(${r}, ${g}, ${b})`;
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
