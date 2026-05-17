import { useMemo, useState } from "react";
import { formatCurrency } from "../../../utils";

const TREND_RANGES = [
  { id: "14d", label: "14 ngay", days: 14 },
  { id: "1m", label: "1 thang", days: 30 },
  { id: "3m", label: "3 thang", days: 90 },
  { id: "6m", label: "6 thang", days: 180 },
];

const StatusPill = ({ value, tone = "neutral" }) => {
  const toneClassMap = {
    positive: "border-[#cde7d7] bg-[#edf9f1] text-[#1f6b43]",
    warning: "border-[#f0dfb8] bg-[#fff8e8] text-[#9a6b14]",
    danger: "border-[#efc7c3] bg-[#fff0ee] text-[#9d3f35]",
    neutral: "border-[#e7ddcf] bg-[#f9f5ee] text-[#5b4f42]",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneClassMap[tone] || toneClassMap.neutral}`}>
      {value}
    </span>
  );
};

const StatCard = ({ label, value, note }) => (
  <div className="rounded-[24px] border border-[#eadfce] bg-[#fffcf7] p-5">
    <div className="text-xs uppercase tracking-[0.18em] text-accent">{label}</div>
    <div className="mt-2 text-3xl font-semibold text-textPrimary">{value}</div>
    <div className="mt-2 text-sm text-gray-600">{note}</div>
  </div>
);

const ChartEmpty = ({ message, className = "h-56" }) => (
  <div className={`flex items-center justify-center rounded-[20px] border border-dashed border-[#d9cfbf] bg-[#fffaf1] text-sm text-gray-600 ${className}`}>
    {message}
  </div>
);

const toDateKey = (dateValue) => {
  if (!dateValue) return "";
  const raw = String(dateValue).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const resolveBookingDate = (record = {}) => record?.checkin_date || record?.created_at || null;

const getLatestDateKey = (records = []) => {
  const keys = records
    .map((record) => toDateKey(resolveBookingDate(record)))
    .filter(Boolean)
    .sort();
  return keys[keys.length - 1] || toDateKey(new Date());
};

const createDateAxis = (days, latestDateKey) => {
  const [y, m, d] = String(latestDateKey || "").split("-").map((item) => Number(item));
  const anchor = Number.isFinite(y) && Number.isFinite(m) && Number.isFinite(d)
    ? new Date(y, Math.max(0, m - 1), d)
    : new Date();
  const keys = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const cursor = new Date(anchor);
    cursor.setDate(anchor.getDate() - i);
    keys.push(toDateKey(cursor));
  }
  return keys;
};

const buildHotelTrendSeries = (records = [], hotels = [], days = 14, selectedHotelId = "") => {
  const latestDateKey = getLatestDateKey(records);
  const axis = createDateAxis(days, latestDateKey);
  const baseMap = new Map(axis.map((key) => [key, 0]));

  const recordsInRange = records.filter((record) => {
    const key = toDateKey(resolveBookingDate(record));
    return baseMap.has(key);
  });
  const selectedRecords = recordsInRange.filter(
    (record) => String(record?.hotel_id) === String(selectedHotelId),
  );
  const countMap = new Map(baseMap);
  selectedRecords.forEach((record) => {
    const key = toDateKey(resolveBookingDate(record));
    countMap.set(key, Number(countMap.get(key) || 0) + 1);
  });

  const hotelName = hotels.find((hotel) => String(hotel.id) === String(selectedHotelId))?.name || "Selected hotel";
  return {
    axis,
    lines: [
      {
        id: String(selectedHotelId || "selected"),
        name: hotelName,
        color: "#17363f",
        values: axis.map((key) => Number(countMap.get(key) || 0)),
      },
    ],
  };
};

const TrendModeTabs = ({ value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {TREND_RANGES.map((range) => (
      <button
        key={range.id}
        type="button"
        onClick={() => onChange(range.id)}
        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
          value === range.id
            ? "border-[#17363f] bg-[#17363f] text-white"
            : "border-[#deceb6] bg-[#fffaf1] text-[#5d5347] hover:border-[#c9b18e]"
        }`}
      >
        {range.label}
      </button>
    ))}
  </div>
);

const HotelTrendChart = ({ trendData, title, subtitle }) => {
  const width = 940;
  const height = 340;
  const left = 56;
  const right = 24;
  const top = 20;
  const bottom = 48;

  const axis = trendData?.axis || [];
  const lines = trendData?.lines || [];

  if (!axis.length || !lines.length) {
    return <ChartEmpty message="Khong co du lieu trend cho bo loc hien tai." className="h-[320px]" />;
  }

  const maxValue = Math.max(1, ...lines.flatMap((line) => line.values));
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const stepX = axis.length > 1 ? chartWidth / (axis.length - 1) : 0;

  const yTicks = [1, 0.75, 0.5, 0.25, 0].map((ratio) => Math.round(maxValue * ratio));

  const plottedLines = lines.map((line) => {
    const points = line.values.map((value, index) => {
      const x = left + stepX * index;
      const y = top + (1 - value / maxValue) * chartHeight;
      return { x, y, value, key: axis[index] };
    });

    const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
    return { ...line, points, path };
  });

  return (
    <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Hotel trend</div>
          <div className="mt-1 text-2xl font-semibold text-textPrimary">{title}</div>
          <div className="mt-1 text-sm text-gray-600">{subtitle}</div>
        </div>
        <div className="flex flex-wrap gap-3 text-xs">
          {plottedLines.map((line) => (
            <div key={line.id} className="inline-flex items-center gap-2 rounded-full border border-[#e6d8c3] bg-[#fffaf1] px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: line.color }} />
              <span className="text-[#5d5347]">{line.name}</span>
            </div>
          ))}
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {yTicks.map((tick) => {
          const y = top + (1 - tick / maxValue) * chartHeight;
          return (
            <g key={`tick-${tick}`}>
              <line x1={left} y1={y} x2={width - right} y2={y} stroke="#eadfcf" strokeDasharray="4 4" />
              <text x={left - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#7a7268">
                {tick}
              </text>
            </g>
          );
        })}

        <line x1={left} y1={top} x2={left} y2={height - bottom} stroke="#d7c8af" />
        <line x1={left} y1={height - bottom} x2={width - right} y2={height - bottom} stroke="#d7c8af" />

        {plottedLines.map((line) => (
          <g key={line.id}>
            <path d={line.path} fill="none" stroke={line.color} strokeWidth="3" />
            {line.points.map((point) => (
              <g key={`${line.id}-${point.key}`}>
                <circle cx={point.x} cy={point.y} r="3.5" fill={line.color} />
                <title>{`${line.name} | ${point.key}: ${point.value} bookings`}</title>
              </g>
            ))}
          </g>
        ))}

        {axis.map((label, index) => {
          if (!(index === 0 || index === axis.length - 1 || index % Math.ceil(axis.length / 8) === 0)) {
            return null;
          }
          const x = left + stepX * index;
          return (
            <text key={label} x={x} y={height - 12} textAnchor="middle" fontSize="10" fill="#7a7268">
              {label.slice(5)}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

const RevenueBarChart = ({ data = [] }) => {
  if (!data.length) {
    return <ChartEmpty message="Chua co du lieu doanh thu theo thang." />;
  }

  const maxValue = Math.max(...data.map((item) => Number(item.revenue || 0)), 1);
  const yTicks = [1, 0.75, 0.5, 0.25, 0].map((ratio) => Math.round(maxValue * ratio));

  return (
    <div className="rounded-[24px] border border-[#eadfce] bg-[#fffcf7] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-textPrimary">Revenue by month (6 months)</div>
        <div className="text-xs text-gray-500">Don vi: VND</div>
      </div>

      <div className="grid grid-cols-[52px_minmax(0,1fr)] gap-3">
        <div className="flex h-56 flex-col justify-between text-right">
          {yTicks.map((tick) => (
            <span key={tick} className="text-[11px] text-gray-500">
              {tick ? `${Math.round(tick / 1000000)}M` : "0"}
            </span>
          ))}
        </div>

        <div className="relative h-56 border-l border-b border-[#dccfb9]">
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            {yTicks.map((tick) => (
              <div key={`grid-${tick}`} className="border-t border-dashed border-[#eee2cf]" />
            ))}
          </div>

          <div className="absolute inset-x-2 bottom-0 top-2 flex items-end gap-3">
            {data.map((item) => {
              const revenue = Number(item.revenue || 0);
              const height = Math.max(2, Math.round((revenue / maxValue) * 100));
              return (
                <div key={item.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="text-[11px] text-gray-500">{revenue ? `${Math.round(revenue / 1000000)}M` : "0"}</div>
                  <div
                    className="w-full rounded-t-lg bg-[#1f4d57] transition hover:bg-[#17363f]"
                    style={{ height: `${height}%` }}
                    title={`${item.key}: ${formatCurrency(revenue)}`}
                  />
                  <div className="text-xs font-medium text-gray-600">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const TopHotelsBarChart = ({ data = [] }) => {
  if (!data.length) {
    return <ChartEmpty message="Chua co du lieu top hotel theo doanh thu." />;
  }

  const maxValue = Math.max(...data.map((item) => Number(item.revenue || 0)), 1);

  return (
    <div className="rounded-[24px] border border-[#eadfce] bg-[#fffcf7] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-textPrimary">Top hotels by revenue</div>
        <div className="text-xs text-gray-500">So sanh theo % khach san cao nhat</div>
      </div>

      <div className="space-y-4">
        {data.map((hotel) => {
          const ratio = (Number(hotel.revenue || 0) / maxValue) * 100;
          return (
            <div key={hotel.hotelId}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <div className="truncate font-medium text-textPrimary">{hotel.hotelName}</div>
                  <div className="text-xs text-gray-500">{hotel.bookings} bookings</div>
                </div>
                <div className="shrink-0 font-semibold text-textPrimary">{formatCurrency(hotel.revenue)}</div>
              </div>
              <div className="h-3 rounded-full bg-[#efe6d6]">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-[#214f58] to-[#2f6b77]"
                  style={{ width: `${Math.max(5, ratio)}%` }}
                  title={`${hotel.hotelName}: ${ratio.toFixed(1)}%`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DashboardSection = ({ stats, selectedHotel, bookingHistory = [], managerHotels = [] }) => {
  const [trendRangeId, setTrendRangeId] = useState("14d");

  const activeRange = TREND_RANGES.find((item) => item.id === trendRangeId) || TREND_RANGES[0];
  const selectedHotelId = String(selectedHotel?.id || "");

  const hotelTrendData = useMemo(
    () => buildHotelTrendSeries(bookingHistory, managerHotels, activeRange.days, selectedHotelId),
    [bookingHistory, managerHotels, activeRange.days, selectedHotelId],
  );

  const trendTitle = "Booking trend theo khach san da chon";
  const trendSubtitle = `Hien thi booking trend cua ${selectedHotel?.name || "khach san duoc chon"} trong ${activeRange.label}.`;

  return (
    <section className="space-y-6">
      <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
        <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Operations Dashboard</div>
        <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
          Snapshot van hanh {selectedHotel?.name ? `- ${selectedHotel.name}` : "toan he thong"}
        </h2>
        <p className="mt-3 text-sm leading-7 text-gray-600">
          Tong hop KPI booking, thanh toan va revenue de doi van hanh co the ra quyet dinh nhanh.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Revenue" value={formatCurrency(stats.totalRevenue)} note="Tong final amount" />
          <StatCard label="Bookings" value={stats.totalBookings} note="Tong booking hien co" />
          <StatCard label="Avg booking value" value={formatCurrency(stats.averageBookingValue)} note="Gia tri trung binh / booking" />
          <StatCard label="Paid ratio" value={`${stats.paidRatio}%`} note="Ty le booking da thanh toan" />
        </div>
      </div>

      <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <TrendModeTabs value={trendRangeId} onChange={setTrendRangeId} />
          <div className="rounded-xl border border-[#d9cab3] bg-[#fffaf1] px-3 py-2 text-sm text-[#4f473d]">
            {selectedHotel?.name || "Chua chon khach san"}
          </div>
        </div>

        <HotelTrendChart trendData={hotelTrendData} title={trendTitle} subtitle={trendSubtitle} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_14px_35px_rgba(34,27,18,0.06)]">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Booking status mix</div>
          <div className="mt-4 space-y-3">
            {stats.bookingStatusRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between rounded-2xl bg-[#fffcf7] p-4">
                <div className="font-medium text-textPrimary">{row.key}</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{row.count}</span>
                  <StatusPill value={`${row.percent}%`} tone={row.tone} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[#e5dbc9] bg-white p-6 shadow-[0_14px_35px_rgba(34,27,18,0.06)]">
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">Payment status mix</div>
          <div className="mt-4 space-y-3">
            {stats.paymentStatusRows.map((row) => (
              <div key={row.key} className="flex items-center justify-between rounded-2xl bg-[#fffcf7] p-4">
                <div className="font-medium text-textPrimary">{row.key}</div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">{row.count}</span>
                  <StatusPill value={`${row.percent}%`} tone={row.tone} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueBarChart data={stats.revenueByMonth} />
        <TopHotelsBarChart data={stats.topHotelsByRevenue} />
      </div>
    </section>
  );
};

export default DashboardSection;
