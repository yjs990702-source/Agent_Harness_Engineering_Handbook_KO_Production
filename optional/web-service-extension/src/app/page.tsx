import { RequestDashboard } from "@/components/request-dashboard";

export default function Home() {
  return (
    <main>
      <header className="hero">
        <p className="eyebrow">WEEK 03 · PRODUCTION SERVICE</p>
        <h1>업무요청을 명세에서 증거까지</h1>
        <p>
          작은 사용자 흐름 하나를 안전하게 구현하고, 입력 경계·테넌트
          격리·CSRF·XSS 방어를 같은 검증 명령으로 확인합니다.
        </p>
        <ul className="hero-facts" aria-label="실습 기준">
          <li>Local-first</li>
          <li>합성 데이터</li>
          <li>Fail closed</li>
        </ul>
      </header>
      <RequestDashboard />
    </main>
  );
}
