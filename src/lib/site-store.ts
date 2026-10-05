import { useSyncExternalStore } from "react";
import { categories as seedCategories, categorySlug, products as seedProducts } from "@/lib/catalog";

export const ADMIN_EMAIL = "superadmin@gmail.com";
export const ADMIN_PASSWORD = "123";

const STORE_KEY = "luxora-site-content";
const AUTH_KEY = "luxora-admin-session";

export type StoreCategory = {
  id: string;
  name: string;
  sub: string;
  tagline: string;
  description: string;
  image: string;
};

export type StoreProduct = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  image: string;
  preview: boolean;
};

export type StoreHero = {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
};

export type StoreAbout = {
  title: string;
  text: string;
};

export type SiteContent = {
  categories: StoreCategory[];
  products: StoreProduct[];
  hero: StoreHero;
  about: StoreAbout;
};

export type AdminSession = { email: string };

const seedContent: SiteContent = {
  categories: seedCategories.map((category) => ({
    id: categorySlug(category.name),
    name: category.name,
    sub: category.sub,
    tagline: category.tagline,
    description: category.description,
    image: category.image,
  })),
  products: seedProducts.map((product, index) => ({
    id: `seed-${index}`,
    name: product.name,
    categoryId: categorySlug(product.category),
    price: product.price,
    image: product.image,
    preview: product.preview,
  })),
  hero: {
    eyebrow: "PREMIUM LIFESTYLE STORE",
    title: "Elevate Your",
    accent: "Everyday Style",
    description: "Discover high-quality products in bottles, undergarments, umbrellas, and watches — all in one place.",
  },
  about: {
    title: "Style in the everyday.",
    text: "From the details you wear to the essentials you carry, Luxora brings together pieces made for daily life.",
  },
};

let memory: SiteContent | null = null;
const listeners = new Set<() => void>();

let sessionMem: AdminSession | null = null;
let sessionLoaded = false;
const authListeners = new Set<() => void>();

function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object") return false;
  const site = value as SiteContent;
  return Array.isArray(site.categories) && Array.isArray(site.products) && !!site.hero && !!site.about;
}

export function getSeedSite() {
  return seedContent;
}

export function getSite(): SiteContent {
  if (typeof window === "undefined") return seedContent;
  if (memory) return memory;
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isSiteContent(parsed)) {
        memory = parsed;
        return memory;
      }
    }
  } catch {
    /* keep the built-in catalog */
  }
  memory = seedContent;
  return memory;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function persist(next: SiteContent) {
  const previous = memory;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    memory = previous;
    throw new Error("This browser cannot store that upload. Use a smaller image, or reset demo content.");
  }
  memory = next;
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useSiteStore() {
  return useSyncExternalStore(subscribe, getSite, getSeedSite);
}

function readSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { email?: string };
    if (parsed.email?.toLowerCase() === ADMIN_EMAIL) return { email: ADMIN_EMAIL };
  } catch {
    return null;
  }
  return null;
}

export function getSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  if (!sessionLoaded) {
    sessionMem = readSession();
    sessionLoaded = true;
  }
  return sessionMem;
}

function subscribeAuth(listener: () => void) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

function emitAuth() {
  authListeners.forEach((listener) => listener());
}

export function useAdminSession() {
  return useSyncExternalStore(subscribeAuth, getSession, () => null);
}

export function useClientReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function login(email: string, password: string) {
  const ok = email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
  if (!ok) return false;
  sessionMem = { email: ADMIN_EMAIL };
  sessionLoaded = true;
  localStorage.setItem(AUTH_KEY, JSON.stringify(sessionMem));
  emitAuth();
  return true;
}

export function logout() {
  sessionMem = null;
  sessionLoaded = true;
  localStorage.removeItem(AUTH_KEY);
  emitAuth();
}

export function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "item";
}

function uniqueId(name: string, items: { id: string }[]) {
  const base = slugify(name);
  let id = base;
  let count = 2;
  while (items.some((item) => item.id === id)) {
    id = `${base}-${count}`;
    count += 1;
  }
  return id;
}

export function saveCategory(input: Omit<StoreCategory, "id"> & { id?: string }) {
  const name = input.name.trim();
  if (!name) throw new Error("Category name is required.");
  if (!input.image) throw new Error("Upload a category image.");
  const current = getSite();
  const next: StoreCategory = {
    id: input.id || uniqueId(name, current.categories),
    name,
    sub: input.sub.trim() || "Collection",
    tagline: input.tagline.trim() || input.sub.trim() || name,
    description: input.description.trim() || "A new Luxora collection.",
    image: input.image,
  };
  const categories = input.id
    ? current.categories.map((category) => (category.id === input.id ? next : category))
    : [...current.categories, next];
  persist({ ...current, categories });
  return next;
}

export function removeCategory(id: string) {
  const current = getSite();
  persist({
    ...current,
    categories: current.categories.filter((category) => category.id !== id),
    products: current.products.filter((product) => product.categoryId !== id),
  });
}

export function saveProduct(input: Omit<StoreProduct, "id"> & { id?: string }) {
  const name = input.name.trim();
  if (!name) throw new Error("Product name is required.");
  if (!input.categoryId) throw new Error("Choose a category.");
  if (!input.image) throw new Error("Upload a product image.");
  if (!Number.isFinite(input.price) || input.price <= 0) throw new Error("Enter a price greater than 0.");
  const current = getSite();
  if (!current.categories.some((category) => category.id === input.categoryId)) {
    throw new Error("That category is not on the website.");
  }
  const next: StoreProduct = {
    id: input.id || uniqueId(name, current.products),
    name,
    categoryId: input.categoryId,
    price: Math.round(input.price),
    image: input.image,
    preview: input.preview,
  };
  const products = input.id
    ? current.products.map((product) => (product.id === input.id ? next : product))
    : [next, ...current.products];
  persist({ ...current, products });
  return next;
}

export function removeProduct(id: string) {
  const current = getSite();
  persist({ ...current, products: current.products.filter((product) => product.id !== id) });
}

export function saveHomepage(hero: StoreHero, about: StoreAbout) {
  if (!hero.title.trim() || !hero.accent.trim()) throw new Error("Hero title is required.");
  if (!about.title.trim() || !about.text.trim()) throw new Error("About text is required.");
  const current = getSite();
  persist({
    ...current,
    hero: {
      eyebrow: hero.eyebrow.trim() || "PREMIUM LIFESTYLE STORE",
      title: hero.title.trim(),
      accent: hero.accent.trim(),
      description: hero.description.trim(),
    },
    about: { title: about.title.trim(), text: about.text.trim() },
  });
}

export function resetSite() {
  localStorage.removeItem(STORE_KEY);
  memory = seedContent;
  emit();
}

export function fileToImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file."));
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const max = 960;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read that image."));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read that image."));
    };
    image.src = url;
  });
}
