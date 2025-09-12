import React, { useRef, useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import "./home.css";
import axios from "axios";

const mapPayload = (resData) => {
  if (!resData) return [];

  // Normalize foodItem into an array
  const items = Array.isArray(resData.foodItem)
    ? resData.foodItem
    : resData.foodItem
      ? [resData.foodItem]
      : [];

  return items.map((p, idx) => ({
    id: p._id ?? idx,
    src: p.video ?? p.videoUrl ?? p.src ?? "",
  desc: p.description ?? p.desc ?? p.title ?? p.name ?? '',
    // try common partner id locations
    foodPartner: p.foodPartner ?? p.partnerId ?? p.owner?._id ?? p.ownerId ?? p.userId ?? p.user?._id ?? null,
  }));
};

const Home = () => {
  const containerRef = useRef(null);
  const observerRef = useRef(null);
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchVideos = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/food",
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );
        const mapped = mapPayload(res.data);
        setVideos(mapped);
      } catch (err) {
        // Ignore cancellation
        if (axios.isCancel && axios.isCancel(err)) return
        if (err?.name === 'CanceledError') return
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!videos || !containerRef.current) return;

    const prefersReduce =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // If user prefers reduced motion, don't attach observer; let videos autoplay but don't programmatically play/pause
    if (prefersReduce) return;

    const container = containerRef.current;
    const options = { root: container, threshold: [0.5, 0.75, 0.9] };
    const handlePlayPause = (entries) => {
      entries.forEach((entry) => {
        const vid = entry.target;
        if (entry.intersectionRatio >= 0.6) {
          if (vid.paused) {
            const p = vid.play();
            if (p && typeof p.then === "function") p.catch(() => {});
          }
        } else {
          if (!vid.paused && typeof vid.pause === "function") {
            vid.pause();
          }
        }
      });
    };

    const obs = new IntersectionObserver(handlePlayPause, options);
    observerRef.current = obs;

    const vids = container.querySelectorAll("video.reel-video");
    vids.forEach((v) => {
      // ensure muted for autoplay policies
      v.muted = true;
      v.pause();
      obs.observe(v);
    });

    // play the first visible video immediately if any
    const first = vids[0];
    if (first) {
      first.play().catch(() => {});
    }

    return () => {
      obs.disconnect();
      observerRef.current = null;
    };
  }, [videos]);

  if (loading)
    return (
      <div className="reels-root">
        <div className="loading">Loading videos…</div>
      </div>
    );
  if (error)
    return (
      <div className="reels-root">
        <div className="loading">{error}</div>
      </div>
    );

  const list =
    videos && videos.length
      ? videos
      : [{ id: "empty", src: "", desc: "No videos available" }];

  return (
    <div className="reels-root">
      <div className="reels-container" ref={containerRef}>
        {list.map((item) => (
          <div className="reel-item" key={item.id}>
            {item.src ? (
              <video
                className="reel-video"
                src={item.src}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#111",
                  color: "#fff",
                }}
              >
                No preview
              </div>
            )}

            <div className="reel-overlay">
              <div className="reel-desc" title={item.desc}>
                {item.desc}
              </div>
              <div className="reel-actions">
                {item.foodPartner ? (
                  <Link className="visit-btn" to={`/food-partner/${item.foodPartner}`}>Visit store</Link>
                ) : (
                  <button className="visit-btn">Visit store</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
