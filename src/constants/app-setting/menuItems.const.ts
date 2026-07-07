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
      // {
      //   label: "Conectar conta",
      //   to: "/app/evolution",
      // },
      // {
      //   label: "Triggers",
      //   to: "/app/triggers",
      // },
    ],
  },

  {
    label: "Tools",
    items: [
      {
        label: "Check Operadora",
        to: "/app/check-operadora",
      },
      {
        label: "Check Anatel",
        to: "/app/check-anatel",
      },
      {
        label: "PJ Checker",
        to: "/app/pj-checker",
      },
      {
        label: "Zap Checker",
        to: "/app/zap-checker",
      },
      {
        label: "Base2B / Busca-Sócio",
        to: "/app/base2b-busca-socio",
      },
      {
        label: "Base2B / Busca-Empresa",
        to: "/app/base2b-busca-empresa",
      },
    ],
  },

  {
    label: "Dashboard",
    to: "/app/dashboard",
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

  {
    label: "Painel de Leads",
    to: "/app/leads",
  },
  {
    label: "Leads Reservados",
    to: "/app/reserved-leads",
  },
  ...menuOptionsCommon,
];

// telas do menu específicas para cada empresa
export const menuOptionsTim: MenuItem[] = [
  {
    label: "Painel de Leads",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
  ...menuOptionsCommon,
];

export const menuOptionsClaro: MenuItem[] = [
  {
    label: "Painel de Leads",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
  ...menuOptionsCommon,
];

export const menuOptionsVivo: MenuItem[] = [
  {
    label: "Painel de Leads",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
  ...menuOptionsCommon,
];

export const menuOptionsVR: MenuItem[] = [...menuOptionsCommon];

export const menuOptionsC6: MenuItem[] = [...menuOptionsCommon];

export const menuOptionsBrisanet: MenuItem[] = [
  {
    label: "Painel de Leads",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
  ...menuOptionsCommon,
];
export const menuOptionsAlgar: MenuItem[] = [
  {
    label: "Painel de Leads",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
  ...menuOptionsCommon,
];
export const menuOptionsVero: MenuItem[] = [
  {
    label: "Painel de Leads",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
  ...menuOptionsCommon,
];

export const menuOptionsNio: MenuItem[] = [
  {
    label: "Painel de Leads",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
  ...menuOptionsCommon,
];
export const menuOptionsDesktop: MenuItem[] = [
  {
    label: "Painel de Leads",
    to: "/app/leads",
  },
  {
    label: "Meus Leads",
    to: "/app/mine-leads",
  },
  ...menuOptionsCommon,
];
