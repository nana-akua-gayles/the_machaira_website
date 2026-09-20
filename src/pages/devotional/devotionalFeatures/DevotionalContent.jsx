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

  const { titleText, memoryVerse, mainContent } = parsed;

  return (
    <div className="devotional-content">
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