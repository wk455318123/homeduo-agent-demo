import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileCheck2,
  Home,
  Landmark,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircleMore,
  Mic,
  MoreHorizontal,
  Navigation,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrainFront,
  TrendingDown,
  WalletCards,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./styles.css";

const BLUE = "#1677ff";
const LIGHT_BLUE = "#69a9ff";
const INK = "#17233d";

const trendData = [
  { month: "7月", price: 26890 },
  { month: "8月", price: 26750 },
  { month: "9月", price: 26540 },
  { month: "10月", price: 26420 },
  { month: "11月", price: 26280 },
  { month: "12月", price: 26190 },
  { month: "1月", price: 26080 },
  { month: "2月", price: 26010 },
  { month: "3月", price: 25950 },
  { month: "4月", price: 25890 },
  { month: "5月", price: 25920 },
  { month: "6月", price: 25765 },
];

const compareData = [
  { month: "1月", 余杭: 32800, 萧山: 30200 },
  { month: "2月", 余杭: 32500, 萧山: 30100 },
  { month: "3月", 余杭: 32300, 萧山: 29900 },
  { month: "4月", 余杭: 32000, 萧山: 29600 },
  { month: "5月", 余杭: 31900, 萧山: 29500 },
  { month: "6月", 余杭: 31600, 萧山: 29300 },
];

const rentData = [
  { name: "未来科技城", rent: 4800 },
  { name: "仓前", rent: 4200 },
  { name: "闲林", rent: 3600 },
  { name: "五常", rent: 4550 },
];

const communityData = [
  { month: "1月", price: 35400, deal: 9 },
  { month: "2月", price: 35100, deal: 6 },
  { month: "3月", price: 34900, deal: 11 },
  { month: "4月", price: 35050, deal: 8 },
  { month: "5月", price: 34700, deal: 12 },
  { month: "6月", price: 34500, deal: 7 },
];

const prompts = [
  { id: "trend", label: "杭州最近房价什么走势？", icon: TrendingDown },
  { id: "budget", label: "300万预算，余杭和萧山怎么选？", icon: WalletCards },
  { id: "rent", label: "未来科技城5000元内怎么租？", icon: Building2 },
  { id: "community", label: "万科城市花园最近成交怎么样？", icon: Home },
  { id: "school", label: "万科城市花园学区怎么样？", icon: CircleHelp },
];

const suggestions = {
  trend: ["300万预算适合看哪里？", "看看余杭和萧山对比", "我能贷多少钱？"],
  budget: ["查看余杭在售房源", "按我的收入算月供", "余杭最近房价走势"],
  rent: ["查看可租房源", "怎么提取公积金付房租？", "可以免押吗？"],
  community: ["查看该小区在售房源", "对比周边小区", "算一算月供"],
  school: ["查询杭州入学政策", "看看小区生活便利度", "查看周边在售房源"],
};

