// ★ 오늘의 소비 점수와 영수증 형태의 월간 리포트를 보여주는 컴포넌트입니다.
import { formatMoney } from "../data";
import type { Transaction } from "../types";

type Props = {
  transactions: Transaction[];
  today: string;
  selectedMonth: string;
  totalExpense: number;
};

export default function MonthlyReport({ transactions, today, selectedMonth, totalExpense }: Props) {
  // ★ 오늘 날짜에 해당하는 지출 내역만 골라냅니다.
  const todayExpenses = transactions.filter((item) => item.type === "expense" && item.date === today);

  // ★ 오늘 지출 총액을 계산합니다.
  const todayExpenseTotal = todayExpenses.reduce((sum, item) => sum + item.amount, 0);

  // ★ 오늘 지출 금액에 따라 소비 점수를 간단하게 계산합니다.
  const todayScore =
    todayExpenseTotal === 0 ? 100 : todayExpenseTotal <= 30000 ? 80 : todayExpenseTotal <= 70000 ? 60 : 45;

  // ★ 점수에 따라 사용자에게 보여줄 코멘트를 다르게 만듭니다.
  let scoreMessage = "오늘은 지출이 없어 아주 좋은 소비 흐름입니다.";

  if (todayScore === 80) {
    scoreMessage = "오늘은 적당한 수준으로 소비했습니다.";
  } else if (todayScore === 60) {
    scoreMessage = "오늘 지출이 조금 많은 편입니다.";
  } else if (todayScore === 45) {
    scoreMessage = "오늘은 지출이 많아 소비 조절이 필요합니다.";
  }

  // ★ 월간 지출을 카테고리별로 묶어서 영수증 항목처럼 보여줍니다.
  const categoryTotals: Record<string, number> = {};

  const expenseTransactions = transactions.filter((item) => item.type === "expense");

  expenseTransactions.forEach((item) => {
      categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
    });

  // ★ 금액이 큰 카테고리부터 보이도록 정렬합니다.
  const receiptItems = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const topItem = receiptItems[0];

  return (
    <section className="reportPage">
      <div className="reportHeader">
        <div className="sectionTitle">
          <p>Monthly Receipt</p>
          <h2>{selectedMonth} 소비 리포트</h2>
        </div>
      </div>

      <div className="reportGrid">
        <section className="scoreCard">
          <div className="sectionTitle">
            <p>★ 오늘의 소비 점수</p>
            <h2>{todayScore}점</h2>
          </div>
          <p className="scoreSpend">오늘 지출: {formatMoney(todayExpenseTotal)}</p>
          <div className={`scoreBox score${todayScore}`}>{scoreMessage}</div>
        </section>

        <section className="receiptCard">
          <div className="receiptTitle">
            <span>MoneyChecks</span>
            <strong>월간 소비 영수증</strong>
            <em>{selectedMonth}</em>
          </div>

          {receiptItems.length === 0 ? (
            <div className="empty small">지출 내역을 추가하면 영수증이 표시됩니다.</div>
          ) : (
            <>
              <div className="receiptSummary">
                <div>
                  <span>지출 건수</span>
                  <strong>{expenseTransactions.length}건</strong>
                </div>
                <div>
                  <span>최다 지출</span>
                  <strong>
                    {topItem[0]} {formatMoney(topItem[1])}
                  </strong>
                </div>
              </div>

              <div className="receiptRows">
                {receiptItems.map(([category, amount]) => (
                  <div className="receiptRow" key={category}>
                    <span>{category}</span>
                    <strong>
                      {formatMoney(amount)}
                      <em>{Math.round((amount / totalExpense) * 100)}%</em>
                    </strong>
                  </div>
                ))}
              </div>

              <div className="receiptTotal">
                <span>총 지출</span>
                <strong>{formatMoney(totalExpense)}</strong>
              </div>
            </>
          )}
        </section>
      </div>
    </section>
  );
}
