// 가계부 작성 화면에 필요한 요약 카드, 입력 폼, 차트, 거래 목록을 묶는 컴포넌트입니다.
import ExpenseChart from "./ExpenseChart";
import SummaryCards from "./SummaryCards";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import type { Transaction, TransactionType } from "../types";

type ChartItem = {
  name: string;
  value: number;
};

type Props = {
  totalIncome: number;
  totalExpense: number;
  chartData: ChartItem[];
  transactions: Transaction[];
  filter: "all" | TransactionType;
  searchText: string;
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
  onSubmit: (event: React.FormEvent) => void;
  onCancel: () => void;
  onFilterChange: (filter: "all" | TransactionType) => void;
  onSearchTextChange: (searchText: string) => void;
  onEdit: (item: Transaction) => void;
  onDelete: (id: number) => void;
};

export default function LedgerView({
  totalIncome,
  totalExpense,
  chartData,
  transactions,
  filter,
  searchText,
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
  onFilterChange,
  onSearchTextChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      <SummaryCards income={totalIncome} expense={totalExpense} balance={totalIncome - totalExpense} />

      <section className="content">
        <TransactionForm
          type={type}
          category={category}
          amount={amount}
          date={date}
          memo={memo}
          editingId={editingId}
          onTypeChange={onTypeChange}
          onCategoryChange={onCategoryChange}
          onAmountChange={onAmountChange}
          onDateChange={onDateChange}
          onMemoChange={onMemoChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
        <ExpenseChart data={chartData} />
      </section>

      <TransactionList
        transactions={transactions}
        filter={filter}
        searchText={searchText}
        onFilterChange={onFilterChange}
        onSearchTextChange={onSearchTextChange}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </>
  );
}
