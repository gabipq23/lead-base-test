import { LocalStorageKeys } from "@/enums/LocalStorageKeys.enum";
import type { IAuthPayload } from "@/types/IAuthPayload.type";
import type { UserRole } from "@/types/IUser.type";

export type PermissionResource =
  | "companies"
  | "partners"
  | "users"
  | "priorities"
  | "products"
  | "orders"
  | "chat"
  | "evolution"
  | "triggers"
  | "leads"
  | "mine-leads"
  | "reserved-leads"
  | "pj-checker"
  | "check-operadora"
  | "check-anatel"
  | "zap-checker"
  | "base2b-busca-socio"
  | "base2b-busca-empresa";

export type PermissionAction = "view" | "create" | "edit" | "delete";

type RestrictedRoute =
  | "/app/companies"
  | "/app/partners"
  | "/app/users"
  | "/app/priorities"
  | "/app/products"
  | "/app/order"
  | "/app/orders"
  | "/app/leads"
  | "/app/mine-leads"
  | "/app/reserved-leads"
  | "/app/chat"
  | "/app/evolution"
  | "/app/triggers"
  | "/app/pj-checker"
  | "/app/zap-checker"
  | "/app/base2b-busca-socio"
  | "/app/base2b-busca-empresa"
  | "/app/check-operadora"
  | "/app/check-anatel";

const allCrudActions: PermissionAction[] = ["view", "create", "edit", "delete"];

const permissionsByRole: Record<
  UserRole,
  Partial<Record<PermissionResource, PermissionAction[]>>
> = {
  ADMIN: {
    companies: allCrudActions,
    partners: allCrudActions,
    users: allCrudActions,
    products: allCrudActions,
    priorities: allCrudActions,
    orders: allCrudActions,
    chat: allCrudActions,
    evolution: allCrudActions,
    triggers: allCrudActions,
    "reserved-leads": allCrudActions,
    leads: allCrudActions,
    "mine-leads": allCrudActions,
    "pj-checker": allCrudActions,
    "check-operadora": allCrudActions,
    "check-anatel": allCrudActions,
    "zap-checker": allCrudActions,
    "base2b-busca-socio": allCrudActions,
    "base2b-busca-empresa": allCrudActions,
  },
  GESTOR: {
    users: allCrudActions,
    products: allCrudActions,
    orders: allCrudActions,
    chat: allCrudActions,
    evolution: allCrudActions,
    triggers: allCrudActions,
    "reserved-leads": allCrudActions,
    leads: allCrudActions,
    "mine-leads": allCrudActions,
    "pj-checker": allCrudActions,
    "check-operadora": allCrudActions,
    "check-anatel": allCrudActions,
    "zap-checker": allCrudActions,
    "base2b-busca-socio": allCrudActions,
    "base2b-busca-empresa": allCrudActions,
  },
  DIRETOR: {
    products: allCrudActions,
    orders: allCrudActions,
    chat: allCrudActions,
    evolution: allCrudActions,
    "reserved-leads": allCrudActions,
    leads: allCrudActions,
    "mine-leads": allCrudActions,
  },
  GERENTE: {
    products: allCrudActions,
    orders: ["view", "edit"],
    chat: allCrudActions,
    evolution: allCrudActions,
    "reserved-leads": allCrudActions,
    leads: allCrudActions,
    "mine-leads": allCrudActions,
  },
  LIDER: {
    products: ["view"],
    orders: ["view", "edit"],
    chat: allCrudActions,
    evolution: allCrudActions,
    "reserved-leads": allCrudActions,
    leads: allCrudActions,
    "mine-leads": allCrudActions,
  },
  CONSULTOR: {
    products: ["view"],
    orders: ["view", "edit"],
    chat: allCrudActions,
    evolution: allCrudActions,
    "reserved-leads": allCrudActions,
    leads: allCrudActions,
    "mine-leads": allCrudActions,
  },
};

