import { Link, Outlet } from "@tanstack/react-router";
import { Card, Typography } from "antd";
import type { JSX } from "react";
import { useAuth } from "@/context/auth-provider";

export function MyAreaPage(): JSX.Element {
    const { user } = useAuth();
    const isAdmin = user?.user?.role === "ADMIN";

    const areaLinks = [
        {
            label: "Perfil",
            to: "/app/my_area/profile",
        }, {
            label: "Usuários",
            to: "/app/my_area/users",
        },
        {
            label: "Créditos",
            to: "/app/my_area/credit",
        },
        {
            label: "Extratos",
            to: "/app/my_area/statement",
        },

    ];

    return (
        <div className="py-6 pb-10 min-h-[calc(100vh-140px)] ">
            <div className={` ${isAdmin ? "mb-0" : "mb-6"} `}>
                <Typography.Title level={3} style={{ marginBottom: 4 }}>
                    {isAdmin ? "" : "Minha Área"}
                </Typography.Title>
            </div>

            {isAdmin ? (
                <div className="">
                    <Outlet />
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)] items-start">
                    <Card className="shadow-sm rounded-2xl border-neutral-200">
                        <div className="flex flex-col gap-3">
                            {areaLinks.map((item) => (
                                item.label === "Usuários" && user?.user?.role !== "GESTOR" ? null : (
                                    <Link
                                        key={item.to}
                                        to={item.to}
                                        className="rounded-xl border border-neutral-200 px-4 py-3 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
                                        activeProps={{
                                            className:
                                                "rounded-xl border border-neutral-800 bg-neutral-800 px-4 py-3 text-white transition-colors",
                                        }}
                                    >
                                        <span className="block text-sm font-semibold">{item.label}</span>

                                    </Link>
                                )))}
                        </div>
                    </Card>

                    <div className="min-h-100 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                        <Outlet />
                    </div>
                </div>
            )}
        </div>
    );
}