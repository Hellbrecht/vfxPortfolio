import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clapperboard,
  Linkedin,
  Mail,
  MapPin,
  Play,
  Send,
  X,
} from "lucide-react";
import { credits, portfolio } from "./portfolioData.js";
import "./styles.css";

function App() {
  const [message, setMessage] = useState("");
  const [isReelOpen, setIsReelOpen] = useState(false);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent(`Portfolio inquiry for ${portfolio.name}`);
    const body = encodeURIComponent(message || portfolio.contact.defaultMessage);
    return `mailto:${portfolio.contact.email}?subject=${subject}&body=${body}`;
  }, [message]);

  return (
    <main className="site">
      <Header />
      <Hero onOpenReel={() => setIsReelOpen(true)} />
      <About />
      <Work credits={credits} />
      <Experience />
      <Contact mailtoHref={mailtoHref} message={message} onMessageChange={setMessage} />
      {isReelOpen ? <ReelModal onClose={() => setIsReelOpen(false)} /> : null}
    </main>
  );
}

function Header() {
  return (
    <header className="topbar">
      <nav aria-label="Primary navigation">
        <a href="#reel">Reel</a>
        <a href="#about">About</a>
        <a href="#work">Credits</a>
        <a href="#experience">Experience</a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}

function Hero({ onOpenReel }) {
  return (
    <section className="hero" id="home">
      <div className="hero-media" id="reel" aria-hidden="true">
        <iframe
          src={portfolio.showreelBackgroundUrl}
          title=""
          allow="autoplay; fullscreen; picture-in-picture"
          tabIndex="-1"
        />
      </div>
      <div className="hero-content">
        <p className="eyebrow">{portfolio.role}</p>
        <h1>JP Marchand</h1>
        <p className="hero-copy">{portfolio.summary}</p>
        <div className="hero-actions">
          <a className="button primary" href="#work">
            <Clapperboard size={18} />
            View Credits
          </a>
          <button className="button secondary" type="button" onClick={onOpenReel}>
            <Play size={18} />
            Play Reel
          </button>
        </div>
      </div>
      <aside className="hero-panel" aria-label="Portfolio highlights">
        {portfolio.metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </div>
        ))}
      </aside>
    </section>
  );
}

function ReelModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="reel-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reel-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-topbar">
          <h2 id="reel-modal-title">Showreel</h2>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close reel">
            <X size={20} />
          </button>
        </div>
        <iframe
          className="reel-player"
          src={portfolio.showreelEmbedUrl}
          title="JP Marchand showreel"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </section>
    </div>
  );
}

function About() {
  return (
    <section className="section about" id="about" aria-labelledby="about-title">
      <div className="section-heading">
        <p className="eyebrow">About</p>
        <h2 id="about-title">Photoreal worlds for feature film and episodic storytelling.</h2>
      </div>
      <div className="about-grid">
        <p>{portfolio.about}</p>
        <div className="skills" aria-label="Core skills">
          {portfolio.skills.map((skill) => (
            <span key={skill}>{skill}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work({ credits: visibleCredits }) {
  return (
    <section className="section work-band" id="work" aria-labelledby="work-title">
      <div className="section-heading work-heading">
        <div>
          <p className="eyebrow">IMDb Credits</p>
          <h2 id="work-title">Film and television credits.</h2>
        </div>
        <a className="button secondary compact" href={portfolio.imdbUrl} target="_blank" rel="noreferrer">
          <ArrowUpRight size={17} />
          Full IMDb
        </a>
      </div>
      <div className="poster-grid">
        {visibleCredits.map((credit) => (
          <article className="poster-card" key={`${credit.title}-${credit.year}`}>
            <a
              className="poster-link"
              href={credit.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${credit.title} on IMDb`}
              title={`${credit.title} on IMDb`}
            >
              {credit.poster ? (
                <img src={credit.poster} alt={`${credit.title} poster`} loading="lazy" />
              ) : (
                <div className="poster-fallback" aria-hidden="true">
                  <Clapperboard size={30} />
                </div>
              )}
              <div className="poster-overlay">
                <p className="project-type">{credit.type}</p>
                <h3>{credit.title}</h3>
                <p>{credit.role}</p>
                <span>
                  {credit.year}
                  {credit.status ? ` - ${credit.status}` : ""}
                  {credit.episodes ? ` - ${credit.episodes}` : ""}
                </span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section experience" id="experience" aria-labelledby="experience-title">
      <div className="section-heading">
        <p className="eyebrow">Experience</p>
        <h2 id="experience-title">Supervision, shot work, and production-focused leadership.</h2>
      </div>
      <div className="timeline">
        {portfolio.experience.map((item) => (
          <article className="timeline-item" key={`${item.company}-${item.period}`}>
            <div className="timeline-icon" aria-hidden="true">
              <BriefcaseBusiness size={18} />
            </div>
            <div>
              <p className="period">{item.period}</p>
              <h3>{item.role}</h3>
              <p className="company">{item.company}</p>
              <p>{item.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact({ mailtoHref, message, onMessageChange }) {
  return (
    <section className="section contact" id="contact" aria-labelledby="contact-title">
      <div className="contact-copy">
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title">Open to environment, DMP, and supervision opportunities for film and episodic work.</h2>
        <p>{portfolio.contact.copy}</p>
        <div className="contact-links">
          <a href={`mailto:${portfolio.contact.email}`}>
            <Mail size={18} />
            {portfolio.contact.email}
          </a>
          <a href={portfolio.imdbUrl} target="_blank" rel="noreferrer">
            <Clapperboard size={18} />
            IMDb
          </a>
          <a href={portfolio.linkedinUrl} target="_blank" rel="noreferrer">
            <Linkedin size={18} />
            LinkedIn
          </a>
          <span>
            <MapPin size={18} />
            {portfolio.location}
          </span>
        </div>
      </div>
      <form className="contact-form" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Tell me about the show, scope, schedule, or team needs."
        />
        <a className="button primary" href={mailtoHref}>
          <Send size={18} />
          Contact Me
        </a>
        <p className="form-note">
          <CheckCircle2 size={16} />
          This opens your email client with the message prefilled.
        </p>
      </form>
    </section>
  );
}

createRoot(document.getElementById("root")).render(<App />);
