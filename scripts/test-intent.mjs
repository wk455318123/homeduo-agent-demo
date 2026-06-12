import assert from "node:assert/strict";
import { extractCommunityName, identifyPrompt } from "../src/intent.js";

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
  ["万科城市花园学区怎么样", "school", ""],
  ["我能申请杭州保租房吗", "affordable", ""],
  ["人才房申请需要什么条件", "affordable", ""],
  ["钱塘区蓝领公寓怎么申请", "affordable", ""],
];

for (const [query, expectedIntent, expectedCommunity] of cases) {
  assert.equal(identifyPrompt(query), expectedIntent, `意图识别错误：${query}`);
  assert.equal(extractCommunityName(query), expectedCommunity, `小区名称提取错误：${query}`);
}

console.log(`Intent regression tests passed: ${cases.length}`);