const listings = {
  buy: [
    { title: "未来科技城 · 三房", meta: "89㎡ · 近地铁 · 次新房", price: "298万", tag: "预算内" },
    { title: "良渚文化村 · 三房", meta: "96㎡ · 精装修 · 南北通透", price: "285万", tag: "自住优选" },
    { title: "闲林 · 四房", meta: "118㎡ · 低密社区 · 有车位", price: "305万", tag: "空间更大" },
  ],
  rent: [
    { title: "未来科技城 · 品牌公寓", meta: "一室一厅 · 近地铁 · 可月付", price: "4,680元/月", tag: "花呗免押" },
    { title: "仓前 · 保租房", meta: "两室一厅 · 民水民电 · 可备案", price: "4,200元/月", tag: "公积金提取" },
    { title: "五常 · 经纪人房源", meta: "一室一厅 · 拎包入住 · 近园区", price: "4,550元/月", tag: "随时看房" },
  ],
};

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [drawer, setDrawer] = useState(null);
  const [consent, setConsent] = useState(false);
  const [journey, setJourney] = useState(["了解需求"]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!scrollRef.current) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "agent") {
      const userRows = scrollRef.current.querySelectorAll(".user-row");
      const lastUserRow = userRows[userRows.length - 1];
      if (lastUserRow) {
        scrollRef.current.scrollTop = Math.max(0, lastUserRow.offsetTop - scrollRef.current.offsetTop - 12);
      }
      return;
    }
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  const ask = (text, explicitId) => {
    if (!text.trim() || loading) return;
    const id = explicitId || identifyPrompt(text);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "agent", id }]);
      setLoading(false);
      setJourney((prev) => (prev.includes("获得分析") ? prev : [...prev, "获得分析"]));
    }, 760);
  };

  const openService = (type) => {
    setDrawer(type);
    setJourney((prev) => (prev.includes("继续办事") ? prev : [...prev, "继续办事"]));
  };

  return (
    <div className="app-shell">
      <DesktopNav />
      <main className="agent-column">
        <Header />
        <section className="chat-scroll" ref={scrollRef}>
          {messages.length === 0 ? (
            <Welcome onAsk={ask} onService={openService} />
          ) : (
            <div className="thread">
              <div className="mini-intro">
                <AgentMark />
                <span>我会结合房产趋势与支付宝服务，陪你把问题往下办。</span>
              </div>
              {messages.map((message, index) =>
                message.role === "user" ? (
                  <UserMessage key={index} text={message.text} />
                ) : (
                  <AgentAnswer key={index} id={message.id} onAsk={ask} onService={openService} />
                )
              )}
              {loading && <LoadingAnswer />}
            </div>
          )}
        </section>
        <Composer value={input} setValue={setInput} onSend={() => ask(input)} />
      </main>
      <JourneyPanel journey={journey} onService={openService} />
      <BottomNav onService={openService} />
      {!consent && <Consent onAccept={() => setConsent(true)} />}
      {drawer && <ServiceDrawer type={drawer} onClose={() => setDrawer(null)} />}
    </div>
  );
}

function identifyPrompt(text) {
  if (/学区|学校|入学/.test(text)) return "school";
  if (/租|免押|公积金.*房租/.test(text)) return "rent";
  if (/万科|小区|成交/.test(text)) return "community";
  if (/预算|余杭|萧山|怎么选/.test(text)) return "budget";
  return "trend";
}

function DesktopNav() {
  return (
    <aside className="desktop-nav">
      <div className="brand-mark">支</div>
      <nav>
        <button className="nav-button"><Sparkles size={20} /><span>AI</span></button>
        <button className="nav-button active"><Home size={20} /><span>房产</span></button>
        <button className="nav-button"><MessageCircleMore size={20} /><span>历史</span></button>
      </nav>
      <button className="avatar">吴</button>
    </aside>
  );
}

function Header() {
  return (
    <header className="app-header">
      <button className="icon-button mobile-back" aria-label="返回"><ArrowLeft size={20} /></button>
      <div className="header-title">
        <div className="agent-logo"><Home size={17} /></div>
        <div><strong>房多多 Agent</strong><span>杭州 · 模拟数据演示</span></div>
      </div>
      <div className="header-actions">
        <button className="city-pill"><MapPin size={15} />杭州<ChevronDown size={14} /></button>
        <button className="icon-button" aria-label="更多"><MoreHorizontal size={20} /></button>
      </div>
    </header>
  );
}

function Welcome({ onAsk, onService }) {
  return (
    <div className="welcome">
      <div className="welcome-orbit"><div className="welcome-home"><Home size={28} /></div></div>
      <p className="eyebrow">支付宝房产服务助手</p>
      <h1>关于杭州的房子，<br />从了解开始，一路帮你办。</h1>
      <p className="welcome-copy">问趋势、选区域、找房源，也可以继续算月供、查公积金和办理租房服务。</p>
      <div className="prompt-grid">
        {prompts.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => onAsk(label, id)} className="prompt-card">
            <span className="prompt-icon"><Icon size={18} /></span>
            <span>{label}</span>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
      <div className="welcome-services">
        <button onClick={() => onService("buy-listings")}><Search size={17} />找房源</button>
        <button onClick={() => onService("mortgage")}><Calculator size={17} />算月供</button>
        <button onClick={() => onService("fund")}><Landmark size={17} />查公积金</button>
      </div>
    </div>
  );
}

