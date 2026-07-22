"use client"

import {
  ContainerAnimated,
  ContainerScroll,
  ContainerStagger,
  ContainerSticky,
  GalleryCol,
  GalleryContainer,
} from "@/components/blocks/animated-gallery"
import Link from "next/link"
import { useEffect, useState, useCallback } from "react"

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const IMAGES_1 = [
  "/images/diljit-aura.jpg",
  "/images/aura-world-tour.jpg",
  "/images/diljit-lightning.jpg",
  "/images/divine-journey.jpg",
  "/images/nusrat.jpg",
  "/images/destiny.jpg",
  "/images/ray-of-hope.jpg",
]

const IMAGES_2 = [
  "/images/nimrat-portrait.jpg",
  "/images/bollywood-collage.jpg",
  "/images/dr.zeus.jpg",
  "/images/diljit-singing.jpg",
  "/images/sunflowers-balcony.jpg",
  "/images/space-traveler.jpg",
  "/images/diljit-sword.jpg",
]

const IMAGES_3 = [
  "/images/diljit-sword.jpg",
  "/images/divine-journey.jpg",
  "/images/nimrat-portrait.jpg",
  "/images/aura-world-tour.jpg",
  "/images/bollywood-collage.jpg",
  "/images/nusrat.jpg",
  "/images/diljit-lightning.jpg",
]

