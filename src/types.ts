// 거래 종류 수입 또는 지출만 선택할 수 있게 타입 제한
export type TransactionType = "income" | "expense";

// 가계부 작성/월간 리포트 화면 구분
export type ViewType = "ledger" | "report";

// 거래 목록 정렬 방식
export type SortType = "latest" | "highAmount" | "lowAmount";

// 가계부 거래 내역 한 개가 가지는 데이터 구조
export type Transaction = {
  id: number;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  memo: string;
};
