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

function animate(array) {
  ctrack.start(document.getElementById('image'), box);
  drawLoop();
}

function averageColor(array) {
  var sum = array.reduce(function(a, b) { return a + b; });
  return Math.floor(sum / array.length);
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
      // left brow points
      // var leftBrowPoint1 = cc.getImageData(positions[19][0], positions[19][1], 1, 1).data;
      var leftBrowPoint2 = cc.getImageData(positions[20][0], positions[20][1], 1, 1).data;
      var leftBrowPoint3 = cc.getImageData(positions[21][0], positions[21][1], 1, 1).data;
      // var leftBrowPoint4 = cc.getImageData(positions[22][0], positions[22][1], 1, 1).data;
      // right brow points
      // var rightBrowPoint1 = cc.getImageData(positions[15][0], positions[15][1], 1, 1).data;
      var rightBrowPoint2 = cc.getImageData(positions[16][0], positions[16][1], 1, 1).data;
      var rightBrowPoint3 = cc.getImageData(positions[17][0], positions[17][1], 1, 1).data;
      // var rightBrowPoint4 = cc.getImageData(positions[18][0], positions[18][1], 1, 1).data;

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
