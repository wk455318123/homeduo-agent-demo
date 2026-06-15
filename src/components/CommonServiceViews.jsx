import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  BellRing,
  Building2,
  Calculator,
  CalendarClock,
  Check,
  ChevronRight,
  Clock3,
  GraduationCap,
  Home,
  Landmark,
  Navigation,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function ActionFeedback({ text }) {
  return <div className="action-feedback"><Check size={14} />{text}</div>;
}

export function Mortgage() {
  const [price, setPrice] = useState("300");
  const [down, setDown] = useState("30");
  const [years, setYears] = useState("30");
  const [showPlan, setShowPlan] = useState(false);
  const priceValue = Number(price);
  const downValue = Number(down);
  const yearsValue = Number(years);
  const valid = Number.isFinite(priceValue) && priceValue > 0 && Number.isFinite(downValue) && downValue >= 0 && downValue < 100 && Number.isFinite(yearsValue) && yearsValue > 0;
  const loan = valid ? priceValue * (1 - downValue / 100) : 0;
  const monthlyRate = 3.1 / 100 / 12;
  const months = valid ? yearsValue * 12 : 0;
  const payment = useMemo(() => {
    if (!valid || months <= 0) return 0;
    const factor = Math.pow(1 + monthlyRate, months);
    return (loan * 10000 * monthlyRate * factor) / (factor - 1);
  }, [loan, months, valid]);
  return (
    <>
      <div className="drawer-title"><span>房贷计算器</span><small>快速判断舒适预算</small></div>
      <div className={`calculator-result ${valid ? "" : "invalid"}`}><span>预计每月还款</span><strong>{valid ? `¥ ${Math.round(payment).toLocaleString()}` : "请完善测算参数"}</strong><small>{valid ? `商业贷款 ${loan.toFixed(0)} 万 · 等额本息` : "总价需大于 0，首付低于 100%，期限需大于 0"}</small></div>
      <div className="form-row"><label>房屋总价</label><div><input aria-label="房屋总价" type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} /><span>万元</span></div></div>
      <div className="form-row"><label>首付比例</label><div><input aria-label="首付比例" type="number" min="0" max="99" value={down} onChange={(event) => setDown(event.target.value)} /><span>%</span></div></div>
      <div className="form-row"><label>贷款期限</label><div><input aria-label="贷款期限" type="number" min="1" max="40" value={years} onChange={(event) => setYears(event.target.value)} /><span>年</span></div></div>
      <button className="primary-wide" disabled={!valid} onClick={() => setShowPlan(true)}>查看公积金组合贷方案<ArrowRight size={17} /></button>
      {showPlan && <div className="application-generated"><Calculator size={17} /><div><strong>组合贷方案已生成</strong><span>模拟方案：公积金贷款 65 万，其余使用商业贷款；实际额度与利率以审批为准。</span></div></div>}
      <p className="drawer-footnote">利率与测算结果仅供参考，实际以贷款机构审批为准。</p>
    </>
  );
}

export function Fund() {
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

export function GraduateRentCenter({ onNavigate }) {
  const [verified, setVerified] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <>
      <div className="drawer-title"><span>毕业生安居服务</span><small>先核验权益，再组合房源与入住服务</small></div>
      <div className="graduate-center-hero">
        <GraduationCap size={25} />
        <div><strong>首次来杭租房，可以少付一点、少跑几步</strong><span>支付宝聚合官方政策入口、运营商房源和市场化平台服务，办理结果以对应服务方为准。</span></div>
      </div>
      <div className="graduate-check-card">
        <div><strong>毕业生安居权益预核验</strong><small>模拟判断，不代表政府审核结论</small></div>
        {!verified ? <button onClick={() => setVerified(true)}>授权预核验</button> : <span><Check size={13} />已生成建议</span>}
      </div>
      {verified && <div className="graduate-result">
        <div><Check size={16} /><span><strong>建议优先核验毕业生租房补贴</strong><small>补贴资格、金额与续发条件以杭州官方服务实时结果为准。</small></span></div>
        <div><Check size={16} /><span><strong>同步关注人才专项租赁住房</strong><small>项目申请时间、准入条件与运营主体以最新公告为准。</small></span></div>
      </div>}
      <div className="operator-section">
        <div className="operator-title"><strong>三类租房供给一起比较</strong><span>不仅看价格，也看服务与入住成本</span></div>
        <button onClick={() => onNavigate("affordable-projects")}><span className="operator-mark government"><ShieldCheck size={17} /></span><div><strong>政府政策住房项目</strong><small>人才专项租赁住房、保租房等，官方公告发布，具体运营主体承接服务</small></div><ChevronRight size={16} /></button>
        <button onClick={() => onNavigate("rent-market")}><span className="operator-mark operator"><Building2 size={17} /></span><div><strong>住房租赁运营商</strong><small>集中式公寓、品牌长租社区，重点比较管理、维修和签约服务</small></div><ChevronRight size={16} /></button>
        <button onClick={() => onNavigate("rent-market")}><span className="operator-mark platform"><Search size={17} /></span><div><strong>市场化合作平台</strong><small>聚合经纪机构与个人房源，明确展示来源、核验状态和费用</small></div><ChevronRight size={16} /></button>
      </div>
      <div className="graduate-service-grid">
        <button onClick={() => onNavigate("deposit")}><ShieldCheck size={18} /><strong>花呗免押</strong><small>符合条件的合作房源可尝试降低押金压力</small></button>
        <button onClick={() => onNavigate("fund")}><Landmark size={18} /><strong>公积金租房提取</strong><small>授权后查看可提取额度与办理材料</small></button>
        <button onClick={() => onNavigate("affordable-alerts")}><BellRing size={18} /><strong>政策开放提醒</strong><small>项目开放、截止和补材料及时通知</small></button>
        <button onClick={() => setSaved(true)}><CalendarClock size={18} /><strong>缴租与合同提醒</strong><small>入住后提醒缴费和合同到期时间</small></button>
      </div>
      {saved && <ActionFeedback text="已开启缴租与合同提醒（Demo）" />}
      <p className="drawer-footnote">当前为产品 Demo；政策、房源、免押资格及运营服务均以对应官方或供给方实际结果为准。</p>
    </>
  );
}

