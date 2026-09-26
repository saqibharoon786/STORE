import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Gem, Headphones, Menu, RotateCcw, Search, ShieldCheck, ShoppingBag, Sparkles, Star, Truck, X } from "lucide-react";
import { SocialLinks } from "@/components/social-links";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/luxora-still-life.jpg";
import bottlesImage from "@/assets/category-bottles.jpg";
import garmentsImage from "@/assets/category-undergarments.jpg";
import brasImage from "@/assets/category-bras.jpg";
import nightiesImage from "@/assets/category-nighties.jpg";
import umbrellasImage from "@/assets/category-umbrellas.jpg";
import watchesImage from "@/assets/category-watches.jpg";
import homeDecorImage from "@/assets/category-homedecor.jpg";
import editsGarments from "@/assets/ug-hero.jpg";
import editsDecor from "@/assets/homedecor-hero.jpg";
import pickBra from "@/assets/category-bras.jpg";
import pickNightie from "@/assets/category-nighties.jpg";
import pickClock from "@/assets/homedecor-clock.jpg";
import pickLamp from "@/assets/homedecor-lamp.jpg";

const categories = [
  { name: "Bottles", sub: "Fragrances", tagline: "Fragrances for every mood", image: bottlesImage, description: "A considered collection of bottles for your everyday routine." },
  { name: "Under Garments", sub: "Comfort & Style", tagline: "Comfort meets style", image: garmentsImage, description: "The foundations of a wardrobe that feels as good as it looks." },
  { name: "Bras", sub: "Support & Comfort", tagline: "Support & elegance", image: brasImage, description: "Everyday support crafted with elegance and care." },
  { name: "Nighties", sub: "For Cozy Nights", tagline: "For your cozy nights", image: nightiesImage, description: "Soft, dreamy pieces made for your coziest nights." },
  { name: "Umbrellas", sub: "Stay Protected", tagline: "Stay protected in style", image: umbrellasImage, description: "Thoughtful protection for whatever the day brings." },
  { name: "Watches", sub: "Timeless Elegance", tagline: "Timeless elegance", image: watchesImage, description: "Timeless details designed to stay with you." },
  { name: "Home Decoration", sub: "Beautify Your Space", tagline: "Beautify your space", image: homeDecorImage, description: "Warm accents that turn a house into a home." },
] as const;

type CategoryName = (typeof categories)[number]["name"];

const edits = [
  { name: "Under Garments" as CategoryName, kicker: "UNDER GARMENTS", title: "Comfort meets confidence", line: "Lace, satin and everyday pieces, made to feel as good as they look.", image: editsGarments },
  { name: "Home Decoration" as CategoryName, kicker: "HOME DECORATION", title: "For a beautiful home", line: "Warm accents that give a room its mood, from light to the last detail.", image: editsDecor },
];

const favorites = [
  { name: "Lace Push-Up Bra", price: "Rs. 2,499", category: "Under Garments" as CategoryName, image: pickBra },
  { name: "Satin Nightie", price: "Rs. 3,199", category: "Under Garments" as CategoryName, image: pickNightie },
  { name: "Modern Wall Clock", price: "Rs. 3,499", category: "Home Decoration" as CategoryName, image: pickClock },
  { name: "Crystal Table Lamp", price: "Rs. 4,299", category: "Home Decoration" as CategoryName, image: pickLamp },
];

const promises = [
  { icon: Gem, title: "Premium quality", text: "Pieces chosen for fabric, finish and the way they hold up in daily life." },
  { icon: Truck, title: "Fast shipping", text: "Reliable delivery, with free shipping on orders above $50." },
  { icon: ShieldCheck, title: "Secure payments", text: "Checkout stays protected from the first click to the confirmation." },
  { icon: RotateCcw, title: "Easy returns", text: "Changed your mind? Send it back without a long process." },
];

