import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ExternalLink, ImagePlus, LayoutDashboard, LogOut, Package, Shapes, ShoppingBag, Type } from "lucide-react";
import {
  fileToImage,
  logout,
  removeCategory,
  removeProduct,
  resetSite,
  saveCategory,
  saveHomepage,
  saveProduct,
  useAdminSession,
  useClientReady,
  useSiteStore,
  type StoreAbout,
  type StoreCategory,
  type StoreHero,
  type StoreProduct,
} from "@/lib/site-store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin | Luxora" },
      { name: "description", content: "Upload categories and products to the Luxora storefront." },
    ],
  }),
  component: AdminPage,
});

type Section = "overview" | "categories" | "products" | "homepage";

const emptyCategory = { id: "", name: "", sub: "", tagline: "", description: "", image: "" };
const emptyProduct = { id: "", name: "", categoryId: "", price: "", image: "", preview: true };

function AdminPage() {
  const navigate = useNavigate();
  const ready = useClientReady();
  const session = useAdminSession();
  const site = useSiteStore();
  const [section, setSection] = useState<Section>("overview");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && !session) navigate({ to: "/login" });
  }, [ready, session, navigate]);

  const flash = (message: string) => {
    setError("");
    setNotice(message);
  };

  const fail = (reason: unknown) => {
    setNotice("");
    setError(reason instanceof Error ? reason.message : "Something went wrong.");
  };

  if (!ready || !session) {
    return (
      <main className="admin-boot">
        <p>Opening admin…</p>
      </main>
    );
  }

  return (
    <div className="admin-app">
      <aside className="admin-side">
        <Link to="/" className="admin-brand">
          <ShoppingBag size={22} aria-hidden="true" />
          <span>
            <strong>Luxora</strong>
            <small>Admin</small>
          </span>
        </Link>
        <nav className="admin-nav" aria-label="Admin">
          <button type="button" className={section === "overview" ? "is-active" : ""} onClick={() => setSection("overview")}>
            <LayoutDashboard size={18} aria-hidden="true" /> Overview
          </button>
          <button type="button" className={section === "categories" ? "is-active" : ""} onClick={() => setSection("categories")}>
            <Shapes size={18} aria-hidden="true" /> Categories
          </button>
          <button type="button" className={section === "products" ? "is-active" : ""} onClick={() => setSection("products")}>
            <Package size={18} aria-hidden="true" /> Products
          </button>
          <button type="button" className={section === "homepage" ? "is-active" : ""} onClick={() => setSection("homepage")}>
            <Type size={18} aria-hidden="true" /> Homepage
          </button>
        </nav>
        <div className="admin-side__foot">
          <Link to="/" className="admin-side__link">
            <ExternalLink size={16} aria-hidden="true" /> View website
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              navigate({ to: "/login" });
            }}
          >
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-top">
          <div>
            <p className="collections-kicker">SIGNED IN</p>
            <h1>{sectionTitle(section)}</h1>
          </div>
          <span>{session.email}</span>
        </header>
        {notice && <p className="admin-banner admin-banner--ok">{notice}</p>}
        {error && <p className="admin-banner admin-banner--bad">{error}</p>}
        {section === "overview" && (
          <Overview
            categoryCount={site.categories.length}
            productCount={site.products.length}
            onOpen={setSection}
            onReset={() => {
              if (!window.confirm("Reset the website back to the original demo catalog?")) return;
              resetSite();
              flash("Website content is back to the original demo.");
            }}
          />
        )}
        {section === "categories" && (
          <CategoryPanel
            categories={site.categories}
            productCount={(id) => site.products.filter((product) => product.categoryId === id).length}
            onSaved={(created) => flash(created ? "Category is live on the website." : "Category updated on the website.")}
            onDeleted={() => flash("Category removed from the website.")}
            onError={fail}
          />
        )}
        {section === "products" && (
          <ProductPanel
            categories={site.categories}
            products={site.products}
            onSaved={(created) => flash(created ? "Product uploaded. It is live on the website." : "Product updated on the website.")}
            onDeleted={() => flash("Product removed from the website.")}
            onError={fail}
          />
        )}
        {section === "homepage" && (
          <HomepagePanel
            hero={site.hero}
            about={site.about}
            onSaved={() => flash("Homepage text is live on the website.")}
            onError={fail}
          />
        )}
      </main>
    </div>
  );
}

function sectionTitle(section: Section) {
  if (section === "categories") return "Categories";
  if (section === "products") return "Products";
  if (section === "homepage") return "Homepage";
  return "Overview";
}

