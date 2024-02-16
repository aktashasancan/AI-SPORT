let counter = 1;
let nav = document.getElementById("nav");
$('.navTrigger').click(function () {
    $(this).toggleClass('active');
    counter++;
    if(counter % 2 == 1){
        $('.navTrigger').click(function () {
        });
    }else{
        $('.navTrigger').click(function () {
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
        nav.style.zIndex = +1;
    }else{
        

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
let analiz = document.getElementById("card__analiz");
let desc = document.getElementById("card__desc");
let rep = document.getElementById("rep");
let süre = document.getElementById("süre");
let indirme = document.getElementById("indirme");
let tekrar = document.getElementById("tekrar");
let armbtn = document.getElementById("armbtn");
let tekrarrenk = document.getElementById("tekrarrenk");
let sürerenk = document.getElementById("sürerenk");
let indirmerenk = document.getElementById("indirmerenk");
let reprenk = document.getElementById("reprenk");

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
  desc.style.display = "none";
  analiz.style.display = "block";
  video1.style.height = sourceHeight + 'px';
  


    video1.addEventListener("loadeddata", () => {
      startEstimation(video1);
    });
  

  function startEstimation(video) {
    let width = 420;
    let height = sourceHeight +60;

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

  counter = 0;
  stage = null;
  let kaldırmastart = 0;
  let kaldırmaend = 0;
  let indirmestart = 0;
  let indirmeend = 0;
  let start = 0;
  let end = 0;
  let array = [];
  let arraytime = [];
  let time = 0;
  let indirmearray= [];
  let indirmetime = []; 
  let time1  = 0;
  let timeElapsed  =0;
  
  function onResults(results) {
    try {
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
                  const L_elbowx = landmarks[13].x;
                  const L_elbowy = landmarks[13].y;
                  const L_wristx = landmarks[15].x;   
                  const L_wristy = landmarks[15].y;  
                  const R_shoulderx = landmarks[12].x;
                  const R_shouldery = landmarks[12].y;
                  const R_elbowx = landmarks[14].x;
                  const R_elbowy = landmarks[14].y;
                  const R_wristx = landmarks[16].x;   
                  const R_wristy = landmarks[16].y;  


                  let angle_R_elbow = calculateAngle(R_shoulderx,R_shouldery,R_elbowx,R_elbowy,R_wristx,R_wristy);

                  let angle_L_elbow = calculateAngle(L_shoulderx,L_shouldery,L_elbowx,L_elbowy,L_wristx,L_wristy);
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
                          if(( angle_L_elbow < 180  && angle_L_elbow > 120 )){
                            
                            kaldırmastart = new Date().getTime();
                            array.push(angle_L_elbow);
                            arraytime.push(kaldırmastart);
                            let maxaci = Math.max(...array);
                            let indeks = array.indexOf(maxaci);
                            time = arraytime[indeks];
                            
                            if(( angle_L_elbow < 180  && angle_L_elbow > 120 && stage == "up")){
                            counter += 1;
                              if(counter<3){
                                rep.innerHTML = "<b>Tekrar Sayısı:</b> ";
                                reprenk.innerHTML = counter + " Tekrar";
                                reprenk.style.color= "#c20a0a";
                              }
                              else if(counter<=3&&counter<6){
                                rep.innerHTML = "<b>Tekrar Sayısı:</b> ";
                                reprenk.innerHTML = counter + " Tekrar";
                                reprenk.style.color= "#c04d00";
                              }else if(counter<=6&&counter<9){
                                rep.innerHTML = "<b>Tekrar Sayısı:</b> ";
                                reprenk.innerHTML = counter + " Tekrar";
                                reprenk.style.color= "#a28b00";
                              }else if(counter<=9&&counter<11){
                                rep.innerHTML = "<b>Tekrar Sayısı:</b> ";
                                reprenk.innerHTML = counter + " Tekrar";
                                reprenk.style.color= "#79ad00";
                              }else{
                                rep.innerHTML = "<b>Tekrar Sayısı:</b> ";
                                reprenk.innerHTML = counter + " Tekrar";
                                reprenk.style.color= "#00cc0a";

                              }
                              
                            }
                            stage = "down";
                            if((angle_L_elbow <180 && angle_L_elbow > 120 )){
                              indirmearray.length  = 0;
                              indirmetime.length = 0;
                              let timeElapsed1 = (time-time1)/1000;
                              let toplam = (timeElapsed1)+(timeElapsed);
                              if(toplam > 1.5 && toplam < 5.5){
                                tekrar.innerHTML = "<b>Tekrar Süresi:</b> ";
                                tekrarrenk.innerHTML = " " +toplam.toFixed(2) + " Saniye";
                                tekrarrenk.style.color = "#0aa612";
                              }else{
                                tekrar.innerHTML = "<b>Tekrar Süresi:</b> ";
                                tekrarrenk.innerHTML = " "+ toplam.toFixed(2) + " Saniye";
                                tekrarrenk.style.color = "#ba0909";

                              }
                              
                              if(timeElapsed1>1.5 && timeElapsed1<4){
                                indirme.innerHTML = "<b>İndirme Süresi:</b> ";
                                indirmerenk.innerHTML = " " +(timeElapsed1).toFixed(2) + " Saniye";
                                indirmerenk.style.color = "#0aa612";
                              }else{
                                indirme.innerHTML = "<b>İndirme Süresi:</b> ";
                                indirmerenk.innerHTML = " "+ (timeElapsed1).toFixed(2) + " Saniye";
                                indirmerenk.style.color = "#ba0909";
                                
                              }
                          

                            }
                            
                            start = new Date().getTime();
                          }
                          
                          if ((angle_L_elbow > 10 && angle_L_elbow < 110 && stage == "down")){
                              array.length  = 0;
                              arraytime.length = 0;
                              end = new Date().getTime();
                              kaldırmaend = new Date().getTime();
                              timeElapsed = (kaldırmaend - time)/1000;
                              
                              stage = "up";
                              
                              
                              if(timeElapsed>0 && timeElapsed<1.5){
                                süre.innerHTML = "<b>Kaldırma Süresi:</b> " ;
                                sürerenk.innerHTML = timeElapsed +" Saniye";
                                sürerenk.style.color = "#0aa612";
                              }else{
                                süre.innerHTML = "<b>Kaldırma Süresi:</b> " ;
                                sürerenk.innerHTML = timeElapsed +" Saniye";
                                sürerenk.style.color = "#ba0909";
                              }
                              
                              
                          }
                          if ((angle_L_elbow > 10 && angle_L_elbow < 110)){
                            indirmestart = new Date().getTime();
                            indirmearray.push(angle_L_elbow);
                            indirmetime.push(indirmestart);
                            let minxaci = Math.min(...indirmearray);
                            let indeks1 = indirmearray.indexOf(minxaci);
                            time1 = indirmetime[indeks1];
                            console.log(minxaci,indeks1)
                          }
            
      video1.play();
      canvasCtxFolder.restore();
    } catch (error) {
      kol_img.style.display = "block";
      folder.style.display = "none";

    }
    


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
const L_elbowx = landmarks[13].x;
const L_elbowy = landmarks[13].y;
const L_wristx = landmarks[15].x;   
const L_wristy = landmarks[15].y;    
let start = 0;
let end = 0;
let angle_L_elbow = calculateAngle(L_shoulderx,L_shouldery,L_elbowx,L_elbowy,L_wristx,L_wristy);

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
        if(( angle_L_elbow < 180  && angle_L_elbow > 150 )){
          start = new Date().getTime();
          stage = "down"
        }
        if ((angle_L_elbow > 10 && angle_L_elbow < 90 && stage == "down")){
        end = new Date().getTime();
        counter += 1;
        console.log(counter);
        stage = "up";
        let timeElapsed = end - start;

        console.log(angle_L_elbow, timeElapsed);
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
                       {color: '#7dd4f2', lineWidth: 4});
        drawLandmarks(canvasCtx, results.poseLandmarks,
                      {color: '#11343f', lineWidth: 0.5});
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


