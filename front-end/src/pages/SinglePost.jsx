import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getPost,
  getComments,
  addComment,
  getUserData,
  deleteComment,
} from "../services/api";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Row,
  Spinner,
} from "react-bootstrap";
import "./SinglePost.css";

export default function SinglePost() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: "" });
  const [isLogged, setIsLogged] = useState(false);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await getPost(id);
        // console.log(postData);
        setPost(postData.data); // Assicurati che questo sia un singolo post, non un array
      } catch (err) {
        console.error("Errore nel caricamento del post:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const commentsData = await getComments(id);
        setComments(commentsData);
      } catch (err) {
        console.error("Errore nel caricamento dei commenti:", err);
      }
    };

    const checkAuthAndFetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLogged(true);
        try {
          const data = await getUserData();
          setUserData(data);
          fetchComments();
        } catch (error) {
          console.error("Errore nel recupero dei dati utente:", error);
          setIsLogged(false);
        }
      } else {
        setIsLogged(false);
      }
    };

    fetchPost();
    checkAuthAndFetchUserData();
  }, [id]);

  // const handlePatchPost = async (postId) => {
  //   try {
  //     const postToUpdate = await
  //   } catch (err) {
  //     console.error(err)
  //   }
  // };

  const handleCommentSubmit = async (e) => {
    e.preventDefault(); // Previene il comportamento predefinito del form di ricaricare la pagina
    try {
      // console.log(userData);
      const commentData = {
        content: newComment.content, // Contenuto del nuovo commento
        name: `${userData.name[0].toUpperCase() + userData.name.slice(1).toLowerCase()} ${userData.surname[0].toUpperCase() + userData.surname.slice(1).toLowerCase()}`, // Nome dell'utente
        email: userData.email, // Email dell'utente
        avatar: userData.avatar,
      };
      const newCommentData = await addComment(id, commentData); // Invia il nuovo commento all'API

      // Genera un ID temporaneo se l'API non restituisce un ID in tempo
      if (!newCommentData._id) {
        newCommentData._id = Date.now().toString();
      }
      setComments((prevComments) => [...prevComments, newCommentData]); // Aggiunge il nuovo commento alla lista dei commenti
      setNewComment({ content: "" }); // Resetta il campo del nuovo commento
    } catch (error) {
      console.error("Errore nell'invio del commento:", error); // Logga l'errore in console
      alert(
        `Errore nell'invio del commento: ${
          error.response?.data?.message || error.message
        }`,
      );
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      const response = await deleteComment(post._id, commentId);
      if (response.ok) {
        setComments((prevComments) =>
          prevComments.filter((comment) => comment._id !== commentId),
        );
        alert("Commento eliminato con successo");
      } else {
        // Se la risposta non è ok, ma non è stato lanciato un errore
        alert(response.message || "Errore nel rimuovere il commento");
      }
    } catch (err) {
      console.error("Errore nell'eliminazione del commento:", err);
      alert(
        err.message ||
          "Si è verificato un errore durante l'eliminazione del commento. Riprova più tardi.",
      );
    }
  };

  if (!post) {
    return (
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h1 className="display-4 mb-3">{post.title}</h1>
          {userData.email === post.author && (
            <Button
              // onClick={() => handlePatchPost(post._id)}
              variant="danger"
              className="mb-2"
            >
              <i className="bi bi-pencil-square"></i>
            </Button>
          )}
          <div className="mb-4 text-muted">
            <span>By {post.author} | </span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <Image
            src={post.cover}
            alt={post.title}
            fluid
            className="rounded shadow-lg mb-5"
          />
          <div className="bg-light p-4 rounded">
            <p className="lead mb-4">{post.content.substring(0, 150)}...</p>
            <hr className="my-4" />
            <p className="post-content">{post.content}</p>
          </div>

          {/* Sezione commenti */}
          <div>
            <h3 className="mt-5 mb-4">Commenti</h3>
            {comments.map((comment, index) => (
              <div
                key={comment._id}
                className={`comment p-3 mb-3 rounded ${index % 2 === 0 ? "bg-light" : "bg-white"}`}
              >
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar me-2">
                    {comment.name.charAt(0).toUpperCase()}
                  </div>
                  <strong>{comment.name}</strong>
                  <small className="text-muted ms-auto">
                    {new Date(comment.createdAt).toLocaleString()}
                  </small>
                  <small>
                    {userData.email === comment.email && (
                      <Button
                        onClick={() => handleCommentDelete(comment._id)}
                        variant="outline-danger"
                        className="p-1 px-2 rounded-circle ms-2"
                        style={{
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "1.5rem",
                          height: "1.5rem",
                        }}
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    )}
                  </small>
                </div>
                <p className="mb-0">{comment.content}</p>
              </div>
            ))}
            <Form onSubmit={handleCommentSubmit} className="mt-4">
              <Form.Group className="mb-3" controlId="commentContent">
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newComment.content}
                  onChange={(e) =>
                    setNewComment({ ...newComment, content: e.target.value })
                  }
                  placeholder="Scrivi un commento..."
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                <i className="bi bi-send me-2"></i>
                Invia commento
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
