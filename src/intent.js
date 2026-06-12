const MARKET_TERMS = /(二手房|房价|成交价|成交|均价|租金|租售比|在售|出租)/;
const COMMUNITY_MARKERS = /(小区|花园|家园|公馆|雅苑|嘉园|名邸|山庄|华庭|悦府|壹号|城邦|海岸|春江|云栖|天悦|江南|御景|苑|府)/;
const MACRO_PLACES = new Set([
  "全国",
  "杭州",
  "杭州市",
  "余杭",
  "余杭区",
  "萧山",
  "萧山区",
  "滨江",
  "滨江区",
  "西湖",
  "西湖区",
  "拱墅",
  "拱墅区",
  "上城",
  "上城区",
  "钱塘",
  "钱塘区",
  "临平",
  "临平区",
  "富阳",
  "富阳区",
  "临安",
  "临安区",
  "未来科技城",
  "钱江新城",
  "奥体",
  "申花",
  "仓前",
  "闲林",
  "五常",
]);

function normalize(text = "") {
  return text
    .replace(/\s+/g, "")
    .replace(/[?？!！,，。]/g, "")
    .replace(/杭州(?:市)?/g, "")
    .replace(/最近|现在|目前|近半年|近一年|这半年|这一年/g, "");
}

function marketSubject(text = "") {
  const normalized = normalize(text);
  const match = normalized.match(/^(.{2,22}?)(?=二手房|房价|成交价|成交|均价|租金|租售比|在售|出租)/);
  if (!match) return "";
  return match[1].replace(/^(查一下|看看|想知道|请问|帮我看|了解一下)/, "").replace(/的$/, "");
}

export function isCommunityQuery(text) {
  const normalized = normalize(text);
  const subject = marketSubject(text);
  const descriptiveSubject = normalized.replace(/怎么样|如何|好不好|情况|值得买吗|值得买|了解一下|看看/g, "");
  const explicitCommunity = /(这个|该|具体|某个)?小区/.test(normalized);
  const subjectLooksLikeCommunity = subject.length >= 3 && !MACRO_PLACES.has(subject);
  const descriptiveCommunity =
    descriptiveSubject.length >= 3 &&
    !MACRO_PLACES.has(descriptiveSubject) &&
    (COMMUNITY_MARKERS.test(descriptiveSubject) || /(万科|绿城|保利|中海|融创|龙湖|华润)/.test(descriptiveSubject));

  if (/学区|学校|入学/.test(normalized)) return false;
  if (/租售比/.test(normalized)) return true;
  if (explicitCommunity) return true;
  if (COMMUNITY_MARKERS.test(normalized) && MARKET_TERMS.test(normalized) && !MACRO_PLACES.has(subject)) return true;
  return (MARKET_TERMS.test(normalized) && subjectLooksLikeCommunity) || descriptiveCommunity;
}

export function extractCommunityName(text = "") {
  if (!isCommunityQuery(text)) return "";
  const normalized = normalize(text);
  if (/这个小区|该小区|具体小区|某个小区/.test(normalized)) return "";
  const subject = marketSubject(text);
  if (subject && !MACRO_PLACES.has(subject)) return subject;
  const named = normalized.match(/([\u4e00-\u9fa5A-Za-z0-9]{2,18}(?:小区|花园|家园|公馆|雅苑|嘉园|名邸|山庄|华庭|悦府|壹号|城邦|海岸|苑|府))/);
  if (named?.[1]) return named[1];
  const descriptiveSubject = normalized.replace(/怎么样|如何|好不好|情况|值得买吗|值得买|了解一下|看看/g, "");
  if (descriptiveSubject.length >= 3 && !MACRO_PLACES.has(descriptiveSubject)) return descriptiveSubject;
  return "";
}

export function identifyPrompt(text) {
  const normalized = normalize(text);

  if (/保租房|保障性租赁|人才房|人才公寓|人才专项租赁|公租房|蓝领公寓|青荷驿站|申请住房|住房保障/.test(normalized)) return "affordable";
  if (/学区|学校|入学/.test(normalized)) return "school";
  if (isCommunityQuery(text)) return "community";
  if (/公积金.*(租房|房租)|免押|找.*租|想.*租|租房|合租|整租|可租房源/.test(normalized)) return "rent";
  if (/预算|怎么选|哪个好|对比|比较|余杭.*萧山|萧山.*余杭/.test(normalized)) return "budget";
  return "trend";
}
