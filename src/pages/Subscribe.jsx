
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const initialForm = {
  fullName: "",
  email: "",
  phoneCode: "+233",
  phone: "",
  whatsappCode: "+233",
  whatsapp: "",
  whatsappSameAsPhone: false,
  country: "Ghana",
  city: "",
  occupation: "",
  interests: [],
  discovery: "",
  consent: false,
};

const countryCodes = [
  { name: "Ghana", code: "+233" },
  { name: "Nigeria", code: "+234" },
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "South Africa", code: "+27" },
  { name: "Kenya", code: "+254" },
  { name: "Uganda", code: "+256" },
  { name: "Australia", code: "+61" },
  { name: "Germany", code: "+49" },
  { name: "Other", code: "" },
];

const countries = [
  "Ghana",
  "Nigeria",
  "United States",
  "United Kingdom",
  "Canada",
  "South Africa",
  "Kenya",
  "Uganda",
  "Australia",
  "Germany",
  "Other",
];

const interests = [
  "Daily devotionals",
  "Teachings and messages",
  "Ministry news and updates",
  "Events and programmes",
];

const inputClass =
  "w-full rounded-lg border border-[#E7E2DF] bg-white px-4 py-3 text-sm text-[#292323] outline-none transition duration-200 placeholder:text-[#A49B98] focus:border-[#721F22] focus:ring-2 focus:ring-[#721F22]/10";

const labelClass = "mb-2 block text-sm font-medium text-[#352A2A]";

