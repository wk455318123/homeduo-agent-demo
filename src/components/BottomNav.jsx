import React from "react";
import { Menu, Search, Sparkles, WalletCards } from "lucide-react";

const listingTypes = ["listing-center", "buy-listings", "rent-listings", "rent-market", "rent-detail", "community-sale-listings", "community-rent-listings"];
const serviceTypes = ["service-center", "graduate-rent-center", "fund", "mortgage", "deposit", "affordable-projects", "affordable-alerts", "affordable-apply", "affordable-progress", "affordable-project-detail", "school-policy", "amenities"];

export function BottomNav({ drawer, onService, onReset }) {
  const drawerType = typeof drawer === "string" ? drawer : drawer?.type;
  const active = drawerType === "profile" ? "profile" : listingTypes.includes(drawerType) ? "listing" : serviceTypes.includes(drawerType) ? "service" : "ask";
  return <nav className="bottom-nav"><button className={active === "ask" ? "active" : ""} onClick={onReset}><Sparkles size={20} /><span>问房</span></button><button className={active === "listing" ? "active" : ""} onClick={() => onService("listing-center")}><Search size={20} /><span>找房</span></button><button className={active === "service" ? "active" : ""} onClick={() => onService("service-center")}><WalletCards size={20} /><span>服务</span></button><button className={active === "profile" ? "active" : ""} onClick={() => onService("profile")}><Menu size={20} /><span>我的</span></button></nav>;
}
