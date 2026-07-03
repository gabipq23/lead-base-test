import { Button, Card, Col, DatePicker, Row, Select, Space, Statistic, Table, Typography, type TableColumnsType } from "antd";
import { ArrowUpOutlined, ClockCircleOutlined, CloseCircleOutlined, DollarOutlined, StopOutlined } from "@ant-design/icons";
import { Bar, Column, Funnel, Pie } from "@ant-design/plots";
import type { JSX } from "react";
import { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

type LeadStatus =
    | "ABERTO"
    | "EM_ATENDIMENTO"
    | "EM_TRAMITACAO"
    | "AGUARDANDO_OPERADORA"
    | "FECHADO"
    | "CANCELADO"
    | "VETADO_CREDITO"
    | "INADIMPLENTE";

type PeriodPreset = "today" | "7d" | "30d" | "custom";

type Lead = {
    id: string;
    client_name: string;
    package_name: string;
    operator: string;
    status: LeadStatus;
    value: number;
    responsible: string;
    created_at: string; // ISO date
    cancel_reason?: string;
};

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
    ABERTO: { label: "Leads novos", color: "blue" },
    EM_ATENDIMENTO: { label: "Em atendimento", color: "cyan" },
    EM_TRAMITACAO: { label: "Em tramitação", color: "orange" },
    AGUARDANDO_OPERADORA: { label: "Aguardando operadora", color: "geekblue" },
    FECHADO: { label: "Fechado", color: "green" },
    CANCELADO: { label: "Cancelado", color: "red" },
    VETADO_CREDITO: { label: "Vetado crédito", color: "purple" },
    INADIMPLENTE: { label: "Inadimplente", color: "volcano" },
};

const OPERATORS = ["Vivo", "Claro", "Tim", "Oi"];
const PACKAGES = ["Fibra 300MB", "Fibra 500MB", "Combo Fibra + Móvel", "Móvel Controle", "Móvel Pós"];
const RESPONSIBLES = ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Rocha"];
const CLIENTS = [
    "Marcos Andrade",
    "Fernanda Melo",
    "Rafael Costa",
    "Juliana Prado",
    "Tiago Nunes",
    "Patrícia Alves",
    "Eduardo Reis",
    "Camila Ferreira",
    "Lucas Martins",
    "Bianca Teixeira",
];
const CANCEL_REASONS = ["Preço", "Cobertura", "Tempo de resposta", "Documentação", "Desistência", "Crédito"];

function randomOf<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
}

function generateMockLeads(days: number): Lead[] {
    const leads: Lead[] = [];
    const statusWeights: [LeadStatus, number][] = [
        ["FECHADO", 4],
        ["EM_TRAMITACAO", 3],
        ["AGUARDANDO_OPERADORA", 2],
        ["EM_ATENDIMENTO", 2],
        ["ABERTO", 2],
        ["CANCELADO", 2],
        ["VETADO_CREDITO", 1],
        ["INADIMPLENTE", 1],
    ];
    const weightedStatuses = statusWeights.flatMap(([status, weight]) =>
        Array<LeadStatus>(weight).fill(status),
    );

    for (let i = 0; i < days; i++) {
        const date = dayjs().subtract(i, "day");
        const leadsToday = 3 + Math.floor(Math.random() * 6);

        for (let j = 0; j < leadsToday; j++) {
            leads.push({
                id: `LD-${date.format("YYYYMMDD")}-${j}`,
                client_name: randomOf(CLIENTS),
                package_name: randomOf(PACKAGES),
                operator: randomOf(OPERATORS),
                status: randomOf(weightedStatuses),
                value: Math.round((80 + Math.random() * 320) * 100) / 100,
                responsible: randomOf(RESPONSIBLES),
                created_at: date.toISOString(),
                cancel_reason: undefined,
            });

            const lastLead = leads[leads.length - 1];
            if (["CANCELADO", "VETADO_CREDITO", "INADIMPLENTE"].includes(lastLead.status)) {
                lastLead.cancel_reason = randomOf(CANCEL_REASONS);
            }
        }
    }

    return leads;
}

const MOCK_LEADS = generateMockLeads(90);

