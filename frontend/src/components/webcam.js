import React, { useCallback, useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import mywebcam from "./webcam.css";
import AlertDialog from "./Alertdialog";
import rPlayIcon from "./icons/replay.webp";

export default function WebcamVideo({ callback }) {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [filename, setFilename] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [cTimer, setCTimer] = useState(5000);
  const [inTimer, setInTimer] = useState(false);
  const [textColor, setTextColor] = useState("white");
  const [divRect, setDivRect] = useState(null); // Retângulo que define a posição e tamanho da div
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [videoRef, setVideoRef] = useState(null); // Referência para o elemento de vídeo
  const [videoURL, setVideoURL] = useState(""); // URL do vídeo gravadp
  const [videoEnded, setVideoEnded] = useState(false); // Flag para indicar se o vídeo terminou
  const [openDialog, setOpenDialog] = useState(false); // Flag para indicar se o diálogo está aberto
  const timerRef = useRef(null);
  const intervalID = useRef(null);
  const capTimer = useRef(null);

  const captureTimer = useCallback(() => {
    setInTimer(true);
    let timer = 5000;
    capTimer.current = setInterval(() => {
      onUserMedia(webcamRef.current.stream);
      timer -= 1000;
      setCTimer(timer);
      if (timer < 0) {
        setInTimer(false);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused'){
          handleResumeCaptureClick();
        }else {
          handleStartCaptureClick();
        }
        setCTimer(5000);
        clearInterval(capTimer.current);
      }
    }, 1000);
  }, [mediaRecorderRef]);

  const startTimer = useCallback(() => {
    let timer = 0;
    timerRef.current = setInterval(() => {
      timer += 1000;
      setRecordingTime(timer);
    }, 1000);
  }, []);

  const handleEsc = useCallback((event) => {
    if (event.keyCode === 27) {
      setCapturing(false);
      setOpenDialog(true);
      stopTimer();

      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.pause();
      }
      
    }
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

  useEffect(() => {
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [handleEsc]);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(intervalID.current);
      clearTimeout(capTimer.current);
    };
  }, []);

  const adjustTextColor = (brightness) => {
    if (brightness > 125) {
      setTextColor("black"); // Altera para cor preta se o brilho for alto
    } else {
      setTextColor("white"); // Mantém a cor branca se o brilho for baixo
    }
  };

  const handleClose = (retcode) => {
    if(retcode == "0") {
      setOpenDialog(false);
    } else if(retcode == "1") {
      window.location.reload();
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

  const handleAnimation = useCallback(() => {
    let frameCount = 0;
    function animate() {
      frameCount++;
      if (frameCount === 5) {
        // Check if webcamRef.current and webcamRef.current.stream exist before calling onUserMedia
        if (webcamRef.current && webcamRef.current.stream) {
          onUserMedia(webcamRef.current.stream);
          frameCount = 0;
        }
      }
    }
    intervalID.current = setInterval(() => {
      window.requestAnimationFrame(animate);
    }, 500);
  }, [webcamRef]);
  

  const handleTimeout = useCallback(() => {
    setTimeout(() => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setCapturing(false);
      stopTimer();
      clearInterval(intervalID.current);
      setShowVideoPlayer(true);
    }, 180000);
  }, [mediaRecorderRef, setCapturing]);
  
  const handleStartCaptureClick = useCallback(() => {
    if (webcamRef.current && webcamRef.current.stream) {
      setCapturing(true);
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef.current.addEventListener("dataavailable", handleDataAvailable);
      mediaRecorderRef.current.start();
      handleAnimation();
      handleTimeout();
    }
  }, [webcamRef, setCapturing, mediaRecorderRef, handleDataAvailable, handleAnimation, handleTimeout]);
  
  const handleResumeCaptureClick = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      setCapturing(true);
      mediaRecorderRef.current.resume();
      handleAnimation();
      handleTimeout();
    }
  }, [mediaRecorderRef, setCapturing, handleAnimation, handleTimeout]);

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
    setOpenDialog(false);
    stopTimer();
    clearInterval(intervalID.current);
    setShowVideoPlayer(true);
  }, [mediaRecorderRef, setCapturing]);

  const onUserMedia = async (stream) => {
    const videoTrack = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);
    const trackSettings = videoTrack.getSettings();

    const calculateBrightness = async () => {
      const imageBitmap = await imageCapture.grabFrame();
      const canvas = document.createElement("canvas");
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(imageBitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
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

  const handlePlayVideo = useCallback(() => {
    const recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
    const videoURL = URL.createObjectURL(recordedBlob);
    setVideoRef(recordedBlob);
    setVideoURL(videoURL);
  }, [recordedChunks]);

  return (
    <div
      className="Container"
      style={{
        position:
          recordedChunks.length > 0 && capturing == false ? "static" : "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {(capturing || openDialog) && !showVideoPlayer && (
          <div>
            <AlertDialog open={openDialog} onClose={handleClose} text="Deseja sair da gravação?" />
          </div>
      )}
      {showVideoPlayer == false && (
        <div className="Webcam">
          <Webcam
            style={{
              width: "100%",
              height: "100%",
            }}
            audio={true}
            muted={true}
            mirrored={true}
            ref={webcamRef}
            videoConstraints={videoConstraints}
          />
          {!capturing && !inTimer && (
            <div
              className="circle"
              style={{ background: "white" }}
              onClick={() => {
                captureTimer();
              }}
            ></div>
          )}
          {capturing && (
            <div
              className="circle"
              style={{ background: "red" }}
              onClick={handleStopCaptureClick}
            ></div>
          )}

          {!capturing && inTimer && (
            <div
              className="circle"
              style={{
                position: "absolute",
                top: "56%",
                left: "50%",
                width: "150px",
                height: "150px",
                transform: "translate(-50%, -50%)",
                opacity: "25%",
                background: "#e4dfda",
              }}
            ></div>
          )}

          {!capturing && inTimer && (
            <div className="timer">
              <p
                style={{
                  position: "absolute",
                  top: "44%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontSize: "100px",
                  fontWeight: "bolder",
                  color: "white",
                  opacity: "100%",
                }}
              >
                {cTimer / 1000}
              </p>
            </div>
          )}
        </div>
      )}

      {showVideoPlayer == true && (
        <div
          className="VideoPlayer"
          style={{
            position: "static",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <video
            style={{
              width: "100%",
              height: "100%",
            }}
            controls
            autoPlay
            src={videoURL}
            ref={videoRef}
            onEnded={() => {
              setVideoEnded(true);
            }}
          />
          {!videoURL && (
            <div className="triangle-right" onClick={handlePlayVideo}></div>
          )}
          {videoEnded && (
            <div
              className="replay-icon"
              onClick={() => {
                setVideoEnded(false);
                handlePlayVideo();
              }}
            >
              <img
                style={{
                  width: "80px",
                  height: "80px",
                  position: "absolute",
                  top: "40%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  filter:
                    "invert(97%) sepia(0%) saturate(6230%) hue-rotate(309deg) brightness(109%) contrast(102%)",
                  boxShadow: "4px, 6px, 10px, 0 rgba(0, 0, 0, 0.4)",
                  cursor: "pointer",
                }}
                src={rPlayIcon}
                alt="replay"
              />
            </div>
          )}
        </div>
      )}

      {capturing && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p
            style={{
              fontSize: "24px",
              position: "absolute",
              top: "10px",
              right: "150px",
              color: textColor,
              textShadow: "0px 0px 10px rgba(0, 0, 0, 0.28)",
            }}
            ref={handleDivRef}
          >
            Tempo restante:
          </p>

          <p
            style={{
              fontSize: "24px",
              position: "absolute",
              top: "10px",
              right: "95px",
              color: "red",
              textShadow: "0px 0px 10px rgba(0, 0, 0, 0.28)",
            }}
          >
            {Math.floor((recordingTime / (1000 * 60)) % 60)}:
            {Math.floor((recordingTime / 1000) % 60) < 10 ? "0" : ""}
            {Math.floor((recordingTime / 1000) % 60)}
          </p>
        </div>
      )}

      <div style={{ display: "block" }}>
        {recordedChunks.length > 0 && uploaded == false && (
          <button
            style={{ color: "black", fontSize: "14px", letterSpacing: "1px" }}
            onClick={handleUpload}
          >
            Enviar
          </button>
        )}
        {recordedChunks.length > 0 && uploaded == true && (
          <button
            style={{ color: "black", fontSize: "14px", letterSpacing: "1px" }}
            onClick={() => callback(filename)}
          >
            finalizar
          </button>
        )}

        {recordedChunks.length > 0 && uploaded == false && (
          <button
            style={{ color: "black", fontSize: "14px", letterSpacing: "1px" }}
            onClick={() => {
              setRecordedChunks([]);
              setShowVideoPlayer(false);
              setVideoURL("");
              setVideoRef(null);
            }}
          >
            Gravar novamente
          </button>
        )}

        {recordedChunks.length > 0 && uploaded == false && (
          <button
            style={{
              marginLeft: "210px",
              background: "#fcb415",
              boxShadow: " 0 4px 12px rgba(	252, 180, 21, 0.5)",
              color: "black",
              fontSize: "14px",
              letterSpacing: "1px",
            }}
            onClick={() => callback("1")}
          >
            sair
          </button>
        )}
      </div>
    </div>
  );
}
