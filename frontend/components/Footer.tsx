export default function Footer() {
  return (
    <footer className="footer">
      <div className="social">
        <a href="https://www.facebook.com/iiitlucknow?mibextid=ZbWKwL" target="_blank" rel="noopener noreferrer">
          <i className="bx bxl-facebook"></i>
        </a>
        <a
          href="https://www.instagram.com/iiitlucknow?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="bx bxl-instagram"></i>
        </a>
        <a href="https://in.linkedin.com/school/iiitl/" target="_blank" rel="noopener noreferrer">
          <i className="bx bxl-linkedin"></i>
        </a>
      </div>

      <p className="copyright">&copy; Fitness Freaks {new Date().getFullYear()}-All Rights Reserved</p>
    </footer>
  )
}
