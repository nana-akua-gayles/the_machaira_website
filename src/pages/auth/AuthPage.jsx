import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoginForm from "./authFeatures/LoginForm";
import churchLogo from "../../assets/images/Mlogo.png";

const motes = Array.from({ length: 10 }, (_, i) => ({ left: `${(i * 41 + 12) % 100}%`, size: 2 + (i % 2), delay: `${(i * 2.3) % 12}s`, dur: `${20 + (i % 5) * 5}s` }));

const ring = { background: "conic-gradient(from 0deg, transparent 0deg, transparent 200deg, #991313 260deg, #ff6b6b 310deg, #ffffff 345deg, transparent 360deg)" };

const css = `
@keyframes auth-drift-a{0%{transform:translate(0,0) scale(1)}100%{transform:translate(10vw,14vh) scale(1.2)}}
@keyframes auth-drift-b{0%{transform:translate(0,0) scale(1.1)}100%{transform:translate(-10vw,-12vh) scale(.9)}}
@keyframes auth-rays{to{transform:rotate(360deg)}}
@keyframes auth-breathe{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes auth-spin{to{transform:rotate(360deg)}}
@keyframes auth-card-in{from{opacity:0;transform:translateY(48px) scale(.94)}to{opacity:1;transform:none}}
@keyframes auth-rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:none}}
@keyframes auth-pop{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:none}}
@keyframes auth-ring{0%{transform:scale(.6);opacity:.7}100%{transform:scale(1.5);opacity:0}}
@keyframes auth-shine{to{background-position:200% center}}
@keyframes auth-sweep{0%{transform:translateX(-120%) skewX(-20deg)}60%,100%{transform:translateX(320%) skewX(-20deg)}}
@keyframes auth-float{0%{transform:translateY(0);opacity:0}15%,85%{opacity:1}100%{transform:translateY(-110vh);opacity:0}}
.auth-drift-a{animation:auth-drift-a 40s ease-in-out infinite alternate;will-change:transform}
.auth-drift-b{animation:auth-drift-b 50s ease-in-out infinite alternate;will-change:transform}
.auth-rays{animation:auth-rays 240s linear infinite;will-change:transform}
.auth-breathe{animation:auth-breathe 9s ease-in-out infinite}
.auth-spin{animation:auth-spin 7s linear infinite}
.auth-card-in{animation:auth-card-in 1.1s cubic-bezier(.2,.8,.2,1) backwards}
.auth-rise{animation:auth-rise .9s cubic-bezier(.2,.8,.2,1) var(--d,0s) backwards}
.auth-pop{animation:auth-pop .6s cubic-bezier(.2,1.2,.3,1) backwards}
.auth-ring{animation:auth-ring 2.8s ease-out infinite}
.auth-sweep{animation:auth-sweep 3.2s ease-in-out infinite}
.auth-float{animation:auth-float var(--dur) linear var(--delay) infinite}
.auth-shine-text{background:linear-gradient(110deg,#991313,#e0605f,#991313);background-size:200% auto;-webkit-background-clip:text;background-clip:text;color:transparent;animation:auth-shine 4s linear infinite}
@media (prefers-reduced-motion:reduce){.auth-root *{animation:none!important}}
`;

function AuthPage() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return (
    <div className="auth-root fixed inset-0 z-[9999] overflow-hidden text-slate-900" style={{ background: "radial-gradient(120% 90% at 50% 0%, #3a1a1f 0%, #1a0d10 60%, #0f0809 100%)" }}>
      <style>{css}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[18%] -translate-x-1/2 -translate-y-1/2">
          <div className="auth-rays h-[170vmax] w-[170vmax]" style={{ background: "repeating-conic-gradient(from 0deg, rgba(255,226,205,0.05) 0deg 5deg, transparent 5deg 15deg)", WebkitMaskImage: "radial-gradient(circle closest-side, #000 0%, transparent 55%)", maskImage: "radial-gradient(circle closest-side, #000 0%, transparent 55%)" }} />
        </div>
        <div className="auth-breathe absolute left-1/2 top-[-25%] h-[70vh] w-[70vw] -translate-x-1/2 rounded-full blur-[120px]" style={{ background: "radial-gradient(closest-side, rgba(255,226,205,0.28), transparent)" }} />
        <div className="auth-drift-a absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-burgundy-primary/30 blur-[120px]" />
        <div className="auth-drift-b absolute -bottom-48 -right-32 h-[560px] w-[560px] rounded-full bg-red-900/25 blur-[120px]" />
        {motes.map((p, i) => (
          <span key={i} className="auth-float absolute bottom-[-12px] rounded-full bg-white/30" style={{ left: p.left, width: p.size, height: p.size, "--delay": p.delay, "--dur": p.dur }} />
        ))}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.5) 100%)" }} />
      </div>

      <div className="absolute inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-4 py-8">
          <div className="w-full max-w-[420px]">
            <div className="auth-card-in relative rounded-[30px] p-[2px]">
              <div className="absolute -inset-3 overflow-hidden rounded-[40px] opacity-70 blur-xl">
                <div className="auth-spin absolute -inset-[60%]" style={ring} />
              </div>
              <div className="absolute inset-0 overflow-hidden rounded-[30px]">
                <div className="auth-spin absolute -inset-[60%]" style={ring} />
              </div>

              <div className="relative rounded-[28px] bg-white/80 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-2xl sm:p-9">
                <div className="mb-7 text-center">
                  <img src={churchLogo} alt="Machaira" className="mx-auto -mb-16 block h-60 w-60 object-contain" />
                  <h1 className="auth-rise text-2xl font-bold tracking-tight sm:text-[28px]" style={{ "--d": ".5s" }}>
                    Welcome Back <br />
                    <span className="auth-shine-text">to the Family</span>
                  </h1>
                  <p className="auth-rise mt-2 text-sm text-slate-500" style={{ "--d": ".6s" }}>Sign in to continue</p>
                </div>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;