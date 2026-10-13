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
  const { memoryVerse, mainContent } = parsed;

  return (
    <div className="devotional-content">
      <style>{`
        .devotional-article-body p {
          margin: 0 0 1.25rem;
        }

        .devotional-article-body strong {
          font-weight: 500;
          color: #1a2b4a;
        }

        .devotional-article-body ul,
        .devotional-article-body ol {
          margin: 0 0 1.25rem;
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
          line-height: 1.5;
        }

        .devotional-article-body blockquote {
          margin: 1.75rem 0;
          padding: 1rem 1.25rem;
          border-left: 4px solid #991313;
          background-color: #FBF8F6;
          border-radius: 0.5rem;
          color: #374151;
        }

        .devotional-article-body a {
          color: #991313;
          font-weight: 500;
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
