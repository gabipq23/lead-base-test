import {
    Card,
    Col,
    DatePicker,
    Row,
    Select,
    Space,
    Statistic,
    Table,
    Tag,
    Typography,
    type TableColumnsType,
} from "antd";
import {

    ArrowUpOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DollarOutlined,
    StopOutlined,
} from "@ant-design/icons";
import { Column, Pie } from "@ant-design/plots";
import type { JSX } from "react";
import { useMemo, useState } from "react";
import dayjs, { type Dayjs } from "dayjs";

const { RangePicker } = DatePicker;

/**
 * ------------------------------------------------------------------
 * Tipos
 * ------------------------------------------------------------------
 * Ajuste esses tipos/campos para bater com o retorno real da sua API.
 * Deixei tudo explícito de propósito, pra facilitar a troca do mock
 * pelos hooks reais (ex: useLeadsQuery, useLeadsStatsQuery etc).
 */
type LeadStatus =
    | "ABERTO"
    | "EM_TRAMITACAO"
    | "AGUARDANDO_OPERADORA"
    | "FECHADO"
    | "CANCELADO"
    | "VETADO_CREDITO";

type Lead = {
    id: string;
    client_name: string;
    package_name: string;
    operator: string;
    status: LeadStatus;
    value: number;
    responsible: string;
    created_at: string; // ISO date
};

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string }> = {
    ABERTO: { label: "Aberto", color: "blue" },
    EM_TRAMITACAO: { label: "Em tramitação", color: "gold" },
    AGUARDANDO_OPERADORA: { label: "Aguardando operadora", color: "purple" },
    FECHADO: { label: "Fechado", color: "green" },
    CANCELADO: { label: "Cancelado", color: "red" },
    VETADO_CREDITO: { label: "Vetado por crédito", color: "volcano" },
};

/**
 * ------------------------------------------------------------------
 * Mock de dados (trocar pelos hooks reais depois)
 * ------------------------------------------------------------------
 */
const OPERATORS = ["Vivo", "Claro", "Tim", "Oi"];
const PACKAGES = ["Fibra 300MB", "Fibra 500MB", "Combo Fibra + Móvel", "Móvel Controle", "Móvel Pós"];
const RESPONSIBLES = ["Ana Souza", "Bruno Lima", "Carla Dias", "Diego Rocha"];
const CLIENTS = [
    "Marcos Andrade", "Fernanda Melo", "Rafael Costa", "Juliana Prado", "Tiago Nunes",
    "Patrícia Alves", "Eduardo Reis", "Camila Ferreira", "Lucas Martins", "Bianca Teixeira",
];

function randomOf<T>(list: T[]): T {
    return list[Math.floor(Math.random() * list.length)];
}

function generateMockLeads(days: number): Lead[] {
    const leads: Lead[] = [];
    const statusWeights: [LeadStatus, number][] = [
        ["FECHADO", 4],
        ["EM_TRAMITACAO", 3],
        ["AGUARDANDO_OPERADORA", 2],
        ["ABERTO", 2],
        ["CANCELADO", 2],
        ["VETADO_CREDITO", 1],
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
            });
        }
    }

    return leads;
}

const MOCK_LEADS = generateMockLeads(90);

/**
 * ------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------
 */
function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value);
}

