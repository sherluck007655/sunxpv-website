export type SitePost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string[];
  featuredImage: string;
  publishedAt: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
};

export const sitePosts: SitePost[] = [
  {
    slug: "choose-the-right-sunx-inverter-series",
    category: "Product Guide",
    title: "Choose the right SunX inverter series",
    excerpt:
      "Understand how Sun Prime, Sun Pro, Sun Ultra, and Sun Max fit different residential and commercial needs.",
    content: [
      "Choosing a solar inverter starts with your required load, available solar capacity, battery plan, and expected backup time. A correctly sized system operates more efficiently and gives you room for future energy needs.",
      "The Sun Prime range is designed for reliable residential and light commercial hybrid systems. Sun Pro adds flexible power management and connectivity for larger installations, while Sun Ultra supports high-capacity systems that need advanced load control and parallel operation.",
      "Sun Max combines strong grid support with a weather-resistant design for demanding commercial applications. Before selecting a model, ask an authorized SunX partner to review your load profile, battery capacity, solar panel layout, and installation environment.",
    ],
    featuredImage: "/images/pro-hero.png",
    publishedAt: "2026-07-20",
    updatedAt: "2026-08-04",
    seoTitle: "How to Choose the Right SunX Solar Inverter",
    seoDescription:
      "Compare Sun Prime, Sun Pro, Sun Ultra and Sun Max inverter series for residential and commercial solar systems in Pakistan.",
  },
  {
    slug: "why-lifepo4-battery-storage-matters",
    category: "Energy Storage",
    title: "Why LiFePO4 battery storage matters",
    excerpt:
      "SunX lithium battery systems combine smart battery management, long life, and scalable energy storage.",
    content: [
      "LiFePO4 batteries are widely used in modern solar systems because they offer stable performance, a long cycle life, and strong thermal safety. They can store daytime solar energy for use during outages, at night, or when electricity costs are higher.",
      "A smart battery management system monitors voltage, current, temperature, and cell balance. This protection helps the battery operate within safe limits and supports consistent performance over its service life.",
      "Battery capacity should be selected from your essential load and required backup hours. A SunX authorized partner can calculate the suitable capacity and confirm compatibility with your inverter, charging settings, and future expansion plan.",
    ],
    featuredImage: "/images/powerwall-standard.png",
    publishedAt: "2026-07-24",
    updatedAt: "2026-08-04",
    seoTitle: "LiFePO4 Solar Battery Storage Guide",
    seoDescription:
      "Learn why LiFePO4 batteries, smart BMS protection and correct capacity planning matter for reliable solar energy storage.",
  },
  {
    slug: "grow-with-the-sunx-dealer-network",
    category: "Partner Network",
    title: "Grow with the SunX dealer network",
    excerpt:
      "Authorized partners receive product access, marketing support, territory opportunities, and loyalty rewards.",
    content: [
      "The SunX dealer network connects customers with local product knowledge, professional guidance, and dependable after-sales support. Dealers receive access to the SunX inverter and lithium battery portfolio for a wide range of residential and commercial projects.",
      "SunX supports authorized partners with product information, marketing material, commercial opportunities, and an expanding national network. This helps dealers serve customers confidently while building a long-term solar business.",
      "Businesses interested in becoming a dealer can submit an enquiry through the contact page or speak with SunX directly on WhatsApp. The business development team will review the location, market coverage, and partnership requirements.",
    ],
    featuredImage: "/images/dealer-network.png",
    publishedAt: "2026-07-28",
    updatedAt: "2026-08-04",
    seoTitle: "Become an Authorized SunX Solar Dealer",
    seoDescription:
      "Discover the benefits of joining the SunX dealer network and offering solar inverters and lithium batteries in Pakistan.",
  },
];

export function findSitePost(slug: string) {
  return sitePosts.find((post) => post.slug === slug);
}
