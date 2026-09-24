import { useEffect, useRef, useState } from "react";

function AuthVideoBackground() {
  const videoRef = useRef(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Check Data Saver or prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isSaveData = Boolean(
      navigator.connection && navigator.connection.saveData
    );

    if (prefersReducedMotion || isSaveData) {
      video.pause();
      return;
    }

    // Safely attempt autoplay (muted + playsinline ensures compatibility)
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked by browser policy; silently falls back to poster
      });
    }

    // Pause video when browser tab is inactive / hidden, resume when visible
    const handleVisibilityChange = () => {
      if (!video) return;
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="auth-video-bg" aria-hidden="true">
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/videos/auth-bg-poster.jpg"
          onError={() => setVideoError(true)}
        >
          <source src="/assets/videos/auth-bg.webm" type="video/webm" />
          <source src="/assets/videos/auth-bg.mp4" type="video/mp4" />
        </video>
      )}
      <div className="auth-video-overlay" />
    </div>
  );
}

export default AuthVideoBackground;
