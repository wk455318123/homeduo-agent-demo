export function matchesRentPrice(priceFilter, monthlyPrice) {
  if (priceFilter === "不限租金") return true;
  if (priceFilter === "4,000元内") return monthlyPrice <= 4000;
  if (priceFilter === "4,000-5,000元") return monthlyPrice > 4000 && monthlyPrice <= 5000;
  if (priceFilter === "5,000元以上") return monthlyPrice > 5000;
  return false;
}

export function recommendRentalHomes(homes, { location, budget, layout }, limit = 3) {
  return homes
    .filter((home) => home.price <= budget)
    .map((home) => ({
      ...home,
      score: (home.location === location ? 4 : 0) + (home.layout === layout ? 4 : 0),
    }))
    .sort((a, b) => b.score - a.score || a.price - b.price)
    .slice(0, limit);
}
