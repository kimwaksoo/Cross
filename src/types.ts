// 가계부 거래 데이터에서 사용하는 TypeScript 타입을 정의한 파일
// 거래 종류는 수입 또는 지출만 선택할 수 있게 타입을 제한
export type TransactionType = "income" | "expense";

// 가계부 작성 화면과 월간 리포트 화면을 구분하는 타입
export type ViewType = "ledger" | "report";

// 가계부 거래 내역 한 개가 가지는 데이터 구조
export type Transaction = {
  id: number;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  memo: string;
};
