export const resources = [
  {
    name: "dashboard",
    list: "/dashboard",
    meta: {
      label: "Dashboard",
      icon: "mdi:view-dashboard",
    },
  },

  // ── Parent: Landing Page Content (no list route — group only) ──────────────
  {
    name: "landing-page-content",
    meta: {
      label: "Landing Page Content",
      icon: "mdi:web",
    },
  },
  {
    name: "perfumes",
    list: "/perfumes",
    create: "/perfumes/create",
    edit: "/perfumes/edit/:id",
    show: "/perfumes/show/:id",
    meta: {
      canDelete: true,
      label: "Perfumes",
      parent: "landing-page-content",
      icon: "tabler:perfume",
    },
  },
  {
    name: "perfume-categories",
    list: "/perfume-categories",
    create: "/perfume-categories/create",
    edit: "/perfume-categories/edit/:id",
    show: "/perfume-categories/show/:id",
    meta: {
      canDelete: true,
      label: "Perfume Categories",
      parent: "landing-page-content",
      icon: "carbon:category-new-each",
    },
  },
  {
    name: "pricing-categories",
    list: "/pricing-categories",
    create: "/pricing-categories/create",
    edit: "/pricing-categories/edit/:id",
    show: "/pricing-categories/show/:id",
    meta: {
      canDelete: true,
      label: "Pricing Categories",
      parent: "landing-page-content",
      icon: "mdi:tag-multiple",
    },
  },
  {
    name: "pricings",
    list: "/pricings",
    create: "/pricings/create",
    edit: "/pricings/edit/:id",
    show: "/pricings/show/:id",
    meta: {
      canDelete: true,
      label: "Pricings",
      parent: "landing-page-content",
      icon: "mdi:currency-usd",
    },
  },
  {
    name: "faqs",
    list: "/faqs",
    create: "/faqs/create",
    edit: "/faqs/edit/:id",
    show: "/faqs/show/:id",
    meta: {
      canDelete: true,
      label: "FAQs",
      parent: "landing-page-content",
      icon: "mdi:help-circle",
    },
  },
  // ── Parent: Content Studio (social media workspace + blog) ─────────────────
  {
    name: "content-studio",
    meta: {
      label: "Content Studio",
      icon: "mdi:palette-swatch-variant",
    },
  },
  {
    name: "social-posts",
    list: "/social-posts",
    create: "/social-posts/create",
    edit: "/social-posts/edit/:id",
    show: "/social-posts/show/:id",
    meta: {
      canDelete: true,
      label: "Postingan Sosmed",
      parent: "content-studio",
      icon: "mdi:instagram",
    },
  },
  {
    name: "content-calendar",
    list: "/content-calendar",
    meta: {
      label: "Kalender Konten",
      parent: "content-studio",
      icon: "mdi:calendar-month-outline",
    },
  },
  {
    // Blog articles shown on the website. Lives in Content Studio so the
    // content team has social media and blog in one place.
    name: "articles",
    list: "/articles",
    create: "/articles/create",
    edit: "/articles/edit/:id",
    show: "/articles/show/:id",
    meta: {
      canDelete: true,
      label: "Blog",
      parent: "content-studio",
      icon: "mdi:newspaper-variant-outline",
    },
  },

  // ── Parent: Portal Management ──────────────────────────────────────────────
  {
    name: "portal-management",
    meta: {
      label: "Portal Management",
      icon: "mdi:shield-account",
    },
  },
  {
    name: "users",
    list: "/users",
    create: "/users/create",
    edit: "/users/edit/:id",
    show: "/users/show/:id",
    meta: {
      canDelete: true,
      label: "Users",
      parent: "portal-management",
      icon: "mdi:account-multiple",
    },
  },

  // ── Parent: POS Management ──────────────────────────────────────────────

  {
    name: "pos-management",
    meta: {
      label: "POS Management",
      icon: "mdi:cash-register",
    },
  },
  {
    name: "pos-perfume-categories",
    list: "/pos/perfume-categories",
    create: "/pos/perfume-categories/create",
    edit: "/pos/perfume-categories/edit/:id",
    show: "/pos/perfume-categories/show/:id",
    meta: {
      canDelete: true,
      label: "Kategori Parfum",
      parent: "pos-management",
      icon: "carbon:category-new-each",
    },
  },
  {
    name: "pos-service-categories",
    list: "/pos/service-categories",
    create: "/pos/service-categories/create",
    edit: "/pos/service-categories/edit/:id",
    show: "/pos/service-categories/show/:id",
    meta: {
      canDelete: true,
      label: "Kategori Layanan",
      parent: "pos-management",
      icon: "mdi:shape",
    },
  },
  {
    name: "pos-perfumes",
    list: "/pos/perfumes",
    create: "/pos/perfumes/create",
    edit: "/pos/perfumes/edit/:id",
    show: "/pos/perfumes/show/:id",
    meta: {
      canDelete: true,
      label: "Parfum",
      parent: "pos-management",
      icon: "tabler:perfume",
    },
  },
  {
    name: "pos-services",
    list: "/pos/services",
    create: "/pos/services/create",
    edit: "/pos/services/edit/:id",
    show: "/pos/services/show/:id",
    meta: {
      canDelete: true,
      label: "Layanan",
      parent: "pos-management",
      icon: "mdi:washing-machine",
    },
  },
  {
    name: "pos-display-preview",
    list: "/pos/display-preview",
    meta: {
      label: "Preview Display",
      parent: "pos-management",
      icon: "mdi:cellphone-screenshot",
    },
  },
  {
    name: "pos-employees",
    list: "/pos/employees",
    create: "/pos/employees/create",
    edit: "/pos/employees/edit/:id",
    show: "/pos/employees/show/:id",
    meta: {
      canDelete: true,
      label: "Kasir",
      parent: "pos-management",
      icon: "mdi:account-tie",
    },
  },
  {
    name: "pos-customers",
    list: "/pos/customers",
    show: "/pos/customers/show/:id",
    meta: {
      label: "Pelanggan",
      parent: "pos-management",
      icon: "mdi:account-multiple",
    },
  },
  {
    name: "pos-transactions-group",
    meta: {
      label: "Transaksi",
      parent: "pos-management",
      icon: "mdi:receipt",
    },
  },
  {
    name: "pos-transactions",
    list: "/pos/transactions",
    show: "/pos/transactions/show/:id",
    meta: {
      label: "Semua Transaksi",
      parent: "pos-transactions-group",
      icon: "mdi:receipt-text-outline",
    },
  },
  {
    name: "pos-cancelled-transactions",
    list: "/pos/cancelled-transactions",
    show: "/pos/transactions/show/:id",
    meta: {
      label: "Transaksi Dibatalkan",
      parent: "pos-transactions-group",
      icon: "mdi:receipt-text-remove-outline",
    },
  },

  // ── Hidden / standalone ────────────────────────────────────────────────────
  {
    name: "settings",
    list: "/settings",
    meta: {
      hide: true,
      label: "Settings",
      icon: "mdi:cog",
    },
  },
];
