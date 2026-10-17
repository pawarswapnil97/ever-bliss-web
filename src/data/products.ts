export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  badge?: string;
  inStock: boolean;
};

// Replace image URLs and edit product details here. Add new products by adding another object.
export const products: Product[] = [
  {
    id: 1,
    name: "The Blush Rose Bouquet",
    slug: "blush-rose-bouquet",
    description:
      "A romantic bunch of handcrafted roses in soft blush tones, made to bring a little everyday magic to your space.",
    price: 1299,
    category: "Flowers",
    image:
      "https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=900&q=85",
    rating: 4.9,
    reviewCount: 28,
    badge: "Bestseller",
    inStock: true,
  },
  {
    id: 2,
    name: "Everlasting Daisy Bunch",
    slug: "everlasting-daisy-bunch",
    description:
      "Cheerful, delicate daisies with a handmade finish. A lovely gift for a friend or a sunny corner at home.",
    price: 899,
    category: "Bouquets & Gifts",
    image:
      "https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=900&q=85",
    rating: 4.8,
    reviewCount: 19,
    badge: "Loved",
    inStock: true,
  },
  {
    id: 3,
    name: "Pastel Meadow Arrangement",
    slug: "pastel-meadow-arrangement",
    description:
      "A dreamy mix of pastel blooms arranged to feel like a little meadow that never goes out of season.",
    price: 1599,
    category: "Flowers",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85",
    rating: 5.0,
    reviewCount: 14,
    badge: "New",
    inStock: true,
  },
  {
    id: 4,
    name: "Sunny Day Flower Pot",
    slug: "sunny-day-flower-pot",
    description:
      "A happy sunflower-inspired accent that adds warmth and colour to desks, shelves and bedside tables.",
    price: 1199,
    category: "Home Décor",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85",
    rating: 4.7,
    reviewCount: 12,
    inStock: true,
  },
  {
    id: 5,
    name: "Petite Table Bloom",
    slug: "petite-table-bloom",
    description:
      "A petite floral centrepiece for coffee tables, workspaces and quiet reading nooks.",
    price: 749,
    category: "Home Décor",
    image:
      "https://images.unsplash.com/photo-1494625927555-6ec4433b1571?auto=format&fit=crop&w=900&q=85",
    rating: 4.8,
    reviewCount: 9,
    inStock: true,
  },
  {
    id: 6,
    name: "Sunday Kitchen Posy",
    slug: "sunday-kitchen-posy",
    description:
      "A sweet little posy for your kitchen counter, breakfast table or favourite sunny windowsill.",
    price: 699,
    category: "Kitchen Décor",
    image:
      "https://images.unsplash.com/photo-1494336934272-f0efcedfc8f4?auto=format&fit=crop&w=900&q=85",
    rating: 4.6,
    reviewCount: 8,
    inStock: true,
  },
  {
    id: 7,
    name: "Little Shelf Garden",
    slug: "little-shelf-garden",
    description:
      "A charming handmade floral accent to brighten your bookshelves, console or work-from-home setup.",
    price: 999,
    category: "Bookshelf & Table",
    image:
      "https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=900&q=85",
    rating: 4.9,
    reviewCount: 16,
    badge: "Handmade",
    inStock: true,
  },
  {
    id: 8,
    name: "The Thoughtful Gift Set",
    slug: "thoughtful-gift-set",
    description:
      "A gift-ready floral arrangement designed to say “thinking of you” long after the special day.",
    price: 1899,
    category: "Bouquets & Gifts",
    image:
      "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=900&q=85",
    rating: 4.9,
    reviewCount: 21,
    badge: "Gift pick",
    inStock: true,
  },
];
