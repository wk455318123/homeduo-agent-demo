export function matchesRentPrice(priceFilter, monthlyPrice) {
  if (priceFilter === "不限租金") return true;
  if (priceFilter === "4,000元内") return monthlyPrice <= 4000;
  if (priceFilter === "4,000-5,000元") return monthlyPrice > 4000 && monthlyPrice <= 5000;
  if (priceFilter === "5,000元以上") return monthlyPrice > 5000;
  return false;
}
