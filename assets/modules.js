/* ============================================================================
 * 임원실(Imwon.Sil) — 메뉴 7~12 렌더 모듈
 * 의존: window.IMWON_DEMO (data.js), window.Chart (Chart.js)
 * 빌더 A의 컨테이너: <div id="tab-XXX" class="tab-pane">
 *   - tab-schedule, tab-kpi, tab-market, tab-news, tab-tenders, tab-cards
 * 작성일 기준: 2026-05-03
 * ========================================================================== */

(function () {
  'use strict';

  // ===========================================================================
  // [공통] 헬퍼
  // ===========================================================================
  const TODAY = new Date('2026-05-03');

  /** 한국식 화폐 자동 포맷 — 1,240만원 / 23.5억 / 1.2조 */
  function formatKRW(num) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    const n = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    if (n >= 1e12) return sign + (n / 1e12).toFixed(2) + '조';
    if (n >= 1e8)  return sign + (n / 1e8).toFixed(1) + '억';
    if (n >= 1e4)  return sign + (n / 1e4).toFixed(0) + '만원';
    return sign + n.toLocaleString('ko-KR') + '원';
  }

  /** 천단위 콤마 */
  function nf(num, digits) {
    if (num === null || num === undefined || isNaN(num)) return '-';
    return Number(num).toLocaleString('ko-KR', {
      minimumFractionDigits: digits || 0,
      maximumFractionDigits: digits || 0
    });
  }

  /** D-day 계산: yyyy-mm-dd 또는 yyyy-mm-dd HH:MM */
  function calcDDay(dateStr) {
    if (!dateStr) return null;
    const ds = dateStr.slice(0, 10);
    const target = new Date(ds + 'T00:00:00');
    const today = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
    const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
    return diff;
  }

  /** D-day 색상 클래스 */
  function ddayColor(d) {
    if (d === null || d === undefined) return 'gray';
    if (d < 0) return 'gray';
    if (d <= 7) return 'red';
    if (d <= 30) return 'yellow';
    return 'gray';
  }

  /** D-day 텍스트 */
  function ddayText(d) {
    if (d === null || d === undefined) return '-';
    if (d === 0) return 'D-DAY';
    if (d > 0)   return 'D-' + d;
    return 'D+' + Math.abs(d);
  }

  /** DOM 헬퍼 */
  function el(tag, opts) {
    const e = document.createElement(tag);
    if (!opts) return e;
    if (opts.cls) e.className = opts.cls;
    if (opts.id) e.id = opts.id;
    if (opts.text !== undefined) e.textContent = String(opts.text);
    if (opts.html !== undefined) e.innerHTML = ''; // 사용 금지 가드
    if (opts.style) Object.assign(e.style, opts.style);
    if (opts.attrs) {
      Object.keys(opts.attrs).forEach(function (k) {
        e.setAttribute(k, opts.attrs[k]);
      });
    }
    if (opts.on) {
      Object.keys(opts.on).forEach(function (k) {
        e.addEventListener(k, opts.on[k]);
      });
    }
    return e;
  }

  /** 자식 정리 */
  function clearChildren(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  /** 컨테이너 가져오기 (없으면 fallback 안내 카드) */
  function getContainer(id) {
    let c = document.getElementById(id);
    if (!c) return null;
    clearChildren(c);
    return c;
  }

  /** LocalStorage 헬퍼 */
  const LS = {
    get: function (key, defaultVal) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? defaultVal : JSON.parse(v);
      } catch (_) {
        return defaultVal;
      }
    },
    set: function (key, val) {
      try {
        localStorage.setItem(key, JSON.stringify(val));
      } catch (_) { /* noop */ }
    }
  };

  /** 안전 실행 래퍼 */
  function safeRun(name, fn) {
    try {
      return fn();
    } catch (err) {
      console.error('[IMWON_MODULES.' + name + '] error:', err);
      const id = 'tab-' + name.replace(/^render/, '').toLowerCase();
      const c = document.getElementById(id);
      if (c) {
        clearChildren(c);
        const box = el('div', { cls: 'imwon-error', text: '[' + name + '] 렌더 중 오류: ' + (err && err.message ? err.message : err) });
        c.appendChild(box);
      }
      return null;
    }
  }

  /** 신호등 색상 hex (Chart.js 등) */
  const STATUS_HEX = {
    green: '#22c55e',
    yellow: '#f59e0b',
    red: '#ef4444',
    gray: '#94a3b8'
  };

  /** 섹션 헤더 카드 */
  function sectionHeader(title, subtitle) {
    const wrap = el('div', { cls: 'imwon-section-header' });
    wrap.appendChild(el('h2', { cls: 'imwon-section-title', text: title }));
    if (subtitle) wrap.appendChild(el('p', { cls: 'imwon-section-sub', text: subtitle }));
    return wrap;
  }

  /** 탭 그룹 — 클릭 시 전환 */
  function makeTabs(tabs, container) {
    // tabs: [{key, label, render(panel)}]
    const tabBar = el('div', { cls: 'imwon-tabbar' });
    const panels = el('div', { cls: 'imwon-tab-panels' });

    tabs.forEach(function (t, i) {
      const btn = el('button', {
        cls: 'imwon-tab-btn' + (i === 0 ? ' active' : ''),
        text: t.label,
        attrs: { 'data-key': t.key, 'type': 'button' }
      });
      const panel = el('div', {
        cls: 'imwon-tab-panel' + (i === 0 ? ' active' : ''),
        attrs: { 'data-key': t.key }
      });
      btn.addEventListener('click', function () {
        Array.prototype.forEach.call(tabBar.children, function (b) { b.classList.remove('active'); });
        Array.prototype.forEach.call(panels.children, function (p) { p.classList.remove('active'); });
        btn.classList.add('active');
        panel.classList.add('active');
      });
      tabBar.appendChild(btn);
      panels.appendChild(panel);
      try { t.render(panel); } catch (e) {
        console.error('Tab render error:', e);
        panel.appendChild(el('div', { cls: 'imwon-error', text: '탭 로드 실패' }));
      }
    });

    container.appendChild(tabBar);
    container.appendChild(panels);
  }

  // ===========================================================================
  // 7. 일정 (#tab-schedule)
  // ===========================================================================
  function renderSchedule() {
    const c = getContainer('tab-schedule');
    if (!c) return;

    const data = (window.IMWON_DEMO && window.IMWON_DEMO.schedule) || {};
    const legal = data.legal || [];
    const birthdays = data.birthdays || [];
    const deadlines = data.deadlines || [];
    const meetings = data.meetings || [];

    c.appendChild(sectionHeader('일정', '법정신고·임원경조사·결재마감·외부미팅 통합 관리'));

    // 상단 요약 카드 — 이번 주 마감 N건
    const allEvents = []
      .concat(legal.map(function (x) { return { date: x.date, label: x.type, kind: '법정' }; }))
      .concat(birthdays.map(function (x) { return { date: x.date, label: x.name + ' 생일', kind: '경조사' }; }))
      .concat(deadlines.map(function (x) { return { date: x.date, label: x.content, kind: '결재' }; }))
      .concat(meetings.map(function (x) { return { date: x.date, label: x.title, kind: '미팅' }; }));

    let weekCount = 0;
    allEvents.forEach(function (e) {
      const d = calcDDay(e.date);
      if (d !== null && d >= 0 && d <= 7) weekCount++;
    });

    const summary = el('div', { cls: 'imwon-card imwon-summary-card' });
    summary.appendChild(el('div', { cls: 'imwon-summary-num', text: weekCount }));
    summary.appendChild(el('div', { cls: 'imwon-summary-label', text: '이번 주 마감 (7일 이내)' }));
    c.appendChild(summary);

    // 본문 레이아웃: 좌(탭) + 우(미니 캘린더)
    const layout = el('div', { cls: 'imwon-grid-2' });
    const left = el('div', { cls: 'imwon-col-main' });
    const right = el('div', { cls: 'imwon-col-side' });
    layout.appendChild(left);
    layout.appendChild(right);
    c.appendChild(layout);

    // 카테고리 탭
    function renderList(panel, items, mapper) {
      if (!items || items.length === 0) {
        panel.appendChild(el('div', { cls: 'imwon-empty', text: '항목 없음' }));
        return;
      }
      const list = el('div', { cls: 'imwon-list' });
      items
        .map(mapper)
        .sort(function (a, b) { return (a.dday === null ? 9999 : a.dday) - (b.dday === null ? 9999 : b.dday); })
        .forEach(function (entry) {
          const card = el('div', { cls: 'imwon-list-item dday-' + ddayColor(entry.dday) });
          const dateBox = el('div', { cls: 'imwon-list-date' });
          dateBox.appendChild(el('div', { cls: 'imwon-list-date-text', text: entry.date }));
          dateBox.appendChild(el('div', { cls: 'imwon-list-dday', text: ddayText(entry.dday) }));
          const body = el('div', { cls: 'imwon-list-body' });
          body.appendChild(el('div', { cls: 'imwon-list-title', text: entry.title }));
          if (entry.sub) body.appendChild(el('div', { cls: 'imwon-list-sub', text: entry.sub }));
          card.appendChild(dateBox);
          card.appendChild(body);
          list.appendChild(card);
        });
      panel.appendChild(list);
    }

    makeTabs([
      {
        key: 'legal', label: '법정신고 (' + legal.length + ')',
        render: function (p) {
          renderList(p, legal, function (x) {
            return { date: x.date, dday: calcDDay(x.date), title: x.type, sub: x.deadline ? '마감 의무' : '' };
          });
        }
      },
      {
        key: 'birthdays', label: '임원 경조사 (' + birthdays.length + ')',
        render: function (p) {
          renderList(p, birthdays, function (x) {
            return { date: x.date, dday: calcDDay(x.date), title: x.name + ' 생일', sub: x.dept };
          });
        }
      },
      {
        key: 'deadlines', label: '결재마감 (' + deadlines.length + ')',
        render: function (p) {
          renderList(p, deadlines, function (x) {
            return { date: x.date, dday: calcDDay(x.date), title: x.content, sub: x.type };
          });
        }
      },
      {
        key: 'meetings', label: '외부미팅 (' + meetings.length + ')',
        render: function (p) {
          renderList(p, meetings, function (x) {
            return { date: x.date, dday: calcDDay(x.date.slice(0, 10)), title: x.title, sub: x.location };
          });
        }
      }
    ], left);

    // 우측 미니 캘린더
    right.appendChild(buildMiniCalendar(allEvents));
  }

  function buildMiniCalendar(events) {
    const wrap = el('div', { cls: 'imwon-card imwon-mini-cal' });
    const y = TODAY.getFullYear(), m = TODAY.getMonth();
    const monthLabel = (y) + '년 ' + (m + 1) + '월';
    wrap.appendChild(el('h4', { cls: 'imwon-mini-cal-title', text: monthLabel }));

    const dotSet = new Set();
    events.forEach(function (e) {
      const d = new Date(e.date.slice(0, 10) + 'T00:00:00');
      if (d.getFullYear() === y && d.getMonth() === m) dotSet.add(d.getDate());
    });

    const grid = el('div', { cls: 'imwon-cal-grid' });
    ['일', '월', '화', '수', '목', '금', '토'].forEach(function (w) {
      grid.appendChild(el('div', { cls: 'imwon-cal-h', text: w }));
    });
    const first = new Date(y, m, 1).getDay();
    const last = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < first; i++) grid.appendChild(el('div', { cls: 'imwon-cal-c blank' }));
    for (let day = 1; day <= last; day++) {
      const cell = el('div', { cls: 'imwon-cal-c' + (day === TODAY.getDate() ? ' today' : '') });
      cell.appendChild(el('span', { cls: 'imwon-cal-num', text: day }));
      if (dotSet.has(day)) cell.appendChild(el('span', { cls: 'imwon-cal-dot' }));
      grid.appendChild(cell);
    }
    wrap.appendChild(grid);
    return wrap;
  }

  // ===========================================================================
  // 8. KPI 관리 (#tab-kpi)
  // ===========================================================================
  function renderKPI() {
    const c = getContainer('tab-kpi');
    if (!c) return;

    const data = (window.IMWON_DEMO && window.IMWON_DEMO.kpi) || {};

    c.appendChild(sectionHeader('KPI 관리', '회사·부서·개인 단위 핵심성과지표'));

    // 신규 등록 버튼
    const toolbar = el('div', { cls: 'imwon-toolbar' });
    const addBtn = el('button', { cls: 'imwon-btn-primary', text: '+ 신규 KPI 등록', attrs: { type: 'button' } });
    addBtn.addEventListener('click', openKpiModal);
    toolbar.appendChild(addBtn);
    const userKpiCount = (LS.get('imwon.userKpis', []) || []).length;
    if (userKpiCount > 0) {
      toolbar.appendChild(el('span', { cls: 'imwon-toolbar-note', text: '사용자 등록 KPI ' + userKpiCount + '건' }));
    }
    c.appendChild(toolbar);

    function renderKpiCards(panel, kpis) {
      const grid = el('div', { cls: 'imwon-kpi-grid' });
      (kpis || []).forEach(function (k) {
        const card = el('div', { cls: 'imwon-kpi-card status-' + (k.status || 'gray') });
        const dot = el('span', { cls: 'imwon-kpi-dot status-' + (k.status || 'gray') });
        card.appendChild(dot);
        card.appendChild(el('div', { cls: 'imwon-kpi-name', text: k.name }));
        const valLine = el('div', { cls: 'imwon-kpi-val' });
        const cur = k.unit === '원' ? formatKRW(k.current) : (nf(k.current, k.unit === '%' ? 1 : 0) + (k.unit && k.unit !== '원' ? k.unit : ''));
        const tgt = k.unit === '원' ? formatKRW(k.target) : (nf(k.target, k.unit === '%' ? 1 : 0) + (k.unit && k.unit !== '원' ? k.unit : ''));
        valLine.appendChild(el('span', { cls: 'imwon-kpi-current', text: cur }));
        valLine.appendChild(el('span', { cls: 'imwon-kpi-target', text: ' / 목표 ' + tgt }));
        card.appendChild(valLine);
        // 진행률 바
        const pct = (k.target && k.target !== 0) ? Math.min(150, Math.round((k.current / k.target) * 100)) : 0;
        const bar = el('div', { cls: 'imwon-kpi-bar' });
        const fill = el('div', { cls: 'imwon-kpi-bar-fill status-' + (k.status || 'gray'), style: { width: Math.min(100, pct) + '%' } });
        bar.appendChild(fill);
        card.appendChild(bar);
        card.appendChild(el('div', { cls: 'imwon-kpi-pct', text: pct + '% 달성' }));
        grid.appendChild(card);
      });
      panel.appendChild(grid);
    }

    makeTabs([
      {
        key: 'company', label: '회사',
        render: function (p) {
          const userKpis = LS.get('imwon.userKpis', []);
          renderKpiCards(p, (data.company || []).concat(userKpis));
        }
      },
      {
        key: 'departments', label: '부서',
        render: function (p) {
          const labels = { sales: '영업', production: '생산', hr: '인사' };
          Object.keys(data.departments || {}).forEach(function (key) {
            p.appendChild(el('h3', { cls: 'imwon-kpi-dept-title', text: labels[key] || key }));
            renderKpiCards(p, data.departments[key]);
          });
        }
      },
      {
        key: 'individuals', label: '개인',
        render: function (p) {
          (data.individuals || []).forEach(function (ind) {
            const block = el('div', { cls: 'imwon-kpi-individual' });
            block.appendChild(el('h3', { cls: 'imwon-kpi-dept-title', text: ind.name + ' (' + ind.dept + ')' }));
            const subPanel = el('div');
            renderKpiCards(subPanel, ind.kpis);
            block.appendChild(subPanel);
            p.appendChild(block);
          });
        }
      }
    ], c);
  }

  function openKpiModal() {
    const overlay = el('div', { cls: 'imwon-modal-overlay' });
    const box = el('div', { cls: 'imwon-modal' });
    box.appendChild(el('h3', { text: '신규 KPI 등록' }));

    const fields = [
      { key: 'name', label: 'KPI 이름', type: 'text' },
      { key: 'current', label: '현재값', type: 'number' },
      { key: 'target', label: '목표값', type: 'number' },
      { key: 'unit', label: '단위 (원/% /일/점/건)', type: 'text' },
      { key: 'status', label: '상태 (green/yellow/red)', type: 'text' }
    ];
    const inputs = {};
    fields.forEach(function (f) {
      const row = el('div', { cls: 'imwon-form-row' });
      row.appendChild(el('label', { text: f.label }));
      const input = el('input', { attrs: { type: f.type } });
      inputs[f.key] = input;
      row.appendChild(input);
      box.appendChild(row);
    });

    const btnRow = el('div', { cls: 'imwon-form-actions' });
    const cancel = el('button', { text: '취소', cls: 'imwon-btn', attrs: { type: 'button' } });
    const save = el('button', { text: '저장', cls: 'imwon-btn-primary', attrs: { type: 'button' } });
    cancel.addEventListener('click', function () { document.body.removeChild(overlay); });
    save.addEventListener('click', function () {
      const v = {
        name: inputs.name.value.trim() || '신규 KPI',
        current: parseFloat(inputs.current.value) || 0,
        target: parseFloat(inputs.target.value) || 100,
        unit: inputs.unit.value.trim() || '%',
        status: ['green', 'yellow', 'red'].indexOf(inputs.status.value.trim()) >= 0 ? inputs.status.value.trim() : 'yellow'
      };
      const arr = LS.get('imwon.userKpis', []);
      arr.push(v);
      LS.set('imwon.userKpis', arr);
      document.body.removeChild(overlay);
      renderKPI();
    });
    btnRow.appendChild(cancel);
    btnRow.appendChild(save);
    box.appendChild(btnRow);

    overlay.appendChild(box);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) document.body.removeChild(overlay);
    });
    document.body.appendChild(overlay);
  }

  // ===========================================================================
  // 9. 시장 (#tab-market)
  // ===========================================================================
  function renderMarket() {
    const c = getContainer('tab-market');
    if (!c) return;

    const data = (window.IMWON_DEMO && window.IMWON_DEMO.market) || {};
    c.appendChild(sectionHeader('시장 동향', '환율·지수·원자재·경기지표'));

    function changeBadge(change) {
      const up = change >= 0;
      const arrow = up ? '▲' : '▼';
      const cls = 'imwon-change ' + (up ? 'up' : 'down');
      return el('span', { cls: cls, text: arrow + ' ' + Math.abs(change).toFixed(2) + '%' });
    }

    function buildSection(title, items, valueFmt) {
      const sec = el('div', { cls: 'imwon-card imwon-market-section' });
      sec.appendChild(el('h3', { cls: 'imwon-market-title', text: title }));
      const grid = el('div', { cls: 'imwon-market-grid' });
      items.forEach(function (it) {
        const cell = el('div', { cls: 'imwon-market-cell' });
        cell.appendChild(el('div', { cls: 'imwon-market-name', text: it.name || it.pair }));
        cell.appendChild(el('div', { cls: 'imwon-market-value', text: valueFmt(it) }));
        if (typeof it.change === 'number') cell.appendChild(changeBadge(it.change));
        if (it.note) cell.appendChild(el('div', { cls: 'imwon-market-note', text: it.note }));
        grid.appendChild(cell);
      });
      sec.appendChild(grid);
      return sec;
    }

    const layout = el('div', { cls: 'imwon-grid-2x2' });
    layout.appendChild(buildSection('환율', data.forex || [], function (it) {
      return nf(it.current, 2) + ' 원';
    }));
    layout.appendChild(buildSection('주요 지수', data.indices || [], function (it) {
      return nf(it.current, 1);
    }));
    layout.appendChild(buildSection('원자재', data.commodities || [], function (it) {
      return nf(it.current, 0) + ' ' + (it.unit || '');
    }));
    layout.appendChild(buildSection('경기지표', data.economy || [], function (it) {
      return nf(it.current, 1) + ' ' + (it.unit || '');
    }));
    c.appendChild(layout);

    // 건설자재 별도 박스
    if (data.construction) {
      c.appendChild(buildSection('건설자재 (시멘트·철근 등)', data.construction, function (it) {
        return nf(it.current, 0) + ' ' + (it.unit || '');
      }));
    }

    // 푸터
    const footer = el('div', { cls: 'imwon-footer-note', text: '데이터 출처: 한국은행 ECOS · 한국거래소 · 산업통상자원부 (예시 데이터)' });
    c.appendChild(footer);
  }

  // ===========================================================================
  // 10. 뉴스/정책 (#tab-news)
  // ===========================================================================
  function renderNews() {
    const c = getContainer('tab-news');
    if (!c) return;

    const news = (window.IMWON_DEMO && window.IMWON_DEMO.news) || [];
    const policy = (window.IMWON_DEMO && window.IMWON_DEMO.policy) || [];

    c.appendChild(sectionHeader('뉴스 / 정책', '업계 뉴스·정책 동향 모니터링'));

    // 검색·필터 툴바
    const tools = el('div', { cls: 'imwon-toolbar' });
    const searchInput = el('input', { cls: 'imwon-search', attrs: { type: 'search', placeholder: '키워드 검색...' } });
    tools.appendChild(searchInput);

    const cats = ['전체', '주요고객', '산업', '정책', '환율', '금리', '지역'];
    let activeCat = '전체';
    const catWrap = el('div', { cls: 'imwon-chip-row' });
    cats.forEach(function (cat) {
      const btn = el('button', {
        cls: 'imwon-chip' + (cat === '전체' ? ' active' : ''),
        text: cat, attrs: { type: 'button' }
      });
      btn.addEventListener('click', function () {
        activeCat = cat;
        Array.prototype.forEach.call(catWrap.children, function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        applyFilter();
      });
      catWrap.appendChild(btn);
    });
    tools.appendChild(catWrap);
    c.appendChild(tools);

    const layout = el('div', { cls: 'imwon-grid-2' });
    const newsCol = el('div', { cls: 'imwon-col-main' });
    const policyCol = el('div', { cls: 'imwon-col-side' });
    newsCol.appendChild(el('h3', { cls: 'imwon-col-title', text: '업계 뉴스 (' + news.length + ')' }));
    policyCol.appendChild(el('h3', { cls: 'imwon-col-title', text: '정책 동향 (' + policy.length + ')' }));
    const newsList = el('div', { cls: 'imwon-news-list' });
    const policyList = el('div', { cls: 'imwon-news-list' });
    newsCol.appendChild(newsList);
    policyCol.appendChild(policyList);
    layout.appendChild(newsCol);
    layout.appendChild(policyCol);
    c.appendChild(layout);

    function newsCard(item, isPolicy) {
      const card = el('article', { cls: 'imwon-news-card' });
      const meta = el('div', { cls: 'imwon-news-meta' });
      meta.appendChild(el('span', { cls: 'imwon-news-source', text: isPolicy ? item.agency : item.source }));
      meta.appendChild(el('span', { cls: 'imwon-news-date', text: item.date }));
      if (!isPolicy && item.category) meta.appendChild(el('span', { cls: 'imwon-news-cat', text: item.category }));
      card.appendChild(meta);
      const titleEl = el('a', { cls: 'imwon-news-title', text: item.title, attrs: { href: item.url || '#', target: '_blank', rel: 'noopener' } });
      card.appendChild(titleEl);
      card.appendChild(el('p', { cls: 'imwon-news-summary', text: item.summary || '' }));
      return card;
    }

    function applyFilter() {
      const q = searchInput.value.trim().toLowerCase();
      clearChildren(newsList);
      clearChildren(policyList);

      let nShown = 0, pShown = 0;
      news.forEach(function (n) {
        if (activeCat !== '전체' && n.category !== activeCat) return;
        if (q && !((n.title + ' ' + n.summary).toLowerCase().includes(q))) return;
        newsList.appendChild(newsCard(n, false));
        nShown++;
      });
      policy.forEach(function (p) {
        if (activeCat !== '전체' && activeCat !== '정책') return;
        if (q && !((p.title + ' ' + p.summary).toLowerCase().includes(q))) return;
        policyList.appendChild(newsCard(p, true));
        pShown++;
      });
      if (nShown === 0) newsList.appendChild(el('div', { cls: 'imwon-empty', text: '해당 결과 없음' }));
      if (pShown === 0) policyList.appendChild(el('div', { cls: 'imwon-empty', text: '해당 결과 없음' }));
    }

    searchInput.addEventListener('input', applyFilter);
    applyFilter();

    c.appendChild(el('div', { cls: 'imwon-footer-note', text: '출처: Google News (한국어) · 대한민국 정책브리핑 · 산업부·기재부 보도자료 (예시 데이터 — 실연동은 별도 프록시 인프라 필요)' }));
  }

  // ===========================================================================
  // 11. 입찰 (#tab-tenders)
  // ===========================================================================
  function renderTenders() {
    const c = getContainer('tab-tenders');
    if (!c) return;

    const tenders = (window.IMWON_DEMO && window.IMWON_DEMO.tenders) || [];
    c.appendChild(sectionHeader('입찰 정보', '나라장터·조달청·국방조달 통합 모니터링'));

    // 툴바
    const tools = el('div', { cls: 'imwon-toolbar' });
    const searchInput = el('input', { cls: 'imwon-search', attrs: { type: 'search', placeholder: '발주처·제목 검색...' } });
    const minInput = el('input', { cls: 'imwon-num', attrs: { type: 'number', placeholder: '최소 금액(억)' } });
    const maxInput = el('input', { cls: 'imwon-num', attrs: { type: 'number', placeholder: '최대 금액(억)' } });
    tools.appendChild(searchInput);
    tools.appendChild(minInput);
    tools.appendChild(maxInput);
    c.appendChild(tools);

    const list = el('div', { cls: 'imwon-tender-list' });
    c.appendChild(list);

    function applyFilter() {
      clearChildren(list);
      const q = searchInput.value.trim().toLowerCase();
      const minV = parseFloat(minInput.value) * 1e8;
      const maxV = parseFloat(maxInput.value) * 1e8;
      const stars = LS.get('imwon.tenderStars', {}) || {};

      const sorted = tenders.slice().sort(function (a, b) {
        return calcDDay(a.deadline) - calcDDay(b.deadline);
      });

      let shown = 0;
      sorted.forEach(function (t, idx) {
        if (q && !((t.agency + ' ' + t.title).toLowerCase().includes(q))) return;
        if (!isNaN(minV) && t.amount < minV) return;
        if (!isNaN(maxV) && t.amount > maxV) return;

        const dday = calcDDay(t.deadline);
        const card = el('div', { cls: 'imwon-tender-card dday-' + ddayColor(dday) });

        const id = t.agency + '|' + t.title;
        const isStar = !!stars[id];
        const star = el('button', {
          cls: 'imwon-star' + (isStar ? ' on' : ''),
          text: isStar ? '★' : '☆',
          attrs: { type: 'button', 'aria-label': '관심 표시' }
        });
        star.addEventListener('click', function () {
          const cur = LS.get('imwon.tenderStars', {}) || {};
          if (cur[id]) delete cur[id]; else cur[id] = true;
          LS.set('imwon.tenderStars', cur);
          applyFilter();
        });
        card.appendChild(star);

        const body = el('div', { cls: 'imwon-tender-body' });
        body.appendChild(el('div', { cls: 'imwon-tender-agency', text: t.agency }));
        body.appendChild(el('div', { cls: 'imwon-tender-title', text: t.title }));
        const meta = el('div', { cls: 'imwon-tender-meta' });
        meta.appendChild(el('span', { cls: 'imwon-tender-amount', text: '예가 ' + formatKRW(t.amount) }));
        meta.appendChild(el('span', { cls: 'imwon-tender-source', text: t.source }));
        meta.appendChild(el('span', { cls: 'imwon-tender-deadline', text: '마감 ' + t.deadline }));
        body.appendChild(meta);
        card.appendChild(body);

        const ddayBox = el('div', { cls: 'imwon-tender-dday dday-' + ddayColor(dday) });
        ddayBox.textContent = ddayText(dday);
        card.appendChild(ddayBox);

        list.appendChild(card);
        shown++;
      });

      if (shown === 0) list.appendChild(el('div', { cls: 'imwon-empty', text: '조건에 맞는 입찰 없음' }));
    }

    searchInput.addEventListener('input', applyFilter);
    minInput.addEventListener('input', applyFilter);
    maxInput.addEventListener('input', applyFilter);
    applyFilter();

    c.appendChild(el('div', { cls: 'imwon-footer-note', text: '출처: 나라장터 G2B · 조달청 · 국방전자조달 · 지방자치단체 입찰공고 (예시 데이터)' }));
  }

  // ===========================================================================
  // 12. 명함 (#tab-cards)
  // ===========================================================================
  let _selectedCardIdx = 0;

  function renderCards() {
    const c = getContainer('tab-cards');
    if (!c) return;

    const cards = ((window.IMWON_DEMO && window.IMWON_DEMO.cards) || []).slice();
    const cardEvents = (window.IMWON_DEMO && window.IMWON_DEMO.cardEvents) || [];
    // 사용자 OCR 추가 명함
    const extraCards = LS.get('imwon.userCards', []) || [];
    const allCards = cards.concat(extraCards);

    c.appendChild(sectionHeader('명함', '인맥 관리·관계 강도 모니터링'));

    // 툴바
    const tools = el('div', { cls: 'imwon-toolbar' });
    const searchInput = el('input', { cls: 'imwon-search', attrs: { type: 'search', placeholder: '이름·회사·태그 검색...' } });
    const ocrBtn = el('button', { cls: 'imwon-btn-primary', text: '사진 업로드 OCR', attrs: { type: 'button' } });
    const fileInput = el('input', { attrs: { type: 'file', accept: 'image/*' }, style: { display: 'none' } });
    ocrBtn.addEventListener('click', function () { fileInput.click(); });
    fileInput.addEventListener('change', function () {
      if (fileInput.files && fileInput.files.length > 0) startFakeOCR(fileInput.files[0]);
    });
    tools.appendChild(searchInput);
    tools.appendChild(ocrBtn);
    tools.appendChild(fileInput);
    c.appendChild(tools);

    // 진행바 컨테이너
    const progressWrap = el('div', { cls: 'imwon-progress-wrap', style: { display: 'none' } });
    const progressBar = el('div', { cls: 'imwon-progress-bar' });
    const progressFill = el('div', { cls: 'imwon-progress-fill' });
    progressBar.appendChild(progressFill);
    const progressText = el('div', { cls: 'imwon-progress-text', text: 'OCR 처리 대기...' });
    progressWrap.appendChild(progressText);
    progressWrap.appendChild(progressBar);
    c.appendChild(progressWrap);

    function startFakeOCR(file) {
      progressWrap.style.display = 'block';
      progressFill.style.width = '0%';
      progressText.textContent = 'OCR 처리 중... ' + file.name;
      let pct = 0;
      const timer = setInterval(function () {
        pct += 10 + Math.floor(Math.random() * 15);
        if (pct >= 100) {
          pct = 100;
          progressFill.style.width = '100%';
          progressText.textContent = 'OCR 완료 — 결과 추출';
          clearInterval(timer);
          setTimeout(function () {
            const ocrResult = {
              name: '신규' + Math.floor(Math.random() * 1000),
              company: '신규 거래처',
              title: '담당자',
              phone: '010-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
              email: 'new@example.com',
              lastContact: TODAY.toISOString().slice(0, 10),
              relationship: 50,
              tags: ['OCR자동등록']
            };
            const arr = LS.get('imwon.userCards', []) || [];
            arr.push(ocrResult);
            LS.set('imwon.userCards', arr);
            progressWrap.style.display = 'none';
            renderCards();
          }, 600);
        } else {
          progressFill.style.width = pct + '%';
          progressText.textContent = 'OCR 처리 중... ' + pct + '%';
        }
      }, 250);
    }

    // 본문: 좌(리스트) + 우(상세)
    const layout = el('div', { cls: 'imwon-grid-2' });
    const left = el('div', { cls: 'imwon-col-main imwon-card-list-col' });
    const right = el('div', { cls: 'imwon-col-side imwon-card-detail-col' });
    layout.appendChild(left);
    layout.appendChild(right);
    c.appendChild(layout);

    function renderList() {
      clearChildren(left);
      const q = searchInput.value.trim().toLowerCase();
      let visibleCount = 0;
      allCards.forEach(function (card, idx) {
        const hay = (card.name + ' ' + card.company + ' ' + card.title + ' ' + (card.tags || []).join(' ')).toLowerCase();
        if (q && !hay.includes(q)) return;
        const item = el('div', { cls: 'imwon-card-item' + (idx === _selectedCardIdx ? ' active' : '') });
        const dInactive = calcDDay(card.lastContact);
        const stale = dInactive !== null && dInactive < -180;
        item.appendChild(el('div', { cls: 'imwon-card-name', text: card.name + (stale ? '  ⚠' : '') }));
        item.appendChild(el('div', { cls: 'imwon-card-company', text: card.company + ' · ' + card.title }));
        // 관계 강도 막대
        const bar = el('div', { cls: 'imwon-card-relation-bar' });
        const fill = el('div', {
          cls: 'imwon-card-relation-fill',
          style: { width: (card.relationship || 0) + '%' }
        });
        bar.appendChild(fill);
        item.appendChild(bar);
        item.appendChild(el('div', { cls: 'imwon-card-relation-pct', text: '관계 ' + (card.relationship || 0) + '점' }));
        if (stale) item.appendChild(el('div', { cls: 'imwon-card-stale', text: '6개월 이상 미접촉' }));
        item.addEventListener('click', function () {
          _selectedCardIdx = idx;
          renderList();
          renderDetail();
        });
        left.appendChild(item);
        visibleCount++;
      });
      if (visibleCount === 0) left.appendChild(el('div', { cls: 'imwon-empty', text: '검색 결과 없음' }));
    }

    function renderDetail() {
      clearChildren(right);
      const card = allCards[_selectedCardIdx];
      if (!card) {
        right.appendChild(el('div', { cls: 'imwon-empty', text: '명함을 선택해 주세요' }));
        return;
      }
      const detail = el('div', { cls: 'imwon-card imwon-card-detail' });
      detail.appendChild(el('h3', { cls: 'imwon-card-detail-name', text: card.name }));
      detail.appendChild(el('div', { cls: 'imwon-card-detail-row', text: card.company + ' · ' + card.title }));
      detail.appendChild(el('div', { cls: 'imwon-card-detail-row', text: '전화: ' + (card.phone || '-') }));
      detail.appendChild(el('div', { cls: 'imwon-card-detail-row', text: '이메일: ' + (card.email || '-') }));

      const dInactive = calcDDay(card.lastContact);
      const stale = dInactive !== null && dInactive < -180;
      const lc = el('div', { cls: 'imwon-card-detail-row' + (stale ? ' stale' : ''), text: '마지막 접촉: ' + (card.lastContact || '-') + (stale ? ' (6개월 이상 미접촉)' : '') });
      detail.appendChild(lc);

      // 태그
      const tagWrap = el('div', { cls: 'imwon-tag-row' });
      (card.tags || []).forEach(function (t) {
        tagWrap.appendChild(el('span', { cls: 'imwon-tag', text: t }));
      });
      detail.appendChild(tagWrap);

      // 관계 점수 큰 막대
      const relBar = el('div', { cls: 'imwon-card-relation-bar large' });
      relBar.appendChild(el('div', {
        cls: 'imwon-card-relation-fill',
        style: { width: (card.relationship || 0) + '%' }
      }));
      detail.appendChild(relBar);
      detail.appendChild(el('div', { cls: 'imwon-card-relation-pct', text: '관계 강도 ' + (card.relationship || 0) + ' / 100' }));

      // 메모 영역
      const memoKey = 'imwon.cardMemo.' + card.name + '|' + card.company;
      const memos = LS.get(memoKey, []) || [];
      const memoTitle = el('h4', { cls: 'imwon-memo-title', text: '메모 (' + memos.length + ')' });
      detail.appendChild(memoTitle);
      const memoList = el('div', { cls: 'imwon-memo-list' });
      memos.forEach(function (m) {
        const mEl = el('div', { cls: 'imwon-memo-item' });
        mEl.appendChild(el('div', { cls: 'imwon-memo-date', text: m.date }));
        mEl.appendChild(el('div', { cls: 'imwon-memo-text', text: m.text }));
        memoList.appendChild(mEl);
      });
      detail.appendChild(memoList);

      const memoInputRow = el('div', { cls: 'imwon-form-row' });
      const memoInput = el('input', { attrs: { type: 'text', placeholder: '메모 내용...' } });
      const memoBtn = el('button', { cls: 'imwon-btn-primary', text: '메모 추가', attrs: { type: 'button' } });
      memoBtn.addEventListener('click', function () {
        const text = memoInput.value.trim();
        if (!text) return;
        memos.push({ date: TODAY.toISOString().slice(0, 10), text: text });
        LS.set(memoKey, memos);
        memoInput.value = '';
        renderDetail();
      });
      memoInputRow.appendChild(memoInput);
      memoInputRow.appendChild(memoBtn);
      detail.appendChild(memoInputRow);

      right.appendChild(detail);

      // 다가오는 이벤트 박스
      const eventsBox = el('div', { cls: 'imwon-card imwon-card-events' });
      eventsBox.appendChild(el('h4', { text: '다가오는 명함 이벤트' }));
      const evList = el('div', { cls: 'imwon-event-list' });
      cardEvents
        .map(function (e) { return Object.assign({}, e, { dday: calcDDay(e.date) }); })
        .filter(function (e) { return e.dday >= 0 && e.dday <= 60; })
        .sort(function (a, b) { return a.dday - b.dday; })
        .forEach(function (e) {
          const row = el('div', { cls: 'imwon-event-row dday-' + ddayColor(e.dday) });
          row.appendChild(el('span', { cls: 'imwon-event-dday', text: ddayText(e.dday) }));
          row.appendChild(el('span', { cls: 'imwon-event-date', text: e.date }));
          row.appendChild(el('span', { cls: 'imwon-event-name', text: e.name }));
          row.appendChild(el('span', { cls: 'imwon-event-type', text: e.type }));
          evList.appendChild(row);
        });
      if (evList.children.length === 0) evList.appendChild(el('div', { cls: 'imwon-empty', text: '예정된 이벤트 없음' }));
      eventsBox.appendChild(evList);
      right.appendChild(eventsBox);
    }

    searchInput.addEventListener('input', renderList);
    renderList();
    renderDetail();
  }

  // ===========================================================================
  // 글로벌 노출
  // ===========================================================================
  window.IMWON_MODULES = {
    formatKRW: formatKRW,
    calcDDay: calcDDay,
    renderSchedule: function () { return safeRun('renderSchedule', renderSchedule); },
    renderKPI:      function () { return safeRun('renderKPI', renderKPI); },
    renderMarket:   function () { return safeRun('renderMarket', renderMarket); },
    renderNews:     function () { return safeRun('renderNews', renderNews); },
    renderTenders:  function () { return safeRun('renderTenders', renderTenders); },
    renderCards:    function () { return safeRun('renderCards', renderCards); }
  };

})();
