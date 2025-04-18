import React from "react";
import { Link } from "react-router-dom";

//BASIC LANDING
const LandingPage: React.FC = () => {
  return (
    <div className="container py-5 text-center">
      <div className="p-5 bg-light rounded shadow-sm">
        <h1 className="display-4 mb-3">
          Welcome to the Entertainment Agency Platform
        </h1>
        <p className="lead mb-4">
          Discover talented entertainers, track their engagements, and get
          real‑time booking stats—all in one place.
        </p>
        <hr className="my-4" />
        <p>
          Browse our roster of entertainers or dive into booking analytics to
          plan your next event with confidence.
        </p>
        <Link to="/entertainerStats" className="btn btn-primary btn-lg">
          View Entertainer Stats
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
