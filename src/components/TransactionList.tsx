// 입력된 거래 내역을 목록으로 보여주고, 필터/검색/수정/삭제 버튼을 담당하는 컴포넌트입니다.
import type { Transaction, TransactionType } from "../types";
import { formatMoney } from "../data";

// 거래 목록 컴포넌트에서 필요한 props 타입입니다.
type Props = {
  transactions: Transaction[];
  filter: "all" | TransactionType;
  searchText: string;
  onFilterChange: (filter: "all" | TransactionType) => void;
  onSearchTextChange: (searchText: string) => void;
  onEdit: (item: Transaction) => void;
  onDelete: (id: number) => void;
};

export default function TransactionList({
  transactions,
  filter,
  searchText,
  onFilterChange,
  onSearchTextChange,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="listCard">
      <div className="listHeader">
        <div className="sectionTitle">
          <p>내역 관리</p>
          <h2>수입/지출 리스트</h2>
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

      {/* +추가+ 검색 기능: 카테고리나 메모에 포함된 글자로 내역을 찾습니다. */}
      <input
        className="searchInput"
        value={searchText}
        placeholder="카테고리 또는 메모 검색"
        onChange={(e) => onSearchTextChange(e.target.value)}
      />

      <div className="transactions">
        {/* 거래 내역이 없으면 안내 문구를 보여주고, 있으면 map으로 반복해서 보여줍니다. */}
        {transactions.length === 0 ? (
          <div className="empty">아직 등록된 내역이 없습니다.</div>
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
