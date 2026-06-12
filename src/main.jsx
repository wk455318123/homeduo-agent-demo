import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BedDouble,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Calculator,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  FileCheck2,
  GraduationCap,
  Home,
  KeyRound,
  Landmark,
  LocateFixed,
  MapPin,
  Menu,
  MessageCircleMore,
  Mic,
  MoreHorizontal,
  Navigation,
  PawPrint,
  Plus,
  RefreshCw,
  ReceiptText,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrainFront,
  TrendingDown,
  Truck,
  UserCheck,
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
import { extractCommunityName, identifyPrompt } from "./intent.js";
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

const communityRentData = [
  { month: "1月", rent: 5150 },
  { month: "2月", rent: 5100 },
  { month: "3月", rent: 5200 },
  { month: "4月", rent: 5250 },
  { month: "5月", rent: 5200 },
  { month: "6月", rent: 5300 },
];

const prompts = [
  { id: "trend", label: "杭州最近房价什么走势？", icon: TrendingDown },
  { id: "budget", label: "300万预算，余杭和萧山怎么选？", icon: WalletCards },
  { id: "rent", label: "我想在杭州租房，帮我找找", icon: Building2 },
  { id: "community", label: "万科城市花园二手房价和租金？", icon: Home },
  { id: "affordable", label: "我能申请杭州保租房或人才房吗？", icon: ShieldCheck },
  { id: "school", label: "万科城市花园学区怎么样？", icon: CircleHelp },
];

const suggestions = {
  trend: ["300万预算适合看哪里？", "看看余杭和萧山对比", "我能贷多少钱？"],
  budget: ["查看余杭在售房源", "按我的收入算月供", "余杭最近房价走势"],
  rent: ["怎么提取公积金付房租？", "自如房源支持免押吗？", "想住得离公司更近"],
  community: ["这个小区近半年成交怎么样？", "查看该小区出租房源", "算一算租售比"],
  affordable: ["查看正在开放的项目", "人才房需要哪些材料？", "查询我的申请进度"],
  school: ["查询杭州入学政策", "看看小区生活便利度", "查看周边在售房源"],
};

const affordableProjects = [
  {
    name: "潮语贤庭",
    type: "人才专项租赁住房",
    area: "上城区",
    rent: "人才优惠租金最高可至评估价 7 折",
    layout: "两室一厅 · 约 57-59㎡",
    status: "关注后续配租公告",
    stage: "即将开放",
    deadline: "预计 6月28日开放",
    updated: "今天 09:30",
    sourceLevel: "市级官方平台",
    fit: "高校毕业生 / 各类人才",
    source: "杭州市住房租赁公众服务平台",
  },
  {
    name: "宸寓·如栖兰庭",
    type: "人才专项租赁住房",
    area: "拱墅区",
    rent: "项目实行一房一价",
    layout: "精装房源 · 拎包入住",
    status: "常态化配租信息待核验",
    stage: "常态化登记",
    deadline: "登记后等待房源通知",
    updated: "昨天 16:20",
    sourceLevel: "区级运营公告",
    fit: "在杭就业人才",
    source: "杭州市住房租赁公众服务平台",
  },
  {
    name: "宁巢·钱塘蓝领公寓",
    type: "蓝领公寓",
    area: "钱塘区",
    rent: "床位约 150 元/月起",
    layout: "单人间 / 双人间 / 四人间",
    status: "适合新就业群体关注",
    stage: "开放申请中",
    deadline: "6月20日截止",
    updated: "今天 08:15",
    sourceLevel: "区级官方平台",
    fit: "产业工人 / 新就业群体",
    source: "杭州市住房租赁公众服务平台",
  },
];

const listings = {
  buy: [
    { title: "未来科技城 · 三房", meta: "89㎡ · 近地铁 · 次新房", price: "298万", tag: "预算内" },
    { title: "良渚文化村 · 三房", meta: "96㎡ · 精装修 · 南北通透", price: "285万", tag: "自住优选" },
    { title: "闲林 · 四房", meta: "118㎡ · 低密社区 · 有车位", price: "305万", tag: "空间更大" },
  ],
  rent: [
    { title: "自如整租 · 西溪北苑", meta: "整租一居 · 42㎡ · 良睦路地铁站", price: "4,680元/月", tag: "花呗免押" },
    { title: "自如整租 · 欧美金融城", meta: "整租一居 · 46㎡ · 海创园通勤约15分钟", price: "4,980元/月", tag: "今日可看" },
    { title: "自如友家 · 仓前", meta: "品质合租 · 独立卫浴 · 可月付", price: "3,280元/月", tag: "可月付" },
  ],
};

