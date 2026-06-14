import { useEffect, useState } from "react";
import "./styles/App.css";
import LedgerView from "./components/LedgerView";
import MonthSelector from "./components/DateSelector";
import MonthlyReport from "./components/MonthlyReport";
import ViewButtons from "./components/ViewButtons";
import { expenseCategories, formatMoney, incomeCategories } from "./data";
import type { SortType, Transaction, TransactionType, ViewType } from "./types";
import { getChartData, getMonthTransactions, getTotalByType, getVisibleTransactions } from "./utils";

// localStorage에 거래 내역을 저장
const STORAGE_KEY = "moneychecks-transactions";

export default function App() {

  // ★ AI 활용 부분 ★ 한국 시간 기준 날짜가 하루 밀리지 않도록 로컬 날짜 계산 방식 참고
  // 컴퓨터의 로컬 날짜 yyyy-mm-dd
  const getTodayDate = () => {
    const now = new Date();
    const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localTime.toISOString().slice(0, 10);
  };

  // 오늘 날짜를 사용할 수 있는 형식으로 만든 값
  const today = getTodayDate();

  // 전체 거래 내역 목록
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // localStorage에 저장된 문자열 데이터
    const savedData = localStorage.getItem(STORAGE_KEY);
    // 저장된 값이 있으면 문자열을 배열로, 없으면 빈 배열로 시작
    return savedData ? JSON.parse(savedData) : [];
  });


  // 입력 폼 선택 수입/지출 종류
  const [type, setType] = useState<TransactionType>("income");

  // 입력 폼 선택 카테고리
  const [category, setCategory] = useState(incomeCategories[0]);

  // 입력 폼 금액 값
  const [amount, setAmount] = useState("");

  // 입력 폼 날짜
  const [date, setDate] = useState(today);

  // 입력 폼 메모 값
  const [memo, setMemo] = useState("");

  // 수정 중인 거래 id. null이면 새 거래를 추가
  const [editingId, setEditingId] = useState<number | null>(null);

  // 거래 목록에서 전체/수입/지출 중 어떤 항목을 볼지 정하는 값
  const [filter, setFilter] = useState<"all" | TransactionType>("all");

  // 가계부 작성/월간 리포트 화면 전환 값
  const [view, setView] = useState<ViewType>("ledger");

  // 특정 날짜 소비 점수
  const [selectedDate, setSelectedDate] = useState(today);

  // 카테고리/메모로 거래 내역 검색할 때 사용
  const [searchText, setSearchText] = useState("");

  // ★ AI 활용 부분 ★ 거래 목록을 최신순/금액순으로 바꾸기 위한 정렬 상태 구조를 참고함
  // 거래 내역 정렬 방식
  const [sortType, setSortType] = useState<SortType>("latest");

  // 거래 내역 바뀔 때마다 localStorage 자동 저장
  useEffect(() => {
    // transactions가 변경될 때마다 브라우저 저장소에 다시 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  // 월 정보만 잘라 월간 내역 조회에 사용
  // 예: 2026-06-05 -> 2026-06
  const selectedMonth = selectedDate.slice(0, 7);

  // 선택한 월에 해당하는 거래 내역만 모아둔 배열
  const monthTransactions = getMonthTransactions(transactions, selectedMonth);

  // 선택한 월의 총 수입
  const totalIncome = getTotalByType(monthTransactions, "income");

  // 선택한 월의 총 지출
  const totalExpense = getTotalByType(monthTransactions, "expense");

  // 카테고리별 지출 비율 차트에 사용할 데이터
  const chartData = getChartData(monthTransactions);

  // 필터와 검색어가 적용되어 실제 화면에 보이는 거래 목록
  const visibleTransactions = getVisibleTransactions(monthTransactions, filter, searchText, sortType);

  // 선택한 월에서 월 숫자만 꺼내 상단 제목에 사용
  const selectedMonthNumber = Number(selectedMonth.slice(5, 7));

  // 거래 추가/수정 후 입력값 공백, 수입/지출과 날짜 선택은 그대로 유지
  const resetForm = () => {
    setAmount("");
    setMemo("");
    setEditingId(null);
  };

  // 수입/지출을 바꾸면 첫 번째 카테고리도 같이 변동
  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType);
    setCategory(nextType === "income" ? incomeCategories[0] : expenseCategories[0]);
  };

  // 폼을 제출하면 거래 추가 또는 기존 거래 수정
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (Number(amount) <= 0) {
      alert("금액은 1원 이상 입력해주세요.");
      return;
    }

    // 새로 추가하거나 수정할 거래 데이터
    const nextTransaction: Transaction = {
      // 수정 중이면 기존 id를 쓰고, 새 내역이면 현재 시간값으로 id 생성
      id: editingId ?? Date.now(),
      type,
      category,
      amount: Number(amount),
      date,
      memo,
    };

    setTransactions((prev) =>
      // editingId가 있으면 수정, 없으면 새 거래를 맨 앞에 추가
      editingId
        ? prev.map((item) => (item.id === editingId ? nextTransaction : item))
        : [nextTransaction, ...prev]
    );

    resetForm();
  };

  // 수정 버튼 누르면 선택한 거래 정보 입력
  const handleEdit = (item: Transaction) => {
    setEditingId(item.id);
    setType(item.type);
    setCategory(item.category);
    setAmount(String(item.amount));
    setDate(item.date);
    setMemo(item.memo);
    setView("ledger");
  };

  // 삭제 확인창
  const handleDelete = (id: number) => {
    // 삭제 확인창에서의 결과
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
          {/* <p className="eyebrow">MoneyChecks Diary</p> */}
          <h1>
            <span className="monthNumber">{selectedMonthNumber}</span>월의 소비 기록
          </h1>
          <p>작은 소비도 차곡차곡, 돈의 흐름을 가볍게 돌아봐요.</p>
        </div>

        <div className="heroCard">
          <span>남은 금액</span>
          <strong>{formatMoney(totalIncome - totalExpense)}</strong>
        </div>
      </section>

      <MonthSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
      <ViewButtons view={view} onViewChange={setView} />
      {view === "ledger" ? (
        <LedgerView
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          chartData={chartData}
          transactions={visibleTransactions}
          filter={filter}
          searchText={searchText}
          sortType={sortType}
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
          onSortTypeChange={setSortType}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <MonthlyReport
          transactions={monthTransactions}
          selectedDate={selectedDate}
          selectedMonth={selectedMonth}
          totalExpense={totalExpense}
        />
      )}
    </main>
  );
}
