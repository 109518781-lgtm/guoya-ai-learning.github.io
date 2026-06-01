import {
  BookOpen,
  Brain,
  Castle,
  CircleHelp,
  Factory,
  Flag,
  Gem,
  GraduationCap,
  Lock,
  Map,
  PackageCheck,
  Puzzle,
  ScrollText,
  ShieldCheck,
  Swords,
  Trees,
  Trophy,
  WandSparkles
} from "lucide-react";

export const studentProfile = {
  realName: "李明",
  grade: "初一",
  className: "七年级A班",
  group: "青藤小组",
  avatarTheme: "森林勇者",
  streakDays: 12,
  stars: 286,
  coins: 1280,
  badges: ["单词森林三星", "连续7天", "阅读岛屿探索者"]
};

export const learningLevels = [
  {
    id: "vocab",
    name: "单词森林",
    icon: Trees,
    status: "completed",
    accuracy: 100,
    stars: 3,
    color: "green",
    description: "突破单词障碍"
  },
  {
    id: "phrase",
    name: "短语峡谷",
    icon: Castle,
    status: "completed",
    accuracy: 100,
    stars: 3,
    color: "yellow",
    description: "理解高频短语"
  },
  {
    id: "sentence",
    name: "句型工厂",
    icon: Factory,
    status: "current",
    accuracy: 76,
    stars: 1,
    color: "blue",
    description: "掌握句子结构"
  },
  {
    id: "grammar",
    name: "语法迷宫",
    icon: Puzzle,
    status: "locked",
    accuracy: 0,
    stars: 0,
    color: "purple",
    description: "判断语法规则"
  },
  {
    id: "reading",
    name: "阅读岛屿",
    icon: Map,
    status: "locked",
    accuracy: 0,
    stars: 0,
    color: "orange",
    description: "拆解文章信息"
  },
  {
    id: "exam",
    name: "原题战场",
    icon: Swords,
    status: "locked",
    accuracy: 0,
    stars: 0,
    color: "red",
    description: "回到考试原题"
  },
  {
    id: "wrong",
    name: "错题修复站",
    icon: ShieldCheck,
    status: "locked",
    accuracy: 0,
    stars: 0,
    color: "green",
    description: "独立修复错题"
  }
] as const;

export const todayTasks = [
  { title: "句型工厂继续挑战", progress: 76, reward: "+30金币", icon: Factory },
  { title: "复习 yesterday / tomorrow", progress: 100, reward: "+2星星", icon: Trophy },
  { title: "错题修复 3 题", progress: 33, reward: "+60金币", icon: CircleHelp }
];

export const practiceQuestion = {
  levelName: "句型工厂",
  type: "句子排序",
  prompt: "把下面词块按正确语序组成句子",
  target: "He is looking for his book.",
  chinese: "他正在寻找他的书。",
  blocks: ["for", "He", "book.", "looking", "is", "his"],
  choices: ["He is looking for his book.", "He looking is for his book.", "His book is looking for he."],
  guidance: [
    {
      prompt: "这句话描述正在发生的动作，应该先找哪个结构？",
      answer: "be + verb-ing",
      options: ["be + verb-ing", "did + 动词原形", "will + 动词原形", "名词 + 名词"]
    },
    {
      prompt: "主语 He 后面应该接哪个 be 动词？",
      answer: "is",
      options: ["am", "is", "are", "be"]
    },
    {
      prompt: "look for 在句中表示什么？",
      answer: "寻找",
      options: ["照顾", "寻找", "等待", "喜欢"]
    }
  ],
  summary: {
    breakthrough: "先识别现在进行时 be + verb-ing，再找主语和动词搭配。",
    method: "遇到句子排序，先定主语，再找谓语结构，最后补宾语和介词短语。",
    warning: "不要把 looking 放在 is 前面，也不要漏掉 for。",
    knowledge: "现在进行时；look for 短语"
  }
};

export const shopCategories = ["零食", "文具", "头像框", "皮肤", "抽卡", "特殊奖励"];