function AgentMark() {
  return <div className="agent-mark"><Sparkles size={15} /></div>;
}

function UserMessage({ text }) {
  return <div className="user-row"><div className="user-bubble">{text}</div></div>;
}

function LoadingAnswer() {
  return (
    <div className="answer-row">
      <AgentMark />
      <div className="thinking">
        <div className="dots"><i /><i /><i /></div>
        <span>正在理解问题并调用趋势数据…</span>
      </div>
    </div>
  );
}

function AgentAnswer({ id, onAsk, onService }) {
  const content = {
    trend: <TrendAnswer onService={onService} />,
    budget: <BudgetAnswer onService={onService} />,
    rent: <RentAnswer onService={onService} />,
    community: <CommunityAnswer onService={onService} />,
    school: <SchoolAnswer onService={onService} />,
  }[id];
  return (
    <div className="answer-row">
      <AgentMark />
      <div className="answer-stack">
        {content}
        <div className="followups">
          <span>继续问</span>
          {suggestions[id].map((question) => <button key={question} onClick={() => onAsk(question)}>{question}<ChevronRight size={14} /></button>)}
        </div>
      </div>
    </div>
  );
}

function TrendAnswer({ onService }) {
  return (
    <>
      <div className="answer-copy">
        <strong>杭州房价近一年整体温和下行，近期仍处于调整阶段。</strong>
        <p>截至 6 月 7 日，杭州参考均价约为 25,765 元/㎡。近一个月变化约 -0.6%，不同板块分化明显，建议结合预算与自住需求看具体区域。</p>
      </div>
      <InsightCard title="杭州房产趋势" subtitle="更新至 2026.06.07">
        <MetricGrid items={[["参考均价", "25,765", "元/㎡"], ["近一月", "-0.6%", "温和调整"], ["近一年", "-8.4%", "历史变化"], ["趋势温度", "寒", "强度 44"]]} />
        <ChartHeader title="近一年价格趋势" meta="单位：元/㎡" />
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
              <defs><linearGradient id="blueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity={0.22} /><stop offset="100%" stopColor={BLUE} stopOpacity={0.02} /></linearGradient></defs>
              <CartesianGrid vertical={false} stroke="#edf1f7" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 11 }} interval={2} />
              <YAxis domain={[25000, 27500]} axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 10 }} />
              <Tooltip content={<PriceTooltip />} />
              <Area isAnimationActive={false} type="monotone" dataKey="price" stroke={BLUE} strokeWidth={2.5} fill="url(#blueFill)" dot={false} activeDot={{ r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <Evidence text="趋势依据：价格变化、成交活跃度与相对强度综合判断" />
      </InsightCard>
      <ServiceActions title="下一步可以这样做" actions={[
        { icon: Search, title: "看预算内房源", sub: "按区域与总价筛选", type: "buy-listings" },
        { icon: Calculator, title: "测算购房能力", sub: "月供与首付一起算", type: "mortgage" },
        { icon: Landmark, title: "查公积金", sub: "了解可贷额度", type: "fund" },
      ]} onService={onService} />
      <SourceNote />
    </>
  );
}