const communityHomes = {
  sale: [
    { title: "万科城市花园 · 89㎡三房", meta: "中层 · 南北通透 · 满五年", price: "306万", unit: "34,382元/㎡", tag: "近参考价", image: "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80" },
    { title: "万科城市花园 · 108㎡三房", meta: "高层 · 精装修 · 带车位", price: "386万", unit: "35,741元/㎡", tag: "改善户型", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80" },
    { title: "万科城市花园 · 72㎡两房", meta: "中层 · 朝南 · 近地铁", price: "242万", unit: "33,611元/㎡", tag: "总价较低", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80" },
  ],
  rent: [
    { title: "万科城市花园 · 整租两房", meta: "72㎡ · 朝南 · 押一付三", price: "5,300元/月", unit: "可随时看房", tag: "主流租金", image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=900&q=80" },
    { title: "万科城市花园 · 整租三房", meta: "89㎡ · 精装修 · 可月付", price: "6,800元/月", unit: "支持花呗免押", tag: "家庭整租", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80" },
    { title: "万科城市花园 · 品质合租", meta: "主卧 · 独立卫浴 · 包保洁", price: "3,180元/月", unit: "自如模拟房源", tag: "预算更轻", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80" },
  ],
};

const kaRentHomes = [
  {
    id: "xixi-north",
    partner: "自如",
    title: "自如整租 · 西溪北苑",
    location: "未来科技城",
    commute: "海创园通勤约 18 分钟",
    subway: "5号线良睦路站 780m",
    layout: "整租一居",
    area: "42㎡",
    price: 4680,
    orientation: "朝南",
    tags: ["花呗免押", "可月付", "今日可看"],
    image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=900&q=80",
    reason: "通勤、预算与独居需求最均衡",
  },
  {
    id: "efc",
    partner: "自如",
    title: "自如整租 · 欧美金融城",
    location: "未来科技城",
    commute: "步行至海创园约 15 分钟",
    subway: "5号线创景路站 560m",
    layout: "整租一居",
    area: "46㎡",
    price: 4980,
    orientation: "朝南",
    tags: ["近地铁", "智能门锁", "随时入住"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    reason: "距离公司近，下班生活更方便",
  },
  {
    id: "cangqian",
    partner: "自如",
    title: "自如友家 · 仓前",
    location: "仓前",
    commute: "海创园通勤约 25 分钟",
    subway: "5号线葛巷站 920m",
    layout: "品质合租",
    area: "主卧 18㎡",
    price: 3280,
    orientation: "带独立卫浴",
    tags: ["可月付", "独立卫浴", "保洁服务"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
    reason: "预算更轻，仍能保持便利通勤",
  },
  {
    id: "wuchang-two",
    partner: "自如",
    title: "自如整租 · 五常华元",
    location: "西溪/五常",
    commute: "海创园通勤约 28 分钟",
    subway: "5号线五常站 650m",
    layout: "整租两居",
    area: "68㎡",
    price: 5480,
    orientation: "南北通透",
    tags: ["近地铁", "双卧室", "可养猫"],
    image: "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80",
    reason: "适合两人合租或需要独立书房",
  },
  {
    id: "xianlin-two",
    partner: "自如",
    title: "自如整租 · 闲林山水",
    location: "仓前",
    commute: "海创园通勤约 35 分钟",
    subway: "公交接驳至地铁站",
    layout: "整租两居",
    area: "72㎡",
    price: 4380,
    orientation: "带阳台",
    tags: ["空间更大", "可月付", "民水民电"],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    reason: "同预算获得更大的居住空间",
  },
];

function App() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [drawer, setDrawer] = useState(null);
  const [consent, setConsent] = useState(false);
  const [journey, setJourney] = useState(["了解需求"]);
  const [communityContext, setCommunityContext] = useState("");
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
    const recognizedId = identifyPrompt(text);
    const id = recognizedId === "community" ? "community" : explicitId || recognizedId;
    const detectedCommunity = id === "community" ? extractCommunityName(text) : "";
    const resolvedCommunity = detectedCommunity || communityContext || "该小区";
    if (detectedCommunity) setCommunityContext(detectedCommunity);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "agent", id, query: text, communityName: resolvedCommunity }]);
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
                  <AgentAnswer key={index} id={message.id} query={message.query} communityName={message.communityName} onAsk={ask} onService={openService} />
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
      <p className="welcome-copy">问趋势、选区域、找房源，也可以继续查政策住房、算月供、提公积金和办理租房服务。</p>
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
        <button onClick={() => onService("affordable-projects")}><ShieldCheck size={17} />政策住房</button>
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

function AgentAnswer({ id, query, communityName, onAsk, onService }) {
  const content = {
    trend: <TrendAnswer onService={onService} />,
    budget: <BudgetAnswer onService={onService} />,
    rent: <RentAnswer onService={onService} />,
    community: <CommunityAnswer query={query} communityName={communityName} onService={onService} />,
    affordable: <AffordableHousingAnswer onService={onService} />,
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
        <strong>可以，我先了解几个关键需求，再帮你从合作平台里筛选合适房源。</strong>
        <p>租房最影响体验的是通勤、预算和租住类型。你只需要做三步选择，我会直接给出推荐理由和可看的房源。</p>
      </div>
      <RentalMatchFlow onService={onService} />
      <ServiceActions title="支付宝里继续租" actions={[
        { icon: Search, title: "查看全部 KA 房源", sub: "当前模拟接入自如房源", type: "rent-listings" },
        { icon: ShieldCheck, title: "花呗免押", sub: "减少入住资金压力", type: "deposit" },
        { icon: Landmark, title: "公积金付房租", sub: "查询可提取额度", type: "fund" },
      ]} onService={onService} />
      <div className="source-note"><span>房源合作方：自如 · 当前为模拟接入效果</span><span>房源价格和可租状态以合作平台实时信息为准。</span></div>
    </>
  );
}

function RentalMatchFlow({ onService }) {
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState(null);
  const [layout, setLayout] = useState("");
  const step = !location ? 1 : !budget ? 2 : !layout ? 3 : 4;
  const recommended = useMemo(() => {
    if (step < 4) return [];
    return [...kaRentHomes]
      .map((home) => ({
        ...home,
        score:
          (home.location === location ? 4 : 0) +
          (home.price <= budget ? 3 : Math.max(0, 2 - Math.ceil((home.price - budget) / 500))) +
          (home.layout === layout ? 4 : 0),
      }))
      .sort((a, b) => b.score - a.score || a.price - b.price)
      .slice(0, 3);
  }, [location, budget, layout, step]);

  const reset = () => {
    setLocation("");
    setBudget(null);
    setLayout("");
  };

  return (
    <section className="rental-match">
      <div className="rental-match-head">
        <div>
          <span className="ka-label"><BadgeCheck size={13} />KA 房源智能匹配</span>
          <strong>{step < 4 ? `第 ${step} 步，共 3 步` : `已匹配 ${recommended.length} 套优先房源`}</strong>
        </div>
        <div className="match-progress"><i className={step >= 1 ? "active" : ""} /><i className={step >= 2 ? "active" : ""} /><i className={step >= 3 ? "active" : ""} /></div>
      </div>

      {step === 1 && (
        <MatchQuestion icon={MapPin} title="你希望住在哪里？" hint="可以按工作地点或意向板块选择">
          <ChoiceButton title="海创园通勤 30 分钟内" sub="优先未来科技城、仓前" onClick={() => setLocation("未来科技城")} />
          <ChoiceButton title="未来科技城" sub="离园区更近，租金相对较高" onClick={() => setLocation("未来科技城")} />
          <ChoiceButton title="西溪 / 五常" sub="生活配套更成熟" onClick={() => setLocation("西溪/五常")} />
          <ChoiceButton title="仓前及周边" sub="兼顾通勤与租金" onClick={() => setLocation("仓前")} />
        </MatchQuestion>
      )}

      {step === 2 && (
        <MatchQuestion icon={WalletCards} title="每月租金预算是多少？" hint={`已选择：${location}`}>
          <ChoiceButton title="3,500 元以内" sub="品质合租为主" onClick={() => setBudget(3500)} />
          <ChoiceButton title="3,500 - 4,500 元" sub="可选整租一居或远一些的两居" onClick={() => setBudget(4500)} />
          <ChoiceButton title="4,500 - 5,500 元" sub="未来科技城整租选择更多" onClick={() => setBudget(5500)} />
        </MatchQuestion>
      )}

      {step === 3 && (
        <MatchQuestion icon={BedDouble} title="你想租什么类型？" hint={`已选择：${location} · ${budget.toLocaleString()} 元以内`}>
          <ChoiceButton title="整租一居" sub="一个人住，隐私和便利优先" onClick={() => setLayout("整租一居")} />
          <ChoiceButton title="整租两居" sub="两人合租或需要独立书房" onClick={() => setLayout("整租两居")} />
          <ChoiceButton title="品质合租" sub="预算更轻，优先独立卫浴" onClick={() => setLayout("品质合租")} />
        </MatchQuestion>
      )}

      {step === 4 && (
        <div className="rental-results">
          <div className="need-summary">
            <div><span>你的租房需求</span><strong>{location} · {budget.toLocaleString()} 元内 · {layout}</strong></div>
            <button onClick={reset}>重新选择</button>
          </div>
          <div className="match-reason"><Sparkles size={15} /><span>综合通勤、预算和房型，为你优先推荐以下自如房源</span></div>
          <div className="ka-home-list">
            {recommended.map((home, index) => <KAHousingCard key={home.id} home={home} rank={index + 1} onOpen={() => onService({ type: "rent-detail", home })} />)}
          </div>
          <button className="match-more" onClick={() => onService("rent-listings")}>查看全部匹配房源<ArrowRight size={15} /></button>
        </div>
      )}
    </section>
  );
}

function MatchQuestion({ icon: Icon, title, hint, children }) {
  return (
    <div className="match-question">
      <div className="match-question-title"><span><Icon size={17} /></span><div><strong>{title}</strong><small>{hint}</small></div></div>
      <div className="match-choices">{children}</div>
    </div>
  );
}

function ChoiceButton({ title, sub, onClick }) {
  return <button className="choice-button" onClick={onClick}><span><strong>{title}</strong><small>{sub}</small></span><ChevronRight size={16} /></button>;
}

function KAHousingCard({ home, rank, onOpen, compact = false }) {
  return (
    <button className={`ka-home-card ${compact ? "compact" : ""}`} onClick={onOpen}>
      <span className="ka-home-image" style={{ backgroundImage: `url(${home.image})` }}>
        <em>推荐 {rank}</em>
        <b>{home.partner}</b>
      </span>
      <span className="ka-home-body">
        <strong>{home.title}</strong>
        <small>{home.layout} · {home.area} · {home.orientation}</small>
        <span className="commute-line"><TrainFront size={12} />{home.commute}</span>
        <span className="ka-tags">{home.tags.slice(0, compact ? 2 : 3).map((tag) => <i key={tag}>{tag}</i>)}</span>
        {!compact && <span className="recommend-reason"><Sparkles size={11} />{home.reason}</span>}
      </span>
      <span className="ka-home-price"><strong>{home.price.toLocaleString()}</strong><small>元/月</small><ChevronRight size={15} /></span>
    </button>
  );
}

function CommunityAnswer({ query, communityName = "万科城市花园", onService }) {
  return (
    <>
      <div className="answer-copy">
        <strong>{communityName}的二手房价近期小幅波动，租金整体相对稳定。</strong>
        <p>当前二手参考成交价约 34,500 元/㎡；主流两房月租约 5,300 元。小区近半年成交活跃度中等，价格和租金需要结合具体户型、楼层与装修判断。</p>
      </div>
      <CommunityMarketCard communityName={communityName} />
      <ServiceActions title="继续了解这个小区" actions={[
        { icon: Search, title: "查看二手房源", sub: "参考价附近共 62 套", type: { type: "community-sale-listings", communityName } },
        { icon: Building2, title: "查看出租房源", sub: "整租、合租共 18 套", type: { type: "community-rent-listings", communityName } },
        { icon: Calculator, title: "算一算月供", sub: "以 89㎡ 三房为例", type: "mortgage" },
      ]} onService={onService} />
      <SourceNote />
    </>
  );
}

function CommunityMarketCard({ communityName }) {
  const [tab, setTab] = useState("overview");
  return (
    <section className="community-market-card">
      <div className="community-market-head">
        <div><strong>{communityName}</strong><span>二手房与租赁市场 · 模拟数据</span></div>
        <span className="market-update"><Clock3 size={12} />更新至 2026.06.07</span>
      </div>
      <div className="market-tabs">
        {[["overview", "市场总览"], ["sale", "二手房价"], ["rent", "租金行情"]].map(([id, label]) => <button className={tab === id ? "active" : ""} key={id} onClick={() => setTab(id)}>{label}</button>)}
      </div>
      {tab === "overview" && <CommunityOverview />}
      {tab === "sale" && <CommunitySaleTrend />}
      {tab === "rent" && <CommunityRentTrend />}
    </section>
  );
}

function CommunityOverview() {
  return (
    <div className="community-overview">
      <div className="market-value-grid">
        <div className="sale-value"><span><Home size={14} />二手参考成交价</span><strong>34,500<small>元/㎡</small></strong><em>近半年约 -2.5%</em></div>
        <div className="rent-value"><span><Building2 size={14} />主流两房月租</span><strong>5,300<small>元/月</small></strong><em>近半年约 +2.9%</em></div>
      </div>
      <div className="market-signal-grid">
        <div><span>近半年成交</span><strong>53 套</strong><small>活跃度中等</small></div>
        <div><span>当前在售</span><strong>62 套</strong><small>议价空间需看房源</small></div>
        <div><span>当前出租</span><strong>18 套</strong><small>两房占比更高</small></div>
        <div><span>粗略租售比</span><strong>约 1.9%</strong><small>按 89㎡ 两房估算</small></div>
      </div>
      <div className="market-insight"><Sparkles size={15} /><div><strong>Agent 解读</strong><span>售价仍处于调整阶段，租金相对稳定。自住用户可重点比较具体房源议价空间；出租回报测算需计入空置、税费和维护成本。</span></div></div>
    </div>
  );
}

function CommunitySaleTrend() {
  return (
    <div className="market-trend-panel">
      <div className="trend-panel-title"><div><strong>近半年二手成交价格</strong><span>参考成交价 · 元/㎡</span></div><b>34,500</b></div>
      <div className="market-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={communityData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
            <defs><linearGradient id="communitySaleFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={BLUE} stopOpacity={0.20} /><stop offset="100%" stopColor={BLUE} stopOpacity={0.02} /></linearGradient></defs>
            <CartesianGrid vertical={false} stroke="#edf1f7" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 10 }} />
            <YAxis domain={[33000, 36500]} axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 9 }} />
            <Tooltip content={<PriceTooltip />} />
            <Area isAnimationActive={false} type="monotone" dataKey="price" stroke={BLUE} strokeWidth={2.4} fill="url(#communitySaleFill)" dot={{ r: 2, fill: BLUE }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="market-detail-rows"><div><span>两房参考</span><b>33,600 - 34,800 元/㎡</b></div><div><span>三房参考</span><b>34,200 - 35,800 元/㎡</b></div><div><span>近半年成交</span><b>53 套</b></div></div>
    </div>
  );
}

function CommunityRentTrend() {
  return (
    <div className="market-trend-panel">
      <div className="trend-panel-title"><div><strong>近半年主流两房租金</strong><span>整租参考 · 元/月</span></div><b>5,300</b></div>
      <div className="market-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={communityRentData} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#edf1f7" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 10 }} />
            <YAxis domain={[4800, 5500]} axisLine={false} tickLine={false} tick={{ fill: "#8a94a6", fontSize: 9 }} />
            <Tooltip content={<RentTooltip />} />
            <Line isAnimationActive={false} type="monotone" dataKey="rent" stroke={BLUE} strokeWidth={2.4} dot={{ r: 2, fill: BLUE }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="market-detail-rows"><div><span>整租两房</span><b>5,000 - 5,600 元/月</b></div><div><span>整租三房</span><b>6,500 - 7,200 元/月</b></div><div><span>品质合租</span><b>2,800 - 3,500 元/月</b></div></div>
    </div>
  );
}