export const shopItems = [
  { name: "海苔脆片", category: "零食", price: 180, stock: 12, status: "可兑换", gradient: "from-lime-200 to-emerald-300" },
  { name: "国雅定制笔", category: "文具", price: 260, stock: 8, status: "可兑换", gradient: "from-blue-200 to-cyan-300" },
  { name: "星光头像框", category: "头像框", price: 420, stock: 99, status: "可兑换", gradient: "from-yellow-200 to-orange-300" },
  { name: "森林地图主题", category: "皮肤", price: 680, stock: 99, status: "待老师确认", gradient: "from-green-200 to-lime-300" },
  { name: "单次抽卡券", category: "抽卡", price: 120, stock: 30, status: "可兑换", gradient: "from-purple-200 to-fuchsia-300" },
  { name: "课堂优先答题卡", category: "特殊奖励", price: 520, stock: 5, status: "可兑换", gradient: "from-red-200 to-pink-300" }
];

export const orders = [
  { student: "李明", item: "森林地图主题", price: 680, status: "待确认" },
  { student: "王佳", item: "国雅定制笔", price: 260, status: "已确认" },
  { student: "陈宇", item: "海苔脆片", price: 180, status: "已完成" },
  { student: "李明", item: "星光头像框", price: 420, status: "已拒绝" }
];

export const cards = [
  { name: "单词森林守护者", rarity: "普通", color: "from-lime-200 to-green-300", power: "单词复习金币 +5%" },
  { name: "峡谷短语猎人", rarity: "稀有", color: "from-blue-200 to-cyan-300", power: "短语关提示减少" },
  { name: "语法迷宫贤者", rarity: "史诗", color: "from-purple-200 to-violet-400", power: "语法关星星 +1" },
  { name: "阅读岛屿传说龙", rarity: "传说", color: "from-yellow-200 via-orange-300 to-red-300", power: "阅读通关奖励翻倍" }
];

export const teacherStudents = [
  { name: "李明", grade: "初一", className: "七年级A班", group: "青藤小组", account: "lm001", password: "可重置", progress: 62, accuracy: 91, stuck: "句型工厂" },
  { name: "王佳", grade: "初一", className: "七年级A班", group: "青藤小组", account: "wj002", password: "可重置", progress: 78, accuracy: 88, stuck: "阅读岛屿" },
  { name: "陈宇", grade: "初一", className: "七年级B班", group: "冲刺小组", account: "cy003", password: "可重置", progress: 44, accuracy: 76, stuck: "语法迷宫" }
];

export const extractedContent = [
  { type: "单词", count: 28, status: "已审核", sample: "borrow / return / carefully", icon: BookOpen },
  { type: "短语", count: 12, status: "待审核", sample: "look for / be good at / on time", icon: ScrollText },
  { type: "句型", count: 8, status: "待审核", sample: "He is looking for his book.", icon: Factory },
  { type: "语法点", count: 5, status: "AI推断", sample: "现在进行时；should用法", icon: Brain },
  { type: "阅读文章", count: 2, status: "待审核", sample: "Library reading passage", icon: Map },
  { type: "题目答案解析", count: 18, status: "AI推断", sample: "答案缺失，已生成解析", icon: WandSparkles }
];

export const teacherMenu = [
  { name: "工作台", icon: GraduationCap },
  { name: "学生管理", icon: BookOpen },
  { name: "任务管理", icon: Flag },
  { name: "资料上传", icon: PackageCheck },
  { name: "AI解析审核", icon: WandSparkles },
  { name: "任务发布", icon: ScrollText },
  { name: "学习数据", icon: Brain },
  { name: "商城管理", icon: Gem },
  { name: "订单管理", icon: Trophy },
  { name: "系统设置", icon: Lock }
];

export const learningPortrait = [
  "单词基础已稳定，短语迁移仍需巩固",
  "句型排序依赖提示，建议增加词块训练",
  "阅读题主要卡在信息定位和同义替换",
  "错题修复后独立正确率提升到 82%"
];
