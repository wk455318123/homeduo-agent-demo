import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
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
  Heart,
  KeyRound,
  Landmark,
  List,
  LocateFixed,
  MapPin,
  Map,
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
import { matchAffordableProjects } from "./policyMatching.js";
import { resolveCommunityContext } from "./conversationContext.js";
import "./styles.css";

const BLUE = "#1677ff";
const LIGHT_BLUE = "#69a9ff";
const INK = "#17233d";
const DATA_UPDATED_DATE = new Intl.DateTimeFormat("zh-CN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date()).replaceAll("/", ".");
const DATA_UPDATED_SHORT = `${new Date().getMonth() + 1}月${new Date().getDate()}日`;

const trendData = [
  { month: "7月", price: 26890 },
  { month: "8月", price: 26720 },
  { month: "9月", price: 26780 },
  { month: "10月", price: 26490 },
  { month: "11月", price: 26540 },
  { month: "12月", price: 26210 },
  { month: "1月", price: 26320 },
  { month: "2月", price: 26040 },
  { month: "3月", price: 26110 },
  { month: "4月", price: 25870 },
  { month: "5月", price: 25960 },
  { month: "6月", price: 25765 },
];

const compareData = [
  { month: "1月", 余杭: 32800, 萧山: 30200 },
  { month: "2月", 余杭: 32500, 萧山: 30300 },
  { month: "3月", 余杭: 32650, 萧山: 29950 },
  { month: "4月", 余杭: 32050, 萧山: 30100 },
  { month: "5月", 余杭: 32120, 萧山: 29550 },
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
  { id: "trend", label: "杭州最近房价什么走势？", sub: "查看城市价格趋势与市场变化", icon: TrendingDown },
  { id: "budget", label: "300万预算，余杭和萧山怎么选？", sub: "预算选区", icon: WalletCards },
  { id: "rent", label: "我想在杭州租房，帮我找找", sub: "多平台租房", icon: Building2 },
  { id: "affordable", label: "我能申请杭州保租房或人才房吗？", sub: "政策住房", icon: ShieldCheck },
  { id: "community", label: "万科城市花园二手房价和租金？", sub: "小区行情", icon: Home },
  { id: "school", label: "万科城市花园学区怎么样？", sub: "入学政策", icon: CircleHelp },
];

const suggestions = {
  trend: ["300万预算适合看哪里？", "看看余杭和萧山对比", "我能贷多少钱？"],
  budget: ["查看余杭在售房源", "按我的收入算月供", "余杭最近房价走势"],
  rent: ["怎么提取公积金付房租？", "合作平台房源支持免押吗？", "想住得离公司更近"],
  community: ["这个小区近半年成交怎么样？", "查看该小区出租房源", "算一算租售比"],
  affordable: ["查看正在开放的项目", "人才房需要哪些材料？", "查询我的申请进度"],
  school: ["查询杭州入学政策", "看看小区生活便利度", "查看周边在售房源"],
};

const directFollowupServices = {
  "我能贷多少钱？": "mortgage",
  "查看余杭在售房源": "buy-listings",
  "按我的收入算月供": "mortgage",
  "怎么提取公积金付房租？": "fund",
  "合作平台房源支持免押吗？": "deposit",
  "查看正在开放的项目": "affordable-projects",
  "人才房需要哪些材料？": "affordable-apply",
  "查询我的申请进度": "affordable-progress",
  "查询杭州入学政策": "school-policy",
  "查看周边在售房源": "buy-listings",
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
    { title: "西溪北苑 · 平台整租", meta: "整租一居 · 42㎡ · 良睦路地铁站", price: "4,680元/月", tag: "花呗免押" },
    { title: "欧美金融城 · 精装一居", meta: "整租一居 · 46㎡ · 海创园通勤约15分钟", price: "4,980元/月", tag: "今日可看" },
    { title: "仓前 · 品质主卧", meta: "品质合租 · 独立卫浴 · 可月付", price: "3,280元/月", tag: "可月付" },
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
    { title: "万科城市花园 · 品质合租", meta: "主卧 · 独立卫浴 · 包保洁", price: "3,180元/月", unit: "合作平台模拟房源", tag: "预算更轻", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80" },
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
    partner: "贝壳租房",
    title: "欧美金融城 · 精装一居",
    location: "未来科技城",
    commute: "步行至海创园约 15 分钟",
    subway: "5号线创景路站 560m",
    layout: "整租一居",
    area: "46㎡",
    price: 4980,
    orientation: "朝南",
    tags: ["平台核验", "近地铁", "VR看房"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    reason: "距离公司近，房源信息已由平台核验",
  },
  {
    id: "cangqian",
    partner: "58同城",
    title: "仓前 · 房东直租主卧",
    location: "仓前",
    commute: "海创园通勤约 25 分钟",
    subway: "5号线葛巷站 920m",
    layout: "品质合租",
    area: "主卧 18㎡",
    price: 3280,
    orientation: "带独立卫浴",
    tags: ["个人房源", "独立卫浴", "可月付"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
    reason: "预算更轻，个人房源需进一步核验",
  },
  {
    id: "wuchang-two",
    partner: "安居客",
    title: "五常华元 · 南北两居",
    location: "西溪/五常",
    commute: "海创园通勤约 28 分钟",
    subway: "5号线五常站 650m",
    layout: "整租两居",
    area: "68㎡",
    price: 5480,
    orientation: "南北通透",
    tags: ["平台核验", "近地铁", "双卧室"],
    image: "https://images.unsplash.com/photo-1560185008-b033106af5c3?auto=format&fit=crop&w=900&q=80",
    reason: "适合两人合租或需要独立书房",
  },
  {
    id: "xianlin-two",
    partner: "我爱我家",
    title: "闲林山水 · 大两居",
    location: "仓前",
    commute: "海创园通勤约 35 分钟",
    subway: "公交接驳至地铁站",
    layout: "整租两居",
    area: "72㎡",
    price: 4380,
    orientation: "带阳台",
    tags: ["经纪人房源", "空间更大", "民水民电"],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    reason: "同预算获得更大的居住空间",
  },
  {
    id: "efc-loft",
    partner: "安居客",
    title: "欧美金融城 · 复式公寓",
    location: "未来科技城",
    commute: "海创园通勤约 12 分钟",
    subway: "5号线创景路站 430m",
    layout: "整租一居",
    area: "52㎡",
    price: 5200,
    orientation: "挑高复式",
    tags: ["公寓", "近地铁", "随时看房"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=80",
    reason: "通勤距离短，适合偏好公寓居住体验",
  },
  {
    id: "liangmu-room",
    partner: "贝壳租房",
    title: "良睦路地铁口 · 品质主卧",
    location: "未来科技城",
    commute: "海创园通勤约 20 分钟",
    subway: "5号线良睦路站 260m",
    layout: "品质合租",
    area: "主卧 20㎡",
    price: 3480,
    orientation: "朝南带阳台",
    tags: ["平台核验", "近地铁", "可月付"],
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    reason: "地铁通勤稳定，合租房间面积较大",
  },
  {
    id: "xixi-owner",
    partner: "58同城",
    title: "西溪北苑 · 房东直租两居",
    location: "西溪/五常",
    commute: "海创园通勤约 30 分钟",
    subway: "5号线五常站 980m",
    layout: "整租两居",
    area: "70㎡",
    price: 5050,
    orientation: "朝南",
    tags: ["个人房源", "无中介费", "可养宠"],
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=80",
    reason: "个人房源费用更轻，但需确认真实状态",
  },
  {
    id: "cangqian-one",
    partner: "我爱我家",
    title: "仓前梦想小镇 · 精装一居",
    location: "仓前",
    commute: "海创园通勤约 22 分钟",
    subway: "5号线葛巷站 730m",
    layout: "整租一居",
    area: "45㎡",
    price: 4250,
    orientation: "朝东",
    tags: ["经纪人房源", "精装修", "拎包入住"],
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    reason: "预算适中，通勤和独居体验较均衡",
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
    const { communityName: resolvedCommunity, nextCommunityContext } = resolveCommunityContext(id, text, communityContext, extractCommunityName);
    setCommunityContext(nextCommunityContext);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: "agent", id, query: text, communityName: resolvedCommunity }]);
      setLoading(false);
      setJourney((prev) => (prev.includes("获得分析") ? prev : [...prev, "获得分析"]));
    }, 900);
  };

  const openService = (type) => {
    setDrawer(type);
    setJourney((prev) => (prev.includes("继续办事") ? prev : [...prev, "继续办事"]));
  };

  const resetConversation = () => {
    setMessages([]);
    setInput("");
    setDrawer(null);
    setJourney(["了解需求"]);
    setCommunityContext("");
  };

  return (
    <div className="app-shell">
      <DesktopNav onService={openService} onReset={resetConversation} />
      <main className="agent-column">
        <Header onService={openService} onReset={resetConversation} />
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
                  <AgentAnswer key={index} animate={index === messages.length - 1} id={message.id} query={message.query} communityName={message.communityName} onAsk={ask} onService={openService} />
                )
              )}
              {loading && <LoadingAnswer />}
            </div>
          )}
        </section>
        <Composer value={input} setValue={setInput} onSend={() => ask(input)} onService={openService} />
      </main>
      <JourneyPanel journey={journey} onService={openService} onReset={resetConversation} />
      <BottomNav onService={openService} onReset={resetConversation} />
      {!consent && <Consent onAccept={() => setConsent(true)} />}
      {drawer && <ServiceDrawer type={drawer} onClose={() => setDrawer(null)} onNavigate={setDrawer} />}
    </div>
  );
}