function Overview({
  categoryCount,
  productCount,
  onOpen,
  onReset,
}: {
  categoryCount: number;
  productCount: number;
  onOpen: (section: Section) => void;
  onReset: () => void;
}) {
  return (
    <section className="admin-panel">
      <p className="admin-note">This is a demo admin. Uploads are saved in this browser and show on the storefront right away. There is no server yet.</p>
      <div className="admin-stats">
        <button type="button" onClick={() => onOpen("categories")}>
          <strong>{categoryCount}</strong>
          <span>Categories</span>
        </button>
        <button type="button" onClick={() => onOpen("products")}>
          <strong>{productCount}</strong>
          <span>Products</span>
        </button>
      </div>
      <div className="admin-actions">
        <button type="button" className="admin-primary" onClick={() => onOpen("products")}>
          Upload a product
        </button>
        <button type="button" className="admin-ghost" onClick={onReset}>
          Reset demo content
        </button>
      </div>
    </section>
  );
}

function CategoryPanel({
  categories,
  productCount,
  onSaved,
  onDeleted,
  onError,
}: {
  categories: StoreCategory[];
  productCount: (id: string) => number;
  onSaved: (created: boolean) => void;
  onDeleted: () => void;
  onError: (reason: unknown) => void;
}) {
  const [form, setForm] = useState(emptyCategory);
  const editing = Boolean(form.id);

  const onImage = async (file: File | undefined) => {
    if (!file) return;
    try {
      const image = await fileToImage(file);
      setForm((current) => ({ ...current, image }));
    } catch (reason) {
      onError(reason);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    try {
      saveCategory(form);
      onSaved(!editing);
      setForm(emptyCategory);
    } catch (reason) {
      onError(reason);
    }
  };

  return (
    <section className="admin-split">
      <form className="admin-form" onSubmit={onSubmit}>
        <h2>{editing ? "Edit category" : "New category"}</h2>
        <label>
          Name
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <label>
          Short label
          <input value={form.sub} onChange={(event) => setForm({ ...form, sub: event.target.value })} placeholder="Fragrances" />
        </label>
        <label>
          Tagline
          <input value={form.tagline} onChange={(event) => setForm({ ...form, tagline: event.target.value })} placeholder="Fragrances for every mood" />
        </label>
        <label>
          Description
          <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={4} />
        </label>
        <ImageField image={form.image} onFile={onImage} />
        <div className="admin-actions">
          <button type="submit" className="admin-primary">
            {editing ? "Save category" : "Publish category"}
          </button>
          {editing && (
            <button type="button" className="admin-ghost" onClick={() => setForm(emptyCategory)}>
              Cancel
            </button>
          )}
        </div>
      </form>
      <ul className="admin-list">
        {categories.map((category) => (
          <li key={category.id}>
            <img src={category.image} alt="" />
            <div>
              <strong>{category.name}</strong>
              <small>
                {category.sub} · {productCount(category.id)} {productCount(category.id) === 1 ? "product" : "products"}
              </small>
            </div>
            <div className="admin-list__actions">
              <button type="button" onClick={() => setForm(category)}>
                Edit
              </button>
              <Link to="/category/$slug" params={{ slug: category.id }}>
                View
              </Link>
              <button
                type="button"
                className="is-danger"
                onClick={() => {
                  const count = productCount(category.id);
                  const extra = count ? ` This also removes ${count} product${count === 1 ? "" : "s"}.` : "";
                  if (!window.confirm(`Remove ${category.name} from the website?${extra}`)) return;
                  try {
                    removeCategory(category.id);
                    if (form.id === category.id) setForm(emptyCategory);
                    onDeleted();
                  } catch (reason) {
                    onError(reason);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProductPanel({
  categories,
  products,
  onSaved,
  onDeleted,
  onError,
}: {
  categories: StoreCategory[];
  products: StoreProduct[];
  onSaved: (created: boolean) => void;
  onDeleted: () => void;
  onError: (reason: unknown) => void;
}) {
  const [form, setForm] = useState(emptyProduct);
  const editing = Boolean(form.id);
  const categoryName = (id: string) => categories.find((category) => category.id === id)?.name ?? "Uncategorized";

  const onImage = async (file: File | undefined) => {
    if (!file) return;
    try {
      const image = await fileToImage(file);
      setForm((current) => ({ ...current, image }));
    } catch (reason) {
      onError(reason);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    try {
      saveProduct({
        ...(form.id ? { id: form.id } : {}),
        name: form.name,
        categoryId: form.categoryId,
        price: Number(form.price),
        image: form.image,
        preview: form.preview,
      });
      onSaved(!editing);
      setForm({ ...emptyProduct, categoryId: form.categoryId });
    } catch (reason) {
      onError(reason);
    }
  };

  return (
    <section className="admin-split">
      <form className="admin-form" onSubmit={onSubmit}>
        <h2>{editing ? "Edit product" : "Upload product"}</h2>
        {categories.length === 0 ? (
          <p className="admin-note">Add a category before uploading products.</p>
        ) : (
          <>
            <label>
              Name
              <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
            </label>
            <label>
              Category
              <select value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Price (Rs.)
              <input type="number" min={1} step={1} value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
            </label>
            <label className="admin-check">
              <input type="checkbox" checked={form.preview} onChange={(event) => setForm({ ...form, preview: event.target.checked })} />
              Show on the homepage
            </label>
            <ImageField image={form.image} onFile={onImage} />
            <div className="admin-actions">
              <button type="submit" className="admin-primary">
                {editing ? "Save product" : "Upload product"}
              </button>
              {editing && (
                <button type="button" className="admin-ghost" onClick={() => setForm(emptyProduct)}>
                  Cancel
                </button>
              )}
            </div>
          </>
        )}
      </form>
      <ul className="admin-list">
        {products.length === 0 && <li className="admin-empty">No products yet.</li>}
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.image} alt="" />
            <div>
              <strong>{product.name}</strong>
              <small>
                {categoryName(product.categoryId)} · Rs. {product.price.toLocaleString("en-PK")}
                {product.preview ? " · Homepage" : ""}
              </small>
            </div>
            <div className="admin-list__actions">
              <button
                type="button"
                onClick={() =>
                  setForm({
                    id: product.id,
                    name: product.name,
                    categoryId: product.categoryId,
                    price: String(product.price),
                    image: product.image,
                    preview: product.preview,
                  })
                }
              >
                Edit
              </button>
              <Link to="/category/$slug" params={{ slug: product.categoryId }}>
                View
              </Link>
              <button
                type="button"
                className="is-danger"
                onClick={() => {
                  if (!window.confirm(`Remove ${product.name} from the website?`)) return;
                  try {
                    removeProduct(product.id);
                    if (form.id === product.id) setForm(emptyProduct);
                    onDeleted();
                  } catch (reason) {
                    onError(reason);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function HomepagePanel({
  hero,
  about,
  onSaved,
  onError,
}: {
  hero: StoreHero;
  about: StoreAbout;
  onSaved: () => void;
  onError: (reason: unknown) => void;
}) {
  const [heroForm, setHeroForm] = useState(hero);
  const [aboutForm, setAboutForm] = useState(about);

  useEffect(() => {
    setHeroForm(hero);
    setAboutForm(about);
  }, [hero, about]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    try {
      saveHomepage(heroForm, aboutForm);
      onSaved();
    } catch (reason) {
      onError(reason);
    }
  };

  return (
    <form className="admin-form admin-form--wide" onSubmit={onSubmit}>
      <h2>Hero</h2>
      <label>
        Eyebrow
        <input value={heroForm.eyebrow} onChange={(event) => setHeroForm({ ...heroForm, eyebrow: event.target.value })} />
      </label>
      <label>
        Title
        <input value={heroForm.title} onChange={(event) => setHeroForm({ ...heroForm, title: event.target.value })} required />
      </label>
      <label>
        Gold line
        <input value={heroForm.accent} onChange={(event) => setHeroForm({ ...heroForm, accent: event.target.value })} required />
      </label>
      <label>
        Description
        <textarea value={heroForm.description} onChange={(event) => setHeroForm({ ...heroForm, description: event.target.value })} rows={3} />
      </label>
      <h2>About</h2>
      <label>
        Heading
        <input value={aboutForm.title} onChange={(event) => setAboutForm({ ...aboutForm, title: event.target.value })} required />
      </label>
      <label>
        Text
        <textarea value={aboutForm.text} onChange={(event) => setAboutForm({ ...aboutForm, text: event.target.value })} rows={4} required />
      </label>
      <div className="admin-actions">
        <button type="submit" className="admin-primary">
          Publish homepage
        </button>
        <Link to="/" className="admin-ghost">
          View homepage
        </Link>
      </div>
    </form>
  );
}

function ImageField({ image, onFile }: { image: string; onFile: (file: File | undefined) => void }) {
  return (
    <label className="admin-upload">
      {image ? <img src={image} alt="" /> : <ImagePlus size={28} aria-hidden="true" />}
      <span>{image ? "Replace image" : "Upload image"}</span>
      <input
        type="file"
        accept="image/*"
        onChange={(event) => {
          onFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
    </label>
  );
}
