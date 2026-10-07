import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const books = {
  photizo: {
    title: 'Photizo',
    subtitle: 'Life-Transforming Teachings',
    description:
      'A transformative collection of teachings designed to deepen your understanding of God, strengthen your faith, and reshape the way you live.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=900&auto=format&fit=crop',
  },
  'machaira-edition-1': {
    title: 'Machaira with Apostle Bennie',
    edition: 'EDITION 1',
    subtitle: "Walking in God's Power",
    description:
      "A powerful journey into understanding God's power and learning how to walk confidently in the reality of His presence.",
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=900&auto=format&fit=crop',
  },
  'machaira-edition-2': {
    title: 'Machaira with Apostle Bennie',
    edition: 'EDITION 2',
    subtitle: 'Discovering Your Divine Assignment',
    description:
      'A practical and inspiring exploration of purpose, helping you discover and embrace the assignment God has placed upon your life.',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=900&auto=format&fit=crop',
  },
};

export default function BookDetails() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const book = books[slug];

  if (!book) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-[#fdfaf7] px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-dark">Book not found</h1>
          <button
            onClick={() => navigate('/')}
            className="mt-5 text-xs font-bold uppercase tracking-wider text-burgundy-primary"
          >
            Back Home →
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#fdfaf7] py-10 sm:py-14">
      <div className="mx-auto max-w-360 px-6 lg:px-12">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="group mb-10 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#6d6260] transition-colors hover:text-burgundy-primary"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          Back to Library
        </button>

        {/* Book */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-20">

          {/* Image */}
          <div className="lg:col-span-5">
            <div className="mx-auto max-w-[430px] overflow-hidden bg-[#eee7e1] shadow-[0_25px_60px_rgba(45,20,15,0.16)]">
              <img
                src={book.image}
                alt={book.title}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>

          {/* Information */}
          <div className="lg:col-span-7">
            <div className="max-w-xl">

              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-burgundy-primary">
                The Library
              </span>

              {book.edition && (
                <p className="mt-5 text-[9px] font-bold uppercase tracking-[0.25em] text-burgundy-primary">
                  {book.edition}
                </p>
              )}

              <h1 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight text-navy-dark sm:text-5xl lg:text-6xl">
                {book.title}
              </h1>

              <p className="mt-4 text-lg italic text-burgundy-primary">
                {book.subtitle}
              </p>

              <div className="my-8 h-px w-16 bg-burgundy-primary" />

              <p className="max-w-lg text-sm leading-7 text-[#6d6260]">
                {book.description}
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <button className="group flex items-center gap-3 bg-burgundy-primary px-6 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:bg-[#74191d]">
                  Get a Copy
                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </button>

                <span className="text-[10px] uppercase tracking-[0.15em] text-[#6d6260]">
                  Physical Copy
                </span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}