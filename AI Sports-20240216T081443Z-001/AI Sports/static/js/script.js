let counter = 1;
let nav = document.getElementById("nav");
let button = document.getElementById("button");
let content = document.getElementById("home-content");
$('.navTrigger').click(function () {
    $(this).toggleClass('active');
    counter++;
    content.style.zIndex = -1;
    button.style.zIndex = -1;
    if(counter % 2 == 1){
        $('.navTrigger').click(function () {
            content.style.zIndex = -1;
            button.style.zIndex = -1;
        });
    }else{
        $('.navTrigger').click(function () {
            content.style.zIndex = +1;
            button.style.zIndex = +1;
        });
    }
    $("#mainListDiv").toggleClass("show_list");
    $("#mainListDiv").fadeIn();

});
$(window).scroll(function() {
    if ($(document).scrollTop() > 250) {
        $('.nav').addClass('affix');
       
    } else {
        $('.nav').removeClass('affix');
    }
});
$(window).scroll(function() {
    if ($(document).scrollTop() > 250) {
        content.style.zIndex = -1;
        button.style.zIndex = -1;
        nav.style.zIndex = +1;
    }else{
        content.style.zIndex = +1;
        button.style.zIndex = +1;
        

    }
});


/*
let navTrigger = document.getElementsByClassName("navTrigger active");

$('.navTrigger active').click(function () {
    navTrigger.style.zIndex = +1;
    console.log("31");
});*/
let kamera = document.getElementById("kamera");
let kol_img = document.getElementById("kol_img");
const sourceElement = document.getElementById('kol_img');
const targetElement = document.getElementById('kamera');
const sourceHeight = sourceElement.offsetHeight;
let folder = document.getElementById("folder");



let armbtn = document.getElementById("armbtn");


document.addEventListener('DOMContentLoaded', function () {
  var video = document.getElementById('myVideo');
  video.removeAttribute('controls'); // Kontrolleri kaldır
  video.muted = true; // Sesini kapat

  video.addEventListener('loadedmetadata', function() {
      video.removeAttribute('controls'); // Kontrolleri kaldırmayı sürdür
  });
});

const folder1 = document.getElementById('folder');
const videofolder = document.getElementById('videofolder');
const video1 = document.getElementById('myVideo');
const canvasElementFolder = document.getElementsByClassName('output_canvas_folder')[0];
const canvasCtxFolder = canvasElementFolder.getContext('2d');
armbtn_folder.addEventListener("click",function(){
  
});

videofolder.addEventListener('change', function(event) {
  const selectedFile = event.target.files[0];
  const objectURL = URL.createObjectURL(selectedFile);
  video1.src = objectURL;
  kamera.style.display = "none";
  video1.style.display = "none";
  kol_img.style.display = "none";
  folder.style.display = "block";
  video1.style.height = sourceHeight + 'px';
  


    video1.addEventListener("loadeddata", () => {
      startEstimation(video1);
    });
  

  function startEstimation(video) {
    let width = 360;
    let height = 480;

    canvasElementFolder.width = width;
    canvasElementFolder.height = height;

    video1.play();

    async function detectionFrame(now, metadata) {
      video1.playbackRate = 2;// Play with 80% of speed to perform better processing of video
      video1.pause();
      await pose.send({ image: video1 });
      video1.requestVideoFrameCallback(detectionFrame);
    }
    video1.requestVideoFrameCallback(detectionFrame);
  }

  const pose = new Pose({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  }});

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  pose.onResults(onResults);

  function onResults(results) {
    canvasCtxFolder.save();
    canvasCtxFolder.clearRect(0, 0, canvasElementFolder.width, canvasElementFolder.height);
    canvasCtxFolder.drawImage(results.segmentationMask, 0, 0,
                        canvasElementFolder.width, canvasElementFolder.height);
  
    // Only overwrite existing pixels.
    canvasCtxFolder.globalCompositeOperation = 'source-in';
    canvasCtxFolder.fillStyle = 'transparent';
    canvasCtxFolder.fillRect(0, 0, canvasElementFolder.width, canvasElementFolder.height);
    
    canvasCtxFolder.globalCompositeOperation = 'source-over';
    canvasCtxFolder.font = '20px Arial'; // Yazı tipi ve boyutu
    canvasCtxFolder.fillStyle = 'black'; // Yazı rengi


    
    // Only overwrite missing pixels.
    canvasCtxFolder.globalCompositeOperation = 'destination-atop';
    canvasCtxFolder.drawImage(
        results.image, 0, 0, canvasElementFolder.width, canvasElementFolder.height);
  
    canvasCtxFolder.globalCompositeOperation = 'source-over';
    drawConnectors(canvasCtxFolder, results.poseLandmarks, POSE_CONNECTIONS,
                   {color: '#7dd4f2', lineWidth: 4});
    drawLandmarks(canvasCtxFolder, results.poseLandmarks,
                  {color: '#11343f', lineWidth: 0.5});
                  let landmarks = results.poseLandmarks;
                  const L_shoulderx = landmarks[11].x;
                  const L_shouldery = landmarks[11].y;
                  const L_elbowx = landmarks[11].x;
                  const L_elbowy = landmarks[11].y;
                  const L_wristx = landmarks[15].x;   
                  const L_wristy = landmarks[15].y;    
                  
                  let angle_L_elbow = calculateAngle(L_shoulderx,L_shouldery,L_elbowx,L_elbowy,L_wristx,L_wristy);
                  
                  console.log(angle_L_elbow);
                  for (let landmark of landmarks) {
                      // landmark.x ve landmark.y gibi özelliklere erişebilirsiniz
                      //console.log("X:", landmark.x, "Y:", landmark.y);
                      // İşlemlerinizi burada devam ettirin...
                  }
                          function calculateAngle(ax,ay, bx,by, cx, cy) {
                              let ax1 = ax, ay1 = ay;
                              let bx1 = bx, by1 = by;
                              let cx1 = cx, cy1 = cy;
                              
                              let radians = Math.atan2(cy1 - by1, cx1 - bx1) - Math.atan2(ay1 - by1, ax1 - bx1);
                              let angle = Math.abs(radians * 360.0 / Math.PI);
                              
                              if (angle > 180.0) {
                                  angle = 270 - angle;
                              }
                              
                              return angle;
                          }
                          function calculateRep(){
                            counter=0;
                            
                            if (angle_L_elbow > 20 && angle_L_elbow < 50){
                              counter += 1}
                          }
                          


      video1.play();
      canvasCtxFolder.restore();


  }
  

});

