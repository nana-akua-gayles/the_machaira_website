import AuthHeroPanel from "./authFeatures/AuthHeroPanel";
import LoginForm from "./authFeatures/LoginForm";
import { ShieldIcon } from "./authFeatures/authIcons";

function AuthPage() {
  return (
    <main className="min-h-screen bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">

        <div className="grid grid-cols-1 overflow-hidden rounded-[32px] bg-white shadow-sm lg:grid-cols-2">
          <AuthHeroPanel
            heading={
              <>
                Welcome Back <br />
                to the <span className="text-[#991313]">Family</span>
              </>
            }
            subtitle="Sign in to continue your faith journey, access exclusive content, and stay connected with our community."
          />

          <div className="flex items-center justify-center bg-white px-8 py-10 lg:px-14 lg:py-14">
            <LoginForm />
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