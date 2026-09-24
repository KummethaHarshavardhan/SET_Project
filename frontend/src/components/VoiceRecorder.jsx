import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaMicrophone, FaStop, FaSpinner } from "react-icons/fa";
import { uploadRecording } from "../services/recordingService";
import { useToast } from "../context/ToastContext";
import "../styles/voiceRecorder.css";

const PUBLIC_AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/"];

function VoiceRecorder() {
  const toast = useToast();
  const location = useLocation();

  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [duration, setDuration] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const durationRef = useRef(0);

  // Sync token state on route transition or auth events
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  useEffect(() => {
    const handleAuthChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("auth-changed", handleAuthChange);
    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("auth-changed", handleAuthChange);
    };
  }, []);

  const isAuthRoute = PUBLIC_AUTH_ROUTES.includes(location.pathname);
  const isAuthenticated = Boolean(token && !isAuthRoute);

  // Stop recording and release microphone if user logs out or leaves authenticated pages
  useEffect(() => {
    if (!isAuthenticated) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        try {
          mediaRecorderRef.current.onstop = null; // discard upload on logout
          mediaRecorderRef.current.stop();
        } catch (e) {
          // Ignore error on abort
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsRecording(false);
      setIsUploading(false);
      setDuration(0);
      durationRef.current = 0;
    }
  }, [isAuthenticated, location.pathname]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // HIDE on login, register, forgot-password, and unauthenticated pages
  if (!isAuthenticated) {
    return null;
  }

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      toast.warning("Please log in to record and save voice notes.");
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast.error("Audio recording is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let mimeType = "audio/webm";
      if (typeof MediaRecorder.isTypeSupported === "function") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          mimeType = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          mimeType = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
          mimeType = "audio/ogg;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          mimeType = "audio/mp4";
        }
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const finalDuration = durationRef.current;

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (audioBlob.size === 0) {
          toast.warning("Recording was empty.");
          return;
        }

        setIsUploading(true);
        try {
          const ext = mimeType.includes("mp4")
            ? "mp4"
            : mimeType.includes("ogg")
            ? "ogg"
            : "webm";

          const formData = new FormData();
          formData.append(
            "audio",
            audioBlob,
            `voice_recording_${Date.now()}.${ext}`
          );
          formData.append("duration", finalDuration.toString());
          formData.append("recordedAt", new Date().toISOString());

          await uploadRecording(formData);
          toast.success("Voice recording saved successfully!");

          window.dispatchEvent(new CustomEvent("recording-created"));
        } catch (err) {
          console.error("Recording upload failed:", err);
          toast.error(err?.message || "Failed to save voice recording.");
        } finally {
          setIsUploading(false);
          setDuration(0);
          durationRef.current = 0;
        }
      };

      recorder.start(250);
      setIsRecording(true);
      setDuration(0);
      durationRef.current = 0;

      timerIntervalRef.current = setInterval(() => {
        setDuration((prev) => {
          const next = prev + 1;
          durationRef.current = next;
          return next;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone access error:", err);
      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError"
      ) {
        toast.error(
          "Microphone permission denied. Please allow microphone access in your browser settings."
        );
      } else if (
        err.name === "NotFoundError" ||
        err.name === "DevicesNotFoundError"
      ) {
        toast.error("No microphone found on your device.");
      } else {
        toast.error(err.message || "Failed to access microphone.");
      }
    }
  };

  const stopRecording = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    setIsRecording(false);
  };

  const handleClick = () => {
    if (isUploading) return;

    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="voice-recorder-container" aria-live="polite">
      {isRecording && (
        <div className="voice-recorder-timer">
          <span className="voice-recorder-blink-dot" />
          <span>REC {formatTimer(duration)}</span>
        </div>
      )}

      <button
        type="button"
        id="voice-recorder-btn"
        className={`voice-recorder-btn ${isRecording ? "recording" : ""}`}
        onClick={handleClick}
        title={
          isUploading
            ? "Saving recording..."
            : isRecording
            ? "Click to stop recording"
            : "Click to start recording"
        }
        aria-label={isRecording ? "Stop voice recording" : "Start voice recording"}
        disabled={isUploading}
      >
        {isUploading ? (
          <FaSpinner className="recorder-spinner" />
        ) : isRecording ? (
          <FaStop />
        ) : (
          <FaMicrophone />
        )}
      </button>
    </div>
  );
}

export default VoiceRecorder;
