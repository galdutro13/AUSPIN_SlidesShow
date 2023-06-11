import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function WebcamVideo({ callback }) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [filename, setFilename] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [textColor, setTextColor] = useState("white");
  const [divRect, setDivRect] = useState(null); // Retângulo que define a posição e tamanho da div

  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    let timer = 0;
    timerRef.current = setInterval(() => {
      timer += 1000;
      setRecordingTime(timer);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  useEffect(() => {
    if (capturing) {
      startTimer();
    }
  }, [capturing, startTimer]);

  const adjustTextColor = (brightness) => {
    if (brightness > 200) {
      setTextColor("black"); // Altera para cor preta se o brilho for alto
    } else {
      setTextColor("white"); // Mantém a cor branca se o brilho for baixo
    }
  };

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm",
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
    setTimeout(() => {
      mediaRecorderRef.current.stop();
      setCapturing(false);
      stopTimer();
    }, 180000);
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    stopTimer();
  }, [mediaRecorderRef, setCapturing]);

  const onUserMedia = async (stream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);
    const trackSettings = videoTrack.getSettings();

    const calculateBrightness = async () => {
      const imageBitmap = await imageCapture.grabFrame();
      const data = await imageBitmap.data;
      const brightness = calculateImageBrightness(
        data,
        trackSettings.width,
        trackSettings.height
      );
      adjustTextColor(brightness);
    };

    const calculateImageBrightness = (data, width, height) => {
      let totalBrightness = 0;
      const totalPixels = width * height * 4; // Cada pixel possui 4 componentes (RGBA)

      // Verifica se há um retângulo definido para a div
      if (divRect) {
        const { left, top, width: divWidth, height: divHeight } = divRect;

        const startX = Math.max(0, Math.floor(left));
        const startY = Math.max(0, Math.floor(top));
        const endX = Math.min(width, Math.floor(left + divWidth));
        const endY = Math.min(height, Math.floor(top + divHeight));

        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const i = (y * width + x) * 4;
            const red = data[i];
            const green = data[i + 1];
            const blue = data[i + 2];

            // Fórmula para calcular o brilho: média dos valores RGB
            const brightness = (red + green + blue) / 3;

            totalBrightness += brightness;
          }
        }
      } else {
        // Se não houver um retângulo definido, calcula o brilho para todos os pixels
        for (let i = 0; i < totalPixels; i += 4) {
          const red = data[i];
          const green = data[i + 1];
          const blue = data[i + 2];

          // Fórmula para calcular o brilho: média dos valores RGB
          const brightness = (red + green + blue) / 3;

          totalBrightness += brightness;
        }
      }

      const averageBrightness = totalBrightness / (totalPixels / 4); // Divide por 4 para obter a média

      return averageBrightness;
    };

    calculateBrightness();
  };

  const handleUpload = useCallback(async () => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });

      const timestamps = new Date().toISOString().replace(/:/g, "-");
      const filename = `video_${timestamps}.webm`;
      setFilename(filename);

      const file = new File([blob], filename);

      const formData = new FormData();
      formData.append("file", file);

      try {
        await axios.post("http://localhost:3000/api/videos", formData);
        setUploaded(true);
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  }, [recordedChunks]);

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const handleDivRef = useCallback((ref) => {
    if (ref) {
      const rect = ref.getBoundingClientRect();
      setDivRect(rect);
    }
  }, []);

  return (
    <div
      className="Container"
      style={{
        position:
          recordedChunks.length > 0 && capturing === false ? "static" : "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <Webcam
        style={{
          width:
            recordedChunks.length > 0 && capturing === false ? "75%" : "100%",
          height:
            recordedChunks.length > 0 && capturing === false ? "75%" : "100%",
        }}
        audio={true}
        muted={true}
        mirrored={true}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        onClick={capturing ? handleStopCaptureClick : handleStartCaptureClick}
        onUserMedia={onUserMedia}
      />

      {capturing && (
        <div ref={handleDivRef}>
          <p
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              color: textColor,
            }}
          >
            Tempo restante: {(180000 - recordingTime) / 1000} seconds
          </p>
        </div>
      )}

      {recordedChunks.length > 0 && uploaded === false && (
        <button onClick={handleUpload}>Enviar</button>
      )}
      {recordedChunks.length > 0 && uploaded === true && (
        <button onClick={() => callback(filename)}>finalizar</button>
      )}
      <p>Tempo restante: {(180000 - recordingTime) / 1000} seconds</p>
    </div>
  );
}