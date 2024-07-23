import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../services/api";
import { Card, Container } from "react-bootstrap";
import "./Login.css";

function BasicExample() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  //questo effecet viene renderizzato durante l'uso del componente e quando location o navigate cambiano
  useEffect(() => {
    // Estraggo i parametri dall'URL
    const params = new URLSearchParams(location.search);
    // Cerchiamo un parametro 'token' nell'URL
    const token = params.get("token");
    // console.log("Received token:", token);

    // Se troviamo un token, lo salviamo nel localStorage
    if (token) {
      localStorage.setItem("token", token);
      // console.log("Token saved, navigating to home");
      // Dispatchamo un evento 'storage' per aggiornare altri componenti che potrebbero dipendere dal token
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("loginStateChange"));
      // Navighiamo alla home page
      navigate("/");
    }
  }, [location, navigate]);
  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:5001/api/auth/google`;
  };

  const handleGitHubLogin = () => {
    window.location.href = `http://localhost:5001/api/auth/github`;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      // console.log(formData); //Chiama la funzoine loginUser per autenticare l'utente
      localStorage.setItem("token", response.token); // Memorizza il token di autenticazione nel localStorage
      // console.log(response.token);
      // Trigger l'evento storage per aggiornare la Navbar
      window.dispatchEvent(new Event("storage")); // Scatena un evento di storage per aggiornare componenti come la Navbar
      navigate("/");
    } catch (err) {
      console.error("errore durante il login:", err);
      alert("Credenziali non valide. Riprova");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card className="login-card">
        <Card.Body>
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                onChange={handleChange}
                placeholder="Inserisci la tua email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                onChange={handleChange}
                placeholder="Inserisci la tua password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3">
              Login
            </Button>

            <div className="text-center mb-3">
              Non hai un account? <Link to="/register">Registrati ora</Link>
            </div>

            <div className="separator">O</div>

            <Button
              variant="outline-dark"
              className="w-100 mt-3 d-flex align-items-center justify-content-center"
              onClick={handleGoogleLogin}
            >
              <svg
                className="me-4"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#FFC107"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#FF3D00"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4CAF50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1976D2"
                  d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Accedi con Google
            </Button>
            <Button
              variant="outline-dark"
              className="w-100 mt-3 d-flex align-items-center justify-content-center"
              onClick={handleGitHubLogin}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-github me-4"
                viewBox="0 0 16 16"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
              </svg>
              Accedi con GitHub
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BasicExample;
