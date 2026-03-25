import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

function Footer() {
  return (
    <footer
      style={{
        padding: "40px 0",
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        marginTop: "60px"
      }}
    >
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginBottom: "20px"
          }}
        >
          {/* WhatsApp */}
          <a
            href="https://wa.me/917483994131"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <FaWhatsapp /> WhatsApp
          </a>

          {/* Email */}
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=vaishnavikkundur@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <FaEnvelope /> Email
          </a>


          {/* Instagram */}
          <a
            href="https://www.instagram.com/vaishnavijkundur/"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
          >
            <FaInstagram /> Instagram
          </a>
        </div>

        <p style={{ fontSize: "14px", color: "#777" }}>
          © {new Date().getFullYear()} Jeki Arts. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

const linkStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  textDecoration: "none",
  color: "#333",
  fontSize: "16px",
  fontWeight: "500"
};

export default Footer;
