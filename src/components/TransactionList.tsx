// 입력된 거래 내역을 목록으로 보여주고, 필터/검색/수정/삭제 버튼 담당 컴포넌트
import type { SortType, Transaction, TransactionType } from "../types";
import { formatMoney } from "../data";

// 거래 목록 컴포넌트에 필요한 props
type Props = {
  transactions: Transaction[];
  filter: "all" | TransactionType;
  searchText: string;
  sortType: SortType;
  onFilterChange: (filter: "all" | TransactionType) => void;
  onSearchTextChange: (searchText: string) => void;
  onSortTypeChange: (sortType: SortType) => void;
  onEdit: (item: Transaction) => void;
  onDelete: (id: number) => void;
};

export default function TransactionList({
  transactions,
  filter,
  searchText,
  sortType,
  onFilterChange,
  onSearchTextChange,
  onSortTypeChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="listCard">
      <div className="listHeader">
        <div className="sectionTitle">
          <p>내역 관리</p>
          <h2>수입 / 지출 리스트</h2>
        </div>

        <div className="filterButtons">
          <button className={filter === "all" ? "active" : ""} onClick={() => onFilterChange("all")}>
            전체
          </button>
          <button className={filter === "income" ? "active" : ""} onClick={() => onFilterChange("income")}>
            수입
          </button>
          <button className={filter === "expense" ? "active" : ""} onClick={() => onFilterChange("expense")}>
            지출
          </button>
        </div>
      </div>

      <div className="sortButtons">
        <button className={sortType === "latest" ? "active" : ""} onClick={() => onSortTypeChange("latest")}>
          최신순
        </button>
        <button className={sortType === "highAmount" ? "active" : ""} onClick={() => onSortTypeChange("highAmount")}>
          금액 높은순
        </button>
        <button className={sortType === "lowAmount" ? "active" : ""} onClick={() => onSortTypeChange("lowAmount")}>
          금액 낮은순
        </button>
      </div>

      {/* 검색 기능 */}
      <input
        className="searchInput"
        value={searchText}
        placeholder="카테고리 또는 메모 검색"
        onChange={(e) => onSearchTextChange(e.target.value)}
      />

      <div className="transactions">
        {/* 거래 내역이 없으면 안내 문구 표기, 있으면 map으로 반복 표기 */}
        {transactions.length === 0 ? (
          <div className="empty">조건에 맞는 내역이 없습니다.</div>
        ) : (
          transactions.map((item) => (
            <article className="transaction" key={item.id}>
              <div className={`badge ${item.type}`}>{item.type === "income" ? "수" : "지"}</div>

              <div>
                <strong>{item.category}</strong>
                <p>
                  {item.date}
                  {item.memo && ` · ${item.memo}`}
                </p>
              </div>

              <strong className={item.type}>
                {item.type === "income" ? "+" : "-"}
                {formatMoney(item.amount)}
              </strong>

              <div className="actions">
                <button onClick={() => onEdit(item)}>수정</button>
                <button onClick={() => onDelete(item.id)}>삭제</button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
