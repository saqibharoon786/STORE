import bottlesImage from "@/assets/category-bottles.jpg";
import garmentsImage from "@/assets/category-undergarments.jpg";
import brasImage from "@/assets/category-bras.jpg";
import nightiesImage from "@/assets/category-nighties.jpg";
import umbrellasImage from "@/assets/category-umbrellas.jpg";
import watchesImage from "@/assets/category-watches.jpg";
import homeDecorImage from "@/assets/category-homedecor.jpg";
import pantiesImage from "@/assets/ug-panties.jpg";
import shapewearImage from "@/assets/ug-shapewear.jpg";
import bralettesImage from "@/assets/ug-bralettes.jpg";
import camisolesImage from "@/assets/ug-camisoles.jpg";
import loungewearImage from "@/assets/ug-loungewear.jpg";
import clockImage from "@/assets/homedecor-clock.jpg";
import lampImage from "@/assets/homedecor-lamp.jpg";
import vasesImage from "@/assets/homedecor-vases.jpg";
import framesImage from "@/assets/homedecor-frames.jpg";
import candleImage from "@/assets/homedecor-candle.jpg";
import plantPotImage from "@/assets/homedecor-plantpot.jpg";
import wallArtImage from "@/assets/homedecor-wallart.jpg";
import cushionsImage from "@/assets/homedecor-cushions.jpg";
import tableDecorImage from "@/assets/homedecor-tabledecor.jpg";
import lightingImage from "@/assets/homedecor-lighting.jpg";
import rugsImage from "@/assets/homedecor-rugs.jpg";
import kitchenImage from "@/assets/homedecor-kitchen.jpg";
import plantsImage from "@/assets/homedecor-plants.jpg";

export const categories = [
  { name: "Bottles", sub: "Fragrances", tagline: "Fragrances for every mood", image: bottlesImage, description: "A considered collection of bottles for your everyday routine." },
  { name: "Under Garments", sub: "Comfort & Style", tagline: "Comfort meets style", image: garmentsImage, description: "The foundations of a wardrobe that feels as good as it looks." },
  { name: "Bras", sub: "Support & Comfort", tagline: "Support & elegance", image: brasImage, description: "Everyday support crafted with elegance and care." },
  { name: "Nighties", sub: "For Cozy Nights", tagline: "For your cozy nights", image: nightiesImage, description: "Soft, dreamy pieces made for your coziest nights." },
  { name: "Umbrellas", sub: "Stay Protected", tagline: "Stay protected in style", image: umbrellasImage, description: "Thoughtful protection for whatever the day brings." },
  { name: "Watches", sub: "Timeless Elegance", tagline: "Timeless elegance", image: watchesImage, description: "Timeless details designed to stay with you." },
  { name: "Home Decoration", sub: "Beautify Your Space", tagline: "Beautify your space", image: homeDecorImage, description: "Warm accents that turn a house into a home." },
] as const;

export type CategoryName = (typeof categories)[number]["name"];

export type CatalogProduct = {
  name: string;
  category: CategoryName;
  price: number;
  image: string;
  preview: boolean;
};

export const products: CatalogProduct[] = [
  { name: "Signature Fragrance", category: "Bottles", price: 3999, image: bottlesImage, preview: true },
  { name: "Everyday Comfort Set", category: "Under Garments", price: 2899, image: garmentsImage, preview: true },
  { name: "Cotton Panties (3 Pack)", category: "Under Garments", price: 1799, image: pantiesImage, preview: true },
  { name: "High Waist Shapewear", category: "Under Garments", price: 2899, image: shapewearImage, preview: true },
  { name: "Seamless Bralette", category: "Under Garments", price: 1599, image: bralettesImage, preview: true },
  { name: "Satin Camisole Set", category: "Under Garments", price: 2299, image: camisolesImage, preview: true },
  { name: "Satin Lounge Set", category: "Under Garments", price: 3499, image: loungewearImage, preview: true },
  { name: "Lace Push-Up Bra", category: "Bras", price: 2499, image: brasImage, preview: true },
  { name: "Satin Nightie", category: "Nighties", price: 3199, image: nightiesImage, preview: true },
  { name: "Classic Umbrella", category: "Umbrellas", price: 1899, image: umbrellasImage, preview: true },
  { name: "Classic Watch", category: "Watches", price: 5499, image: watchesImage, preview: true },
  { name: "Modern Wall Clock", category: "Home Decoration", price: 3499, image: clockImage, preview: true },
  { name: "Crystal Table Lamp", category: "Home Decoration", price: 4299, image: lampImage, preview: true },
  { name: "Ceramic Vase Set", category: "Home Decoration", price: 2899, image: vasesImage, preview: true },
  { name: "Wall Art Frame Set", category: "Home Decoration", price: 3199, image: framesImage, preview: true },
  { name: "Candle Holder", category: "Home Decoration", price: 1799, image: candleImage, preview: true },
  { name: "Indoor Plant with Planter", category: "Home Decoration", price: 2499, image: plantPotImage, preview: true },
  { name: "Gallery Wall Art", category: "Home Decoration", price: 4599, image: wallArtImage, preview: true },
  { name: "Cushion Cover Set", category: "Home Decoration", price: 2199, image: cushionsImage, preview: true },
  { name: "Marble Table Decor", category: "Home Decoration", price: 2699, image: tableDecorImage, preview: false },
  { name: "Ambient Floor Light", category: "Home Decoration", price: 5499, image: lightingImage, preview: false },
  { name: "Soft Living Rug", category: "Home Decoration", price: 6999, image: rugsImage, preview: false },
  { name: "Kitchen Decor Set", category: "Home Decoration", price: 2399, image: kitchenImage, preview: false },
  { name: "Leafy Planter Pair", category: "Home Decoration", price: 1899, image: plantsImage, preview: false },
];

export const categorySlug = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

export const categoryBySlug = (slug: string) => categories.find((category) => categorySlug(category.name) === slug);

export const productsFor = (name: CategoryName) => products.filter((product) => product.category === name);