function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

function formatPercent(value: number) {
    return `${value.toFixed(1)}%`;
}

function getRangeFromPreset(preset: Exclude<PeriodPreset, "custom">): [Dayjs, Dayjs] {
    if (preset === "today") {
        return [dayjs().startOf("day"), dayjs().endOf("day")];
    }

    if (preset === "7d") {
        return [dayjs().subtract(6, "day"), dayjs()];
    }

    return [dayjs().subtract(29, "day"), dayjs()];
}

function isSameRange(a: [Dayjs, Dayjs], b: [Dayjs, Dayjs]) {
    return a[0].isSame(b[0], "day") && a[1].isSame(b[1], "day");
}

export function CrmDashboardPage(): JSX.Element {
    const [range, setRange] = useState<[Dayjs, Dayjs]>(getRangeFromPreset("30d"));
    const [periodPreset, setPeriodPreset] = useState<PeriodPreset>("30d");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [responsibleFilter, setResponsibleFilter] = useState<string>("all");
    const [packageFilter, setPackageFilter] = useState<string>("all");

    const filteredLeads = useMemo(() => {
        return MOCK_LEADS.filter((lead) => {
            const date = dayjs(lead.created_at);
            const inRange =
                (date.isAfter(range[0], "day") || date.isSame(range[0], "day")) &&
                (date.isBefore(range[1], "day") || date.isSame(range[1], "day"));

            const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
            const matchesResponsible = responsibleFilter === "all" || lead.responsible === responsibleFilter;
            const matchesPackage = packageFilter === "all" || lead.package_name === packageFilter;

            return inRange && matchesStatus && matchesResponsible && matchesPackage;
        });
    }, [packageFilter, range, responsibleFilter, statusFilter]);

    // ---- KPIs ----
    const kpis = useMemo(() => {
        const total = filteredLeads.length;
        const countBy = (status: LeadStatus) =>
            filteredLeads.filter((l) => l.status === status).length;

        const leadsNovos = countBy("ABERTO");
        const emAtendimento = countBy("EM_ATENDIMENTO");
        const fechados = countBy("FECHADO");
        const cancelados = countBy("CANCELADO");
        const emTramitacao = countBy("EM_TRAMITACAO");
        const aguardandoOperadora = countBy("AGUARDANDO_OPERADORA");
        const vetados = countBy("VETADO_CREDITO");
        const inadimplentes = countBy("INADIMPLENTE");

        const valorFechado = filteredLeads
            .filter((l) => l.status === "FECHADO")
            .reduce((acc, l) => acc + l.value, 0);
        const ticketMedio = fechados > 0 ? valorFechado / fechados : 0;
        const taxaConversao = total > 0 ? (fechados / total) * 100 : 0;

        return {
            total,
            leadsNovos,
            emAtendimento,
            emTramitacao,
            aguardandoOperadora,
            fechados,
            cancelados,
            vetados,
            inadimplentes,
            valorFechado,
            ticketMedio,
            taxaConversao,
        };
    }, [filteredLeads]);

    const dailyVolumeData = useMemo(() => {
        const days = range[1].diff(range[0], "day") + 1;
        const buckets: { date: string; categoria: string; quantidade: number }[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const day = range[1].subtract(i, "day");
            const dayLeads = filteredLeads.filter((l) => dayjs(l.created_at).isSame(day, "day"));

            buckets.push(
                {
                    date: day.format("DD/MM"),
                    categoria: "Fechados",
                    quantidade: dayLeads.filter((l) => l.status === "FECHADO").length,
                },
                {
                    date: day.format("DD/MM"),
                    categoria: "Em tramitação",
                    quantidade: dayLeads.filter((l) => l.status === "EM_TRAMITACAO").length,
                },
                {
                    date: day.format("DD/MM"),
                    categoria: "Cancelados",
                    quantidade: dayLeads.filter((l) => l.status === "CANCELADO").length,
                },
            );
        }

        return buckets;
    }, [filteredLeads, range]);

    const statusBreakdown = useMemo(() => {
        const order: LeadStatus[] = [
            "FECHADO",
            "EM_TRAMITACAO",
            "AGUARDANDO_OPERADORA",
            "EM_ATENDIMENTO",
            "ABERTO",
            "CANCELADO",
            "VETADO_CREDITO",
            "INADIMPLENTE",
        ];

        return order
            .map((status) => ({
                status,
                label: STATUS_CONFIG[status].label,
                value: filteredLeads.filter((lead) => lead.status === status).length,
                color: STATUS_CONFIG[status].color,
            }))
            .filter((item) => item.value > 0);
    }, [filteredLeads]);

    const packageDistribution = useMemo(() => {
        const closedLeads = filteredLeads.filter((l) => l.status === "FECHADO");
        const map = new Map<string, number>();

        closedLeads.forEach((l) => {
            map.set(l.package_name, (map.get(l.package_name) ?? 0) + 1);
        });

        return Array.from(map.entries())
            .map(([packageName, value]) => ({ packageName, value }))
            .sort((a, b) => b.value - a.value);
    }, [filteredLeads]);

    const funnelData = useMemo(() => {
        const total = Math.max(filteredLeads.length, 1);
        const closed = Math.max(kpis.fechados, 1);

        const values = [
            { stage: "Leads", value: total },
            { stage: "Contatos", value: Math.max(Math.round(total * 0.8), closed + 20) },
            { stage: "Propostas", value: Math.max(Math.round(total * 0.58), closed + 12) },
            { stage: "Tramitação", value: Math.max(Math.round(total * 0.4), closed + 6) },
            { stage: "Operadora", value: Math.max(Math.round(total * 0.26), closed + 2) },
            { stage: "Fechados", value: closed },
        ];

        for (let i = 1; i < values.length; i += 1) {
            if (values[i].value >= values[i - 1].value) {
                values[i].value = Math.max(values[i - 1].value - 1, 1);
            }
        }

        return values;
    }, [filteredLeads, kpis.fechados]);

    const cancellationReasons = useMemo(() => {
        const rows = filteredLeads.filter((lead) => ["CANCELADO", "VETADO_CREDITO", "INADIMPLENTE"].includes(lead.status));
        const map = new Map<string, number>();

        rows.forEach((lead) => {
            const reason = lead.cancel_reason ?? "Não informado";
            map.set(reason, (map.get(reason) ?? 0) + 1);
        });

        return Array.from(map.entries())
            .map(([reason, value]) => ({ reason, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
    }, [filteredLeads]);

    const responsibleRanking = useMemo(() => {
        return RESPONSIBLES.map((responsible) => {
            const leads = filteredLeads.filter((lead) => lead.responsible === responsible);
            const fechados = leads.filter((lead) => lead.status === "FECHADO");
            const cancelados = leads.filter((lead) => ["CANCELADO", "VETADO_CREDITO", "INADIMPLENTE"].includes(lead.status));
            const revenue = fechados.reduce((acc, lead) => acc + lead.value, 0);
            return {
                responsible,
                total: leads.length,
                fechados: fechados.length,
                emTramitacao: leads.filter((lead) => lead.status === "EM_TRAMITACAO").length,
                cancelados: cancelados.length,
                revenue,
                conversao: leads.length > 0 ? (fechados.length / leads.length) * 100 : 0,
            };
        }).sort((a, b) => b.fechados - a.fechados);
    }, [filteredLeads]);

    const tableColumns: TableColumnsType<(typeof responsibleRanking)[number]> = [
        {
            title: "Funcionário",
            dataIndex: "responsible",
            key: "responsible",
        },
        {
            title: "Fechados",
            dataIndex: "fechados",
            key: "fechados",
            width: 100,
        },
        {
            title: "Tramitação",
            dataIndex: "emTramitacao",
            key: "emTramitacao",
            width: 110,
        },
        {
            title: "Cancelados",
            dataIndex: "cancelados",
            key: "cancelados",
            width: 110,
        },
        {
            title: "Conversão",
            dataIndex: "conversao",
            key: "conversao",
            width: 110,
            render: (value: number) => formatPercent(value),
        },
        {
            title: "Receita",
            dataIndex: "revenue",
            key: "revenue",
            width: 130,
            render: (value: number) => formatCurrency(value),
        },
    ];

    const filteredPeriodLabel = isSameRange(range, getRangeFromPreset("today"))
        ? "Hoje"
        : isSameRange(range, getRangeFromPreset("7d"))
            ? "7 dias"
            : isSameRange(range, getRangeFromPreset("30d"))
                ? "30 dias"
                : "Personalizado";

    const kpiCards = [
        { title: "Total de Leads", value: kpis.total, prefix: <ClockCircleOutlined style={{ color: "#1677ff" }} /> },
        { title: "Leads Novos", value: kpis.leadsNovos, prefix: <ClockCircleOutlined style={{ color: "#1677ff" }} /> },
        { title: "Em Atendimento", value: kpis.emAtendimento, prefix: <ArrowUpOutlined style={{ color: "#13c2c2" }} /> },
        { title: "Em Tramitação", value: kpis.emTramitacao, prefix: <ClockCircleOutlined style={{ color: "#fa8c16" }} /> },
        { title: "Aguardando Operadora", value: kpis.aguardandoOperadora, prefix: <ArrowUpOutlined style={{ color: "#2f54eb" }} /> },
        { title: "Fechados", value: kpis.fechados, prefix: <ArrowUpOutlined style={{ color: "#389e0d" }} /> },
        { title: "Cancelados", value: kpis.cancelados, prefix: <CloseCircleOutlined style={{ color: "#cf1322" }} /> },
        { title: "Vetados Crédito", value: kpis.vetados, prefix: <StopOutlined style={{ color: "#722ed1" }} /> },
        // { title: "Inadimplentes", value: kpis.inadimplentes, prefix: <StopOutlined style={{ color: "#d46b08" }} /> },
        // { title: "Receita", value: kpis.valorFechado, prefix: <DollarOutlined style={{ color: "#1677ff" }} />, isMoney: true },
        // { title: "Ticket Médio", value: kpis.ticketMedio, prefix: <DollarOutlined style={{ color: "#722ed1" }} />, isMoney: true },
        { title: "Taxa Conversão", value: kpis.taxaConversao, prefix: <ArrowUpOutlined style={{ color: "#52c41a" }} />, isPercent: true },
    ];

    return (
        <div className="flex flex-col gap-5 my-4">
            <Typography.Title level={3} >
                Dashboard CRM
            </Typography.Title>
            <div className="rounded-2xl border flex  justify-between border-slate-200 bg-linear-to-r from-slate-50 via-white to-slate-50 p-4 shadow-sm">
                <div className=" flex flex-col gap-3">
                    <Select
                        className="min-w-45 self-start"
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { value: "all", label: "Status: todos" },
                            ...Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({ value, label: cfg.label })),
                        ]}
                    />
                    <div></div>
                    {/* <Select
                        className="min-w-45"
                        value={responsibleFilter}
                        onChange={setResponsibleFilter}
                        options={[
                            { value: "all", label: "Operador: todos" },
                            ...RESPONSIBLES.map((name) => ({ value: name, label: name })),
                        ]}
                    /> */}
                    {/* <Select
                        className="min-w-50"
                        value={packageFilter}
                        onChange={setPackageFilter}
                        options={[
                            { value: "all", label: "Pacote: todos" },
                            ...PACKAGES.map((name) => ({ value: name, label: name })),
                        ]}
                    /> */}

                </div>
                <div className="flex flex-col gap-4">

                    <div>
                        <Space wrap size={12}>
                            <Button
                                type={periodPreset === "today" ? "primary" : "default"}
                                onClick={() => {
                                    setPeriodPreset("today");
                                    setRange(getRangeFromPreset("today"));
                                }}
                            >
                                Hoje
                            </Button>
                            <Button
                                type={periodPreset === "7d" ? "primary" : "default"}
                                onClick={() => {
                                    setPeriodPreset("7d");
                                    setRange(getRangeFromPreset("7d"));
                                }}
                            >
                                7 dias
                            </Button>
                            <Button
                                type={periodPreset === "30d" ? "primary" : "default"}
                                onClick={() => {
                                    setPeriodPreset("30d");
                                    setRange(getRangeFromPreset("30d"));
                                }}
                            >
                                30 dias
                            </Button>
                            <Button type={periodPreset === "custom" ? "primary" : "default"} onClick={() => setPeriodPreset("custom")}>
                                Personalizado
                            </Button>
                            <RangePicker
                                value={range}
                                format="DD/MM/YYYY"
                                allowClear={false}
                                onChange={(values) => {
                                    if (values && values[0] && values[1]) {
                                        setRange([values[0], values[1]]);
                                        setPeriodPreset("custom");
                                    }
                                }}
                            />
                        </Space>
                    </div>

                    <div className="ml-auto flex items-center text-sm text-slate-500">
                        Período atual: <span className="ml-1 font-medium text-slate-700">{filteredPeriodLabel}</span>
                    </div>
                </div>


            </div>

            <Row gutter={[16, 16]}>
                {kpiCards.map((card) => (
                    <Col key={card.title} xs={24} sm={12} md={8} xl={4}>
                        <Card className="shadow-sm">
                            <Statistic
                                title={card.title}
                                value={card.value}
                                prefix={card.prefix}
                                valueStyle={card.isMoney ? { color: "#1d39c4" } : card.isPercent ? { color: "#389e0d" } : undefined}
                                formatter={(value) => {
                                    const numericValue = Number(value);
                                    if (card.isMoney) return formatCurrency(numericValue);
                                    if (card.isPercent) return formatPercent(numericValue);
                                    return numericValue.toLocaleString("pt-BR");
                                }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row >

                <Col xl={24}>
                    <Card title="Pedidos por dia" className="shadow-sm">
                        <Column
                            data={dailyVolumeData}
                            xField="date"
                            yField="quantidade"
                            seriesField="categoria"
                            isGroup
                            height={340}
                            autoFit
                            color={["#389e0d", "#fa8c16", "#cf1322"]}
                            legend={{ position: "top" }}
                        />
                    </Card>
                </Col>
                {/* <Col xs={24} xl={8}>
                    <Card title="Pedidos por status" className="shadow-sm">
                        {statusBreakdown.length > 0 ? (
                            <Pie
                                data={statusBreakdown}
                                angleField="value"
                                colorField="label"
                                radius={0.9}
                                innerRadius={0.62}
                                height={340}
                                autoFit
                                label={{ type: "spider", content: "{name}: {value}" }}
                                legend={{ position: "bottom" }}
                            />
                        ) : (
                            <div className="flex h-85 items-center justify-center text-slate-400">
                                Sem dados para o período selecionado
                            </div>
                        )}
                    </Card>
                </Col> */}
            </Row>

            <Row gutter={[16, 16]}>
                {/* <Col xs={24} xl={12}>
                    <Card title="Funil CRM" className="shadow-sm">
                        <Funnel
                            data={funnelData}
                            xField="stage"
                            yField="value"
                            height={320}
                            autoFit
                            color={["#1677ff"]}
                            label={{
                                formatter: (datum: { stage: string; value: number }) => `${datum.stage}: ${datum.value}`,
                            }}
                        />
                    </Card>
                </Col> */}
                <Col xs={24} xl={12}>
                    <Card title="Pacotes vendidos" className="shadow-sm">
                        {packageDistribution.length > 0 ? (
                            <Bar
                                data={packageDistribution}
                                xField="value"
                                yField="packageName"
                                height={320}
                                autoFit
                                color="#1677ff"
                                legend={false}
                            />
                        ) : (
                            <div className="flex h-80 items-center justify-center text-slate-400">
                                Sem vendas fechadas no período
                            </div>
                        )}
                    </Card>
                </Col>
                <Col xs={24} xl={12}>
                    <Card title="Motivos de cancelamento" className="shadow-sm">
                        {cancellationReasons.length > 0 ? (
                            <Bar
                                data={cancellationReasons}
                                xField="value"
                                yField="reason"
                                height={320}
                                autoFit
                                color="#cf1322"
                                legend={false}
                            />
                        ) : (
                            <div className="flex h-80 items-center justify-center text-slate-400">
                                Sem cancelamentos no período
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>


        </div>
    );
}