function DesktopNav({ onService, onReset }) {
  return (
    <aside className="desktop-nav">
      <div className="brand-mark">支</div>
      <nav>
        <button className="nav-button" onClick={() => onService("ai-info")}><Sparkles size={20} /><span>AI</span></button>
        <button className="nav-button active" onClick={onReset}><Home size={20} /><span>房产</span></button>
        <button className="nav-button" onClick={() => onService("history")}><MessageCircleMore size={20} /><span>历史</span></button>
      </nav>
      <button className="avatar" onClick={() => onService("profile")}>吴</button>
    </aside>
  );
}

function Header({ onService, onReset }) {
  return (
    <header className="app-header">
      <button className="icon-button mobile-back" aria-label="返回" onClick={onReset}><ArrowLeft size={20} /></button>
      <div className="header-title">
        <div className="agent-logo"><Home size={17} /></div>
        <div><strong>房多多 Agent</strong><span>杭州 · 模拟数据演示</span></div>
      </div>
      <div className="header-actions">
        <button className="city-pill" onClick={() => onService("cities")}><MapPin size={15} />杭州<ChevronDown size={14} /></button>
        <button className="icon-button" aria-label="更多" onClick={() => onService("settings")}><MoreHorizontal size={20} /></button>
      </div>
    </header>
  );
}

