const relativeDeadline = (days, action) => `${days} 天后${action}`;

export const trendData = [
  { month: "7月", price: 26890 }, { month: "8月", price: 26720 }, { month: "9月", price: 26780 },
  { month: "10月", price: 26490 }, { month: "11月", price: 26540 }, { month: "12月", price: 26210 },
  { month: "1月", price: 26320 }, { month: "2月", price: 26040 }, { month: "3月", price: 26110 },
  { month: "4月", price: 25870 }, { month: "5月", price: 25960 }, { month: "6月", price: 25765 },
];

export const compareData = [
  { month: "1月", 余杭: 32800, 萧山: 30200 }, { month: "2月", 余杭: 32500, 萧山: 30300 },
  { month: "3月", 余杭: 32650, 萧山: 29950 }, { month: "4月", 余杭: 32050, 萧山: 30100 },
  { month: "5月", 余杭: 32120, 萧山: 29550 }, { month: "6月", 余杭: 31600, 萧山: 29300 },
];

export const rentData = [
  { name: "未来科技城", rent: 4800 }, { name: "仓前", rent: 4200 },
  { name: "闲林", rent: 3600 }, { name: "五常", rent: 4550 },
];

export const communityData = [
  { month: "1月", price: 35400, deal: 9 }, { month: "2月", price: 35100, deal: 6 },
  { month: "3月", price: 34900, deal: 11 }, { month: "4月", price: 35050, deal: 8 },
  { month: "5月", price: 34700, deal: 12 }, { month: "6月", price: 34500, deal: 7 },
];

export const communityRentData = [
  { month: "1月", rent: 5150 }, { month: "2月", rent: 5100 }, { month: "3月", rent: 5200 },
  { month: "4月", rent: 5250 }, { month: "5月", rent: 5200 }, { month: "6月", rent: 5300 },
];

export const affordableProjects = [
  {
    name: "潮语贤庭", type: "人才专项租赁住房", area: "上城区",
    rent: "人才优惠租金最高可至评估价 7 折", layout: "两室一厅 · 约 57-59㎡",
    status: "关注后续配租公告", stage: "即将开放", deadline: relativeDeadline(14, "开放"),
    updated: "今天 09:30", sourceLevel: "市级官方平台", fit: "高校毕业生 / 各类人才",
    source: "杭州市住房租赁公众服务平台", operator: "项目运营方以最新公告为准",
  },
  {
    name: "宸寓·如栖兰庭", type: "人才专项租赁住房", area: "拱墅区", rent: "项目实行一房一价",
    layout: "精装房源 · 拎包入住", status: "常态化配租信息待核验", stage: "常态化登记",
    deadline: "登记后等待房源通知", updated: "昨天 16:20", sourceLevel: "区级运营公告",
    fit: "在杭就业人才", source: "杭州市住房租赁公众服务平台", operator: "运营品牌：宸寓",
  },
  {
    name: "宁巢·钱塘蓝领公寓", type: "蓝领公寓", area: "钱塘区", rent: "床位约 150 元/月起",
    layout: "单人间 / 双人间 / 四人间", status: "适合新就业群体关注", stage: "开放申请中",
    deadline: relativeDeadline(6, "截止"), updated: "今天 08:15", sourceLevel: "区级官方平台",
    fit: "产业工人 / 新就业群体", source: "杭州市住房租赁公众服务平台", operator: "运营品牌：宁巢",
  },
];

export const listings = {
  buy: [
    { title: "未来科技城 · 三房", meta: "89㎡ · 近地铁 · 次新房", price: "298万", tag: "预算内", image: "./assets/rent-living-balcony.jpg" },
    { title: "良渚文化村 · 三房", meta: "96㎡ · 精装修 · 南北通透", price: "285万", tag: "自住优选", image: "./assets/rent-two-bedroom.jpg" },
    { title: "闲林 · 四房", meta: "118㎡ · 低密社区 · 有车位", price: "305万", tag: "空间更大", image: "./assets/rent-living.jpg" },
  ],
  rent: [
    { title: "西溪北苑 · 平台整租", meta: "整租一居 · 42㎡ · 良睦路地铁站", price: "4,680元/月", tag: "花呗免押" },
    { title: "欧美金融城 · 精装一居", meta: "整租一居 · 46㎡ · 海创园通勤约15分钟", price: "4,980元/月", tag: "今日可看" },
    { title: "仓前 · 品质主卧", meta: "品质合租 · 独立卫浴 · 可月付", price: "3,280元/月", tag: "可月付" },
  ],
};