const routeResourceMap: Record<RestrictedRoute, PermissionResource> = {
  "/app/companies": "companies",
  "/app/partners": "partners",
  "/app/users": "users",
  "/app/priorities": "priorities",
  "/app/products": "products",
  "/app/order": "orders",
  "/app/orders": "orders",
  "/app/leads": "leads",

  "/app/mine-leads": "mine-leads",
  "/app/reserved-leads": "reserved-leads",
  "/app/chat": "chat",
  "/app/evolution": "evolution",
  "/app/triggers": "triggers",
  "/app/pj-checker": "pj-checker",
  "/app/zap-checker": "zap-checker",
  "/app/base2b-busca-socio": "base2b-busca-socio",
  "/app/base2b-busca-empresa": "base2b-busca-empresa",
  "/app/check-operadora": "check-operadora",
  "/app/check-anatel": "check-anatel",
};

function resolveRestrictedRoute(path: string): RestrictedRoute | null {
  if ((path as RestrictedRoute) in routeResourceMap) {
    return path as RestrictedRoute;
  }

  if (path.startsWith("/app/order")) return "/app/order";
  if (path.startsWith("/app/leads")) return "/app/leads";
  if (path.startsWith("/app/mine")) return "/app/mine-leads";
  if (path.startsWith("/app/mine-leads")) return "/app/mine-leads";
  if (path.startsWith("/app/reserved-leads")) return "/app/reserved-leads";

  if (path.startsWith("/app/products")) return "/app/products";
  if (path.startsWith("/app/users")) return "/app/users";
  if (path.startsWith("/app/partners")) return "/app/partners";
  if (path.startsWith("/app/companies")) return "/app/companies";
  if (path.startsWith("/app/priorities")) return "/app/priorities";
  if (path.startsWith("/app/chat")) return "/app/chat";
  if (path.startsWith("/app/evolution")) return "/app/evolution";
  if (path.startsWith("/app/triggers")) return "/app/triggers";

  if (path.startsWith("/app/pj-checker")) return "/app/pj-checker";
  if (path.startsWith("/app/zap-checker")) return "/app/zap-checker";
  if (path.startsWith("/app/base2b-busca-socio"))
    return "/app/base2b-busca-socio";
  if (path.startsWith("/app/base2b-busca-empresa"))
    return "/app/base2b-busca-empresa";
  if (path.startsWith("/app/check-operadora")) return "/app/check-operadora";
  if (path.startsWith("/app/check-anatel")) return "/app/check-anatel";

  return null;
}

export function getStoredUserRole(): UserRole | null {
  try {
    const storedUser = localStorage.getItem(LocalStorageKeys.user);
    if (!storedUser) return null;

    const payload = JSON.parse(storedUser) as IAuthPayload;
    return payload?.user?.role ?? null;
  } catch {
    return null;
  }
}

export function can(
  role: UserRole | null | undefined,
  resource: PermissionResource,
  action: PermissionAction,
): boolean {
  if (!role) return false;

  const allowedActions = permissionsByRole[role][resource] ?? [];
  return allowedActions.includes(action);
}

export function canAccessRoute(
  role: UserRole | null | undefined,
  path?: string,
): boolean {
  if (!path) return true;

  const restrictedRoute = resolveRestrictedRoute(path);
  if (!restrictedRoute) return true;

  const resource = routeResourceMap[restrictedRoute];
  if (!resource) return true;

  return can(role, resource, "view");
}

export function isGlobalAdminUser(
  userPayload: IAuthPayload | null | undefined,
) {
  return userPayload?.user?.role === "ADMIN";
}

// Empresas
// view/create/edit/delete: só Admin.
// Parceiros
// view/create/edit/delete: só Admin.
// Usuários
// view/create/edit/delete: Admin e Gestor.
// Pedidos
// view: todos (com filtro por hierarquia).
// edit: todos.
// delete: Admin, Gestor e Diretor.
// Produtos
// view: todos.
// create/edit/delete: Gerente ou acima.
// Clientes
// view/create/edit: todos.
// delete: Gerente ou acima.
// Mensagens
// view: todos.
// delete: Gerente ou acima.
// Tools
// uso: todos.
// Book de ofertas
// pendente de detalhamento.
// BackOffice
// pendente de detalhamento.