export default function Subscribe() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const update = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setStatus("idle");
    setMessage("");
  };

  const toggleInterest = (interest) => {
    setForm((previous) => ({
      ...previous,
      interests: previous.interests.includes(interest)
        ? previous.interests.filter((item) => item !== interest)
        : [...previous.interests, interest],
    }));

    setStatus("idle");
    setMessage("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status === "loading") return;

    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();

    if (!fullName) {
      setStatus("error");
      setMessage("Please enter your full name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    if (!phone) {
      setStatus("error");
      setMessage("Please enter your phone number.");
      return;
    }

    if (!form.consent) {
      setStatus("error");
      setMessage("Please confirm that you agree to receive updates.");
      return;
    }

    const whatsapp = form.whatsappSameAsPhone
      ? phone
      : form.whatsapp.trim();

    const whatsappCode = form.whatsappSameAsPhone
      ? form.phoneCode
      : form.whatsappCode;

    const subscriber = {
      full_name: fullName,
      email,
      phone_country_code: form.phoneCode || null,
      phone,
      whatsapp_country_code: whatsappCode || null,
      whatsapp: whatsapp || null,
      whatsapp_same_as_phone: form.whatsappSameAsPhone,
      country: form.country || null,
      city: form.city.trim() || null,
      occupation: form.occupation.trim() || null,
      interests: form.interests,
      discovery: form.discovery || null,
      consent: true,
      consent_at: new Date().toISOString(),
    };

    setStatus("loading");
    setMessage("");

    try {
      const { error } = await supabase
        .from("subscribers")
        .insert([subscriber]);

      if (error) {
  console.error("Subscription error details:", {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
    status: error.status,
  });

        if (error.code === "23505") {
          setStatus("error");
          setMessage(
            "This email address is already subscribed. Please use another email address."
          );
          return;
        }

        if (error.code === "42501") {
          setStatus("error");
          setMessage(
            "We couldn't submit your registration because of a database permission issue. Please try again later."
          );
          return;
        }

        setStatus("error");
        setMessage(
          "We couldn't complete your registration. Please try again."
        );
        return;
      }

      setStatus("success");
      setMessage(
        "You're successfully registered! Thank you for staying connected with Machaira."
      );

      setForm(initialForm);
    } catch (error) {
      console.error("Unexpected subscription error:", error);

      setStatus("error");
      setMessage(
        "Something went wrong. Please check your connection and try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <style>{`
        @keyframes machairaIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .machaira-in {
          animation: machairaIn .75s ease both;
        }

        .machaira-delay {
          animation: machairaIn .75s ease .15s both;
        }

        .machaira-form {
          animation: machairaIn .8s ease .1s both;
        }

        @media (prefers-reduced-motion: reduce) {
          .machaira-in,
          .machaira-delay,
          .machaira-form {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl overflow-hidden rounded-2xl bg-white shadow-[0_12px_55px_rgba(50,25,25,0.07)] lg:grid-cols-[0.85fr_1.15fr]">
        {/* Intro panel */}
        <section className="flex flex-col justify-between bg-[#4A1515] px-7 py-10 text-white sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="machaira-in">
            <div className="mt-16 max-w-md lg:mt-24">
              <h1 className="text-4xl font-semibold leading-[1.15] tracking-tight sm:text-5xl">
                Stay connected.
                <span className="mt-1 block text-[#E9B9A9]">
                  Stay inspired.
                </span>
              </h1>

              <p className="mt-7 max-w-sm text-base leading-8 text-white/80">
                Get updates from Machaira, be the first to know about new
                episodes uploads, and keep up with messages and activities
                from Apostle Bennie.
              </p>
            </div>
          </div>
        </section>

        {/* Subscription form */}
        <section className="machaira-form px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="mx-auto max-w-xl">
            <div className="mb-9">
              <h2 className="text-3xl font-semibold tracking-tight text-[#2D2525] sm:text-4xl">
                Let’s keep in touch.
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal information */}
              <div>
                <h3 className="mb-5 text-base font-semibold text-[#352A2A]">
                  Your details
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <input
                      type="text"
                      autoComplete="name"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                      placeholder="Enter your full name"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EEE9E6]" />

              {/* Contact information */}
              <div>
                <h3 className="mb-5 text-base font-semibold text-[#352A2A]">
                  Contact information
                </h3>

                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Phone Number</label>

                    <div className="flex items-stretch gap-2">
                      <select
                        value={form.phoneCode}
                        onChange={(e) => update("phoneCode", e.target.value)}
                        className="w-[90px] shrink-0 rounded-lg border border-[#E7E2DF] bg-white px-2 py-3 text-sm text-[#292323] outline-none focus:border-[#721F22] focus:ring-2 focus:ring-[#721F22]/10"
                        aria-label="Phone country code"
                      >
                        {countryCodes.map((item) => (
                          <option key={item.name} value={item.code}>
                            {item.code || item.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        autoComplete="tel-national"
                        value={form.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="Phone number"
                        className={`${inputClass} min-w-0 flex-1`}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>WhatsApp Number</label>

                    <div className="flex items-stretch gap-2">
                      <select
                        value={
                          form.whatsappSameAsPhone
                            ? form.phoneCode
                            : form.whatsappCode
                        }
                        onChange={(e) => update("whatsappCode", e.target.value)}
                        disabled={form.whatsappSameAsPhone}
                        className="w-[90px] shrink-0 rounded-lg border border-[#E7E2DF] bg-white px-2 py-3 text-sm text-[#292323] outline-none transition focus:border-[#721F22] focus:ring-2 focus:ring-[#721F22]/10 disabled:bg-[#F5F3F2]"
                        aria-label="WhatsApp country code"
                      >
                        {countryCodes.map((item) => (
                          <option key={item.name} value={item.code}>
                            {item.code || item.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="tel"
                        value={
                          form.whatsappSameAsPhone
                            ? form.phone
                            : form.whatsapp
                        }
                        onChange={(e) => update("whatsapp", e.target.value)}
                        disabled={form.whatsappSameAsPhone}
                        placeholder="WhatsApp number"
                        className={`${inputClass} min-w-0 flex-1 disabled:bg-[#F5F3F2]`}
                      />
                    </div>

                    <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-[#77706D]">
                      <input
                        type="checkbox"
                        checked={form.whatsappSameAsPhone}
                        onChange={(e) =>
                          update("whatsappSameAsPhone", e.target.checked)
                        }
                        className="h-4 w-4 accent-[#721F22]"
                      />
                      My WhatsApp number is the same as my phone number.
                    </label>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#EEE9E6]" />

              {/* Location */}
              <div>
                <h3 className="mb-5 text-base font-semibold text-[#352A2A]">
                  Where are you based?
                </h3>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Country</label>
                    <select
                      value={form.country}
                      onChange={(e) => update("country", e.target.value)}
                      className={inputClass}
                    >
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Your city"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label className={labelClass}>Occupation (Optional)</label>
                  <input
                    type="text"
                    value={form.occupation}
                    onChange={(e) => update("occupation", e.target.value)}
                    placeholder="What do you do?"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="border-t border-[#EEE9E6]" />

              {/* Interests */}
              <div>
                <h3 className="text-base font-semibold text-[#352A2A]">
                  What would you like to receive?
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#77706D]">
                  Choose the updates you'd like to hear about.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {interests.map((interest) => (
                    <label
                      key={interest}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-sm transition duration-200 ${
                        form.interests.includes(interest)
                          ? "border-[#721F22] bg-[#721F22]/5 text-[#721F22]"
                          : "border-[#E7E2DF] text-[#5F5754] hover:border-[#B98A87]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={form.interests.includes(interest)}
                        onChange={() => toggleInterest(interest)}
                        className="h-4 w-4 accent-[#721F22]"
                      />
                      {interest}
                    </label>
                  ))}
                </div>
              </div>

              {/* Discovery */}
              <div>
                <label className={labelClass}>
                  How did you hear about Machaira? (Optional)
                </label>

                <select
                  value={form.discovery}
                  onChange={(e) => update("discovery", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select an option</option>
                  <option value="Social media">Social media</option>
                  <option value="Church">Church</option>
                  <option value="Friend or family">Friend or family</option>
                  <option value="Website">Website</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Consent */}
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#77706D]">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => update("consent", e.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#721F22]"
                  required
                />
                <span>
                  I agree to receive emails and updates from Machaira. I
                  understand that I can unsubscribe at any time.
                </span>
              </label>

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-lg px-4 py-3 text-sm leading-6 ${
                    status === "success"
                      ? "bg-[#EDF5EE] text-[#315B39]"
                      : "bg-[#FBEDEC] text-[#8C2929]"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-lg bg-[#721F22] px-6 py-4 text-sm font-semibold text-white transition duration-300 hover:bg-[#4A1515] focus:outline-none focus:ring-2 focus:ring-[#721F22] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Submitting..." : "Subscribe"}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