function Welcome({ onAsk, onService }) {
  const featuredPrompt = prompts[0];
  const quickPrompts = prompts.slice(1, 4);
  const FeaturedIcon = featuredPrompt.icon;
  return (
    <div className="welcome">
      <section className="welcome-hero">
        <p className="eyebrow"><Sparkles size={14} />支付宝房产服务助手</p>
        <h1>杭州的房子，<br />从哪里开始了解？</h1>
        <p className="welcome-copy">问行情、找房源，也可以继续办理公积金与政策住房服务。</p>
      </section>
      <section className="welcome-discovery">
        <button className="featured-prompt" onClick={() => onAsk(featuredPrompt.label, featuredPrompt.id)}>
          <span className="featured-prompt-icon"><FeaturedIcon size={21} /></span>
          <span><small>今日推荐问题</small><strong>{featuredPrompt.label}</strong><em>{featuredPrompt.sub}</em></span>
          <ArrowRight size={18} />
        </button>
        <div className="quick-prompt-list">
          {quickPrompts.map(({ id, label, sub, icon: Icon }) => (
            <button key={id} onClick={() => onAsk(label, id)} className="quick-prompt">
              <span className="prompt-icon"><Icon size={17} /></span>
              <span><small>{sub}</small><strong>{label}</strong></span>
              <ChevronRight size={15} />
            </button>
          ))}
        </div>
      </section>
      <section className="welcome-service-section">
        <div className="welcome-section-title"><strong>常用服务</strong><span>在支付宝里继续办理</span></div>
        <div className="welcome-services">
          <button onClick={() => onService("buy-listings")}><span><Search size={18} /></span><strong>找房源</strong></button>
          <button onClick={() => onService("affordable-projects")}><span><ShieldCheck size={18} /></span><strong>政策住房</strong></button>
          <button onClick={() => onService("mortgage")}><span><Calculator size={18} /></span><strong>算月供</strong></button>
          <button onClick={() => onService("fund")}><span><Landmark size={18} /></span><strong>查公积金</strong></button>
        </div>
      </section>
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
  const [stage, setStage] = useState(0);
  const stages = ["识别问题意图", "调用模拟 MCP 数据", "完成内容风控与回答组装"];

  useEffect(() => {
    const timer = window.setInterval(() => setStage((current) => Math.min(current + 1, stages.length - 1)), 280);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="answer-row">
      <AgentMark />
      <div className="thinking pipeline-thinking">
        <div className="dots"><i /><i /><i /></div>
        <span>{stages[stage]}</span>
        <small>{stage + 1}/{stages.length}</small>
      </div>
    </div>
  );
}

function AgentAnswer({ id, query, communityName, onAsk, onService, animate = false }) {
  const unsupportedPlace = Object.entries({
    上海: /上海|浦东|闵行/,
    北京: /北京|朝阳|海淀/,
    广州: /广州|天河|番禺/,
    深圳: /深圳|南山|福田/,
    南京: /南京/,
    成都: /成都/,
    苏州: /苏州/,
    武汉: /武汉/,
    宁波: /宁波/,
  }).find(([, pattern]) => pattern.test(query))?.[0];
  const content = unsupportedPlace ? <CityBoundaryAnswer city={unsupportedPlace} onService={onService} /> : {
    trend: <TrendAnswer query={query} onService={onService} />,
    budget: <BudgetAnswer query={query} onService={onService} />,
    rent: <RentAnswer onService={onService} />,
    community: <CommunityAnswer query={query} communityName={communityName} onService={onService} />,
    affordable: <AffordableHousingAnswer onService={onService} />,
    school: <SchoolAnswer communityName={communityName} onService={onService} />,
    mortgage: <ServiceQueryAnswer id={id} query={query} communityName={communityName} onService={onService} />,
    fund: <ServiceQueryAnswer id={id} query={query} communityName={communityName} onService={onService} />,
    deposit: <ServiceQueryAnswer id={id} query={query} communityName={communityName} onService={onService} />,
    amenities: <ServiceQueryAnswer id={id} query={query} communityName={communityName} onService={onService} />,
    listings: <ServiceQueryAnswer id={id} query={query} communityName={communityName} onService={onService} />,
    "policy-projects": <ServiceQueryAnswer id={id} query={query} communityName={communityName} onService={onService} />,
    "policy-materials": <ServiceQueryAnswer id={id} query={query} communityName={communityName} onService={onService} />,
    "policy-progress": <ServiceQueryAnswer id={id} query={query} communityName={communityName} onService={onService} />,
    fallback: <FallbackAnswer query={query} onAsk={onAsk} onService={onService} />,
  }[id];
  const followups = unsupportedPlace ? [] : suggestions[id] || [];
  return (
    <div className="answer-row">
      <AgentMark />
      <div className={`answer-stack ${animate ? "streaming" : ""}`}>
        {content}
        {followups.length > 0 && <div className="followups">
          <span>继续问</span>
          {followups.map((question) => <button key={question} onClick={() => {
            const directService = question === "查看该小区出租房源"
              ? communityName === "万科城市花园" ? { type: "community-rent-listings", communityName } : "rent-listings"
              : question === "看看小区生活便利度"
                ? { type: "amenities", communityName }
                : directFollowupServices[question];
            directService ? onService(directService) : onAsk(question);
          }}>{question}<ChevronRight size={14} /></button>)}
        </div>}
      </div>
    </div>
  );
}

function FallbackAnswer({ query, onAsk, onService }) {
  return (
    <>
      <div className="answer-copy boundary">
        <div className="boundary-label"><CircleHelp size={16} />我还需要更具体一点</div>
        <strong>“{query}”涉及判断或信息范围较宽，当前 Demo 不会直接给出笼统结论。</strong>
        <p>你可以从房价趋势、预算选区、具体小区、租房或政策住房开始，我会基于已配置的数据和服务继续回答。</p>
      </div>
      <ServiceActions title="可以这样问" actions={[
        { icon: TrendingDown, title: "杭州最近房价走势", sub: "查看城市级趋势数据", type: "trend-question" },
        { icon: Building2, title: "帮我在杭州租房", sub: "按通勤与预算匹配", type: "rent-question" },
        { icon: ShieldCheck, title: "我能申请保租房吗", sub: "进行政策住房预匹配", type: "affordable-question" },
      ]} onService={(type) => {
        if (type === "trend-question") onAsk("杭州最近房价什么走势？");
        else if (type === "rent-question") onAsk("我想在杭州租房，帮我找找");
        else if (type === "affordable-question") onAsk("我能申请杭州保租房或人才房吗？");
        else onService(type);
      }} />
    </>
  );
}

function CityBoundaryAnswer({ city, onService }) {
  return (
    <>
      <div className="answer-copy boundary">
        <div className="boundary-label"><ShieldCheck size={16} />当前 Demo 能力边界</div>
        <strong>当前 Demo 仅配置杭州场景，暂不能准确回答{city}的房产问题。</strong>
        <p>我不会用杭州数据替代{city}数据。正式接入对应城市的数据和服务后，可再提供趋势、房源与政策住房办理。</p>
      </div>
      <ServiceActions title="可以先体验杭州能力" actions={[
        { icon: Search, title: "查看杭州房源", sub: "模拟合作房源", type: "buy-listings" },
        { icon: ShieldCheck, title: "查看杭州政策住房", sub: "模拟结构化公告", type: "affordable-projects" },
      ]} onService={onService} />
    </>
  );
}

function TrendAnswer({ query, onService }) {
  const specificArea = ["余杭", "萧山", "滨江", "西湖", "拱墅", "上城", "钱塘", "临平", "富阳", "临安", "未来科技城", "钱江新城", "奥体", "申花", "仓前", "闲林", "五常"].find((area) => query.includes(area));
  if (specificArea) {
    return (
      <>
        <div className="answer-copy boundary">
          <div className="boundary-label"><ShieldCheck size={16} />数据粒度说明</div>
          <strong>当前 Demo 暂未接入{specificArea}独立趋势数据。</strong>
          <p>不会用杭州整体趋势代替{specificArea}的区域走势。真实 MCP 接入后，应返回对应区域的价格、成交活跃度与更新时间。</p>
        </div>
        <ServiceActions title="可以继续" actions={[
          { icon: Search, title: `查看${specificArea}相关房源`, sub: "进入合作平台继续筛选", type: "buy-listings" },
          { icon: Calculator, title: "测算购房能力", sub: "月供与首付一起算", type: "mortgage" },
        ]} onService={onService} />
      </>
    );
  }
  return (
    <>
      <div className="answer-copy">
        <strong>杭州房价近一年整体温和下行，近期仍处于调整阶段。</strong>
        <p>截至 {DATA_UPDATED_SHORT}，杭州参考均价约为 25,765 元/㎡。近一个月变化约 -0.6%，不同板块分化明显，建议结合预算与自住需求看具体区域。</p>
      </div>
      <InsightCard title="杭州房产趋势" subtitle={`更新至 ${DATA_UPDATED_DATE}`}>
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

function BudgetAnswer({ query, onService }) {
  const supportedComparison = (/余杭/.test(query) && /萧山/.test(query)) || /300万预算适合看哪里/.test(query);
  if (!supportedComparison) {
    return (
      <>
        <div className="answer-copy boundary">
          <div className="boundary-label"><ShieldCheck size={16} />对比范围说明</div>
          <strong>当前 Demo 仅配置了余杭与萧山的预算对比数据。</strong>
          <p>不会将余杭、萧山的结论套用到其他区域。真实接入后，应基于用户指定区域重新获取价格、面积和通勤数据。</p>
        </div>
        <ServiceActions title="可以继续" actions={[
          { icon: Search, title: "查看预算内房源", sub: "按区域与总价筛选", type: "buy-listings" },
          { icon: Calculator, title: "按收入算月供", sub: "判断舒适预算", type: "mortgage" },
        ]} onService={onService} />
      </>
    );
  }
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
        <strong>可以，我先了解几个关键需求，再从多家合作平台供给中筛选合适房源。</strong>
        <p>租房最影响体验的是通勤、预算和租住类型。完成三步选择后，我会合并展示不同供给方的推荐结果，并明确标注来源。</p>
      </div>
      <RentalMatchFlow onService={onService} />
      <ServiceActions title="支付宝里继续租" actions={[
        { icon: Search, title: "浏览全部平台房源", sub: "多供给方聚合展示", type: "rent-market" },
        { icon: ShieldCheck, title: "花呗免押", sub: "减少入住资金压力", type: "deposit" },
        { icon: Landmark, title: "公积金付房租", sub: "查询可提取额度", type: "fund" },
      ]} onService={onService} />
      <div className="source-note"><span>模拟聚合供给：贝壳租房、安居客、58同城、自如、我爱我家等</span><span>支付宝负责需求理解与聚合呈现，房源价格和可租状态以各供给方实时信息为准。</span></div>
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
          <span className="ka-label"><BadgeCheck size={13} />多平台房源智能匹配</span>
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
          <div className="match-reason"><Sparkles size={15} /><span>综合通勤、预算和房型，为你优先推荐不同供给方的房源</span></div>
          <div className="ka-home-list">
            {recommended.map((home, index) => <KAHousingCard key={home.id} home={home} rank={index + 1} onOpen={() => onService({ type: "rent-detail", home })} />)}
          </div>
          <button className="match-more" onClick={() => onService("rent-market")}>进入完整租房频道<ArrowRight size={15} /></button>
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

function ServiceQueryAnswer({ id, query, communityName, onService }) {
  const hasCommunity = communityName && communityName !== "该小区";
  const hasCommunityData = communityName === "万科城市花园";
  const wantsRentListings = /租|出租/.test(query);
  const configs = {
    mortgage: {
      title: "能贷多少、月供多少，需要结合房屋总价、首付比例、贷款期限和公积金情况测算。",
      copy: "你可以先用房贷计算器判断月供压力，再授权查询公积金余额与预计可贷额度。实际贷款结果以金融机构审批为准。",
      actions: [
        { icon: Calculator, title: "打开房贷计算器", sub: "调整总价、首付与期限", type: "mortgage" },
        { icon: Landmark, title: "查询公积金", sub: "了解余额与预计额度", type: "fund" },
      ],
    },
    fund: {
      title: "可以通过支付宝授权查询杭州公积金账户，并继续办理贷款测算或租房提取。",
      copy: "租房提取额度、频次和材料要求以杭州公积金官方服务返回结果为准，Demo 不直接判断你一定可以提取。",
      actions: [{ icon: Landmark, title: "授权查询公积金", sub: "查看余额、贷款与提取", type: "fund" }],
    },
    deposit: {
      title: "部分合作平台房源可申请花呗免押，但并非所有房源都支持。",
      copy: "是否免押取决于房源合作方、签约方式和授权评估结果，建议先筛选带有“花呗免押”标识的房源。",
      actions: [
        { icon: ShieldCheck, title: "了解免押服务", sub: "查看授权评估流程", type: "deposit" },
        { icon: Building2, title: "查看支持免押的房源", sub: "来自多家合作平台", type: "rent-market" },
      ],
    },
    amenities: {
      title: hasCommunity ? `可以继续查看${communityName}周边的交通、商业、医疗与生活服务。` : "请先告诉我具体小区，我再帮你查看周边生活便利度。",
      copy: hasCommunity ? "便利度信息适合作为居住参考，不代表学区、入学资格或房产价值判断。" : "目前没有明确的小区上下文，不会用其他小区的信息替代。",
      actions: hasCommunity ? [{ icon: Navigation, title: "查看生活便利度", sub: communityName, type: { type: "amenities", communityName } }] : [],
    },
    listings: {
      title: hasCommunityData ? `已定位到${communityName}，可以继续查看相关${wantsRentListings ? "出租" : "在售"}房源。` : hasCommunity ? `已识别${communityName}，但当前 Demo 暂未接入该小区房源。` : `可以继续查看杭州${wantsRentListings ? "租赁" : "在售"}房源。`,
      copy: hasCommunity && !hasCommunityData ? "不会用其他小区房源替代回答，你可以先进入合作平台继续搜索。" : "房源价格与可租、可售状态由合作平台提供，实际信息以进入合作服务后的实时结果为准。",
      actions: [{
        icon: Search,
        title: wantsRentListings ? "查看出租房源" : "查看在售房源",
        sub: hasCommunityData ? communityName : "杭州合作平台房源",
        type: hasCommunityData
          ? { type: wantsRentListings ? "community-rent-listings" : "community-sale-listings", communityName }
          : wantsRentListings ? "rent-listings" : "buy-listings",
      }],
    },
    "policy-projects": {
      title: "可以查看当前开放、即将开放和常态化登记的政策住房项目。",
      copy: "支付宝可将分散在不同官方渠道的公告结构化展示，并提供开放、截止和材料变化提醒。",
      actions: [{ icon: Search, title: "查看政策住房项目", sub: "按区域、类型与状态筛选", type: "affordable-projects" }],
    },
    "policy-materials": {
      title: "人才房常见核验材料包括身份、学历、就业社保、人才认定、家庭住房和住房优惠情况。",
      copy: "不同项目要求并不完全一致。支付宝可在授权后预核验并生成材料清单，正式申请仍以具体项目公告为准。",
      actions: [{ icon: FileCheck2, title: "准备申请材料", sub: "授权核验并生成清单", type: "affordable-apply" }],
    },
    "policy-progress": {
      title: "可以统一查看政策住房的报名、资格审核、选房和签约进度。",
      copy: "状态变化、补充材料和选房时间可通过支付宝消息提醒，最终结果以政府部门审核为准。",
      actions: [{ icon: Clock3, title: "查询申请进度", sub: "查看审核与入住服务", type: "affordable-progress" }],
    },
  };
  const config = configs[id];
  return (
    <>
      <div className="answer-copy">
        <strong>{config.title}</strong>
        <p>{config.copy}</p>
      </div>
      {config.actions.length > 0 && <ServiceActions title="继续办理" actions={config.actions} onService={onService} />}
    </>
  );
}

function CommunityAnswer({ query, communityName = "万科城市花园", onService }) {
  if (communityName !== "万科城市花园") {
    const hasName = communityName && communityName !== "该小区";
    return (
      <>
        <div className="answer-copy boundary">
          <div className="boundary-label"><ShieldCheck size={16} />数据边界说明</div>
          <strong>{hasName ? `当前 Demo 暂未接入${communityName}的结构化小区数据。` : "请告诉我具体小区名称，我再查询小区数据。"}</strong>
          <p>{hasName ? "我不会用杭州整体趋势或其他小区的数据代替回答。接入真实 MCP 后，可按小区返回二手成交、租金与房源卡片。" : "例如可以问“万科城市花园二手房价和租金怎么样”。"}</p>
        </div>
        <ServiceActions title="可以继续" actions={[
          { icon: Search, title: "查看杭州在售房源", sub: "按区域与预算筛选", type: "buy-listings" },
          { icon: Building2, title: "查看杭州出租房源", sub: "来自多家合作平台", type: "rent-market" },
        ]} onService={onService} />
      </>
    );
  }
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
        <span className="market-update"><Clock3 size={12} />更新至 {DATA_UPDATED_DATE}</span>
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
      <div className="source-note"><span>政策能力演示参考：杭州市住房租赁公众服务平台等官方渠道</span><span>当前项目、日期与状态均为 Demo 模拟，正式信息以官方公告和审批结果为准。</span></div>
    </>
  );
}

function PolicyHousingMatcher({ onService }) {
  const [identity, setIdentity] = useState("");
  const [workArea, setWorkArea] = useState("");
  const [housing, setHousing] = useState("");
  const step = !identity ? 1 : !workArea ? 2 : !housing ? 3 : 4;
  const matches = matchAffordableProjects(affordableProjects, identity, workArea);

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
            {matches.length === 0 && <div className="policy-no-match"><BellRing size={18} /><div><strong>当前模拟项目中没有精确匹配</strong><span>不会推荐其他区域项目替代。可以订阅 {workArea} 新项目开放提醒。</span></div><button onClick={() => onService("affordable-alerts")}>订阅提醒</button></div>}
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

function SchoolAnswer({ communityName = "该小区", onService }) {
  const displayName = communityName === "该小区" ? "该小区" : communityName;
  return (
    <>
      <div className="answer-copy boundary">
        <div className="boundary-label"><ShieldCheck size={16} />能力边界说明</div>
        <strong>学区划分和入学政策可能每年调整，我不能仅依据房产趋势数据判断入学资格。</strong>
        <p>{displayName}周边教育资源可以作为居住参考，但具体对应学校、落户年限和入学条件，请以杭州市及属地区教育部门当年公布的信息为准。</p>
      </div>
      <button className="official-card" onClick={() => onService("school-policy")}>
        <div className="official-icon"><FileCheck2 size={21} /></div>
        <div><strong>查询杭州官方入学政策</strong><span>该回答未引用实时房产趋势数据</span></div>
        <ChevronRight size={18} />
      </button>
      <ServiceActions title="还可以了解" actions={[
        { icon: Navigation, title: "查看生活便利度", sub: "交通、商业与医疗", type: { type: "amenities", communityName: displayName } },
        { icon: Search, title: "查看周边房源", sub: "仅作为居住选择参考", type: "buy-listings" },
      ]} onService={onService} />
    </>
  );
}

function InsightCard({ title, subtitle, children }) {
  return <section className="insight-card"><div className="card-title"><div><strong>{title}</strong><span>{subtitle}</span></div><span className="card-more" aria-hidden="true"><MoreHorizontal size={18} /></span></div>{children}</section>;
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

function Composer({ value, setValue, onSend, onService }) {
  return (
    <div className="composer-wrap">
      <div className="composer">
        <button className="icon-button" aria-label="添加" onClick={() => onService("attachments")}><Plus size={20} /></button>
        <input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSend()} placeholder="问问杭州房价、租房或公积金…" />
        <button className="icon-button" aria-label="语音" onClick={() => onService("voice")}><Mic size={20} /></button>
        <button className="send-button" onClick={onSend} aria-label="发送"><Send size={17} /></button>
      </div>
      <span className="composer-note">AI回答仅供参考，重要信息请以官方渠道为准</span>
    </div>
  );
}

function JourneyPanel({ journey, onService, onReset }) {
  const steps = ["了解需求", "获得分析", "继续办事"];
  return (
    <aside className="journey-panel">
      <div className="journey-head"><span>本次看房旅程</span><button onClick={onReset}><RefreshCw size={15} />新对话</button></div>
      <div className="journey-steps">
        {steps.map((step, index) => <div className={journey.includes(step) ? "done" : ""} key={step}><i>{journey.includes(step) ? <Check size={13} /> : index + 1}</i><span>{step}</span></div>)}
      </div>
      <div className="side-section">
        <strong>杭州常用服务</strong>
        <button onClick={() => onService("fund")}><Landmark size={17} />公积金查询<ChevronRight size={15} /></button>
        <button onClick={() => onService("affordable-projects")}><ShieldCheck size={17} />政策住房<ChevronRight size={15} /></button>
        <button onClick={() => onService("mortgage")}><Calculator size={17} />房贷计算器<ChevronRight size={15} /></button>
        <button onClick={() => onService("rent-market")}><Building2 size={17} />多平台租房<ChevronRight size={15} /></button>
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

function ServiceDrawer({ type, onClose, onNavigate }) {
  const drawerType = typeof type === "string" ? type : type.type;
  const fullPage = drawerType === "rent-market";
  const content = renderServiceContent(drawerType, type, onNavigate);
  return (
    <div className={`drawer-backdrop ${fullPage ? "full-backdrop" : ""}`} onClick={onClose}>
      <section className={`service-drawer ${fullPage ? "full-service-page" : ""}`} onClick={(event) => event.stopPropagation()}>
        {!fullPage && <div className="drawer-handle" />}
        <button className="drawer-close" aria-label="关闭" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onClose(); }}><X size={17} /><span>关闭</span></button>
        {content}
      </section>
    </div>
  );
}

function renderServiceContent(drawerType, request, onNavigate) {
  const renderers = {
    mortgage: () => <Mortgage />,
    fund: () => <Fund />,
    "buy-listings": () => <Listings kind="buy" />,
    "rent-listings": () => <Listings kind="rent" onNavigate={onNavigate} />,
    "rent-market": () => <RentalMarketplace />,
    "community-sale-listings": () => <CommunityListings mode="sale" communityName={request.communityName} />,
    "community-rent-listings": () => <CommunityListings mode="rent" communityName={request.communityName} />,
    "rent-detail": () => <RentDetail home={request.home} />,
    "affordable-projects": () => <PolicyProjects />,
    "affordable-alerts": () => <PolicyAlerts />,
    "affordable-apply": () => <PolicyApplication />,
    "affordable-progress": () => <PolicyProgress />,
    "affordable-project-detail": () => <PolicyProjectDetail project={request.project} />,
  };

  return renderers[drawerType]?.() ?? <GenericService type={drawerType} request={request} />;
}

function Listings({ kind, onNavigate }) {
  const [selectedRent, setSelectedRent] = useState(null);
  const [selectedBuy, setSelectedBuy] = useState(null);
  const [feedback, setFeedback] = useState("");
  const items = listings[kind];
  if (selectedBuy) return <><button className="detail-back" onClick={() => setSelectedBuy(null)}><ArrowLeft size={15} />返回房源列表</button><SimpleListingDetail item={selectedBuy} mode="sale" /></>;
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
        <div className="drawer-title"><span>多平台租房供给</span><small>模拟聚合多家合作平台 · 杭州未来科技城周边</small></div>
        <div className="partner-banner">
          <span className="partner-logo multi">多家</span>
          <div><strong>聚合多家合作平台的房源供给</strong><small>统一展示来源、价格、通勤与核验状态</small></div>
          <BadgeCheck size={18} />
        </div>
        <div className="filter-row"><button onClick={() => setFeedback("位置筛选：未来科技城")}>未来科技城<ChevronDown size={13} /></button><button onClick={() => setFeedback("预算筛选：5,500 元内")}>5,500元内<ChevronDown size={13} /></button><button onClick={() => setFeedback("租住类型：整租优先")}>整租优先<ChevronDown size={13} /></button><button aria-label="更多筛选" onClick={() => setFeedback("更多筛选条件已展开（Demo）")}><SlidersHorizontal size={15} /></button></div>
        <div className="ka-home-list drawer-homes">
          {kaRentHomes.map((home, index) => <KAHousingCard key={home.id} home={home} rank={index + 1} compact onOpen={() => setSelectedRent(home)} />)}
        </div>
        <button className="primary-wide" onClick={() => onNavigate("rent-market")}>进入完整租房频道<ArrowRight size={17} /></button>
        {feedback && <ActionFeedback text={feedback} />}
        <p className="drawer-footnote">房源信息为 Demo 模拟数据，实际价格与可租状态以合作平台为准。</p>
      </>
    );
  }
  return (
    <>
      <div className="drawer-title"><span>{kind === "buy" ? "预算内在售房源" : "未来科技城周边租房"}</span><small>聚合展示 · 模拟房源</small></div>
      <div className="filter-row"><button onClick={() => setFeedback("区域筛选已展开（Demo）")}>区域<ChevronDown size={13} /></button><button onClick={() => setFeedback("总价筛选已展开（Demo）")}>总价<ChevronDown size={13} /></button><button onClick={() => setFeedback("户型筛选已展开（Demo）")}>户型<ChevronDown size={13} /></button><button aria-label="更多筛选" onClick={() => setFeedback("更多筛选条件已展开（Demo）")}><SlidersHorizontal size={15} /></button></div>
      <div className="listing-list">
        {items.map((item, index) => <button className="listing-item" key={item.title} onClick={() => setSelectedBuy(item)}><span className={`listing-image image-${index + 1}`}><Home size={25} /></span><span className="listing-content"><strong>{item.title}</strong><small>{item.meta}</small><em>{item.tag}</em></span><b>{item.price}</b></button>)}
      </div>
      <button className="primary-wide" onClick={() => setFeedback("将进入合作房源服务查看实时在售状态（Demo）")}>进入房源服务查看更多<ArrowRight size={17} /></button>
      {feedback && <ActionFeedback text={feedback} />}
    </>
  );
}

function RentalMarketplace() {
  const [partner, setPartner] = useState("全部");
  const [location, setLocation] = useState("全部区域");
  const [price, setPrice] = useState("不限租金");
  const [layout, setLayout] = useState("全部户型");
  const [sort, setSort] = useState("智能排序");
  const [view, setView] = useState("list");
  const [query, setQuery] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const [extraFilters, setExtraFilters] = useState([]);
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState([]);
  const [service, setService] = useState("");
  const cycle = (current, options, setter) => setter(options[(options.indexOf(current) + 1) % options.length]);
  const partners = ["全部", "贝壳租房", "安居客", "58同城", "自如", "我爱我家"];
  const extraOptions = ["整租", "合租", "公寓", "个人房源", "平台核验", "近地铁", "可月付", "无中介费"];
  const matchesExtraFilter = (home, filter) => {
    if (filter === "整租") return home.layout.startsWith("整租");
    if (filter === "合租") return home.layout.includes("合租");
    if (filter === "公寓") return home.title.includes("公寓") || home.tags.includes("公寓");
    return home.tags.includes(filter);
  };
  const filtered = useMemo(() => {
    const result = kaRentHomes.filter((home) =>
      (partner === "全部" || home.partner === partner) &&
      (location === "全部区域" || home.location === location) &&
      (price === "不限租金" || price === "4,000元内" && home.price <= 4000 || price === "4,000-5,000元" && home.price > 4000 && home.price <= 5000 || price === "5,000元以上" && home.price > 5000) &&
      (layout === "全部户型" || home.layout === layout) &&
      extraFilters.every((filter) => matchesExtraFilter(home, filter)) &&
      (!query.trim() || `${home.title}${home.location}${home.layout}${home.partner}${home.tags.join("")}`.includes(query.trim()))
    );
    return [...result].sort((a, b) => sort === "租金从低到高" ? a.price - b.price : sort === "通勤优先" ? Number(a.commute.match(/\d+/)?.[0] || 99) - Number(b.commute.match(/\d+/)?.[0] || 99) : 0);
  }, [partner, location, price, layout, extraFilters, sort, query]);
  const toggleSaved = (id) => setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  const toggleExtraFilter = (filter) => {
    const removing = extraFilters.includes(filter);
    setExtraFilters((items) => removing ? items.filter((item) => item !== filter) : [...items, filter]);
    setService(removing ? `已取消筛选条件：${filter}` : `已加入筛选条件：${filter}`);
  };
  const hasActiveFilters = partner !== "全部" || location !== "全部区域" || price !== "不限租金" || layout !== "全部户型" || extraFilters.length > 0 || query.trim();
  const resetFilters = () => {
    setPartner("全部");
    setLocation("全部区域");
    setPrice("不限租金");
    setLayout("全部户型");
    setExtraFilters([]);
    setSort("智能排序");
    setQuery("");
    setService("");
  };
  if (selected) return <MarketplaceRentalDetail home={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="rental-marketplace">
      <header className="marketplace-header">
        <div className="marketplace-title"><span className="agent-logo"><Home size={17} /></span><div><strong>杭州租房</strong><small>支付宝聚合找房 · 多平台供给</small></div></div>
        <div className="marketplace-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜区域、小区、地铁或房源特色" /></div>
        <button className="marketplace-agent" onClick={() => setService("告诉我通勤、预算和户型，我可以重新为你智能匹配。")}><Sparkles size={16} />Agent 帮我找</button>
      </header>

      <section className="marketplace-source-bar">
        <div><strong>房源来源</strong><span>聚合多平台供给，来源清晰可见</span></div>
        <nav>{partners.map((item) => <button className={partner === item ? "active" : ""} key={item} onClick={() => setPartner(item)}>{item}{item !== "全部" && <small>{kaRentHomes.filter((home) => home.partner === item).length}</small>}</button>)}</nav>
      </section>

      <section className="marketplace-filters">
        <div className="filter-primary">
          <button onClick={() => cycle(location, ["全部区域", "未来科技城", "仓前", "西溪/五常"], setLocation)}><MapPin size={14} />{location}<ChevronDown size={13} /></button>
          <button onClick={() => cycle(price, ["不限租金", "4,000元内", "4,000-5,000元", "5,000元以上"], setPrice)}><WalletCards size={14} />{price}<ChevronDown size={13} /></button>
          <button onClick={() => cycle(layout, ["全部户型", "整租一居", "整租两居", "品质合租"], setLayout)}><BedDouble size={14} />{layout}<ChevronDown size={13} /></button>
          <button className={moreOpen || extraFilters.length ? "active" : ""} onClick={() => setMoreOpen(!moreOpen)}><SlidersHorizontal size={14} />筛选{extraFilters.length > 0 && <em>{extraFilters.length}</em>}</button>
          {hasActiveFilters && <button className="clear-filters" onClick={resetFilters}>重置</button>}
        </div>
        {moreOpen && <div className="filter-more"><span>房源类型</span>{extraOptions.map((item) => <button className={extraFilters.includes(item) ? "active" : ""} key={item} onClick={() => toggleExtraFilter(item)}>{extraFilters.includes(item) && <Check size={12} />}{item}</button>)}</div>}
      </section>

      <section className="marketplace-toolbar">
        <div><strong>{filtered.length} 套模拟房源</strong><span>多平台聚合结果</span></div>
        <div className="marketplace-trust"><BadgeCheck size={15} />明确标注来源、核验状态与更新时间</div>
        <button onClick={() => cycle(sort, ["智能排序", "租金从低到高", "通勤优先"], setSort)}><ArrowUpDown size={14} />{sort}</button>
        <div className="view-switch"><button className={view === "list" ? "active" : ""} onClick={() => setView("list")}><List size={15} />列表</button><button className={view === "map" ? "active" : ""} onClick={() => setView("map")}><Map size={15} />地图</button></div>
      </section>

      {service && <ActionFeedback text={service} />}
      {view === "list" ? (
        <div className="marketplace-grid">
          {filtered.map((home) => <MarketplaceHomeCard key={home.id} home={home} saved={saved.includes(home.id)} onSave={() => toggleSaved(home.id)} onOpen={() => setSelected(home)} />)}
          {filtered.length === 0 && <div className="marketplace-empty"><Search size={24} /><strong>暂无符合当前条件的房源</strong><span>可以放宽区域、租金或户型条件继续查看。</span></div>}
        </div>
      ) : (
        <div className="marketplace-map-layout">
          <div className="marketplace-map">
            <div className="map-road road-one" /><div className="map-road road-two" /><div className="map-water" />
            {filtered.map((home, index) => <button className="map-marker" style={{ left: `${18 + index % 4 * 20}%`, top: `${18 + index % 3 * 25}%` }} key={home.id} onClick={() => setSelected(home)}><strong>{(home.price / 1000).toFixed(1)}k</strong><span>{home.partner}</span></button>)}
          </div>
          <aside className="map-result-list">{filtered.slice(0, 5).map((home) => <button key={home.id} onClick={() => setSelected(home)}><span className="map-result-image" style={{ backgroundImage: `url(${home.image})` }} /><span><strong>{home.title}</strong><small>{home.layout} · {home.commute}</small></span><b>{home.price.toLocaleString()}<small>元/月</small></b></button>)}</aside>
        </div>
      )}
      <footer className="marketplace-footnote">当前为多平台聚合产品 Demo，房源均为模拟展示；正式接入后，价格、状态、核验与服务规则以对应供给方返回为准。</footer>
    </div>
  );
}

function MarketplaceHomeCard({ home, saved, onSave, onOpen }) {
  return (
    <article className="marketplace-home-card">
      <button className="marketplace-home-image" style={{ backgroundImage: `url(${home.image})` }} onClick={onOpen}><span>{home.partner}</span><em>{home.tags.includes("个人房源") ? "个人房源 · 待进一步核验" : "平台供给 · 模拟核验"}</em></button>
      <div className="marketplace-home-content">
        <div className="marketplace-home-top"><button onClick={onOpen}><strong>{home.title}</strong><small>{home.layout} · {home.area} · {home.orientation}</small></button><button className={saved ? "saved" : ""} onClick={onSave} aria-label={saved ? "取消收藏" : "收藏房源"}><Heart size={17} /></button></div>
        <span className="marketplace-commute"><TrainFront size={13} />{home.subway} · {home.commute}</span>
        <div className="marketplace-tags">{home.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
        <div className="marketplace-card-foot"><span><BadgeCheck size={13} />来源：{home.partner} · 更新于今天</span><strong>{home.price.toLocaleString()}<small>元/月</small></strong></div>
        <button className="marketplace-open" onClick={onOpen}>查看详情与费用说明<ChevronRight size={15} /></button>
      </div>
    </article>
  );
}

function MarketplaceRentalDetail({ home, onBack }) {
  const [consulted, setConsulted] = useState(false);
  const [booked, setBooked] = useState(false);
  const personal = home.tags.includes("个人房源");
  return (
    <div className="marketplace-detail">
      <button className="detail-back" onClick={onBack}><ArrowLeft size={15} />返回全部租房房源</button>
      <div className="marketplace-detail-layout">
        <div className="marketplace-detail-main">
          <div className="marketplace-detail-hero" style={{ backgroundImage: `url(${home.image})` }}><span>{home.partner}</span><em>模拟房源</em></div>
          <div className="marketplace-detail-title"><div><strong>{home.title}</strong><span>{home.layout} · {home.area} · {home.orientation}</span></div><b>{home.price.toLocaleString()}<small>元/月</small></b></div>
          <div className="marketplace-tags">{home.tags.map((tag) => <i key={tag}>{tag}</i>)}</div>
          <div className="marketplace-detail-grid">
            <div><TrainFront size={18} /><span><strong>交通通勤</strong><small>{home.subway}<br />{home.commute}</small></span></div>
            <div><ReceiptText size={18} /><span><strong>费用说明</strong><small>{personal ? "个人房源，费用需与发布方确认" : "费用规则由供给平台提供"}<br />签约前再次确认</small></span></div>
            <div><BadgeCheck size={18} /><span><strong>房源核验</strong><small>{personal ? "个人发布，建议线下核验" : "平台供给，核验状态以来源方为准"}<br />支付宝不替代平台核验</small></span></div>
            <div><ShieldCheck size={18} /><span><strong>支付宝服务</strong><small>支持咨询与看房意向<br />后续可承接缴租提醒</small></span></div>
          </div>
          <div className="detail-reason"><Sparkles size={17} /><div><strong>Agent 推荐理由</strong><span>{home.reason}，{home.commute}。</span></div></div>
        </div>
        <aside className="marketplace-detail-aside">
          <div className="source-disclosure"><span className="partner-logo multi">{home.partner.slice(0, 2)}</span><div><strong>房源来源：{home.partner}</strong><small>支付宝聚合展示，不直接发布房源</small></div></div>
          <div className="source-rules"><span><b>房源状态</b><em>以 {home.partner} 实时返回为准</em></span><span><b>咨询服务</b><em>由对应供给方承接</em></span><span><b>风险提示</b><em>签约前核验产权、合同与费用</em></span></div>
          {(consulted || booked) && <ActionFeedback text={`${home.partner}将继续确认房源实时状态和看房安排（Demo）`} />}
        </aside>
      </div>
      <div className="marketplace-detail-bottom-actions">
        <button className="secondary-wide" onClick={() => setConsulted(true)}>{consulted ? <><Check size={16} />已咨询</> : <><MessageCircleMore size={16} />咨询平台</>}</button>
        <button className="primary-wide" onClick={() => setBooked(true)}>{booked ? <><Check size={16} />已预约</> : <>预约看房<ArrowRight size={16} /></>}</button>
      </div>
    </div>
  );
}

function CommunityListings({ mode, communityName = "万科城市花园" }) {
  const [active, setActive] = useState(mode);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState("");
  const homes = communityHomes[active];
  if (selected) return <><button className="detail-back" onClick={() => setSelected(null)}><ArrowLeft size={15} />返回小区房源</button><SimpleListingDetail item={selected} mode={active} communityName={communityName} /></>;
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
          <button className="community-home-card" key={home.title} onClick={() => setSelected(home)}>
            <span className="community-home-image" style={{ backgroundImage: `url(${home.image})` }}><em>{home.tag}</em></span>
            <span className="community-home-copy"><strong>{home.title.replace("万科城市花园", communityName)}</strong><small>{home.meta}</small><span>{home.unit}</span></span>
            <b>{home.price}<ChevronRight size={14} /></b>
          </button>
        ))}
      </div>
      <button className="primary-wide" onClick={() => setFeedback(`将进入合作平台查看${communityName}全部${active === "sale" ? "二手" : "出租"}房源（Demo）`)}>{active === "sale" ? "查看全部二手房源" : "查看全部出租房源"}<ArrowRight size={17} /></button>
      {feedback && <ActionFeedback text={feedback} />}
      <p className="drawer-footnote">房源及价格为 Demo 模拟数据，实际信息以合作平台为准。</p>
    </>
  );
}