const stories = [
  { quote: "The lace set feels expensive without trying too hard. It has become the piece I reach for every day.", name: "Ayesha", place: "Lahore", item: "Lace Push-Up Bra" },
  { quote: "The lamp arrived packed with care and looks exactly like the photograph. The room feels finished.", name: "Hina", place: "Karachi", item: "Crystal Table Lamp" },
  { quote: "Finally a store that treats undergarments and home pieces with the same quiet taste.", name: "Sara", place: "Islamabad", item: "Luxora edit" },
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

const categorySlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

function Index() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(null);
  const [activePromise, setActivePromise] = useState(0);
  const [activeStory, setActiveStory] = useState(0);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    setCategoryMenuOpen(false);
    setSearchOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const chooseCategory = (name: CategoryName) => {
    setSelectedCategory(name);
    setMenuOpen(false);
    setCategoryMenuOpen(false);
    setSearchOpen(false);
    navigate({ to: "/category/$slug", params: { slug: categorySlug(name) } });
  };

  const currentCategory = categories.find((category) => category.name === selectedCategory);
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
                {categoryMenuOpen && <div id="category-dropdown" className="nav-dropdown__panel">{categories.map((category) => <Button key={category.name} type="button" variant="ghost" onClick={() => chooseCategory(category.name)}>{category.name}<ArrowRight size={15} aria-hidden="true" /></Button>)}</div>}
              </div>
              <a href="#about" className="nav-link" onClick={(event) => { event.preventDefault(); scrollTo("about"); }}>About</a>
            </nav>
            <div className="header-actions">
              <Button type="button" size="icon" variant="ghost" className="header-icon" aria-label={searchOpen ? "Close search" : "Search categories"} aria-expanded={searchOpen} onClick={() => { setSearchOpen((open) => !open); setCategoryMenuOpen(false); }}>
                {searchOpen ? <X size={22} /> : <Search size={22} />}
              </Button>
              <SocialLinks />
              <Button type="button" size="icon" variant="ghost" className="header-icon header-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen((open) => !open)}>
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
          {searchOpen && <div className="search-panel"><label htmlFor="category-search">Search collections</label><input id="category-search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories..." autoFocus /><div className="search-results">{results.length ? results.map((category) => <Button key={category.name} type="button" variant="ghost" onClick={() => chooseCategory(category.name)}>{category.name}<ArrowRight size={16} aria-hidden="true" /></Button>) : <p>No categories found.</p>}</div></div>}
          {menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            <a href="#home" onClick={(event) => { event.preventDefault(); scrollTo("home"); }}>Home</a>
            <a href="#collections" onClick={(event) => { event.preventDefault(); scrollTo("collections"); }}>Shop</a>
            <span className="mobile-nav__label">Categories</span>
            {categories.map((category) => <Button type="button" variant="ghost" key={category.name} onClick={() => chooseCategory(category.name)}>{category.name}<ArrowRight size={15} /></Button>)}
            <a href="#about" onClick={(event) => { event.preventDefault(); scrollTo("about"); }}>About</a>
          </nav>}
        </header>
        <div className="luxora-hero__content">
          <p className="hero-eyebrow">PREMIUM LIFESTYLE STORE</p>
          <h1>Elevate Your<br /><span>Everyday Style</span></h1>
          <p className="hero-description">Discover high-quality products in bottles, undergarments, umbrellas, and watches — all in one place.</p>
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
            <button key={category.name} type="button" className="category-pill" onClick={() => chooseCategory(category.name)}>
              <span className="category-pill__image"><img src={category.image} alt="" width={768} height={1024} loading="lazy" /></span>
              <span className="category-pill__name">{category.name}</span>
              <span className="category-pill__sub">{category.sub}</span>
            </button>
          ))}
        </div>
      </section>

      <section id="collections" className="collections-section">
        <div className="collections-inner">
          <div className="collections-heading">
            <div><p className="collections-kicker">FEATURED CATEGORIES</p><h2>Shop by Category</h2><p className="collections-lead">Explore our handpicked collections and find what suits your style.</p></div>
            <a href="#collections" className="collections-viewall" onClick={(event) => { event.preventDefault(); setSelectedCategory(null); scrollTo("collections"); }}>View All Categories <ArrowRight size={16} aria-hidden="true" /></a>
          </div>
          <div className="collections-grid">
            {categories.map((category) => (
              <button key={category.name} type="button" className={`category-tile ${selectedCategory === category.name ? "category-tile--selected" : ""}`} onClick={() => chooseCategory(category.name)} aria-pressed={selectedCategory === category.name}>
                <img src={category.image} alt="" width={768} height={1024} loading="lazy" />
                <span className="category-tile__overlay">
                  <span className="category-tile__title">{category.name}</span>
                  <span className="category-tile__sub">{category.tagline}</span>
                  <span className="category-tile__cta">Shop Now <ArrowRight size={15} aria-hidden="true" /></span>
                </span>
              </button>
            ))}
          </div>
          {currentCategory && <div id="category-focus" className="category-focus" aria-live="polite"><div><p className="collections-kicker">SELECTED COLLECTION</p><h3>{currentCategory.name}</h3><p>{currentCategory.description}</p></div><Button variant="outline" onClick={() => setSelectedCategory(null)}>View all categories <ArrowRight size={17} /></Button></div>}
        </div>
      </section>

      <section className="home-band" id="edits" aria-label="Signature edits">
        <div className="home-band__inner">
          <div className="home-band__head">
            <p className="collections-kicker">SIGNATURE EDITS</p>
            <h2>Two collections, made to linger.</h2>
          </div>
          <div className="home-edits">
            {edits.map((edit) => (
              <button key={edit.name} type="button" className="home-edit" onClick={() => chooseCategory(edit.name)}>
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

      <section className="home-band home-band--sand" id="favorites" aria-label="Customer favorites">
        <div className="home-band__inner">
          <div className="home-band__head">
            <p className="collections-kicker">MOST LOVED</p>
            <h2>Customer favorites</h2>
            <p>A short list of pieces people come back for.</p>
          </div>
          <div className="home-picks">
            {favorites.map((item) => (
              <button key={item.name} type="button" className="home-pick" onClick={() => chooseCategory(item.category)}>
                <img src={item.image} alt={item.name} width={640} height={640} />
                <span className="home-pick__body">
                  <small>{item.category}</small>
                  <strong>{item.name}</strong>
                  <span className="home-pick__foot"><b>{item.price}</b><em>Shop <ArrowRight size={14} aria-hidden="true" /></em></span>
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

      <section className="home-band home-band--sand" id="stories" aria-label="Customer stories">
        <div className="home-band__inner">
          <div className="home-band__head home-band__head--row">
            <div>
              <p className="collections-kicker">FROM OUR CUSTOMERS</p>
              <h2>Worn, lived with, loved.</h2>
            </div>
            <div className="home-story__nav">
              <button type="button" aria-label="Previous story" onClick={() => setActiveStory((index) => (index + stories.length - 1) % stories.length)}><ChevronLeft size={18} /></button>
              <button type="button" aria-label="Next story" onClick={() => setActiveStory((index) => (index + 1) % stories.length)}><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="home-story">
            <blockquote className="home-story__quote">
              <span className="home-story__stars" aria-label="5 out of 5 stars">{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={14} aria-hidden="true" />)}</span>
              <p>{stories[activeStory].quote}</p>
              <footer><strong>{stories[activeStory].name}</strong><span>{stories[activeStory].place} · {stories[activeStory].item}</span></footer>
            </blockquote>
            <div className="home-story__list">
              {stories.map((story, index) => (
                <button key={story.name} type="button" className={`home-story__chip ${activeStory === index ? "home-story__chip--active" : ""}`} aria-pressed={activeStory === index} onClick={() => setActiveStory(index)}>
                  <strong>{story.name}</strong>
                  <span>{story.place}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section"><div className="about-inner"><p className="collections-kicker">ABOUT LUXORA</p><h2>Style in the everyday.</h2><p>From the details you wear to the essentials you carry, Luxora brings together pieces made for daily life.</p><Button variant="hero" onClick={() => scrollTo("collections")}>Explore collections <ArrowRight size={18} /></Button></div></section>
    </main>
  );
}