export function HousingHub({ mode, onNavigate }) {
  const listingItems = [
    { icon: GraduationCap, title: "毕业生安居", sub: "组合政策权益、运营商房源与免押服务", type: "graduate-rent-center" },
    { icon: Home, title: "看二手房", sub: "按区域、预算与户型浏览模拟在售房源", type: "buy-listings" },
    { icon: Building2, title: "多平台租房", sub: "聚合贝壳、自如、安居客等合作供给", type: "rent-market" },
    { icon: ShieldCheck, title: "政策住房", sub: "查看保租房、人才房与蓝领公寓公告", type: "affordable-projects" },
  ];
  const serviceItems = [
    { icon: GraduationCap, title: "毕业生安居服务", sub: "核验租房补贴、人才住房与免押权益", type: "graduate-rent-center" },
    { icon: Landmark, title: "公积金查询", sub: "查询余额、贷款额度与租房提取", type: "fund" },
    { icon: Calculator, title: "房贷计算器", sub: "测算首付、月供与组合贷方案", type: "mortgage" },
    { icon: Clock3, title: "政策住房进度", sub: "查看审核、选房、签约与入住服务", type: "affordable-progress" },
    { icon: BellRing, title: "住房消息订阅", sub: "接收政策项目开放与截止提醒", type: "affordable-alerts" },
  ];
  const listingMode = mode === "listing";
  const items = listingMode ? listingItems : serviceItems;
  return (
    <>
      <div className="drawer-title"><span>{listingMode ? "找房频道" : "支付宝住房服务"}</span><small>{listingMode ? "聚合买房、租房与政策住房供给" : "查询、测算、申请与入住服务统一承接"}</small></div>
      <div className="hub-intro">
        {listingMode ? <Search size={22} /> : <Sparkles size={22} />}
        <div><strong>{listingMode ? "先选择想找的住房类型" : "从房产问答继续把事情办完"}</strong><span>{listingMode ? "每类房源都会明确标注来源与模拟状态。" : "服务结果与办理状态将在对应页面清晰说明。"}</span></div>
      </div>
      <div className="hub-list">
        {items.map(({ icon: Icon, title, sub, type }) => (
          <button key={type} onClick={() => onNavigate(type)}>
            <span><Icon size={19} /></span>
            <div><strong>{title}</strong><small>{sub}</small></div>
            <ChevronRight size={16} />
          </button>
        ))}
      </div>
      <p className="drawer-footnote">当前为产品 Demo，房源与办理结果均为模拟展示。</p>
    </>
  );
}

export function GenericService({ type, request }) {
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
  const [title, headline, copy, metrics, action] = configs[type] || configs.amenities;
  return (
    <>
      <div className="drawer-title"><span>{title}</span><small>支付宝服务演示</small></div>
      <div className="generic-hero">{type === "deposit" ? <ShieldCheck size={31} /> : <Navigation size={31} />}<strong>{headline}</strong><p>{copy}</p></div>
      <div className="generic-grid">{metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
      <button className="primary-wide" onClick={() => setActivated(true)}>{activated ? <><Check size={16} />已响应</> : <>{action}<ArrowRight size={17} /></>}</button>
      {activated && <ActionFeedback text={`${action}操作已响应（Demo）`} />}
    </>
  );
}
