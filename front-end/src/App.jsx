import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import MyNavbar from "./components/navbar/MyNavbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/esm/Container";
import SinglePost from "./pages/SinglePost";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useState } from "react";
import { useEffect } from "react";
import { getPosts } from "./services/api";

function App() {
  // Elevazione di stato per gestirmi anche la ricerca dei post tramite barra di ricerca
  const [posts, setPosts] = useState([]);
  const [filteredPost, setFilteredPost] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        // console.log(response.data);
        setPosts(response.data.blogPosts);
        // console.log(response.data);
      } catch (error) {
        console.error("errore nella get di tutti i post", error);
      }
    };
    fetchPosts();
  }, [posts]);

  const [isLogged, setIsLogged] = useState(
    () => !!localStorage.getItem("token"),
  );

  // Controllo se nel localStorage esiste un token
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLogged(!!token);
    };

    // controllo lo stato del login all'avvio'
    checkLoginStatus();

    // Utilizzo un event listener per controllare lo stato di login
    window.addEventListener("storage", checkLoginStatus);

    // Rimuovi l'event listener quando il componente viene smontato
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  return (
    <Router>
      <MyNavbar
        isLogged={isLogged}
        setIsLogged={setIsLogged}
        posts={posts}
        filteredPosts={filteredPost}
        setFilteredPost={setFilteredPost}
      />
      <Container className="d-flex justify-content-center">
        <Routes>
          <Route
            path="/"
            element={
              isLogged ? (
                <Home posts={posts} filteredPost={filteredPost} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              isLogged ? (
                <Home posts={posts} filteredPost={filteredPost} />
              ) : (
                <Login />
              )
            }
          ></Route>
          <Route
            path="/create"
            element={isLogged ? <CreatePost /> : <Login />}
          ></Route>
          <Route
            path="/post/:id"
            element={isLogged ? <SinglePost /> : <Navigate to="/login" />}
          ></Route>
          <Route path="/register" element={<Register />}></Route>
          {/* <Route path="*" element={<NotFound />}></Route> */}
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
