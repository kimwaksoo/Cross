import type { SortType, Transaction, TransactionType } from "./types";

// 선택한 월에 해당하는 거래 내역만 골라내는 함수
export const getMonthTransactions = (
  transactions: Transaction[],
  selectedMonth: string,
) => {
  return transactions.filter((item) => item.date.startsWith(selectedMonth));
};

// 수입 또는 지출 중 원하는 종류의 총합을 계산하는 함수
export const getTotalByType = (
  transactions: Transaction[],
  type: TransactionType,
) => {
  return transactions
    .filter((item) => item.type === type)
    // sum에는 지금까지 더한 금액, item.amount에는 현재 거래 금액
    .reduce((sum, item) => sum + item.amount, 0);
};

// ★ AI 활용 부분 ★ 지출 내역을 카테고리별 합계로 묶어 차트 데이터로 바꾸는 구조를 참고함
// 지출 내역 카테고리별로 묶어 차트 데이터로 변환
export const getChartData = (transactions: Transaction[]) => {
  // 카테고리 이름 key, 금액 합계 value로 저장
  const expenseGroup: Record<string, number> = {};

  transactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      expenseGroup[item.category] =
        (expenseGroup[item.category] || 0) + item.amount;
    });

  // 객체 형태의 합계 데이터를 차트에서 쓰기 쉬운 배열 형태로 변환
  return Object.entries(expenseGroup).map(([name, value]) => ({
    name,
    value,
  }));
};

// ★ AI 활용 부분 ★ 필터, 검색어, 정렬 조건을 한 번에 적용하는 목록 처리 흐름을 참고함
// 필터 버튼, 검색어를 적용해서 실제 화면에 보여줄 거래 목록을 만드는 함수
export const getVisibleTransactions = (
  transactions: Transaction[],
  filter: "all" | TransactionType,
  searchText: string,
  sortType: SortType,
) => {
  return transactions
    .filter((item) => filter === "all" || item.type === filter)
    .filter(
      (item) =>
        // 검색어가 카테고리 또는 메모에 포함되면 화면 표시
        item.category.includes(searchText) || item.memo.includes(searchText),
    )
    .sort((a, b) => {
      // 선택한 정렬 버튼에 따라 최신순 또는 금액순으로 정렬
      if (sortType === "highAmount") {
        return b.amount - a.amount;
      }

      if (sortType === "lowAmount") {
        return a.amount - b.amount;
      }

      return b.date.localeCompare(a.date);
    });
};
