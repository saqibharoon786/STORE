import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Gem, Headphones, Menu, Minus, Plus, RotateCcw, Search, ShieldCheck, ShoppingBag, ShoppingCart, Sparkles, Star, Trash2, Truck, UserRound, X } from "lucide-react";
import { CheckoutPanel } from "@/components/checkout-panel";
import { SocialLinks } from "@/components/social-links";
import { Button } from "@/components/ui/button";
import { useAdminSession, useSiteStore, type StoreProduct } from "@/lib/site-store";
import heroImage from "@/assets/luxora-still-life.jpg";
import editsGarments from "@/assets/ug-hero.jpg";
import editsDecor from "@/assets/homedecor-hero.jpg";

const edits = [
  { name: "Under Garments", kicker: "UNDER GARMENTS", title: "Comfort meets confidence", line: "Lace, satin and everyday pieces, made to feel as good as they look.", image: editsGarments },
  { name: "Home Decoration", kicker: "HOME DECORATION", title: "For a beautiful home", line: "Warm accents that give a room its mood, from light to the last detail.", image: editsDecor },
];

type CartLine = { id: string; name: string; category: string; price: number; image: string; qty: number };

const formatPrice = (amount: number) => `Rs. ${amount.toLocaleString("en-PK")}`;

const promises = [
  { icon: Gem, title: "Premium quality", text: "Pieces chosen for fabric, finish and the way they hold up in daily life." },
  { icon: Truck, title: "Fast shipping", text: "Reliable delivery, with free shipping on orders above $50." },
  { icon: ShieldCheck, title: "Secure payments", text: "Checkout stays protected from the first click to the confirmation." },
  { icon: RotateCcw, title: "Easy returns", text: "Changed your mind? Send it back without a long process." },
];