function BudgetAnswer({ onService }) {
  return (
    <>
      <div className="answer-copy">
        <strong>300万预算，自住优先可重点看余杭；希望总价压力更低，可以扩大到萧山。</strong>
        <p>余杭靠近未来科技城，就业与通勤优势更突出；萧山同预算通常能获得更大的居住面积。下面是基于模拟趋势数据的对比。</p>
      </div>
      <InsightCard title="余杭 vs 萧山" subtitle="总价 300 万 · 自住视角">
        <div className="compare-summary">
          <div><span className="dot blue" />余杭<strong>约 95㎡</strong><small>通勤与产业优势</small></div>
          <div><span className="dot light" />萧山<strong>约 102㎡</strong><small>面积与总价优势</small></div>
        </div>
        <ChartHeader title="近半年价格趋势对比" meta="单位：元/㎡" />
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={compareData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#edf1f7" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 11 }} />
              <YAxis domain={[28000, 34000]} axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 10 }} />
              <Tooltip content={<PriceTooltip />} />
              <Line isAnimationActive={false} type="monotone" dataKey="余杭" stroke={BLUE} strokeWidth={2.5} dot={false} />
              <Line isAnimationActive={false} type="monotone" dataKey="萧山" stroke={LIGHT_BLUE} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <DecisionRows />
      </InsightCard>
      <ServiceActions title="把选择往前推进" actions={[
        { icon: Search, title: "查看余杭房源", sub: "预算内约 328 套", type: "buy-listings" },
        { icon: Calculator, title: "按收入算月供", sub: "判断舒适预算", type: "mortgage" },
      ]} onService={onService} />
      <SourceNote />
    </>
  );
}

function RentAnswer({ onService }) {
  return (
    <>
      <div className="answer-copy">
        <strong>5000元以内在未来科技城有较多一居选择，向仓前或闲林移动，通常可以租到两居。</strong>
        <p>如果你在海创园附近通勤，可以优先看未来科技城与仓前；更关注空间，可以考虑闲林。签约前建议确认备案、押付方式和民水民电。</p>
      </div>
      <InsightCard title="5000元预算租房地图" subtitle="整租参考 · 模拟数据">
        <ChartHeader title="热门板块月租参考" meta="单位：元/月" />
        <div className="chart-wrap rent-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rentData} layout="vertical" margin={{ top: 4, right: 10, left: 10, bottom: 0 }}>
              <XAxis type="number" domain={[0, 5500]} hide />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={76} tick={{ fill: "#596579", fontSize: 11 }} />
              <Tooltip cursor={{ fill: "#f5f8fc" }} formatter={(value) => [`${value} 元/月`, "整租参考"]} />
              <Bar isAnimationActive={false} dataKey="rent" fill={BLUE} radius={[0, 5, 5, 0]} barSize={14} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rent-tips">
          <span><TrainFront size={15} />海创园通勤：未来科技城 / 仓前</span>
          <span><Home size={15} />空间优先：闲林两居选择更多</span>
        </div>
      </InsightCard>
      <ServiceActions title="支付宝里继续租" actions={[
        { icon: Search, title: "查看可租房源", sub: "公寓、保租房与经纪房源", type: "rent-listings" },
        { icon: ShieldCheck, title: "花呗免押", sub: "减少入住资金压力", type: "deposit" },
        { icon: Landmark, title: "公积金付房租", sub: "查询可提取额度", type: "fund" },
      ]} onService={onService} />
      <SourceNote />
    </>
  );
}

function CommunityAnswer({ onService }) {
  return (
    <>
      <div className="answer-copy">
        <strong>万科城市花园近半年成交价小幅波动，成交活跃度保持稳定。</strong>
        <p>近期参考成交价约 34,500 元/㎡，近半年累计模拟成交 53 套。议价空间需要结合具体楼栋、楼层和装修情况判断。</p>
      </div>
      <InsightCard title="万科城市花园" subtitle="小区成交观察 · 模拟数据">
        <MetricGrid items={[["参考成交价", "34,500", "元/㎡"], ["近半年成交", "53", "套"], ["在售参考", "62", "套"], ["成交活跃度", "中等", "同板块前 40%"]]} />
        <ChartHeader title="近半年成交价格" meta="点击节点查看" />
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={communityData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#edf1f7" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 11 }} />
              <YAxis domain={[33000, 36500]} axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 10 }} />
              <Tooltip content={<PriceTooltip />} />
              <Area isAnimationActive={false} type="monotone" dataKey="price" stroke={BLUE} strokeWidth={2.5} fill="url(#blueFill)" dot={{ r: 2, fill: BLUE }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </InsightCard>
      <ServiceActions title="继续了解这个小区" actions={[
        { icon: Search, title: "查看在售房源", sub: "按楼栋和面积筛选", type: "buy-listings" },
        { icon: Calculator, title: "算一算月供", sub: "以 89㎡ 三房为例", type: "mortgage" },
        { icon: Navigation, title: "查看生活便利度", sub: "交通、商业与医疗", type: "amenities" },
      ]} onService={onService} />
      <SourceNote />
    </>
  );
}

