import { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  HandCoins,
  HeartHandshake,
  Sprout,
} from 'lucide-react';
import './PartnershipMotion.css';

const paths = [
  {
    title: 'Give',
    kicker: '01 / SOW',
    Icon: HandCoins,
    text: 'Every word written is a seed sown into a soul. Your giving puts the word into the hands of thousands who may never meet us, but will meet God through it.',
    action: 'Give Now',
  },
  {
    title: 'Serve',
    kicker: '02 / BUILD',
    Icon: HeartHandshake,
    text: 'Outpouring needs hands, not just hearts. Lend your time, your voice, your platform and help us carry this Gospel of our Lord to the nations!',
    action: 'Explore Opportunities',
  },
  {
    title: 'Grow',
    kicker: '03 / BECOME',
    Icon: Sprout,
    text: "This is more than a book you read, it's a life that reads you. Let what you read disciple you, stretch you, and build you day by day, until your life becomes the message.",
    action: 'Be transformed',
  },
];

export default function PartnershipOrbit() {
  const [active, setActive] = useState(0);
  const [turn, setTurn] = useState(0);
  const startX = useRef(null);

  const current = paths[active];

  const choose = (index) => {
    setActive((index + paths.length) % paths.length);
    setTurn((value) => value + 1);
  };

  const handleTouchStart = (event) => {
    startX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    if (startX.current === null) return;

    const distance = event.changedTouches[0].clientX - startX.current;

    if (Math.abs(distance) > 45) {
      choose(active + (distance < 0 ? 1 : -1));
    }

    startX.current = null;
  };

  return (
    <div
      className="partnership-orbit md:hidden"
      aria-label="Explore three ways to partner"
    >
      <div
        className="partnership-orbit-stage"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="partnership-orbit-ring"
          style={{ '--orbit-angle': `${turn * -120}deg` }}
          aria-hidden="true"
        />

        {paths.map(({ title, Icon }, index) => (
          <button
            key={title}
            type="button"
            onClick={() => choose(index)}
            className={`partnership-orbit-node partnership-orbit-node-${index} ${
              active === index ? 'is-active' : ''
            }`}
            aria-label={`View ${title}`}
            aria-pressed={active === index}
          >
            <Icon size={22} strokeWidth={1.6} />
            <span>{title}</span>
          </button>
        ))}

        <div className="partnership-orbit-center" aria-hidden="true">
          <span>THE</span>
          <strong>MISSION</strong>
          <span>CONTINUES</span>
        </div>
      </div>

      <div className="partnership-orbit-detail" key={active}>
        <span className="partnership-orbit-kicker">
          {current.kicker} / PARTNERSHIP
        </span>
        <h3>
          {current.title}
          <span className="text-[#991313]">.</span>
        </h3>
        <p>{current.text}</p>
        <span className="partnership-orbit-action">
          {current.action} <ArrowRight size={16} />
        </span>
      </div>

      <div className="partnership-orbit-controls">
        <button
          type="button"
          onClick={() => choose(active - 1)}
          aria-label="Previous way to partner"
        >
          <ArrowLeft size={19} />
        </button>

        <span>
          0{active + 1} <span className="opacity-40">/ 03</span>
        </span>

        <button
          type="button"
          onClick={() => choose(active + 1)}
          aria-label="Next way to partner"
        >
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}
