import { Link } from "@tanstack/react-router";
import { SocialLinks } from "@/components/social-links";
import { useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  Gem,
  Heart,
  Leaf,
  Menu,
  Package,
  Search,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Star,
  Truck,
  User,
  X,
} from "lucide-react";
import heroImage from "@/assets/ug-hero.jpg";
import brasImage from "@/assets/category-bras.jpg";
import pantiesImage from "@/assets/ug-panties.jpg";
import nightiesImage from "@/assets/category-nighties.jpg";
import shapewearImage from "@/assets/ug-shapewear.jpg";
import bralettesImage from "@/assets/ug-bralettes.jpg";
import camisolesImage from "@/assets/ug-camisoles.jpg";
import loungewearImage from "@/assets/ug-loungewear.jpg";

const navCategories = [
  { name: "Bottles", slug: "bottles" },
  { name: "Under Garments", slug: "under-garments" },
  { name: "Bras", slug: "bras" },
  { name: "Nighties", slug: "nighties" },
  { name: "Umbrellas", slug: "umbrellas" },
  { name: "Watches", slug: "watches" },
  { name: "Home Decoration", slug: "home-decoration" },
] as const;

const subcategories = [
  { name: "Bras", tagline: "Support & Elegance", image: brasImage },
  { name: "Panties", tagline: "Comfort All Day", image: pantiesImage },
  { name: "Nighties", tagline: "For Cozy Nights", image: nightiesImage },
  { name: "Shapewear", tagline: "Shape Your Confidence", image: shapewearImage },
  { name: "Bralettes", tagline: "Light & Comfortable", image: bralettesImage },
  { name: "Camisoles", tagline: "Everyday Essentials", image: camisolesImage },
  { name: "Loungewear", tagline: "Relax in Style", image: loungewearImage },
] as const;

type Badge = "Best Seller" | "New" | "Sale";

const products = [
  { name: "Lace Push-Up Bra", category: "Bras", price: "Rs. 2,499", oldPrice: null as string | null, rating: 5, reviews: 124, badge: "Best Seller" as Badge, image: brasImage, featured: true },
  { name: "Cotton Panties (3 Pack)", category: "Panties", price: "Rs. 1,799", oldPrice: null, rating: 5, reviews: 89, badge: "New" as Badge, image: pantiesImage, featured: true },
  { name: "Satin Nightie", category: "Nighties", price: "Rs. 3,199", oldPrice: "Rs. 4,499", rating: 5, reviews: 67, badge: "Sale" as Badge, image: nightiesImage, featured: true },
  { name: "High Waist Shapewear", category: "Shapewear", price: "Rs. 2,899", oldPrice: null, rating: 5, reviews: 132, badge: null as Badge | null, image: shapewearImage, featured: true },
  { name: "Seamless Bralette", category: "Bralettes", price: "Rs. 1,599", oldPrice: null, rating: 5, reviews: 76, badge: null, image: bralettesImage, featured: true },
  { name: "Satin Camisole Set", category: "Camisoles", price: "Rs. 2,299", oldPrice: null, rating: 5, reviews: 98, badge: null, image: camisolesImage, featured: true },
  { name: "Satin Lounge Set", category: "Loungewear", price: "Rs. 3,499", oldPrice: null, rating: 5, reviews: 54, badge: null, image: loungewearImage, featured: false },
] as const;

function Stars({ value }: { value: number }) {
  return (
    <span className="star-row" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((index) => (
        <Star key={index} className={value >= index ? "star star--full" : "star"} size={13} aria-hidden="true" />
      ))}
    </span>
  );
}

function LeafArt({ flip = false }: { flip?: boolean }) {
  return (
    <svg className={`ug-leaf ${flip ? "ug-leaf--flip" : ""}`} viewBox="0 0 220 180" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 150c28-8 48-28 62-58 10-22 28-48 62-68" />
        <path d="M48 132c18-6 34-22 42-40" />
        <path d="M62 118c22-2 40-16 52-34" />
        <path d="M78 98c20 2 38-8 54-24" />
        <path d="M96 78c16 4 30-2 46-16" />
        <path d="M36 146c-6-22 2-40 16-54" />
        <path d="M28 128c-14-8-22-24-18-42" />
        <path d="M44 112c-16-2-28-14-30-32" />
        <path d="M70 86c-18 6-34 4-48-8" />
        <path d="M108 62c8 16 8 32 2 48" />
        <path d="M128 48c14 12 22 28 20 46" />
        <path d="M150 38c10 18 8 36-2 52" />
      </g>
    </svg>
  );
}

