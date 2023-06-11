import React, { useCallback, useRef, useState, useEffect } from 'react';
import Webcam from "react-webcam";
import axios from 'axios';

export default function WebcamVideo({ callback }) {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const [capturing, setCapturing] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [filename, setFilename] = useState('');
    const [uploaded, setUploaded] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
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

    const handleUpload = useCallback(async () => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm",
            });

            const timestamps = new Date().toISOString().replace(/:/g, '-');
            const filename = `video_${timestamps}.webm`;
            setFilename(filename);

            const file = new File([blob], filename);

            const formData = new FormData();
            formData.append('file', file);

            try {
                await axios.post('http://localhost:3000/api/videos', formData);
                setUploaded(true);
            } catch (error) {
                console.error('Error uploading video:', error);
            }
        }
    }, [recordedChunks]);

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: "user",
    };

    return (
        <div className="Container"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <Webcam
                style={{ width: '100%', height: '100%' }}
                audio={true}
                muted={true}
                mirrored={true}
                ref={webcamRef}
                videoConstraints={videoConstraints}
            />
            {capturing ? (onClick={handleStopCaptureClick}) : (onClick={handleStartCaptureClick})}
            
            {recordedChunks.length > 0 && uploaded == false && (
                <button onClick={handleUpload}>Enviar</button>
            )}
            {recordedChunks.length > 0 && uploaded == true && (
                <button onClick={() => callback(filename)}>finalizar</button>
            )}
            <p>Recording Time: {recordingTime / 1000} seconds</p>
        </div>
    );
}
