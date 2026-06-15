import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BellRing,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  CreditCard,
  FileCheck2,
  Home,
  KeyRound,
  Landmark,
  MapPin,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  SlidersHorizontal,
  Truck,
  UserCheck,
  WalletCards,
} from "lucide-react";
import { affordableProjects } from "../mockData.js";

function ActionFeedback({ text }) {
  return <div className="action-feedback"><Check size={15} /><span>{text}</span></div>;
}

function PolicyProjectCard({ project, onOpen }) {
  return (
    <button className="policy-project-card" onClick={onOpen}>
      <span className="policy-card-labels"><span className="policy-type">{project.type}</span><i className={project.stage === "开放申请中" ? "open" : ""}>{project.stage}</i></span>
      <span className="policy-project-copy"><strong>{project.name}</strong><small><MapPin size={11} />{project.area} · {project.layout}</small><em>{project.rent}</em><small className="policy-operator"><Building2 size={10} />{project.operator}</small><small className="policy-update"><RefreshCw size={10} />更新于 {project.updated}</small></span>
      <span className="policy-project-status"><b>{project.deadline}</b><ChevronRight size={15} /></span>
    </button>
  );
}

export function PolicyProjects() {
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

export function PolicyProjectDetail({ project }) {
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
      <div className="policy-detail-section"><strong>运营服务主体</strong><p>{project.operator}。项目咨询、看房、签约和入住服务通常由具体运营主体承接，实际以最新公告为准。</p></div>
      <div className="policy-detail-section"><strong>常见准入核验项</strong><div className="requirement-grid"><span><BriefcaseBusiness size={16} />劳动关系 / 社保</span><span><FileCheck2 size={16} />居住证或户籍</span><span><Home size={16} />家庭住房情况</span><span><ShieldCheck size={16} />住房优惠状态</span></div></div>
      <div className="official-source-row"><BadgeCheck size={16} /><div><strong>模拟结构化官方公告</strong><span>{project.source} · Demo 更新于 {project.updated}</span></div></div>
      <button className={`secondary-wide policy-subscribe-button ${subscribed ? "active" : ""}`} onClick={() => setSubscribed(!subscribed)}>{subscribed ? <><Check size={16} />已订阅项目变化</> : <><BellRing size={16} />订阅开放与截止提醒</>}</button>
      <button className="primary-wide" onClick={() => setChecking(true)}>授权核验申请条件<ArrowRight size={17} /></button>
      <p className="drawer-footnote">当前项目状态、日期和租金为产品 Demo 模拟，不会实际提交政府申请。</p>
    </>
  );
}

export function PolicyAlerts() {
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

export function PolicyApplication() {
  const [authorized, setAuthorized] = useState(false);
  const [generated, setGenerated] = useState(false);
  const checks = [["实名认证", "支付宝账户"], ["学历信息", "学信网授权"], ["就业与社保", "政务服务授权"], ["人才认定", "人才会客厅"], ["不动产情况", "政府部门核验"]];
  return (
    <>
      <div className="drawer-title"><span>申请材料智能准备</span><small>一次授权，生成项目所需材料清单</small></div>
      <div className="application-value"><UserCheck size={24} /><div><strong>少填表、少跑腿、避免漏材料</strong><span>支付宝仅在你授权后调用信息，正式申请仍以政府部门审核为准。</span></div></div>
      <div className="verification-list">{checks.map(([name, source], index) => <div key={name}><span className={authorized ? "verified" : ""}>{authorized ? <Check size={14} /> : index + 1}</span><div><strong>{name}</strong><small>{source}</small></div><em>{authorized ? "已获取模拟结果" : "待授权"}</em></div>)}</div>
      {!authorized ? <button className="primary-wide" onClick={() => setAuthorized(true)}>支付宝授权并开始核验</button> : <><div className="verification-result"><Check size={17} /><div><strong>预核验完成</strong><span>初步满足继续申请条件，建议选择具体项目后提交。</span></div></div><button className="primary-wide" onClick={() => setGenerated(true)}>{generated ? <><Check size={17} />申请表已生成</> : <>选择项目并生成申请表<ArrowRight size={17} /></>}</button>{generated && <div className="application-generated"><ReceiptText size={17} /><div><strong>申请信息已自动填充</strong><span>提交前仍可检查和修改，确认后将跳转官方申请入口。</span></div></div>}</>}
      <p className="drawer-footnote">预核验结果不代表政府审批结论。</p>
    </>
  );
}

export function PolicyProgress() {
  const [view, setView] = useState("progress");
  const [paid, setPaid] = useState(false);
  return (
    <>
      <div className="drawer-title"><span>政策住房服务台</span><small>从申请进度持续服务到入住生活 · Demo</small></div>
      <div className="policy-service-tabs"><button className={view === "progress" ? "active" : ""} onClick={() => setView("progress")}>申请进度</button><button className={view === "movein" ? "active" : ""} onClick={() => setView("movein")}>入住服务预览</button></div>
      {view === "progress" ? <>
        <div className="progress-project"><span className="policy-type">人才专项租赁住房</span><strong>潮语贤庭</strong><small>申请编号：HZRC202606120018</small></div>
        <div className="application-timeline">{[["报名申请", "已完成", "6月10日"], ["资格审核", "审核中", "预计 3 个工作日"], ["摇号 / 选房", "待开始", "以项目通知为准"], ["签约入住", "待开始", "线上签约与缴费"]].map(([name, state, meta], index) => <div className={index < 2 ? "active" : ""} key={name}><i>{index === 0 ? <Check size={13} /> : index + 1}</i><span><strong>{name}</strong><small>{meta}</small></span><em>{state}</em></div>)}</div>
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
