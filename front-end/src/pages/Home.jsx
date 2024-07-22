import { Col, Row } from "react-bootstrap";
import BlogPosts from "../components/BlogPosts";
import PropTypes from "prop-types";

function Home({ posts, filteredPost }) {
  return (
    <Row>
      <Col>
        <h1 className="text-center mt-4">Home Page</h1>
        <Row className="d-flex justify-content-center align-items-center flex-column mt-4">
          {/* Se la lunghezza dell'array restituito è 0, passo tutti i post. Sennò passo i post filtrati  */}
          {filteredPost.length === 0 ? (
            <BlogPosts posts={posts} />
          ) : (
            <BlogPosts posts={filteredPost} />
          )}
        </Row>
      </Col>
    </Row>
  );
}

Home.propTypes = {
  posts: PropTypes.array.isRequired,
  filteredPost: PropTypes.array.isRequired,
};

export default Home;
