interface MenuItem {
  label: string;
  to?: string;
  items?: MenuItem[];
  href?: string;
}

// telas do menu comum a todas as empresas
export const menuOptionsCommon: MenuItem[] = [
  {
    label: "Chatter",
    items: [
      {
        label: "Chat",
        to: "/app/chat",
      },
      {
        label: "Conectar conta",
        to: "/app/evolution",
      },
      {
        label: "Triggers",
        to: "/app/triggers",
      },
    ],
  },
];

export const menuOptionsAdmin: MenuItem[] = [
  {
    label: "Gestão",
    items: [
      {
        label: "Usuários",
        to: "/app/users",
      },
      {
        label: "Parceiros",
        to: "/app/partners",
      },
      {
        label: "Empresas",
        to: "/app/companies",
      },
    ],
  },
  ...menuOptionsCommon,

  {
    label: "Leads ao vivo",
    to: "/app/leads",
  },
  {
    label: "Leads Reservados",
    to: "/app/reserved-leads",
  },
];

// telas do menu específicas para cada empresa
export const menuOptionsTim: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Leads ao vivo",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
];

export const menuOptionsClaro: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Leads ao vivo",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
];

export const menuOptionsVivo: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Leads ao vivo",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
];

export const menuOptionsVR: MenuItem[] = [...menuOptionsCommon];

export const menuOptionsC6: MenuItem[] = [...menuOptionsCommon];

export const menuOptionsBrisanet: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Leads ao vivo",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
];
export const menuOptionsAlgar: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Leads ao vivo",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
];
export const menuOptionsVero: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Leads ao vivo",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
];

export const menuOptionsNio: MenuItem[] = [
  ...menuOptionsCommon,
  {
    label: "Leads ao vivo",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
];
export const menuOptionsDesktop: MenuItem[] = [
  ...menuOptionsCommon,

  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
  {
    label: "LPs",
    items: [
      {
        label: "Banda Larga PF",
        href: "https://desktop.promo/",
      },
    ],
  },
];
