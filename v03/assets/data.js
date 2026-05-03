/* ============================================================================
 * 임원실(Imwon.Sil) — 데이터 스켈레톤 (빈 상태)
 *
 * 사용자가 ⚙ 설정 또는 ✏️ 회사·임원 정보 편집에서 입력한 값,
 * 보고서 메뉴에 업로드한 파일에서 추출되는 본문 — 그 외에는 모두 공란입니다.
 *
 * 기본적으로 어떤 가상 회사 데이터도 표시하지 않습니다.
 * ========================================================================== */

(function () {
  'use strict';

  window.IMWON_DEMO = {
    company: {
      name: '',
      nameEn: '',
      industry: '',
      ceo: '',
      location: '',
      employees: 0,
      established: '',
      capital: 0,
      bizNo: ''
    },

    finance: {
      kpis: {},      // {revenue, operatingProfit, cashBalance, creditLine, accountsReceivable}
      monthly: [],   // [{month, revenue, operatingProfit, cashBalance}, ...]
      daily: []      // [{date, cashBalance, dueNotes}, ...]
    },

    sales: {
      pipeline: [],     // [{stage, count, amount}, ...]
      customers: [],    // [{name, ytdRevenue, ytdMargin, status}, ...]
      salespeople: []   // [{name, dept, achievement, target}, ...]
    },

    hr: {
      summary: {},        // {totalEmployees, turnoverRate, leaveUsage, pendingApprovals}
      compensation: [],   // [{month, payroll, benefits, overtime}, ...]
      flightRisk: [],     // [{name, dept, riskScore, signals}, ...]
      timeline: []        // [{date, type, content}, ...]
    },

    schedule: {
      legal: [],       // [{date, type, deadline}, ...]
      birthdays: [],   // [{date, name, dept}, ...]
      deadlines: [],   // [{date, type, content}, ...]
      meetings: []     // [{date, title, location}, ...]
    },

    kpi: {
      company: [],         // [{name, target, current, status, unit}, ...]
      departments: {},     // {sales:[], production:[], hr:[]}
      individuals: [
        { name: '', dept: '', kpis: [] },
        { name: '', dept: '', kpis: [] },
        { name: '', dept: '', kpis: [] },
        { name: '', dept: '', kpis: [] },
        { name: '', dept: '', kpis: [] },
        { name: '', dept: '', kpis: [] }
      ]
    },

    market: {
      forex: [],         // [{pair, current, prev, change}, ...]
      indices: [],       // [{name, current, prev, change}, ...]
      commodities: [],   // [{name, current, unit, change}, ...]
      construction: [],
      economy: []
    },

    news: [],
    policy: [],
    tenders: [],
    cards: [],
    cardEvents: [],
    reports: [],
    webStats: {
      naverSearch: {},
      blogPosts: [],
      gaSummary: {}
    }
  };

})();
