import React, { useState, useEffect } from "react";
import "../../../styles/create-food.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateFood = () => {
  const [videoSrc, setVideoSrc] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false); // 👈 loading state

  const navigate = useNavigate();

  // ✅ Cleanup video preview URL when file changes or component unmounts
  useEffect(() => {
    return () => {
      if (videoSrc) URL.revokeObjectURL(videoSrc);
    };
  }, [videoSrc]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);

    if (videoFile) {
      formData.append("video", videoFile);
    }

    try {
      const res = await axios.post("http://localhost:3000/api/v1/food", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res.data, "✅ Food created, from CreateFood.jsx");

      // small delay to show loading, then navigate
      setTimeout(() => {
        navigate("/home");
      }, 500);
    } catch (err) {
      console.error(
        "❌ Error from CreateFood.jsx creating food item:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setFileName("");
      setVideoSrc("");
      setVideoFile(null);
      return;
    }
    setFileName(file.name);
    setVideoFile(file);
    const url = URL.createObjectURL(file);
    setVideoSrc(url);
  };

  if (loading) {
    // ✅ Loading screen
    return (
      <main className="create-food-page">
        <div className="cf-card" style={{ textAlign: "center", padding: "2rem" }}>
          <h2>⏳ Creating food item...</h2>
          <p>Please wait while we save your item.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="create-food-page">
      <div className="cf-card">
        <h2 className="cf-title">Create food item</h2>

        <form className="cf-form" onSubmit={handleSubmit}>
          <div className="cf-left">
            <div className="cf-row">
              <label htmlFor="foodName">Name</label>
              <input
                id="foodName"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Spicy Chicken Wrap"
                required
                disabled={loading}
              />
            </div>

            <div className="cf-row">
              <label htmlFor="foodDesc">Description</label>
              <textarea
                id="foodDesc"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description of the dish"
                required
                disabled={loading}
              ></textarea>
            </div>

            <div className="cf-row cf-video-picker">
              <label>Video (file)</label>
              <div className="cf-file-input-wrapper">
                <input
                  id="videoFile"
                  name="video"
                  className="cf-file-input"
                  type="file"
                  accept="video/*"
                  onChange={handleFile}
                  required
                  disabled={loading}
                />
                <label htmlFor="videoFile" className="cf-file-btn">
                  <span>Choose video</span>
                </label>
                <div className="cf-file-name">{fileName || "No file chosen"}</div>
              </div>
            </div>
          </div>

          <aside className="cf-right cf-row">
            <div className="cf-video-preview">
              {videoSrc ? (
                <video src={videoSrc} controls muted playsInline />
              ) : (
                <div
                  style={{
                    padding: 16,
                    textAlign: "center",
                    color: "rgba(var(--muted),1)",
                  }}
                >
                  Video preview will appear here
                </div>
              )}
            </div>

            <div className="cf-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving..." : "Save item"}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                disabled={loading}
                onClick={() => {
                  setName("");
                  setDescription("");
                  setVideoSrc("");
                  setFileName("");
                  setVideoFile(null);
                }}
              >
                Reset
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
};

export default CreateFood;
