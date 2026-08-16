# UI 캡처

검증된 local memory mode에서 Playwright Chromium으로 캡처합니다.

```powershell
npm run capture:ui --workspace=@handbook/optional-web-service-extension
```

- `week-03-dashboard-desktop.png`: 1280px 기본 desktop viewport의 생성·목록 화면
- `week-03-dashboard-mobile.png`: 390×844 mobile viewport의 동일 기능 화면

캡처는 합성 데이터만 사용하며 token·cookie·환경변수를 화면에 표시하지 않습니다.

무결성 값은 `SHA256SUMS`에서 확인합니다.
