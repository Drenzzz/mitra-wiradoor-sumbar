"use client";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function OrganizationJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wiradoorsumbar.com";

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Wiradoor Sumatera Barat",
    alternateName: "Wiradoor Sumbar",
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: "Distributor resmi pintu premium berkualitas ekspor dari Wiradoor. Melayani penjualan dan pemasangan pintu kayu engineering di seluruh Sumatera Barat.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Bypass Ipuh Mandi Angin No. 12",
      addressLocality: "Bukittinggi",
      addressRegion: "Sumatera Barat",
      postalCode: "26116",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+62 812-3456-7890",
      contactType: "customer service",
      availableLanguage: ["Indonesian"],
    },
    sameAs: [process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "", process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || ""].filter(Boolean),
  };

  return <JsonLd data={organizationData} />;
}

export function LocalBusinessJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wiradoorsumbar.com";

  const localBusinessData = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${siteUrl}/#business`,
    name: "Wiradoor Sumatera Barat",
    image: `${siteUrl}/logo.png`,
    url: siteUrl,
    telephone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+62 812-3456-7890",
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@wiradoorsumbar.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Ipuh Mandiangin No.99, Campago Ipuh, Kec. Mandiangin Koto Selayan",
      addressLocality: "Bukittinggi",
      addressRegion: "Sumatera Barat",
      postalCode: "26117",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -0.3055,
      longitude: 100.3691,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    priceRange: "$$",
  };

  return <JsonLd data={localBusinessData} />;
}

interface ProductJsonLdProps {
  product: {
    id: string;
    name: string;
    description: string | null;
    imageUrl: string;
    category?: { name: string } | null;
  };
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wiradoorsumbar.com";

  const productData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.name,
    image: product.imageUrl,
    url: `${siteUrl}/produk/${product.id}`,
    brand: {
      "@type": "Brand",
      name: "Wiradoor",
    },
    manufacturer: {
      "@type": "Organization",
      name: "Wiradoor",
    },
    category: product.category?.name || "Pintu",
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "IDR",
      seller: {
        "@type": "Organization",
        name: "Wiradoor Sumatera Barat",
      },
    },
  };

  return <JsonLd data={productData} />;
}

interface ArticleJsonLdProps {
  article: {
    title: string;
    slug: string;
    excerpt?: string | null;
    content: string;
    featuredImageUrl: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    author?: { name: string | null } | null;
  };
}

export function ArticleJsonLd({ article }: ArticleJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wiradoorsumbar.com";

  const articleData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt || article.title,
    image: article.featuredImageUrl,
    url: `${siteUrl}/artikel/${article.slug}`,
    datePublished: new Date(article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: article.author?.name || "Wiradoor Sumbar",
    },
    publisher: {
      "@type": "Organization",
      name: "Wiradoor Sumatera Barat",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/artikel/${article.slug}`,
    },
  };

  return <JsonLd data={articleData} />;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wiradoorsumbar.com";

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`,
    })),
  };

  return <JsonLd data={breadcrumbData} />;
}

interface WebPageJsonLdProps {
  title: string;
  description: string;
  url: string;
}

export function WebPageJsonLd({ title, description, url }: WebPageJsonLdProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wiradoorsumbar.com";

  const webPageData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url.startsWith("http") ? url : `${siteUrl}${url}`,
    isPartOf: {
      "@type": "WebSite",
      name: "Wiradoor Sumatera Barat",
      url: siteUrl,
    },
  };

  return <JsonLd data={webPageData} />;
}
