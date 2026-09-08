export type Product = {
  name: string;
  blurb: string;
  origin: "Japan" | "Korea" | "China" | "Thailand";
};

export const PRODUCTS: Product[] = [
  { name: "Ramune", blurb: "The marble-pop soda from anime summer festivals", origin: "Japan" },
  { name: "Taiyaki", blurb: "Crisp fish-shaped cakes with warm, sweet centres", origin: "Japan" },
  { name: "Mitarashi Dango", blurb: "Chewy rice dumplings lacquered in soy caramel", origin: "Japan" },
  { name: "Tteokbokki", blurb: "Glossy, spicy rice cakes—the K-drama street-food staple", origin: "Korea" },
  { name: "Korean Corn Dogs", blurb: "Crunchy, saucy and famous for that cheese pull", origin: "Korea" },
  { name: "Fruit Tanghulu", blurb: "Glass-crackle fruit skewers all over idol food feeds", origin: "Korea" },
  { name: "Haw Flakes", blurb: "Tart-sweet hawthorn discs, a classic Chinese pocket snack", origin: "China" },
  { name: "Milk Candy", blurb: "Creamy, chewy nostalgia inspired by a Chinese icon", origin: "China" },
  { name: "Thai Seaweed Crisps", blurb: "Roasted, salty sheets with a cult crunch", origin: "Thailand" },
  { name: "Mango Sticky Rice", blurb: "Coconut-rich, juicy and night-market famous", origin: "Thailand" },
  { name: "Thai Milk Tea", blurb: "Strong tea, condensed milk and unmistakable orange", origin: "Thailand" },
];

export const PRODUCT_NAMES = PRODUCTS.map((p) => p.name);