export const communityHomes = {
  sale: [
    { title: "万科城市花园 · 89㎡三房", meta: "中层 · 南北通透 · 满五年", price: "306万", unit: "34,382元/㎡", tag: "近参考价", image: "./assets/rent-living.jpg" },
    { title: "万科城市花园 · 108㎡三房", meta: "高层 · 精装修 · 带车位", price: "386万", unit: "35,741元/㎡", tag: "改善户型", image: "./assets/rent-bedroom.jpg" },
    { title: "万科城市花园 · 72㎡两房", meta: "中层 · 朝南 · 近地铁", price: "242万", unit: "33,611元/㎡", tag: "总价较低", image: "./assets/rent-studio.jpg" },
  ],
  rent: [
    { title: "万科城市花园 · 整租两房", meta: "72㎡ · 朝南 · 押一付三", price: "5,300元/月", unit: "可随时看房", tag: "主流租金", image: "./assets/rent-living.jpg" },
    { title: "万科城市花园 · 整租三房", meta: "89㎡ · 精装修 · 可月付", price: "6,800元/月", unit: "支持花呗免押", tag: "家庭整租", image: "./assets/rent-bedroom.jpg" },
    { title: "万科城市花园 · 品质合租", meta: "主卧 · 独立卫浴 · 包保洁", price: "3,180元/月", unit: "合作平台模拟房源", tag: "预算更轻", image: "./assets/rent-studio.jpg" },
  ],
};

export const kaRentHomes = [
  ["xixi-north", "自如", "自如整租 · 西溪北苑", "未来科技城", "海创园通勤约 18 分钟", "5号线良睦路站 780m", "整租一居", "42㎡", 4680, "朝南", ["毕业生友好", "花呗免押", "可月付", "今日可看"], "./assets/rent-studio-bright.jpg", "通勤、预算与独居需求最均衡"],
  ["efc", "贝壳租房", "欧美金融城 · 精装一居", "未来科技城", "步行至海创园约 15 分钟", "5号线创景路站 560m", "整租一居", "46㎡", 4980, "朝南", ["毕业生友好", "平台核验", "近地铁", "VR看房"], "./assets/rent-living-balcony.jpg", "距离公司近，房源信息已由平台核验"],
  ["cangqian", "58同城", "仓前 · 房东直租主卧", "仓前", "海创园通勤约 25 分钟", "5号线葛巷站 920m", "品质合租", "主卧 18㎡", 3280, "带独立卫浴", ["个人房源", "独立卫浴", "可月付"], "./assets/rent-bedroom-green.jpg", "预算更轻，个人房源需进一步核验"],
  ["wuchang-two", "安居客", "五常华元 · 南北两居", "西溪/五常", "海创园通勤约 28 分钟", "5号线五常站 650m", "整租两居", "68㎡", 5480, "南北通透", ["平台核验", "近地铁", "双卧室"], "./assets/rent-two-bedroom.jpg", "适合两人合租或需要独立书房"],
  ["xianlin-two", "我爱我家", "闲林山水 · 大两居", "仓前", "海创园通勤约 35 分钟", "公交接驳至地铁站", "整租两居", "72㎡", 4380, "带阳台", ["经纪人房源", "空间更大", "民水民电"], "./assets/rent-kitchen.jpg", "同预算获得更大的居住空间"],
  ["efc-loft", "安居客", "欧美金融城 · 复式公寓", "未来科技城", "海创园通勤约 12 分钟", "5号线创景路站 430m", "整租一居", "52㎡", 5200, "挑高复式", ["毕业生友好", "公寓", "近地铁", "随时看房"], "./assets/rent-loft.jpg", "通勤距离短，适合偏好公寓居住体验"],
  ["liangmu-room", "贝壳租房", "良睦路地铁口 · 品质主卧", "未来科技城", "海创园通勤约 20 分钟", "5号线良睦路站 260m", "品质合租", "主卧 20㎡", 3480, "朝南带阳台", ["平台核验", "近地铁", "可月付"], "./assets/rent-bedroom.jpg", "地铁通勤稳定，合租房间面积较大"],
  ["xixi-owner", "58同城", "西溪北苑 · 房东直租两居", "西溪/五常", "海创园通勤约 30 分钟", "5号线五常站 980m", "整租两居", "70㎡", 5050, "朝南", ["个人房源", "无中介费", "可养宠"], "./assets/rent-living.jpg", "个人房源费用更轻，但需确认真实状态"],
  ["cangqian-one", "我爱我家", "仓前梦想小镇 · 精装一居", "仓前", "海创园通勤约 22 分钟", "5号线葛巷站 730m", "整租一居", "45㎡", 4250, "朝东", ["经纪人房源", "精装修", "拎包入住"], "./assets/rent-studio.jpg", "预算适中，通勤和独居体验较均衡"],
].map(([id, partner, title, location, commute, subway, layout, area, price, orientation, tags, image, reason]) => ({
  id, partner, title, location, commute, subway, layout, area, price, orientation, tags, image, reason,
}));
