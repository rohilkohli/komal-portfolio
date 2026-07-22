import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner" style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", textAlign: "center", gap: "14px" }}>
          <Link href="#hero" aria-label="Art OverYou home" style={{ display: "inline-flex", alignItems: "center" }}>
            <Image
              src="/images/art-overyou-logo.jpg"
              alt="Art OverYou by K.Panesar"
              className="footer-logo"
              width={36}
              height={36}
              loading="lazy"
            />
          </Link>

          <p className="footer-text" style={{ textAlign: "center", margin: 0 }}>
            © 2026 Komal Panesar. Crafted with <span>♥</span> and way too much chai.
          </p>
        </div>
      </div>
    </footer>
  )
}
