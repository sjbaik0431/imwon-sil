# 임원실 (Imwon.Sil)

**한국 중소기업 CEO·임원용 경영 종합 대시보드 — Open 데모**

가상 회사 **한울정공(주)** (정밀 부품 제조, 임직원 87명, 연 매출 280억) 의 12개월치 데모 데이터로 12개 메뉴 전부를 자유롭게 둘러보실 수 있습니다.

라이브 URL은 GitHub Pages 배포 시 `https://<your-github-id>.github.io/imwon-sil/` 형태로 생성됩니다.

---

## 🧭 12개 메뉴

| # | 메뉴 | 핵심 |
|---|------|------|
| 1 | **홈** | 자금잔고·매출 KPI·신호등 5종·오늘 일정·결재 대기·AI 모닝 브리핑·시장 위젯·헤드라인 뉴스·자사 블로그 1장 요약 |
| 2 | **보고서** | PDF/엑셀/이미지/녹음(.mp3·m4a)/Word/텍스트 드래그업로드 → 1줄 결론 + 3줄 핵심 + 3대 액션 AI 요약 |
| 3 | **시각화** | 5종 데이터(매출·영업이익·현금잔고·파이프라인·고객별 매출) × 4종 차트(라인·막대·도넛·큰숫자) |
| 4 | **재무** | 매출·영업이익·현금잔고·여신한도잔여·매출채권 5 KPI + 전월·전년동월비 + 자금일보 |
| 5 | **영업** | 수주→견적→수령→계약→납품 5단계 파이프라인 + 고객별 마진 + 영업사원 실적 순위 |
| 6 | **인사** | 재직·이직률·연차·결재 / 급여·복리·초과근무 / 핵심인재 이탈 경보 / 조직 타임라인 |
| 7 | **일정** | 법정신고(부가세·원천세·4대보험·공시) + 임원 경조사 + 결재 마감 + 외부 미팅 + 미니 캘린더 |
| 8 | **KPI 관리** | 회사·부서·개인 신호등 카드 + 진행률 바 + 신규 KPI 직접 등록 |
| 9 | **시장** | 환율 4종 + KOSPI/KOSDAQ + 원자재 + 건설자재 + 경기지표 (전일대비 화살표) |
| 10 | **뉴스 / 정책** | 업계 뉴스 15건 + 정부 정책 8건 + 카테고리 필터 + 검색 |
| 11 | **입찰** | 나라장터·조달청·국방조달·지방 입찰 12건 + D-day 정렬 + 별표 관심 표시 |
| 12 | **명함** | 인맥 25명 + 관계 강도 점수 + OCR 사진 업로드 + 6개월+ 미접촉 경보 + 다가오는 생일·승진 |

**전역 기능**: 🎤 음성 입력(STT) · 🔊 AI 브리핑 음성 출력(TTS) · ☀/🌙 라이트·다크 토글 · ⚙ 설정(API 키·이름·알림·데모 리셋)

---

## 🚀 GitHub Pages 배포 5단계

```bash
# 1. GitHub 계정에서 새 public repository 생성
#    이름: imwon-sil  (혹은 원하는 이름)

# 2. 본 폴더를 git 초기화 + 커밋
cd "C:/Users/bguu1/OneDrive/문서/클로드코드/imwon-sil"
git init
git add .
git commit -m "임원실 v0.1 — Open 데모"

# 3. 원격 추가 + main 브랜치 푸시
git branch -M main
git remote add origin https://github.com/<your-github-id>/imwon-sil.git
git push -u origin main

# 4. GitHub repo의 Settings → Pages
#    Source: Deploy from a branch
#    Branch: main / (root)
#    Save 후 약 1~2분 대기

# 5. 라이브 URL 확인
#    https://<your-github-id>.github.io/imwon-sil/
```

배포 후 **누구나 어디서나** 라이센스 키 없이 접속해 모든 기능을 둘러볼 수 있습니다.

---

## 🔓 Open 데모 정책

- **라이센스 키 불필요** — 첫 진입 안내 모달만 한 번 표시되고 닫히면 모든 메뉴 즉시 접근
- **사용자 입력 (메모·KPI·명함)은 본인 브라우저 LocalStorage에만 저장** — 외부로 전송되지 않음
- **AI 요약은 선택 사항** — ⚙ 설정 모달에서 본인의 OpenAI 또는 Anthropic API 키 등록 시 활성화. 미입력 시 더미 응답 표시
- **모든 데이터는 가상 예시**. 실제 회사·인물·금액 아님

---

## ⚠️ 운영 한계 (MVP 제약)

