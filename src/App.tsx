// 가계부 앱의 전체 화면과 거래 내역 상태를 관리하는 메인 파일입니다.
import { useEffect, useState } from "react";
import "./App.css";
import LedgerView from "./components/LedgerView";
import MonthSelector from "./components/MonthSelector";
import MonthlyReport from "./components/MonthlyReport";
import ViewButtons from "./components/ViewButtons";
import { expenseCategories, formatMoney, incomeCategories } from "./data";
import type { Transaction, TransactionType, ViewType } from "./types";

// localStorage에 거래 내역을 저장할 때 사용하는 이름입니다.
const STORAGE_KEY = "moneychecks-transactions";

export default function App() {
  // 오늘 날짜를 input type="date"에서 사용할 수 있는 형식으로 만듭니다.
  const today = new Date().toISOString().slice(0, 10);

  // localStorage에 저장된 거래 내역이 있으면 불러오고, 없으면 빈 배열로 시작합니다.
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    return savedData ? JSON.parse(savedData) : [];
  });

  // 입력 폼에서 사용하는 값들을 state로 관리합니다.
  const [type, setType] = useState<TransactionType>("income");
  const [category, setCategory] = useState(incomeCategories[0]);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);
  const [memo, setMemo] = useState("");

  // 수정 중인 거래 id입니다. null이면 새 거래를 추가하는 상태입니다.
  const [editingId, setEditingId] = useState<number | null>(null);

  // 거래 목록에서 전체/수입/지출 중 어떤 항목을 볼지 정합니다.
  const [filter, setFilter] = useState<"all" | TransactionType>("all");

  // 가계부 작성 화면과 월간 리포트 화면을 전환하기 위한 state입니다.
  const [view, setView] = useState<ViewType>("ledger");

  // +추가+ 월 선택 기능: 사용자가 보고 싶은 월을 직접 선택할 수 있게 합니다.
  const [selectedMonth, setSelectedMonth] = useState(today.slice(0, 7));

  // +추가+ 검색 기능: 카테고리나 메모에 들어간 글자로 거래 내역을 찾습니다.
  const [searchText, setSearchText] = useState("");

  // 거래 내역이 바뀔 때마다 localStorage에 자동 저장합니다.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // 선택한 월에 해당하는 거래만 따로 모읍니다.
  const monthTransactions = transactions.filter((item) => item.date.startsWith(selectedMonth));

  // 수입 내역만 골라서 총 수입을 계산합니다.
  const totalIncome = monthTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  // 지출 내역만 골라서 총 지출을 계산합니다.
  const totalExpense = monthTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  // 차트에 사용할 카테고리별 지출 합계를 정리합니다.
  const expenseGroup: Record<string, number> = {};

  monthTransactions
    .filter((item) => item.type === "expense")
    .forEach((item) => {
      expenseGroup[item.category] = (expenseGroup[item.category] || 0) + item.amount;
    });

  // 차트 컴포넌트에서 사용할 수 있도록 배열 형태로 바꿉니다.
  const chartData = Object.entries(expenseGroup).map(([name, value]) => ({
    name,
    value,
  }));

  // +추가+ 선택한 필터와 검색어에 맞는 거래 목록만 화면에 보여줍니다.
  const visibleTransactions = monthTransactions
    .filter((item) => filter === "all" || item.type === filter)
    .filter((item) => item.category.includes(searchText) || item.memo.includes(searchText))
    .sort((a, b) => b.date.localeCompare(a.date));

  // 거래 추가/수정 후 입력값을 비웁니다. 수입/지출 선택은 그대로 유지합니다.
  const resetForm = () => {
    setAmount("");
    setDate(today);
    setMemo("");
    setEditingId(null);
  };

  // 수입/지출을 바꾸면 첫 번째 카테고리도 같이 바꿉니다.
  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    setCategory(nextType === "income" ? incomeCategories[0] : expenseCategories[0]);
  };

  // 폼을 제출하면 새 거래를 추가하거나 기존 거래를 수정합니다.
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (Number(amount) <= 0) {
      alert("금액은 1원 이상 입력해주세요.");
      return;
    }

    const nextTransaction: Transaction = {
      id: editingId ?? Date.now(),
      type,
      category,
      amount: Number(amount),
      date,
      memo,
    };

    setTransactions((prev) =>
      editingId
        ? prev.map((item) => (item.id === editingId ? nextTransaction : item))
        : [nextTransaction, ...prev]
    );

    resetForm();
  };

  // 수정 버튼을 누르면 선택한 거래 정보를 입력 폼에 넣습니다.
  const handleEdit = (item: Transaction) => {
    setEditingId(item.id);
    setType(item.type);
    setCategory(item.category);
    setAmount(String(item.amount));
    setDate(item.date);
    setMemo(item.memo);
    setView("ledger");
  };

  // +추가+ 삭제 확인창 기능: 실수로 삭제하지 않도록 확인 후 삭제합니다.
  const handleDelete = (id: number) => {
    const isDelete = confirm("정말 삭제하시겠습니까?");

    if (!isDelete) {
      return;
    }

    setTransactions((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="app">
      <section className="hero">
        <div>
          <p className="eyebrow">MoneyChecks Diary</p>
          <h1>5월의 소비 기록</h1>
          <p>오늘의 작은 기록이 더 좋은 소비 습관을 만듭니다.</p>
        </div>

        <div className="heroCard">
          <span>남은 금액</span>
          <strong>{formatMoney(totalIncome - totalExpense)}</strong>
        </div>
      </section>

      <MonthSelector selectedMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      <ViewButtons view={view} onViewChange={setView} />


      {view === "ledger" ? (
        <LedgerView
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          chartData={chartData}
          transactions={visibleTransactions}
          filter={filter}
          searchText={searchText}
          type={type}
          category={category}
          amount={amount}
          date={date}
          memo={memo}
          editingId={editingId}
          onTypeChange={handleTypeChange}
          onCategoryChange={setCategory}
          onAmountChange={setAmount}
          onDateChange={setDate}
          onMemoChange={setMemo}
          onSubmit={handleSubmit}
          onCancel={resetForm}
          onFilterChange={setFilter}
          onSearchTextChange={setSearchText}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <MonthlyReport
          transactions={monthTransactions}
          today={today}
          selectedMonth={selectedMonth}
          totalExpense={totalExpense}
        />
      )}
    </main>
  );
}
