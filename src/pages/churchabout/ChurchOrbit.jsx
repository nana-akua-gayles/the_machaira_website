import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Heart, Users, Globe2, Target, Eye } from "lucide-react";
import "./ChurchMotion.css";

const valueItems = [
  { title: "Truth", subtitle: "Our compass", icon: BookOpen, description: "We are firmly rooted in Scripture as the absolute guide for faith, doctrine, and daily living." },
  { title: "Love", subtitle: "Our expression", icon: Heart, description: "We demonstrate God's grace through genuine compassion, intentional service, and warm hospitality." },
  { title: "Faith", subtitle: "Our family", icon: Users, description: "We believe we grow stronger together as a family, supporting, uplifting, and sharpening one another." },
  { title: "Impact", subtitle: "Our calling", icon: Globe2, description: "We are commissioned to take the gospel outside the four walls, reaching cities and nations with hope." },
];

const purposeItems = [
  { title: "Our Mission", icon: Target, description: "To build a global family of passionate lovers of Jesus by cultivating the reigning life in Christ in every member. Through dynamic live services, rich digital resources, structured discipleship,  and pastoral care, we equip believers to walk in the certainty of their calling and to influence their spheres with His divine purpose and intent." },
  { title: "Our Vision", icon: Eye, description: "A Commonwealth who shine with the divine light, living in the certainty of their calling, unlimited by time or distance, who influence their spheres with the love of Christ, His purpose and intent by the power of the Holy Spirit." },
];

export default function ChurchOrbit({ variant = "values" }) {
  const items = variant === "purpose" ? purposeItems : valueItems;
  const [active, setActive] = useState(0);
  const touchStart = useRef(null);
  const current = items[active];
  const change = (direction) => setActive((index) => (index + direction + items.length) % items.length);
  const Icon = current.icon;

  return (
    <div className="church-orbit-shell lg:hidden" aria-label={`${variant === "purpose" ? "Mission and vision" : "Church values"} interactive orbit`}>
      <div className="church-orbit-topline">
        <span>{variant === "purpose" ? "" : "FOUR VALUES · ONE FOCUS"}</span>
        <span>0{active + 1} / 0{items.length}</span>
      </div>
      <div
        className="church-orbit-stage"
        onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
        onTouchEnd={(event) => {
          if (!touchStart.current) return;
          const dx = event.changedTouches[0].clientX - touchStart.current.x;
          const dy = event.changedTouches[0].clientY - touchStart.current.y;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) change(dx < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <div className="church-orbit-ring church-orbit-ring-outer" />
        <div className="church-orbit-ring church-orbit-ring-inner" />
        <div className="church-orbit-trails" aria-hidden="true" />
        <div className="church-orbit-center" key={`center-${variant}-${active}`}>
          <span className="church-orbit-center-icon"><Icon size={27} strokeWidth={1.5} /></span>
          <span className="church-orbit-center-caption">{variant === "CHRIST JESUS" ? "CHRIST JESUS" : "CHRIST JESUS"}</span>
        </div>
        {items.map((item, index) => {
          const ItemIcon = item.icon;
          const angle = ((index - active) / items.length) * Math.PI * 2 - Math.PI / 2;
          const x = 50 + Math.cos(angle) * 40;
          const y = 50 + Math.sin(angle) * 40;
          return (
            <button
              key={item.title}
              type="button"
              aria-label={`Explore ${item.title}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
              className={`church-orbit-satellite ${active === index ? "is-active" : ""}`}
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <ItemIcon size={20} strokeWidth={1.7} />
            </button>
          );
        })}
      </div>
      <div className="church-orbit-detail" key={`${variant}-${active}`} aria-live="polite">
        <span className="church-orbit-eyebrow">{current.subtitle}</span>
        <h3>{current.title}</h3>
        <p>{current.description}</p>
      </div>
      <div className="church-orbit-controls">
        <button type="button" aria-label="Previous" onClick={() => change(-1)}><ArrowLeft size={19} /></button>
        <div className="church-orbit-dots">{items.map((item, index) => <button key={item.title} type="button" aria-label={`Show ${item.title}`} aria-current={index === active ? "true" : undefined} onClick={() => setActive(index)} />)}</div>
        <button type="button" aria-label="Next" onClick={() => change(1)}><ArrowRight size={19} /></button>
      </div>
    </div>
  );
}
