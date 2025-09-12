import React, { useState, useEffect } from 'react'
import "../../../styles/profile.css"
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Profile = () => {
    const { id } = useParams()
    const [ profile, setProfile ] = useState(null)
    const [ videos, setVideos ] = useState([])
    const [ loading, setLoading ] = useState(true)
    const [ error, setError ] = useState(null)
   

    useEffect(() => {
        const controller = new AbortController()

        const fetchProfile = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await axios.get(`http://localhost:3000/api/v1/food-partner/${id}`, { withCredentials: true, signal: controller.signal })

                // Controller returns: { message, partner: { ...partnerFields, foodItems: [...] } }
                const partner = res?.data?.partner ?? null
                // dev: log response shape if partner is missing
                if (!partner) console.debug('getFoodPartnerById response:', res?.data)
                if (partner) {
                    setProfile(partner)
                    const items = Array.isArray(partner.foodItems) ? partner.foodItems : (partner.foodItems ? [partner.foodItems] : [])
                    // normalize each item to ensure `video`/`src` presence
                    const norm = items.map((it, i) => ({
                        _id: it._id ?? it.id ?? `item-${i}`,
                        video: it.video ?? it.videoUrl ?? it.src ?? '',
                        raw: it
                    }))
                    setVideos(norm)
                } else {
                    setProfile(null)
                    setVideos([])
                }
            } catch (err) {
                if (err?.name === 'CanceledError') return
                setError('Failed to load profile')
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()

        return () => controller.abort()
    }, [id])


    return (
        <main className="profile-page">
            <section className="profile-header">
                    <div className="profile-meta">

                    <img className="profile-avatar" src="https://images.unsplash.com/photo-1754653099086-3bddb9346d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D" alt="" />

                    <div className="profile-info">
                        <h1 className="profile-pill profile-business" title="Business name">
                            {profile?.name ?? profile?.businessName ?? profile?.companyName ?? 'Untitled store'}
                        </h1>
                       
                    </div>
                </div>

                <div className="profile-stats" role="list" aria-label="Stats">
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">total meals</span>
                        <span className="profile-stat-value">{profile?.totalMeals ?? 0}</span>
                    </div>
                    <div className="profile-stat" role="listitem">
                        <span className="profile-stat-label">customer served</span>
                        <span className="profile-stat-value">{profile?.customersServed ?? 0}</span>
                    </div>
                </div>
            </section>

            <hr className="profile-sep" />

            <section className="profile-grid" aria-label="Videos">
                {loading && <div className="loading">Loading videos…</div>}
                {error && <div className="error">{error}</div>}
                {!loading && !error && videos.length === 0 && <div className="empty">No videos found</div>}
                {!loading && !error && videos.map((v, idx) => (
                    <div key={v._id ?? v.id ?? idx} className="profile-grid-item">
                        {v.video || v.src ? (
                            <video
                                className="profile-grid-video"
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                src={v.video ?? v.videoUrl ?? v.src}
                                muted
                                controls
                                playsInline
                            />
                        ) : (
                            <div className="profile-grid-placeholder">No preview</div>
                        )}
                    </div>
                ))}
            </section>
        </main>
    )
}

export default Profile