function AffordableHousingAnswer({ onService }) {
  return (
    <>
      <div className="answer-copy">
        <strong>可以先帮你判断适合哪类政策住房，再匹配近期项目和申请入口。</strong>
        <p>保租房、人才专项租赁住房、公租房和蓝领公寓的条件、申请时间与材料并不完全相同。支付宝可以聚合官方公告，并经你授权后预核验部分资格信息。</p>
      </div>
      <PolicyHousingMatcher onService={onService} />
      <ServiceActions title="支付宝里继续办理" actions={[
        { icon: Search, title: "查看政策住房项目", sub: "聚合官方公告与开放状态", type: "affordable-projects" },
        { icon: BellRing, title: "订阅开放提醒", sub: "截止、补充材料及时通知", type: "affordable-alerts" },
        { icon: Clock3, title: "查询申请进度", sub: "统一查看审核、选房与签约", type: "affordable-progress" },
      ]} onService={onService} />
      <div className="source-note"><span>政策信息来源：杭州市住房租赁公众服务平台等官方渠道</span><span>申请资格、项目状态与租金以最新官方公告和审批结果为准。</span></div>
    </>
  );
}

function PolicyHousingMatcher({ onService }) {
  const [identity, setIdentity] = useState("");
  const [workArea, setWorkArea] = useState("");
  const [housing, setHousing] = useState("");
  const step = !identity ? 1 : !workArea ? 2 : !housing ? 3 : 4;
  const matches = identity === "newworker"
    ? [affordableProjects[2]]
    : workArea === "上城区"
      ? [affordableProjects[0], affordableProjects[1]]
      : [affordableProjects[1], affordableProjects[0]];

  return (
    <section className="policy-matcher">
      <div className="policy-head">
        <div><span><ShieldCheck size={14} />政策住房资格预匹配</span><strong>{step < 4 ? `回答 ${step} 个问题，快速找到适合类型` : `初步匹配 ${matches.length} 个方向`}</strong></div>
        <span className="policy-progress">{[1, 2, 3].map((item) => <i className={step >= item ? "active" : ""} key={item} />)}</span>
      </div>
      {step === 1 && (
        <PolicyQuestion title="哪种身份最接近你？" hint="不同保障类型面向人群不同">
          <ChoiceButton title="高校毕业生" sub="大专及以上学历，在杭就业或求职" onClick={() => setIdentity("graduate")} />
          <ChoiceButton title="杭州认定人才" sub="市级或区级人才、人才居住证等" onClick={() => setIdentity("talent")} />
          <ChoiceButton title="新市民 / 青年人" sub="在杭就业，希望降低租住成本" onClick={() => setIdentity("youth")} />
          <ChoiceButton title="新就业群体" sub="快递、配送、网约车等行业" onClick={() => setIdentity("newworker")} />
        </PolicyQuestion>
      )}
      {step === 2 && (
        <PolicyQuestion title="你的工作或主要通勤区域？" hint="政策住房通常强调职住平衡">
          {["上城区", "拱墅区", "余杭区", "钱塘区"].map((area) => <ChoiceButton key={area} title={area} sub="优先匹配所在区及周边项目" onClick={() => setWorkArea(area)} />)}
        </PolicyQuestion>
      )}
      {step === 3 && (
        <PolicyQuestion title="家庭住房与优惠情况？" hint="系统仅用于预匹配，最终以官方核验为准">
          <ChoiceButton title="在相关区域无住房" sub="且未享受其他住房租赁优惠" onClick={() => setHousing("clear")} />
          <ChoiceButton title="情况不确定" sub="授权后帮助核验不动产和优惠状态" onClick={() => setHousing("unknown")} />
        </PolicyQuestion>
      )}
      {step === 4 && (
        <div className="policy-results">
          <div className="policy-result-summary"><UserCheck size={19} /><div><strong>初步具备继续核验的条件</strong><span>{workArea} · {identity === "talent" ? "人才身份" : identity === "graduate" ? "高校毕业生" : identity === "newworker" ? "新就业群体" : "新市民/青年人"} · {housing === "clear" ? "相关区域无房" : "住房情况待核验"}</span></div><button onClick={() => { setIdentity(""); setWorkArea(""); setHousing(""); }}>重选</button></div>
          <div className="policy-auth-row">
            <span><BadgeCheck size={15} /><div><strong>支付宝可协助核验</strong><small>身份、学历、社保、人才认定与不动产等授权信息</small></div></span>
            <button onClick={() => onService("affordable-apply")}>开始核验<ChevronRight size={14} /></button>
          </div>
          <div className="policy-project-list">
            {matches.map((project) => <PolicyProjectCard project={project} key={project.name} onOpen={() => onService({ type: "affordable-project-detail", project })} />)}
          </div>
        </div>
      )}
    </section>
  );
}

