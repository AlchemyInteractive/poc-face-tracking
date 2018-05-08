var cc = document.getElementById('image').getContext('2d');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
// var img = new Image();
// img.onload = function() {
//   cc.drawImage(img,0,0,400, 400);
// };
// // img.src = './media/images/kevin.jpeg';
var ctrack = new clm.tracker({stopOnConvergence : true});
ctrack.init();
var drawRequest;
function animateClean() {
  ctrack.start(document.getElementById('image'));
  drawLoop();
}
function animate(box) {
  ctrack.start(document.getElementById('image'), box);
  drawLoop();
}
function drawLoop() {
  var positions = ctrack.getCurrentPosition();
  drawRequest = requestAnimFrame(drawLoop);
  overlayCC.clearRect(0, 0, 720, 576);
  if (ctrack.getCurrentPosition()) {
    ctrack.draw(overlay);
  }
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

// detect if tracker fails to find a face
// document.addEventListener("clmtrackrNotFound", function(event) {
//   ctrack.stop();
//   alert("The tracking had problems with finding a face in this image. Try selecting the face in the image manually.")
// }, false);

// detect if tracker loses tracking of face
// document.addEventListener("clmtrackrLost", function(event) {
//   ctrack.stop();
//   alert("The tracking had problems converging on a face in this image. Try selecting the face in the image manually.")
// }, false);

// detect if tracker has converged
document.addEventListener("clmtrackrConverged", function(event) {
  document.getElementById('convergence').innerHTML = "DONE";
  document.getElementById('convergence').style.backgroundColor = "#00FF00";
  // stop drawloop
  cancelRequestAnimFrame(drawRequest);
}, false);

// update stats on iteration
document.addEventListener("clmtrackrIteration", function(event) {
}, false);

// function to start showing images
function loadImage() {
  if (fileList.indexOf(fileIndex) < 0) {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        // check if positions already exist in storage
        // Render thumbnail.
        var canvas = document.getElementById('image')
        var overlay = document.getElementById('overlay')
        var cc = canvas.getContext('2d');
        var img = new Image();
        img.onload = function() {
          if (img.height > 500 || img.width > 700) {
            var rel = img.height/img.width;
            var neww = 700;
            var newh = neww*rel;
            if (newh > 500) {
              newh = 500;
              neww = newh/rel;
            }
            canvas.setAttribute('width', neww);
            canvas.setAttribute('height', newh);
            overlay.setAttribute('width', neww);
            overlay.setAttribute('height', newh);
            cc.drawImage(img,0,0,neww, newh);
          } else {
            canvas.setAttribute('width', img.width);
            canvas.setAttribute('height', img.height);
            overlay.setAttribute('width', img.width);
            overlay.setAttribute('height', img.height);
            cc.drawImage(img,0,0,img.width, img.height);
          }
        }
        img.src = e.target.result;
      };
    })(fileList[fileIndex]);
    reader.readAsDataURL(fileList[fileIndex]);
    overlayCC.clearRect(0, 0, 720, 576);
    document.getElementById('convergence').innerHTML = "";
    ctrack.reset();
  }
}

// set up file selector and variables to hold selections
var fileList, fileIndex;
if (window.File && window.FileReader && window.FileList) {
  function handleFileSelect(evt) {
    var files = evt.target.files;
    fileList = [];
    for (var i = 0;i < files.length;i++) {
      if (!files[i].type.match('image.*')) {
        continue;
      }
      fileList.push(files[i]);
    }
    if (files.length > 0) {
      fileIndex = 0;
    }
    loadImage();
  }
  document.getElementById('files').addEventListener('change', handleFileSelect, false);
} else {
  $('#files').addClass("hide");
  $('#loadimagetext').addClass("hide");
}

/*----- video stream functions -----*/
var vid = document.getElementById('videoel');
var vid_width = vid.width;
var vid_height = vid.height;
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
/*********** Setup of video/webcam and checking for webGL support *********/
function enablestart() {
  var startbutton = document.getElementById('startbutton');
  startbutton.value = "Process Features";
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

  // Get an image dataURL from the canvas.
  var imageDataURL = hidden_canvas.toDataURL('image/png');

  // Set the dataURL as source of an image element, showing the captured photo.
  image.setAttribute('src', imageDataURL);
}