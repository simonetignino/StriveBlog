import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <h2 style={styles.subheading}>Pagina Non Trovata</h2>
      <p style={styles.text}>
        Ci dispiace, la pagina che stai cercando non esiste.
      </p>
      <Link to="/" style={styles.link}>
        Torna alla Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    fontSize: "6rem",
    margin: "0",
    color: "#1a1a1a",
  },
  subheading: {
    fontSize: "2rem",
    margin: "0 0 1rem 0",
    color: "#333",
  },
  text: {
    fontSize: "1rem",
    marginBottom: "2rem",
    color: "#666",
  },
  link: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "1rem",
    transition: "background-color 0.3s",
  },
};

export default NotFound;
