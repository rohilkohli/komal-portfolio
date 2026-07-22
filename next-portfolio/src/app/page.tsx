"use client"

import { Navigation } from "@/components/Navigation"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

export default function Home() {
  const [backToTopVisible, setBackToTopVisible] = useState(false)
  const [chatModalOpen, setChatModalOpen] = useState(false)
  const [chatFormState, setChatFormState] = useState<"default" | "sending" | "success">("default")
  const cursorDotRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.body.classList.add('js-loaded')

    const handleScroll = () => setBackToTopVisible(window.scrollY > 400)

    const revealElements = document.querySelectorAll('.reveal')
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          revealObserver.unobserve(entry.target)
        }
      })
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' })

    revealElements.forEach(el => revealObserver.observe(el))
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Custom cursor (only on devices with fine pointer)
    const dot = cursorDotRef.current
    const ring = cursorRingRef.current
    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let rafId: number
    let handleMouseMove: ((e: MouseEvent) => void) | null = null
    const interactiveHandlers: Array<{ el: Element; enter: () => void; leave: () => void }> = []

    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && dot && ring) {
      document.body.classList.add('custom-cursor-enabled')

      handleMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX
        mouseY = e.clientY
        dot.style.left = mouseX + 'px'
        dot.style.top = mouseY + 'px'
      }

      document.addEventListener('mousemove', handleMouseMove)

      function animateRing() {
        ringX += (mouseX - ringX) * 0.12
        ringY += (mouseY - ringY) * 0.12
        if (ring) {
          ring.style.left = ringX + 'px'
          ring.style.top = ringY + 'px'
        }
        rafId = requestAnimationFrame(animateRing)
      }
      animateRing()

      // Enlarge cursor on interactive elements
      const interactives = document.querySelectorAll('a, button, .masonry-item, .cg-card')
      interactives.forEach(el => {
        const enter = () => {
          if (dot && ring) {
            dot.style.width = '12px'
            dot.style.height = '12px'
            ring.style.width = '60px'
            ring.style.height = '60px'
            ring.style.opacity = '0.8'
            ring.style.borderColor = '#D4BC8A'
          }
        }
        const leave = () => {
          if (dot && ring) {
            dot.style.width = '8px'
            dot.style.height = '8px'
            ring.style.width = '40px'
            ring.style.height = '40px'
            ring.style.opacity = '0.5'
            ring.style.borderColor = '#C8A96E'
          }
        }
        el.addEventListener('mouseenter', enter)
        el.addEventListener('mouseleave', leave)
        interactiveHandlers.push({ el, enter, leave })
      })
    } else {
      if (dot) dot.style.display = 'none'
      if (ring) ring.style.display = 'none'
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      revealObserver.disconnect()
      if (handleMouseMove) {
        document.removeEventListener('mousemove', handleMouseMove)
      }
      if (rafId) {
        cancelAnimationFrame(rafId)
      }
      interactiveHandlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
      document.body.classList.remove('custom-cursor-enabled')
    }
  }, [])

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string

    setChatFormState("sending")
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, project: "Quick Chat Inquiry", message }),
      })
      setChatFormState("success")
      form.reset()
      setTimeout(() => {
        setChatModalOpen(false)
        setTimeout(() => setChatFormState("default"), 400)
      }, 1500)
    } catch (err) {
      console.error("Chat form error:", err)
      setChatFormState("default")
    }
  }

  return (
    <div>
      {/* Skip to main content for screen readers */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Custom Cursor */}
      <div className="cursor-dot" id="cursorDot" ref={cursorDotRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={cursorRingRef}></div>

      {/* Film Grain Overlay */}
      <div className="grain"></div>

      <Navigation />
      <main id="main-content">
        <HeroSection />
        <AboutSection />
        <PortfolioSection />
        <ProcessSection />
        <LatestWorkSection />
        <ContactSection />
      </main>
      <Footer />

      {/* Floating Buttons */}
      <div className="floating-buttons">
        <a href="#hero" className={`back-to-top ${backToTopVisible ? "visible" : ""}`} aria-label="Back to top">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </a>
        <button
          className="chat-btn"
          id="chatBtn"
          aria-label="Contact us"
          onClick={() => setChatModalOpen(!chatModalOpen)}
          onTouchEnd={(e) => {
            e.preventDefault()
            setChatModalOpen(!chatModalOpen)
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
            <path d="M7 9h10v2H7zm0-3h10v2H7z"/>
          </svg>
        </button>
      </div>

      {/* Chat Contact Modal */}
      <div className={`chat-modal ${chatModalOpen ? "open" : ""}`} id="chatModal">
        <div className="chat-modal-content">
          <div className="chat-modal-header">
            <h4>Let's Talk</h4>
            <button className="chat-modal-close" id="chatModalClose" aria-label="Close" onClick={() => setChatModalOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <form className="chat-form" id="chatForm" onSubmit={handleChatSubmit}>
            <div className="chat-form-field">
              <input type="text" name="name" placeholder="Your Name" required />
            </div>
            <div className="chat-form-field">
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
            <div className="chat-form-field">
              <textarea name="message" placeholder="Your Message..." rows={4} required></textarea>
            </div>
            <button type="submit" className={`chat-form-submit ${chatFormState}`} id="chatSubmitBtn" disabled={chatFormState !== "default"}>
              <span className="btn-state btn-state-default">
                <span>Send Message</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                </svg>
              </span>
              <span className="btn-state btn-state-sending">
                <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25"/>
                  <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
                </svg>
                <span>Sending...</span>
              </span>
              <span className="btn-state btn-state-success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Message Sent!</span>
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="container hero-content">
        <p className="hero-greeting">Visual Designer &amp; Illustrator</p>

        <h1 className="hero-title">
          <span className="line"><span className="line-inner">I don't make</span></span>
          <span className="line"><span className="line-inner">pretty things.</span></span>
          <span className="line"><span className="line-inner">I make <em>unforgettable</em> ones.</span></span>
        </h1>

        <p className="hero-subtitle">
          Digital &amp; Traditional Artist · Music Video Art · Book Illustrator · Delhi
        </p>

        <div className="hero-cta-group">
          <Link href="#portfolio" className="btn-primary">
            <span>View My Work</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link href="#contact" className="btn-outline">Let's Talk</Link>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span>Scroll</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  )
}

function AboutSection() {
  useEffect(() => {
    const statNumbers = document.querySelectorAll('.about-stat-number')
    let statsCounted = false

    function animateCounters() {
      statNumbers.forEach(stat => {
        const text = stat.textContent?.trim() || ''
        const match = text.match(/(\d+)/)
        if (!match) return
        const target = parseInt(match[1])
        const suffix = text.slice(match.index! + match[1].length)
        const prefix = text.slice(0, match.index)
        const start = performance.now()
        const DURATION = 2000
        function easeOut(t: number) { return 1 - Math.pow(1 - t, 3) }
        function step(now: number) {
          const elapsed = now - start
          const progress = Math.min(elapsed / DURATION, 1)
          const value = Math.round(easeOut(progress) * target)
          stat.textContent = prefix + value + suffix
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      })
    }

    const aboutSection = document.querySelector('.about')
    if (aboutSection) {
      const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsCounted) {
            statsCounted = true
            animateCounters()
            statsObserver.unobserve(entry.target)
          }
        })
      }, { threshold: 0.3 })
      statsObserver.observe(aboutSection)
      return () => statsObserver.disconnect()
    }
  }, [])

  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-visual reveal">
            <div className="about-image-wrap">
              <Image src="/images/komal-logo.jpg" alt="Komal Panesar — Visual Designer" width={600} height={600} loading="lazy" />
              <div className="about-image-frame"></div>
            </div>
            <div className="about-stats">
              <div className="about-stat"><div className="about-stat-number">50+</div><div className="about-stat-label">Projects</div></div>
              <div className="about-stat"><div className="about-stat-number">30+</div><div className="about-stat-label">Clients</div></div>
              <div className="about-stat"><div className="about-stat-number">5+</div><div className="about-stat-label">Years</div></div>
            </div>
          </div>
          <div className="about-text">
            <div className="reveal">
              <span className="section-label">The Artist</span>
              <h3>I believe design should make you <em>feel</em> something — not just look good on a mood board.</h3>
            </div>
            <div className="reveal reveal-delay-1">
              <p>I work in two worlds — the digital and the traditional. From music video artwork for Punjabi artists to illustrated Sikh history, from pencil portraits to cinematic digital compositions — every piece starts from scratch, built with intention and rooted in culture.</p>
              <p>Based in Delhi. Open for commissions and collaborations.</p>
            </div>
            <div className="about-skills reveal reveal-delay-2">
              <span className="skill-tag">Illustration</span>
              <span className="skill-tag">Branding</span>
              <span className="skill-tag">Editorial Design</span>
              <span className="skill-tag">Packaging</span>
              <span className="skill-tag">Murals</span>
              <span className="skill-tag">Typography</span>
              <span className="skill-tag">Art Direction</span>
              <span className="skill-tag">Coverart Artist</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const PORTFOLIO_ITEMS = [
  { type: "video", src: "/images/sheeshe-wangu.mp4", tag: "Music Video Art", title: "Sheeshe Wangu", filter: "music-video-art" },
  { type: "image", src: "/images/divine-journey.jpg", tag: "Devotional & Historical", title: "The Divine Journey", filter: "devotional-historical" },
  { type: "image", src: "/images/bollywood-collage.jpg", tag: "Fine Art", title: "Cinema Collage", filter: "traditional-art" },
  { type: "image", src: "/images/ray-of-hope.jpg", tag: "Traditional Art", title: "Ray of Hope", filter: "traditional-art" },
  { type: "image", src: "/images/space-traveler.jpg", tag: "Illustration", title: "Space Traveler", filter: "book-illustration" },
  { type: "image", src: "/images/sunflowers-balcony.jpg", tag: "For a Reason", title: "Karan Aujla & Tania", filter: "music-video-art" },
  { type: "image", src: "/images/aura-world-tour.jpg", tag: "Tour Artwork", title: "Aura World Tour", filter: "music-video-art" },
  { type: "image", src: "/images/diljit-aura.jpg", tag: "Music Video Art", title: "Diljit Aura", filter: "music-video-art" },
  { type: "video", src: "/images/keerat-hoshiar.mp4", tag: "Music Video Art", title: "Keerat & Hoshiar", filter: "music-video-art" },
]

function PortfolioSection() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)
  const [activeFilter, setActiveFilter] = useState("all")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // Keyboard navigation & body scroll lock for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null)
      else if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null ? (prev - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length : null))
      } else if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % PORTFOLIO_ITEMS.length : null))
      }
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [lightboxIndex])

  useEffect(() => {
    if (!sceneRef.current || !galleryRef.current) return

    const gallery = galleryRef.current
    const scene = sceneRef.current
    const cards = scene.querySelectorAll(".cg-card")
    const N = cards.length
    const angleStep = 360 / N

    function getRadius() {
      const w = gallery.offsetWidth
      return Math.max(320, Math.min(520, w * 0.42))
    }

    let currentAngle = 0
    let targetAngle = 0
    let autoSpeed = 0.05
    let dragging = false
    let lastX = 0
    let paused = false
    let raf: number
    let galleryInView = false

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        galleryInView = entry.isIntersecting
      })
    }, { threshold: 0.1 })

    const portfolioSection = document.getElementById("portfolio")
    if (portfolioSection) observer.observe(portfolioSection)

    function positionCards() {
      const r = getRadius()
      let maxDepth = -1
      let frontIndex = -1
      const cardData: { x: number; z: number; depth: number }[] = []

      cards.forEach((card, i) => {
        const a = ((i * angleStep + currentAngle) * Math.PI) / 180
        const x = Math.sin(a) * r
        const z = Math.cos(a) * r
        const depth = (z + r) / (2 * r)
        if (depth > maxDepth) {
          maxDepth = depth
          frontIndex = i
        }
        cardData.push({ x, z, depth })
      })

      cards.forEach((card, i) => {
        const data = cardData[i]
        const scale = 0.72 + 0.28 * data.depth
        const opacity = 0.38 + 0.62 * data.depth
        const zIndex = Math.round(data.depth * 100)
        const isFront = i === frontIndex && data.depth > 0.88
        const el = card as HTMLElement

        el.style.transform = `translateX(${data.x}px) translateZ(${data.z}px) scale(${scale})`
        el.style.opacity = String(opacity)
        el.style.zIndex = String(zIndex)
        el.classList.toggle("cg-card--active", isFront)

        const vid = el.querySelector("video")
        if (vid) {
          let targetVol = (data.depth - 0.8) / (0.95 - 0.8)
          targetVol = Math.max(0, Math.min(1, targetVol))
          vid.volume = targetVol * targetVol

          if (targetVol > 0.01 && galleryInView) {
            if (vid.paused) vid.play().catch(() => {})
          } else {
            if (!vid.paused) vid.pause()
          }
        }
      })
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t
    }

    function tick() {
      if (!dragging && !paused) targetAngle += autoSpeed
      currentAngle = lerp(currentAngle, targetAngle, 0.07)
      positionCards()
      raf = requestAnimationFrame(tick)
    }

    gallery.addEventListener("mouseenter", () => (paused = true))
    gallery.addEventListener("mouseleave", () => (paused = false))

    gallery.addEventListener("mousedown", (e) => {
      dragging = true
      lastX = e.clientX
      gallery.style.cursor = "grabbing"
    })
    window.addEventListener("mousemove", (e) => {
      if (!dragging) return
      const dragDelta = e.clientX - lastX
      targetAngle += dragDelta * 0.35
      lastX = e.clientX
    })
    window.addEventListener("mouseup", () => {
      dragging = false
      gallery.style.cursor = "grab"
    })

    let lastY = 0
    gallery.addEventListener("touchstart", (e) => {
        lastX = e.touches[0].clientX
        lastY = e.touches[0].clientY
        paused = true
      }, { passive: true })
    gallery.addEventListener("touchmove", (e) => {
        const clientX = e.touches[0].clientX
        const clientY = e.touches[0].clientY
        const dx = clientX - lastX
        const dy = clientY - lastY

        if (Math.abs(dx) > Math.abs(dy)) {
          if (e.cancelable) e.preventDefault()
          targetAngle += dx * 0.45
        }

        lastX = clientX
        lastY = clientY
      }, { passive: false })
    gallery.addEventListener("touchend", () => (paused = false))

    gallery.addEventListener("wheel", (e) => {
        e.preventDefault()
        targetAngle += e.deltaY * 0.18
      }, { passive: false })

    window.addEventListener("resize", positionCards)

    positionCards()
    tick()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <section className="portfolio" id="portfolio">
      <div className="container">
        <div className="portfolio-header reveal">
          <span className="section-label">Selected Work</span>
          <h2 className="section-heading">Pieces that <em>breathe</em></h2>
          <p>A curated selection of illustration, branding, and visual design — each piece born from story, not just brief.</p>
        </div>

        <div className="portfolio-filters reveal reveal-delay-1">
          {["all", "music-video-art", "devotional-historical", "portraits-commissions", "traditional-art", "book-illustration"].map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
              data-filter={filter}
              onClick={() => setActiveFilter(filter)}
            >
              {filter === "all" ? "All" :
               filter === "music-video-art" ? "Music Video Art" :
               filter === "devotional-historical" ? "Devotional & Historical" :
               filter === "portraits-commissions" ? "Portraits & Commissions" :
               filter === "traditional-art" ? "Traditional Art" :
               "Book Illustration"}
            </button>
          ))}
        </div>

        <div className="featured-project reveal reveal-delay-1" style={{ marginBottom: "48px", background: "#161616", borderLeft: "4px solid #C8A96E", padding: "40px 44px", borderRadius: "4px" }}>
          <span className="section-label" style={{ marginBottom: "12px", display: "block" }}>Featured Series</span>
          <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "#F0ECE4", marginBottom: "16px", lineHeight: 1.2 }}>
            Safar-e-Shahadat
          </h3>
          <p style={{ color: "#A8A29E", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "680px" }}>
            A 30-day illustrated series documenting the journey of Sikh Sahibzaade — one artwork per day through December. History told through art.
          </p>
        </div>

        <div className="circular-gallery reveal reveal-delay-2" id="circularGallery" ref={galleryRef}>
          <div className="cg-scene" id="cgScene" ref={sceneRef}>
            {PORTFOLIO_ITEMS.map((item, index) => {
              const isFiltered = activeFilter === "all" || item.filter === activeFilter
              return (
                <div
                  key={index}
                  className={`cg-card ${isFiltered ? "" : "cg-card--dimmed"}`}
                  data-index={index}
                  onClick={() => setLightboxIndex(index)}
                  style={{ cursor: "pointer" }}
                >
                  {item.type === "video" ? (
                    <video src={item.src} playsInline loop preload="metadata" aria-label={item.title}></video>
                  ) : (
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={500}
                      height={700}
                      loading={index < 2 ? "eager" : "lazy"}
                      priority={index < 2}
                    />
                  )}
                  <div className="cg-card-label">
                    <span className="cg-card-tag">{item.tag}</span>
                    <h4>{item.title}</h4>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <p className="cg-hint" style={{ textAlign: "center", marginTop: "40px", opacity: 0.4, fontSize: "0.85rem", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
          Click any piece to expand · Drag or scroll to rotate
        </p>

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8"
            style={{
              background: 'rgba(4, 4, 4, 0.95)',
              backdropFilter: 'blur(24px) saturate(160%)',
              WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Bokeh Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.4) 0%, transparent 70%)', top: '10%', left: '10%', filter: 'blur(60px)' }} />
              <div className="absolute w-72 h-72 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.3) 0%, transparent 70%)', bottom: '10%', right: '10%', filter: 'blur(70px)' }} />
            </div>

            {/* Prev Button */}
            <button
              className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 z-30"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((lightboxIndex - 1 + PORTFOLIO_ITEMS.length) % PORTFOLIO_ITEMS.length)
              }}
              aria-label="Previous artwork"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-11 h-11 md:w-13 md:h-13 flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 z-30"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              onClick={(e) => {
                e.stopPropagation()
                setLightboxIndex((lightboxIndex + 1) % PORTFOLIO_ITEMS.length)
              }}
              aria-label="Next artwork"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              className="absolute top-5 right-5 md:top-6 md:right-6 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110 z-30"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
              onClick={() => setLightboxIndex(null)}
              aria-label="Close lightbox"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Main Media Container */}
            <div
              className="relative flex flex-col items-center justify-center max-w-[92vw] md:max-w-[85vw] max-h-[75vh] md:max-h-[78vh] z-20 mb-14 md:mb-16"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Backlight Glow */}
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,169,110,0.5) 0%, rgba(255,200,150,0.3) 50%, rgba(200,169,110,0.5) 100%)',
                  filter: 'blur(35px)',
                  transform: 'scale(1.05)',
                  opacity: 0.7,
                }}
              />

              {PORTFOLIO_ITEMS[lightboxIndex].type === "video" ? (
                <video
                  src={PORTFOLIO_ITEMS[lightboxIndex].src}
                  controls
                  autoPlay
                  className="relative max-w-[88vw] md:max-w-[85vw] max-h-[64vh] md:max-h-[72vh] object-contain rounded-xl shadow-2xl border border-white/10"
                />
              ) : (
                <img
                  src={PORTFOLIO_ITEMS[lightboxIndex].src}
                  alt={PORTFOLIO_ITEMS[lightboxIndex].title}
                  className="relative max-w-[88vw] md:max-w-[85vw] max-h-[64vh] md:max-h-[72vh] object-contain rounded-xl shadow-2xl border border-white/10 transition-all duration-300"
                  style={{
                    boxShadow: '0 0 50px rgba(200, 169, 110, 0.25), 0 20px 40px rgba(0, 0, 0, 0.6)',
                  }}
                />
              )}
            </div>

            {/* Bottom Silk Gold Pill Bar (Matching Active Filter Pill Styling) */}
            <div
              className="absolute bottom-4 md:bottom-7 left-1/2 -translate-x-1/2 z-30 px-7 py-3.5 md:px-10 md:py-4.5 rounded-full text-center flex items-center gap-3.5 md:gap-6 max-w-[92vw] md:max-w-none overflow-hidden"
              style={{
                color: '#0A0A0A',
                background: 'linear-gradient(135deg, rgba(200, 169, 110, 0.92) 0%, rgba(225, 202, 152, 1) 25%, rgba(200, 169, 110, 0.96) 50%, rgba(180, 150, 90, 0.92) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(200, 169, 110, 0.5), inset 0 2px 3px rgba(255, 255, 255, 0.6), inset 0 -2px 3px rgba(0, 0, 0, 0.2)',
                minHeight: '52px',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Category Tag */}
              <div className="flex items-center gap-2">
                <span className="w-3.5 md:w-5 h-px bg-[#0A0A0A]/70" />
                <span className="text-[0.68rem] md:text-[0.78rem] font-bold uppercase tracking-[0.22em] text-[#0A0A0A] whitespace-nowrap">
                  {PORTFOLIO_ITEMS[lightboxIndex].tag}
                </span>
              </div>

              {/* Dark Vertical Divider */}
              <div className="w-px h-4 bg-gradient-to-b from-transparent via-[#0A0A0A]/40 to-transparent" />

              {/* Artwork Title */}
              <h3
                className="text-sm md:text-xl font-semibold text-[#0A0A0A] tracking-wide whitespace-nowrap"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                {PORTFOLIO_ITEMS[lightboxIndex].title}
              </h3>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="process" id="process">
      <div className="container">
        <div className="process-header reveal">
          <span className="section-label">How I Work</span>
          <h2 className="section-heading">From <em>feeling</em> to form</h2>
          <p>My process isn't a pipeline — it's a dialogue. Here's how the magic usually unfolds.</p>
        </div>

        <div className="process-timeline">
          <div className="process-step reveal">
            <div className="process-number">01</div>
            <div className="process-content">
              <h4>The Conversation</h4>
              <p>We start by talking — not about deliverables, but about feeling. What does your brand want to say? What mood should someone walk away with? I listen deeply, ask the weird questions, and find the emotional core of the project.</p>
            </div>
          </div>

          <div className="process-step reveal reveal-delay-1">
            <div className="process-number">02</div>
            <div className="process-content">
              <h4>Visual Exploration</h4>
              <p>Sketchbooks fill up. Colour swatches pile on. I explore textures, references, and rough compositions until the visual language starts to click. This is where the raw energy lives — messy, honest, and full of potential.</p>
            </div>
          </div>

          <div className="process-step reveal reveal-delay-2">
            <div className="process-number">03</div>
            <div className="process-content">
              <h4>Refinement & Craft</h4>
              <p>The sketches sharpen. Details emerge. I move between digital and traditional media, layering intention into every line and letting the piece breathe. This is where craft meets intuition.</p>
            </div>
          </div>

          <div className="process-step reveal reveal-delay-3">
            <div className="process-number">04</div>
            <div className="process-content">
              <h4>Delivery & Beyond</h4>
              <p>You receive final artwork that doesn't just fit the brief — it elevates it. Print-ready, screen-optimised, and delivered with care. Because the work should feel as good in your hands as it does on screen.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const INSTAGRAM_POSTS = [
  "https://www.instagram.com/reel/DV510Oaj_Q6/",
  "https://www.instagram.com/p/DSbwwdXEUTK/",
  "https://www.instagram.com/p/DK4n87phaBc/",
]

function LatestWorkSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Process Instagram embeds once mounted
    const timer = setTimeout(() => {
      if ((window as any).instgrm) {
        (window as any).instgrm.Embeds.process()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="latest-work" id="latest-work">
      <div className="container">
        <div className="latest-work-header reveal">
          <span className="section-label">On the Gram</span>
          <h2 className="section-heading latest-work-heading">Latest Work</h2>
          <p className="latest-work-subtext">
            Follow the process on Instagram · <a href="https://www.instagram.com/art_overyou" target="_blank" rel="noopener noreferrer">@art_overyou</a>
          </p>
        </div>

        <div className="ig-grid reveal reveal-delay-1">
          {mounted ? (
            INSTAGRAM_POSTS.map((url, index) => (
              <div key={index} className="ig-item">
                <blockquote
                  className="instagram-media"
                  data-instgrm-captioned
                  data-instgrm-permalink={url}
                  data-instgrm-version="14"
                  style={{ background: "#0A0A0A", border: 0, borderRadius: "4px", boxShadow: "none", margin: 0, maxWidth: "100%", minWidth: "100%", padding: 0, width: "100%" }}
                >
                  <div style={{ padding: "16px" }}>
                    <a
                      href={url}
                      style={{ background: "#0A0A0A", lineHeight: 0, padding: 0, textAlign: "center", textDecoration: "none", width: "100%", color: "#C8A96E" }}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View this post on Instagram
                    </a>
                  </div>
                </blockquote>
              </div>
            ))
          ) : (
            INSTAGRAM_POSTS.map((url, index) => (
              <div key={index} className="ig-item">
                <div style={{ background: "#0A0A0A", border: "1px solid rgba(200, 169, 110, 0.2)", borderRadius: "4px", padding: "40px 16px", textAlign: "center" }}>
                  <a
                    href={url}
                    style={{ color: "#C8A96E", textDecoration: "none", fontSize: "0.9rem" }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View this post on Instagram
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [formState, setFormState] = useState<"default" | "sending" | "success">("default")
  const [errors, setErrors] = useState<{ name?: string; email?: string; project?: string; message?: string }>({})
  const [fieldStatus, setFieldStatus] = useState<{ name?: "success" | "error"; email?: "success" | "error"; project?: "success" | "error"; message?: "success" | "error" }>({})

  const validateName = (value: string) => value.trim().length >= 2
  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const validateProject = (value: string) => value !== ''
  const validateMessage = (value: string) => value.trim().length >= 10

  const handleBlur = (field: "name" | "email" | "project" | "message", value: string) => {
    if (!value) return

    let isValid = false
    let errorMsg = ''

    switch (field) {
      case 'name':
        isValid = validateName(value)
        errorMsg = 'Name must be at least 2 characters'
        break
      case 'email':
        isValid = validateEmail(value)
        errorMsg = 'Please enter a valid email address'
        break
      case 'project':
        isValid = validateProject(value)
        errorMsg = 'Please select a project type'
        break
      case 'message':
        isValid = validateMessage(value)
        errorMsg = 'Message must be at least 10 characters'
        break
    }

    if (isValid) {
      setFieldStatus(prev => ({ ...prev, [field]: "success" }))
      setErrors(prev => ({ ...prev, [field]: undefined }))
    } else {
      setFieldStatus(prev => ({ ...prev, [field]: "error" }))
      setErrors(prev => ({ ...prev, [field]: errorMsg }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const project = formData.get('project') as string
    const message = formData.get('message') as string

    let isValid = true
    const newErrors: typeof errors = {}
    const newStatus: typeof fieldStatus = {}

    if (!validateName(name)) {
      newErrors.name = 'Name must be at least 2 characters'
      newStatus.name = 'error'
      isValid = false
    } else {
      newStatus.name = 'success'
    }

    if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
      newStatus.email = 'error'
      isValid = false
    } else {
      newStatus.email = 'success'
    }

    if (!validateProject(project)) {
      newErrors.project = 'Please select a project type'
      newStatus.project = 'error'
      isValid = false
    } else {
      newStatus.project = 'success'
    }

    if (!validateMessage(message)) {
      newErrors.message = 'Message must be at least 10 characters'
      newStatus.message = 'error'
      isValid = false
    } else {
      newStatus.message = 'success'
    }

    setErrors(newErrors)
    setFieldStatus(newStatus)

    if (!isValid) return

    setFormState("sending")
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, project, message }),
      })
      setFormState("success")
      form.reset()
      setFieldStatus({})
      setErrors({})
      setTimeout(() => setFormState("default"), 4000)
    } catch (err) {
      console.error("Contact form error:", err)
      setFormState("default")
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-inner reveal">
          <span className="section-label">Get in Touch</span>
          <h2 className="contact-heading">Let's Create Something<span className="gold-dot">.</span></h2>
          <p className="contact-subtitle">
            Got a project in mind? A music video, an illustrated series, a portrait that means something? I'd love to hear about it. Reach out — every great artwork starts with a conversation.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className={`form-field ${fieldStatus.name || ''}`}>
                <label htmlFor="contactName" className="form-label">Your Name</label>
                <input
                  type="text"
                  id="contactName"
                  name="name"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  aria-describedby="nameError"
                  onBlur={(e) => handleBlur('name', e.target.value)}
                />
                <span className="form-error" id="nameError" role="alert">{errors.name}</span>
              </div>
              <div className={`form-field ${fieldStatus.email || ''}`}>
                <label htmlFor="contactEmail" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="email"
                  placeholder="your@email.com"
                  required
                  autoComplete="email"
                  aria-describedby="emailError"
                  onBlur={(e) => handleBlur('email', e.target.value)}
                />
                <span className="form-error" id="emailError" role="alert">{errors.email}</span>
              </div>
            </div>
            <div className={`form-field ${fieldStatus.project || ''}`}>
              <label htmlFor="contactProject" className="form-label">Project Type</label>
              <select
                id="contactProject"
                name="project"
                required
                aria-describedby="projectError"
                onChange={(e) => handleBlur('project', e.target.value)}
              >
                <option value="">Select a project type...</option>
                <option value="music-art">Music Video Artwork</option>
                <option value="portrait">Portrait Commission</option>
                <option value="devotional">Devotional/Historical Art</option>
                <option value="illustration">Illustration</option>
                <option value="branding">Branding & Design</option>
                <option value="other">Other</option>
              </select>
              <span className="form-error" id="projectError" role="alert">{errors.project}</span>
            </div>
            <div className={`form-field ${fieldStatus.message || ''}`}>
              <label htmlFor="contactMessage" className="form-label">Tell me about your vision</label>
              <textarea
                id="contactMessage"
                name="message"
                placeholder="Describe your project, timeline, and vision..."
                rows={5}
                required
                aria-describedby="messageError"
                onBlur={(e) => handleBlur('message', e.target.value)}
              ></textarea>
              <span className="form-error" id="messageError" role="alert">{errors.message}</span>
            </div>
            <button type="submit" className={`btn-primary contact-submit ${formState}`} disabled={formState !== "default"}>
              <span className="btn-state btn-state-default">
                <span>Send Message</span>
                <svg className="submit-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
              <span className="btn-state btn-state-sending">
                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75" />
                </svg>
                <span>Sending...</span>
              </span>
              <span className="btn-state btn-state-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Message Sent!</span>
              </span>
            </button>
            <div className="form-feedback" role="status" aria-live="polite"></div>
          </form>
        </div>
      </div>
    </section>
  )
}
