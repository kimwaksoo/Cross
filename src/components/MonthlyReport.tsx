// 특정 날짜의 소비 점수와 영수증 형태의 월간 리포트를 보여주는 컴포넌트
import { formatMoney } from "../data";
import type { Transaction } from "../types";

type Props = {
  transactions: Transaction[];
  selectedDate: string;
  selectedMonth: string;
  totalExpense: number;
};

export default function MonthlyReport({ transactions, selectedDate, selectedMonth, totalExpense }: Props) {
  // 선택한 날짜와 일치하는 지출 내역만 모아둔 배열
  const selectedDateExpenses = transactions.filter((item) => item.type === "expense" && item.date === selectedDate);

  // 선택한 날짜의 지출 금액을 모두 더한 값
  const selectedDateExpenseTotal = selectedDateExpenses.reduce((sum, item) => sum + item.amount, 0);

  // 선택한 날짜의 지출 금액에 따라 보여줄 소비 점수
  const selectedDateScore =
    selectedDateExpenseTotal === 0
      ? 100
      : selectedDateExpenseTotal <= 30000
        ? 80
        : selectedDateExpenseTotal <= 70000
          ? 60
          : selectedDateExpenseTotal <= 100000
          ? 45
          : 20;

  // 점수에 따라 사용자에게 보여줄 안내 문구
  let scoreMessage = "선택한 날짜에는 지출이 없어 아주 좋은 소비 흐름입니다.";

  if (selectedDateScore === 80) {
    scoreMessage = "선택한 날짜에는 적당한 수준으로 소비했습니다.";
  } else if (selectedDateScore === 60) {
    scoreMessage = "선택한 날짜의 지출이 조금 많은 편입니다.";
  } else if (selectedDateScore === 45) {
    scoreMessage = "선택한 날짜에는 지출이 많아 소비 조절이 필요합니다.";
  } else if (selectedDateScore === 20) {
    scoreMessage = "선택한 날짜의 지출이 과합니다. 그만 소비하셔야 됩니다."
  }

  // 카테고리별 지출 합계를 저장하는 객체
  const categoryTotals: Record<string, number> = {};

  // 월간 리포트에 사용할 지출 내역만 모아둔 배열
  const expenseTransactions = transactions.filter((item) => item.type === "expense");

  expenseTransactions.forEach((item) => {
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + item.amount;
  });

  // 영수증에 보여줄 카테고리별 지출 목록
  const receiptItems = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  // 가장 많이 지출한 카테고리
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
            <p>특정 날짜의 소비 점수</p>
            <h2>{selectedDateScore}점</h2>
          </div>
          <p className="scoreSpend">
            {selectedDate} 지출: {formatMoney(selectedDateExpenseTotal)}
          </p>
          <div className={`scoreBox score${selectedDateScore}`}>{scoreMessage}</div>
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