이 버전은 **데모/평가용 정적 SPA**입니다. 다음 한계를 가지며, 유료 SaaS 운영을 위해서는 별도 인프라가 필요합니다.

| 영역 | 현 상태 | 실서비스 권장 |
|---|---|---|
| 외부 API (나라장터·ECOS·정책브리핑·뉴스) | **데모 데이터만** (CORS 차단) | Cloudflare Workers / Vercel Functions 프록시 1개 경유 |
| 뉴스 RSS | 네이버 RSS는 2022년 폐쇄 → **Google News 검색 RSS** 권장 | `news.google.com/rss/search?q=…&hl=ko&gl=KR&ceid=KR:ko` + 프록시 |
| 인증·결제 | **없음** (Open 데모) | Supabase Auth + 토스페이먼츠/Stripe + 한국 리전 백엔드 |
| 데이터 격리 | 브라우저 LocalStorage (5MB) | Supabase RLS, 고객사별 테넌트 분리 |
| Tailwind | Play CDN (개발용) | Tailwind CLI 빌드 → `dist/output.css` 정적 배포 (GitHub Actions) |
| 음성 인식 | Web Speech API (한국어 ko-KR) | **Chrome / Edge 권장**. Firefox 미지원, Safari 부분 지원 |
| 명함 OCR | 더미 진행바 (실제 OCR 미구현) | Naver CLOVA OCR / Google ML Kit (개인정보 위탁 고지 필수) |
| 보안 | API 키 평문 LocalStorage | Web Crypto AES-GCM 암호화 + CSP + SRI |
| 개인정보 | 동의 모달 미구현 | 개인정보처리방침 페이지 + 첫 진입 동의 모달 (개인정보보호법 의무) |

---

## 💰 가격 티어 (참고)

| 티어 | 월정액 | 대상 | 핵심 |
|---|---|---|---|
| **Starter** | 9.9만원 | 매출 50억 이하, CEO 1인 | 자금일보·뉴스·일정·명함 |
| **Pro** | 19만원 | 매출 50~500억, 임원 5인 | + 입찰·공시·이탈경보·AI Q&A·음성 브리핑 |
| **Enterprise** | 49만원~ | 매출 500억+, 커스텀 | + 멀티사·전담 CSM·온프레미스 옵션 |

도입·계약 문의: **bsj0431@gmail.com** (다풀림행정사 사무소)

---

## 🛠 기술 스택

- **프론트엔드**: 정적 HTML + Tailwind CSS (CDN) + Chart.js v4 + Vanilla JS
- **데이터**: 인라인 JSON (window.IMWON_DEMO) + 브라우저 LocalStorage / IndexedDB
- **AI (선택)**: Anthropic Claude API (`anthropic-dangerous-direct-browser-access` CORS 직호출) 또는 OpenAI (프록시 필요)
- **음성**: Web Speech API (브라우저 내장)
- **호스팅**: GitHub Pages (정적, HTTPS 자동)

---

## 📂 파일 구조

```
imwon-sil/
├── index.html         # 메인 SPA (헤더·12메뉴·전역JS·CSS, 약 1,200줄)
├── assets/
│   ├── data.js        # 한울정공 데모 데이터 풀세트 (575줄)
│   └── modules.js     # 메뉴 7~12 렌더 모듈 (909줄)
└── README.md          # 본 파일
```

---

## 🎬 5분 데모 시나리오 (영업 화법)

> **30초** — "사장님은 매일 아침 몇 분 만에 회사 상태 파악하시나요?"
> **60초** — 홈 화면 시연: 자금잔고·미결재·이탈경보 7초 안에 파악
> **90초** — 보고서 메뉴에 PDF 1장 던지면 1+3+3 요약 즉시 출력
> **60초** — 입찰 메뉴: 나라장터 12건 D-day 정렬, 별표로 관심 등록
> **60초** — 가격·14일 무료·계좌이체 안내 → "내일 키 보내드릴까요?"

---

## 🤝 제작

본 데모는 **다풀림행정사 사무소 (백상진 행정사)** 가 한국 중소기업 CEO·임원의 디지털 전환을 돕기 위해 기획·제작했습니다.

- **버전**: v0.1 (Open Demo)
- **빌드 일자**: 2026-05-03
- **저작권**: © 2026 다풀림행정사. 본 코드는 데모 목적으로 공개됩니다.
- **문의**: bsj0431@gmail.com

---

> ⓘ 본 페이지의 모든 데이터·인물·금액은 데모용 가상 예시이며, 실제 회사 정보가 아닙니다.
