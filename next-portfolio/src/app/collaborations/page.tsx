"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"

export default function Collaborations() {
  return (
    <div>
      <div className="grain"></div>
      <Navigation />
      
      <header className="collab-detail-hero">
        <div className="container">
          <span className="section-label section-label-centered">Case Studies &amp; Feedback</span>
          <h1 className="contact-heading collab-page-heading">
            Collaborations &amp; Appreciation<span className="gold-dot">.</span>
          </h1>
          <p className="contact-subtitle">
            A deeper look at artwork crafted in partnership with music artists, filmmakers, and creative brands.
          </p>
        </div>
      </header>

      <main className="container" id="mainContent">
        <div className="collab-detail-grid">
          {/* Nimrat Khaira */}
          <section className="collab-detail-row reveal visible">
            <div className="collab-detail-info">
              <div className="collab-bg-portrait">
                <img loading="lazy" decoding="async" src="/images/collab-nimrat.jpg" alt="" />
              </div>
              <span className="collab-detail-tag">Artist Collaboration</span>
              <h2 className="collab-detail-title">Nimrat Khaira</h2>
              <p className="collab-detail-text">
                A vibrant artistic partnership with one of Punjabi music's most celebrated voices. The goal was to craft a
                visual companion to her music that captures the warmth, cultural lineage, and modern spirit of her
                storytelling. Every layer is built with rich textures and delicate gold highlights.
              </p>
            </div>
            <div className="collab-detail-embed">
              <blockquote className="instagram-media" data-instgrm-captioned
                data-instgrm-permalink="https://www.instagram.com/p/DTfbzWckQxb/?utm_source=ig_embed&amp;utm_campaign=loading"
                data-instgrm-version="14"
                style={{ background: "#0D0D0D", border: 0, borderRadius: "3px", boxShadow: "none", margin: 0, maxWidth: "100%", minWidth: "326px", padding: 0, width: "100%" }}>
                <div style={{ padding: "16px" }}>
                  <a href="https://www.instagram.com/p/DTfbzWckQxb/?utm_source=ig_embed&amp;utm_campaign=loading"
                    style={{ background: "#0D0D0D", lineHeight: 0, padding: 0, textAlign: "center", textDecoration: "none", width: "100%", color: "#C8A96E" }}
                    target="_blank" rel="noopener noreferrer">View this post on Instagram</a>
                </div>
              </blockquote>
            </div>
          </section>

          <div className="contact-divider collab-divider"></div>

          {/* Imtiaz Ali */}
          <section className="collab-detail-row reveal visible">
            <div className="collab-detail-info">
              <div className="collab-bg-portrait">
                <img loading="lazy" decoding="async" src="/images/collab-imtiaz.jpg" alt="" />
              </div>
              <span className="collab-detail-tag">Featured Collaboration</span>
              <h2 className="collab-detail-title">Imtiaz Ali</h2>
              <p className="collab-detail-text">
                Official artwork created in collaboration with the renowned filmmaker. This project merged cinematic
                storytelling with digital and traditional compositions, translating the nostalgic, emotional journey of his
                cinema onto paper.
              </p>
            </div>
            <div className="collab-detail-embed">
              <blockquote className="instagram-media" data-instgrm-captioned
                data-instgrm-permalink="https://www.instagram.com/p/DK4n87phaBc/?utm_source=ig_embed&amp;utm_campaign=loading"
                data-instgrm-version="14"
                style={{ background: "#0D0D0D", border: 0, borderRadius: "3px", boxShadow: "none", margin: 0, maxWidth: "100%", minWidth: "326px", padding: 0, width: "100%" }}>
                <div style={{ padding: "16px" }}>
                  <a href="https://www.instagram.com/p/DK4n87phaBc/?utm_source=ig_embed&amp;utm_campaign=loading"
                    style={{ background: "#0D0D0D", lineHeight: 0, padding: 0, textAlign: "center", textDecoration: "none", width: "100%", color: "#C8A96E" }}
                    target="_blank" rel="noopener noreferrer">View this post on Instagram</a>
                </div>
              </blockquote>
            </div>
          </section>

          <div className="contact-divider collab-divider"></div>

          {/* Team Diljit */}
          <section className="collab-detail-row reveal visible">
            <div className="collab-detail-info">
              <div className="collab-bg-portrait">
                <img loading="lazy" decoding="async" src="/images/collab-diljit.jpg" alt="" />
              </div>
              <span className="collab-detail-tag">Artist Artwork</span>
              <h2 className="collab-detail-title">Team Diljit</h2>
              <p className="collab-detail-text">
                Cinematic compositions created for Diljit Dosanjh. Bold, iconic design language matching the global appeal
                and energy of the superstar, while staying deeply rooted in Punjabi culture.
              </p>
            </div>
            <div className="collab-detail-embed">
              <blockquote className="instagram-media" data-instgrm-captioned
                data-instgrm-permalink="https://www.instagram.com/p/C-HY4chSWw1/?utm_source=ig_embed&amp;utm_campaign=loading"
                data-instgrm-version="14"
                style={{ background: "#0D0D0D", border: 0, borderRadius: "3px", boxShadow: "none", margin: 0, maxWidth: "100%", minWidth: "326px", padding: 0, width: "100%" }}>
                <div style={{ padding: "16px" }}>
                  <a href="https://www.instagram.com/p/C-HY4chSWw1/?utm_source=ig_embed&amp;utm_campaign=loading"
                    style={{ background: "#0D0D0D", lineHeight: 0, padding: 0, textAlign: "center", textDecoration: "none", width: "100%", color: "#C8A96E" }}
                    target="_blank" rel="noopener noreferrer">View this post on Instagram</a>
                </div>
              </blockquote>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
