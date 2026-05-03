/* ============================================================================
 * 임원실(Imwon.Sil) — 데모 데이터 풀세트
 * 회사: 한울정공(주) (HANUL Precision)
 * 데모 기간: 2025-05 ~ 2026-04 (12개월)
 * 기준일: 2026-05-03
 * ========================================================================== */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 회사 기본 정보
  // ---------------------------------------------------------------------------
  const company = {
    name: "한울정공(주)",
    nameEn: "HANUL Precision Co., Ltd.",
    industry: "정밀 부품 제조 (자동차·반도체)",
    ceo: "김임원",
    location: "충북 청주시 흥덕구 오송산업단지",
    employees: 87,
    established: "2008-03",
    capital: 1_500_000_000,
    bizNo: "315-81-XXXXX"
  };

  // ---------------------------------------------------------------------------
  // 재무 (KPI / 월별 / 일별)
  // ---------------------------------------------------------------------------
  const finance = {
    kpis: {
      revenue: {
        label: "매출",
        current: 2_350_000_000,
        prevMonth: 2_180_000_000,
        prevYear: 2_050_000_000,
        target: 2_500_000_000,
        unit: "원",
        status: "yellow"
      },
      operatingProfit: {
        label: "영업이익",
        current: 285_000_000,
        prevMonth: 240_000_000,
        prevYear: 310_000_000,
        target: 350_000_000,
        unit: "원",
        status: "yellow"
      },
      cashBalance: {
        label: "현금잔고",
        current: 1_240_000_000,
        prevMonth: 1_180_000_000,
        prevYear: 980_000_000,
        target: 1_500_000_000,
        unit: "원",
        status: "green"
      },
      creditLine: {
        label: "여신한도잔여",
        current: 2_000_000_000,
        prevMonth: 1_800_000_000,
        prevYear: 1_500_000_000,
        target: 2_500_000_000,
        unit: "원",
        status: "green"
      },
      accountsReceivable: {
        label: "매출채권",
        current: 3_120_000_000,
        prevMonth: 2_980_000_000,
        prevYear: 2_750_000_000,
        target: 2_800_000_000,
        unit: "원",
        status: "red"
      }
    },
    monthly: [
      { month: "2025-05", revenue: 2_050_000_000, operatingProfit: 245_000_000, cashBalance: 980_000_000 },
      { month: "2025-06", revenue: 2_120_000_000, operatingProfit: 258_000_000, cashBalance: 1_020_000_000 },
      { month: "2025-07", revenue: 1_980_000_000, operatingProfit: 215_000_000, cashBalance: 990_000_000 },
      { month: "2025-08", revenue: 1_850_000_000, operatingProfit: 180_000_000, cashBalance: 1_010_000_000 },
      { month: "2025-09", revenue: 2_240_000_000, operatingProfit: 285_000_000, cashBalance: 1_080_000_000 },
      { month: "2025-10", revenue: 2_380_000_000, operatingProfit: 305_000_000, cashBalance: 1_120_000_000 },
      { month: "2025-11", revenue: 2_410_000_000, operatingProfit: 312_000_000, cashBalance: 1_150_000_000 },
      { month: "2025-12", revenue: 2_520_000_000, operatingProfit: 335_000_000, cashBalance: 1_220_000_000 },
      { month: "2026-01", revenue: 2_080_000_000, operatingProfit: 220_000_000, cashBalance: 1_140_000_000 },
      { month: "2026-02", revenue: 2_150_000_000, operatingProfit: 240_000_000, cashBalance: 1_160_000_000 },
      { month: "2026-03", revenue: 2_290_000_000, operatingProfit: 268_000_000, cashBalance: 1_180_000_000 },
      { month: "2026-04", revenue: 2_180_000_000, operatingProfit: 240_000_000, cashBalance: 1_180_000_000 }
    ],
    daily: (function () {
      // 최근 30영업일 — 평일만 생성
      const out = [];
      let cash = 1_180_000_000;
      const start = new Date('2026-03-23');
      for (let i = 0; i < 50 && out.length < 30; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dow = d.getDay();
        if (dow === 0 || dow === 6) continue;
        const delta = Math.round((Math.random() - 0.45) * 80_000_000);
        cash += delta;
        const dueNotes = (i % 7 === 0) ? Math.floor(Math.random() * 3) : 0;
        out.push({
          date: d.toISOString().slice(0, 10),
          cashBalance: cash,
          dueNotes: dueNotes
        });
      }
      return out;
    })()
  };

  // ---------------------------------------------------------------------------
  // 영업
  // ---------------------------------------------------------------------------
  const sales = {
    pipeline: [
      { stage: "수주",       count: 23, amount: 4_800_000_000 },
      { stage: "견적",       count: 12, amount: 2_300_000_000 },
      { stage: "수령(LOI)",  count:  6, amount: 1_400_000_000 },
      { stage: "계약",       count:  4, amount:   980_000_000 },
      { stage: "납품",       count: 18, amount: 2_200_000_000 }
    ],
    customers: [
      { name: "현대모비스",         ytdRevenue: 8_200_000_000, ytdMargin: 14.2, status: "주요" },
      { name: "삼성전자 협력 1차",  ytdRevenue: 4_500_000_000, ytdMargin: 11.8, status: "주요" },
      { name: "LG이노텍",           ytdRevenue: 3_100_000_000, ytdMargin: 12.5, status: "주요" },
      { name: "현대위아",           ytdRevenue: 2_400_000_000, ytdMargin: 10.4, status: "안정" },
      { name: "LS Mtron",           ytdRevenue: 2_100_000_000, ytdMargin: -2.1, status: "적자" },
      { name: "한온시스템",         ytdRevenue: 1_850_000_000, ytdMargin:  9.2, status: "안정" },
      { name: "만도",               ytdRevenue: 1_420_000_000, ytdMargin: 13.1, status: "안정" },
      { name: "SK하이닉스 벤더",    ytdRevenue:   980_000_000, ytdMargin:  8.5, status: "안정" },
      { name: "두산공작기계",       ytdRevenue:   720_000_000, ytdMargin:  6.2, status: "관찰" },
      { name: "기타(소규모)",       ytdRevenue:   430_000_000, ytdMargin:  5.0, status: "관찰" }
    ],
    salespeople: [
      { name: "최영업", dept: "영업1팀", achievement: 11_200_000_000, target: 12_000_000_000 },
      { name: "박판매", dept: "영업1팀", achievement:  8_400_000_000, target: 10_000_000_000 },
      { name: "정수주", dept: "영업2팀", achievement:  6_800_000_000, target:  7_500_000_000 },
      { name: "이거래", dept: "영업2팀", achievement:  5_200_000_000, target:  6_000_000_000 },
      { name: "강계약", dept: "해외영업", achievement:  3_900_000_000, target:  5_000_000_000 },
      { name: "윤신규", dept: "신규영업", achievement:  1_800_000_000, target:  3_000_000_000 }
    ]
  };

  // ---------------------------------------------------------------------------
  // 인사
  // ---------------------------------------------------------------------------
  const hr = {
    summary: {
      totalEmployees: 87,
      turnoverRate: 8.4,
      leaveUsage: 62,
      pendingApprovals: 14
    },
    compensation: [
      { month: "2025-05", payroll: 412_000_000, benefits: 38_000_000, overtime: 22_000_000 },
      { month: "2025-06", payroll: 415_000_000, benefits: 41_000_000, overtime: 28_000_000 },
      { month: "2025-07", payroll: 418_000_000, benefits: 42_000_000, overtime: 35_000_000 },
      { month: "2025-08", payroll: 420_000_000, benefits: 39_000_000, overtime: 18_000_000 },
      { month: "2025-09", payroll: 425_000_000, benefits: 40_000_000, overtime: 31_000_000 },
      { month: "2025-10", payroll: 430_000_000, benefits: 43_000_000, overtime: 38_000_000 },
      { month: "2025-11", payroll: 432_000_000, benefits: 44_000_000, overtime: 41_000_000 },
      { month: "2025-12", payroll: 510_000_000, benefits: 52_000_000, overtime: 26_000_000 }, // 성과급
      { month: "2026-01", payroll: 438_000_000, benefits: 41_000_000, overtime: 19_000_000 },
      { month: "2026-02", payroll: 440_000_000, benefits: 42_000_000, overtime: 24_000_000 },
      { month: "2026-03", payroll: 445_000_000, benefits: 45_000_000, overtime: 32_000_000 },
      { month: "2026-04", payroll: 448_000_000, benefits: 46_000_000, overtime: 28_000_000 }
    ],
    flightRisk: [
      {
        name: "박○○ 책임", dept: "생산기술", riskScore: 78,
        signals: ["출근시간 변동성 ↑", "성과등급 하락", "이직 사이트 조회 흔적"]
      },
      {
        name: "이○○ 과장", dept: "영업2팀", riskScore: 65,
        signals: ["연차 집중 사용", "면담 거부", "외근 빈도 ↑"]
      },
      {
        name: "정○○ 대리", dept: "품질관리", riskScore: 58,
        signals: ["주간 회의 발언 감소", "초과근무 거부"]
      },
      {
        name: "윤○○ 사원", dept: "구매", riskScore: 42,
        signals: ["입사 18개월차 권태기 신호"]
      }
    ],
    timeline: [
      { date: "2026-04-28", type: "공지",   content: "여름휴가 사전 신청 안내" },
      { date: "2026-04-22", type: "입사",   content: "신입 3명 입사 (생산기술 2, 품질 1)" },
      { date: "2026-04-18", type: "교육",   content: "관리자 리더십 워크숍 (1박2일)" },
      { date: "2026-04-15", type: "퇴사",   content: "한○○ 차장(영업1팀) 퇴사" },
      { date: "2026-04-10", type: "복지",   content: "건강검진 대상자 통보" },
      { date: "2026-04-05", type: "급여",   content: "4월 급여 지급 완료" },
      { date: "2026-03-30", type: "징계",   content: "근태 위반 1건 경고" },
      { date: "2026-03-25", type: "승진",   content: "정기 인사발령 (8명)" },
      { date: "2026-03-15", type: "공지",   content: "신년 워크숍 후기 공유" },
      { date: "2026-03-08", type: "복지",   content: "여성의 날 기념 선물 배송" }
    ]
  };

  // ---------------------------------------------------------------------------
  // 일정
  // ---------------------------------------------------------------------------
  const schedule = {
    legal: [
      { date: "2026-05-10", type: "원천세 신고",       deadline: true },
      { date: "2026-05-12", type: "4대보험 신고",       deadline: true },
      { date: "2026-05-25", type: "부가세 예정신고",   deadline: true },
      { date: "2026-05-31", type: "법인세 중간예납",   deadline: true },
      { date: "2026-06-10", type: "원천세 신고",       deadline: false },
      { date: "2026-06-30", type: "안전보건교육 보고", deadline: false },
      { date: "2026-07-10", type: "원천세 신고",       deadline: false },
      { date: "2026-07-25", type: "부가세 확정신고",   deadline: false },
      { date: "2026-08-10", type: "원천세 신고",       deadline: false },
      { date: "2026-08-31", type: "사업장 안전점검",   deadline: false }
    ],
    birthdays: [
      { date: "2026-05-08", name: "이상철 이사", dept: "관리본부" },
      { date: "2026-05-15", name: "김지훈 부장", dept: "관리부" },
      { date: "2026-05-22", name: "최민수 상무", dept: "영업본부" },
      { date: "2026-06-03", name: "박서연 팀장", dept: "품질관리" },
      { date: "2026-06-18", name: "정우진 대표", dept: "임원" },
      { date: "2026-07-01", name: "한경태 이사", dept: "생산본부" }
    ],
    deadlines: [
      { date: "2026-05-08", type: "결재마감", content: "5월 매입 결재 12건" },
      { date: "2026-05-09", type: "결재마감", content: "신규 거래처 등록 3건" },
      { date: "2026-05-15", type: "결재마감", content: "5월 급여 결재" },
      { date: "2026-05-20", type: "결재마감", content: "설비 투자품의 (CNC 1대)" },
      { date: "2026-05-28", type: "결재마감", content: "5월 마감 결산" },
      { date: "2026-06-05", type: "결재마감", content: "여름 워크숍 품의" },
      { date: "2026-06-15", type: "결재마감", content: "6월 급여 결재" }
    ],
    meetings: [
      { date: "2026-05-05 14:00", title: "현대모비스 사장단 미팅",  location: "용인 본사" },
      { date: "2026-05-07 10:00", title: "삼성전자 협력사 정기 회의", location: "수원 사업장" },
      { date: "2026-05-12 15:00", title: "LG이노텍 신제품 품평회",  location: "구미" },
      { date: "2026-05-18 11:00", title: "충북도청 산단 입주기업 간담회", location: "청주 도청" },
      { date: "2026-05-21 14:00", title: "한온시스템 기술 미팅",     location: "대전 R&D센터" },
      { date: "2026-05-26 10:00", title: "임원 월례 경영회의",       location: "본사 회의실" },
      { date: "2026-06-02 13:00", title: "SK하이닉스 협력사 컨퍼런스", location: "이천" }
    ]
  };

  // ---------------------------------------------------------------------------
  // KPI 관리
  // ---------------------------------------------------------------------------
  const kpi = {
    company: [
      { name: "월 매출",       target: 2_500_000_000, current: 2_350_000_000, status: "yellow", unit: "원" },
      { name: "영업이익률",    target: 14,            current: 12.1,          status: "yellow", unit: "%" },
      { name: "수율",          target: 99.2,          current: 99.4,          status: "green",  unit: "%" },
      { name: "납기준수율",    target: 98,            current: 97.2,          status: "yellow", unit: "%" },
      { name: "재고일수",      target: 35,            current: 42,            status: "red",    unit: "일" },
      { name: "고객만족도",    target: 90,            current: 88,            status: "yellow", unit: "점" },
      { name: "이직률",        target: 7,             current: 8.4,           status: "yellow", unit: "%" },
      { name: "안전사고 건수", target: 0,             current: 1,             status: "red",    unit: "건" }
    ],
    departments: {
      sales: [
        { name: "신규수주",     target: 5_000_000_000, current: 4_800_000_000, status: "yellow", unit: "원" },
        { name: "수주잔",       target: 18_000_000_000, current: 16_500_000_000, status: "yellow", unit: "원" },
        { name: "주요고객 만족도", target: 92,           current: 89,            status: "yellow", unit: "점" },
        { name: "신규거래처 발굴", target: 3,            current: 2,             status: "yellow", unit: "건" }
      ],
      production: [
        { name: "수율",         target: 99.2,          current: 99.4,          status: "green",  unit: "%" },
        { name: "납기준수율",   target: 98,            current: 97.2,          status: "yellow", unit: "%" },
        { name: "설비가동률",   target: 85,            current: 82.5,          status: "yellow", unit: "%" },
        { name: "불량률",       target: 0.8,           current: 0.6,           status: "green",  unit: "%" },
        { name: "재고일수",     target: 35,            current: 42,            status: "red",    unit: "일" }
      ],
      hr: [
        { name: "이직률",       target: 7,             current: 8.4,           status: "yellow", unit: "%" },
        { name: "교육시간/인",  target: 24,            current: 18,            status: "yellow", unit: "시간" },
        { name: "연차사용률",   target: 80,            current: 62,            status: "red",    unit: "%" },
        { name: "안전사고",     target: 0,             current: 1,             status: "red",    unit: "건" }
      ]
    },
    individuals: [
      {
        name: "김임원 대표", dept: "임원",
        kpis: [
          { name: "전사 영업이익", target: 350_000_000, current: 285_000_000, status: "yellow", unit: "원" },
          { name: "신규 사업 진척", target: 100,         current: 65,          status: "yellow", unit: "%" },
          { name: "거버넌스 점검",  target: 12,          current: 11,          status: "green",  unit: "회" }
        ]
      },
      {
        name: "최민수 상무", dept: "영업본부",
        kpis: [
          { name: "수주 달성률",   target: 100, current: 92,  status: "yellow", unit: "%" },
          { name: "신규고객 발굴", target: 5,   current: 3,   status: "yellow", unit: "건" },
          { name: "주요고객 NPS",  target: 50,  current: 42,  status: "yellow", unit: "점" }
        ]
      },
      {
        name: "한경태 이사", dept: "생산본부",
        kpis: [
          { name: "수율",         target: 99.2, current: 99.4, status: "green",  unit: "%" },
          { name: "납기준수율",   target: 98,   current: 97.2, status: "yellow", unit: "%" },
          { name: "원가절감액",   target: 200_000_000, current: 165_000_000, status: "yellow", unit: "원" },
          { name: "재고일수",     target: 35,   current: 42,   status: "red",    unit: "일" }
        ]
      },
      {
        name: "이상철 이사", dept: "관리본부",
        kpis: [
          { name: "예산집행율",   target: 95,   current: 91,   status: "yellow", unit: "%" },
          { name: "회계마감 D-day", target: 5,  current: 6,    status: "yellow", unit: "일" },
          { name: "법규준수 점검", target: 100, current: 100,  status: "green",  unit: "%" }
        ]
      },
      {
        name: "박서연 팀장", dept: "품질관리",
        kpis: [
          { name: "불량률",       target: 0.8,  current: 0.6,  status: "green",  unit: "%" },
          { name: "고객 클레임",  target: 3,    current: 5,    status: "red",    unit: "건" },
          { name: "내부감사 시정율", target: 95, current: 92,  status: "yellow", unit: "%" }
        ]
      },
      {
        name: "정우진 부장", dept: "구매",
        kpis: [
          { name: "원자재 단가절감", target: 5,  current: 3.2, status: "yellow", unit: "%" },
          { name: "협력사 평가",  target: 100,  current: 95,   status: "green",  unit: "%" },
          { name: "공급 안정도",  target: 99,   current: 98.5, status: "green",  unit: "%" }
        ]
      }
    ]
  };

  // ---------------------------------------------------------------------------
  // 시장 지표
  // ---------------------------------------------------------------------------
  const market = {
    forex: [
      { pair: "USD/KRW", current: 1342.5, prev: 1338.0, change: 0.34 },
      { pair: "JPY/KRW", current:    8.92, prev:    8.95, change: -0.34 },
      { pair: "CNY/KRW", current:  184.3,  prev:  183.7,  change: 0.33 },
      { pair: "EUR/KRW", current: 1456.0,  prev: 1462.3,  change: -0.43 }
    ],
    indices: [
      { name: "KOSPI",     current: 2685.4, prev: 2702.1, change: -0.62 },
      { name: "KOSDAQ",    current:  845.2, prev:  840.5, change:  0.56 },
      { name: "S&P 500",   current: 5210.3, prev: 5188.4, change:  0.42 },
      { name: "Nikkei",    current: 38240.5, prev: 38120.2, change: 0.32 }
    ],
    commodities: [
      { name: "WTI 원유", current:    78.4,  prev:    77.1,  change:  1.69, unit: "USD/배럴" },
      { name: "구리",     current:  9450,    prev:  9380,    change:  0.75, unit: "USD/톤" },
      { name: "알루미늄", current:  2380,    prev:  2395,    change: -0.63, unit: "USD/톤" },
      { name: "금",       current:  2350,    prev:  2342,    change:  0.34, unit: "USD/온스" }
    ],
    construction: [
      { name: "시멘트",     current:  95_000, prev:  93_000, change:  2.15, unit: "원/톤" },
      { name: "철근(SD400)", current: 720_000, prev: 715_000, change:  0.70, unit: "원/톤" },
      { name: "H형강",      current: 920_000, prev: 925_000, change: -0.54, unit: "원/톤" },
      { name: "레미콘",     current: 105_000, prev: 102_000, change:  2.94, unit: "원/m³" }
    ],
    economy: [
      { name: "GDP 성장률",       current: 2.1,   prev: 1.9,   unit: "%",  note: "1Q26 (전분기 대비)" },
      { name: "소비자물가지수",   current: 113.4, prev: 112.8, unit: "p",  note: "전년동월 +2.1%" },
      { name: "소비자심리지수",   current: 96.8,  prev: 98.1,  unit: "p",  note: "기준 100" },
      { name: "기준금리",         current: 3.25,  prev: 3.50,  unit: "%",  note: "한국은행" },
      { name: "수출 증감률",      current: 4.2,   prev: 3.1,   unit: "%",  note: "전년동월" },
      { name: "제조업 BSI",       current: 82,    prev: 79,    unit: "p",  note: "5월 전망" }
    ]
  };

  // ---------------------------------------------------------------------------
  // 뉴스
  // ---------------------------------------------------------------------------
  const news = [
    { title: "현대모비스, 1Q 영업이익 12% 증가 — 부품 협력사 단가 인상 가능성",
      source: "한국경제", date: "2026-05-02", url: "#", category: "주요고객",
      summary: "현대모비스가 1분기 영업이익을 전년대비 12% 증가시키며 협력사 단가 인상 협상에 우호적 환경 조성." },
    { title: "철강·구리 가격 상승세, 부품업계 원가 부담 가중",
      source: "이데일리", date: "2026-05-01", url: "#", category: "산업",
      summary: "구리 톤당 9,450달러로 전월 대비 4.2% 상승. 정밀가공 업계 원가 압박 심화." },
    { title: "정부, 자동차 부품 R&D 지원금 확대 발표",
      source: "전자신문", date: "2026-04-29", url: "#", category: "정책",
      summary: "산업부가 2026년 자동차 부품 R&D 지원 예산을 1,200억원으로 확대. 중소 부품사 우선 지원." },
    { title: "삼성전자, 반도체 장비 국산화율 40% 달성 목표",
      source: "조선비즈", date: "2026-04-28", url: "#", category: "주요고객",
      summary: "삼성전자가 2027년까지 반도체 장비 국산화율 40% 달성 목표. 국내 협력사 발주 확대 전망." },
    { title: "충북 청주 산단 입주기업 87% '인력난 호소'",
      source: "충청일보", date: "2026-04-27", url: "#", category: "지역",
      summary: "오송·오창 산단 입주 기업 설문에서 인력난이 최대 경영 애로사항으로 부상." },
    { title: "원/달러 환율 1,340원대 안착 — 수출기업 마진 개선",
      source: "매일경제", date: "2026-04-26", url: "#", category: "환율",
      summary: "원/달러 환율이 1,340원대에서 안정세를 보이며 수출 비중 높은 부품 제조사 마진 개선 효과." },
    { title: "한국은행, 기준금리 0.25%p 인하 — 3.25%",
      source: "연합뉴스", date: "2026-04-25", url: "#", category: "금리",
      summary: "한국은행 금통위가 기준금리를 3.25%로 인하. 중소기업 자금조달 비용 완화 기대." },
    { title: "LG이노텍, 카메라 모듈 신규 라인 청주에 증설",
      source: "전자신문", date: "2026-04-24", url: "#", category: "주요고객",
      summary: "LG이노텍이 청주 사업장에 카메라 모듈 신규 라인을 증설. 인근 협력사 수혜 예상." },
    { title: "중대재해처벌법 시행 2년 — 제조업 안전관리 비용 평균 18% 증가",
      source: "한겨레", date: "2026-04-23", url: "#", category: "정책",
      summary: "중대재해처벌법 시행 2년차. 제조업 안전관리 비용이 평균 18% 증가했으며 사고 건수는 11% 감소." },
    { title: "현대차그룹 부품사 협력 강화 컨퍼런스 개최",
      source: "머니투데이", date: "2026-04-22", url: "#", category: "주요고객",
      summary: "현대차그룹이 5월 부품사 협력 강화 컨퍼런스를 용인에서 개최. 1차 협력사 200여개 참여." },
    { title: "SK하이닉스, HBM 생산능력 확대 — 협력사 수주 확대 기대",
      source: "디지털타임스", date: "2026-04-21", url: "#", category: "산업",
      summary: "SK하이닉스가 HBM 생산능력을 60% 확대 발표. 정밀 부품 협력사들에 신규 수주 기회." },
    { title: "중소기업 R&D 세액공제 한도, 2026년 시행",
      source: "조세일보", date: "2026-04-20", url: "#", category: "정책",
      summary: "중소기업 R&D 세액공제 한도가 30%로 확대. 매출 300억 미만 제조업에 우선 적용." },
    { title: "정밀가공 산업 글로벌 경쟁력 보고서 발간",
      source: "산업연구원", date: "2026-04-18", url: "#", category: "산업",
      summary: "한국 정밀가공 산업의 글로벌 경쟁력 평가에서 일본·독일에 이어 3위 차지." },
    { title: "충북도, 청주 산단 인프라 1,500억 투자 발표",
      source: "충북일보", date: "2026-04-15", url: "#", category: "지역",
      summary: "충북도가 청주 오송·오창 산단 인프라 확충에 1,500억원 투자 계획 발표." },
    { title: "자동차 부품 수출 4월 기준 전년 대비 7.8% 증가",
      source: "산업통상자원부", date: "2026-04-12", url: "#", category: "산업",
      summary: "4월 자동차 부품 수출액이 전년 대비 7.8% 증가. 미국·EU 시장 회복세 뚜렷." }
  ];

  // ---------------------------------------------------------------------------
  // 정책
  // ---------------------------------------------------------------------------
  const policy = [
    { title: "중소기업 R&D 세액공제 한도 확대 (2026년 시행)",
      agency: "기획재정부", date: "2026-04-25", url: "#",
      summary: "중소제조업 R&D 세액공제 한도가 25%→30%로 확대. 정밀가공·부품 업종 우선 지원." },
    { title: "중대재해처벌법 시행규칙 개정안 입법예고",
      agency: "고용노동부", date: "2026-04-20", url: "#",
      summary: "안전보건관리체계 구축 의무 명확화. 50인 이상 사업장 컨설팅 비용 50% 지원." },
    { title: "스마트공장 보급·확산 사업 모집 공고",
      agency: "중소벤처기업부", date: "2026-04-15", url: "#",
      summary: "2026년 스마트공장 구축 지원사업 모집. 중간1 단계 5천만원, 고도화 1억원 한도." },
    { title: "탄소중립 설비투자 세액공제 확대",
      agency: "환경부", date: "2026-04-10", url: "#",
      summary: "탄소저감 설비 투자 시 투자금액의 12%까지 세액공제. 중소기업은 16%로 우대." },
    { title: "병역특례 산업기능요원 배정 신청 접수 개시",
      agency: "병무청", date: "2026-04-05", url: "#",
      summary: "2026년 산업기능요원 신규 배정 신청 접수. 지정업체 기준 완화로 중소제조업 기회 확대." },
    { title: "수출 중소기업 환변동 보험료 80% 지원",
      agency: "산업통상자원부", date: "2026-04-01", url: "#",
      summary: "한국무역보험공사 환변동 보험료의 80%를 정부가 보전. 수출 중소기업 신청 가능." },
    { title: "근로시간 단축 청구권 확대 시행",
      agency: "고용노동부", date: "2026-03-25", url: "#",
      summary: "가족돌봄·학업·은퇴준비 사유로 근로시간 단축 청구 가능. 사업주 거부 시 과태료 500만원." },
    { title: "정밀화학·소재 부품 국산화 R&D 지원사업",
      agency: "산업통상자원부", date: "2026-03-20", url: "#",
      summary: "정밀가공·소재 부품 국산화 R&D 지원사업 공고. 과제당 최대 5억원 3년 지원." }
  ];

  // ---------------------------------------------------------------------------
  // 입찰
  // ---------------------------------------------------------------------------
  const tenders = [
    { agency: "한국전력공사",         title: "변전소용 정밀 부품 공급 입찰",          amount:    580_000_000, deadline: "2026-05-20", source: "나라장터",       url: "#" },
    { agency: "한국도로공사",         title: "도로 안전시설물 정밀가공품",             amount:    320_000_000, deadline: "2026-05-15", source: "나라장터",       url: "#" },
    { agency: "충북 청주시",          title: "산단 시설 정비 부품",                      amount:    180_000_000, deadline: "2026-05-12", source: "나라장터(지방)", url: "#" },
    { agency: "방위사업청",           title: "군용 차량 부품 정밀가공 입찰",            amount:  1_200_000_000, deadline: "2026-05-28", source: "국방조달",      url: "#" },
    { agency: "한국가스공사",         title: "LNG 설비용 정밀 밸브 부품",                amount:    450_000_000, deadline: "2026-05-18", source: "나라장터",      url: "#" },
    { agency: "한국철도공사",         title: "차량 정비용 정밀 부품 연간 공급",          amount:    890_000_000, deadline: "2026-06-05", source: "나라장터",      url: "#" },
    { agency: "한국수력원자력",       title: "발전소 보조설비 부품",                    amount:    760_000_000, deadline: "2026-06-12", source: "나라장터",      url: "#" },
    { agency: "충청북도청",           title: "산업 시설 부품 정비 용역",                 amount:    140_000_000, deadline: "2026-05-10", source: "나라장터(지방)", url: "#" },
    { agency: "조달청",               title: "공공기관 표준 부품 단가계약",              amount:  2_400_000_000, deadline: "2026-06-25", source: "조달청",        url: "#" },
    { agency: "한국공항공사",         title: "공항 설비용 정밀 부품",                    amount:    380_000_000, deadline: "2026-06-08", source: "나라장터",      url: "#" },
    { agency: "한국교통안전공단",     title: "차량 검사장비 부품",                       amount:    220_000_000, deadline: "2026-05-22", source: "나라장터",      url: "#" },
    { agency: "국방기술품질원",       title: "방산 부품 정밀시험 가공",                  amount:    680_000_000, deadline: "2026-06-15", source: "국방조달",      url: "#" }
  ];

  // ---------------------------------------------------------------------------
  // 명함
  // ---------------------------------------------------------------------------
  const cards = [
    { name: "박지성", company: "현대모비스",       title: "구매 부장",     phone: "010-1234-5678", email: "park.js@mobis.example",   lastContact: "2026-04-15", relationship: 85, tags: ["주요거래처", "결재권"] },
    { name: "이민호", company: "삼성전자",          title: "구매팀 차장",   phone: "010-2345-6789", email: "lee.mh@samsung.example", lastContact: "2026-03-22", relationship: 72, tags: ["주요거래처"] },
    { name: "김태훈", company: "LG이노텍",          title: "협력업체 PM",   phone: "010-3456-7890", email: "kim.th@lginnotek.example", lastContact: "2026-04-08", relationship: 80, tags: ["주요거래처", "기술협의"] },
    { name: "정세영", company: "현대위아",          title: "구매팀 과장",   phone: "010-4567-8901", email: "jung.sy@hyundai-wia.example", lastContact: "2026-03-30", relationship: 68, tags: ["안정거래"] },
    { name: "최영준", company: "LS Mtron",          title: "구매부 팀장",   phone: "010-5678-9012", email: "choi.yj@lsmtron.example", lastContact: "2026-02-12", relationship: 45, tags: ["관찰필요", "적자"] },
    { name: "한지민", company: "한온시스템",        title: "구매팀 차장",   phone: "010-6789-0123", email: "han.jm@hanon.example",   lastContact: "2026-04-20", relationship: 78, tags: ["안정거래"] },
    { name: "윤상현", company: "만도",              title: "구매 부장",     phone: "010-7890-1234", email: "yoon.sh@mando.example",  lastContact: "2026-04-12", relationship: 75, tags: ["주요거래처"] },
    { name: "강혜진", company: "SK하이닉스",        title: "협력사 매니저", phone: "010-8901-2345", email: "kang.hj@skhynix.example", lastContact: "2026-04-05", relationship: 70, tags: ["신규개척", "반도체"] },
    { name: "임재현", company: "두산공작기계",      title: "구매팀 차장",   phone: "010-9012-3456", email: "lim.jh@doosan.example",  lastContact: "2025-12-15", relationship: 38, tags: ["미접촉주의", "관찰"] },
    { name: "조민서", company: "포스코퓨처엠",      title: "구매팀 부장",   phone: "010-0123-4567", email: "cho.ms@posco.example",   lastContact: "2025-10-22", relationship: 30, tags: ["미접촉주의", "신규"] },
    { name: "송지호", company: "현대모비스",        title: "기술기획 차장", phone: "010-1111-2222", email: "song.jh@mobis.example",  lastContact: "2026-04-25", relationship: 82, tags: ["주요거래처", "기술"] },
    { name: "오미연", company: "삼성SDI",           title: "구매팀 과장",   phone: "010-2222-3333", email: "oh.my@samsdi.example",   lastContact: "2026-04-02", relationship: 65, tags: ["배터리", "신규개척"] },
    { name: "황민우", company: "한국타이어",        title: "구매 부장",     phone: "010-3333-4444", email: "hwang.mw@hk.example",    lastContact: "2026-03-15", relationship: 60, tags: ["안정거래"] },
    { name: "신아라", company: "현대건설기계",      title: "구매팀 차장",   phone: "010-4444-5555", email: "shin.ar@hd-ce.example",  lastContact: "2025-11-08", relationship: 32, tags: ["미접촉주의"] },
    { name: "권혁수", company: "한화에어로스페이스", title: "구매 부장",     phone: "010-5555-6666", email: "kwon.hs@hanwha.example", lastContact: "2026-04-18", relationship: 73, tags: ["방산", "주요"] },
    { name: "배수지", company: "기아",              title: "구매팀 과장",   phone: "010-6666-7777", email: "bae.sj@kia.example",     lastContact: "2026-03-28", relationship: 67, tags: ["주요거래처"] },
    { name: "노재원", company: "현대제철",          title: "원자재 팀장",   phone: "010-7777-8888", email: "noh.jw@hd-steel.example", lastContact: "2026-04-22", relationship: 76, tags: ["원자재", "공급사"] },
    { name: "유진영", company: "LG디스플레이",      title: "구매 차장",     phone: "010-8888-9999", email: "yoo.jy@lgd.example",     lastContact: "2025-09-10", relationship: 28, tags: ["미접촉주의", "디스플레이"] },
    { name: "안성호", company: "현대모비스 R&D",    title: "선행개발 책임", phone: "010-9999-0000", email: "ahn.sh@mobis.example",   lastContact: "2026-04-29", relationship: 88, tags: ["주요거래처", "기술협의", "결재권"] },
    { name: "장미경", company: "포스코",            title: "원자재 부장",   phone: "010-1010-2020", email: "jang.mk@posco.example",  lastContact: "2026-03-08", relationship: 62, tags: ["원자재"] },
    { name: "남궁호", company: "두산에너빌리티",    title: "구매 차장",     phone: "010-2020-3030", email: "ng.h@doosan.example",    lastContact: "2026-04-17", relationship: 70, tags: ["에너지", "신규"] },
    { name: "서지윤", company: "한국전력기술",      title: "구매 과장",     phone: "010-3030-4040", email: "seo.jy@kepco-e.example", lastContact: "2026-02-25", relationship: 50, tags: ["공공기관"] },
    { name: "문상민", company: "LIG넥스원",         title: "구매 부장",     phone: "010-4040-5050", email: "moon.sm@lig.example",    lastContact: "2026-04-10", relationship: 72, tags: ["방산"] },
    { name: "구지원", company: "삼성전기",          title: "협력사 매니저", phone: "010-5050-6060", email: "koo.jw@samsung-em.example", lastContact: "2025-08-30", relationship: 25, tags: ["미접촉주의"] },
    { name: "차해린", company: "SK이노베이션",      title: "구매 차장",     phone: "010-6060-7070", email: "cha.hl@sk.example",      lastContact: "2026-03-18", relationship: 58, tags: ["배터리", "신규"] }
  ];

  // ---------------------------------------------------------------------------
  // 명함 이벤트 (생일·승진)
  // ---------------------------------------------------------------------------
  const cardEvents = [
    { date: "2026-05-08", name: "한지민 차장(한온시스템)", type: "생일" },
    { date: "2026-05-15", name: "박지성 부장(현대모비스)", type: "생일" },
    { date: "2026-05-22", name: "최영준 팀장(LS Mtron)",   type: "승진 내정 (부장)" },
    { date: "2026-05-28", name: "안성호 책임(모비스 R&D)", type: "생일" },
    { date: "2026-06-05", name: "윤상현 부장(만도)",        type: "임원 승진" },
    { date: "2026-06-12", name: "강혜진 매니저(SK하이닉스)", type: "생일" },
    { date: "2026-06-20", name: "송지호 차장(현대모비스)", type: "부서이동" },
    { date: "2026-07-03", name: "노재원 팀장(현대제철)",    type: "생일" }
  ];

  // ---------------------------------------------------------------------------
  // 보고서 (사용자 업로드, 초기 빈 배열)
  // ---------------------------------------------------------------------------
  const reports = [];

  // ---------------------------------------------------------------------------
  // 웹/검색 통계
  // ---------------------------------------------------------------------------
  const webStats = {
    naverSearch: {
      brandSearches: 1240,
      monthChange: 12.4,
      mapViews: 580,
      reviewCount: 23,
      recentReviews: [
        { rating: 5, text: "납기 정확하고 품질 우수합니다. 장기 거래 의사 있습니다." },
        { rating: 5, text: "도면 협의가 빠르고 기술 대응이 좋습니다." },
        { rating: 4, text: "단가 경쟁력은 평균 수준이나 안정성이 강점." },
        { rating: 4, text: "신규 모델 시제품 대응이 빨랐습니다." },
        { rating: 5, text: "10년 이상 거래 중. 신뢰할 수 있는 파트너." }
      ]
    },
    blogPosts: [
      { title: "한울정공 신공장 준공 소식 — 오송 제2공장 가동",      date: "2026-04-28", url: "#", views: 1240 },
      { title: "정밀가공 기술 백서 공개 — Tolerance ±2μm 달성",      date: "2026-04-15", url: "#", views:  890 },
      { title: "현대모비스 협력사 공식 인증 획득",                    date: "2026-03-22", url: "#", views: 1580 },
      { title: "충북 우수 중소기업상 수상",                            date: "2026-03-08", url: "#", views:  720 },
      { title: "스마트팩토리 도입 1년 — 수율 99.4% 달성기",            date: "2026-02-12", url: "#", views: 1100 }
    ],
    gaSummary: {
      dailyVisitors: 320,
      conversion: 2.4,
      topKeyword: "정밀부품 청주",
      topReferrer: "naver.com"
    }
  };

  // ---------------------------------------------------------------------------
  // 글로벌 노출
  // ---------------------------------------------------------------------------
  window.IMWON_DEMO = {
    company: company,
    finance: finance,
    sales: sales,
    hr: hr,
    schedule: schedule,
    kpi: kpi,
    market: market,
    news: news,
    policy: policy,
    tenders: tenders,
    cards: cards,
    cardEvents: cardEvents,
    reports: reports,
    webStats: webStats
  };

})();
