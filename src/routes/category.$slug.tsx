import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, ShoppingBag, ShoppingCart, UserRound } from "lucide-react";
import { CheckoutPanel } from "@/components/checkout-panel";
import { SocialLinks } from "@/components/social-links";
import { formatPrice } from "@/lib/checkout";
import { useAdminSession, useClientReady, useSiteStore, type StoreProduct } from "@/lib/site-store";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => ({ slug: params.slug }),
  head: () => ({
    meta: [
      { title: "Collection | Luxora" },
      { name: "description", content: "Shop this Luxora collection." },
    ],
  }),
  component: CategoryShop,
});

type CartLine = { id: string; name: string; category: string; price: number; image: string; qty: number };

function CategoryShop() {
  const data = Route.useLoaderData();
  const ready = useClientReady();
  const session = useAdminSession();
  const site = useSiteStore();
  const category = site.categories.find((item) => item.id === data.slug);
  const items = category ? site.products.filter((product) => product.categoryId === category.id) : [];
  const [cart, setCart] = useState<CartLine[]>([]);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const cartCount = cart.reduce((total, item) => total + item.qty, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const addToCart = (product: StoreProduct) => {
    if (!category) return;
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) return current.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      return [...current, { id: product.id, name: product.name, category: category.name, price: product.price, image: product.image, qty: 1 }];
    });
  };

  return (
    <main className="shop-page">
      <header className="shop-page__bar">
        <Link to="/" className="shop-page__brand">
          <ShoppingBag size={22} aria-hidden="true" />
          <span>Luxora</span>
        </Link>
        <Link to="/" className="shop-page__back"><ArrowLeft size={16} aria-hidden="true" /> All categories</Link>
        <div className="shop-page__tools">
          <SocialLinks />
          <Link to={session ? "/admin" : "/login"} className="shop-page__admin" aria-label={session ? "Open admin" : "Admin login"}>
            <UserRound size={18} aria-hidden="true" />
          </Link>
          <button type="button" className="shop-page__cart" disabled={cartCount === 0} onClick={() => setCheckoutOpen(true)}>
            <ShoppingCart size={18} aria-hidden="true" />
            Cart {cartCount > 0 && <span>{cartCount}</span>}
          </button>
        </div>
      </header>
      {!category && !ready ? (
        <section className="shop-page__inner"><p className="shop-page__lead">Loading collection…</p></section>
      ) : !category ? (
        <section className="shop-page__inner">
          <h1>Collection not found</h1>
          <p className="shop-page__lead">This category is not on the website.</p>
          <Link to="/" className="shop-page__back">Back home</Link>
        </section>
      ) : (
        <>
          <section className="shop-page__inner">
            <p className="collections-kicker">{category.sub.toUpperCase()}</p>
            <h1>{category.name}</h1>
            <p className="shop-page__lead">{category.description} Every piece in this collection is below.</p>
            {items.length === 0 && <p className="shop-page__lead">No products in this category yet.</p>}
            <div className="home-cat__grid">
              {items.map((product) => {
                const inCart = cart.some((item) => item.id === product.id);
                return (
                  <article key={product.id} className="home-product">
                    <img src={product.image} alt={product.name} width={768} height={768} />
                    <div className="home-product__body">
                      <strong>{product.name}</strong>
                      <div className="home-product__foot">
                        <b>{formatPrice(product.price)}</b>
                        <button type="button" className={`home-product__cart ${inCart ? "home-product__cart--added" : ""}`} onClick={() => addToCart(product)}>
                          {inCart ? <Check size={16} aria-hidden="true" /> : <ShoppingCart size={16} aria-hidden="true" />}
                          {inCart ? "Added" : "Add to cart"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
          <nav className="shop-page__cats" aria-label="Other categories">
            {site.categories.map((item) => (
              <Link key={item.id} to="/category/$slug" params={{ slug: item.id }} className={item.id === category.id ? "is-current" : ""}>
                {item.name}
              </Link>
            ))}
          </nav>
        </>
      )}
      {checkoutOpen && (
        <CheckoutPanel items={cart} total={cartTotal} onClose={() => setCheckoutOpen(false)} onPaid={() => setCart([])} />
      )}
    </main>
  );
}
