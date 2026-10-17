import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Star,
  Trash2,
  X,
  PackageCheck,
  Truck,
  Flower2,
} from "lucide-react";
import { products, type Product } from "./data/products";

type CartItem = { product: Product; quantity: number };
type Review = { name: string; rating: number; text: string };
const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const categories = [
  "All pieces",
  "Flowers",
  "Bouquets & Gifts",
  "Kitchen Décor",
  "Home Décor",
  "Bookshelf & Table",
];
const starterReviews: Review[] = [
  {
    name: "Ananya M.",
    rating: 5,
    text: "The little details are so beautiful. It has made my bedside table feel special.",
  },
  {
    name: "Priya K.",
    rating: 5,
    text: "A thoughtful gift and such lovely packaging. The flowers look beautiful in our living room.",
  },
  {
    name: "Meera S.",
    rating: 4,
    text: "Soft colours, lovely finish and exactly the kind of calm décor I wanted for my home.",
  },
];

export default function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("ever-bliss-cart") || "[]");
    } catch {
      return [];
    }
  });
  const [category, setCategory] = useState("All pieces");
  const [sort, setSort] = useState("featured");
  const [query, setQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<CartItem[] | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notice, setNotice] = useState("");
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("ever-bliss-reviews") || "null") ||
        starterReviews
      );
    } catch {
      return starterReviews;
    }
  });
  const [reviewForm, setReviewForm] = useState({
    name: "",
    rating: 5,
    text: "",
  });
  const [trackId, setTrackId] = useState("EB-2048");
  const [trackResult, setTrackResult] = useState(false);
  const [order, setOrder] = useState<{ id: string; name: string } | null>(null);
  const [payment, setPayment] = useState("UPI");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  useEffect(() => {
    localStorage.setItem("ever-bliss-cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("ever-bliss-reviews", JSON.stringify(reviews));
  }, [reviews]);
  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(""), 2400);
    return () => window.clearTimeout(t);
  }, [notice]);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (category === "All pieces" || p.category === category) &&
        `${p.name} ${p.description} ${p.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    );
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, sort, query]);
  const cartCount = cart.reduce((n, i) => n + i.quantity, 0);
  const subtotal = (items: CartItem[]) =>
    items.reduce((n, i) => n + i.product.price * i.quantity, 0);
  const activeItems = buyNowItem ?? cart;
  const activeSubtotal = subtotal(activeItems);
  const delivery = activeSubtotal === 0 || activeSubtotal >= 1500 ? 0 : 79;
  const total = activeSubtotal + delivery;

  function addToCart(product: Product, quantity = 1) {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      return found
        ? prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          )
        : [...prev, { product, quantity }];
    });
    setNotice(`${product.name} added to your bag`);
  }
  function changeQty(id: number, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === id ? { ...i, quantity: i.quantity + delta } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }
  function buyNow(product: Product) {
    setBuyNowItem([{ product, quantity: 1 }]);
    setSelected(null);
    setCartOpen(false);
    setCheckoutOpen(true);
  }
  function startCheckout() {
    if (!cart.length) {
      setNotice("Your bag is waiting for something lovely.");
      return;
    }
    setBuyNowItem(null);
    setCartOpen(false);
    setCheckoutOpen(true);
  }
  function placeDemoOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!activeItems.length) return;
    const id = `EB-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrder({ id, name: form.name });
    setCart((prev) => (buyNowItem ? prev : []));
    setBuyNowItem(null);
    setCheckoutOpen(false);
    setCartOpen(false);
    setTrackId(id);
    setTrackResult(true);
    setNotice("Demo order created. No payment was taken.");
    setTimeout(
      () =>
        document
          .getElementById("track-order")
          ?.scrollIntoView({ behavior: "smooth" }),
      120,
    );
  }
  function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.text.trim()) return;
    setReviews((prev) => [
      { ...reviewForm, name: reviewForm.name.trim() },
      ...prev,
    ]);
    setReviewForm({ name: "", rating: 5, text: "" });
    setNotice("Thank you for sharing a little love!");
  }
  function navTo(id: string) {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="site-shell">
      <div className="announcement">
        <Flower2 size={13} /> Thoughtfully handmade, always made with love{" "}
        <span>·</span> Free shipping on orders over ₹1,500
      </div>
      <header className="nav-wrap">
        <a
          className="brand"
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            navTo("home");
          }}
        >
          <span className="brand-flower">
            <Flower2 size={22} strokeWidth={1.4} />
          </span>
          <span>
            ever bliss<small>HANDMADE WITH HEART</small>
          </span>
        </a>
        <nav className={mobileMenu ? "nav-links open" : "nav-links"}>
          <button onClick={() => navTo("home")}>Home</button>
          <button onClick={() => navTo("shop")}>Shop</button>
          <button onClick={() => navTo("categories")}>Categories</button>
          <button onClick={() => navTo("reviews")}>Reviews</button>
          <button onClick={() => navTo("track-order")}>Track order</button>
        </nav>
        <div className="nav-actions">
          <button
            className="icon-btn mobile-toggle"
            aria-label="Toggle menu"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={20} /> : <Menu size={20} />}
          </button>
          <button
            className="bag-btn"
            onClick={() => setCartOpen(true)}
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <ShoppingBag size={19} />
            <span>Bag</span>
            <b>{cartCount}</b>
          </button>
        </div>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" /> SMALL THINGS, LASTING JOY
            </div>
            <h1>
              Flowers that stay.
              <br />
              <em>Memories that bloom.</em>
            </h1>
            <p>
              Handmade flowers and thoughtful little treasures, created to bring
              a softer kind of beauty into your everyday.
            </p>
            <div className="hero-actions">
              <button className="btn btn-dark" onClick={() => navTo("shop")}>
                Shop the collection <ArrowRight size={16} />
              </button>
              <button className="text-link" onClick={() => navTo("story")}>
                Our little story <ArrowUpRight size={16} />
              </button>
            </div>
            <div className="hero-note">
              <span className="mini-flower">
                <Flower2 size={17} />
              </span>
              <span>
                <strong>Made slowly, loved forever</strong>
                <small>Handcrafted details in every piece</small>
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="hero-image-main">
              <img
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=90"
                alt="Soft pastel flowers in warm natural light"
              />
              <div className="image-caption">
                <span>THE EVER BLOOM COLLECTION</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="floating-note">
              <span className="note-icon">
                <Leaf size={18} />
              </span>
              <span>
                Keep a little
                <br />
                <em>beauty close.</em>
              </span>
            </div>
            <div className="hero-stamp">
              made
              <br />
              with love <Heart size={14} fill="currentColor" />
            </div>
          </div>
          <div className="hero-bottom">
            <span>01 — 08 · HANDMADE TREASURES</span>
            <span>
              SCROLL TO DISCOVER <ArrowDown size={14} />
            </span>
          </div>
        </section>

        <section className="category-section section-pad" id="categories">
          <div className="section-heading">
            <div>
              <div className="eyebrow">A LITTLE SOMETHING FOR EVERY CORNER</div>
              <h2>
                Find your kind of <em>lovely.</em>
              </h2>
            </div>
            <p>
              Little handmade details that make a house
              <br className="desktop-only" /> feel a little more like yours.
            </p>
          </div>
          <div className="category-grid">
            {[
              {
                name: "Flowers",
                sub: "Blooms that never fade",
                image:
                  "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=650&q=85",
              },
              {
                name: "Bouquets & Gifts",
                sub: "A thoughtful kind of gift",
                image:
                  "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=650&q=85",
              },
              {
                name: "Home Décor",
                sub: "Make room for beauty",
                image:
                  "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=650&q=85",
              },
              {
                name: "Kitchen Décor",
                sub: "Joy in the everyday",
                image:
                  "https://images.unsplash.com/photo-1494336934272-f0efcedfc8f4?auto=format&fit=crop&w=650&q=85",
              },
            ].map((c, i) => (
              <button
                className="category-card"
                key={c.name}
                onClick={() => {
                  setCategory(c.name);
                  navTo("shop");
                }}
              >
                <img src={c.image} alt={c.name} loading="lazy" />
                <span className="category-index">0{i + 1}</span>
                <span className="category-info">
                  <strong>{c.name}</strong>
                  <small>{c.sub}</small>
                </span>
                <span className="category-arrow">
                  <ArrowUpRight size={17} />
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="shop-section section-pad" id="shop">
          <div className="section-heading shop-heading">
            <div>
              <div className="eyebrow">MADE BY HAND, CHOSEN BY HEART</div>
              <h2>
                Little things, <em>big feelings.</em>
              </h2>
            </div>
            <p>
              Every piece has its own little personality.
              <br className="desktop-only" /> Find the one that feels like you.
            </p>
          </div>
          <div className="shop-tools">
            <div className="filters" role="group" aria-label="Filter products">
              {categories.map((c) => (
                <button
                  key={c}
                  className={category === c ? "filter active" : "filter"}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="shop-controls">
              <label className="search-box">
                <Search size={15} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Find something lovely"
                  aria-label="Search products"
                />
              </label>
              <label className="sort-select">
                <span>Sort by</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort products"
                >
                  <option value="featured">Featured</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="rating">Top rated</option>
                </select>
                <ChevronDown size={14} />
              </label>
            </div>
          </div>
          <div className="product-grid">
            {filtered.map((p, i) => (
              <motion.article
                className="product-card"
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
              >
                <div className="product-image-wrap">
                  <button
                    className="product-image-button"
                    onClick={() => setSelected(p)}
                    aria-label={`View ${p.name}`}
                  >
                    <img src={p.image} alt={p.name} loading="lazy" />
                  </button>
                  {p.badge && <span className="product-badge">{p.badge}</span>}
                  <button className="quick-view" onClick={() => setSelected(p)}>
                    Quick view <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="product-meta">
                  <div>
                    <button
                      className="product-name"
                      onClick={() => setSelected(p)}
                    >
                      {p.name}
                    </button>
                    <p>{p.category}</p>
                  </div>
                  <span className="product-price">{money(p.price)}</span>
                </div>
                <div className="product-bottom">
                  <span className="rating">
                    <Star size={13} fill="currentColor" /> {p.rating.toFixed(1)}{" "}
                    <small>({p.reviewCount})</small>
                  </span>
                  <button className="add-small" onClick={() => addToCart(p)}>
                    <Plus size={14} /> Add to bag
                  </button>
                </div>
                <div className="product-buy-row">
                  <button
                    onClick={() => addToCart(p)}
                    className="btn btn-outline"
                  >
                    Add to cart
                  </button>
                  <button onClick={() => buyNow(p)} className="btn btn-dark">
                    Buy now <ArrowRight size={14} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
          {!filtered.length && (
            <div className="empty-results">
              <Flower2 size={28} />
              <h3>No little treasures found</h3>
              <p>Try another search or choose a different category.</p>
              <button
                className="text-link"
                onClick={() => {
                  setCategory("All pieces");
                  setQuery("");
                }}
              >
                Show all pieces <ArrowRight size={15} />
              </button>
            </div>
          )}
          <div className="shop-footnote">
            <span>
              <Leaf size={15} /> Every piece is thoughtfully handmade
            </span>
            <button
              className="text-link"
              onClick={() => {
                setCategory("All pieces");
                setQuery("");
              }}
            >
              Explore all pieces <ArrowRight size={15} />
            </button>
          </div>
        </section>

        <section className="story-section" id="story">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=1000&q=85"
              alt="Sunlit, softly styled home with natural textures"
              loading="lazy"
            />
            <div className="story-image-label">A SLOWER KIND OF BEAUTY</div>
          </div>
          <div className="story-copy">
            <div className="eyebrow">
              <span className="eyebrow-line" /> THE HEART OF EVER BLISS
            </div>
            <h2>
              Made with care.
              <br />
              <em>Kept with love.</em>
            </h2>
            <p>
              At Ever Bliss, we believe beauty belongs in everyday life. Each
              creation is thoughtfully handmade to bring warmth, charm, and
              lasting beauty to your home.
            </p>
            <p>
              From delicate floral arrangements to charming home accents, every
              piece is made to be treasured — not just for a season, but for all
              the little moments in between.
            </p>
            <div className="signature">
              <span className="signature-flower">
                <Flower2 size={28} />
              </span>
              <span>
                <em>With love, always</em>
                <small>THE EVER BLISS WAY</small>
              </span>
            </div>
            <button className="text-link" onClick={() => navTo("shop")}>
              Find your forever bloom <ArrowRight size={15} />
            </button>
          </div>
        </section>

        <section className="promise-strip">
          <div>
            <span className="promise-icon">
              <Flower2 size={20} />
            </span>
            <span>
              <strong>Made by hand</strong>
              <small>A little care in every detail</small>
            </span>
          </div>
          <div>
            <span className="promise-icon">
              <Heart size={20} />
            </span>
            <span>
              <strong>Made to be gifted</strong>
              <small>Lovely things, beautifully shared</small>
            </span>
          </div>
          <div>
            <span className="promise-icon">
              <Leaf size={20} />
            </span>
            <span>
              <strong>Beauty that lasts</strong>
              <small>Timeless pieces for your space</small>
            </span>
          </div>
        </section>

        <section className="reviews-section section-pad" id="reviews">
          <div className="reviews-intro">
            <div className="eyebrow">KIND WORDS, FROM KIND HEARTS</div>
            <h2>
              A little love <em>back.</em>
            </h2>
            <p>
              Nothing makes us happier than finding out our handmade pieces have
              found a happy home.
            </p>
            <div className="review-summary">
              <div className="big-rating">4.9</div>
              <div>
                <div className="stars">★★★★★</div>
                <span>LOVED BY OUR COMMUNITY</span>
              </div>
            </div>
          </div>
          <div className="review-content">
            <div className="review-cards">
              {reviews.slice(0, 3).map((r, i) => (
                <motion.article
                  className="review-card"
                  key={`${r.name}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="review-stars">
                    {"★".repeat(r.rating)}
                    <span>{"★".repeat(5 - r.rating)}</span>
                  </div>
                  <p>“{r.text}”</p>
                  <div className="review-person">
                    <span className="avatar">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                    <strong>{r.name}</strong>
                    <span>Verified kindness</span>
                  </div>
                </motion.article>
              ))}
            </div>
            <form className="review-form" onSubmit={submitReview}>
              <h3>Leave a little love</h3>
              <div className="review-form-row">
                <input
                  required
                  placeholder="Your name"
                  value={reviewForm.name}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, name: e.target.value })
                  }
                />
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({
                      ...reviewForm,
                      rating: Number(e.target.value),
                    })
                  }
                  aria-label="Your rating"
                >
                  <option value={5}>★★★★★ · 5 stars</option>
                  <option value={4}>★★★★☆ · 4 stars</option>
                  <option value={3}>★★★☆☆ · 3 stars</option>
                  <option value={2}>★★☆☆☆ · 2 stars</option>
                  <option value={1}>★☆☆☆☆ · 1 star</option>
                </select>
              </div>
              <textarea
                required
                rows={2}
                placeholder="Tell us what you loved..."
                value={reviewForm.text}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, text: e.target.value })
                }
              />
              <button className="btn btn-dark" type="submit">
                Share your review <ArrowRight size={15} />
              </button>
              <small className="demo-caption">
                Demo reviews are saved in this browser only.
              </small>
            </form>
          </div>
        </section>

        <section className="track-section section-pad" id="track-order">
          <div className="track-icon">
            <PackageCheck size={26} />
          </div>
          <div className="track-copy">
            <div className="eyebrow">YOUR LITTLE TREASURE IS ON ITS WAY</div>
            <h2>
              Track your <em>order.</em>
            </h2>
            <p>
              Enter your order number to see its journey home. Try{" "}
              <strong>EB-2048</strong> for a sample tracking timeline.
            </p>
          </div>
          <form
            className="track-form"
            onSubmit={(e) => {
              e.preventDefault();
              setTrackResult(true);
            }}
          >
            <label htmlFor="order-id">ORDER ID</label>
            <div className="track-input-row">
              <input
                id="order-id"
                value={trackId}
                onChange={(e) => {
                  setTrackId(e.target.value);
                  setTrackResult(false);
                }}
                placeholder="e.g. EB-2048"
                required
              />
              <button type="submit" className="btn btn-dark">
                Track order <ArrowRight size={15} />
              </button>
            </div>
          </form>
          {trackResult && (
            <div className="tracking-result">
              <div className="tracking-result-head">
                <span className="status-pill">
                  <span />{" "}
                  {order?.id === trackId
                    ? "Order placed · Demo"
                    : "Sample tracking"}
                </span>
                <strong>{trackId.toUpperCase()}</strong>
              </div>
              <p>
                {order?.id === trackId
                  ? `Thank you${order.name ? `, ${order.name}` : ""}! Your demo order has been created.`
                  : "This is a sample timeline. Live tracking becomes available when order management is connected."}
              </p>
              <div className="timeline">
                {[
                  "Order placed",
                  "Payment confirmation",
                  "Preparing with care",
                  "On its way",
                  "Delivered with love",
                ].map((s, i) => (
                  <div
                    className={`timeline-step ${i === 0 ? "complete" : ""}`}
                    key={s}
                  >
                    <span className="timeline-dot">
                      {i === 0 ? (
                        <Check size={12} />
                      ) : i === 3 ? (
                        <Truck size={13} />
                      ) : null}
                    </span>
                    <span>{s}</span>
                  </div>
                ))}
              </div>
              <small>
                Demo only — no real shipment is associated with this order ID.
              </small>
            </div>
          )}
        </section>

        <section className="newsletter">
          <div className="newsletter-flower">
            <Flower2 size={32} />
          </div>
          <div>
            <div className="eyebrow">A NOTE FROM OUR LITTLE CORNER</div>
            <h2>
              Good things are <em>growing.</em>
            </h2>
            <p>
              New handmade pieces, thoughtful gift ideas and little notes of
              joy.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setNotice("You’re on the list — thank you!");
              (e.currentTarget as HTMLFormElement).reset();
            }}
          >
            <input
              type="email"
              placeholder="Your email address"
              required
              aria-label="Email address"
            />
            <button type="submit" aria-label="Subscribe">
              <ArrowRight size={18} />
            </button>
            <small>Demo subscription · no emails are sent</small>
          </form>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#home">
              <span className="brand-flower">
                <Flower2 size={22} />
              </span>
              <span>
                ever bliss<small>HANDMADE WITH HEART</small>
              </span>
            </a>
            <p>
              Handmade flowers that never fade.
              <br />
              Little treasures for a home full of heart.
            </p>
            <div className="socials">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
              >
                Instagram <ArrowUpRight size={13} />
              </a>
              <a
                href="https://www.pinterest.com/"
                target="_blank"
                rel="noreferrer"
              >
                Pinterest <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <strong>EXPLORE</strong>
              <button onClick={() => navTo("shop")}>Shop all</button>
              <button onClick={() => navTo("categories")}>Categories</button>
              <button onClick={() => navTo("story")}>Our story</button>
              <button onClick={() => navTo("reviews")}>Kind words</button>
            </div>
            <div>
              <strong>HERE TO HELP</strong>
              <button onClick={() => navTo("track-order")}>
                Track an order
              </button>
              <a href="mailto:hello@everbliss.example">Contact us</a>
              <span>Shipping & returns</span>
              <span>Privacy & terms</span>
            </div>
          </div>
          <div className="footer-signoff">
            <span>Thank you for</span>
            <em>choosing handmade.</em>
            <Flower2 size={28} />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Ever Bliss. Made with care.</span>
          <span>
            DESIGNED FOR THE LITTLE THINGS{" "}
            <Heart size={12} fill="currentColor" />
          </span>
        </div>
      </footer>

      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.aside
              className="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
            >
              <div className="drawer-head">
                <div>
                  <span className="eyebrow">A LITTLE BAG OF JOY</span>
                  <h2>
                    Your bag <em>({cartCount})</em>
                  </h2>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => setCartOpen(false)}
                  aria-label="Close cart"
                >
                  <X />
                </button>
              </div>
              {!cart.length ? (
                <div className="cart-empty">
                  <span>
                    <ShoppingBag size={28} />
                  </span>
                  <h3>Your bag is feeling lonely.</h3>
                  <p>Let’s find something lovely to bring home.</p>
                  <button
                    className="btn btn-dark"
                    onClick={() => {
                      setCartOpen(false);
                      navTo("shop");
                    }}
                  >
                    Explore the collection <ArrowRight size={15} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <div className="cart-item" key={item.product.id}>
                        <img src={item.product.image} alt={item.product.name} />
                        <div className="cart-item-info">
                          <strong>{item.product.name}</strong>
                          <small>{money(item.product.price)}</small>
                          <div className="quantity-control">
                            <button
                              onClick={() => changeQty(item.product.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => changeQty(item.product.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          className="remove-item"
                          onClick={() =>
                            setCart((prev) =>
                              prev.filter(
                                (i) => i.product.id !== item.product.id,
                              ),
                            )
                          }
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="shipping-note">
                    <Leaf size={15} />
                    {subtotal(cart) >= 1500
                      ? "Lovely! Your order ships free."
                      : `You’re ${money(1500 - subtotal(cart))} away from free shipping.`}
                  </div>
                  <div className="cart-summary">
                    <div>
                      <span>Subtotal</span>
                      <strong>{money(subtotal(cart))}</strong>
                    </div>
                    <div>
                      <span>Delivery</span>
                      <strong>
                        {subtotal(cart) >= 1500 ? "Free" : money(79)}
                      </strong>
                    </div>
                    <div className="cart-total">
                      <span>Total</span>
                      <strong>
                        {money(
                          subtotal(cart) + (subtotal(cart) >= 1500 ? 0 : 79),
                        )}
                      </strong>
                    </div>
                    <button
                      className="btn btn-dark checkout-btn"
                      onClick={startCheckout}
                    >
                      Continue to checkout <ArrowRight size={16} />
                    </button>
                    <small>Secure checkout · Demo payment only</small>
                  </div>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              className="modal product-modal"
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <button
                className="modal-close icon-btn"
                onClick={() => setSelected(null)}
                aria-label="Close details"
              >
                <X />
              </button>
              <div className="modal-product-image">
                <img src={selected.image} alt={selected.name} />
              </div>
              <div className="modal-product-copy">
                <div className="eyebrow">{selected.category.toUpperCase()}</div>
                <h2>{selected.name}</h2>
                <div className="modal-rating">
                  <span className="stars">★★★★★</span>{" "}
                  {selected.rating.toFixed(1)}{" "}
                  <small>({selected.reviewCount} reviews)</small>
                </div>
                <div className="modal-price">{money(selected.price)}</div>
                <p>{selected.description}</p>
                <div className="detail-note">
                  <Leaf size={16} /> Handmade with care · Made to be treasured
                </div>
                <div className="modal-actions">
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      addToCart(selected);
                      setSelected(null);
                      setCartOpen(true);
                    }}
                  >
                    Add to bag
                  </button>
                  <button
                    className="btn btn-dark"
                    onClick={() => buyNow(selected)}
                  >
                    Buy now <ArrowRight size={15} />
                  </button>
                </div>
                <small className="demo-caption">
                  Product details and images are sample content.
                </small>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {checkoutOpen && (
          <>
            <motion.div
              className="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutOpen(false)}
            />
            <motion.div
              className="modal checkout-modal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
            >
              <div className="checkout-head">
                <div>
                  <div className="eyebrow">ALMOST YOURS</div>
                  <h2>
                    Checkout <em>with care.</em>
                  </h2>
                </div>
                <button
                  className="icon-btn"
                  onClick={() => setCheckoutOpen(false)}
                  aria-label="Close checkout"
                >
                  <X />
                </button>
              </div>
              <div className="demo-warning">
                <Check size={16} /> Demo checkout · No real payment will be
                collected.
              </div>
              <form className="checkout-layout" onSubmit={placeDemoOrder}>
                <div className="checkout-fields">
                  <h3>Where should we send your little joy?</h3>
                  <div className="form-grid">
                    <label>
                      Full name
                      <input
                        required
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        placeholder="Your name"
                      />
                    </label>
                    <label>
                      Email address
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        placeholder="you@example.com"
                      />
                    </label>
                    <label>
                      Phone number
                      <input
                        required
                        type="tel"
                        pattern="[0-9+() -]{8,16}"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        placeholder="Mobile number"
                      />
                    </label>
                    <label>
                      PIN code
                      <input
                        required
                        pattern="[0-9]{6}"
                        value={form.pin}
                        onChange={(e) =>
                          setForm({ ...form, pin: e.target.value })
                        }
                        placeholder="6-digit PIN"
                      />
                    </label>
                    <label className="full-field">
                      Delivery address
                      <textarea
                        required
                        rows={2}
                        value={form.address}
                        onChange={(e) =>
                          setForm({ ...form, address: e.target.value })
                        }
                        placeholder="House / street / area"
                      />
                    </label>
                    <label>
                      City
                      <input
                        required
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                        placeholder="City"
                      />
                    </label>
                    <label>
                      State
                      <input
                        required
                        value={form.state}
                        onChange={(e) =>
                          setForm({ ...form, state: e.target.value })
                        }
                        placeholder="State"
                      />
                    </label>
                  </div>
                  <h3 className="payment-title">Choose a payment method</h3>
                  <div className="payment-options">
                    {["UPI", "Card", "Net banking", "Cash on Delivery"].map(
                      (p) => (
                        <label
                          className={
                            payment === p
                              ? "payment-option selected"
                              : "payment-option"
                          }
                          key={p}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={p}
                            checked={payment === p}
                            onChange={() => setPayment(p)}
                          />
                          <span>{p}</span>
                        </label>
                      ),
                    )}
                  </div>
                  <small className="demo-caption">
                    Payment selection is illustrative. Connect a gateway for
                    live payments.
                  </small>
                </div>
                <div className="checkout-summary">
                  <h3>Your little order</h3>
                  {activeItems.map((i) => (
                    <div className="summary-item" key={i.product.id}>
                      <img src={i.product.image} alt="" />
                      <div>
                        <strong>{i.product.name}</strong>
                        <small>Qty {i.quantity}</small>
                      </div>
                      <b>{money(i.product.price * i.quantity)}</b>
                    </div>
                  ))}
                  <div className="summary-line">
                    <span>Subtotal</span>
                    <b>{money(activeSubtotal)}</b>
                  </div>
                  <div className="summary-line">
                    <span>Delivery</span>
                    <b>{delivery === 0 ? "Free" : money(delivery)}</b>
                  </div>
                  <div className="summary-line total-line">
                    <span>Total</span>
                    <b>{money(total)}</b>
                  </div>
                  <button type="submit" className="btn btn-dark checkout-btn">
                    Place demo order <ArrowRight size={15} />
                  </button>
                  <small className="summary-safe">
                    No real payment is processed.
                  </small>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {notice && (
          <motion.div
            className="toast"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            <Check size={16} />
            {notice}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