function SchoolAnswer({ onService }) {
  return (
    <>
      <div className="answer-copy boundary">
        <div className="boundary-label"><ShieldCheck size={16} />能力边界说明</div>
        <strong>学区划分和入学政策可能每年调整，我不能仅依据房产趋势数据判断入学资格。</strong>
        <p>万科城市花园周边教育资源可以作为居住参考，但具体对应学校、落户年限和入学条件，请以杭州市及属地区教育部门当年公布的信息为准。</p>
      </div>
      <div className="official-card">
        <div className="official-icon"><FileCheck2 size={21} /></div>
        <div><strong>查询杭州官方入学政策</strong><span>该回答未引用实时房产趋势数据</span></div>
        <ChevronRight size={18} />
      </div>
      <ServiceActions title="还可以了解" actions={[
        { icon: Navigation, title: "查看生活便利度", sub: "交通、商业与医疗", type: "amenities" },
        { icon: Search, title: "查看周边房源", sub: "仅作为居住选择参考", type: "buy-listings" },
      ]} onService={onService} />
    </>
  );
}

function InsightCard({ title, subtitle, children }) {
  return <section className="insight-card"><div className="card-title"><div><strong>{title}</strong><span>{subtitle}</span></div><button aria-label="展开"><MoreHorizontal size={18} /></button></div>{children}</section>;
}

function MetricGrid({ items }) {
  return <div className="metric-grid">{items.map(([label, value, sub]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>{sub}</small></div>)}</div>;
}

function ChartHeader({ title, meta }) {
  return <div className="chart-header"><strong>{title}</strong><span>{meta}</span></div>;
}

function PriceTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><span>{label}</span>{payload.map((entry) => <strong key={entry.dataKey}>{entry.dataKey === "price" ? "参考价" : entry.dataKey}：{Number(entry.value).toLocaleString()} 元/㎡</strong>)}</div>;
}

function Evidence({ text }) {
  return <div className="evidence"><LocateFixed size={14} />{text}</div>;
}

function DecisionRows() {
  return <div className="decision-rows"><div><span>通勤与产业</span><b>余杭更匹配</b></div><div><span>面积与总价</span><b>萧山更匹配</b></div><div><span>趋势确定性</span><b>均需看具体板块</b></div></div>;
}

function ServiceActions({ title, actions, onService }) {
  return (
    <section className="service-block">
      <div className="service-title"><Sparkles size={15} />{title}</div>
      <div className="service-list">
        {actions.map(({ icon: Icon, title: itemTitle, sub, type }) => (
          <button key={itemTitle} onClick={() => onService(type)}>
            <span className="service-icon"><Icon size={19} /></span>
            <span><strong>{itemTitle}</strong><small>{sub}</small></span>
            <ChevronRight size={17} />
          </button>
        ))}
      </div>
    </section>
  );
}

function SourceNote() {
  return <div className="source-note"><span>数据支持：趋势动物 · 模拟 MCP 返回</span><span>以上数据反映历史趋势，不代表未来走势，不构成投资建议。</span></div>;
}

