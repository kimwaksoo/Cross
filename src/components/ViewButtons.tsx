// 가계부 작성 화면과 월간 리포트 화면을 전환하는 버튼 컴포넌트입니다.
import type { ViewType } from "../types";

type Props = {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
};

export default function ViewButtons({ view, onViewChange }: Props) {
  return (
    <div className="viewButtons">
      <button className={view === "ledger" ? "active" : ""} onClick={() => onViewChange("ledger")}>
        가계부 작성
      </button>
      <button className={view === "report" ? "active" : ""} onClick={() => onViewChange("report")}>
        월간 리포트
      </button>
    </div>
  );
}
