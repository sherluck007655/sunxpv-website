export type PageSeo = {
  title: string;
  description: string;
  image?: string;
};

export const pageSeo: Record<string, PageSeo> = {
  "/": {
    title: "SunX PV Technology | Solar Inverters and Lithium Batteries",
    description:
      "Explore SunX solar inverters and lithium batteries for reliable residential and commercial energy systems across Pakistan.",
    image: "/images/hero-products.webp",
  },
  "/about-us": {
    title: "About SunX PV Technology",
    description:
      "Learn about SunX PV Technology, our solar energy mission, product quality and growing partner network across Pakistan.",
  },
  "/products": {
    title: "Solar Inverters and Lithium Batteries",
    description:
      "Browse the complete SunX range of hybrid solar inverters and LiFePO4 lithium battery storage systems.",
    image: "/images/hero-products.webp",
  },
  "/sun-prime-series": {
    title: "Sun Prime Hybrid Solar Inverter Series",
    description:
      "Discover Sun Prime 4kW, 6.2kW, 8kW and 11kW hybrid solar inverters with advanced MPPT charging.",
    image: "/images/prime-hero.png",
  },
  "/sun-pro-series": {
    title: "Sun Pro Hybrid Solar Inverter Series",
    description:
      "Explore Sun Pro hybrid solar inverters with dual output, smart load management and remote monitoring.",
    image: "/images/pro-hero.png",
  },
  "/sun-ultra-series": {
    title: "Sun Ultra Hybrid Solar Inverter Series",
    description:
      "Explore Sun Ultra 8kW and 10kW hybrid solar inverters for high-capacity residential and commercial systems.",
    image: "/images/ultra-product.png",
  },
  "/sun-max-series": {
    title: "Sun Max Solar Inverter Series",
    description:
      "Discover weather-resistant Sun Max solar inverter solutions for commercial and utility energy projects.",
    image: "/images/sunmax-product.png",
  },
  "/sunx-dealers": {
    title: "Find an Authorized SunX Solar Dealer",
    description:
      "Find authorized SunX solar product dealers and learn how to join the SunX partner network in Pakistan.",
  },
  "/find-an-installer": {
    title: "Find a SunX Solar Installer",
    description:
      "Find a solar installer for professional SunX inverter, battery and solar energy system installation support.",
  },
  "/download-center": {
    title: "SunX Product Downloads",
    description:
      "Download SunX solar inverter and lithium battery catalogues, product resources and technical documents.",
  },
  "/sunx-product-warranty": {
    title: "SunX Product Warranty",
    description:
      "Review warranty information for SunX solar inverters, lithium batteries and supported solar products.",
  },
  "/contact-us": {
    title: "Contact SunX PV Technology",
    description:
      "Contact SunX for solar product information, dealer enquiries, warranty support and technical assistance.",
  },
  "/blogs": {
    title: "SunX Solar News and Guides",
    description:
      "Read SunX product guides, solar energy advice, battery storage information and partner network updates.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description: "Read the SunX PV Technology website privacy policy.",
  },
  "/terms-of-service": {
    title: "Terms of Service",
    description: "Read the SunX PV Technology website terms of service.",
  },
  "/cookie-policy": {
    title: "Cookie Policy",
    description: "Read the SunX PV Technology website cookie policy.",
  },
};

export const staticPaths = Object.keys(pageSeo);
