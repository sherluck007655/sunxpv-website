"use client";

import {
  createContext,
  FormEvent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Product = {
  name: string;
  family: string;
  description: string;
  image: string;
  href: string;
  tag?: string;
};

type CmsRecord = Record<string, string | number | boolean | null>;

type CmsContent = {
  pages: CmsRecord[];
  posts: CmsRecord[];
  products: CmsRecord[];
  menus: CmsRecord[];
  settings: Record<string, string>;
};

const emptyCms: CmsContent = {
  pages: [],
  posts: [],
  products: [],
  menus: [],
  settings: {},
};

const CmsContext = createContext<CmsContent>(emptyCms);

function CmsProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<CmsContent>(emptyCms);

  useEffect(() => {
    let active = true;
    fetch("/api/public/content")
      .then((response) => response.json())
      .then((data: CmsContent) => {
        if (active) setContent(data);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return <CmsContext.Provider value={content}>{children}</CmsContext.Provider>;
}

function useCms() {
  return useContext(CmsContext);
}

function TrafficTracker({ path }: { path: string }) {
  useEffect(() => {
    const sessionKey = "sunx-session";
    let sessionId = sessionStorage.getItem(sessionKey);
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem(sessionKey, sessionId);
    }
    const width = window.innerWidth;
    const device = width < 700 ? "mobile" : width < 1050 ? "tablet" : "desktop";
    void fetch("/api/public/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        path,
        referrer: document.referrer,
        sessionId,
        device,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, [path]);

  return null;
}

type ModelSpec = {
  name: string;
  subtitle: string;
  specs: Array<[string, string]>;
};

type SeriesConfig = {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: string[];
  advantages: string[];
  models: ModelSpec[];
};

const productCards: Product[] = [
  {
    name: "Sun-Prime 4kW",
    family: "Sun Prime Series",
    description:
      "A compact single-phase hybrid inverter designed for small homes, offering efficient energy conversion with advanced MPPT control.",
    image: "/images/prime-product.png",
    href: "/sun-prime-series/",
    tag: "Hybrid inverter",
  },
  {
    name: "Sun-Prime 6.2kW",
    family: "Sun Prime Series",
    description:
      "Ideal for medium-size homes, this high-performance hybrid inverter ensures stable power output and smart energy management.",
    image: "/images/prime-product.png",
    href: "/sun-prime-series/",
    tag: "Dual output",
  },
  {
    name: "Sun-Prime 8kW",
    family: "Sun Prime Series",
    description:
      "Engineered for larger residential systems, delivering superior efficiency and reliability with intelligent monitoring features.",
    image: "/images/prime-product.png",
    href: "/sun-prime-series/",
    tag: "High capacity",
  },
  {
    name: "Sun-Prime 11kW",
    family: "Sun Prime Series",
    description:
      "High-capacity dual output hybrid inverter for larger residential and commercial energy systems.",
    image: "/images/prime-product.png",
    href: "/sun-prime-series/",
    tag: "11kW output",
  },
  {
    name: "Sun-Pro 4kW",
    family: "Sun Pro Series",
    description:
      "A hybrid inverter optimized for small commercial applications, featuring smart grid management and strong reliability.",
    image: "/images/pro-product.png",
    href: "/sun-pro-series/",
    tag: "Smart monitoring",
  },
  {
    name: "Sun-Pro 6kW",
    family: "Sun Pro Series",
    description:
      "Single-phase inverter ideal for residential or light commercial setups, combining high efficiency with compact design.",
    image: "/images/pro-product.png",
    href: "/sun-pro-series/",
    tag: "Wi-Fi ready",
  },
  {
    name: "Sun-Pro 8kW",
    family: "Sun Pro Series",
    description:
      "High-power inverter for medium commercial installations, offering excellent performance and advanced communication features.",
    image: "/images/pro-product.png",
    href: "/sun-pro-series/",
    tag: "MPPT technology",
  },
  {
    name: "Sun-Ultra 8kW",
    family: "Sun Ultra Series",
    description:
      "High-efficiency inverter suitable for medium-scale systems, offering superior performance under all conditions.",
    image: "/images/ultra-8kw.png",
    href: "/sun-ultra-series/",
    tag: "93% efficiency",
  },
  {
    name: "Sun-Ultra 10kW",
    family: "Sun Ultra Series",
    description:
      "Powerful dual output hybrid inverter with smart load management, Wi-Fi monitoring and parallel operation.",
    image: "/images/ultra-11kw.png",
    href: "/sun-ultra-series/",
    tag: "Parallel ready",
  },
  {
    name: "Sun-Max 6kW",
    family: "Sun Max Series",
    description:
      "Compact yet powerful string inverter for small-scale utility and commercial projects with enhanced grid support.",
    image: "/images/sunmax-product.png",
    href: "/sun-max-series/",
    tag: "IP65 design",
  },
  {
    name: "Lixor Power 25.6V 100Ah",
    family: "Lithium Batteries",
    description:
      "Compact lithium battery for homes, featuring smart BMS and long life for daily energy storage.",
    image: "/images/lixor-battery.jpeg",
    href: "/products/#batteries",
    tag: "LiFePO4",
  },
  {
    name: "Power Wall 51.2V 100Ah",
    family: "Lithium Batteries",
    description:
      "High-capacity modular storage solution designed for scalable home energy systems.",
    image: "/images/powerwall-standard.png",
    href: "/products/#batteries",
    tag: "Smart BMS",
  },
  {
    name: "Power Wall 51.2V 200Ah",
    family: "Lithium Batteries",
    description:
      "Maximum-capacity LiFePO4 battery engineered for dependable energy storage and long-term performance.",
    image: "/images/powerwall-max.png",
    href: "/products/#batteries",
    tag: "Long life",
  },
];

const seriesData: Record<string, SeriesConfig> = {
  prime: {
    eyebrow: "SunX Prime Series",
    title: "Sun-Prime Series",
    subtitle: "4kW | 6.2kW | 8kW | 11kW Hybrid Solar Inverter",
    description:
      "The Sun-Prime series delivers high-performance dual output hybrid inverter technology with advanced MPPT charging and seamless grid integration. Featuring over 94% efficiency in battery mode, pure sine wave output, and intelligent energy management, it is the perfect solution for modern residential and commercial energy needs.",
    image: "/images/prime-hero.png",
    features: [
      "Advanced MPPT solar charging technology",
      "Pure sine wave output for clean power",
      "Intelligent battery management system",
      "Grid-tie and off-grid operation modes",
      "LCD display and remote monitoring",
    ],
    advantages: [
      "Over 94% efficiency in battery mode",
      "10ms transfer time for computers",
      "Parallel operation support",
      "Real-time LCD monitoring",
    ],
    models: [
      {
        name: "Sun-Prime 4kW",
        subtitle: "Dual Output Hybrid Inverter",
        specs: [
          ["Rated power", "4000 W"],
          ["Peak power", "8000 VA"],
          ["PV input power", "6500 W"],
          ["PV voltage range", "60–500 VDC"],
          ["Battery voltage", "48 VDC"],
          ["Maximum charge current", "120 A"],
          ["Output waveform", "Pure sine wave"],
          ["Efficiency", "Over 94%"],
          ["Dimensions", "495 × 312 × 125 mm"],
          ["Operating temperature", "0°C to 40°C"],
        ],
      },
      {
        name: "Sun-Prime 6.2kW",
        subtitle: "Dual Output Hybrid Inverter",
        specs: [
          ["Rated power", "6200 W"],
          ["Peak power", "12400 VA"],
          ["PV input power", "8500 W"],
          ["PV voltage range", "60–500 VDC"],
          ["Battery voltage", "48 VDC"],
          ["Maximum charge current", "100 A"],
          ["Parallel operation", "Yes"],
          ["Efficiency", "Over 94%"],
          ["Dimensions", "495 × 312 × 125 mm"],
          ["Noise level", "Below 50 dB"],
        ],
      },
      {
        name: "Sun-Prime 8kW",
        subtitle: "Dual Output Hybrid Inverter",
        specs: [
          ["Rated power", "8000 W"],
          ["Peak power", "16000 VA"],
          ["PV input power", "11000 W"],
          ["PV voltage range", "60–500 VDC"],
          ["Battery voltage", "48 VDC"],
          ["Maximum charge current", "150 A"],
          ["Parallel operation", "Yes"],
          ["Efficiency", "Over 94%"],
          ["Dimensions", "520 × 340 × 140 mm"],
          ["Noise level", "Below 50 dB"],
        ],
      },
      {
        name: "Sun-Prime 11kW",
        subtitle: "Dual Output Hybrid Inverter",
        specs: [
          ["Rated power", "11000 W"],
          ["Peak power", "22000 VA"],
          ["PV input power", "15000 W"],
          ["PV voltage range", "60–500 VDC"],
          ["Battery voltage", "48 VDC"],
          ["Maximum charge current", "200 A"],
          ["Parallel operation", "Yes"],
          ["Efficiency", "Over 94%"],
          ["Dimensions", "550 × 370 × 160 mm"],
          ["Noise level", "Below 50 dB"],
        ],
      },
    ],
  },
  pro: {
    eyebrow: "SunX Pro Series",
    title: "Sun Pro Series",
    subtitle: "4kW | 6kW | 8kW | 11kW Dual Output Hybrid Inverter",
    description:
      "The Sun-Pro series offers efficient power management for small to medium-sized installations with dual output hybrid inverter technology. Ideal for both on-grid and off-grid systems, it provides smart load management, advanced connectivity options, and seamless integration into modern energy systems.",
    image: "/images/pro-hero.png",
    features: [
      "Dual output smart load management",
      "Advanced MPPT solar charging technology",
      "Pure sine wave output for clean power",
      "Wi-Fi integration and mobile monitoring",
      "Detachable LCD with communication options",
    ],
    advantages: [
      "90%–93% peak efficiency",
      "Replaceable fan design",
      "USB On-the-Go function",
      "RS485, CAN-BUS and RS232 support",
    ],
    models: [
      {
        name: "Sun-Pro 4kW",
        subtitle: "Hybrid Inverter",
        specs: [
          ["Rated power", "4000 VA / 4000 W"],
          ["Surge power", "8000 VA"],
          ["PV array power", "5000 W"],
          ["MPPT range", "90–450 VDC"],
          ["Battery voltage", "24 VDC"],
          ["Maximum charge current", "120 A"],
          ["Parallel capability", "Up to 6 units"],
          ["Efficiency", "90%–93%"],
          ["Dimensions", "119 × 313.6 × 457.5 mm"],
          ["Communication", "USB / RS232 / RS485 / Wi-Fi"],
        ],
      },
      {
        name: "Sun-Pro 6kW",
        subtitle: "Dual Output Hybrid Inverter",
        specs: [
          ["Rated power", "6000 VA / 6000 W"],
          ["Surge power", "12000 VA"],
          ["PV array power", "7500 W"],
          ["MPPT range", "60–450 VDC"],
          ["Battery voltage", "24 VDC"],
          ["Maximum charge current", "180 A"],
          ["Output waveform", "Pure sine wave"],
          ["Efficiency", "90%–93%"],
          ["Dimensions", "172.5 × 450 × 652.5 mm"],
          ["Monitoring", "Wi-Fi mobile app"],
        ],
      },
      {
        name: "Sun-Pro 8kW",
        subtitle: "Dual Output Hybrid Inverter",
        specs: [
          ["Rated power", "8000 VA / 8000 W"],
          ["Surge power", "16000 VA"],
          ["PV input power", "11000 W"],
          ["PV voltage range", "60–500 VDC"],
          ["Battery voltage", "48 VDC"],
          ["Maximum charge current", "150 A"],
          ["Parallel operation", "Yes"],
          ["Efficiency", "Over 94% battery mode"],
          ["Dimensions", "520 × 340 × 140 mm"],
          ["Noise level", "Below 50 dB"],
        ],
      },
      {
        name: "Sun-Pro 11kW",
        subtitle: "Dual Output Hybrid Inverter",
        specs: [
          ["Rated power", "11000 W"],
          ["Peak power", "22000 VA"],
          ["PV input power", "15000 W"],
          ["PV voltage range", "60–500 VDC"],
          ["Battery voltage", "48 VDC"],
          ["Maximum charge current", "200 A"],
          ["Parallel operation", "Yes"],
          ["Efficiency", "Over 94% battery mode"],
          ["Dimensions", "550 × 370 × 160 mm"],
          ["Noise level", "Below 50 dB"],
        ],
      },
    ],
  },
  ultra: {
    eyebrow: "SunX Ultra Series",
    title: "Sun Ultra Series",
    subtitle: "8kW | 10kW Dual Output Hybrid Inverter",
    description:
      "The Sun Ultra series delivers versatile dual output hybrid inverter technology with smart load management and advanced safety features. Featuring 93% efficiency, pure sine wave output, and built-in Wi-Fi monitoring, it is designed for residential and commercial energy applications requiring reliable power management.",
    image: "/images/ultra-product.png",
    features: [
      "Dual output support with smart load management",
      "Two independent AC power sources",
      "Built-in current transformer sensor",
      "Wi-Fi module for mobile monitoring",
      "Parallel operation up to 6 units",
    ],
    advantages: [
      "Advanced MPPT technology",
      "Pure sine wave output",
      "10ms computer transfer time",
      "USB, RS232, RS485 and Wi-Fi",
    ],
    models: [
      {
        name: "Sun-Ultra 8kW",
        subtitle: "Dual Output Hybrid Inverter",
        specs: [
          ["Rated power", "8000 W"],
          ["Surge power", "16000 VA"],
          ["PV array power", "10000 W"],
          ["MPPT range", "90–450 VDC"],
          ["Battery voltage", "48 VDC"],
          ["Maximum charge current", "150 A"],
          ["Efficiency", "93%"],
          ["Transfer time", "10ms PC / 20ms home"],
          ["Dimensions", "145 × 348 × 553.6 mm"],
          ["Net weight", "18.4 kg"],
        ],
      },
      {
        name: "Sun-Ultra 10kW",
        subtitle: "Dual Output Hybrid Inverter",
        specs: [
          ["Rated power", "11000 W"],
          ["Surge power", "22000 VA"],
          ["PV array power", "12000 W"],
          ["MPPT range", "90–450 VDC"],
          ["Battery voltage", "48 VDC"],
          ["Maximum charge current", "150 A"],
          ["Efficiency", "93%"],
          ["Parallel operation", "Yes"],
          ["Dimensions", "145 × 348 × 553.6 mm"],
          ["Operating temperature", "-10°C to 50°C"],
        ],
      },
    ],
  },
};

const dealerBenefits = [
  ["Strong & Trusted Brand", "Grow faster with the trusted SunX name and reputation."],
  ["Exclusive Dealer Rights", "Get territory protection for your assigned region."],
  ["Competitive Prices", "Access dealer pricing and healthy product margins."],
  ["Complete Product Range", "Offer solar inverters and lithium batteries from one brand."],
  ["Certified Products", "Sell ISO, CE and RoHS certified energy products."],
  ["Marketing Support", "Use ready-made promotional materials and campaigns."],
  ["Loyalty Rewards", "Earn incentives, cash rewards and exclusive gifts."],
  ["A Green Future", "Help make Pakistan energy independent with clean power."],
];

const dealers = [
  {
    city: "Peshawar",
    name: "AJ Solar Solution",
    address: "Opposite AWT Kohat Road Peshawar.",
    phone: "0302-8340943",
    email: "Saleem215@gmail.com",
  },
  {
    city: "Peshawar",
    name: "Official Outlet",
    address: "Shop No 11 Kala Bari Bazar Saddar Peshawar",
    phone: "0319-9843451",
    email: "info@sunxpv.com",
  },
  {
    city: "Peshawar",
    name: "Shehzad Solar System",
    address: "Amin Market Karkhano Bazar, Peshawar.",
    phone: "0318-9028013",
    email: "info@sunxpv.com",
  },
  {
    city: "Peshawar",
    name: "SunX PV Technology",
    address:
      "Office #15 Peshawar Business Center, Near Hazarkhwani Chowk Ringroad Peshawar, KPK, Pakistan",
    phone: "0342-9470099",
    email: "info@sunxpv.com",
  },
  {
    city: "Mardan",
    name: "Ittefaq Electric and Solar Solutions",
    address: "Main Bypass Road Mardan, KPK, Pakistan",
    phone: "+92 336 8182833",
    email: "info@sunxpv.com",
  },
];

const installers = [
  ["Ahmed Hassan", "Karachi, Sindh", "Level 3 Platinum", "021-35392590", "ahmed.hassan@installer.com"],
  ["Muhammad Ali", "Lahore, Punjab", "Level 2 Gold", "042-35789012", "muhammad.ali@installer.com"],
  ["Fahad Hussain", "Islamabad, ICT", "Level 3 Platinum", "051-5678901", "fatima.khan@installer.com"],
  ["Omar Sheikh", "Peshawar, KPK", "Level 2 Gold", "091-5678901", "omar.sheikh@installer.com"],
  ["Ahmed Ali", "Multan, Punjab", "Level 2 Gold", "061-4567890", "sara.ahmed@installer.com"],
  ["Hassan Malik", "Faisalabad, Punjab", "Level 3 Platinum", "041-8765432", "hassan.malik@installer.com"],
];

function Header({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const { menus } = useCms();
  const managedMenus = menus
    .filter((item) => item.location === "header")
    .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0));
  const topMenus = managedMenus.filter((item) => !item.parent_id);
  const current = (href: string) =>
    href === "/" ? path === "/" : path.startsWith(href.replace(/\/$/, ""));

  const navLink = (href: string, label: string) => (
    <a className={current(href) ? "active" : ""} href={href}>
      {label}
    </a>
  );

  return (
    <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="/" aria-label="SunX home">
            <img src="/images/sunx-logo.png" alt="SunX PV Technology" />
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {topMenus.length
              ? topMenus.map((item) => {
                  const children = managedMenus.filter(
                    (child) => child.parent_id === item.id,
                  );
                  const link = (
                    <a
                      className={current(String(item.url)) ? "active" : ""}
                      href={String(item.url)}
                      target={item.open_new_tab ? "_blank" : undefined}
                    >
                      {String(item.label)}
                    </a>
                  );
                  return children.length ? (
                    <div className="nav-item" key={String(item.id)}>
                      {link}
                      <div className="nav-drop">
                        {children.map((child) => (
                          <a
                            href={String(child.url)}
                            target={child.open_new_tab ? "_blank" : undefined}
                            key={String(child.id)}
                          >
                            {String(child.label)}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <span className="managed-nav-link" key={String(item.id)}>
                      {link}
                    </span>
                  );
                })
              : (
                <>
                  <div className="nav-item">
                    {navLink("/about-us/", "Company")}
                    <div className="nav-drop">
                      <a href="/about-us/">Profile</a>
                      <a href="/about-us/#story">Our Story</a>
                      <a href="/download-center/">Product Catalogue</a>
                    </div>
                  </div>
                  <div className="nav-item">
                    {navLink("/products/", "Products")}
                    <div className="nav-drop wide">
                      <a href="/sun-prime-series/">Sun-Prime Series</a>
                      <a href="/sun-pro-series/">Sun-Pro Series</a>
                      <a href="/sun-ultra-series/">Sun-Ultra Series</a>
                      <a href="/sun-max-series/">Sun-Max Series</a>
                      <a href="/products/#batteries">Lithium Batteries</a>
                    </div>
                  </div>
                  <div className="nav-item">
                    {navLink("/sunx-dealers/", "Partner")}
                    <div className="nav-drop">
                      <a href="/sunx-dealers/">Find a Distributor</a>
                      <a href="/find-an-installer/">Find an Installer</a>
                    </div>
                  </div>
                  <div className="nav-item">
                    {navLink("/download-center/", "Support")}
                    <div className="nav-drop">
                      <a href="/download-center/">Downloads</a>
                      <a href="/sunx-product-warranty/">Warranty</a>
                      <a href="/contact-us/">Contact Us</a>
                    </div>
                  </div>
                  {navLink("/blogs/", "News & Media")}
                </>
              )}
          </nav>
          <a className="header-cta" href="/contact-us/">
            Get Support
          </a>
          <button
            className="menu-button"
            type="button"
            aria-label="Open navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className={`mobile-nav ${open ? "open" : ""}`}>
          <div className="shell mobile-nav-inner" onClick={() => setOpen(false)}>
            {topMenus.length ? (
              topMenus.map((item) => (
                <div className="mobile-managed-group" key={String(item.id)}>
                  <a href={String(item.url)}>{String(item.label)}</a>
                  {managedMenus
                    .filter((child) => child.parent_id === item.id)
                    .map((child) => (
                      <a
                        className="mobile-child"
                        href={String(child.url)}
                        key={String(child.id)}
                      >
                        {String(child.label)}
                      </a>
                    ))}
                </div>
              ))
            ) : (
              <>
                <span>Company</span>
                <a href="/about-us/">Profile</a>
                <span>Products</span>
                <a href="/products/">All Products</a>
                <a href="/sun-prime-series/">Sun-Prime Series</a>
                <a href="/sun-pro-series/">Sun-Pro Series</a>
                <a href="/sun-ultra-series/">Sun-Ultra Series</a>
                <a href="/sun-max-series/">Sun-Max Series</a>
                <span>Partner & Support</span>
                <a href="/sunx-dealers/">Find a Distributor</a>
                <a href="/find-an-installer/">Find an Installer</a>
                <a href="/download-center/">Download Center</a>
                <a href="/sunx-product-warranty/">Warranty</a>
                <a href="/contact-us/">Contact Us</a>
                <a href="/blogs/">News & Media</a>
              </>
            )}
          </div>
        </div>
      </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <img src="/images/sunx-logo.png" alt="SunX" />
          <p className="footer-tag">Powering Pakistan&apos;s Solar Future</p>
          <p>
            SunX is Pakistan&apos;s leading provider of high-quality solar energy
            solutions for residential, commercial, and industrial applications.
          </p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <a href="/">Home</a>
          <a href="/about-us/">About Us</a>
          <a href="/products/">Products</a>
          <a href="/sunx-dealers/">Dealers</a>
          <a href="/contact-us/">Contact Us</a>
        </div>
        <div>
          <h3>Products</h3>
          <a href="/sun-prime-series/">Sun-Prime Series</a>
          <a href="/sun-pro-series/">Sun-Pro Series</a>
          <a href="/sun-ultra-series/">Sun-Ultra Series</a>
          <a href="/sun-max-series/">Sun-Max Series</a>
          <a href="/products/#batteries">Lithium Batteries</a>
        </div>
        <div>
          <h3>Contact Us</h3>
          <p>Office #15 Peshawar Business Center, Ring Road, Peshawar, KPK, Pakistan</p>
          <a href="tel:+923429470099">+92 342 94 700 99</a>
          <a href="tel:+923365003656">+92 336 500 3656</a>
          <a href="mailto:info@sunx.com">info@sunx.com</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© 2026 SunX Solar Energy Solutions. All Rights Reserved.</span>
        <div>
          <a href="/privacy-policy/">Privacy Policy</a>
          <a href="/terms-of-service/">Terms of Service</a>
          <a href="/cookie-policy/">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
}

function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="page-hero">
      <div className="hero-orb one" />
      <div className="hero-orb two" />
      <div className="shell">
        <p className="eyebrow light">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  center = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
}) {
  return (
    <div className={`section-heading ${center ? "center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <a className="product-image" href={product.href}>
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.tag ? <span>{product.tag}</span> : null}
      </a>
      <div className="product-body">
        <p className="product-family">{product.family}</p>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <a className="text-link" href={product.href}>
          View product <b>→</b>
        </a>
      </div>
    </article>
  );
}

function SupportGrid() {
  return (
    <section className="support-strip">
      <div className="shell">
        <SectionHeading
          eyebrow="SunX Support"
          title="Need help?"
          text="Fast access to product documents, certified partners and service."
          center
        />
        <div className="support-grid">
          <a href="/download-center/">
            <span className="support-icon">↓</span>
            <div>
              <h3>Data Download</h3>
              <p>Find important documents</p>
            </div>
          </a>
          <a href="/find-an-installer/">
            <span className="support-icon">⌖</span>
            <div>
              <h3>Find an Installer</h3>
              <p>Find your nearest SunX premium installer</p>
            </div>
          </a>
          <a href="/contact-us/">
            <span className="support-icon">✦</span>
            <div>
              <h3>Service</h3>
              <p>Dedicated assistance and prompt problem-solving</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

const heroSlides = [
  {
    image: "/images/hero-products.webp",
    alt: "SunX solar inverter and lithium battery product range",
    href: "/products/",
  },
  {
    image: "/images/hero-power.webp",
    alt: "SunX home solar energy solution",
    href: "/contact-us/",
  },
];

function HomeHero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const previousSlide = () =>
    setActiveSlide((activeSlide - 1 + 3) % 3);
  const nextSlide = () => setActiveSlide((activeSlide + 1) % 3);

  return (
    <section className="home-hero" aria-label="SunX featured products">
      <div className="shell">
        <div
          className="hero-frame"
          role="region"
          aria-roledescription="carousel"
          aria-label="SunX product highlights"
        >
          {heroSlides.map((slide, index) => (
            <a
              className={`hero-slide ${activeSlide === index ? "active" : ""}`}
              href={slide.href}
              aria-hidden={activeSlide !== index}
              tabIndex={activeSlide === index ? 0 : -1}
              key={slide.image}
            >
              <img className="hero-art" src={slide.image} alt={slide.alt} />
            </a>
          ))}
          <a
            className={`hero-slide hero-collage-slide ${activeSlide === 2 ? "active" : ""}`}
            href="/products/"
            aria-label="Explore the SunX product family"
            aria-hidden={activeSlide !== 2}
            tabIndex={activeSlide === 2 ? 0 : -1}
          >
            <div className="hero-collage">
              <img
                className="collage-logo"
                src="/images/sunx-logo.png"
                alt=""
              />
              <img
                className="collage-product collage-prime"
                src="/images/prime-product.png"
                alt=""
              />
              <img
                className="collage-product collage-pro"
                src="/images/pro-hero.png"
                alt=""
              />
              <img
                className="collage-product collage-battery"
                src="/images/powerwall-max.png"
                alt=""
              />
              <img
                className="collage-product collage-ultra"
                src="/images/ultra-8kw.png"
                alt=""
              />
            </div>
          </a>
          <button
            className="hero-arrow previous"
            type="button"
            aria-label="Previous hero image"
            onClick={previousSlide}
          >
            ‹
          </button>
          <button
            className="hero-arrow next"
            type="button"
            aria-label="Next hero image"
            onClick={nextSlide}
          >
            ›
          </button>
          <div className="hero-dots" aria-label="Choose a hero image">
            {[0, 1, 2].map((index) => (
              <button
                className={activeSlide === index ? "active" : ""}
                type="button"
                aria-label={`Show hero image ${index + 1}`}
                aria-pressed={activeSlide === index}
                onClick={() => setActiveSlide(index)}
                key={index}
              />
            ))}
          </div>
        </div>
        <div className="hero-stats">
          <div>
            <strong>7+</strong>
            <span>Years of Experience</span>
          </div>
          <div>
            <strong>1600+</strong>
            <span>Completed Projects</span>
          </div>
          <div>
            <strong>5 Year</strong>
            <span>Product Support</span>
          </div>
          <div>
            <strong>Nationwide</strong>
            <span>Dealer Network</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <main>
        <HomeHero />

        <section className="section intro-section">
          <div className="shell split">
            <div className="intro-visual">
              <div className="image-tile">
                <img src="/images/home-intro.webp" alt="SunX energy technology" />
              </div>
              <div className="quality-badge">
                <b>Premium</b>
                <span>Quality Products</span>
              </div>
            </div>
            <div>
              <SectionHeading
                eyebrow="About SunX"
                title="Trusted solar technology, made for Pakistan"
              />
              <p>
                SunX is one of Pakistan&apos;s most trusted and innovative solar
                technology brands, dedicated to powering a sustainable future.
                As a proud subsidiary of Asaan Solar Solution, SunX specializes
                in high-quality solar inverters and lithium-ion batteries that
                deliver reliable performance, advanced technology, and long-term
                value.
              </p>
              <p>
                Our mission is simple: empower Pakistan with solar energy. We
                build strong relationships with customers, dealers, and partners
                through top-quality products, excellent after-sales support, and
                continuous innovation.
              </p>
              <div className="check-grid">
                <span>Premium quality products</span>
                <span>Strong dealer network</span>
                <span>Reliable after-sales support</span>
                <span>Continuous innovation</span>
              </div>
              <a className="button primary" href="/about-us/">
                More About SunX
              </a>
            </div>
          </div>
        </section>

        <section className="section product-section">
          <div className="shell">
            <SectionHeading
              eyebrow="Featured Products"
              title="Energy solutions for every need"
              text="Explore our key inverter and battery ranges for homes, businesses, and commercial applications."
              center
            />
            <div className="product-grid featured-grid">
              {[
                productCards[1],
                productCards[5],
                productCards[7],
                productCards[11],
              ].map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
            <div className="center-action">
              <a className="button dark" href="/products/">
                View All Products
              </a>
            </div>
          </div>
        </section>

        <section className="dealer-section">
          <div className="shell dealer-split">
            <div>
              <SectionHeading
                eyebrow="Grow with SunX"
                title="Welcome to become our dealer"
                text="Become a SunX distributor and unlock a bigger solar market with high-quality products and excellent after-sales service."
              />
              <a className="button primary" href="/contact-us/">
                Become a Dealer
              </a>
            </div>
            <div className="benefit-grid">
              {dealerBenefits.map(([title, text], index) => (
                <article key={title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <SupportGrid />
      </main>
    </>
  );
}

function AboutPage() {
  const story = [
    ["2016", "The Beginning", "Asaan Solar was founded by Sajid Ahmad, starting with residential solar installations focused on customer satisfaction and long-term savings."],
    ["2017", "Commercial Growth", "The company began offering commercial and industrial solar solutions, completing large-scale projects across Pakistan."],
    ["2019", "Nationwide Reach", "Asaan Solar began importing solar equipment and expanded its dealer network to major cities nationwide."],
    ["2020", "SunX Launched", "Asaan Solar launched SunX PV Technology, its manufacturing subsidiary for solar inverters and lithium batteries."],
    ["2022", "Dealer Expansion", "SunX rapidly grew its distribution network, making products available across Pakistan and empowering installers."],
    ["2024", "International Step", "SunX registered its company in China and stepped into the international market for solar energy products."],
    ["2025", "The Next Era", "SunX prepared to enter solar panel and electric vehicle manufacturing, continuing its renewable energy journey."],
  ];
  return (
    <main>
      <PageHero
        eyebrow="Company Profile"
        title="About SunX"
        text="Pakistan-born solar innovation for homes, businesses, and industries."
      />
      <section className="section">
        <div className="shell split about-overview">
          <div>
            <SectionHeading eyebrow="Company Overview" title="Making clean energy accessible" />
            <p>
              SunX PV Technology is Pakistan&apos;s leading manufacturer of solar
              products, including high-performance solar inverters and lithium-ion
              batteries. It is a proud subsidiary of Asaan Solar Solution, founded
              by Sajid Ahmad in 2016, with a clear vision to make solar energy
              affordable and accessible for everyone in Pakistan.
            </p>
            <p>
              After years of experience in installation and imports, Asaan Solar
              launched SunX PV Technology to produce world-class solar inverters
              and lithium batteries under the SunX brand.
            </p>
            <p>
              Today, SunX stands as a symbol of Pakistani innovation, providing
              clean energy solutions nationwide and exporting quality solar
              products to international markets.
            </p>
          </div>
          <div className="about-image">
            <img src="/images/about-headquarters.png" alt="SunX headquarters" />
            <div className="about-image-note">
              <strong>Since 2016</strong>
              <span>Built on experience, quality and trust</span>
            </div>
          </div>
        </div>
      </section>
      <section className="mission-section">
        <div className="shell mission-grid">
          <div className="mission-copy">
            <p className="eyebrow light">Our Mission</p>
            <h2>Power Pakistan with clean, reliable solar energy</h2>
            <p>
              We aim to reduce dependence on fossil fuels by offering high-quality,
              affordable solar products that promote green growth and energy
              independence.
            </p>
          </div>
          <div className="values-grid">
            {[
              ["Innovation", "Better energy solutions through research, technology, and forward thinking."],
              ["Quality", "Strict standards for performance, safety, and long-term reliability."],
              ["Sustainability", "Helping people and businesses switch to renewable energy sources."],
            ].map(([title, text]) => (
              <article key={title}>
                <span>✦</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" id="story">
        <div className="shell">
          <SectionHeading
            eyebrow="Our Story"
            title="A journey built on trust"
            text="From residential installations to a growing international solar brand."
            center
          />
          <div className="timeline">
            {story.map(([year, title, text]) => (
              <article key={year}>
                <div className="timeline-year">{year}</div>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CallToAction />
      <SupportGrid />
    </main>
  );
}

function ProductsPage() {
  const { products } = useCms();
  const managedProducts: Product[] = products.map((product) => ({
    name: String(product.name),
    family: String(product.family || "Solar Products"),
    description: String(product.summary || product.description || ""),
    image: String(product.image || "/images/prime-product.png"),
    href: `/products/${String(product.slug)}/`,
    tag: product.tag ? String(product.tag) : undefined,
  }));
  const displayed = managedProducts.length ? managedProducts : productCards;
  const inverters = displayed.filter(
    (product) => !product.family.toLowerCase().includes("batter"),
  );
  const batteries = displayed.filter((product) =>
    product.family.toLowerCase().includes("batter"),
  );
  return (
    <main>
      <PageHero
        eyebrow="SunX Product Range"
        title="Our Products"
        text="A full range of solar and energy storage products for every application."
      />
      <section className="section product-section">
        <div className="shell">
          <div className="category-pills">
            <a href="#inverters">Solar Inverters</a>
            <a href="#batteries">Lithium Ion Batteries</a>
            <a href="/sun-max-series/">All-In-One ESS</a>
          </div>
          <div id="inverters" className="product-group">
            <SectionHeading
              eyebrow="Solar Inverters"
              title="Smart power conversion"
              text="Hybrid inverter ranges for residential and commercial energy systems."
            />
            <div className="product-grid">
              {inverters.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          </div>
          <div id="batteries" className="product-group">
            <SectionHeading
              eyebrow="Lithium Batteries"
              title="Advanced LiFePO4 storage"
              text="Reliable battery systems for daily backup, energy independence, and scalable storage."
            />
            <div className="product-grid battery-grid">
              {batteries.map((product) => (
                <ProductCard key={product.name} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>
      <SupportGrid />
    </main>
  );
}

function SeriesPage({ config }: { config: SeriesConfig }) {
  const [selected, setSelected] = useState(0);
  const model = config.models[selected];
  return (
    <main>
      <section className="series-hero">
        <div className="shell series-hero-grid">
          <div>
            <p className="eyebrow">{config.eyebrow}</p>
            <h1>{config.title}</h1>
            <p className="series-subtitle">{config.subtitle}</p>
            <ul className="feature-list">
              {config.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <div className="hero-actions">
              <a className="button primary" href="#specifications">
                View Specifications
              </a>
              <a className="button secondary" href="/download-center/">
                Download Datasheet
              </a>
            </div>
          </div>
          <div className="series-image">
            <img src={config.image} alt={config.title} />
          </div>
        </div>
      </section>
      <section className="section advantage-section">
        <div className="shell">
          <div className="advantage-copy">
            <SectionHeading eyebrow="Product Advantage" title="Power that works intelligently" />
            <p>{config.description}</p>
          </div>
          <div className="advantage-grid">
            {config.advantages.map((advantage, index) => (
              <article key={advantage}>
                <span>0{index + 1}</span>
                <p>{advantage}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section specs-section" id="specifications">
        <div className="shell">
          <SectionHeading
            eyebrow="Product Parameters"
            title="Technical specifications"
            text="Select a model to compare its main power, charging, battery, and operating details."
            center
          />
          <div className="model-tabs" role="tablist" aria-label="Select product model">
            {config.models.map((item, index) => (
              <button
                key={item.name}
                type="button"
                role="tab"
                aria-selected={selected === index}
                className={selected === index ? "active" : ""}
                onClick={() => setSelected(index)}
              >
                {item.name}
              </button>
            ))}
          </div>
          <div className="spec-card">
            <div className="spec-title">
              <span>SUNX</span>
              <div>
                <h3>{model.name}</h3>
                <p>{model.subtitle}</p>
              </div>
            </div>
            <div className="spec-table">
              {model.specs.map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <DownloadsPreview />
      <SupportGrid />
    </main>
  );
}

function SunMaxPage() {
  return (
    <main>
      <section className="series-hero">
        <div className="shell series-hero-grid">
          <div>
            <p className="eyebrow">SunX Max Series</p>
            <h1>Sun-Max 6kW</h1>
            <p className="series-subtitle">
              Compact, powerful hybrid inverter for residential and commercial use
            </p>
            <ul className="feature-list">
              <li>Smart hybrid energy management</li>
              <li>High-efficiency MPPT charging</li>
              <li>IP65 protection for demanding environments</li>
              <li>Intelligent monitoring and communication</li>
              <li>Enhanced grid and backup support</li>
            </ul>
            <div className="hero-actions">
              <a className="button primary" href="/contact-us/">
                Request Information
              </a>
              <a className="button secondary" href="/download-center/">
                Download Center
              </a>
            </div>
          </div>
          <div className="series-image tall">
            <img src="/images/sunmax-product.png" alt="Sun-Max 6kW inverter" />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="shell split">
          <div>
            <SectionHeading
              eyebrow="Product Advantage"
              title="Built for dependable solar power"
            />
            <p>
              The Sun-Max 6kW is a compact yet powerful inverter for residential,
              light commercial, and small-scale utility applications. Its efficient
              energy conversion, smart controls, and protected design support stable
              performance in demanding conditions.
            </p>
          </div>
          <div className="spec-card compact">
            <div className="spec-table">
              {[
                ["Rated output", "6kW"],
                ["Solar charging", "MPPT"],
                ["Protection", "IP65"],
                ["Output", "Pure sine wave"],
                ["Monitoring", "Smart communication"],
                ["Application", "Home and commercial"],
              ].map(([label, value]) => (
                <div key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SupportGrid />
    </main>
  );
}

function DealersPage() {
  const cities = ["Peshawar", "Mardan", "Batkhela", "D.I Khan", "Timergara", "Buner", "Hangu", "Nowshera"];
  const [city, setCity] = useState("Peshawar");
  const filtered = dealers.filter((dealer) => dealer.city === city);
  return (
    <main>
      <PageHero
        eyebrow="Authorized Network"
        title="Find a Distributor Near You"
        text="Browse our authorized distributors by location."
      />
      <section className="section locator-section">
        <div className="shell">
          <div className="city-tabs" role="tablist" aria-label="Choose city">
            {cities.map((item) => (
              <button
                type="button"
                key={item}
                className={city === item ? "active" : ""}
                onClick={() => setCity(item)}
              >
                {item}
              </button>
            ))}
          </div>
          {filtered.length ? (
            <div className="locator-grid">
              {filtered.map((dealer) => {
                const phone = dealer.phone.replace(/\D/g, "");
                return (
                  <article className="locator-card" key={dealer.name}>
                    <span className="locator-badge">Authorized Distributor</span>
                    <h3>{dealer.name}</h3>
                    <p className="location-line">⌖ {dealer.address}</p>
                    <a href={`tel:${phone}`}>☎ {dealer.phone}</a>
                    <a href={`mailto:${dealer.email}`}>✉ {dealer.email}</a>
                    <a
                      className="whatsapp-button"
                      href={`https://wa.me/${phone}?text=Hello%20${encodeURIComponent(dealer.name)}%2C%20I%20want%20to%20know%20more%20about%20your%20solar%20products.`}
                    >
                      WhatsApp
                    </a>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <img src="/images/dealer-network.png" alt="" />
              <div>
                <h3>Distributor details are being updated</h3>
                <p>
                  Contact SunX support and we will connect you with the nearest
                  authorized distributor in {city}.
                </p>
                <a className="button primary" href="/contact-us/">
                  Contact SunX
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
      <SupportGrid />
    </main>
  );
}

function InstallersPage() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      installers.filter((installer) =>
        `${installer[0]} ${installer[1]}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <main>
      <PageHero
        eyebrow="Certified Professionals"
        title="Find Your SunX Certified Installer"
        text="Connect with our premium certified installers for professional solar solutions."
      />
      <section className="section locator-section">
        <div className="shell">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Enter your city or area..."
            />
          </label>
          <p className="results-count">
            Showing {filtered.length} of {installers.length} installers
          </p>
          <div className="locator-grid installer-grid">
            {filtered.map(([name, location, level, phone, email]) => (
              <article className="locator-card installer-card" key={name}>
                <div className="installer-avatar">{name.split(" ").map((part) => part[0]).join("")}</div>
                <span className="locator-badge">{level}</span>
                <h3>{name}</h3>
                <p className="location-line">⌖ {location}</p>
                <p className="certified-line">Certified Solar Installer</p>
                <a href={`tel:${phone.replace(/\D/g, "")}`}>☎ {phone}</a>
                <a href={`mailto:${email}`}>✉ {email}</a>
                <a className="outline-button" href={`mailto:${email}`}>
                  Contact Installer
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SupportGrid />
    </main>
  );
}

function DownloadsPreview() {
  return (
    <section className="downloads-preview">
      <div className="shell">
        <div>
          <p className="eyebrow light">Downloads</p>
          <h2>Technical documentation and resources</h2>
        </div>
        <div className="download-mini-grid">
          {["Product Datasheet", "Installation Manual", "Product Brochures"].map(
            (name) => (
              <a href="/download-center/" key={name}>
                <span>PDF</span>
                <strong>{name}</strong>
                <b>↓</b>
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

function DownloadsPage() {
  const files = [
    ["Product", "Sun-Prime Series Product Datasheet", "PDF", "V2.0"],
    ["Product", "Sun-Pro Series Product Datasheet", "PDF", "V2.0"],
    ["Product", "Sun-Ultra Series Product Datasheet", "PDF", "V2.0"],
    ["Product", "SunX Installation and Commissioning Guide", "PDF", "V1.0"],
    ["Warranty", "2025 SunX Comprehensive Warranty Terms", "PDF", "V2.0"],
    ["Warranty", "2025 SunX Inverter Warranty Guide", "PDF", "V2.0"],
    ["Warranty", "2025 SunX Battery System Warranty", "PDF", "V2.0"],
    ["Company Info", "SunX Company Profile and Product Catalogue", "PDF", "2025"],
  ];
  const [category, setCategory] = useState("Product");
  const [query, setQuery] = useState("");
  const filtered = files.filter(
    (file) =>
      file[0] === category &&
      file[1].toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main>
      <PageHero
        eyebrow="Technical Resources"
        title="Data Download"
        text="Find product information, warranty documents, and company resources."
      />
      <section className="section">
        <div className="shell">
          <div className="download-tools">
            <div className="category-pills compact-pills">
              {["Product", "Warranty", "Company Info"].map((item) => (
                <button
                  type="button"
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <label className="search-box compact-search">
              <span>⌕</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Please enter keyword to search files..."
              />
            </label>
          </div>
          <div className="download-table">
            <div className="download-row download-head">
              <span>File Name</span>
              <span>Format</span>
              <span>Version</span>
              <span>Download</span>
            </div>
            {filtered.map((file) => (
              <div className="download-row" key={file[1]}>
                <div>
                  <span className="file-icon">PDF</span>
                  <strong>{file[1]}</strong>
                </div>
                <span>{file[2]}</span>
                <span>{file[3]}</span>
                <a href="/contact-us/" aria-label={`Request ${file[1]}`}>
                  Request file ↓
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
      <SupportGrid />
    </main>
  );
}

function WarrantyPage() {
  const warrantyGroups = [
    {
      title: "Warranty for Hybrid Inverter",
      period: "2 Years Parts Warranty + 10 Years Service Warranty",
      products: "SunX-Pro, SunX-Ultra, SunX-Smart, SunX-Elite and SunX-Max hybrid inverter ranges",
      details: [
        "Years 1–2: complete parts replacement and free service",
        "Years 3–10: free service warranty; parts charges may apply",
        "Free technical support, diagnostics and labor",
        "Professional repair and maintenance",
      ],
    },
    {
      title: "Warranty for Lithium Batteries",
      period: "2 Years Parts Warranty + 10 Years Service Warranty",
      products: "SunX PowerBank, EnergyVault and StoragePro battery systems",
      details: [
        "Capacity retention guarantee of 80% after 10 years",
        "6000+ cycle life protection at 80% depth of discharge",
        "Battery Management System coverage",
        "Temperature control and safety system protection",
      ],
    },
    {
      title: "Warranty for On Grid Inverter",
      period: "2 Years Parts Warranty + 10 Years Service Warranty",
      products: "SunX Grid single-phase and three-phase inverter ranges",
      details: [
        "Grid synchronization and safety compliance",
        "MPPT tracking efficiency guarantee",
        "Anti-islanding protection systems",
        "DC and AC disconnect safety features",
      ],
    },
    {
      title: "Warranty for Solar Panels 585W to 615W",
      period: "12 Years Product Warranty + 25 Years Performance Warranty",
      products: "SunX Mono 585W, 590W, 595W, 600W, 610W and 615W panels",
      details: [
        "90% power output after 10 years",
        "80% power output after 25 years",
        "Manufacturing defect cover for 12 years",
        "Frame, junction box and bypass diode protection",
      ],
    },
  ];
  return (
    <main>
      <PageHero
        eyebrow="Peace of Mind"
        title="Product Warranty"
        text="Clear product coverage and long-term service support from SunX."
      />
      <section className="section warranty-intro">
        <div className="shell">
          <div className="warranty-highlight">
            <div>
              <span>2</span>
              <p>Years parts warranty</p>
            </div>
            <div>
              <span>10</span>
              <p>Years service warranty</p>
            </div>
            <div>
              <span>25</span>
              <p>Years panel performance</p>
            </div>
          </div>
          <p className="warranty-note">
            The warranty period starts from the earlier of the first product
            installation date or six months after the date of production.
          </p>
          <div className="warranty-grid">
            {warrantyGroups.map((group) => (
              <article key={group.title}>
                <span className="locator-badge">SunX Coverage</span>
                <h3>{group.title}</h3>
                <p className="warranty-period">{group.period}</p>
                <p>{group.products}</p>
                <ul>
                  {group.details.map((detail) => (
                    <li key={detail}>{detail}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <SupportGrid />
    </main>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);
    setFormError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const response = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          city: formData.get("city"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          formType: "contact",
          sourcePath: "/contact-us",
        }),
      });
      if (!response.ok) throw new Error("The form could not be submitted");
      form.reset();
      setSent(true);
    } catch {
      setFormError(
        "We could not save your message. Please email info@sunxpv.com for immediate support.",
      );
    } finally {
      setSending(false);
    }
  };
  const offices = [
    ["Karachi Headquarters", "Plot #77C, DHA Phase II, Ext. Main Korangi Road, Karachi", "+92 21 35392590", "+92 300 0500749", "karachi@sunx.com"],
    ["Lahore Office", "Office #203, Al-Hafeez Shopping Mall, Gulberg III, Lahore", "+92 42 35778945", "+92 321 1234567", "lahore@sunx.com"],
    ["Islamabad Office", "Suite #7, Evacuee Trust Complex, F-5/1, Islamabad", "+92 51 2876543", "+92 333 5678901", "islamabad@sunx.com"],
  ];
  return (
    <main>
      <PageHero
        eyebrow="Talk to SunX"
        title="Contact SunX"
        text="We are here to help you with all your solar energy needs."
      />
      <section className="section office-section">
        <div className="shell">
          <SectionHeading eyebrow="Our Offices" title="Support across Pakistan" center />
          <div className="office-grid">
            {offices.map(([name, address, phone, mobile, email]) => (
              <article key={name}>
                <span className="office-icon">⌖</span>
                <h3>{name}</h3>
                <p>{address}</p>
                <a href={`tel:${phone.replace(/\D/g, "")}`}>{phone}</a>
                <a href={`tel:${mobile.replace(/\D/g, "")}`}>{mobile}</a>
                <a href={`mailto:${email}`}>{email}</a>
                <a className="text-link" href={`https://wa.me/${mobile.replace(/\D/g, "")}`}>
                  WhatsApp <b>→</b>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="contact-section">
        <div className="shell contact-grid">
          <div>
            <p className="eyebrow light">Send Us a Message</p>
            <h2>How can we help?</h2>
            <p>
              Fill out the form and our support team will contact you as soon as
              possible.
            </p>
            <div className="contact-detail">
              <span>Call</span>
              <a href="tel:+923429470099">+92 342 947 0099</a>
            </div>
            <div className="contact-detail">
              <span>Email</span>
              <a href="mailto:info@sunx.com">info@sunx.com</a>
            </div>
          </div>
          <form className="contact-form" onSubmit={submit}>
            <div className="form-grid">
              <label>
                Full Name
                <input name="name" required placeholder="Your full name" />
              </label>
              <label>
                Email Address
                <input name="email" required type="email" placeholder="Your email address" />
              </label>
              <label>
                Phone Number
                <input name="phone" required type="tel" placeholder="Your phone number" />
              </label>
              <label>
                Nearest Office
                <select name="city" defaultValue="">
                  <option value="" disabled>Select office</option>
                  <option>Karachi</option>
                  <option>Lahore</option>
                  <option>Islamabad</option>
                  <option>Peshawar</option>
                </select>
              </label>
            </div>
            <label>
              Subject
              <select name="subject" defaultValue="">
                <option value="" disabled>Select subject</option>
                <option>Product Information</option>
                <option>Warranty Support</option>
                <option>Become a Dealer</option>
                <option>Technical Support</option>
              </select>
            </label>
            <label>
              Message
              <textarea name="message" required rows={5} placeholder="Tell us how we can help" />
            </label>
            <label className="checkbox-line">
              <input required type="checkbox" />
              <span>I agree to the processing of my data for this inquiry.</span>
            </label>
            <button className="button primary" type="submit" disabled={sending}>
              {sending ? "Sending…" : "Send Message"}
            </button>
            {sent ? (
              <p className="form-success" role="status">
                Thank you. Your message details are ready. Please also contact
                SunX at info@sunx.com for immediate support.
              </p>
            ) : null}
            {formError ? (
              <p className="form-error" role="alert">
                {formError}
              </p>
            ) : null}
          </form>
        </div>
      </section>
      <FaqSection />
    </main>
  );
}

function FaqSection() {
  const faqs = [
    ["How can I purchase SunX products?", "SunX products are available through our authorized dealer network across Pakistan. Visit the dealer page to find the nearest dealer in your area."],
    ["What warranty do you offer?", "SunX provides product and service warranty coverage based on the product category. Full details are available on the warranty page."],
    ["How can I become a SunX dealer?", "Use the contact form and select Become a Dealer. Our business development team will contact you with more information."],
    ["Do you provide installation services?", "SunX works through authorized dealers and certified installers trained for professional installation and after-sales support."],
    ["What size solar system do I need?", "System size depends on your energy consumption and available space. An authorized partner can assess your site and recommend the right capacity."],
  ];
  return (
    <section className="section faq-section">
      <div className="shell">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Quick answers"
          center
        />
        <div className="faq-list">
          {faqs.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogsPage() {
  const { posts: managedPosts } = useCms();
  const fallbackPosts = [
    ["Product Guide", "Choose the right SunX inverter series", "Understand how Sun Prime, Sun Pro, Sun Ultra, and Sun Max fit different residential and commercial needs.", "/images/pro-hero.png", "/products/"],
    ["Energy Storage", "Why LiFePO4 battery storage matters", "SunX lithium battery systems combine smart battery management, long life, and scalable energy storage.", "/images/powerwall-standard.png", "/products/#batteries"],
    ["Partner Network", "Grow with the SunX dealer network", "Authorized partners receive product range access, marketing support, territory opportunities, and loyalty rewards.", "/images/dealer-network.png", "/sunx-dealers/"],
  ];
  const posts = managedPosts.length
    ? managedPosts.map((post) => [
        String(post.category || "News"),
        String(post.title),
        String(post.excerpt || post.content || ""),
        String(post.featured_image || "/images/hero-products.webp"),
        `/blogs/${String(post.slug)}/`,
      ])
    : fallbackPosts;
  return (
    <main>
      <PageHero
        eyebrow="News & Media"
        title="SunX Insights"
        text="Product knowledge, solar guidance, and updates from the SunX network."
      />
      <section className="section">
        <div className="shell blog-grid">
          {posts.map(([tag, title, text, image, href]) => (
            <article key={title}>
              <a className="blog-image" href={href}>
                <img src={image} alt="" />
              </a>
              <div>
                <span>{tag}</span>
                <h2>{title}</h2>
                <p>{text}</p>
                <a className="text-link" href={href}>
                  Read more <b>→</b>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
      <SupportGrid />
    </main>
  );
}

function ManagedPage({ page }: { page: CmsRecord }) {
  return (
    <main>
      <PageHero
        eyebrow="SunX"
        title={String(page.title)}
        text={String(page.seo_description || "SunX PV Technology")}
      />
      <section className="section">
        <article className="shell managed-page-content">
          {String(page.content || "")
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
            ))}
        </article>
      </section>
      <SupportGrid />
    </main>
  );
}

function ManagedPost({ post }: { post: CmsRecord }) {
  return (
    <main>
      <PageHero
        eyebrow={String(post.category || "News & Media")}
        title={String(post.title)}
        text={String(post.excerpt || "")}
      />
      <section className="section">
        <article className="shell managed-page-content article-content">
          {post.featured_image ? (
            <img src={String(post.featured_image)} alt={String(post.title)} />
          ) : null}
          {String(post.content || "")
            .split(/\n{2,}/)
            .filter(Boolean)
            .map((paragraph, index) => (
              <p key={`${index}-${paragraph.slice(0, 20)}`}>{paragraph}</p>
            ))}
        </article>
      </section>
    </main>
  );
}

function ManagedProduct({ product }: { product: CmsRecord }) {
  let specifications: { label?: string; value?: string }[] = [];
  try {
    specifications = JSON.parse(String(product.specifications || "[]"));
  } catch {
    specifications = [];
  }
  return (
    <main>
      <section className="series-hero">
        <div className="shell series-hero-grid managed-product-hero">
          <div>
            <p className="eyebrow">{String(product.family || "SunX product")}</p>
            <h1>{String(product.name)}</h1>
            <p className="series-subtitle">{String(product.summary || "")}</p>
            <p>{String(product.description || "")}</p>
            <div className="hero-actions">
              <a className="button primary" href="/contact-us/">
                Request information
              </a>
              <a className="button secondary" href="/download-center/">
                Downloads
              </a>
            </div>
          </div>
          <div className="series-product-visual">
            <img
              src={String(product.image || "/images/prime-product.png")}
              alt={String(product.name)}
            />
          </div>
        </div>
      </section>
      {specifications.length ? (
        <section className="section">
          <div className="shell">
            <SectionHeading eyebrow="Product details" title="Specifications" />
            <div className="spec-table">
              {specifications.map((spec, index) => (
                <div key={`${spec.label}-${index}`}>
                  <span>{spec.label || "Specification"}</span>
                  <strong>{spec.value || "—"}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <SupportGrid />
    </main>
  );
}

function PolicyPage({ type }: { type: "privacy" | "terms" | "cookie" }) {
  const content = {
    privacy: {
      title: "Privacy Policy",
      text: "This page explains how SunX handles information shared through product, dealer, installer, warranty, and support inquiries.",
      items: [
        ["Information we collect", "Contact details and inquiry information submitted by you may be used to provide support and respond to requests."],
        ["How information is used", "Information is used for customer service, product support, partner communication, and improvement of SunX services."],
        ["Your choices", "You may contact SunX to request correction or removal of information you have submitted."],
      ],
    },
    terms: {
      title: "Terms of Service",
      text: "These terms apply to the use of SunX website information, product resources, and support channels.",
      items: [
        ["Product information", "Specifications and availability may be updated as products develop. Confirm current details with an authorized distributor."],
        ["Website use", "Use this website for lawful product research, support, and partner communication."],
        ["Warranty", "Warranty coverage is governed by the applicable SunX warranty terms for each product category."],
      ],
    },
    cookie: {
      title: "Cookie Policy",
      text: "This page explains how basic browser technologies may support website performance and user experience.",
      items: [
        ["Essential storage", "Essential browser storage may be used to keep navigation and website preferences working."],
        ["Performance", "General usage information may help improve page speed, layout, and content clarity."],
        ["Control", "You can manage cookie and site storage preferences in your browser settings."],
      ],
    },
  }[type];
  return (
    <main>
      <PageHero eyebrow="SunX Website" title={content.title} text={content.text} />
      <section className="section">
        <div className="shell policy-content">
          {content.items.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
          <a className="button primary" href="/contact-us/">
            Contact SunX
          </a>
        </div>
      </section>
    </main>
  );
}

function CallToAction() {
  return (
    <section className="cta-section">
      <div className="shell cta-inner">
        <div>
          <p className="eyebrow light">Ready to Switch to Solar?</p>
          <h2>Build your energy future with SunX</h2>
          <p>Contact us today or find an authorized dealer near you.</p>
        </div>
        <div className="hero-actions">
          <a className="button white" href="/contact-us/">Contact Us</a>
          <a className="button ghost-white" href="/sunx-dealers/">Find a Dealer</a>
        </div>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <main>
      <section className="not-found">
        <div className="shell">
          <span>404</span>
          <h1>Page not found</h1>
          <p>The page you requested is not available.</p>
          <a className="button primary" href="/">Return Home</a>
        </div>
      </section>
    </main>
  );
}

function SunXRouter({ path }: { path: string }) {
  const cms = useCms();
  const cleanPath = path !== "/" ? path.replace(/\/+$/, "") : "/";
  const cleanSlug = cleanPath === "/" ? "" : cleanPath.replace(/^\/|\/$/g, "");
  const routeRecord = cms.pages.find((item) => item.slug === cleanSlug);
  let page;

  if (routeRecord?.status === "archived") {
    page = <NotFoundPage />;
  } else if (
    routeRecord?.status === "published" &&
    routeRecord.template !== "legacy"
  ) {
    page = <ManagedPage page={routeRecord} />;
  } else switch (cleanPath) {
    case "/":
    case "/home-2":
    case "/homepage":
      page = <HomePage />;
      break;
    case "/about-us":
    case "/about-us-new":
      page = <AboutPage />;
      break;
    case "/products":
    case "/products-page-new":
      page = <ProductsPage />;
      break;
    case "/sun-prime-series":
      page = <SeriesPage config={seriesData.prime} />;
      break;
    case "/sun-pro-series":
      page = <SeriesPage config={seriesData.pro} />;
      break;
    case "/sun-ultra-series":
      page = <SeriesPage config={seriesData.ultra} />;
      break;
    case "/sun-max-series":
      page = <SunMaxPage />;
      break;
    case "/sunx-dealers":
      page = <DealersPage />;
      break;
    case "/find-an-installer":
      page = <InstallersPage />;
      break;
    case "/download-center":
      page = <DownloadsPage />;
      break;
    case "/sunx-product-warranty":
      page = <WarrantyPage />;
      break;
    case "/contact-us":
      page = <ContactPage />;
      break;
    case "/blogs":
      page = <BlogsPage />;
      break;
    case "/privacy-policy":
      page = <PolicyPage type="privacy" />;
      break;
    case "/terms-of-service":
      page = <PolicyPage type="terms" />;
      break;
    case "/cookie-policy":
      page = <PolicyPage type="cookie" />;
      break;
    default:
      {
        const slug = cleanSlug;
        const managedPage = cms.pages.find(
          (item) => item.slug === slug && item.status === "published",
        );
        const managedPost =
          cleanPath.startsWith("/blogs/") &&
          cms.posts.find((item) => item.slug === slug.replace(/^blogs\//, ""));
        const managedProduct =
          cleanPath.startsWith("/products/") &&
          cms.products.find(
            (item) => item.slug === slug.replace(/^products\//, ""),
          );
        page = managedPage ? (
          <ManagedPage page={managedPage} />
        ) : managedPost ? (
          <ManagedPost post={managedPost} />
        ) : managedProduct ? (
          <ManagedProduct product={managedProduct} />
        ) : (
          <NotFoundPage />
        );
      }
  }

  return (
    <>
      <Header path={cleanPath} />
      {page}
      <Footer />
      <TrafficTracker path={cleanPath} />
      <a className="floating-contact" href="https://wa.me/923429470099" aria-label="Contact SunX on WhatsApp">
        <span>WA</span>
      </a>
    </>
  );
}

export default function SunXSite({ path }: { path: string }) {
  return (
    <CmsProvider>
      <SunXRouter path={path} />
    </CmsProvider>
  );
}
