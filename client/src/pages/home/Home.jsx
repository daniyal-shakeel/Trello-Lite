import "./Home.css";
import { FEATURES } from "../../assets/data/home-page";
import { ExternalLink } from "lucide-react";
import trelloHome from "../../assets/images/trello-home.png";
import { useNavigate } from "react-router-dom";
const CTA_BUTTONS = () => {
  const navigate = useNavigate();
  return (
    <div className="home__cta-buttons">
      <button
        onClick={() => navigate("/login?register=true")}
        className="home__cta-button home__cta-button--get-started"
      >
        Get Started
      </button>
      <button
        onClick={() => navigate("/login?register=false")}
        className="home__cta-button home__cta-button--login"
      >
        Login
      </button>
    </div>
  );
};
const Home = () => {
  return (
    <div id="home" className="home">
      {/* Navbar Section */}
      <div id="home-navbar" className="home__navbar">
        <h1 className="home__title">TrelloLite</h1>
        <CTA_BUTTONS />
      </div>

      {/* Hero Section */}
      <div id="home-hero" className="home__hero">
        <h1 className="home__hero-title">
          Organize tasks effortlessly with a clean, dark interface
        </h1>
        <p className="home__hero-description">
          TrelloLite helps teams capture, prioritize, and complete work in a
          familiar Kanban flow—fast, focused, and distraction‑free.
        </p>
        <CTA_BUTTONS />
      </div>

      {/* Picture Section */}
      <div id="home-picture" className="home__picture">
        <img className="home__picture-img" src={trelloHome} alt="trello-home" />
      </div>

      {/* Features Section */}
      <div id="home-features" className="home__features">
        <h1 className="home__features-title">Built for focus</h1>
        <p className="home__features-description">
          Minimal, purposeful features so your team can ship more with less
          noise.
        </p>
        <div className="home__feature-items">
          {FEATURES.map((feature, i) => (
            <div key={i} className="home__feature-item">
              <h2 className="home__feature-title">{feature.title}</h2>
              <p className="home__feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div id="home-footer" className="home__footer">
        <div className="home__footer-cta">
          <h1 className="home__footer-title">Ready to get organized?</h1>
          <p className="home__footer-description">
            Start in seconds—no setup required.
          </p>
        </div>
        <CTA_BUTTONS />
      </div>

      {/* Copyright Section */}
      <div id="home-copyright" className="home__copyright">
        <p className="home__copyright-text">
          © 2023 TrelloLite. All rights reserved.
        </p>
        <ul className="home__social-list">
          <li className="home__social-item">
            <a
              className="home__social-link"
              href="https://github.com/unikalnix"
              target="_blank"
            >
              Github <ExternalLink className="home__social-icon" />
            </a>
          </li>
          <li className="home__social-item">
            <a
              className="home__social-link"
              href="https://instagram.com/mern._dev/"
              target="_blank"
            >
              Instagram <ExternalLink className="home__social-icon" />
            </a>
          </li>
          <li className="home__social-item">
            <a
              className="home__social-link"
              href="https://www.linkedin.com/in/hafiz-daniyal-shakeel-239441316/"
              target="_blank"
            >
              LinkedIn <ExternalLink className="home__social-icon" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