function PolicyQuestion({ title, hint, children }) {
  return <div className="policy-question"><div><strong>{title}</strong><span>{hint}</span></div><div className="match-choices">{children}</div></div>;
}

function PolicyProjectCard({ project, onOpen }) {
  return (
    <button className="policy-project-card" onClick={onOpen}>
      <span className="policy-card-labels"><span className="policy-type">{project.type}</span><i className={project.stage === "开放申请中" ? "open" : ""}>{project.stage}</i></span>
      <span className="policy-project-copy"><strong>{project.name}</strong><small><MapPin size={11} />{project.area} · {project.layout}</small><em>{project.rent}</em><small className="policy-update"><RefreshCw size={10} />更新于 {project.updated}</small></span>
      <span className="policy-project-status"><b>{project.deadline}</b><ChevronRight size={15} /></span>
    </button>
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

function RentTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return <div className="chart-tooltip"><span>{label}</span><strong>两房月租：{Number(payload[0].value).toLocaleString()} 元/月</strong></div>;
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
        <button onClick={() => onService("affordable-projects")}><ShieldCheck size={17} />政策住房<ChevronRight size={15} /></button>
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
  const drawerType = typeof type === "string" ? type : type.type;
  const content = drawerType === "mortgage" ? <Mortgage /> : drawerType === "fund" ? <Fund /> : drawerType === "buy-listings" ? <Listings kind="buy" /> : drawerType === "rent-listings" ? <Listings kind="rent" /> : drawerType === "community-sale-listings" ? <CommunityListings mode="sale" communityName={type.communityName} /> : drawerType === "community-rent-listings" ? <CommunityListings mode="rent" communityName={type.communityName} /> : drawerType === "rent-detail" ? <RentDetail home={type.home} /> : drawerType === "affordable-projects" ? <PolicyProjects /> : drawerType === "affordable-alerts" ? <PolicyAlerts /> : drawerType === "affordable-apply" ? <PolicyApplication /> : drawerType === "affordable-progress" ? <PolicyProgress /> : drawerType === "affordable-project-detail" ? <PolicyProjectDetail project={type.project} /> : <GenericService type={drawerType} />;
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
  const [selectedRent, setSelectedRent] = useState(null);
  const items = listings[kind];
  if (kind === "rent") {
    if (selectedRent) {
      return (
        <>
          <button className="detail-back" onClick={() => setSelectedRent(null)}><ArrowLeft size={15} />返回房源列表</button>
          <RentDetail home={selectedRent} />
        </>
      );
    }
    return (
      <>
        <div className="drawer-title"><span>KA 合作房源</span><small>当前模拟接入自如 · 杭州未来科技城周边</small></div>
        <div className="partner-banner">
          <span className="partner-logo">自如</span>
          <div><strong>来自合作平台的实时房源</strong><small>统一展示价格、通勤、签约与履约服务</small></div>
          <BadgeCheck size={18} />
        </div>
        <div className="filter-row"><button>未来科技城<ChevronDown size={13} /></button><button>5,500元内<ChevronDown size={13} /></button><button>整租优先<ChevronDown size={13} /></button><button aria-label="筛选"><SlidersHorizontal size={15} /></button></div>
        <div className="ka-home-list drawer-homes">
          {kaRentHomes.map((home, index) => <KAHousingCard key={home.id} home={home} rank={index + 1} compact onOpen={() => setSelectedRent(home)} />)}
        </div>
        <button className="primary-wide">进入自如查看更多房源<ArrowRight size={17} /></button>
        <p className="drawer-footnote">房源信息为 Demo 模拟数据，实际价格与可租状态以合作平台为准。</p>
      </>
    );
  }
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

function CommunityListings({ mode, communityName = "万科城市花园" }) {
  const [active, setActive] = useState(mode);
  const homes = communityHomes[active];
  return (
    <>
      <div className="drawer-title"><span>{communityName}房源</span><small>与小区市场卡片联动 · 模拟房源</small></div>
      <div className="community-listing-tabs"><button className={active === "sale" ? "active" : ""} onClick={() => setActive("sale")}>二手在售 62</button><button className={active === "rent" ? "active" : ""} onClick={() => setActive("rent")}>当前出租 18</button></div>
      <div className="community-listing-summary">
        <div><span>{active === "sale" ? "二手参考价" : "主流两房租金"}</span><strong>{active === "sale" ? "34,500 元/㎡" : "5,300 元/月"}</strong></div>
        <small>{active === "sale" ? "以下房源按单价接近参考价排序" : "以下房源按户型与租金匹配度排序"}</small>
      </div>
      <div className="community-home-list">
        {homes.map((home) => (
          <button className="community-home-card" key={home.title}>
            <span className="community-home-image" style={{ backgroundImage: `url(${home.image})` }}><em>{home.tag}</em></span>
            <span className="community-home-copy"><strong>{home.title.replace("万科城市花园", communityName)}</strong><small>{home.meta}</small><span>{home.unit}</span></span>
            <b>{home.price}<ChevronRight size={14} /></b>
          </button>
        ))}
      </div>
      <button className="primary-wide">{active === "sale" ? "查看全部二手房源" : "查看全部出租房源"}<ArrowRight size={17} /></button>
      <p className="drawer-footnote">房源及价格为 Demo 模拟数据，实际信息以合作平台为准。</p>
    </>
  );
}

function PolicyProjects() {
  const [selected, setSelected] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  if (selected) return <><button className="detail-back" onClick={() => setSelected(null)}><ArrowLeft size={15} />返回项目列表</button><PolicyProjectDetail project={selected} /></>;
  return (
    <>
      <div className="drawer-title"><span>杭州政策住房项目</span><small>聚合官方公告 · 项目状态定期更新</small></div>
      <div className="policy-source-banner"><ShieldCheck size={20} /><div><strong>官方信息结构化</strong><span>将分散在市级、各区和运营方的公告统一为可筛选项目</span></div></div>
      <div className="policy-live-summary">
        <span><strong>1</strong><small>开放申请中</small></span>
        <span><strong>1</strong><small>即将开放</small></span>
        <span><strong>今天 09:30</strong><small>最近更新</small></span>
        <button className={subscribed ? "active" : ""} onClick={() => setSubscribed(!subscribed)}>{subscribed ? <Check size={14} /> : <BellRing size={14} />}{subscribed ? "已订阅" : "订阅更新"}</button>
      </div>
      <div className="filter-row"><button>全部类型<ChevronDown size={13} /></button><button>工作区域<ChevronDown size={13} /></button><button>开放状态<ChevronDown size={13} /></button><button aria-label="筛选"><SlidersHorizontal size={15} /></button></div>
      <div className="policy-project-list drawer-policy-list">{affordableProjects.map((project) => <PolicyProjectCard key={project.name} project={project} onOpen={() => setSelected(project)} />)}</div>
      <p className="drawer-footnote">申请期和项目状态以最新官方公告为准，支付宝可提供变更提醒。</p>
    </>
  );
}

function PolicyProjectDetail({ project }) {
  const [subscribed, setSubscribed] = useState(false);
  return (
    <>
      <div className="drawer-title"><span>{project.name}</span><small>{project.area} · {project.type}</small></div>
      <div className="project-status-panel"><span>{project.stage} · {project.deadline}</span><strong>{project.rent}</strong><small>{project.layout}</small></div>
      <div className="policy-notice-meta">
        <span><CalendarClock size={15} /><strong>{project.deadline}</strong><small>关键时间</small></span>
        <span><RefreshCw size={15} /><strong>{project.updated}</strong><small>信息更新时间</small></span>
        <span><BadgeCheck size={15} /><strong>{project.sourceLevel}</strong><small>来源层级</small></span>
      </div>
      <div className="policy-detail-section"><strong>适合人群</strong><p>{project.fit}</p></div>
      <div className="policy-detail-section"><strong>常见准入核验项</strong><div className="requirement-grid"><span><BriefcaseBusiness size={16} />劳动关系 / 社保</span><span><FileCheck2 size={16} />居住证或户籍</span><span><Home size={16} />家庭住房情况</span><span><ShieldCheck size={16} />住房优惠状态</span></div></div>
      <div className="official-source-row"><BadgeCheck size={16} /><div><strong>已结构化官方公告</strong><span>{project.source} · 更新于 {project.updated}</span></div></div>
      <button className={`secondary-wide policy-subscribe-button ${subscribed ? "active" : ""}`} onClick={() => setSubscribed(!subscribed)}>{subscribed ? <><Check size={16} />已订阅项目变化</> : <><BellRing size={16} />订阅开放与截止提醒</>}</button>
      <button className="primary-wide">授权核验申请条件<ArrowRight size={17} /></button>
      <p className="drawer-footnote">当前为产品 Demo，不会实际提交政府申请。</p>
    </>
  );
}

function PolicyAlerts() {
  const [areas, setAreas] = useState(["上城区"]);
  const [types, setTypes] = useState(["人才房", "保租房"]);
  const [subscribed, setSubscribed] = useState(false);
  const toggle = (value, values, setValues) => setValues(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  return (
    <>
      <div className="drawer-title"><span>政策住房订阅</span><small>把分散公告变成支付宝里的主动提醒</small></div>
      <div className="alert-value"><BellRing size={23} /><div><strong>不错过开放、截止和补充材料</strong><span>匹配到新项目或申请状态变化时，通过支付宝消息通知。</span></div></div>
      <div className="alert-section"><strong>关注区域</strong><div className="select-chips">{["上城区", "拱墅区", "余杭区", "钱塘区"].map((area) => <button className={areas.includes(area) ? "active" : ""} key={area} onClick={() => toggle(area, areas, setAreas)}>{areas.includes(area) && <Check size={12} />}{area}</button>)}</div></div>
      <div className="alert-section"><strong>住房类型</strong><div className="select-chips">{["人才房", "保租房", "公租房", "蓝领公寓"].map((type) => <button className={types.includes(type) ? "active" : ""} key={type} onClick={() => toggle(type, types, setTypes)}>{types.includes(type) && <Check size={12} />}{type}</button>)}</div></div>
      <div className="alert-section"><strong>提醒内容</strong><div className="alert-rules"><span><CalendarClock size={16} /><div><b>开放与截止提醒</b><small>提前 3 天、当天各提醒一次</small></div><i>已开启</i></span><span><FileCheck2 size={16} /><div><b>材料与资格变化</b><small>公告条件变化时重新匹配</small></div><i>已开启</i></span><span><Clock3 size={16} /><div><b>申请进度提醒</b><small>补材料、选房、签约及时通知</small></div><i>已开启</i></span></div></div>
      <button className="primary-wide" onClick={() => setSubscribed(true)}>{subscribed ? <><Check size={16} />订阅已保存</> : <><BellRing size={16} />开启支付宝消息订阅</>}</button>
      {subscribed && <div className="subscription-success"><Check size={16} /><div><strong>已订阅 {areas.length} 个区域、{types.length} 类住房</strong><span>发现新公告后将自动判断是否与你匹配。</span></div></div>}
      <p className="drawer-footnote">提醒基于结构化公告，项目状态仍以官方渠道为准。</p>
    </>
  );
}

function PolicyApplication() {
  const [authorized, setAuthorized] = useState(false);
  const [generated, setGenerated] = useState(false);
  const checks = [["实名认证", "支付宝账户"], ["学历信息", "学信网授权"], ["就业与社保", "政务服务授权"], ["人才认定", "人才会客厅"], ["不动产情况", "政府部门核验"]];
  return (
    <>
      <div className="drawer-title"><span>申请材料智能准备</span><small>一次授权，生成项目所需材料清单</small></div>
      <div className="application-value"><UserCheck size={24} /><div><strong>少填表、少跑腿、避免漏材料</strong><span>支付宝仅在你授权后调用信息，正式申请仍以政府部门审核为准。</span></div></div>
      <div className="verification-list">
        {checks.map(([name, source], index) => <div key={name}><span className={authorized ? "verified" : ""}>{authorized ? <Check size={14} /> : index + 1}</span><div><strong>{name}</strong><small>{source}</small></div><em>{authorized ? "已获取模拟结果" : "待授权"}</em></div>)}
      </div>
      {!authorized ? <button className="primary-wide" onClick={() => setAuthorized(true)}>支付宝授权并开始核验</button> : <><div className="verification-result"><Check size={17} /><div><strong>预核验完成</strong><span>初步满足继续申请条件，建议选择具体项目后提交。</span></div></div><button className="primary-wide" onClick={() => setGenerated(true)}>{generated ? <><Check size={17} />申请表已生成</> : <>选择项目并生成申请表<ArrowRight size={17} /></>}</button>{generated && <div className="application-generated"><ReceiptText size={17} /><div><strong>申请信息已自动填充</strong><span>提交前仍可检查和修改，确认后将跳转官方申请入口。</span></div></div>}</>}
      <p className="drawer-footnote">预核验结果不代表政府审批结论。</p>
    </>
  );
}

function PolicyProgress() {
  const [view, setView] = useState("progress");
  const [paid, setPaid] = useState(false);
  return (
    <>
      <div className="drawer-title"><span>政策住房服务台</span><small>从申请进度持续服务到入住生活 · Demo</small></div>
      <div className="policy-service-tabs"><button className={view === "progress" ? "active" : ""} onClick={() => setView("progress")}>申请进度</button><button className={view === "movein" ? "active" : ""} onClick={() => setView("movein")}>入住服务预览</button></div>
      {view === "progress" ? <>
        <div className="progress-project"><span className="policy-type">人才专项租赁住房</span><strong>潮语贤庭</strong><small>申请编号：HZRC202606120018</small></div>
        <div className="application-timeline">
          {[["报名申请", "已完成", "6月10日"], ["资格审核", "审核中", "预计 3 个工作日"], ["摇号 / 选房", "待开始", "以项目通知为准"], ["签约入住", "待开始", "线上签约与缴费"]].map(([name, state, meta], index) => <div className={index < 2 ? "active" : ""} key={name}><i>{index === 0 ? <Check size={13} /> : index + 1}</i><span><strong>{name}</strong><small>{meta}</small></span><em>{state}</em></div>)}
        </div>
        <div className="progress-reminder"><Clock3 size={17} /><div><strong>支付宝消息提醒已开启</strong><span>状态变化、补充材料和选房时间将及时提醒。</span></div></div>
        <button className="secondary-wide progress-preview" onClick={() => setView("movein")}>预览审核通过后的服务<ArrowRight size={16} /></button>
      </> : <MoveInServices paid={paid} setPaid={setPaid} />}
    </>
  );
}

function MoveInServices({ paid, setPaid }) {
  return (
    <>
      <div className="movein-hero"><KeyRound size={23} /><div><strong>审核通过后，继续在支付宝办入住</strong><span>签约、缴租、公积金提取与生活服务统一承接。</span></div></div>
      <div className="rent-bill-card"><span><ReceiptText size={18} /><div><small>7月房租账单</small><strong>2,680 元</strong><em>7月5日前支付</em></div></span><button className={paid ? "paid" : ""} onClick={() => setPaid(true)}>{paid ? <><Check size={14} />已缴纳</> : <><CreditCard size={14} />立即缴租</>}</button></div>
      <div className="movein-services-grid">
        <button><FileCheck2 size={19} /><strong>在线签约</strong><small>查看合同与实名认证</small></button>
        <button><Landmark size={19} /><strong>公积金提取</strong><small>按月提取用于支付房租</small></button>
        <button><WalletCards size={19} /><strong>生活缴费</strong><small>水电燃气账单统一管理</small></button>
        <button><Truck size={19} /><strong>搬家保洁</strong><small>预约入住与维修服务</small></button>
      </div>
      <div className="progress-reminder"><BellRing size={17} /><div><strong>房租与合同提醒已开启</strong><span>缴费日前、合同到期前和政策复核前主动提醒。</span></div></div>
      <p className="drawer-footnote">入住服务为产品设想 Demo，实际能力以合作接入情况为准。</p>
    </>
  );
}

function RentDetail({ home }) {
  const [booked, setBooked] = useState(false);
  return (
    <>
      <div className="rent-detail-hero" style={{ backgroundImage: `url(${home.image})` }}>
        <span className="partner-logo">自如</span>
        <span className="detail-status">模拟房源 · 可预约</span>
      </div>
      <div className="rent-detail-title">
        <div><span>{home.title}</span><small>{home.layout} · {home.area} · {home.orientation}</small></div>
        <strong>{home.price.toLocaleString()}<small>元/月</small></strong>
      </div>
      <div className="detail-tags">{home.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="detail-reason"><Sparkles size={17} /><div><strong>Agent 推荐理由</strong><span>{home.reason}，{home.commute}。</span></div></div>
      <div className="detail-info">
        <div><TrainFront size={18} /><span><strong>交通通勤</strong><small>{home.subway}<br />{home.commute}</small></span></div>
        <div><KeyRound size={18} /><span><strong>签约入住</strong><small>线上签约 · 支持月付<br />房屋状态由合作方提供</small></span></div>
        <div><ShieldCheck size={18} /><span><strong>支付宝服务</strong><small>可尝试花呗免押<br />支持租房账单提醒</small></span></div>
        <div><CalendarClock size={18} /><span><strong>看房时间</strong><small>今天 18:30 后<br />明天全天可约</small></span></div>
      </div>
      <div className="detail-actions">
        <button className="secondary-wide"><MessageCircleMore size={16} />咨询管家</button>
        <button className="primary-wide" onClick={() => setBooked(true)}>{booked ? <><Check size={17} />已提交看房意向</> : <>预约看房<ArrowRight size={17} /></>}</button>
      </div>
      {booked && <div className="booking-success"><Check size={15} />自如管家将在 10 分钟内联系你确认时间（Demo）</div>}
      <p className="drawer-footnote">房源信息为 Demo 模拟数据，实际价格与可租状态以合作平台为准。</p>
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