function SimpleListingDetail({ item, mode, communityName }) {
  const [submitted, setSubmitted] = useState(false);
  const isRent = mode === "rent";
  const title = communityName ? item.title.replace("万科城市花园", communityName) : item.title;
  return (
    <>
      <div className="drawer-title"><span>{title}</span><small>{isRent ? "出租房源详情" : "在售房源详情"} · 模拟展示</small></div>
      {item.image ? <div className="simple-listing-image" style={{ backgroundImage: `url(${item.image})` }} /> : <div className="simple-listing-placeholder"><Home size={32} /></div>}
      <div className="simple-listing-price"><strong>{item.price}</strong>{item.unit && <span>{item.unit}</span>}</div>
      <div className="policy-detail-section"><strong>房源信息</strong><p>{item.meta}</p></div>
      <div className="official-source-row"><BadgeCheck size={16} /><div><strong>合作平台房源</strong><span>实际价格与可租、可售状态以合作平台实时信息为准。</span></div></div>
      <button className="primary-wide" onClick={() => setSubmitted(true)}>{submitted ? <><Check size={16} />已提交咨询意向</> : <>{isRent ? "预约看房" : "咨询房源"}<ArrowRight size={17} /></>}</button>
      {submitted && <ActionFeedback text="合作平台顾问将联系你确认房源状态（Demo）" />}
    </>
  );
}

