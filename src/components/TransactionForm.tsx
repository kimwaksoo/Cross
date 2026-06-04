// 수입/지출 내역을 입력하거나 수정하는 폼 컴포넌트입니다.
import type { FormEvent } from "react";
import type { TransactionType } from "../types";
import { expenseCategories, incomeCategories } from "../data";

// 부모 컴포넌트인 App에서 전달받는 값과 함수의 타입입니다.
type Props = {
  type: TransactionType;
  category: string;
  amount: string;
  date: string;
  memo: string;
  editingId: number | null;
  onTypeChange: (type: TransactionType) => void;
  onCategoryChange: (category: string) => void;
  onAmountChange: (amount: string) => void;
  onDateChange: (date: string) => void;
  onMemoChange: (memo: string) => void;
  onSubmit: (event: FormEvent) => void;
  onCancel: () => void;
};

export default function TransactionForm({
  type,
  category,
  amount,
  date,
  memo,
  editingId,
  onTypeChange,
  onCategoryChange,
  onAmountChange,
  onDateChange,
  onMemoChange,
  onSubmit,
  onCancel,
}: Props) {
  // 수입/지출 선택에 따라 보여줄 카테고리 목록을 정합니다.
  const categories = type === "income" ? incomeCategories : expenseCategories;

  return (
    <form className="formCard" onSubmit={onSubmit}>
      <div className="sectionTitle">
        <p>거래 입력</p>
        <h2>{editingId ? "내역 수정" : "새 내역 추가"}</h2>
      </div>

      <div className="typeButtons">
        <button type="button" className={type === "income" ? "active" : ""} onClick={() => onTypeChange("income")}>
          수입
        </button>
        <button type="button" className={type === "expense" ? "active" : ""} onClick={() => onTypeChange("expense")}>
          지출
        </button>
      </div>

      <label>
        카테고리
        <select value={category} onChange={(e) => onCategoryChange(e.target.value)}>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>

      <label>
        금액
        <input
          type="number"
          min="1"
          step="1"
          placeholder="예: 251231"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          required
        />
      </label>

      <label>
        날짜
        <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} required />
      </label>

      <label>
        메모
        <input value={memo} placeholder="예: 점심 식사" onChange={(e) => onMemoChange(e.target.value)} />
      </label>

      <div className="formActions">
        <button className="primaryButton" type="submit">
          {editingId ? "저장하기" : "추가하기"}
        </button>

        {editingId && (
          <button className="secondaryButton" type="button" onClick={onCancel}>
            취소
          </button>
        )}
      </div>
    </form>
  );
}
