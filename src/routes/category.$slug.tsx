// ============= Full file contents =============

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { UndergarmentsPage } from "@/components/undergarments-page";
import { SocialLinks } from "@/components/social-links";
import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ChevronDown,
  Gem,
  Heart,
  Headphones,
  RotateCcw,
  ShoppingBag,
  ShoppingCart,
  Sofa,
  Sparkles,
  Star,
  Truck,
  User,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
} from "lucide-react";
import decorHero from "@/assets/homedecor-hero.jpg";
import wallArtImage from "@/assets/homedecor-wallart.jpg";
import tableDecorImage from "@/assets/homedecor-tabledecor.jpg";
import lightingImage from "@/assets/homedecor-lighting.jpg";
import rugsImage from "@/assets/homedecor-rugs.jpg";
import cushionsImage from "@/assets/homedecor-cushions.jpg";
import kitchenImage from "@/assets/homedecor-kitchen.jpg";
import plantsImage from "@/assets/homedecor-plants.jpg";
import clockImage from "@/assets/homedecor-clock.jpg";
import lampImage from "@/assets/homedecor-lamp.jpg";
import vasesImage from "@/assets/homedecor-vases.jpg";
import framesImage from "@/assets/homedecor-frames.jpg";
import candleImage from "@/assets/homedecor-candle.jpg";
import plantPotImage from "@/assets/homedecor-plantpot.jpg";
import ctaImage from "@/assets/homedecor-cta.jpg";

const pages = {
  "home-decoration": {
    title: "Home Decorations | Luxora",
    description: "Shop premium home decor — wall art, lighting, rugs, cushion covers and more to beautify your space.",
    ogDescription: "Elegant home decor items that add warmth, charm and personality to your space.",
  },
  "under-garments": {
    title: "Undergarments | Luxora",
    description: "Discover our premium collection of bras, panties, nightwear and more — designed for your comfort, style and everyday confidence.",
    ogDescription: "Comfort meets confidence. Shop bras, panties, nighties, shapewear and loungewear at Luxora.",
  },
} as const;

type CategorySlug = keyof typeof pages;

const categorySlug = "home-decoration";

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
  { name: "Wall Art", tagline: "Add character to your walls", image: wallArtImage },
  { name: "Table Decor", tagline: "Small details, big impact", image: tableDecorImage },
  { name: "Lighting", tagline: "Create the perfect ambiance", image: lightingImage },
  { name: "Rugs & Carpets", tagline: "Comfort under your feet", image: rugsImage },
  { name: "Cushion Covers", tagline: "Style your seating area", image: cushionsImage },
  { name: "Kitchen Decor", tagline: "Functional & beautiful", image: kitchenImage },
  { name: "Plants & Planters", tagline: "Bring nature home", image: plantsImage },
] as const;

const products = [
  { name: "Modern Wall Clock", price: "Rs. 3,499", oldPrice: null as string | null, rating: 4.5, reviews: 124, badge: "Bestseller", image: clockImage },
  { name: "Crystal Table Lamp", price: "Rs. 4,299", oldPrice: null, rating: 4.5, reviews: 89, badge: "New", image: lampImage },
  { name: "Ceramic Vase Set", price: "Rs. 2,899", oldPrice: null, rating: 4.5, reviews: 67, badge: "Hot", image: vasesImage },
  { name: "Wall Art Frame Set", price: "Rs. 3,199", oldPrice: "Rs. 4,499", rating: 4.5, reviews: 140, badge: "Sale", image: framesImage },
  { name: "Candle Holder", price: "Rs. 1,799", oldPrice: null, rating: 4.5, reviews: 92, badge: null as string | null, image: candleImage },
  { name: "Indoor Plant with Planter", price: "Rs. 2,499", oldPrice: null, rating: 4.5, reviews: 58, badge: null, image: plantPotImage },
] as const;

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const page = pages[params.slug as CategorySlug];
    if (!page) throw notFound();
    return { slug: params.slug as CategorySlug, ...page };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: loaderData.title },
            { name: "description", content: loaderData.description },
            { property: "og:title", content: loaderData.title },
            { property: "og:description", content: loaderData.ogDescription },
            { property: "og:type", content: "website" },
            { name: "twitter:card", content: "summary_large_image" },
          ],
          links:
            loaderData.slug === "under-garments"
              ? [{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Great+Vibes&display=swap" }]
              : [],
        }
      : {
          meta: [{ title: "Coming soon | Luxora" }, { name: "robots", content: "noindex" }],
        },
  notFoundComponent: CategoryComingSoon,
  component: CategoryRoute,
});

function CategoryRoute() {
  const { slug } = Route.useLoaderData();
  if (slug === "under-garments") return <UndergarmentsPage />;
  return <CategoryPage />;
}