function ActionFeedback({ text }) {
  return <div className="action-feedback"><Check size={15} /><span>{text}</span></div>;
}

function PolicyProjects() {
  const [selected, setSelected] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [typeFilter, setTypeFilter] = useState("全部类型");
  const [areaFilter, setAreaFilter] = useState("全部区域");
  const [stageFilter, setStageFilter] = useState("全部状态");
  const cycle = (current, options, setter) => setter(options[(options.indexOf(current) + 1) % options.length]);
  const filteredProjects = affordableProjects.filter((project) =>
    (typeFilter === "全部类型" || project.type.includes(typeFilter)) &&
    (areaFilter === "全部区域" || project.area === areaFilter) &&
    (stageFilter === "全部状态" || project.stage === stageFilter)
  );
  if (selected) return <><button className="detail-back" onClick={() => setSelected(null)}><ArrowLeft size={15} />返回项目列表</button><PolicyProjectDetail project={selected} /></>;
  return (
    <>
      <div className="drawer-title"><span>杭州政策住房项目</span><small>模拟结构化公告 · 正式接入后定期更新</small></div>
      <div className="policy-source-banner"><ShieldCheck size={20} /><div><strong>官方公告结构化效果（Demo）</strong><span>演示将市级、各区和运营方公告统一为可筛选项目</span></div></div>
      <div className="policy-live-summary">
        <span><strong>1</strong><small>开放申请中</small></span>
        <span><strong>1</strong><small>即将开放</small></span>
        <span><strong>今天 09:30</strong><small>最近更新</small></span>
        <button className={subscribed ? "active" : ""} onClick={() => setSubscribed(!subscribed)}>{subscribed ? <Check size={14} /> : <BellRing size={14} />}{subscribed ? "已订阅" : "订阅更新"}</button>
      </div>
      <div className="filter-row"><button onClick={() => cycle(typeFilter, ["全部类型", "人才专项租赁住房", "蓝领公寓"], setTypeFilter)}>{typeFilter}<ChevronDown size={13} /></button><button onClick={() => cycle(areaFilter, ["全部区域", "上城区", "拱墅区", "钱塘区"], setAreaFilter)}>{areaFilter}<ChevronDown size={13} /></button><button onClick={() => cycle(stageFilter, ["全部状态", "开放申请中", "即将开放", "常态化登记"], setStageFilter)}>{stageFilter}<ChevronDown size={13} /></button><button aria-label="重置筛选" onClick={() => { setTypeFilter("全部类型"); setAreaFilter("全部区域"); setStageFilter("全部状态"); }}><SlidersHorizontal size={15} /></button></div>
      <div className="policy-project-list drawer-policy-list">{filteredProjects.map((project) => <PolicyProjectCard key={project.name} project={project} onOpen={() => setSelected(project)} />)}{filteredProjects.length === 0 && <div className="empty-filter">暂无符合当前筛选的项目</div>}</div>
      <p className="drawer-footnote">本页项目状态、日期和租金均为 Demo 模拟，正式信息以最新官方公告为准。</p>
    </>
  );
}

