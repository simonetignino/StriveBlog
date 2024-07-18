import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BlogPosts from "../components/BlogPosts";
import { getPosts } from "../services/api";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPosts(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("errore nella get di tutti i post", error);
      }
    };
    fetchPosts();
  }, []);

  return (
    <Row>
      <Col>
        <h1 className="text-center mt-4">Home Page</h1>
        <Row className="d-flex justify-content-center align-items-center flex-column mt-4">
          <BlogPosts posts={posts} />
        </Row>
      </Col>
    </Row>
  );
}