const stories = [
  { quote: "The lace set feels expensive without trying too hard. It has become the piece I reach for every day.", name: "Ayesha", place: "Lahore", item: "Lace Push-Up Bra", category: "Bras" },
  { quote: "The lamp arrived packed with care and looks exactly like the photograph. The room feels finished.", name: "Hina", place: "Karachi", item: "Crystal Table Lamp", category: "Home Decoration" },
  { quote: "Finally a store that treats undergarments and home pieces with the same quiet taste.", name: "Sara", place: "Islamabad", item: "Satin Lounge Set", category: "Under Garments" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxora | Premium Lifestyle Store" },
      { name: "description", content: "Discover Luxora's curated collection of bottles, undergarments, umbrellas, and watches." },
      { property: "og:title", content: "Luxora | Premium Lifestyle Store" },
      { property: "og:description", content: "Elevate your everyday style with Luxora's premium lifestyle collection." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const site = useSiteStore();
  const session = useAdminSession();
  const categories = site.categories;
  const products = site.products;
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [activePromise, setActivePromise] = useState(0);
  const [activeStory, setActiveStory] = useState(0);
  const featuredStory = stories[activeStory] ?? stories[0];
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const closeMenus = () => {
    setMenuOpen(false);
    setCategoryMenuOpen(false);
    setSearchOpen(false);
  };

  const scrollTo = (id: string) => {
    closeMenus();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const chooseCategory = (id: string) => {
    scrollTo(`shop-${id}`);
  };

  const openNamedCategory = (name: string) => {
    const match = categories.find((category) => category.name === name);
    if (match) chooseCategory(match.id);
  };

  const addToCart = (product: StoreProduct, categoryName: string) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      return [...current, { id: product.id, name: product.name, category: categoryName, price: product.price, image: product.image, qty: 1 }];
    });
    setCartOpen(true);
    closeMenus();
  };

  const changeQty = (id: string, delta: number) => {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.id !== id) return [item];
        const qty = item.qty + delta;
        return qty > 0 ? [{ ...item, qty }] : [];
      }),
    );
  };

  const results = categories.filter((category) => category.name.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <main>
      <section id="home" className="luxora-hero" aria-label="Luxora premium lifestyle collection">
        <img className="luxora-hero__image" src={heroImage} alt="A curated arrangement of a perfume bottle, watch, umbrella, water bottle, and sunglasses" width={1920} height={1080} fetchPriority="high" />
        <div className="luxora-hero__shade" />
        <header className="site-header">
          <div className="site-header__inner">
            <a href="#home" className="brand" aria-label="Luxora home" onClick={(event) => { event.preventDefault(); scrollTo("home"); }}>
              <span className="brand__mark"><ShoppingBag size={31} strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="brand__words"><strong>Luxora</strong><small>STYLE · QUALITY · YOU</small></span>
            </a>
            <nav className="desktop-nav" aria-label="Main navigation">
              <a href="#home" className="nav-link nav-link--active" onClick={(event) => { event.preventDefault(); scrollTo("home"); }}>Home</a>
              <a href="#collections" className="nav-link" onClick={(event) => { event.preventDefault(); scrollTo("collections"); }}>Shop</a>
              <div className="nav-dropdown">
                <Button type="button" variant="ghost" className="nav-link nav-link--button" aria-expanded={categoryMenuOpen} aria-controls="category-dropdown" onClick={() => setCategoryMenuOpen((open) => !open)}>Categories <ChevronDown size={14} aria-hidden="true" /></Button>
                {categoryMenuOpen && <div id="category-dropdown" className="nav-dropdown__panel">{categories.map((category) => <Button key={category.id} type="button" variant="ghost" onClick={() => chooseCategory(category.id)}>{category.name}<ArrowRight size={15} aria-hidden="true" /></Button>)}</div>}
              </div>
              <a href="#about" className="nav-link" onClick={(event) => { event.preventDefault(); scrollTo("about"); }}>About</a>
            </nav>
            <div className="header-actions">
              <Link to={session ? "/admin" : "/login"} className="header-login" aria-label={session ? "Open admin" : "Admin login"}>
                <UserRound size={20} />
                <span>{session ? "Admin" : "Login"}</span>
              </Link>
              <Button type="button" size="icon" variant="ghost" className="header-icon" aria-label={searchOpen ? "Close search" : "Search categories"} aria-expanded={searchOpen} onClick={() => { setSearchOpen((open) => !open); setCategoryMenuOpen(false); }}>
                {searchOpen ? <X size={22} /> : <Search size={22} />}
              </Button>
              <Button type="button" size="icon" variant="ghost" className="header-icon header-cart" aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`} onClick={() => { setCartOpen(true); closeMenus(); }}>
                <ShoppingCart size={22} />
                {cartCount > 0 && <span className="header-cart__badge">{cartCount}</span>}
              </Button>
              <SocialLinks />
              <Button type="button" size="icon" variant="ghost" className="header-icon header-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
          {searchOpen && <div className="search-panel"><label htmlFor="category-search">Search collections</label><input id="category-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories..." autoFocus /><div className="search-results">{results.length ? results.map((category) => <Button key={category.id} type="button" variant="ghost" onClick={() => chooseCategory(category.id)}>{category.name}<ArrowRight size={16} aria-hidden="true" /></Button>) : <p>No categories found.</p>}</div></div>}
          {menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            <a href="#home" onClick={(event) => { event.preventDefault(); scrollTo("home"); }}>Home</a>
            <a href="#collections" onClick={(event) => { event.preventDefault(); scrollTo("collections"); }}>Shop</a>
            <span className="mobile-nav__label">Categories</span>
            {categories.map((category) => <Button type="button" variant="ghost" key={category.id} onClick={() => chooseCategory(category.id)}>{category.name}<ArrowRight size={15} /></Button>)}
            <a href="#about" onClick={(event) => { event.preventDefault(); scrollTo("about"); }}>About</a>
            <Link to={session ? "/admin" : "/login"} onClick={closeMenus}>{session ? "Admin" : "Admin login"}</Link>
          </nav>}
        </header>
        <div className="luxora-hero__content">
          <p className="hero-eyebrow">{site.hero.eyebrow}</p>
          <h1>{site.hero.title}<br /><span>{site.hero.accent}</span></h1>
          <p className="hero-description">{site.hero.description}</p>
          <Button variant="hero" size="lg" className="hero-cta" onClick={() => scrollTo("collections")}>SHOP NOW <ArrowRight aria-hidden="true" size={19} /></Button>
          <div className="hero-benefits" aria-label="Why shop Luxora">
            <div><Truck aria-hidden="true" /><span>Fast &amp; Reliable<br />Shipping</span></div>
            <div><ShieldCheck aria-hidden="true" /><span>Secure<br />Payments</span></div>
            <div><Sparkles aria-hidden="true" /><span>Premium<br />Quality</span></div>
            <div><Headphones aria-hidden="true" /><span>24/7<br />Support</span></div>
          </div>
        </div>
      </section>

      <section className="category-strip" aria-label="Browse categories">
        <div className="category-strip__inner">
          {categories.map((category) => (
            <button key={category.id} type="button" className="category-pill" onClick={() => chooseCategory(category.id)}>
              <span className="category-pill__image"><img src={category.image} alt="" width={768} height={1024} loading="lazy" /></span>
              <span className="category-pill__name">{category.name}</span>
              <span className="category-pill__sub">{category.sub}</span>
            </button>
          ))}
        </div>
      </section>

      <div id="collections">
        {categories.map((category, index) => {
          const items = products.filter((product) => product.categoryId === category.id && product.preview);
          return (
            <section key={category.id} id={`shop-${category.id}`} className={`home-band home-cat ${index % 2 === 1 ? "home-band--sand" : ""}`} aria-label={category.name}>
              <div className="home-band__inner">
                <div className="home-band__head home-band__head--row">
                  <div>
                    <p className="collections-kicker">{category.sub.toUpperCase()}</p>
                    <h2>{category.name}</h2>
                    <p>{category.description}</p>
                  </div>
                  <Link to="/category/$slug" params={{ slug: category.id }} className="collections-viewall">View all <ArrowRight size={16} aria-hidden="true" /></Link>
                </div>
                <div className="home-cat__grid">
                  {items.length === 0 && <p className="home-cat__empty">Pieces in this category appear here when they are set to show on the homepage.</p>}
                  {items.map((product) => {
                    const inCart = cart.some((item) => item.id === product.id);
                    return (
                      <article key={product.id} className="home-product">
                        <img src={product.image} alt={product.name} width={768} height={768} loading="lazy" />
                        <div className="home-product__body">
                          <strong>{product.name}</strong>
                          <div className="home-product__foot">
                            <b>{formatPrice(product.price)}</b>
                            <button type="button" className={`home-product__cart ${inCart ? "home-product__cart--added" : ""}`} onClick={() => addToCart(product, category.name)}>
                              {inCart ? <Check size={16} aria-hidden="true" /> : <ShoppingCart size={16} aria-hidden="true" />}
                              {inCart ? "Added" : "Add to cart"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <section className="home-band" id="edits" aria-label="Signature edits">
        <div className="home-band__inner">
          <div className="home-band__head">
            <p className="collections-kicker">SIGNATURE EDITS</p>
            <h2>Two collections, made to linger.</h2>
          </div>
          <div className="home-edits">
            {edits.map((edit) => (
              <button key={edit.name} type="button" className="home-edit" onClick={() => openNamedCategory(edit.name)}>
                <img src={edit.image} alt="" width={1400} height={900} />
                <span>
                  <small>{edit.kicker}</small>
                  <strong>{edit.title}</strong>
                  <em>{edit.line}</em>
                  <b>Shop the edit <ArrowRight size={15} aria-hidden="true" /></b>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="home-band" id="promise" aria-label="The Luxora promise">
        <div className="home-band__inner">
          <div className="home-band__head">
            <p className="collections-kicker">WHY LUXORA</p>
            <h2>The quiet details, handled.</h2>
          </div>
          <div className="home-promises">
            {promises.map((item, index) => {
              const Icon = item.icon;
              return (
                <button key={item.title} type="button" className={`home-promise ${activePromise === index ? "home-promise--active" : ""}`} aria-pressed={activePromise === index} onClick={() => setActivePromise(index)}>
                  <Icon size={22} aria-hidden="true" />
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-stories" id="stories" aria-label="Customer stories">
        <div className="home-stories__inner">
          <div className="home-stories__head">
            <div>
              <p className="collections-kicker">FROM OUR CUSTOMERS</p>
              <h2>Worn, lived with, loved.</h2>
              <p>Real notes from people who wear Luxora and live with it at home.</p>
            </div>
            <div className="home-stories__nav">
              <button type="button" aria-label="Previous story" onClick={() => setActiveStory((index) => (index + stories.length - 1) % stories.length)}><ChevronLeft size={18} /></button>
              <button type="button" aria-label="Next story" onClick={() => setActiveStory((index) => (index + 1) % stories.length)}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="home-stories__stage">
            <blockquote className="home-stories__feature">
              <span className="home-stories__mark" aria-hidden="true">“</span>
              <span className="home-stories__stars" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={15} aria-hidden="true" />)}</span>
              <p>{featuredStory?.quote}</p>
              <div className="home-stories__person">
                <span className="home-stories__avatar" aria-hidden="true">{featuredStory?.name.slice(0, 1)}</span>
                <span>
                  <strong>{featuredStory?.name}</strong>
                  <em>{featuredStory?.place} · {featuredStory?.item}</em>
                </span>
              </div>
              <div className="home-stories__actions">
                <Button variant="hero" onClick={() => featuredStory && openNamedCategory(featuredStory.category)}>Shop this piece <ArrowRight size={16} aria-hidden="true" /></Button>
                <button type="button" className="home-stories__ghost" onClick={() => setActiveStory((index) => (index + 1) % stories.length)}>Next story <ChevronRight size={16} aria-hidden="true" /></button>
              </div>
            </blockquote>
            <div className="home-stories__rail">
              {stories.map((story, index) => (
                <button key={story.name} type="button" className={`home-stories__card ${activeStory === index ? "home-stories__card--active" : ""}`} aria-pressed={activeStory === index} onClick={() => setActiveStory(index)}>
                  <span className="home-stories__avatar" aria-hidden="true">{story.name.slice(0, 1)}</span>
                  <span>
                    <strong>{story.name}</strong>
                    <em>{story.place}</em>
                    <small>{story.item}</small>
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="home-stories__banner">
            <div>
              <strong>Find the piece they would not return.</strong>
              <span>Shop the same collections, with the same quiet finish.</span>
            </div>
            <div className="home-stories__actions">
              <Button variant="hero" onClick={() => scrollTo("collections")}>Shop the collection <ArrowRight size={16} aria-hidden="true" /></Button>
              <button type="button" className="home-stories__line" onClick={() => scrollTo("about")}>About Luxora <ArrowRight size={15} aria-hidden="true" /></button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section"><div className="about-inner"><p className="collections-kicker">ABOUT LUXORA</p><h2>{site.about.title}</h2><p>{site.about.text}</p><Button variant="hero" onClick={() => scrollTo("collections")}>Explore collections <ArrowRight size={18} /></Button></div></section>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__brand">
            <a href="#home" className="brand" onClick={(event) => { event.preventDefault(); scrollTo("home"); }}>
              <span className="brand__mark"><ShoppingBag size={28} strokeWidth={1.7} aria-hidden="true" /></span>
              <span className="brand__words"><strong>Luxora</strong><small>STYLE · QUALITY · YOU</small></span>
            </a>
            <p>Bottles, undergarments, watches and the pieces that finish a room — chosen for daily life.</p>
            <SocialLinks />
          </div>
          <div>
            <h2>Shop</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id}><button type="button" onClick={() => chooseCategory(category.id)}>{category.name}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Visit</h2>
            <ul>
              <li><button type="button" onClick={() => scrollTo("home")}>Home</button></li>
              <li><button type="button" onClick={() => scrollTo("collections")}>Collections</button></li>
              <li><button type="button" onClick={() => scrollTo("stories")}>Customer stories</button></li>
              <li><button type="button" onClick={() => scrollTo("about")}>About</button></li>
            </ul>
          </div>
          <div>
            <h2>Care</h2>
            <ul>
              <li><button type="button" onClick={() => scrollTo("promise")}>Shipping</button></li>
              <li><button type="button" onClick={() => scrollTo("promise")}>Secure payments</button></li>
              <li><button type="button" onClick={() => scrollTo("promise")}>Easy returns</button></li>
              <li><button type="button" onClick={() => { setCartOpen(true); closeMenus(); }}>Your cart</button></li>
              <li><Link to="/receipts">Receipts received</Link></li>
              <li><Link to={session ? "/admin" : "/login"}>{session ? "Admin" : "Admin login"}</Link></li>
            </ul>
          </div>
        </div>
        <div className="site-footer__bar">
          <span>© {new Date().getFullYear()} Luxora. All rights reserved.</span>
          <span>Style · Quality · You</span>
        </div>
      </footer>
      {cartOpen && (
        <div className="cart-layer">
          <button type="button" className="cart-backdrop" aria-label="Close cart" onClick={() => setCartOpen(false)} />
          <aside className="cart-drawer" aria-label="Shopping cart">
            <header className="cart-drawer__head">
              <h2>Your cart <span>({cartCount})</span></h2>
              <button type="button" aria-label="Close cart" onClick={() => setCartOpen(false)}><X size={20} /></button>
            </header>
            {cart.length === 0 ? (
              <p className="cart-drawer__empty">Your cart is empty. Add a piece from any category.</p>
            ) : (
              <ul className="cart-drawer__list">
                {cart.map((item) => (
                  <li key={item.id}>
                    <img src={item.image} alt="" width={72} height={72} />
                    <div>
                      <strong>{item.name}</strong>
                      <small>{item.category}</small>
                      <b>{formatPrice(item.price)}</b>
                      <div className="cart-qty">
                        <button type="button" aria-label={`Decrease ${item.name}`} onClick={() => changeQty(item.id, -1)}><Minus size={14} /></button>
                        <span>{item.qty}</span>
                        <button type="button" aria-label={`Increase ${item.name}`} onClick={() => changeQty(item.id, 1)}><Plus size={14} /></button>
                        <button type="button" className="cart-remove" aria-label={`Remove ${item.name}`} onClick={() => changeQty(item.id, -item.qty)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <footer className="cart-drawer__foot">
              <div><span>Total</span><strong>{formatPrice(cartTotal)}</strong></div>
              <div className="cart-drawer__actions">
                <Button variant="hero" disabled={cart.length === 0} onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}>Choose payment</Button>
                <button type="button" onClick={() => setCartOpen(false)}>Continue shopping</button>
              </div>
            </footer>
          </aside>
        </div>
      )}
      {checkoutOpen && (
        <CheckoutPanel
          items={cart}
          total={cartTotal}
          onClose={() => setCheckoutOpen(false)}
          onPaid={() => setCart([])}
        />
      )}
    </main>
  );
}
