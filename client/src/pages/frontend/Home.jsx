import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="container mt-5 text-center">
      <h1 className="text-primary">Tax Project Staging Env</h1>
      <p className="lead">ITR & GST Filing Made Simple</p>

      <Link
        to="/login"
        className="btn btn-success me-2 text-decoration-none"
      >
        File ITR
      </Link>

      <Link
        to="/login"
        className="btn btn-outline-primary text-decoration-none"
      >
        GST Services
      </Link>
    </div>
  );
}