function PolicyProjectDetail({ project }) {
  const [subscribed, setSubscribed] = useState(false);
  const [checking, setChecking] = useState(false);
  if (checking) return <><button className="detail-back" onClick={() => setChecking(false)}><ArrowLeft size={15} />返回项目详情</button><PolicyApplication /></>;
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
      <div className="official-source-row"><BadgeCheck size={16} /><div><strong>模拟结构化官方公告</strong><span>{project.source} · Demo 更新于 {project.updated}</span></div></div>
      <button className={`secondary-wide policy-subscribe-button ${subscribed ? "active" : ""}`} onClick={() => setSubscribed(!subscribed)}>{subscribed ? <><Check size={16} />已订阅项目变化</> : <><BellRing size={16} />订阅开放与截止提醒</>}</button>
      <button className="primary-wide" onClick={() => setChecking(true)}>授权核验申请条件<ArrowRight size={17} /></button>
      <p className="drawer-footnote">当前项目状态、日期和租金为产品 Demo 模拟，不会实际提交政府申请。</p>
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
  const [selectedService, setSelectedService] = useState("");
  return (
    <>
      <div className="movein-hero"><KeyRound size={23} /><div><strong>审核通过后，继续在支付宝办入住</strong><span>签约、缴租、公积金提取与生活服务统一承接。</span></div></div>
      <div className="rent-bill-card"><span><ReceiptText size={18} /><div><small>7月房租账单</small><strong>2,680 元</strong><em>7月5日前支付</em></div></span><button className={paid ? "paid" : ""} onClick={() => setPaid(true)}>{paid ? <><Check size={14} />已缴纳</> : <><CreditCard size={14} />立即缴租</>}</button></div>
      <div className="movein-services-grid">
        <button onClick={() => setSelectedService("已打开在线签约清单，可查看合同并完成实名认证（Demo）")}><FileCheck2 size={19} /><strong>在线签约</strong><small>查看合同与实名认证</small></button>
        <button onClick={() => setSelectedService("已进入公积金租房提取授权流程（Demo）")}><Landmark size={19} /><strong>公积金提取</strong><small>按月提取用于支付房租</small></button>
        <button onClick={() => setSelectedService("已打开水电燃气生活缴费管理（Demo）")}><WalletCards size={19} /><strong>生活缴费</strong><small>水电燃气账单统一管理</small></button>
        <button onClick={() => setSelectedService("已打开搬家、保洁与维修预约服务（Demo）")}><Truck size={19} /><strong>搬家保洁</strong><small>预约入住与维修服务</small></button>
      </div>
      {selectedService && <ActionFeedback text={selectedService} />}
      <div className="progress-reminder"><BellRing size={17} /><div><strong>房租与合同提醒已开启</strong><span>缴费日前、合同到期前和政策复核前主动提醒。</span></div></div>
      <p className="drawer-footnote">入住服务为产品设想 Demo，实际能力以合作接入情况为准。</p>
    </>
  );
}

