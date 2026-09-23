import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { X, Upload, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  uploadTestimonyImage,
  createTestimony,
} from "../lib/testimoniesService";

const CATEGORY_OPTIONS = [
  "Faith",
  "Healing",
  "Breakthrough",
  "Provision",
  "Deliverance",
  "Purpose",
  "Other",
];

const MAX_CONTENT = 1200;

export default function ShareTestimonyModal({ isOpen, onClose, onSuccess }) {
  const { user, loading: authLoading } = useAuth();

  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const fileInputRef = useRef(null);

  // ----- Reset state whenever modal opens -----
  useEffect(() => {
    if (!isOpen) return;
    setCategory("");
    setContent("");
    setIsAnonymous(false);
    setImageFile(null);
    setImagePreview(null);
    setSubmitting(false);
    setErrorMsg("");
    setFieldErrors({});
  }, [isOpen]);

  // ----- Lock body scroll -----
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ----- Escape to close (unless mid-submit) -----
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, submitting, onClose]);

  if (!isOpen) return null;

  const isLoggedIn = !!user;

  // ----- Image picker -----
  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({ ...prev, image: "Only image files are allowed." }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFieldErrors((prev) => ({ ...prev, image: "Image must be smaller than 5MB." }));
      return;
    }

    setFieldErrors((prev) => ({ ...prev, image: "" }));
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ----- Validation -----
  function validate() {
    const errs = {};
    if (!category) errs.category = "Please choose a category.";
    if (!content.trim()) errs.content = "Please write your testimony.";
    else if (content.trim().length < 20)
      errs.content = "Please write at least 20 characters.";
    else if (content.length > MAX_CONTENT)
      errs.content = `Please keep it under ${MAX_CONTENT} characters.`;

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // ----- Submit -----
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!validate() || !user) return;

    setSubmitting(true);

    try {
      let attached_image_url = null;

      if (imageFile) {
        const { url, error: uploadError } = await uploadTestimonyImage(
          imageFile,
          user.id
        );
        if (uploadError) {
          setErrorMsg("We couldn't upload your image. Please try again.");
          setSubmitting(false);
          return;
        }
        attached_image_url = url;
      }

      const { data, error } = await createTestimony({
        user_id: user.id,
        category,
        content: content.trim(),
        attached_image_url,
        is_anonymous: isAnonymous,
      });

      if (error) {
        setErrorMsg("We couldn't post your testimony. Please try again.");
        setSubmitting(false);
        return;
      }

      onSuccess?.(data);
      onClose();
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1c0c09]/55 backdrop-blur-md animate-[fadeIn_.25s_ease-out]"
        onClick={() => !submitting && onClose()}
      />

      {/* Card */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-[640px] flex-col overflow-hidden rounded-[28px] bg-[#fdfaf7] shadow-[0_30px_80px_rgba(42,17,14,0.35)] ring-1 ring-white/90 animate-[modalIn_.35s_cubic-bezier(0.16,1,0.3,1)]">

        {/* Ambient glow */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#991313]/8 blur-[70px]" />

        {/* Header */}
        <div className="relative flex items-start justify-between gap-4 border-b border-[#f0e4db]/80 px-6 py-5 sm:px-8 sm:py-6">
          <div className="min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#991313]">
              Testimonies
            </span>
            <h2 className="mt-1 font-serif text-[1.5rem] leading-tight tracking-[-0.02em] text-[#101A2B] sm:text-[1.75rem]">
              Share your <span className="italic text-[#991313]">story</span>
            </h2>
            <p className="mt-1 text-[13px] leading-6 text-[#4D5057]">
              What has God done in your life? Someone needs to hear it.
            </p>
          </div>

          <button
            type="button"
            onClick={() => !submitting && onClose()}
            aria-label="Close"
            disabled={submitting}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/5 text-[#101A2B]/60 backdrop-blur-md transition-all duration-200 hover:rotate-90 hover:bg-black/10 hover:text-[#101A2B] disabled:opacity-40"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="relative flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-7 custom-scrollbar">

          {/* ============ AUTH STILL LOADING ============ */}
          {authLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-[#991313]" />
              <p className="mt-3 text-sm text-[#6B7280]">Checking your session…</p>
            </div>
          )}

          {/* ============ NOT LOGGED IN ============ */}
          {!authLoading && !isLoggedIn && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FBF1F1]">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#991313"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3z" />
                </svg>
              </div>

              <p className="mt-5 font-serif text-xl text-[#101A2B]">
                Please sign in to share
              </p>
              <p className="mt-2 max-w-[320px] text-sm leading-6 text-[#4D5057]">
                We keep testimonies tied to real accounts so our community
                stays genuine. Your identity can still be hidden.
              </p>

              <Link
                to="/login"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#991313] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#7F0E0E]"
              >
                Sign In
              </Link>
            </div>
          )}

          {/* ============ LOGGED IN ============ */}
          {!authLoading && isLoggedIn && (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#101A2B]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={submitting}
                  className={`w-full appearance-none rounded-xl border bg-white px-4 py-3 text-sm text-[#101A2B] outline-none transition-colors focus:border-[#991313] disabled:opacity-60 ${
                    fieldErrors.category ? "border-[#991313]" : "border-[#E5E7EB]"
                  }`}
                >
                  <option value="">Choose a category…</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {fieldErrors.category && (
                  <p className="mt-1.5 text-xs text-[#991313]">
                    {fieldErrors.category}
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="block text-sm font-medium text-[#101A2B]">
                    Your testimony
                  </label>
                  <span
                    className={`text-xs ${
                      content.length > MAX_CONTENT
                        ? "text-[#991313]"
                        : "text-[#6B7280]"
                    }`}
                  >
                    {content.length}/{MAX_CONTENT}
                  </span>
                </div>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={submitting}
                  rows={7}
                  placeholder="Tell us what God has done…"
                  className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-sm leading-6 text-[#101A2B] placeholder:text-[#B9BEC8] outline-none transition-colors focus:border-[#991313] disabled:opacity-60 ${
                    fieldErrors.content ? "border-[#991313]" : "border-[#E5E7EB]"
                  }`}
                />
                {fieldErrors.content && (
                  <p className="mt-1.5 text-xs text-[#991313]">
                    {fieldErrors.content}
                  </p>
                )}
              </div>

              {/* Image upload */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#101A2B]">
                  Add an image{" "}
                  <span className="font-normal text-[#6B7280]">(optional)</span>
                </label>

                {!imagePreview ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E5E7EB] bg-white px-4 py-6 text-sm text-[#6B7280] transition-colors hover:border-[#991313] hover:text-[#991313] disabled:opacity-60"
                  >
                    <Upload className="h-4 w-4" />
                    Click to upload an image
                  </button>
                ) : (
                  <div className="relative overflow-hidden rounded-xl border border-[#E5E7EB]">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-[240px] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={clearImage}
                      disabled={submitting}
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 disabled:opacity-60"
                      aria-label="Remove image"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {fieldErrors.image && (
                  <p className="mt-1.5 text-xs text-[#991313]">
                    {fieldErrors.image}
                  </p>
                )}
              </div>

              {/* Anonymous toggle */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 transition-colors hover:border-[#D7B4B4]">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  disabled={submitting}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#991313]"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#101A2B]">
                    Post anonymously
                  </p>
                  <p className="mt-0.5 text-xs leading-5 text-[#6B7280]">
                    Your name and photo will be hidden. Your testimony will be
                    labeled "Anonymous".
                  </p>
                </div>
              </label>

              {/* Global error */}
              {errorMsg && (
                <div className="rounded-xl border border-[#991313]/30 bg-[#FBF1F1] px-4 py-3 text-sm text-[#991313]">
                  {errorMsg}
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer (only when logged in and ready) */}
        {!authLoading && isLoggedIn && (
          <div className="relative border-t border-[#f0e4db]/80 bg-[#fdfaf7] px-6 py-4 sm:px-8 sm:py-5">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-[#E5E7EB] px-5 py-2.5 text-sm font-medium text-[#4D5057] transition-colors hover:border-[#991313] hover:text-[#991313] disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#991313] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7F0E0E] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting…
                  </>
                ) : (
                  "Share Testimony"
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #eadcd6;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}