import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import ConfirmDialog from "../components/ConfirmDialog";
import {
  getRecordings,
  deleteRecording,
  getAudioStreamUrl,
} from "../services/recordingService";
import { useToast } from "../context/ToastContext";
import {
  FaPlay,
  FaPause,
  FaTrash,
  FaMicrophone,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";
import "../styles/recordings.css";

// Helper to format date as DD-MM-YYYY
function formatDate(dateInput) {
  if (!dateInput) return "N/A";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "N/A";
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper to format time as HH:MM AM/PM
function formatTime(dateInput) {
  if (!dateInput) return "N/A";
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "N/A";
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
}

// Format seconds to M:SS
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function RecordingCard({ recording, onDelete }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(recording.duration || 0);
  const audioRef = useRef(null);

  const audioId = recording.id || recording._id;
  const audioSrc = getAudioStreamUrl(audioId);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Pause any other playing audio on the page
      document.querySelectorAll("audio").forEach((el) => {
        if (el !== audioRef.current) {
          el.pause();
        }
      });
      audioRef.current.play().catch((err) => {
        console.error("Audio playback error:", err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setTotalDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const seekTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const recordedDate = recording.created_at || recording.createdAt;

  return (
    <div className="recording-card">
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
      />

      {/* Top Player Row */}
      <div className="recording-player-top">
        <button
          type="button"
          className={`recording-play-btn ${isPlaying ? "playing" : ""}`}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause recording" : "Play recording"}
        >
          {isPlaying ? <FaPause /> : <FaPlay style={{ marginLeft: "2px" }} />}
        </button>

        <div className="recording-progress-wrap">
          <input
            type="range"
            className="recording-seekbar"
            min="0"
            max={totalDuration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            aria-label="Seek recording position"
          />
          <div className="recording-time-row">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(totalDuration)}</span>
          </div>
        </div>

        <button
          type="button"
          className="recording-delete-btn"
          onClick={() => onDelete(audioId)}
          title="Delete recording"
          aria-label="Delete recording"
        >
          <FaTrash />
        </button>
      </div>

      {/* Bottom Metadata Details */}
      <div className="recording-details">
        <div className="recording-meta-item">
          <FaCalendarAlt style={{ color: "#2563eb", fontSize: "14px" }} />
          <span className="recording-meta-label">Date:</span>
          <span className="recording-meta-value">{formatDate(recordedDate)}</span>
        </div>

        <div className="recording-meta-item">
          <FaClock style={{ color: "#ca8a04", fontSize: "14px" }} />
          <span className="recording-meta-label">Time:</span>
          <span className="recording-meta-value">{formatTime(recordedDate)}</span>
        </div>
      </div>
    </div>
  );
}

function Recordings() {
  const toast = useToast();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  const fetchRecordings = () => {
    setLoading(true);
    getRecordings()
      .then((data) => {
        // Ensure newest appear first
        const sorted = (data || []).sort((a, b) => {
          const dateA = new Date(b.created_at || b.createdAt || 0);
          const dateB = new Date(a.created_at || a.createdAt || 0);
          return dateA - dateB;
        });
        setRecordings(sorted);
      })
      .catch((err) => {
        console.error("Failed to load recordings:", err);
        toast.error(err?.message || "Failed to load recordings");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecordings();

    // Listen for new recordings made via the sticky mic button
    const handleNewRecording = () => {
      fetchRecordings();
    };

    window.addEventListener("recording-created", handleNewRecording);
    return () => {
      window.removeEventListener("recording-created", handleNewRecording);
    };
  }, []);

  const handleDeleteRequest = (id) => {
    setPendingDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    const id = pendingDeleteId;
    setPendingDeleteId(null);

    try {
      await deleteRecording(id);
      // Remove immediately from UI
      setRecordings((prev) =>
        prev.filter((r) => (r.id || r._id) !== id)
      );
      toast.success("Recording deleted successfully.");
    } catch (err) {
      console.error("Delete recording error:", err);
      toast.error(err?.message || "Failed to delete recording.");
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        <Sidebar />

        <main className="dashboard-main">
          <div className="recordings-page-header">
            <div>
              <h2>Recordings</h2>
              <p>Listen, manage, and organize your saved voice recordings.</p>
            </div>

            {!loading && recordings.length > 0 && (
              <span className="recordings-count-badge">
                {recordings.length} {recordings.length === 1 ? "Recording" : "Recordings"}
              </span>
            )}
          </div>

          {loading ? (
            <Loader />
          ) : recordings.length === 0 ? (
            <div className="empty-recordings">
              <div className="empty-recordings-icon">
                <FaMicrophone />
              </div>
              <h3>No recordings yet</h3>
              <p>
                Click the blue microphone button at the bottom-right corner of
                your screen to record your first voice note!
              </p>
            </div>
          ) : (
            <div className="recordings-grid">
              {recordings.map((recording) => {
                const key = recording.id || recording._id;
                return (
                  <RecordingCard
                    key={key}
                    recording={recording}
                    onDelete={handleDeleteRequest}
                  />
                );
              })}
            </div>
          )}
        </main>
      </div>

      <Footer />

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this recording?"
        message="Are you sure you want to delete this recording? This will permanently remove both the database record and the audio file."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  );
}

export default Recordings;