function RentDetail({ home }) {
  const [booked, setBooked] = useState(false);
  const [consulted, setConsulted] = useState(false);
  return (
    <>
      <div className="rent-detail-hero" style={{ backgroundImage: `url(${home.image})` }}>
        <span className="partner-logo multi">{home.partner.slice(0, 2)}</span>
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
        <button className="secondary-wide" onClick={() => setConsulted(true)}>{consulted ? <><Check size={16} />已联系管家</> : <><MessageCircleMore size={16} />咨询管家</>}</button>
        <button className="primary-wide" onClick={() => setBooked(true)}>{booked ? <><Check size={17} />已提交看房意向</> : <>预约看房<ArrowRight size={17} /></>}</button>
      </div>
      {booked && <div className="booking-success"><Check size={15} />{home.partner}将继续确认看房时间（Demo）</div>}
      {consulted && <div className="booking-success"><Check size={15} />已发起咨询，{home.partner}将回复房源实时状态（Demo）</div>}
      <p className="drawer-footnote">房源信息为 Demo 模拟数据，实际价格与可租状态以合作平台为准。</p>
    </>
  );
}

function Mortgage() {
  const [price, setPrice] = useState(300);
  const [down, setDown] = useState(30);
  const [years, setYears] = useState(30);
  const [showPlan, setShowPlan] = useState(false);
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
      <button className="primary-wide" onClick={() => setShowPlan(true)}>查看公积金组合贷方案<ArrowRight size={17} /></button>
      {showPlan && <div className="application-generated"><Calculator size={17} /><div><strong>组合贷方案已生成</strong><span>模拟方案：公积金贷款 65 万，其余使用商业贷款；实际额度与利率以审批为准。</span></div></div>}
      <p className="drawer-footnote">利率与测算结果仅供参考，实际以贷款机构审批为准。</p>
    </>
  );
}

