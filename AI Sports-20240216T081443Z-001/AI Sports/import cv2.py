import cv2
import mediapipe as mp

mp_hands = mp.solutions.hands
hands = mp_hands.Hands()

cap = cv2.VideoCapture(0)

prev_points = []
current_points = []

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("Kamera ile bağlantı kurulamadı.")
        break

    # Görüntüyü RGB formatına çevirin
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    # Mediapipe el modelini kullanarak el izleme
    results = hands.process(rgb_frame)

    # El konumlarını çizme
    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            # Her bir anahtar noktayı çizme
            for idx, landmark in enumerate(hand_landmarks.landmark):
                height, width, _ = frame.shape
                cx, cy = int(landmark.x * width), int(landmark.y * height)
                current_points.append((cx, cy))
                cv2.circle(frame, (cx, cy), 5, (255, 0, 0), -1)

            # Geçmiş ve şu anki konumlar arasında çizgi çizme
            if len(prev_points) > 0:
                for i in range(1, min(len(current_points)),len(current_points)):
                    cv2.line(frame, prev_points[i - 1], current_points[i], (0, 0, 255), 2)

    # Geçmiş konumları güncelleme
    prev_points = current_points.copy()

    # Görüntüyü ekrana gösterme
    cv2.imshow('Hand Tracking with Trail', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()