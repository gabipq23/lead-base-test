import { Clock3 } from "lucide-react";

interface ElapsedTimeCellProps {
    createdAt: string;
    reservedAt?: string | null;
    isReserved?: boolean;
    now: number;
}

function parseBrazilianDate(dateStr: string): number {
    const [datePart, timePart] = dateStr.split(", ");

    if (!datePart || !timePart) return NaN;

    const [day, month, year] = datePart.split("/");
    const [hours, minutes, seconds] = timePart.split(":");

    return new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes),
        Number(seconds)
    ).getTime();
}

function formatElapsedCompact(diffSeconds: number) {
    const totalHours = Math.floor(diffSeconds / 3600);
    const minutes = Math.floor((diffSeconds % 3600) / 60);

    return `${totalHours}h ${minutes}m`;
}

export function ElapsedTimeCell({
    createdAt,
    reservedAt,
    isReserved,
    now,
}: ElapsedTimeCellProps) {
    const createdMs = parseBrazilianDate(createdAt);

    if (Number.isNaN(createdMs)) {
        return <span>-</span>;
    }

    const reservedMs =
        isReserved && reservedAt
            ? parseBrazilianDate(reservedAt)
            : null;

    const diffMs =
        reservedMs != null
            ? reservedMs - createdMs
            : now - createdMs;

    const diffSeconds = Math.max(0, Math.floor(diffMs / 1000));

    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 9999,
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                fontWeight: 700,
                fontSize: 13,
                color: "#374151",
                whiteSpace: "nowrap",
            }}
        >
            <Clock3 size={13} />
            {formatElapsedCompact(diffSeconds)}
        </div>
    );
}