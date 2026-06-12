import assert from "node:assert/strict";
import { extractCommunityName, identifyPrompt } from "../src/intent.js";
import { matchAffordableProjects } from "../src/policyMatching.js";
import { resolveCommunityContext } from "../src/conversationContext.js";

const cases = [
  ["万科城市花园租金怎么样", "community", "万科城市花园"],
  ["绿城春江明月房价走势", "community", "绿城春江明月"],
  ["滨江金色海岸二手房价", "community", "滨江金色海岸"],
  ["保利澄品租金多少", "community", "保利澄品"],
  ["这个小区租金呢", "community", ""],
  ["绿城春江明月怎么样", "community", "绿城春江明月"],
  ["未来科技城房价走势", "trend", ""],
  ["未来科技城租房，帮我找一居", "rent", ""],
  ["杭州整体房价走势", "trend", ""],
  ["余杭房价怎么样", "trend", ""],
  ["300万预算余杭和萧山怎么选", "budget", ""],
  ["万科城市花园学区怎么样", "school", "万科城市花园"],
  ["绿城春江明月学区怎么样", "school", "绿城春江明月"],
  ["我能申请杭州保租房吗", "affordable", ""],
  ["人才房申请需要什么条件", "affordable", ""],
  ["钱塘区蓝领公寓怎么申请", "affordable", ""],
  ["人才房需要哪些材料", "policy-materials", ""],
  ["查看正在开放的项目", "policy-projects", ""],
  ["查询我的申请进度", "policy-progress", ""],
  ["我能贷多少钱", "mortgage", ""],
  ["按我的收入算月供", "mortgage", ""],
  ["怎么提取公积金付房租", "fund", ""],
  ["自如房源支持免押吗", "deposit", ""],
  ["查看余杭在售房源", "listings", ""],
  ["查看周边在售房源", "listings", ""],
  ["查看该小区出租房源", "listings", ""],
  ["看看小区生活便利度", "amenities", ""],
  ["想住得离公司更近", "rent", ""],
  ["杭州现在适合买房吗", "fallback", ""],
  ["你好，能帮我做什么", "fallback", ""],
];

for (const [query, expectedIntent, expectedCommunity] of cases) {
  assert.equal(identifyPrompt(query), expectedIntent, `意图识别错误：${query}`);
  assert.equal(extractCommunityName(query), expectedCommunity, `小区名称提取错误：${query}`);
}

const projects = [
  { name: "上城人才房", type: "人才专项租赁住房", area: "上城区" },
  { name: "钱塘蓝领公寓", type: "蓝领公寓", area: "钱塘区" },
];

assert.deepEqual(matchAffordableProjects(projects, "newworker", "上城区"), [], "新就业群体不应跨区匹配项目");
assert.deepEqual(matchAffordableProjects(projects, "newworker", "钱塘区").map((item) => item.name), ["钱塘蓝领公寓"]);
assert.deepEqual(matchAffordableProjects(projects, "graduate", "上城区").map((item) => item.name), ["上城人才房"]);

assert.deepEqual(
  resolveCommunityContext("community", "这个小区租金呢", "万科城市花园", extractCommunityName),
  { communityName: "万科城市花园", nextCommunityContext: "万科城市花园" },
);
assert.deepEqual(
  resolveCommunityContext("trend", "杭州最近房价什么走势", "万科城市花园", extractCommunityName),
  { communityName: "该小区", nextCommunityContext: "" },
);

console.log(`Intent regression tests passed: ${cases.length} queries + 3 policy matching + 2 context cases`);
