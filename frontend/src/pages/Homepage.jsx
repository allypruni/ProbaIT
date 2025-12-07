import React from "react";
import "./Homepage.css";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/Footer";

function Homepage() {
  const { user } = useAuth();

  const isLoggedIn = !!user;

  return (
    <>
      <main className="home">
        <div className="home-hero-center">
          {isLoggedIn ? (
            <>
              <h1 className="home-title">🔥 Grill Master Mode: ON</h1>
              <p className="home-subtitle">
                Bine ai revenit, <strong>{user.name}</strong>! Deja faci parte din comunitatea{" "}
                <strong>Pimp Your Grill</strong>. Postează-ți grătarele, strânge MICI și urcă în{" "}
                <strong>THE BEST GRILLS</strong>!
              </p>

              <div className="home-cta-row">
                <a href="/best-grills" className="home-cta-primary">
                  🔥 Vezi cele mai bune grătare
                </a>
                <a href="/profile" className="home-cta-secondary">
                  👤 Mergi la grătarele tale
                </a>
              </div>
            </>
          ) : (
            <>
              <h1 className="home-title">🔥 Pimp Your Grill</h1>
              <p className="home-subtitle">
                Odată cu venirea căldurii, începe vânătoarea celor mai tari grătare. Postează-ți
                grătarul, strânge cât mai mulți MICI și ajunge în{" "}
                <strong>THE BEST GRILLS</strong>!
              </p>

              <div className="home-cta-row">
                <a href="/best-grills" className="home-cta-primary">
                  🔥 Vezi cele mai bune grătare
                </a>
                <a href="/register" className="home-cta-secondary">
                  📝 Creează-ți un cont
                </a>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Homepage;