function Composer({ value, setValue, onSend }) {
  return (
    <div className="composer-wrap">
      <div className="composer">
        <button className="icon-button" aria-label="添加"><Plus size={20} /></button>
        <input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="问问杭州房价、租房或公积金…" />
        <button className="icon-button" aria-label="语音"><Mic size={20} /></button>
        <button className="send-button" onClick={onSend} aria-label="发送"><Send size={17} /></button>
      </div>
      <span className="composer-note">AI回答仅供参考，重要信息请以官方渠道为准</span>
    </div>
  );
}

function JourneyPanel({ journey, onService }) {
  const steps = ["了解需求", "获得分析", "继续办事"];
  return (
    <aside className="journey-panel">
      <div className="journey-head"><span>本次看房旅程</span><button><RefreshCw size={15} />新对话</button></div>
      <div className="journey-steps">
        {steps.map((step, index) => <div className={journey.includes(step) ? "done" : ""} key={step}><i>{journey.includes(step) ? <Check size={13} /> : index + 1}</i><span>{step}</span></div>)}
      </div>
      <div className="side-section">
        <strong>杭州常用服务</strong>
        <button onClick={() => onService("fund")}><Landmark size={17} />公积金查询<ChevronRight size={15} /></button>
        <button onClick={() => onService("mortgage")}><Calculator size={17} />房贷计算器<ChevronRight size={15} /></button>
        <button onClick={() => onService("rent-listings")}><Building2 size={17} />可信租房源<ChevronRight size={15} /></button>
      </div>
      <div className="side-tip"><ShieldCheck size={17} /><div><strong>数据与回答边界</strong><span>趋势问题调用模拟 MCP，政策办理以官方服务为准。</span></div></div>
    </aside>
  );
}

function Consent({ onAccept }) {
  return (
    <div className="modal-backdrop">
      <div className="consent-card">
        <div className="consent-icon"><ShieldCheck size={25} /></div>
        <h2>使用前请了解</h2>
        <p>房多多 Agent 会根据你的问题调用模拟房产趋势数据，并推荐支付宝内的相关服务。</p>
        <ul><li>价格与趋势信息仅反映历史情况</li><li>不预测房价，不构成投资建议</li><li>政策与办理结果以官方渠道为准</li></ul>
        <button onClick={onAccept}>已了解，开始咨询</button>
        <span>Demo 所有数据均为模拟展示</span>
      </div>
    </div>
  );
}

function ServiceDrawer({ type, onClose }) {
  const content = type === "mortgage" ? <Mortgage /> : type === "fund" ? <Fund /> : type === "buy-listings" ? <Listings kind="buy" /> : type === "rent-listings" ? <Listings kind="rent" /> : <GenericService type={type} />;
  return (
    <div className="drawer-backdrop" onMouseDown={onClose}>
      <section className="service-drawer" onMouseDown={(event) => event.stopPropagation()}>
        <div className="drawer-handle" />
        <button className="drawer-close" onClick={onClose} aria-label="关闭"><X size={20} /></button>
        {content}
      </section>
    </div>
  );
}

function Listings({ kind }) {
  const items = listings[kind];
  return (
    <>
      <div className="drawer-title"><span>{kind === "buy" ? "预算内在售房源" : "未来科技城周边租房"}</span><small>聚合展示 · 模拟房源</small></div>
      <div className="filter-row"><button>区域<ChevronDown size={13} /></button><button>总价<ChevronDown size={13} /></button><button>户型<ChevronDown size={13} /></button><button aria-label="筛选"><SlidersHorizontal size={15} /></button></div>
      <div className="listing-list">
        {items.map((item, index) => <button className="listing-item" key={item.title}><span className={`listing-image image-${index + 1}`}><Home size={25} /></span><span className="listing-content"><strong>{item.title}</strong><small>{item.meta}</small><em>{item.tag}</em></span><b>{item.price}</b></button>)}
      </div>
      <button className="primary-wide">进入房源服务查看更多<ArrowRight size={17} /></button>
    </>
  );
}

