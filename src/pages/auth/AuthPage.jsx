import { useState } from "react";

import AuthHeroPanel from "./authFeatures/AuthHeroPanel";
import LoginForm from "./authFeatures/LoginForm";
import RegisterForm from "./authFeatures/RegisterForm";
import { ShieldIcon } from "./authFeatures/authIcons";
import "./auth.css";

function AuthPage({ initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode);

  return (
    <main className="min-h-screen bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">

        <div className="auth-card">
          <div
            className="auth-track"
            style={{
              transform: mode === "login" ? "translateX(0%)" : "translateX(-50%)",
            }}
          >

            {/* Slide 1 — Login: image left, form right */}
            <div className="auth-slide">
              <AuthHeroPanel
                heading={
                  <>
                    Welcome Back <br />
                    to the <span className="text-[#991313]">Family</span>
                  </>
                }
                subtitle="Sign in to continue your faith journey, access exclusive content, and stay connected with our community."
              />

              <div className="flex items-start justify-center bg-white px-8 pb-8 pt-8 lg:px-14 lg:pb-14">
                <LoginForm onSwitchToRegister={() => setMode("register")} />
              </div>
            </div>

            {/* Slide 2 — Register: form left, image right */}
            <div className="auth-slide">
              <div className="flex items-start justify-center bg-white px-8 pb-8 pt-0 lg:px-14 lg:pb-14">
                <RegisterForm onSwitchToLogin={() => setMode("login")} />
              </div>

              <AuthHeroPanel
                heading={
                  <>
                    Join the <span className="text-[#991313]">Family</span>
                  </>
                }
                subtitle="Create your free account to read daily devotionals, join discussions, and grow together in faith."
              />
            </div>

          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#4D5057]">
          <ShieldIcon />
          Your data is secure with us. We value your privacy.
        </div>

      </div>
    </main>
  );
}

export default AuthPage;