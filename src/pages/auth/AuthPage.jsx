import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./authFeatures/LoginForm";
import churchLogo from "../../assets/images/mIcon.png";

const motes = Array.from({ length: 8 }, (_, i) => ({ left: `${(i * 41 + 12) % 100}%`, size: 2 + (i % 2), delay: `${(i * 2.3) % 12}s`, dur: `${22 + (i % 5) * 5}s` }));

const ring = { background: "conic-gradient(from 0deg, transparent 0deg, transparent 220deg, #991313 270deg, #ff6b6b 320deg, #ffffff 350deg, transparent 360deg)" };

const css = `
@keyframes auth-drift-a{0%{transform:translate(0,0) scale(1)}100%{transform:translate(10vw,14vh) scale(1.2)}}
@keyframes auth-drift-b{0%{transform:translate(0,0) scale(1.1)}100%{transform:translate(-10vw,-12vh) scale(.9)}}
@keyframes auth-breathe{0%,100%{opacity:.5}50%{opacity:.9}}
@keyframes auth-spin{to{transform:rotate(360deg)}}
@keyframes auth-card-in{from{opacity:0;transform:translateY(40px) scale(.96)}to{opacity:1;transform:none}}
@keyframes auth-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes auth-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
@keyframes auth-ring{0%{transform:scale(.6);opacity:.7}100%{transform:scale(1.5);opacity:0}}
@keyframes auth-shine{to{background-position:200% center}}
@keyframes auth-sweep{0%{transform:translateX(-120%) skewX(-20deg)}60%,100%{transform:translateX(320%) skewX(-20deg)}}
@keyframes auth-float{0%{transform:translateY(0);opacity:0}15%,85%{opacity:1}100%{transform:translateY(-110vh);opacity:0}}
.auth-drift-a{animation:auth-drift-a 40s ease-in-out infinite alternate;will-change:transform}
.auth-drift-b{animation:auth-drift-b 50s ease-in-out infinite alternate;will-change:transform}
.auth-breathe{animation:auth-breathe 9s ease-in-out infinite}
.auth-spin{animation:auth-spin 8s linear infinite}
.auth-spin-fast{animation:auth-spin .8s linear infinite}
.auth-card-in{animation:auth-card-in 1s cubic-bezier(.2,.8,.2,1) backwards}
.auth-rise{animation:auth-rise .8s cubic-bezier(.2,.8,.2,1) var(--d,0s) backwards}
.auth-pop{animation:auth-pop .6s cubic-bezier(.2,1.2,.3,1) backwards}
.auth-ring{animation:auth-ring 2.8s ease-out infinite}
.auth-sweep{animation:auth-sweep 3.2s ease-in-out infinite}
.auth-float{animation:auth-float var(--dur) linear var(--delay) infinite}
.auth-shine-text{background:linear-gradient(110deg,#991313,#e0605f,#991313);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:auth-shine 4s linear infinite}
@media (prefers-reduced-motion:reduce){.auth-root *{animation:none!important}}
`;

const rootStyle = { background: "radial-gradient(120% 90% at 50% 0%, #2e1519 0%, #170b0e 55%, #0d0708 100%)" };

const dots = { backgroundImage: "radial-gradient(rgba(255,255,255,0.09) 1px, transparent 1px)", backgroundSize: "26px 26px", WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, #000 0%, transparent 70%)", maskImage: "radial-gradient(ellipse at 50% 30%, #000 0%, transparent 70%)" };

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0" style={dots} />
      <div className="auth-breathe absolute left-1/2 top-[-25%] h-[70vh] w-[70vw] -translate-x-1/2 rounded-full blur-[120px]" style={{ background: "radial-gradient(closest-side, rgba(255,226,205,0.22), transparent)" }} />
      <div className="auth-drift-a absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-burgundy-primary/30 blur-[120px]" />
      <div className="auth-drift-b absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full bg-red-900/25 blur-[120px]" />
      {motes.map((p, i) => (
        <span key={i} className="auth-float absolute bottom-[-12px] rounded-full bg-white/30" style={{ left: p.left, width: p.size, height: p.size, "--delay": p.delay, "--dur": p.dur }} />
      ))}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />
    </div>
  );
}

function getRedirectPath(location) {
  const from = location.state?.from;
  if (!from) return "/";
  const path = typeof from === "string" ? from : `${from.pathname || "/"}${from.search || ""}${from.hash || ""}`;
  return path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/login") ? path : "/";
}

function AuthPage() {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const prev = document.title;
    document.title = "Sign in | Machaira";
    return () => { document.title = prev; };
  }, []);

  if (loading) {
    return (
      <div className="auth-root fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden" style={rootStyle} role="status" aria-live="polite">
        <style>{css}</style>
        <Backdrop />
        <div className="auth-spin-fast relative h-10 w-10 rounded-full border-2 border-white/20 border-t-white/80" />
        <span className="sr-only">Loading</span>
      </div>
    );
  }

  if (user) return <Navigate to={getRedirectPath(location)} replace />;

  return (
    <div className="auth-root fixed inset-0 z-[9999] overflow-hidden text-slate-900 antialiased" style={rootStyle}>
      <style>{css}</style>
      <Backdrop />

      <main className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-4 py-8">
          <div className="w-full max-w-[440px]">
            <div className="auth-card-in relative rounded-[32px] p-px">
              <div aria-hidden="true" className="absolute -inset-4 overflow-hidden rounded-[44px] opacity-40 blur-2xl">
                <div className="auth-spin absolute -inset-[60%]" style={ring} />
              </div>
              <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[32px]">
                <div className="auth-spin absolute -inset-[60%]" style={ring} />
              </div>

              <div className="relative rounded-[31px] bg-white/85 px-7 pb-8 pt-4 shadow-[0_40px_90px_-24px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-white/60 backdrop-blur-2xl sm:px-10 sm:pb-10">
                <div className="mb-8 text-center">
                  <img src={churchLogo} alt="Machaira" width="240" height="240" decoding="async" fetchpriority="high" className="mx-auto -mb-16 block h-60 w-60 object-contain" />
                  <h1 className="auth-rise text-[12px] leading-tight tracking-tight text-slate-900 sm:text-[15px]" style={{ "--d": ".4s" }}>We are excited to have you join the unstoppable chariots of Impact.</h1>
                <br />  <p className="auth-rise mx-auto mt-2.5 max-w-[300px] text-[12px] leading-relaxed text-slate-500" style={{ "--d": ".5s" }}>Kindly shoose an account to continue</p>
                </div>
                <div className="auth-rise" style={{ "--d": ".6s" }}>
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AuthPage;