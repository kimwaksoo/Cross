// +추가+ 조회할 월을 선택하는 기능만 담당하는 컴포넌트입니다.
type Props = {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
};

export default function MonthSelector({ selectedMonth, onMonthChange }: Props) {
  return (
    <section className="monthSelector">
      <label>
        조회 월
        <input
          type="month"
          min="2000-01"
          max="2100-12"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
        />
      </label>
    </section>
  );
}
