import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100px" }}
    >
      <Spinner animation="border" variant="primary" />
    </div>
  );
};

export default LoadingSpinner;
