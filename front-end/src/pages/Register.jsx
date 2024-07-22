import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import Form from "react-bootstrap/Form";
import { Button, Card, Container } from "react-bootstrap";
import "./Register.css";

export default function Register() {
  // console.log("vengo caricato");
  // Definisce lo stato del form con useState, inizializzato con campi vuoti
  const [author, setAuthor] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    avatar: "",
    birthday: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const navigate = useNavigate(); // Inizializza useNavigate per poter navigare programmaticamente

  // Gestore per aggiornare lo stato quando i campi del form cambiano
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuthor({ ...author, [name]: value });
  };

  // Gestore per la sottomissione del form
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("il pulsante funziona");
    try {
      const formData = new FormData();
      Object.keys(author).forEach((key) => {
        formData.append(key, author[key]);
      });
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      await registerUser(formData);
      navigate("/");
    } catch (err) {
      console.error("errore nella creazione del author", err);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card className="register-card">
        <Card.Body>
          <h2 className="text-center mb-4">Registrazione</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                name="name"
                placeholder="Nome"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                name="surname"
                placeholder="Cognome"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                name="birthday"
                type="date"
                placeholder="Data di nascita"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                name="avatar"
                type="file"
                onChange={handleFileChange}
              />
              <Form.Text className="text-muted">
                Scegli un'immagine per il tuo avatar
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                name="password"
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100 mb-3">
              Registrati ora
            </Button>

            <div className="text-center">
              Hai già un account? <Link to="/login">Accedi</Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
