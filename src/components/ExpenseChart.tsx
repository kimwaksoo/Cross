// 지출 내역을 카테고리별 차트로 보여주는 컴포넌트
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney } from "../data";

// 차트에 들어가는 데이터
type ChartItem = {
  name: string;
  value: number;
};

type Props = {
  data: ChartItem[];
};

// 차트 조각마다 사용할 색상 목록
const COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#f59e0b",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#ea580c",
  "#4f46e5",
  "#0f766e",
  "#b91c1c",
];

export default function ExpenseChart({ data }: Props) {
  const [chartType, setChartType] = useState<"pie" | "bar">("pie");
  const barData = [...data].sort((a, b) => a.value - b.value);

  return (
    <section className="chartCard">
      <div className="sectionTitle">
        <p>소비 분석</p>
        <h2>카테고리별 지출 비율</h2>
      </div>

      {data.length > 0 ? (
        <div className="chartModeButtons">
          <button className={chartType === "pie" ? "active" : ""} onClick={() => setChartType("pie")}>
            원형
          </button>
          <button className={chartType === "bar" ? "active" : ""} onClick={() => setChartType("bar")}>
            막대
          </button>
        </div>
      ) : null}

      {data.length > 0 ? (
        <div className="chartBody">
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "pie" ? (
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatMoney(Number(value))} />
              </PieChart>
            ) : (
              <BarChart data={barData} margin={{ top: 12, right: 12, bottom: 20, left: 10 }}>
                <CartesianGrid stroke="#ead7bd" strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fill: "#76695e", fontSize: 12 }} />
                <YAxis tick={{ fill: "#76695e", fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 10000}만`} />
                <Tooltip formatter={(value) => formatMoney(Number(value))} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="empty">지출 내역을 추가하면 차트가 표시됩니다.</div>
      )}

      {data.length > 0 ? (
        <div className="chartLegend">
          {data.map((item, index) => (
            <span className="chartLegendItem" key={item.name}>
              <span className="chartLegendColor" style={{ background: COLORS[index % COLORS.length] }} />
              {item.name}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
