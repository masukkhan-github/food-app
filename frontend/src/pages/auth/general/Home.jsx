import React, { useRef, useEffect, useState } from "react";
import { Link, NavLink } from 'react-router-dom'
import HomeLink from '../../../components/HomeLink'
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
    likeCount: p.likeCount ?? 0,
    liked: !!p.liked,
    saved: !!p.saved,
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

    // set up periodic refresh to update like/save counts (approx realtime)
    const interval = setInterval(async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/v1/food', { withCredentials: true });
        const mapped = mapPayload(res.data);
        // merge counts into existing videos state
        setVideos((prev) => {
          if (!prev) return mapped;
          const byId = new Map(mapped.map((m) => [m.id, m]));
          return prev.map((p) => ({
            ...p,
            likeCount: byId.get(p.id)?.likeCount ?? p.likeCount,
            liked: byId.get(p.id)?.liked ?? p.liked,
            saved: byId.get(p.id)?.saved ?? p.saved,
          }));
        });
      } catch {
        // ignore periodic errors
      }
    }, 10000);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
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

            <div className="reel-side-actions" aria-hidden={false}>
              <button
                className={`action-btn like-btn ${item.liked ? 'liked' : ''}`}
                aria-label="like"
                onClick={async () => {
                  try {
                    await axios.post('http://localhost:3000/api/v1/food/like', { foodId: item.id }, { withCredentials: true });
                    // toggle liked state locally and update count
                    setVideos((prev) => prev.map(v => v.id === item.id ? { ...v, liked: !v.liked, likeCount: v.liked ? Math.max(0, v.likeCount - 1) : v.likeCount + 1 } : v));
                  } catch (err) {
                    console.error('Like error', err);
                  }
                }}
              >
                <svg width="36" height="36" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s-6.716-4.35-9.192-7.056C-0.271 10.473 3.03 5 7.5 5c2.06 0 3.5 1.2 4.5 2.4C13 6.2 14.44 5 16.5 5 20.97 5 24.27 10.473 21.192 13.944 18.716 16.65 12 21 12 21z" stroke="currentColor" strokeWidth="0.8"/></svg>
                <span className="action-count">{item.likeCount ?? 0}</span>
              </button>

              <button
                className={`action-btn save-btn ${item.saved ? 'saved' : ''}`}
                aria-label="save"
                onClick={async () => {
                  try {
                    await axios.post('http://localhost:3000/api/v1/food/save', { foodId: item.id }, { withCredentials: true });
                    setVideos((prev) => prev.map(v => v.id === item.id ? { ...v, saved: !v.saved } : v));
                  } catch (err) {
                    console.error('Save error', err);
                  }
                }}
              >
                <svg width="36" height="36" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2h10a1 1 0 0 1 1 1v18l-6-3-6 3V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="0.9"/></svg>
                <span className="action-count">{item.saved ? 'Saved' : 'Save'}</span>
              </button>

              <button className="action-btn" aria-label="comments">
                <svg width="36" height="36" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" stroke="currentColor" strokeWidth="0.9"/></svg>
                <span className="action-count">45</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      <nav className="bottom-nav" role="navigation" aria-label="Primary">
        <HomeLink className="nav-item" aria-label="home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 10.2L12 3l9 7.2V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.2z" stroke="currentColor" strokeWidth="1.2"/></svg>
          <span>home</span>
        </HomeLink>

  <NavLink to="/create-food" className="nav-item" aria-label="create">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>create</span>
  </NavLink>

  <NavLink to="/saved" className="nav-item" aria-label="saved">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 2h12a1 1 0 0 1 1 1v18l-7-3-7 3V3a1 1 0 0 1 1-1z" stroke="currentColor" strokeWidth="1.2"/></svg>
          <span>saved</span>
  </NavLink>

  <NavLink to="/profile" className="nav-item" aria-label="profile">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>profile</span>
  </NavLink>
      </nav>
    </div>
  );
};

export default Home;
