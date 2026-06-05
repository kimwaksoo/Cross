// 조회 날짜 선택 컴포넌트
type Props = {
  selectedDate: string;
  onDateChange: (date: string) => void;
};

export default function MonthSelector({ selectedDate, onDateChange }: Props) {
  return (
    <section className="monthSelector">
      <label>
        조회 날짜
        <input
          type="date"
          min="2000-01-01"
          max="2100-12-31"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </label>
    </section>
  );
}
