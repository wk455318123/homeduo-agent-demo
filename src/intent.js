export function identifyPrompt(text) {
  const normalized = text.replace(/\s+/g, "");
  const hasCommunityEntity = /(万科城市花园|小区|花园|家园|公馆|苑|府)/.test(normalized);
  const asksCommunityMarket = /(二手房|房价|成交|均价|租金|租售比|在售|出租|卖|买)/.test(normalized);

  if (/学区|学校|入学/.test(normalized)) return "school";
  if (/租售比/.test(normalized)) return "community";
  if (hasCommunityEntity && asksCommunityMarket) return "community";
  if (/公积金.*(租房|房租)|免押|找.*租|想.*租|租房|合租|整租|可租房源/.test(normalized)) return "rent";
  if (/万科|小区|成交/.test(normalized)) return "community";
  if (/预算|余杭|萧山|怎么选/.test(normalized)) return "budget";
  return "trend";
}
