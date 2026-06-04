// 가계부에서 사용하는 카테고리 목록과 금액 표시 함수를 모아둔 파일
// 수입을 입력할 때 선택할 수 있는 카테고리 목록
export const incomeCategories = ["월급", "부수입", "용돈", "투자수익", "기타수입"];

// 지출을 입력할 때 선택할 수 있는 카테고리 목록
export const expenseCategories = [
  "경조사",
  "교육",
  "교통",
  "문화/여가",
  "술/유흥",
  "식사",
  "여행/숙박",
  "의료",
  "주거/통신",
  "카페/간식",
  "저축",
  "기타",
];

// 숫자로 된 금액을 한국 원화 표시로 바꿔주는 함수
export const formatMoney = (value: number) => {
  return value.toLocaleString("ko-KR") + "원";
};
