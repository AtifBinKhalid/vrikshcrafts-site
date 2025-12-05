export type CatalogItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
};

export const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "wall-accents",
    title: "Wall accents & panels",
    subtitle: "Feature walls, backdrops, and texture",
    description:
      "Handcrafted wall pieces, carved panels, and lattice work that become a focal point in cafés, reception areas, and corridors.",
    tags: [
      "wall",
      "panel",
      "feature wall",
      "backdrop",
      "cafe",
      "restaurant",
      "office",
      "lattice",
    ],
  },
  {
    id: "tabletop-decor",
    title: "Tabletop decor",
    subtitle: "Smaller elements for surfaces",
    description:
      "Compact decor pieces for tables, shelves, counters, and niches—ideal for cafés, studios, and decor stores.",
    tags: ["table", "tabletop", "shelf", "counter", "small", "gift", "store"],
  },
  {
    id: "counters-bar-fronts",
    title: "Counters & bar fronts",
    subtitle: "Customer-facing surfaces",
    description:
      "Wooden cladding, trims, and front panels for billing counters and bar fronts that match your overall theme.",
    tags: ["counter", "billing", "bar", "front", "retail", "hospitality"],
  },
  {
    id: "entrance-signage",
    title: "Entrance & signage pieces",
    subtitle: "First impression for your space",
    description:
      "Custom wooden signage, name boards, and entrance frames that carry your brand identity from the door itself.",
    tags: ["sign", "signage", "entrance", "name board", "branding"],
  },
  {
    id: "giftable-small-decor",
    title: "Giftable small decor",
    subtitle: "Retail-friendly and repeatable",
    description:
      "Smaller SKUs that can be reordered in batches for decor / gift stores and corporate gifting requirements.",
    tags: ["giftable", "small decor", "store", "corporate gift", "sku"],
  },
];
