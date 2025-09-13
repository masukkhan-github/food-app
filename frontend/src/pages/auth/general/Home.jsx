import React, { useRef, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import HomeLink from "../../../components/HomeLink";
import "./home.css";
import axios from "axios";

const mapPayload = (resData) => {
  if (!resData) return [];

  const items = Array.isArray(resData.foodItem)
    ? resData.foodItem
    : resData.foodItem
    ? [resData.foodItem]
    : [];

  return items.map((p, idx) => ({
    id: p._id ?? idx,
    src: p.video ?? p.videoUrl ?? p.src ?? "",
    desc: p.description ?? p.desc ?? p.title ?? p.name ?? "",
    foodPartner:
      p.foodPartner ??
      p.partnerId ??
      p.owner?._id ??
      p.ownerId ??
      p.userId ??
      p.user?._id ??
      null,
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
          "https://food-app-8vnw.onrender.com/api/v1/food",
          {
            withCredentials: true,
            signal: controller.signal,
          }
        );
        const mapped = mapPayload(res.data);
        setVideos(mapped);
      } catch (err) {
        if (axios.isCancel && axios.isCancel(err)) return;
        if (err?.name === "CanceledError") return;
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
      v.muted = true;
      v.pause();
      obs.observe(v);
    });

    if (vids[0]) vids[0].play().catch(() => {});

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
                  <Link
                    className="visit-btn"
                    to={`/food-partner/${item.foodPartner}`}
                  >
                    Visit store
                  </Link>
                ) : (
                  <button className="visit-btn">Visit store</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav className="bottom-nav" role="navigation" aria-label="Primary">
        <HomeLink className="nav-item" aria-label="home">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 10.2L12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.2z"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
          <span>home</span>
        </HomeLink>

        <NavLink to="/create-food" className="nav-item" aria-label="create">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>create</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Home;