function Fund() {
  const [authorized, setAuthorized] = useState(false);
  const [selected, setSelected] = useState("");
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
          <div className="fund-options"><button onClick={() => setSelected("贷款")}><Home size={19} /><span><strong>购房贷款测算</strong><small>预计最高可贷 65 万</small></span><ChevronRight size={17} /></button><button onClick={() => setSelected("租房")}><Building2 size={19} /><span><strong>租房提取</strong><small>查看可提取额度与材料</small></span><ChevronRight size={17} /></button></div>
          {selected === "贷款" && <ActionFeedback text="模拟测算：预计最高可贷 65 万，实际以公积金中心审核为准。" />}
          {selected === "租房" && <ActionFeedback text="已打开租房提取材料清单与官方办理入口（Demo）。" />}
        </>
      )}
    </>
  );
}

function GenericService({ type, request }) {
  const [activated, setActivated] = useState(false);
  const communityName = typeof request === "object" && request.communityName && request.communityName !== "该小区" ? request.communityName : "万科城市花园";
  const hasCommunityData = communityName === "万科城市花园";
  const configs = {
    deposit: ["花呗免押租房", "信用好，可以少交一笔押金", "签约时选择支持免押的合作房源，授权评估后即可查看结果。", [["可免押房源", "126套"], ["预计节省", "4,500元"], ["在线签约", "支持"]], "查看支持免押的房源"],
    amenities: [`${communityName}生活便利度`, hasCommunityData ? "日常生活，步行范围内就能解决" : "当前 Demo 暂未接入该小区配套数据", hasCommunityData ? `${communityName}周边的交通、商业、社区医疗与生活服务可作为居住参考。` : "不会用其他小区的生活便利度数据替代回答，正式接入后可继续查询。", hasCommunityData ? [["地铁距离", "约680m"], ["生活便利", "较高"], ["维修保洁", "可预约"]] : [["交通数据", "待接入"], ["商业数据", "待接入"], ["生活服务", "可搜索"]], "查看周边生活服务"],
    "school-policy": ["杭州入学政策", "以当年官方公布政策为准", "支付宝可承接官方政策查询入口，但不会根据房产信息直接判断入学资格。", [["政策来源", "官方"], ["更新时间", "以公告为准"], ["实时数据", "未引用"]], "进入官方政策服务"],
    attachments: ["添加资料", "上传资料帮助 Agent 理解需求", "可添加户型图、房源截图或政策公告，当前 Demo 不会实际上传文件。", [["支持图片", "规划中"], ["支持公告", "规划中"], ["隐私保护", "授权后使用"]], "选择资料"],
    voice: ["语音提问", "可以直接说出住房需求", "当前 Demo 展示语音入口，正式版本需接入支付宝语音识别能力。", [["普通话", "支持规划"], ["自动转写", "支持规划"], ["隐私提示", "录音前确认"]], "开始语音提问"],
    history: ["历史咨询", "统一回看房产问题和办理进度", "可沉淀趋势问答、找房条件、政策住房申请与服务办理记录。", [["趋势问答", "3条"], ["找房方案", "1个"], ["办理进度", "1项"]], "查看全部记录"],
    profile: ["我的住房服务", "管理订阅、授权和办理记录", "在这里统一管理政策住房订阅、房源咨询、合同账单与个人授权。", [["消息订阅", "已开启"], ["授权管理", "可查看"], ["办理记录", "2项"]], "管理我的服务"],
    cities: ["选择城市", "当前 Demo 聚焦杭州", "正式版本可根据城市切换房价趋势、政策住房、公积金与合作房源服务。", [["当前城市", "杭州"], ["试点计划", "杭州/广州"], ["自动定位", "需授权"]], "保持使用杭州"],
    settings: ["更多设置", "管理数据来源与回答偏好", "可查看数据来源、风险提示、隐私授权与消息提醒设置。", [["数据来源", "可查看"], ["风险提示", "已开启"], ["消息提醒", "已开启"]], "查看设置"],
    "ai-info": ["支付宝 AI", "从回答问题到继续办理", "房多多 Agent 是房产垂直场景 Demo，重点展示问答、数据分析与支付宝服务闭环。", [["问答能力", "模拟 MCP"], ["服务承接", "支付宝"], ["风险控制", "已展示"]], "返回房产 Agent"],
  };
  const config = configs[type] || configs.amenities;
  const [title, headline, copy, metrics, action] = config;
  return (
    <>
      <div className="drawer-title"><span>{title}</span><small>支付宝服务演示</small></div>
      <div className="generic-hero">{type === "deposit" ? <ShieldCheck size={31} /> : <Navigation size={31} />}<strong>{headline}</strong><p>{copy}</p></div>
      <div className="generic-grid">{metrics.map(([a, b]) => <div key={a}><span>{a}</span><strong>{b}</strong></div>)}</div>
      <button className="primary-wide" onClick={() => setActivated(true)}>{activated ? <><Check size={16} />已响应</> : <>{action}<ArrowRight size={17} /></>}</button>
      {activated && <ActionFeedback text={`${action}操作已响应（Demo）`} />}
    </>
  );
}

function BottomNav({ onService, onReset }) {
  return <nav className="bottom-nav"><button className="active" onClick={onReset}><Sparkles size={20} /><span>问房</span></button><button onClick={() => onService("buy-listings")}><Search size={20} /><span>找房</span></button><button onClick={() => onService("fund")}><WalletCards size={20} /><span>服务</span></button><button onClick={() => onService("profile")}><Menu size={20} /><span>我的</span></button></nav>;
}

createRoot(document.getElementById("root")).render(<App />);