export function CrmDashboardPage(): JSX.Element {
    const [range, setRange] = useState<[Dayjs, Dayjs]>([dayjs().subtract(29, "day"), dayjs()]);
    const [operatorFilter, setOperatorFilter] = useState<string>("all");

    const filteredLeads = useMemo(() => {
        return MOCK_LEADS.filter((lead) => {
            const date = dayjs(lead.created_at);
            const inRange =
                (date.isAfter(range[0], "day") || date.isSame(range[0], "day")) &&
                (date.isBefore(range[1], "day") || date.isSame(range[1], "day"));

            const matchesOperator = operatorFilter === "all" || lead.operator === operatorFilter;

            return inRange && matchesOperator;
        });
    }, [range, operatorFilter]);

    // ---- KPIs ----
    const kpis = useMemo(() => {
        const total = filteredLeads.length;
        const countBy = (status: LeadStatus) =>
            filteredLeads.filter((l) => l.status === status).length;

        const fechados = countBy("FECHADO");
        const cancelados = countBy("CANCELADO");
        const emTramitacao = countBy("EM_TRAMITACAO") + countBy("AGUARDANDO_OPERADORA");
        const vetados = countBy("VETADO_CREDITO");

        const valorFechado = filteredLeads
            .filter((l) => l.status === "FECHADO")
            .reduce((acc, l) => acc + l.value, 0);

        return { total, fechados, cancelados, emTramitacao, vetados, valorFechado };
    }, [filteredLeads]);

    // ---- Gráfico de evolução diária (fechados x cancelados x em tramitação) ----
    const evolutionData = useMemo(() => {
        const days = range[1].diff(range[0], "day") + 1;
        const buckets: { date: string; categoria: string; quantidade: number }[] = [];

        for (let i = days - 1; i >= 0; i--) {
            const day = range[1].subtract(i, "day");
            const dayLeads = filteredLeads.filter((l) => dayjs(l.created_at).isSame(day, "day"));

            buckets.push(
                { date: day.format("DD/MM"), categoria: "Fechados", quantidade: dayLeads.filter((l) => l.status === "FECHADO").length },
                { date: day.format("DD/MM"), categoria: "Cancelados", quantidade: dayLeads.filter((l) => l.status === "CANCELADO").length },
                { date: day.format("DD/MM"), categoria: "Em tramitação", quantidade: dayLeads.filter((l) => l.status === "EM_TRAMITACAO" || l.status === "AGUARDANDO_OPERADORA").length },
            );
        }

        return buckets;
    }, [filteredLeads, range]);

    // ---- Distribuição por pacote vendido (donut) ----
    const packageDistribution = useMemo(() => {
        const closedLeads = filteredLeads.filter((l) => l.status === "FECHADO");
        const map = new Map<string, number>();

        closedLeads.forEach((l) => {
            map.set(l.package_name, (map.get(l.package_name) ?? 0) + 1);
        });

        return Array.from(map.entries()).map(([type, value]) => ({ type, value }));
    }, [filteredLeads]);

    // ---- Tabela ----
    const columns: TableColumnsType<Lead> = [
        { title: "Cliente", dataIndex: "client_name", key: "client_name" },
        { title: "Pacote", dataIndex: "package_name", key: "package_name" },
        { title: "Operadora", dataIndex: "operator", key: "operator", width: 110 },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 190,
            filters: Object.entries(STATUS_CONFIG).map(([value, cfg]) => ({ text: cfg.label, value })),
            onFilter: (value, record) => record.status === value,
            render: (status: LeadStatus) => (
                <Tag color={STATUS_CONFIG[status].color}>{STATUS_CONFIG[status].label}</Tag>
            ),
        },
        {
            title: "Valor",
            dataIndex: "value",
            key: "value",
            width: 130,
            sorter: (a, b) => a.value - b.value,
            render: (value: number) => formatCurrency(value),
        },
        { title: "Responsável", dataIndex: "responsible", key: "responsible", width: 150 },
        {
            title: "Data",
            dataIndex: "created_at",
            key: "created_at",
            width: 120,
            sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
            render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* HEADER */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Typography.Title level={3} style={{ marginBottom: 0 }}>
                    Visão geral do CRM
                </Typography.Title>

                <Space wrap>
                    <Select
                        value={operatorFilter}
                        onChange={setOperatorFilter}
                        style={{ width: 160 }}
                        options={[
                            { label: "Todas operadoras", value: "all" },
                            ...OPERATORS.map((op) => ({ label: op, value: op })),
                        ]}
                    />
                    <RangePicker
                        value={range}
                        format="DD/MM/YYYY"
                        allowClear={false}
                        onChange={(values) => {
                            if (values && values[0] && values[1]) {
                                setRange([values[0], values[1]]);
                            }
                        }}
                        presets={[
                            { label: "Últimos 7 dias", value: [dayjs().subtract(6, "day"), dayjs()] },
                            { label: "Últimos 30 dias", value: [dayjs().subtract(29, "day"), dayjs()] },
                            { label: "Últimos 90 dias", value: [dayjs().subtract(89, "day"), dayjs()] },
                        ]}
                    />
                </Space>
            </div>

            {/* KPI CARDS */}
            <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} lg={5}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Em tramitação"
                            value={kpis.emTramitacao}
                            prefix={<ClockCircleOutlined style={{ color: "#d4a017" }} />}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={5}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Fechados"
                            value={kpis.fechados}
                            prefix={<ArrowUpOutlined style={{ color: "#389e0d" }} />}
                            valueStyle={{ color: "#389e0d" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={5}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Cancelados"
                            value={kpis.cancelados}
                            prefix={<CloseCircleOutlined style={{ color: "#cf1322" }} />}
                            valueStyle={{ color: "#cf1322" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={5}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Vetados (crédito)"
                            value={kpis.vetados}
                            prefix={<StopOutlined style={{ color: "#ad4e00" }} />}
                            valueStyle={{ color: "#ad4e00" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} lg={4}>
                    <Card className="shadow-sm">
                        <Statistic
                            title="Valor fechado"
                            value={kpis.valorFechado}
                            precision={2}
                            prefix={<DollarOutlined style={{ color: "#1677ff" }} />}
                            formatter={(value) => formatCurrency(Number(value))}
                        />
                    </Card>
                </Col>
            </Row>

            {/* GRÁFICOS */}
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={16}>
                    <Card title="Evolução diária" className="shadow-sm">
                        <Column
                            data={evolutionData}
                            xField="date"
                            yField="quantidade"
                            seriesField="categoria"
                            isGroup
                            height={300}
                            color={["#389e0d", "#cf1322", "#d4a017"]}
                            legend={{ position: "top" }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card title="Pacotes mais vendidos (fechados)" className="shadow-sm">
                        {packageDistribution.length > 0 ? (
                            <Pie
                                data={packageDistribution}
                                angleField="value"
                                colorField="type"
                                radius={0.8}
                                innerRadius={0.6}
                                height={300}
                                label={{ type: "spider", content: "{name}: {value}" }}
                                legend={{ position: "bottom" }}
                            />
                        ) : (
                            <div className="flex h-[300px] items-center justify-center text-slate-400">
                                Sem vendas fechadas no período
                            </div>
                        )}
                    </Card>
                </Col>
            </Row>

            {/* TABELA */}
            <Card title="Leads no período" className="shadow-sm">
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={filteredLeads}
                    scroll={{ x: "max-content" }}
                    pagination={{
                        pageSize: 10,
                        showTotal: (value) => `Total de ${value} leads`,
                    }}
                />
            </Card>
        </div>
    );
}