export default function CoverArtPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const [images1, setImages1] = useState(IMAGES_1)
  const [images2, setImages2] = useState(IMAGES_2)
  const [images3, setImages3] = useState(IMAGES_3)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)

    setImages1(shuffleArray(IMAGES_1))
    setImages2(shuffleArray(IMAGES_2))
    setImages3(shuffleArray(IMAGES_3))

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImage(null)
    }
    if (lightboxImage) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [lightboxImage])

  const openLightbox = useCallback((src: string) => {
    setLightboxImage(src)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxImage(null)
  }, [])

  return (
    <div className="relative bg-[#080808]">
      {/* Back Button - Liquid Glass Pill */}
      <Link href="/" className="back-btn-glass">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>Back</span>
      </Link>

      {/* Hero Section - Centered with visual effects */}
      <div className="relative flex items-center justify-center min-h-[35vh] md:min-h-[45vh] px-4 overflow-hidden">
        {/* Ambient glow behind text */}
        <div
          className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(200,169,110,0.4) 0%, transparent 70%)',
            filter: 'blur(60px)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-1 h-1 bg-[#C8A96E] rounded-full opacity-60 animate-pulse" style={{ top: '20%', left: '15%' }} />
          <div className="absolute w-1.5 h-1.5 bg-[#C8A96E] rounded-full opacity-40 animate-pulse" style={{ top: '70%', left: '25%', animationDelay: '0.5s' }} />
          <div className="absolute w-1 h-1 bg-[#C8A96E] rounded-full opacity-50 animate-pulse" style={{ top: '30%', right: '20%', animationDelay: '1s' }} />
          <div className="absolute w-2 h-2 bg-[#C8A96E] rounded-full opacity-30 animate-pulse" style={{ top: '65%', right: '15%', animationDelay: '1.5s' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-40 animate-pulse" style={{ top: '45%', left: '10%', animationDelay: '0.7s' }} />
          <div className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-pulse" style={{ top: '55%', right: '10%', animationDelay: '1.2s' }} />
        </div>

        {/* Decorative lines */}
        <div className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 w-[60px] md:w-[100px] h-px bg-gradient-to-r from-transparent via-[#C8A96E]/30 to-transparent" />
        <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 w-[60px] md:w-[100px] h-px bg-gradient-to-r from-transparent via-[#C8A96E]/30 to-transparent" />

        <ContainerStagger className="relative text-center max-w-4xl mx-auto z-10">
          <ContainerAnimated>
            <span className="inline-block px-8 py-3 md:px-12 md:py-4 rounded-full text-[0.7rem] md:text-[0.8rem] uppercase tracking-[0.3em] text-[#C8A96E] mb-6 md:mb-8 font-medium"
              style={{
                background: 'linear-gradient(135deg, rgba(200, 169, 110, 0.12) 0%, rgba(200, 169, 110, 0.05) 100%)',
                border: '1px solid rgba(200, 169, 110, 0.3)',
                boxShadow: '0 4px 20px rgba(200, 169, 110, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
              }}
            >
              ✦&nbsp;&nbsp;Music Video Artwork&nbsp;&nbsp;✦
            </span>
          </ContainerAnimated>

          <ContainerAnimated>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-light text-[#F0ECE4] mb-4 md:mb-6"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Cover Art
            </h1>
          </ContainerAnimated>

          <ContainerAnimated>
            <p className="text-sm md:text-base text-[#A8A29E]/70 max-w-md mx-auto leading-relaxed">
              A curated collection of illustrated artwork for music videos and albums
            </p>
          </ContainerAnimated>

          <ContainerAnimated>
            <div className="flex items-center justify-center gap-3 mt-6 md:mt-8 text-[0.65rem] md:text-[0.7rem] uppercase tracking-[0.2em] text-[#C8A96E]/50">
              <span className="w-8 h-px bg-[#C8A96E]/30" />
              <span>Scroll to explore</span>
              <span className="w-8 h-px bg-[#C8A96E]/30" />
            </div>
          </ContainerAnimated>
        </ContainerStagger>
      </div>

      {/* Gallery */}
      <ContainerScroll className={`relative ${isMobile ? 'h-[280vh]' : 'h-[300vh]'}`}>
        <ContainerSticky className="h-svh overflow-hidden">
          <GalleryContainer className="grid-cols-2 gap-3 px-4 md:grid-cols-3 md:gap-2 md:px-4">
            {/* Left column - scrolls UP */}
            <GalleryCol
              yRange={["0%", "-20%"]}
              mobileYRange={["0%", "-20%"]}
            >
              {(isMobile ? images1.slice(0, 8) : images1).map((imageUrl, index) => (
                <img
                  key={`${imageUrl}-${index}`}
                  className="block h-auto w-full rounded-lg object-cover shadow-lg aspect-[3/4] md:aspect-[16/9] cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                  src={imageUrl}
                  alt="gallery item"
                  onClick={() => openLightbox(imageUrl)}
                />
              ))}
            </GalleryCol>

            {/* Middle column - scrolls DOWN (desktop only) */}
            {!isMobile && (
              <GalleryCol yRange={["0%", "15%"]}>
                {images2.map((imageUrl, index) => (
                  <img
                    key={`${imageUrl}-${index}`}
                    className="aspect-[16/9] block h-auto w-full rounded-lg object-cover shadow-lg cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                    src={imageUrl}
                    alt="gallery item"
                    onClick={() => openLightbox(imageUrl)}
                  />
                ))}
              </GalleryCol>
            )}

            {/* Right column - scrolls UP (same as left) */}
            <GalleryCol
              yRange={["0%", "-20%"]}
              mobileYRange={["0%", "15%"]}
            >
              {(isMobile ? [...images2.slice(0, 4), ...images3.slice(0, 4)] : images3).map((imageUrl, index) => (
                <img
                  key={`${imageUrl}-${index}`}
                  className="block h-auto w-full rounded-lg object-cover shadow-lg aspect-[3/4] md:aspect-[16/9] cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
                  src={imageUrl}
                  alt="gallery item"
                  onClick={() => openLightbox(imageUrl)}
                />
              ))}
            </GalleryCol>
          </GalleryContainer>
        </ContainerSticky>
      </ContainerScroll>

      {/* Lightbox with Bokeh Effect */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center"
          onClick={closeLightbox}
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(16px) saturate(120%)',
            WebkitBackdropFilter: 'blur(16px) saturate(120%)',
          }}
        >
          {/* Bokeh circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-64 h-64 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.3) 0%, transparent 70%)', top: '10%', left: '5%', filter: 'blur(40px)' }} />
            <div className="absolute w-48 h-48 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.3) 0%, transparent 70%)', top: '60%', right: '10%', filter: 'blur(50px)' }} />
            <div className="absolute w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)', top: '30%', right: '25%', filter: 'blur(30px)' }} />
            <div className="absolute w-40 h-40 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, rgba(200,169,110,0.3) 0%, transparent 70%)', bottom: '15%', left: '20%', filter: 'blur(45px)' }} />
            <div className="absolute w-24 h-24 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)', top: '15%', right: '40%', filter: 'blur(25px)' }} />
          </div>

          {/* Close button - Crosshair style */}
          <button
            className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110 z-10"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C8A96E" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Image with backlight glow */}
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Backlight glow */}
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(200,169,110,0.6) 0%, rgba(255,200,150,0.4) 50%, rgba(200,169,110,0.6) 100%)',
                filter: 'blur(30px)',
                transform: 'scale(1.08)',
                opacity: 0.7,
              }}
            />
            <div
              className="absolute inset-0 rounded-xl"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.3) 0%, transparent 70%)',
                filter: 'blur(20px)',
                transform: 'scale(1.1)',
              }}
            />
            <img
              src={lightboxImage}
              alt="Enlarged artwork"
              className="relative max-w-[90vw] max-h-[85vh] object-contain rounded-xl animate-in fade-in zoom-in-95 duration-300"
              style={{
                boxShadow: '0 0 60px rgba(200, 169, 110, 0.3), 0 0 120px rgba(200, 169, 110, 0.15), 0 25px 50px rgba(0, 0, 0, 0.4)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