function Stars({ value }: { value: number }) {
  return (
    <span className="star-row" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((index) => {
        if (value >= index) return <Star key={index} className="star star--full" size={13} aria-hidden="true" />;
        if (value >= index - 0.5) {
          return (
            <span key={index} className="star-half">
              <Star size={13} aria-hidden="true" />
              <Star size={13} aria-hidden="true" className="star star--full star-half__fill" />
            </span>
          );
        }
        return <Star key={index} className="star" size={13} aria-hidden="true" />;
      })}
    </span>
  );
}

function CategoryPage() {
  const [wishlist, setWishlist] = useState<ReadonlySet<string>>(new Set());
  const [cartCount, setCartCount] = useState(9);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleWishlist = (name: string) => {
    setWishlist((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const addToCart = (name: string) => {
    setCartCount((count) => count + 1);
    toggleWishlist(name);
  };

  const scrollToSection = (id: string) => {
    setCategoryMenuOpen(false);
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="cat-page">
      <div className="cat-topbar">
        <div className="cat-topbar__inner">
          <span className="cat-topbar__item"><Truck size={15} aria-hidden="true" /> Free Shipping on Orders Above $50</span>
          <span className="cat-topbar__item"><Star size={14} aria-hidden="true" /> Premium Quality Products</span>
          <span className="cat-topbar__item"><Sparkles size={15} aria-hidden="true" /> Secure Payments</span>
        </div>
      </div>

      <header className="cat-header">
        <div className="cat-header__inner">
          <Link to="/" className="cat-brand" aria-label="Luxora home">
            <span className="cat-brand__mark"><ShoppingBag size={34} strokeWidth={1.6} aria-hidden="true" /></span>
            <span className="cat-brand__words"><strong>Luxora</strong><small>STYLE · QUALITY · YOU</small></span>
          </Link>
          <nav className="cat-nav" aria-label="Category navigation">
            <Link to="/" className="cat-nav__link">Home</Link>
            <button type="button" className="cat-nav__link" onClick={() => scrollToSection("cat-products")}>Shop <ChevronDown size={14} aria-hidden="true" /></button>
            <span className="cat-dropdown">
              <button type="button" className="cat-nav__link" aria-expanded={categoryMenuOpen} onClick={() => setCategoryMenuOpen((open) => !open)}>
                Categories <ChevronDown size={14} aria-hidden="true" />
              </button>
              {categoryMenuOpen && (
                <div className="cat-dropdown__panel">
                  {navCategories.map((category) => (
                    <Link key={category.slug} to="/category/$slug" params={{ slug: category.slug }} className="cat-dropdown__item" onClick={() => setCategoryMenuOpen(false)}>
                      {category.name}<ArrowRight size={14} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              )}
            </span>
            <button type="button" className="cat-nav__link" onClick={() => scrollToSection("cat-cta")}>About</button>
            <button type="button" className="cat-nav__link" onClick={() => scrollToSection("cat-cta")}>Contact</button>
          </nav>
          <div className="cat-header__actions">
            <button type="button" className="cat-icon" aria-label="Search products"><Search size={20} aria-hidden="true" /></button>
            <button type="button" className="cat-icon" aria-label="Your account"><User size={20} aria-hidden="true" /></button>
            <button type="button" className="cat-icon" aria-label={`Cart, ${cartCount} items`}>
              <ShoppingCart size={21} aria-hidden="true" />
              {cartCount > 0 && <span className="cat-cart-badge">{cartCount}</span>}
            </button>
            <SocialLinks />
            <button type="button" className="cat-icon cat-menu-button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} onClick={() => setMobileMenuOpen((open) => !open)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <button type="button" onClick={() => scrollToSection("cat-products")}>Shop</button>
            <span className="mobile-nav__label">Categories</span>
            {navCategories.map((category) => (
              <Link key={category.slug} to="/category/$slug" params={{ slug: category.slug }} onClick={() => setMobileMenuOpen(false)}>{category.name}</Link>
            ))}
          </nav>
        )}
      </header>

      <section className="cat-hero">
        <img className="cat-hero__image" src={decorHero} alt="A warmly lit living room styled with a vase, candle and golden decor on a marble tray" width={1920} height={1080} fetchPriority="high" />
        <div className="cat-hero__shade" aria-hidden="true" />
        <button type="button" className="cat-hero__arrow cat-hero__arrow--left" aria-label="Previous slide"><ChevronLeft size={22} aria-hidden="true" /></button>
        <button type="button" className="cat-hero__arrow cat-hero__arrow--right" aria-label="Next slide"><ChevronRight size={22} aria-hidden="true" /></button>
        <div className="cat-hero__inner">
          <p className="cat-hero__eyebrow">PREMIUM COLLECTION</p>
          <h1>Home Decorations<em>For a Beautiful Home</em></h1>
          <p className="cat-hero__desc">Discover elegant and stylish home decor items that add warmth, charm and personality to your space.</p>
          <button type="button" className="gold-button" onClick={() => scrollToSection("cat-products")}>Shop Home Decor <ArrowRight size={17} aria-hidden="true" /></button>
          <div className="cat-hero__features">
            <div><BadgeCheck aria-hidden="true" /><span>Premium<br />Quality</span></div>
            <div><Gem aria-hidden="true" /><span>Unique<br />Designs</span></div>
            <div><Truck aria-hidden="true" /><span>Fast &amp; Reliable<br />Shipping</span></div>
            <div><Headphones aria-hidden="true" /><span>24/7<br />Support</span></div>
          </div>
        </div>
        <div className="cat-hero__dots" aria-hidden="true"><span /><span className="cat-hero__dots-active" /><span /></div>
      </section>

      <section className="cat-section" id="cat-subcategories" aria-label="Home decor subcategories">
        <div className="cat-section__head">
          <div>
            <p className="cat-kicker">SHOP BY CATEGORY</p>
            <h2>Home Decor Categories</h2>
            <p className="cat-section__lead">Explore our wide range of home decoration items and find the perfect style for your space.</p>
          </div>
          <Link to="/" className="cat-viewall">View All Categories <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="subcat-grid">
          {subcategories.map((sub) => (
            <button key={sub.name} type="button" className="subcat-card" onClick={() => scrollToSection("cat-products")}>
              <span className="subcat-card__img"><img src={sub.image} alt="" width={816} height={816} loading="lazy" /></span>
              <span className="subcat-card__body">
                <span className="subcat-card__name">{sub.name} <ArrowRight size={15} aria-hidden="true" /></span>
                <span className="subcat-card__sub">{sub.tagline}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="cat-section" id="cat-products" aria-label="Featured home decor products">
        <div className="cat-section__head">
          <div>
            <p className="cat-kicker">BEST SELLERS</p>
            <h2>Featured Home Decor</h2>
            <p className="cat-section__lead">Handpicked pieces to make your home more beautiful and inviting.</p>
          </div>
          <Link to="/" className="cat-viewall">View All Products <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.name} className="product-card">
              <div className="product-card__media">
                <img src={product.image} alt={product.name} width={816} height={816} loading="lazy" />
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <button
                  type="button"
                  className={`product-wish ${wishlist.has(product.name) ? "product-wish--active" : ""}`}
                  aria-label={wishlist.has(product.name) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
                  aria-pressed={wishlist.has(product.name)}
                  onClick={() => toggleWishlist(product.name)}
                >
                  <Heart size={17} aria-hidden="true" />
                </button>
              </div>
              <div className="product-card__body">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                  <Stars value={product.rating} />
                  <span className="product-rating__count">({product.reviews})</span>
                </div>
                <div className="product-foot">
                  <span className="product-price">{product.price}{product.oldPrice && <s>{product.oldPrice}</s>}</span>
                  <button type="button" className="product-cart" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product.name)}>
                    <ShoppingCart size={17} aria-hidden="true" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="cat-cta" id="cat-cta" aria-label="Make your space more beautiful">
        <div className="cat-cta__inner">
          <img className="cat-cta__image" src={ctaImage} alt="" width={1920} height={768} loading="lazy" />
          <div className="cat-cta__content">
            <p className="cat-cta__script">Make Your Space</p>
            <h2>More Beautiful</h2>
            <p className="cat-cta__desc">Premium home decor to match your unique style.</p>
            <button type="button" className="gold-button" onClick={() => scrollToSection("cat-products")}>Explore Collection <ArrowRight size={17} aria-hidden="true" /></button>
          </div>
          <ul className="cat-cta__list">
            <li><Sparkles aria-hidden="true" /> Stylish &amp; Modern Designs</li>
            <li><Gem aria-hidden="true" /> Premium Quality Materials</li>
            <li><Sofa aria-hidden="true" /> Perfect for Every Room</li>
            <li><RotateCcw aria-hidden="true" /> Easy Returns</li>
          </ul>
        </div>
      </section>
    </div>
  );
}

function CategoryComingSoon() {
  return (
    <div className="cat-page cat-comingsoon">
      <ShoppingBag size={44} strokeWidth={1.4} aria-hidden="true" />
      <h1>This collection is coming soon</h1>
      <p>We are preparing something beautiful for you. In the meantime, explore our Home Decorations collection.</p>
      <div className="cat-comingsoon__actions">
        <Link to="/" className="gold-button">Back to Home</Link>
        <Link to="/category/$slug" params={{ slug: categorySlug }} className="cat-viewall">Shop Home Decor <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
    </div>
  );
}
