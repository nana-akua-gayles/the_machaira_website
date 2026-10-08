function DevotionalContent({ parsed, fallbackContent }) {
  if (!parsed) {
    if (fallbackContent) {
      return (
        <div className="devotional-content whitespace-pre-line">
          {fallbackContent}
        </div>
      );
    }

    return (
      <p className="text-[#6B7280]">
        The content for this devotional is not available yet.
      </p>
    );
  }

  // parsed.mainContent now arrives already fully formatted by
  // parseDevotionalContent.js (scripture refs bolded, dash/numbered/
  // lettered lists converted to real <ul>/<ol>, paragraph chunking
  // applied) -- no further processing needed here before rendering.
  const { memoryVerse, mainContent } = parsed;

  return (
    <div className="devotional-content">
      {/*
        Styles for the elements parseDevotionalContent.js's body-
        formatting stage generates inside .devotional-article-body:
        bolded scripture references, converted dash/numbered/lettered
        lists, paragraphs, and blockquote asides. Colors match the
        site's existing burgundy/navy palette used elsewhere (see
        .devotional-prev-next-label etc. in devotional.css, and the
        Tailwind burgundy-primary/navy-dark classes used in
        DevotionalReader.jsx). Kept inline here (rather than as a
        separate CSS file) so this component stays self-contained.
      */}
      <style>{`
        .devotional-article-body p {
          margin: 0 0 1.5rem;
        }

        .devotional-article-body strong {
          font-weight: 700;
          color: #1a2b4a;
        }

        .devotional-article-body ul,
        .devotional-article-body ol {
          margin: 0 0 1.5rem;
          padding-left: 1.4rem;
        }

        .devotional-article-body ul {
          list-style-type: disc;
        }

        .devotional-article-body ol {
          list-style-type: decimal;
        }

        .devotional-article-body li {
          margin-bottom: 0.6rem;
          line-height: 1.8;
        }

        .devotional-article-body blockquote {
          margin: 1.75rem 0;
          padding: 1rem 1.25rem;
          border-left: 4px solid #991313;
          background-color: #FBF8F6;
          border-radius: 0.5rem;
          font-style: italic;
          color: #374151;
        }

        .devotional-article-body a {
          color: #991313;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .devotional-article-body a:hover {
          color: #7f0e0e;
        }
      `}</style>

      {memoryVerse && (
        <blockquote className="devotional-memory-verse">
          {memoryVerse.text}
          {memoryVerse.citation && (
            <cite className="devotional-memory-verse-citation">
              {memoryVerse.citation}
            </cite>
          )}
        </blockquote>
      )}

      <div
        className="devotional-article-body"
        dangerouslySetInnerHTML={{
          __html: mainContent,
        }}
      />
    </div>
  );
}

export default DevotionalContent;
