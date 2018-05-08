var cc = document.getElementById('image').getContext('2d');
var overlay = document.getElementById('overlay');
var overlayCC = overlay.getContext('2d');
var img = new Image();
img.onload = function() {
  cc.drawImage(img,0,0,400, 400);
};
img.src = './media/images/kevin.jpeg';
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
document.addEventListener("clmtrackrNotFound", function(event) {
  ctrack.stop();
  alert("The tracking had problems with finding a face in this image. Try selecting the face in the image manually.")
}, false);

// detect if tracker loses tracking of face
document.addEventListener("clmtrackrLost", function(event) {
  ctrack.stop();
  alert("The tracking had problems converging on a face in this image. Try selecting the face in the image manually.")
}, false);

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
