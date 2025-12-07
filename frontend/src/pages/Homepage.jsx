import React from "react";
import "./Homepage.css";
import { useAuth } from "../context/AuthContext";

function Homepage() {
  const { user } = useAuth();

  const isLoggedIn = !!user;

  return (
    <main className="home">
      <section className="home-hero">
        {/* Bandă sus – mesaj diferit dacă e logat / nelogat */}
        <div className="home-hero-top-strip">
          {isLoggedIn ? (
            <span>
              Bine ai revenit, <strong>{user.name}</strong>! Pregătit să-ți duci grătarele în top? 🔥
            </span>
          ) : (
            <span>
              Înregistrează-te pentru a intra în cursa pentru cel mai bun grătar al verii! 🔥
            </span>
          )}
        </div>

        {/* Zona principală cu titlul și „desenele” de grătar */}
        <div className="home-hero-content">
          {/* „desene” stânga */}
          <div className="home-hero-illustrations home-hero-illustrations-left">
            <span role="img" aria-label="ustensilă">
              🍖
            </span>
            <span role="img" aria-label="clește">
              🍢
            </span>
            <span role="img" aria-label="foc">
              🔥
            </span>
          </div>

          {/* Cardul central – conținut diferit logat / nelogat */}
          <div className="home-hero-center">
            {isLoggedIn ? (
              <>
                <h1 className="home-title">Grill Master Mode: ON</h1>
                <p className="home-subtitle">
                  Deja faci parte din comunitatea <strong>Pimp Your Grill</strong>. Postează-ți
                  grătarele, strânge MICI și urcă în <strong>THE BEST GRILLS</strong>! Poți oricând
                  să îți vezi și gestionezi postările din profilul tău.
                </p>

                <div className="home-cta-row">
                  <a href="/best-grills" className="home-cta-primary">
                    Vezi cele mai bune grătare
                  </a>
                  <a href="/profile" className="home-cta-secondary">
                    Mergi la grătarele tale
                  </a>
                </div>
              </>
            ) : (
              <>
                <h1 className="home-title">Pimp Your Grill</h1>
                <p className="home-subtitle">
                  Odată cu venirea căldurii, începe vânătoarea celor mai tari grătare. Postează-ți
                  grătarul, strânge cât mai mulți MICI și ajunge în{" "}
                  <strong>THE BEST GRILLS</strong>!
                </p>

                <div className="home-cta-row">
                  <a href="/best-grills" className="home-cta-primary">
                    Vezi cele mai bune grătare
                  </a>
                  <a href="/register" className="home-cta-secondary">
                    Creează-ți un cont
                  </a>
                </div>
              </>
            )}
          </div>

          {/* „desene” dreapta */}
          <div className="home-hero-illustrations home-hero-illustrations-right">
            <span role="img" aria-label="grătar">
              🍔
            </span>
            <span role="img" aria-label="frigărui">
              🌭
            </span>
            <span role="img" aria-label="condimente">
              🧂
            </span>
          </div>
        </div>

        {/* Bandă de jos cu Contact + iconițe, ca în Figma */}
        <div className="home-hero-bottom-strip">
          <div className="home-bottom-inner">
            <span className="home-bottom-label">Contact:</span>
            <a href="mailto:liga@ac.tuiasi.ro" className="home-bottom-link">
              liga@ac.tuiasi.ro
            </a>
            <span className="home-bottom-separator">•</span>
            <span className="home-bottom-label">Urmărește-ne:</span>
            <div className="home-bottom-socials">
              <span>📘</span>
              <span>📸</span>
              <span>🐦</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Homepage;
