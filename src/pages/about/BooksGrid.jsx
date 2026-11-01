import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ref1 from "../../assets/images/ref1.png";
import ref2 from "../../assets/images/ref2.png";
import phot from "../../assets/images/phot.png";


export default function BooksGrid() {
  const books = [
    {
      slug: "photizo",
      title: "Photizo",
      subtitle: "Alpha Edition",
      price: "GHS 200.00",
      image: phot,
      body: "Our efficiency and increase in God depend on knowing His Word. This knowledge will cause you to experience God more deeply. The Word of God is the mind of God declared or revealed. When you come into contact with THE WORD, the WORD brings you to light. Yes! You experience true liberty and rest, with doubt and fear having no place, and no uncertain wind of doctrine will be able to toss you to and fro. Knowing God’s Word illuminates your world.\n\n“The unfolding of Your [glorious] words give light; Their unfolding gives understanding to the simple (childlike)”\n\n(Psalm 119:130 (Amplified Bible))\n\nWhen God’s written words are unfolded or explained, they become edible. The Word of His Grace nourishes you unto maturity, and your eyes are open to the reality of life. God and His ways are no longer complex. We can now see His eternal Plan and Purpose for our enjoyment. His unfolded word lights up our minds. And it was why the apostles of our Lord Jesus did not relent in teaching and preaching the Word of Truth.\n\nPaul (an apostle of Jesus) wrote: “Unto me, who am less than the least of all saints, is this grace given, that I should preach among the Gentiles the unsearchable riches of Christ; And to make all men see what is the fellowship of the mystery, which from the beginning of the world hath been hid in God, who created all things by Jesus Christ”\n\nEphesians 3:8-9 (KJV)\n\nAmazing!\n\nThe Apostle’s preaching is “TO MAKE ALL SEE”. He chose the Greek word “Photizo.”\n\nAccording to Thayer’s Greek Lexicon Phōtizō (G5461) means:\n- to give light, to shine\n- to enlighten, light up, illuminate\n- to bring to light, render evident\n- to bring something into existence and thus make it visible and clear to all.\n- to enlighten, spiritually, imbue with saving knowledge\n- to instruct, inform, and teach\n- to give understanding to\n\nStrong’s Definition: From G5457; to shed rays, that is, to shine or (transitively) to brighten up (literally or figuratively): enlighten, illuminate, (bring to, give) light, make to see.\n\nBeloved, you are enlightened when the glorious Word of Truth enters or unfolds to you. You come to a place of complete understanding. You are enlightened and illuminated. Life no longer becomes a mystery; instead, you begin to express or make known the quality of life.\n\nBeing enlightened is essential; thus, Apostle Paul included it in his prayers for the saints in Ephesus.\n\n“The eyes of your understanding being enlightened; that ye may know what is the hope of his calling, and what the riches of the glory of his inheritance in the saints,”\n\n(Ephesians 1:18 (KJV))",
    },
    {
      slug: "machaira-edition-1",
      title: "Machaira with Apostle Bennie",
      subtitle: "Refulgence Edition 1",
      price: "GHS 25.00",
      image: ref1,
      body: "There can be no growth or transformation without the proper knowledge, revelation, and understanding of the Word of God. God brought forth the physical universe through His Word. Thus, to establish a consistent and impactful worldview, you will need to handle the reality of the Word of God. The reality of the Word is to help shape your worldview and make you rightly express God. Machaira (pronounced makh’-ahee-rah) is a Greek word that means a dagger or a sword used for combat.\n\n Thus, MACHAIRA with Apostle Bennie is a sword of the Spirit, which cuts deep into your heart and being. It’s a double-edged sword designed to thrust deep into your heart with divine insights. It demystifies enigmas, dissolves complex sentences in scriptures, and uproots misconceptions. It is one of the spiritual nutritional packs for your growth in the knowledge of God in Christ. Machaira with Apostle Bennie is a treasure chest for your enrichment and a tool designed to equip you to fulfil your divine purpose. Machaira (pronounced makh’ahee-rah) with Apostle Bennie is designed to serve you with the reality of the Word.\n\n This is a daily revelatory thought to sharpen you and help you grow in deep spiritual understanding and knowledge. It has scriptures for your daily meditation. And daily Apostolic-Prophetic prayers.\n\n However, this Word-study material is for 15 weeks; you must engage each topic weekly in outreaches, Bible studies, and team meetings.\n\n In this material, there is an indication of all scripture quotations. Enjoy this Kingdom reality pack as you walk in your blessedness in Christ.",
    },
    {
      slug: "machaira-edition-2",
      title: "Machaira with Apostle Bennie",
      subtitle: "Refulgence Edition 2",
      price: "GHS 25.00",
      image: ref2,
      body: "How you live is a picture of your mindset or worldview. The dimension of light you possess becomes the frame of your worldview or mindset. There is no more excellent light than the reality or wisdom of God. The Word of God is the aggregation of the wisdom of God or the light of God. The teaching and administration of the Word give light to every person who needs to it. “The teaching of your word gives light, so even the simple can understand.” Psalm 119:130 (New Living Translation - NLT) It demystifies enigmas, dissolves complex sentences in scriptures, and uproots misconceptions. It is one of the spiritual nutritional packs for your growth in the knowledge of God in Christ. Machaira with Apostle Bennie is a treasure chest for your enrichment and a toolbox designed to equip you to fulfil your divine purpose. This material includes an indication of all scripture quotations. Enjoy this Kingdom reality pack as you walk in your blessedness in Christ. Machaira (pronounced makh’-ahee-rah) with Apostle Bennie is a daily revelatory thought to sharpen you and help you grow in deep spiritual understanding and knowledge. It has scriptures for your daily meditation. And daily Apostolic-Prophetic prayers. However, this Word-study material in your hand is for 15 weeks; you must engage each topic weekly in Outreaches, Bible studies, and Team or Group meetings. It demystifies enigmas, dissolves complex sentences in scriptures, and uproots misconceptions. It is one of the spiritual nutritional packs for your growth in the knowledge of God in Christ. Machaira with Apostle Bennie is a treasure chest for your enrichment and a toolbox designed to equip you to fulfil your divine purpose.\n\n This material includes an indication of all scripture quotations. Enjoy this Kingdom reality pack as you walk in your blessedness in Christ.",
    },
  ];

  const [activeBookIndex, setActiveBookIndex] = useState(null);
  const [activeStory, setActiveStory] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!isExpanded) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
        setActiveStory(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isExpanded]);

  const handleBookClick = (book) => {
    setActiveStory(book);
    setQuantity(1);
    setIsExpanded(true);
  };

  const handleCloseReader = () => {
    setIsExpanded(false);
    setActiveStory(null);
  };

  const handleOrder = () => {
    if (!activeStory) return;

    const price = Number(activeStory.price.replace(/[^\d.]/g, ""));
    const total = (price * quantity).toFixed(2);

    const message = [
      "Hello, I would like to order a book from The Machaira Library.",
      "",
      `Book: ${activeStory.title}`,
      `Edition: ${activeStory.subtitle}`,
      `Price per copy: ${activeStory.price}`,
      `Quantity: ${quantity}`,
      `Estimated total: GHS ${total}`,
      "",
      "Please confirm availability and share the payment and delivery or collection details.",
    ].join("\n");

    const whatsappUrl = `https://wa.me/233596355972?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20">
      <div className="mx-auto max-w-360 px-6 lg:px-12">
        {/* Intro */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-navy-dark sm:text-3xl lg:text-4xl">
            A library where{" "}
            <span className="text-burgundy-primary">men are made.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-[#6d6260] sm:text-sm">
            Unveil eternity stitched into words, the extraordinary,
            soul-reforming manuscripts by Apostle Benjamin Nana Amissah Ansah.
          </p>
        </div>

        {/* Books Grid */}
        <div className="mt-12 grid items-start gap-8 sm:grid-cols-3 sm:gap-6 lg:mt-16 lg:gap-10">
          {books.map((book, index) => {
            const isActive = activeBookIndex === index;
            const isInactive = activeBookIndex !== null && !isActive;

            return (
              <motion.div
                key={book.slug}
                onMouseEnter={() => setActiveBookIndex(index)}
                onMouseLeave={() => setActiveBookIndex(null)}
                onClick={() => handleBookClick(book)}
                animate={{
                  y: isActive ? -8 : 0,
                  opacity: isInactive ? 0.7 : 1,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-[#eee7e1] shadow-md transition-all duration-300 group-hover:shadow-2xl">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>

                <div className="mt-5">
                  {book.edition && (
                    <span className="mb-1 block text-[8px] font-bold uppercase tracking-[0.2em] text-burgundy-primary">
                      {book.edition}
                    </span>
                  )}
                  <h3 className="text-sm font-bold text-navy-dark sm:text-base">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#6d6260]">
                    {book.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Premium Book Reader */}
      <AnimatePresence>
        {isExpanded && activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9999] flex flex-col overflow-hidden bg-[#faf9f7] text-[#252321]"
          >
            {/* Header: text removed, original space retained */}
            <header className="relative z-10 flex shrink-0 items-center justify-between border-b border-[#e8e3dd] bg-white px-5 py-3 sm:px-8">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-burgundy-primary"></p>
                <p className="mt-0.5 text-xs text-[#77716c]"></p>
              </div>

              <button
                type="button"
                onClick={handleCloseReader}
                aria-label="Close book reader"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e5dfd8] bg-[#f7f4f0] text-base text-[#393431] transition-colors hover:bg-[#eee7e1]"
              >
                ✕
              </button>
            </header>

            {/* Reader Workspace */}
            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-12 lg:overflow-hidden">
              {/* Book Showcase and Purchase */}
              <aside className="flex flex-col gap-6 border-b border-[#e8e3dd] bg-[#f4f0eb] p-5 sm:p-8 lg:col-span-4 lg:gap-5 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-8 xl:p-10">
                <div className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-sm">
                  <div className="group relative overflow-hidden rounded-xl border border-[#e3dbd2] bg-[#eee7e1] shadow-lg">
                    <img
                      src={activeStory.image}
                      alt={activeStory.title}
                      className="h-64 w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02] sm:h-72 lg:h-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/75">
                        {activeStory.subtitle}
                      </p>
                      <h2 className="text-xl font-semibold leading-snug">
                        {activeStory.title}
                      </h2>
                    </div>
                  </div>

                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#77716c]">
                        Edition
                      </p>
                      <p className="mt-1 text-sm font-medium text-[#332f2e]">
                        {activeStory.subtitle}
                      </p>
                    </div>
                    <p className="text-xl font-semibold text-navy-dark">
                      {activeStory.price}
                    </p>
                  </div>
                </div>

                {/* Purchase Panel */}
                <div className="mx-auto w-full max-w-xs rounded-xl border border-[#e6e0d9] bg-white p-4 sm:p-5 lg:mx-0 lg:max-w-none">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#332f2e]">
                        Your copy
                      </p>
                      <p className="mt-0.5 text-xs text-[#77716c]">
                        Select the quantity
                      </p>
                    </div>

                    <div className="flex items-center overflow-hidden rounded-lg border border-[#e4ddd5] bg-[#faf8f5]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          setQuantity((current) => Math.max(1, current - 1))
                        }
                        className="px-3 py-2 text-sm transition-colors hover:bg-[#eee7e1]"
                      >
                        −
                      </button>

                      <span className="min-w-8 text-center text-sm font-medium">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity((current) => current + 1)}
                        className="px-3 py-2 text-sm transition-colors hover:bg-[#eee7e1]"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between border-t border-[#eee8e1] pt-3">
                    <span className="text-xs text-[#77716c]">Total</span>
                    <span className="text-base font-semibold text-navy-dark">
                      GHS{" "}
                      {(
                        Number(activeStory.price.replace(/[^\d.]/g, "")) *
                        quantity
                      ).toFixed(2)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOrder}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-burgundy-primary px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-[#7f1010]"
                  >
                    Purchase
                  </button>

                  <p className="mt-3 text-center text-[10px] leading-relaxed text-[#827a73]">
                    Can only be purchased via whatsapp. 
                  </p>
                </div>
              </aside>

              {/* Reading Area */}
              <main className="min-h-0 bg-white px-5 py-8 sm:px-9 sm:py-10 lg:col-span-8 lg:overflow-y-auto lg:px-12 lg:py-10 xl:px-16">
                <article className="mx-auto w-full max-w-3xl">
                  <div className="mb-7 border-b border-[#e8e3dd] pb-5 sm:mb-8">
                    {/* "From the collection" removed; space retained */}
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-burgundy-primary"></p>

                    <h1 className="text-2xl font-semibold leading-snug tracking-tight text-navy-dark sm:text-3xl lg:text-4xl">
                      {activeStory.title}
                    </h1>

                    <p className="mt-2 text-sm text-[#77716c]">
                      {activeStory.subtitle}
                    </p>
                  </div>

                  <div className="space-y-6 text-sm leading-8 text-[#403b37] sm:text-base sm:leading-8">
                    {activeStory.body
                      .replace(/\\n/g, "\n")
                      .split(/\n\s*\n/)
                      .map((paragraph, index) => {
                        const trimmedParagraph = paragraph.trim();
                        if (!trimmedParagraph) return null;

                        return (
                          <p
                            key={`${activeStory.slug}-${index}`}
                            className={
                              index === 0
                                ? "first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-5xl first-letter:font-semibold first-letter:leading-[0.85] first-letter:text-burgundy-primary sm:first-letter:text-6xl"
                                : ""
                            }
                          >
                            {trimmedParagraph}
                          </p>
                        );
                      })}
                  </div>

                  <div className="mt-10 border-t border-[#e8e3dd] pt-5">
                    <div className="flex items-center justify-between gap-4">
                      {/* Footer text removed; spaces retained */}
                      <p className="text-xs font-medium text-[#77716c]"></p>
                      <span className="h-px flex-1 bg-[#e8e3dd]" />
                      <p className="text-[10px] uppercase tracking-[0.16em] text-burgundy-primary"></p>
                    </div>
                  </div>
                </article>
              </main>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
