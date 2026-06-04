// 월 수입, 월 지출, 월 잔액을 카드 형태로 보여주는 컴포넌트
import { formatMoney } from "../data";

// App 컴포넌트에서 계산한 수입, 지출, 잔액을 받아옴
type Props = {
  income: number;
  expense: number;
  balance: number;
};

export default function SummaryCards({ income, expense, balance }: Props) {
  return (
    <section className="summary">
      {/* 총 수입 카드 */}
      <div className="summaryCard income">
        <span>월 수입</span>
        <strong>{formatMoney(income)}</strong>
      </div>

      {/* 총 지출 카드 */}
      <div className="summaryCard expense">
        <span>월 지출</span>
        <strong>{formatMoney(expense)}</strong>
      </div>

      {/* 수입에서 지출을 뺀 잔액 카드 */}
      <div className="summaryCard balance">
        <span>월 잔액</span>
        <strong>{formatMoney(balance)}</strong>
      </div>
    </section>
  );
}
