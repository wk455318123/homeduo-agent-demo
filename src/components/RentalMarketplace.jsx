import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  BadgeCheck,
  BedDouble,
  Check,
  ChevronDown,
  ChevronRight,
  Heart,
  Home,
  List,
  Map,
  MapPin,
  MessageCircleMore,
  ReceiptText,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrainFront,
  WalletCards,
} from "lucide-react";
import { kaRentHomes } from "../mockData.js";
import { matchesRentPrice } from "../rentalFilters.js";

function ActionFeedback({ text }) {
  return <div className="action-feedback"><Check size={14} />{text}</div>;
}

export function RentalMarketplace() {
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
  const extraOptions = ["毕业生友好", "整租", "合租", "公寓", "个人房源", "平台核验", "近地铁", "可月付", "无中介费"];
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
      matchesRentPrice(price, home.price) &&
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
