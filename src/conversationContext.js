export function resolveCommunityContext(id, text, currentCommunity, extractCommunityName) {
  const contextAware =
    ["community", "school", "amenities"].includes(id) ||
    (id === "listings" && /(这个|该|小区)/.test(text));
  const detectedCommunity = contextAware ? extractCommunityName(text) : "";

  return {
    communityName: detectedCommunity || (contextAware ? currentCommunity : "") || "该小区",
    nextCommunityContext: detectedCommunity || (contextAware ? currentCommunity : ""),
  };
}