export function UndergarmentsPage() {
  const [carted, setCarted] = useState<ReadonlySet<string>>(new Set());
  const [cartCount, setCartCount] = useState(0);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const closeMenus = () => {
    setCategoryMenuOpen(false);
    setShopMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    closeMenus();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const chooseCategory = (name: string) => {
    setActiveCategory(name);
    setQuery("");
    scrollToSection("ug-products");
  };

  const visibleProducts = products.filter((product) => {
    const matchesQuery = product.name.toLowerCase().includes(query.trim().toLowerCase());
    if (query.trim()) return matchesQuery && (!activeCategory || product.category === activeCategory);
    if (activeCategory) return product.category === activeCategory;
    return product.featured;
  });

  const addToCart = (name: string) => {
    setCartCount((count) => count + 1);
    setCarted((current) => {
      const next = new Set(current);
      next.add(name);
      return next;
    });
  };

  return (
    <div className="cat-page ug-page">
      <div className="cat-topbar">
        <div className="cat-topbar__inner">
          <span className="cat-topbar__item"><Truck size={15} aria-hidden="true" /> Free Shipping on Orders Above $50</span>
          <span className="cat-topbar__item"><Star size={14} aria-hidden="true" /> Premium Quality Products</span>
          <span className="cat-topbar__item"><Gem size={15} aria-hidden="true" /> Secure Payments</span>
        </div>
      </div>

      <header className="cat-header">
        <div className="cat-header__inner">
          <Link to="/" className="cat-brand" aria-label="Luxora home">
            <span className="cat-brand__mark"><ShoppingBag size={30} strokeWidth={1.6} aria-hidden="true" /></span>
            <span className="cat-brand__words"><strong>Luxora</strong><small>STYLE · QUALITY · YOU</small></span>
          </Link>
          <nav className="cat-nav" aria-label="Undergarments navigation">
            <Link to="/" className="cat-nav__link ug-nav-active">Home</Link>
            <span className="cat-dropdown">
              <button type="button" className="cat-nav__link" aria-expanded={shopMenuOpen} onClick={() => { setShopMenuOpen((open) => !open); setCategoryMenuOpen(false); }}>
                Shop <ChevronDown size={14} aria-hidden="true" />
              </button>
              {shopMenuOpen && (
                <div className="cat-dropdown__panel">
                  {subcategories.map((category) => (
                    <button key={category.name} type="button" className="cat-dropdown__item" onClick={() => chooseCategory(category.name)}>
                      {category.name}<ArrowRight size={14} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}
            </span>
            <span className="cat-dropdown">
              <button type="button" className="cat-nav__link" aria-expanded={categoryMenuOpen} onClick={() => { setCategoryMenuOpen((open) => !open); setShopMenuOpen(false); }}>
                Categories <ChevronDown size={14} aria-hidden="true" />
              </button>
              {categoryMenuOpen && (
                <div className="cat-dropdown__panel">
                  {navCategories.map((category) => (
                    <Link key={category.slug} to="/category/$slug" params={{ slug: category.slug }} className="cat-dropdown__item" onClick={closeMenus}>
                      {category.name}<ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              )}
            </span>
            <button type="button" className="cat-nav__link" onClick={() => scrollToSection("ug-comfort")}>About</button>
            <button type="button" className="cat-nav__link" onClick={() => scrollToSection("ug-comfort")}>Contact</button>
          </nav>
          <div className="cat-header__actions">
            <button type="button" className="cat-icon" aria-label={searchOpen ? "Close search" : "Search products"} aria-expanded={searchOpen} onClick={() => { setSearchOpen((open) => !open); closeMenus(); }}>
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
            <button type="button" className="cat-icon" aria-label="Your account">
              <User size={20} aria-hidden="true" />
            </button>
            <button type="button" className="cat-icon" aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`} onClick={() => scrollToSection("ug-products")}>
              <ShoppingCart size={21} aria-hidden="true" />
              {cartCount > 0 && <span className="cat-cart-badge ug-cart-badge">{cartCount}</span>}
            </button>
            <SocialLinks />
            <button type="button" className="cat-icon cat-menu-button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {searchOpen && (
          <form className="ug-search" role="search" onSubmit={(event) => { event.preventDefault(); scrollToSection("ug-products"); }}>
            <label htmlFor="ug-search">Search undergarments</label>
            <input id="ug-search" type="search" value={query} placeholder="Search bras, panties, nighties..." autoFocus onChange={(event) => { setQuery(event.target.value); setActiveCategory(null); }} />
          </form>
        )}
        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link to="/" onClick={closeMenus}>Home</Link>
            <button type="button" onClick={() => scrollToSection("ug-products")}>Shop</button>
            <span className="mobile-nav__label">Shop by piece</span>
            {subcategories.map((category) => (
              <button key={category.name} type="button" onClick={() => chooseCategory(category.name)}>{category.name}</button>
            ))}
            <span className="mobile-nav__label">Categories</span>
            {navCategories.map((category) => (
              <Link key={category.slug} to="/category/$slug" params={{ slug: category.slug }} onClick={closeMenus}>{category.name}</Link>
            ))}
          </nav>
        )}
      </header>

      <section className="ug-hero-wrap" aria-label="Undergarments collection">
        <div className="ug-hero">
          <div className="ug-hero__copy">
            <p className="ug-kicker">PREMIUM COLLECTION</p>
            <h1>Undergarments</h1>
            <p className="ug-script">Comfort Meets Confidence</p>
            <p className="ug-hero__desc">Discover our premium collection of bras, panties, nightwear and more — designed for your comfort, style and everyday confidence.</p>
            <button type="button" className="ug-btn" onClick={() => scrollToSection("ug-products")}>Shop Now <ArrowRight size={16} aria-hidden="true" /></button>
            <div className="ug-hero__features">
              <div><Leaf aria-hidden="true" /><span>Soft &amp; Breathable<br />Fabrics</span></div>
              <div><ShieldCheck aria-hidden="true" /><span>Perfect Fit<br />For Every Body</span></div>
              <div><Gem aria-hidden="true" /><span>Premium<br />Quality</span></div>
              <div><Truck aria-hidden="true" /><span>Fast &amp; Reliable<br />Shipping</span></div>
            </div>
          </div>
          <div className="ug-hero__visual">
            <img src={heroImage} alt="Blush lace lingerie, a satin robe and a gift box arranged on a sunlit bed" width={1400} height={900} fetchPriority="high" />
            <div className="ug-note" aria-hidden="true"><span>Feel</span><span>Good</span><span>Inside</span></div>
            <div className="ug-dots" aria-hidden="true"><span className="ug-dots__active" /><span /><span /></div>
          </div>
        </div>
      </section>

      <section className="ug-section" aria-label="Undergarment categories">
        <div className="ug-cats">
          {subcategories.map((category) => (
            <button key={category.name} type="button" className={`ug-cat ${activeCategory === category.name ? "ug-cat--active" : ""}`} aria-pressed={activeCategory === category.name} onClick={() => chooseCategory(category.name)}>
              <span className="ug-cat__img"><img src={category.image} alt="" width={400} height={400} /></span>
              <span className="ug-cat__name">{category.name} <ArrowRight size={14} aria-hidden="true" /></span>
              <span className="ug-cat__sub">{category.tagline}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="ug-section" id="ug-products" aria-label="Customer favorite undergarments">
        <div className="ug-section__head">
          <div>
            <p className="ug-kicker">FEATURED PRODUCTS</p>
            <h2>{activeCategory ?? "Customer Favorites"}</h2>
            <p className="ug-lead">{query.trim() ? `Results for “${query.trim()}”` : "Loved by many, made for you."}</p>
          </div>
          <button type="button" className="ug-viewall" onClick={() => { setActiveCategory(null); setQuery(""); }}>View All <ArrowRight size={15} aria-hidden="true" /></button>
        </div>
        {visibleProducts.length === 0 ? (
          <p className="ug-empty">No pieces match that search. Try bras, panties, or nighties.</p>
        ) : (
          <div className="product-grid ug-products">
            {visibleProducts.map((product) => (
              <article key={product.name} className="product-card ug-product">
                <div className="product-card__media">
                  <img src={product.image} alt={product.name} width={640} height={640} />
                  {product.badge && <span className={`product-badge ug-badge ug-badge--${product.badge === "Best Seller" ? "best" : product.badge.toLowerCase()}`}>{product.badge}</span>}
                </div>
                <div className="product-card__body">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-rating">
                    <Stars value={product.rating} />
                    <span className="product-rating__count">({product.reviews})</span>
                  </div>
                  <div className="product-foot">
                    <span className="product-price">{product.price}{product.oldPrice && <s>{product.oldPrice}</s>}</span>
                    <button type="button" className={`product-cart ug-cart ${carted.has(product.name) ? "ug-cart--added" : ""}`} aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product.name)}>
                      <ShoppingCart size={16} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="ug-banner-wrap" id="ug-comfort" aria-label="Because you deserve the best comfort">
        <div className="ug-banner">
          <LeafArt />
          <div className="ug-banner__copy">
            <p className="ug-script">Because You Deserve</p>
            <h2>The Best Comfort</h2>
          </div>
          <ul className="ug-banner__perks">
            <li><Leaf aria-hidden="true" /><span>Skin Friendly<br />Fabrics</span></li>
            <li><Heart aria-hidden="true" /><span>All Day<br />Comfort</span></li>
            <li><Package aria-hidden="true" /><span>Discreet<br />Packaging</span></li>
            <li><Truck aria-hidden="true" /><span>Fast &amp; Reliable<br />Shipping</span></li>
          </ul>
          <button type="button" className="ug-btn ug-btn--dark" onClick={() => scrollToSection("ug-products")}>Shop Now <ArrowRight size={16} aria-hidden="true" /></button>
          <LeafArt flip />
        </div>
      </section>
    </div>
  );
}