function Mortgage() {
  const [price, setPrice] = useState(300);
  const [down, setDown] = useState(30);
  const [years, setYears] = useState(30);
  const loan = price * (1 - down / 100);
  const monthlyRate = 3.1 / 100 / 12;
  const months = years * 12;
  const payment = useMemo(() => (loan * 10000 * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1), [loan, months]);
  return (
    <>
      <div className="drawer-title"><span>房贷计算器</span><small>快速判断舒适预算</small></div>
      <div className="calculator-result"><span>预计每月还款</span><strong>¥ {Math.round(payment).toLocaleString()}</strong><small>商业贷款 {loan.toFixed(0)} 万 · 等额本息</small></div>
      <div className="form-row"><label>房屋总价</label><div><input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} /><span>万元</span></div></div>
      <div className="form-row"><label>首付比例</label><div><input type="number" value={down} onChange={(e) => setDown(Number(e.target.value))} /><span>%</span></div></div>
      <div className="form-row"><label>贷款期限</label><div><input type="number" value={years} onChange={(e) => setYears(Number(e.target.value))} /><span>年</span></div></div>
      <button className="primary-wide">查看公积金组合贷方案<ArrowRight size={17} /></button>
      <p className="drawer-footnote">利率与测算结果仅供参考，实际以贷款机构审批为准。</p>
    </>
  );
}

function Fund() {
  const [authorized, setAuthorized] = useState(false);
  return (
    <>
      <div className="drawer-title"><span>杭州公积金服务</span><small>官方服务授权查询</small></div>
      {!authorized ? (
        <div className="authorize">
          <div className="authorize-icon"><Landmark size={27} /></div>
          <strong>授权后可继续测算</strong>
          <p>查询账户余额、预计贷款额度，或判断是否满足租房提取条件。</p>
          <button className="primary-wide" onClick={() => setAuthorized(true)}>支付宝授权查询</button>
          <span><ShieldCheck size={14} />查询结果由官方服务提供</span>
        </div>
      ) : (
        <>
          <div className="fund-balance"><span>账户余额</span><strong>¥ 86,420.35</strong><small>更新于刚刚 · 模拟结果</small></div>
          <div className="fund-options"><button><Home size={19} /><span><strong>购房贷款测算</strong><small>预计最高可贷 65 万</small></span><ChevronRight size={17} /></button><button><Building2 size={19} /><span><strong>租房提取</strong><small>查看可提取额度与材料</small></span><ChevronRight size={17} /></button></div>
        </>
      )}
    </>
  );
}

function GenericService({ type }) {
  const isDeposit = type === "deposit";
  return (
    <>
      <div className="drawer-title"><span>{isDeposit ? "花呗免押租房" : "小区生活便利度"}</span><small>支付宝服务演示</small></div>
      <div className="generic-hero">{isDeposit ? <ShieldCheck size={31} /> : <Navigation size={31} />}<strong>{isDeposit ? "信用好，可以少交一笔押金" : "日常生活，步行范围内就能解决"}</strong><p>{isDeposit ? "签约时选择支持免押的合作房源，授权评估后即可查看结果。" : "万科城市花园周边覆盖地铁、商业、社区医疗与日常生活服务。"}</p></div>
      <div className="generic-grid">{(isDeposit ? [["可免押房源", "126套"], ["预计节省", "4,500元"], ["在线签约", "支持"]] : [["地铁距离", "约680m"], ["生活便利", "较高"], ["维修保洁", "可预约"]]).map(([a, b]) => <div key={a}><span>{a}</span><strong>{b}</strong></div>)}</div>
      <button className="primary-wide">{isDeposit ? "查看支持免押的房源" : "查看周边生活服务"}<ArrowRight size={17} /></button>
    </>
  );
}

function BottomNav({ onService }) {
  return <nav className="bottom-nav"><button className="active"><Sparkles size={20} /><span>问房</span></button><button onClick={() => onService("buy-listings")}><Search size={20} /><span>找房</span></button><button onClick={() => onService("fund")}><WalletCards size={20} /><span>服务</span></button><button><Menu size={20} /><span>我的</span></button></nav>;
}

createRoot(document.getElementById("root")).render(<App />);
