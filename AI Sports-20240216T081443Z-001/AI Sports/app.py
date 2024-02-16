from flask import Flask, Response,render_template,request , redirect , url_for ,jsonify
import tensorflow as tf
import numpy as np
from matplotlib import pyplot as plt
from PIL import Image
import os
import logging
import base64
import time
import cv2
import mediapipe as mp
import numpy as np
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose

app = Flask(__name__, template_folder='templates', static_folder='static')

"""
@app.route('/arm.html', methods = ['POST']) 
def arm():
    def calculate_angle(a,b,c):
        a = np.array(a)
        b = np.array(b)
        c = np.array(c)
        
        radians = np.arctan2(c[1]-b[1], c[0]-b[0]) - np.arctan2(a[1]-b[1], a[0]-b[0])
        angle = np.abs(radians*180.0/np.pi)
        
        if angle >180.0:
            angle = 360-angle
            
        return angle

    cap = cv2.VideoCapture(0)

    counter = 0
    stage = None
    with mp_pose.Pose(min_detection_confidence=0.5 , min_tracking_confidence = 0.5)as pose:

        while cap.isOpened():

            ret, frame = cap.read()
            
            image = cv2.cvtColor(frame , cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            
            results = pose.process(image)
            
            image.flags.writeable = True
            image = cv2.cvtColor(image , cv2.COLOR_RGB2BGR)
            
            mp_drawing.draw_landmarks(image , results.pose_landmarks , mp_pose.POSE_CONNECTIONS ,
                                    mp_drawing.DrawingSpec(color = (255,0,0) , thickness= 2 , circle_radius= 1),
                                    mp_drawing.DrawingSpec(color = (0,0,255) , thickness= 2 , circle_radius= 1)
                                    )
            
            try:
                landmarks = results.pose_landmarks.landmark
                
                L_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
                L_elbow = [landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.LEFT_ELBOW.value].y]
                L_wrist = [landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].x,landmarks[mp_pose.PoseLandmark.LEFT_WRIST.value].y]
                L_heel = [landmarks[mp_pose.PoseLandmark.LEFT_HEEL.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HEEL.value].y]
                L_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x,landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
                L_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
                R_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
                R_elbow = [landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW.value].y]
                R_wrist = [landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_WRIST.value].y]
                R_heel = [landmarks[mp_pose.PoseLandmark.RIGHT_HEEL.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HEEL.value].y]
                R_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
                R_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x,landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
                
                angle_L_elbow = calculate_angle(L_shoulder , L_elbow , L_wrist)
                angle_L_shoulder = calculate_angle(L_hip , L_shoulder , L_elbow)
                angle_L_knee = calculate_angle(L_heel , L_knee , L_hip)
                angle_L_hip = calculate_angle(L_shoulder , L_hip , L_knee)
                angle_R_elbow = calculate_angle(R_shoulder , R_elbow , R_wrist)
                angle_R_shoulder = calculate_angle(R_hip , R_shoulder , R_elbow)
                angle_R_knee = calculate_angle(R_heel , R_knee , R_hip)
                angle_R_hip = calculate_angle(R_shoulder , R_hip , R_knee)
                
                cv2.putText(image , str(angle_L_elbow) , 
                        tuple(np.multiply(L_elbow , [640,480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX , 0.5 , (0,0,0) , 1, cv2.LINE_AA
                            )
                
                cv2.putText(image , str(angle_L_shoulder) , 
                        tuple(np.multiply(L_shoulder , [640,480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX , 0.5 , (25,0,255) , 1, cv2.LINE_AA
                            )
                
                cv2.putText(image , str(angle_L_hip) , 
                        tuple(np.multiply(L_hip , [640,480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX , 0.5 , (255,70,0) , 1, cv2.LINE_AA
                            )
                
                cv2.putText(image , str(angle_L_knee) , 
                        tuple(np.multiply(L_knee , [640,480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX , 0.5 , (0,0,0) , 1, cv2.LINE_AA
                            )
                
                cv2.putText(image , str(angle_R_elbow) , 
                        tuple(np.multiply(R_elbow , [640,480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX , 0.5 , (0,0,0) , 1, cv2.LINE_AA
                            )
                
                cv2.putText(image , str(angle_R_shoulder) , 
                        tuple(np.multiply(R_shoulder , [640,480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX , 0.5 , (25,0,255) , 1, cv2.LINE_AA
                            )
                
                cv2.putText(image , str(angle_R_hip) , 
                        tuple(np.multiply(R_hip , [640,480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX , 0.5 , (255,70,0) , 1, cv2.LINE_AA
                            )
                
                cv2.putText(image , str(angle_R_knee) , 
                        tuple(np.multiply(R_knee , [640,480]).astype(int)),
                        cv2.FONT_HERSHEY_SIMPLEX , 0.5 , (0,0,0) , 1, cv2.LINE_AA
                            )
                
                if angle_L_elbow < 180  and angle_L_elbow > 160 :
                    stage = "down"

                if angle_L_elbow > 20 and angle_L_elbow < 50 and stage == "down":
                    counter += 1
                    print(counter)
                    stage = "up"
                    
                if (angle_L_elbow < 180 and angle_L_elbow > 160) or (angle_L_elbow > 15 and angle_L_elbow < 50):
                    cv2.rectangle(image , (0,0), (700,80) , (0,0,0) , -1)
                    cv2.putText(image, 'Position', (3,30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,0-255), 1, cv2.LINE_AA)
                    cv2.putText(image , "Correct" , (3,65) ,
                    cv2.FONT_HERSHEY_SIMPLEX , 1 , (0,255,0) , 1 , cv2.LINE_AA)
                    
                    cv2.putText(image, 'REPS', (200,30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,0-255), 1, cv2.LINE_AA)
                    cv2.putText(image , str(counter) , (200,65) ,
                    cv2.FONT_HERSHEY_SIMPLEX , 1 , (255,255,255) , 2 , cv2.LINE_AA)
                    cv2.put                 
                    
                if (angle_L_elbow > 50 and angle_L_elbow < 160 ):
                    cv2.rectangle(image , (0,0), (700,80) , (0,0,0) , -1)
                    cv2.putText(image, 'Position', (3,30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,0-255), 1, cv2.LINE_AA)
                    cv2.putText(image , "UnCorrect" , (3,65) ,
                        cv2.FONT_HERSHEY_SIMPLEX , 1 , (0,0,255) , 1 , cv2.LINE_AA)
                    
                    cv2.putText(image, 'REPS', (200,30), 
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (255,255,0-255), 1, cv2.LINE_AA)
                    cv2.putText(image , str(counter) , (200,65) ,
                    cv2.FONT_HERSHEY_SIMPLEX , 1 , (255,255,255) , 2 , cv2.LINE_AA)
            except:
                pass
            
            
            
            cv2.imshow('Right Movement Angle' , image)

            if cv2.waitKey(10) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()
    return render_template('arm.html')   

def generate_frames():
    cap = cv2.VideoCapture(0)  # Kamera numarası (0 veya başka bir sayı olabilir)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        else:
            ret, buffer = cv2.imencode('.jpg', frame)
            frame_encoded = base64.b64encode(buffer).decode('utf-8')
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_encoded + b'\r\n')

@app.route('/video_feed')
def video_feed():
    return Response(arm(), mimetype='multipart/x-mixed-replace; boundary=frame') """

@app.route('/', methods=['GET'])
def op():
    return render_template('index.html')

@app.route('/arm.html')
def arm_page():
    return render_template('arm.html')

@app.route('/chest.html')
def chest_page():
    return render_template('chest.html')

@app.route('/deneme.html')
def deneme():
    return render_template('deneme.html')

@app.route('/back.html')
def back_page():
    return render_template('back.html')

@app.route('/shoulder.html')
def shoulder_page():
    return render_template('shoulder.html')

@app.route('/leg.html')
def leg_page():
    return render_template('leg.html')

@app.route('/abs.html')
def abs_page():
    return render_template('abs.html')

@app.route('/soon.html')
def soon_page():
    return render_template('soon.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0' ,port=8000 , debug=True)
