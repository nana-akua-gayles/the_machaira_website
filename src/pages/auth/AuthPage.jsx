
import AuthHeroPanel from "./authFeatures/AuthHeroPanel";
import LoginForm from "./authFeatures/LoginForm";
import AuthWelcome from "./authFeatures/AuthWelcome";
import { ShieldIcon } from "./authFeatures/authIcons";

function AuthPage() {
  return (
    <main className="min-h-screen bg-white py-8 lg:py-10">
      <div className="mx-auto max-w-[1400px] px-4 lg:px-8">
        <div className="grid grid-cols-1 overflow-hidden rounded-4xl bg-white shadow-sm lg:grid-cols-2">
          <AuthHeroPanel
            heading={
              <>
                Welcome Back <br />
                to the{" "}
                <span className="text-burgundy-primary">
                  Family
                </span>
              </>
            }
            subtitle="Sign in to continue your faith journey, access exclusive content, and stay connected with our community."
          />

          {/* Login and welcome panel */}
          <div className="flex flex-col  bg-white px-6 py-10 sm:px-10 lg:px-12 lg:py-12">
            <div className="mx-auto w-full max-w-[430px]">
              <LoginForm />

              <AuthWelcome />
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-cool-gray">
          <ShieldIcon />
          Your data is secure with us. We value your privacy.
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
