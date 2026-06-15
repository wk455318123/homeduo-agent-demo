export const demoScripts = {
  graduate: { label: "毕业生安居", query: "应届毕业生在杭州租房怎么更省？", intent: "graduate-rent", service: "graduate-rent-center" },
  community: { label: "小区行情", query: "万科城市花园二手房价和租金怎么样？", intent: "community" },
  policy: { label: "政策住房", query: "我能申请杭州保租房或人才房吗？", intent: "affordable", service: "affordable-projects" },
};

export const demoSequence = ["graduate", "community", "policy"];
