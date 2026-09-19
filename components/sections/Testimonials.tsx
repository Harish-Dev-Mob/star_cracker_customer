const CSS = `
  @keyframes tm-fadeUp {
    from { opacity:0; transform:translateY(22px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes tm-shimmer {
    0%   { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes tm-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }
  .tm-card {
    animation: tm-fadeUp 0.55s both;
    transition: transform 0.28s cubic-bezier(.34,1.25,.64,1), box-shadow 0.28s;
  }
  .tm-card:hover {
    transform: translateY(-5px) scale(1.01);
    box-shadow: 0 18px 48px rgba(249,115,22,0.15), 0 2px 12px rgba(0,0,0,0.4)!important;
  }
  .tm-marquee-track {
    display: flex;
    animation: tm-marquee 28s linear infinite;
    width: max-content;
  }
  .tm-marquee-track:hover { animation-play-state: paused; }
  .tm-badge {
    background: linear-gradient(90deg,#f97316,#fbbf24,#ef4444,#f97316);
    background-size: 200% auto;
    animation: tm-shimmer 3s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg,#f97316,#ef4444)",
  "linear-gradient(135deg,#a855f7,#ec4899)",
  "linear-gradient(135deg,#06b6d4,#3b82f6)",
  "linear-gradient(135deg,#10b981,#06b6d4)",
  "linear-gradient(135deg,#fbbf24,#f97316)",
  "linear-gradient(135deg,#8b5cf6,#a855f7)",
];

interface Review {
  name: string;
  location: string;
  rating: number;
  text: string;
}

function ReviewCard({ review, index, style }: { review: Review; index: number; style?: React.CSSProperties }) {
  const grad = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  return (
    <div
      className="tm-card relative rounded-3xl overflow-hidden shrink-0"
      style={{
        width: 320,
        padding: "1px",
        background: "linear-gradient(145deg,rgba(249,115,22,0.35),rgba(168,85,247,0.2),rgba(255,255,255,0.05))",
        animationDelay: `${index * 0.1}s`,
        ...style,
      }}
    >
      <div
        className="rounded-3xl h-full px-6 py-6 relative overflow-hidden"
        style={{ background: "linear-gradient(155deg,#1a0a00,#0e0016)" }}
      >
        {/* Ambient glow */}
        <div aria-hidden style={{
          position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%",
          background: `radial-gradient(circle,${grad.includes("f97316") ? "rgba(249,115,22,0.12)" : "rgba(168,85,247,0.1)"} 0%,transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Quote mark */}
        <div
          aria-hidden
          style={{
            fontSize: 72, lineHeight: 1, fontFamily: "Georgia,serif",
            position: "absolute", top: 8, right: 16,
            background: "linear-gradient(135deg,rgba(251,191,36,0.18),rgba(249,115,22,0.08))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            pointerEvents: "none", userSelect: "none",
          }}
        >"</div>

        {/* Stars */}
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, j) => (
            <span
              key={j}
              style={{
                fontSize: 15,
                color: j < review.rating ? "#fbbf24" : "rgba(255,255,255,0.1)",
                filter: j < review.rating ? "drop-shadow(0 0 4px rgba(251,191,36,0.6))" : "none",
              }}
            >★</span>
          ))}
        </div>

        {/* Review text */}
        <p
          className="text-sm leading-relaxed mb-5 line-clamp-4"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          "{review.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mt-auto">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
            style={{ background: grad, boxShadow: `0 0 14px ${grad.includes("f97316") ? "rgba(249,115,22,0.4)" : "rgba(168,85,247,0.35)"}` }}
          >
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-black text-white">{review.name}</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.38)" }}>{review.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATIC_REVIEWS: Review[] = [
  { name: "Priya Sharma", location: "Mumbai, Maharashtra", rating: 5, text: "Ordered the Grand Festival Combo for Diwali — absolutely stunning! Every single item worked flawlessly. The packaging was excellent and delivery was on time." },
  { name: "Arjun Reddy", location: "Hyderabad, Telangana", rating: 5, text: "Best sparklers I've ever used. The kids loved the colour sparklers, and the volcano fountain was the highlight of our rooftop celebration. Will order again!" },
  { name: "Sneha Patel", location: "Ahmedabad, Gujarat", rating: 4, text: "Great quality products at reasonable prices. The Budget Diwali Pack was perfect for our apartment celebration. Safe and easy to use. Highly recommend!" },
  { name: "Karthik R.", location: "Chennai, Tamil Nadu", rating: 5, text: "Super fast delivery and excellent quality. The flower pots were a huge hit with the family. Will definitely be ordering again for New Year!" },
  { name: "Meera Nair", location: "Kochi, Kerala", rating: 5, text: "Beautiful packaging and the products exceeded my expectations. The chakkar set was amazing. Great value for money — our whole colony was impressed!" },
  { name: "Rahul Gupta", location: "Delhi, NCR", rating: 5, text: "Smooth shopping experience and the firecrackers were top notch. Got them delivered well before Diwali. The giant bomb shells were absolutely spectacular!" },
];

export default function Testimonials({ reviews }: { reviews?: Review[] }) {
  const allReviews = (reviews && reviews.length > 0) ? reviews : STATIC_REVIEWS;
  const isMarquee = allReviews.length >= 5;
  // Duplicate for seamless infinite scroll only if marquee is active
  const displayReviews = isMarquee ? [...allReviews, ...allReviews] : allReviews;

  const avgRating = (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1);

  return (
    <section
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{
        /* Self-contained dark island — works in both light and dark themes */
        background: "linear-gradient(160deg,#120500 0%,#0a0014 50%,#0d0200 100%)",
      }}
    >
      <style>{CSS}</style>

      {/* Background decorations */}
      <div aria-hidden style={{
        position: "absolute", top: "20%", left: "5%", width: 350, height: 350, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: "15%", right: "8%", width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(168,85,247,0.07) 0%,transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container-site mb-12">
        {/* Section header */}
        <div className="text-center">
          <span
            className="tm-badge inline-block text-xs font-black tracking-[0.22em] uppercase mb-4"
          >
            ★ Happy Customers ★
          </span>
          <h2
            className="font-display text-3xl sm:text-4xl lg:text-5xl font-black mb-4"
            style={{ color: "#f5f5f5", letterSpacing: "-0.02em" }}
          >
            What Our Customers Say
          </h2>
          <p className="text-sm mb-8" style={{ color: "rgba(245,245,245,0.55)" }}>
            Trusted by thousands of happy families across India 🇮🇳
          </p>

          {/* Rating summary pill */}
          <div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mx-auto"
            style={{
              background: "linear-gradient(135deg,rgba(251,191,36,0.14),rgba(249,115,22,0.1))",
              border: "1px solid rgba(251,191,36,0.28)",
            }}
          >
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map(s => (
                <span key={s} style={{ fontSize: 18, color: "#fbbf24", filter: "drop-shadow(0 0 5px rgba(251,191,36,0.7))" }}>★</span>
              ))}
            </div>
            <span className="font-black text-lg" style={{ color: "#f5f5f5" }}>{avgRating}</span>
            <span className="text-xs font-bold" style={{ color: "rgba(245,245,245,0.5)" }}>
              from {allReviews.length}+ reviews
            </span>
          </div>
        </div>
      </div>

      {/* Cards container */}
      <div
        className="relative overflow-hidden w-full py-10"
        style={{ maskImage: isMarquee ? "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)" : "none" }}
      >
        <div className={isMarquee ? "tm-marquee-track gap-5" : "flex justify-center flex-wrap gap-6 container-site mx-auto px-4"}>
          {displayReviews.map((review, i) => (
            <ReviewCard
              key={i}
              review={review}
              index={i % allReviews.length}
              style={isMarquee ? { margin: "0 0 0 20px" } : {}}
            />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="container-site mt-12 text-center">
        <p className="text-sm mb-4" style={{ color: "rgba(245,245,245,0.38)" }}>
          Ordered from us? Leave your review after delivery 🎆
        </p>
      </div>
    </section>
  );
}

