import { CompaniesService } from "@/services/companies.service";
import { CreditRequestsService } from "@/services/credit.service";
import { LeadTablePricesService } from "@/services/leads-table-price.service";
import { OrdersService } from "@/services/orders.service";
import { PartnersService } from "@/services/partners.service";
import { StatementService } from "@/services/statement.service";
import { TriggersService } from "@/services/triggers.service";
import { UsersService } from "@/services/users.service";

export const dictionaryQueryClient = {
  users: {
    name: "Usuário",
    plural: "Usuários",
    key: "users",
    service: UsersService,
  },
  partners: {
    name: "Parceiro",
    plural: "Parceiros",
    key: "partners",
    service: PartnersService,
  },
  companies: {
    name: "Empresa",
    plural: "Empresas",
    key: "companies",
    service: CompaniesService,
  },
  orders: {
    name: "Pedido",
    plural: "Pedidos",
    key: "orders",
    service: OrdersService,
  },
  triggers: {
    name: "Trigger",
    plural: "Triggers",
    key: "triggers",
    service: TriggersService,
  },
  "leads-table-price": {
    name: "Tabela de Preço",
    plural: "Tabelas de Preço",
    key: "leadTablePrices",
    service: LeadTablePricesService,
  },
  "credit-requests": {
    name: "Solicitação de Crédito",
    plural: "Solicitações de Crédito",
    key: "creditRequests",
    service: CreditRequestsService,
  },
  statements: {
    name: "Extrato",
    plural: "Extratos",
    key: "statements",
    service: StatementService,
  },
};