const videoElement = document.getElementsByClassName('input_video')[0];
const videoElement1 = document.getElementById('myVideo');

const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];





  armbtn.addEventListener("click",function(){
    
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(function(stream) {
        function onResults(results) {
        if (!results.poseLandmarks) {
          return;
        }
        let landmarks = results.poseLandmarks; // Örnek bir MediaPipe.js çıkışı


        kamera.style.display = "block";
        kol_img.style.display = "none";
        targetElement.style.height = sourceHeight + 'px';

// landmarks verisini kullanarak yapmak istediğiniz işlemleri gerçekleştirin
// Örneğin:
const L_shoulderx = landmarks[11].x;
const L_shouldery = landmarks[11].y;
const L_elbowx = landmarks[11].x;
const L_elbowy = landmarks[11].y;
const L_wristx = landmarks[15].x;   
const L_wristy = landmarks[15].y;    

let angle_L_elbow = calculateAngle(L_shoulderx,L_shouldery,L_elbowx,L_elbowy,L_wristx,L_wristy);

console.log(angle_L_elbow);
for (let landmark of landmarks) {
    // landmark.x ve landmark.y gibi özelliklere erişebilirsiniz
    //console.log("X:", landmark.x, "Y:", landmark.y);
    // İşlemlerinizi burada devam ettirin...
}
        function calculateAngle(ax,ay, bx,by, cx, cy) {
            let ax1 = ax, ay1 = ay;
            let bx1 = bx, by1 = by;
            let cx1 = cx, cy1 = cy;
            
            let radians = Math.atan2(cy1 - by1, cx1 - bx1) - Math.atan2(ay1 - by1, ax1 - bx1);
            let angle = Math.abs(radians * 180.0 / Math.PI);
            
            if (angle > 180.0) {
                angle = 360 - angle;
            }
            
            return angle;
        }
        
      
        videoElement.addEventListener('loadeddata', function () {
            setInterval(() => {
              // Video görüntüsünü canvas'a kopyala
              canvasCtx.drawImage(video, 0, 0, video.width, video.height);
    
              // Yazıyı canvas'a ekle
              const text = 'Merhaba, dünya!';
              canvasCtx.font = '24px Arial';
              canvasCtx.fillStyle = 'white';
              canvasCtx.fillText(text, 20, 50);
    
            }, 1000 / 30); // 30 FPS
          });
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.segmentationMask, 0, 0,
                            canvasElement.width, canvasElement.height);
      
        // Only overwrite existing pixels.
        canvasCtx.globalCompositeOperation = 'source-in';
        canvasCtx.fillStyle = 'transparent';
        canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
        
        canvasCtx.globalCompositeOperation = 'source-over';
        canvasCtx.font = '20px Arial'; // Yazı tipi ve boyutu
        canvasCtx.fillStyle = 'black'; // Yazı rengi
        canvasCtx.fillText("angle_L_elbow.toString(", L_elbowx, L_elbowy); 


        
        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);
      
        canvasCtx.globalCompositeOperation = 'source-over';
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                       {color: '#00FF00', lineWidth: 4});
        drawLandmarks(canvasCtx, results.poseLandmarks,
                      {color: '#FF0000', lineWidth: 2});
        canvasCtx.restore();
    }
      
      const pose = new Pose({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }});
      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });
      pose.onResults(onResults);
    
      

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await pose.send({image: videoElement});
        },
        width: 480,
        height: 360
      });
      camera.start();
      armbtn_stop.addEventListener("click",function(){
        camera.stop();
        kamera.style.display = "none";
        kol_img.style.display = "block";
    });
    })
    .catch(function(err) {
    // Kullanıcı izin vermezse veya bir hata olursa burada işlemler yapabilirsiniz
    console.log("Kamera veya mikrofon erişimi reddedildi: ", err);
    });
}); 

////////////////////////////////////////////////


