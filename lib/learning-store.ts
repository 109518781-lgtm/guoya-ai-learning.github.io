export type StageId = "vocab" | "phrase" | "sentence" | "grammar" | "reading" | "exam" | "wrong";
export type QuestionMode = "choice" | "letters" | "blocks";
export type TaskStatus = "draft" | "review" | "published";
export type AssignmentType = "students" | "customGroup" | "system" | "all";
export type OrderStatus = "待确认" | "已拒绝" | "余额不足";
export type StudentSystem = "同步" | "强化" | "尖子";
export type CoinChangeType = "学习奖励" | "商品兑换扣除" | "老师手动增加" | "老师手动扣减";

export interface Student {
  id: string;
  name: string;
  account: string;
  password: string;
  grade: string;
  system: StudentSystem;
  avatarTheme?: string;
}

export interface Teacher {
  id: string;
  name: string;
  account: string;
  password: string;
}

export interface LearningQuestion {
  id: string;
  stage: StageId;
  title: string;
  prompt: string;
  promptHint?: string;
  mode: QuestionMode;
  answer: string;
  needsAnswer?: boolean;
  options?: string[];
  blocks?: string[];
  guidance: Array<{
    prompt: string;
    answer: string;
    options: string[];
  }>;
  summary: {
    breakthrough: string;
    method: string;
    warning: string;
    knowledge: string;
  };
}

export interface LearningTask {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: string;
  reviewed?: boolean;
  rawText: {
    knowledge: string;
    questions: string;
  };
  files: {
    knowledge?: string;
    questions?: string;
  };
  questions: LearningQuestion[];
  extracted: {
    vocabulary: string[];
    phrases: string[];
    sentences: string[];
    grammar: string[];
    readings: string[];
    examQuestions: string[];
  };
}

export interface TaskAssignment {
  id: string;
  taskId: string;
  type: AssignmentType;
  studentIds: string[];
  groupId?: string;
  system?: StudentSystem;
  createdAt: string;
}

export interface StudentGroup {
  id: string;
  name: string;
  studentIds: string[];
}

export interface StudentProgress {
  studentId: string;
  taskId: string;
  completedQuestionIds: string[];
  currentStage: StageId;
  wrongQuestionIds: string[];
  repairedQuestionIds: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  imageDataUrl?: string;
  price: number;
  stock: number;
  category: string;
  active: boolean;
}

export interface RedemptionOrder {
  id: string;
  studentId: string;
  itemId: string;
  itemName: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
}

export interface RedemptionHistory {
  id: string;
  studentId: string;
  itemId: string;
  itemName: string;
  price: number;
  result: "已确认" | "已拒绝";
  createdAt: string;
  handledAt: string;
}

export interface RewardWallet {
  studentId: string;
  stars: number;
  coins: number;
  streakDays: number;
  badges: string[];
  title: string;
  titles: string[];
}

export interface CoinTransaction {
  id: string;
  studentId: string;
  studentName: string;
  studentAccount: string;
  type: CoinChangeType;
  amount: number;
  before: number;
  after: number;
  reason: string;
  createdAt: string;
}

export interface PlatformState {
  students: Student[];
  teachers: Teacher[];
  tasks: LearningTask[];
  taskAssignments: TaskAssignment[];
  studentGroups: StudentGroup[];
  studentProgress: StudentProgress[];
  shopItems: ShopItem[];
  redemptionOrders: RedemptionOrder[];
  redemptionHistory: RedemptionHistory[];
  rewards: RewardWallet[];
  coinTransactions: CoinTransaction[];
}

export const platformStorageKey = "guoya_learning_platform_v1";

export const stages: Array<{
  id: StageId;
  name: string;
  scene: string;
  short: string;
}> = [
  { id: "vocab", name: "单词森林", scene: "森林", short: "单词" },
  { id: "phrase", name: "短语营地", scene: "营地", short: "短语" },
  { id: "sentence", name: "句型工厂", scene: "工厂", short: "句型" },
  { id: "grammar", name: "语法城堡", scene: "城堡", short: "语法" },
  { id: "reading", name: "阅读岛屿", scene: "岛屿", short: "阅读" },
  { id: "exam", name: "原题竞技场", scene: "竞技场", short: "原题" },
  { id: "wrong", name: "错题Boss塔", scene: "Boss塔", short: "错题" }
];

export const shopCategories = ["零食", "文具", "头像框", "皮肤", "特殊奖励"];
export const studentSystems: StudentSystem[] = ["同步", "强化", "尖子"];
export const badgeDefinitions = [
  "单词小勇士",
  "短语猎人",
  "句型工匠",
  "语法守护者",
  "阅读探险家",
  "错题修复师",
  "今日满分王",
  "连续学习达人",
  "英语冒险家"
];
export const titleDefinitions = ["三连胜", "五连胜", "十连胜", "英语冒险家"];

export function getInitialPlatformState(): PlatformState {
  return {
    students: [
      {
        id: "student-demo",
        name: "李明",
        account: "student",
        password: "123456",
        grade: "七年级",
        system: "同步",
        avatarTheme: "勇者"
      }
    ],
    teachers: [
      {
        id: "teacher-demo",
        name: "国雅英语老师",
        account: "teacher",
        password: "123456"
      }
    ],
    tasks: [],
    taskAssignments: [],
    studentGroups: [],
    studentProgress: [],
    shopItems: [],
    redemptionOrders: [],
    redemptionHistory: [],
    rewards: [
      {
        studentId: "student-demo",
        stars: 0,
        coins: 300,
        streakDays: 7,
        badges: ["连续学习达人"],
        title: "英语冒险家",
        titles: ["英语冒险家"]
      }
    ],
    coinTransactions: []
  };
}

export function loadPlatformState(): PlatformState {
  if (typeof window === "undefined") return getInitialPlatformState();
  const raw = window.localStorage.getItem(platformStorageKey);
  if (!raw) {
    const initial = getInitialPlatformState();
    savePlatformState(initial);
    return initial;
  }
  try {
    return normalizePlatformState(JSON.parse(raw));
  } catch {
    const initial = getInitialPlatformState();
    savePlatformState(initial);
    return initial;
  }
}

export function savePlatformState(state: PlatformState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(platformStorageKey, JSON.stringify(state));
}

export function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function getRewardWallet(state: PlatformState, studentId: string) {
  return state.rewards.find((reward) => reward.studentId === studentId) || {
    studentId,
    stars: 0,
    coins: 0,
    streakDays: 0,
    badges: [],
    title: "英语冒险家",
    titles: ["英语冒险家"]
  };
}

export function ensureRewardWallet(state: PlatformState, studentId: string) {
  const existing = state.rewards.find((reward) => reward.studentId === studentId);
  if (existing) return existing;
  const wallet: RewardWallet = { studentId, stars: 0, coins: 0, streakDays: 0, badges: [], title: "英语冒险家", titles: ["英语冒险家"] };
  state.rewards.push(wallet);
  return wallet;
}

export function recordCoinChange(
  state: PlatformState,
  studentId: string,
  type: CoinChangeType,
  amount: number,
  reason: string
) {
  const student = state.students.find((item) => item.id === studentId);
  const wallet = ensureRewardWallet(state, studentId);
  const before = wallet.coins;
  wallet.coins = Math.max(0, wallet.coins + amount);
  state.coinTransactions.unshift({
    id: createId("coin"),
    studentId,
    studentName: student?.name || "未知学生",
    studentAccount: student?.account || "",
    type,
    amount,
    before,
    after: wallet.coins,
    reason,
    createdAt: new Date().toISOString()
  });
  return wallet;
}

export function getAssignedTasks(state: PlatformState, studentId?: string) {
  if (!studentId) return [];
  const student = state.students.find((item) => item.id === studentId);
  if (!student) return [];
  const taskIds = state.taskAssignments
    .filter((assignment) => {
      if (assignment.type === "all") return true;
      if (assignment.type === "students") return assignment.studentIds.includes(studentId);
      if (assignment.type === "customGroup") {
        const group = state.studentGroups.find((item) => item.id === assignment.groupId);
        return Boolean(group?.studentIds.includes(studentId));
      }
      if (assignment.type === "system") return assignment.system === student.system;
      return false;
    })
    .map((assignment) => assignment.taskId);
  return state.tasks.filter((task) => task.status === "published" && taskIds.includes(task.id));
}

export function getOrCreateProgress(state: PlatformState, studentId: string, taskId: string) {
  const existing = state.studentProgress.find((progress) => progress.studentId === studentId && progress.taskId === taskId);
  if (existing) return existing;
  const progress: StudentProgress = {
    studentId,
    taskId,
    completedQuestionIds: [],
    currentStage: "vocab",
    wrongQuestionIds: [],
    repairedQuestionIds: []
  };
  state.studentProgress.push(progress);
  return progress;
}

export function isStageUnlocked(stage: StageId, task: LearningTask, progress: StudentProgress) {
  if (stage === "wrong") return true;
  const stageIndex = stages.findIndex((item) => item.id === stage);
  if (stageIndex <= 0) return true;
  const previous = stages[stageIndex - 1];
  const previousQuestions = task.questions.filter((question) => question.stage === previous.id);
  return previousQuestions.length === 0 || previousQuestions.every((question) => progress.completedQuestionIds.includes(question.id));
}

export function getStageQuestions(stage: StageId, task: LearningTask, progress: StudentProgress) {
  if (stage === "wrong") {
    return task.questions.filter((question) => progress.wrongQuestionIds.includes(question.id));
  }
  return task.questions.filter((question) => question.stage === stage);
}

export function getStageProgress(stage: StageId, task: LearningTask, progress: StudentProgress) {
  const questions = getStageQuestions(stage, task, progress);
  if (!questions.length) return 0;
  const complete = questions.filter((question) => {
    if (stage === "wrong") return progress.repairedQuestionIds.includes(question.id);
    return progress.completedQuestionIds.includes(question.id);
  }).length;
  return Math.round((complete / questions.length) * 100);
}

export function getNextQuestion(task: LearningTask, progress: StudentProgress) {
  const stage = progress.currentStage;
  const pool = stage === "wrong"
    ? task.questions.filter((question) => progress.wrongQuestionIds.includes(question.id) && !progress.repairedQuestionIds.includes(question.id))
    : task.questions.filter((question) => question.stage === stage && !progress.completedQuestionIds.includes(question.id));
  return pool[0];
}

export function skipEmptyStage(state: PlatformState, studentId: string, taskId: string) {
  const next = structuredClone(state) as PlatformState;
  const progress = getOrCreateProgress(next, studentId, taskId);
  const index = stages.findIndex((item) => item.id === progress.currentStage);
  const nextStage = stages[index + 1]?.id;
  if (nextStage) progress.currentStage = nextStage;
  savePlatformState(next);
  return next;
}

export function advanceAfterCorrect(state: PlatformState, question: LearningQuestion, studentId: string, taskId: string) {
  const next = structuredClone(state) as PlatformState;
  const progress = getOrCreateProgress(next, studentId, taskId);
  const wallet = ensureRewardWallet(next, studentId);
  if (progress.currentStage === "wrong" || question.stage === "wrong") {
    if (!progress.repairedQuestionIds.includes(question.id)) progress.repairedQuestionIds.push(question.id);
  } else if (!progress.completedQuestionIds.includes(question.id)) {
    progress.completedQuestionIds.push(question.id);
  }
  wallet.stars += 3;
  recordCoinChange(next, studentId, "学习奖励", 60, `完成${question.title}`);

  const task = next.tasks.find((item) => item.id === taskId);
  if (task && progress.currentStage !== "wrong") {
    const currentStageQuestions = task.questions.filter((item) => item.stage === progress.currentStage);
    const currentComplete = currentStageQuestions.length === 0 || currentStageQuestions.every((item) => progress.completedQuestionIds.includes(item.id));
    if (currentComplete) {
      const index = stages.findIndex((item) => item.id === progress.currentStage);
      const nextStage = stages[index + 1]?.id;
      const badge = stageBadgeMap[progress.currentStage];
      if (badge && !wallet.badges.includes(badge)) wallet.badges.push(badge);
      if (nextStage) progress.currentStage = nextStage;
    }
    if (task.questions.every((item) => progress.completedQuestionIds.includes(item.id)) && !wallet.badges.includes("英语冒险家")) {
      wallet.badges.push("英语冒险家");
      if (!wallet.titles.includes("英语冒险家")) wallet.titles.push("英语冒险家");
      wallet.title = "英语冒险家";
    }
  }
  const completedCount = progress.completedQuestionIds.length;
  if (completedCount >= 3 && !wallet.titles.includes("三连胜")) wallet.titles.push("三连胜");
  if (completedCount >= 5 && !wallet.titles.includes("五连胜")) wallet.titles.push("五连胜");
  if (completedCount >= 10 && !wallet.titles.includes("十连胜")) wallet.titles.push("十连胜");
  return next;
}

export function markWrong(state: PlatformState, questionId: string, studentId: string, taskId: string) {
  const next = structuredClone(state) as PlatformState;
  const progress = getOrCreateProgress(next, studentId, taskId);
  if (!progress.wrongQuestionIds.includes(questionId)) progress.wrongQuestionIds.push(questionId);
  return next;
}

export function createTaskFromText(input: {
  title?: string;
  knowledgeText: string;
  questionText: string;
  knowledgeFile?: string;
  questionFile?: string;
}): LearningTask {
  const knowledge = input.knowledgeText.trim();
  const questions = input.questionText.trim();
  const combined = `${knowledge}\n${questions}`.trim();
  const parsed = parseLearningContent(combined, questions);
  const taskId = createId("task");
  return {
    id: taskId,
    title: input.title || `英语闯关任务 ${new Date().toLocaleDateString("zh-CN")}`,
    status: "review",
    createdAt: new Date().toISOString(),
    rawText: { knowledge, questions },
    reviewed: false,
    files: {
      knowledge: input.knowledgeFile,
      questions: input.questionFile
    },
    extracted: parsed.extracted,
    questions: buildQuestions(parsed, taskId)
  };
}

function parseLearningContent(text: string, questionText: string) {
  const clean = text.replace(/\r/g, "\n");
  const englishWords = Array.from(new Set((clean.match(/\b[A-Za-z]{3,}\b/g) || [])
    .map((word) => word.toLowerCase())
    .filter((word) => !stopWords.has(word))))
    .slice(0, 18);

  const phraseMatches = Array.from(new Set([
    ...(clean.match(/\b(?:be|look|listen|take|make|have|get|give|put|come|go|turn|pay|keep|do|play|read|write|talk|wait|ask|think|work|learn)\s+[a-z]+(?:\s+[a-z]+)?\b/gi) || []),
    ...(clean.match(/\b[a-z]+(?:ing|ed)?\s+(?:at|in|on|for|with|from|to|about|of)\s+[a-z]+\b/gi) || []),
    ...findRepeatedPhrases(clean)
  ].map((item) => item.trim()))).slice(0, 12);

  const sentences = Array.from(new Set((clean.match(/[A-Z][^.!?\n]{12,}[.!?]/g) || [])
    .map((sentence) => sentence.trim())))
    .slice(0, 10);

  const grammar = detectGrammar(clean);
  const readings = sentences.length >= 2 ? [sentences.slice(0, 4).join(" ")] : [];
  const choiceQuestions = parseChoiceQuestions(questionText || clean);

  return {
    extracted: {
      vocabulary: englishWords,
      phrases: phraseMatches,
      sentences,
      grammar,
      readings,
      examQuestions: choiceQuestions.map((item) => item.prompt).slice(0, 10)
    },
    choiceQuestions
  };
}

function buildQuestions(parsed: ReturnType<typeof parseLearningContent>, taskId: string) {
  const questions: LearningQuestion[] = [];
  parsed.extracted.vocabulary.slice(0, 6).forEach((word, index) => {
    questions.push(q(`${taskId}-vocab-choice-${index}`, "vocab", "英译中选择", word, "选择最接近的中文意思", "choice", "待老师补充答案", buildChineseOptions(), true));
    questions.push(q(`${taskId}-vocab-letter-${index}`, "vocab", "中译英拼词", "待老师补充中文释义", "点击字母块拼出英文单词", "letters", word, undefined, false));
  });
  parsed.extracted.phrases.slice(0, 6).forEach((phrase, index) => {
    questions.push(q(`${taskId}-phrase-choice-${index}`, "phrase", "短语理解", phrase, "选择最接近的中文意思", "choice", "待老师补充答案", buildChineseOptions(), true));
    questions.push(q(`${taskId}-phrase-blocks-${index}`, "phrase", "短语拼装", "点击词块组成短语", phrase, "blocks", phrase, undefined, false));
  });
  parsed.extracted.sentences.slice(0, 6).forEach((sentence, index) => {
    questions.push(q(`${taskId}-sentence-${index}`, "sentence", "句型排序", "点击词块还原句子", sentence, "blocks", sentence, undefined, false));
  });
  parsed.extracted.grammar.slice(0, 6).forEach((point, index) => {
    questions.push(q(`${taskId}-grammar-${index}`, "grammar", "语法判断", point, "选择符合该语法点的结构", "choice", guessGrammarAnswer(point), grammarOptions(point), false));
  });
  parsed.extracted.readings.slice(0, 2).forEach((reading, index) => {
    questions.push(q(`${taskId}-reading-${index}`, "reading", "阅读理解", reading, "根据文章选择正确答案", "choice", "待老师补充答案", ["待老师补充答案", "选项B", "选项C", "选项D"], true));
  });
  parsed.choiceQuestions.slice(0, 12).forEach((item, index) => {
    questions.push(q(`${taskId}-exam-${index}`, "exam", "原题训练", item.prompt, item.raw || "选择正确答案", "choice", item.answer || "待老师补充答案", item.options, !item.answer));
  });
  return questions;
}

function q(
  id: string,
  stage: StageId,
  title: string,
  prompt: string,
  promptHint: string,
  mode: QuestionMode,
  answer: string,
  options?: string[],
  needsAnswer = false
): LearningQuestion {
  const answerBlocks = mode === "letters" ? answer.split("") : answer.replace(/[.?!。！？]/g, "").split(/\s+/).filter(Boolean);
  const finalOptions = mode === "choice" ? uniqueOptions([answer, ...(options || [])]).slice(0, 4) : undefined;
  return {
    id,
    stage,
    title,
    prompt,
    promptHint,
    mode,
    answer,
    needsAnswer,
    options: finalOptions,
    blocks: mode === "choice" ? undefined : shuffle(answerBlocks),
    guidance: [
      {
        prompt: "这一步先判断什么最有帮助？",
        answer: "先找关键词和题目要求",
        options: shuffle(["先找关键词和题目要求", "直接看最终答案", "随便选最长选项", "跳过所有信息"])
      },
      {
        prompt: "做完引导后，最终答案应该怎么产生？",
        answer: "学生回到原题自己选择",
        options: shuffle(["老师直接告诉答案", "系统自动填答案", "学生回到原题自己选择", "不用再答题"])
      }
    ],
    summary: {
      breakthrough: "先抓题干关键词，再匹配词义、结构或原文信息。",
      method: "遇到同类题，先判断考查类型，再用排除法或词块顺序完成。",
      warning: needsAnswer ? "本题答案需要老师审核补充，发布前请确认。" : "不要只看单个单词，要结合题目要求。",
      knowledge: title
    }
  };
}

function parseChoiceQuestions(text: string) {
  const blocks = text
    .split(/\n(?=\s*(?:\d+[.)、]|Q\d*[:：]|[A-Z][^.\n]{8,}\?))/)
    .map((block) => block.trim())
    .filter(Boolean);
  const parsed = blocks.map((block) => {
    const options = Array.from(block.matchAll(/(?:^|\n|\s)([A-D])[\).、]\s*([^\nA-D]+)/g)).map((match) => match[2].trim());
    const answerMatch = block.match(/(?:答案|Answer)\s*[:：]?\s*([A-D]|[^\n]+)/i);
    const firstLine = block.split("\n").find((line) => line.trim() && !/^[A-D][\).、]/.test(line.trim())) || block;
    const answer = answerMatch
      ? (/^[A-D]$/i.test(answerMatch[1].trim())
        ? options["ABCD".indexOf(answerMatch[1].trim().toUpperCase())]
        : answerMatch[1].trim())
      : "";
    return {
      prompt: firstLine.replace(/^\d+[.)、]\s*/, "").trim(),
      options: options.length ? options : ["待老师补充答案", "选项B", "选项C", "选项D"],
      answer,
      raw: block
    };
  });
  return parsed.filter((item) => item.prompt.includes("?") || item.options.length > 1).slice(0, 16);
}

function findRepeatedPhrases(text: string) {
  const phrases = (text.toLowerCase().match(/\b[a-z]{3,}\s+[a-z]{3,}(?:\s+[a-z]{3,})?\b/g) || [])
    .filter((phrase) => !phrase.split(/\s+/).every((word) => stopWords.has(word)));
  const counts = phrases.reduce<Record<string, number>>((acc, phrase) => {
    acc[phrase] = (acc[phrase] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).filter(([, count]) => count > 1).map(([phrase]) => phrase);
}

function detectGrammar(text: string) {
  const checks: Array<[RegExp, string]> = [
    [/\b(am|is|are)\s+\w+ing\b/i, "现在进行时：be + verb-ing"],
    [/\b(was|were)\s+\w+ing\b/i, "过去进行时：was/were + verb-ing"],
    [/\b(will|shall)\s+\w+\b/i, "一般将来时：will + 动词原形"],
    [/\b(should|must|can|could|may|might)\s+\w+\b/i, "情态动词：情态动词 + 动词原形"],
    [/\b(have|has)\s+\w+(ed|en)\b/i, "现在完成时：have/has + 过去分词"],
    [/\bmore\s+\w+\s+than\b|\w+er\s+than\b/i, "比较级：形容词比较级 + than"]
  ];
  const found = checks.filter(([reg]) => reg.test(text)).map(([, label]) => label);
  return found.length ? found : ["基础句型：主语 + 谓语 + 宾语"];
}

function guessGrammarAnswer(point: string) {
  if (point.includes("现在进行时")) return "be + verb-ing";
  if (point.includes("过去进行时")) return "was/were + verb-ing";
  if (point.includes("将来时")) return "will + verb";
  if (point.includes("情态动词")) return "modal verb + verb";
  if (point.includes("完成时")) return "have/has + past participle";
  return "Subject + verb + object";
}

function grammarOptions(point: string) {
  return uniqueOptions([guessGrammarAnswer(point), "did + verb", "to + verb", "noun + noun"]).slice(0, 4);
}

function buildChineseOptions() {
  return ["待老师补充答案", "选项B", "选项C", "选项D"];
}

function uniqueOptions(options: string[]) {
  return Array.from(new Set(options.filter(Boolean)));
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

const stageBadgeMap: Partial<Record<StageId, string>> = {
  vocab: "单词小勇士",
  phrase: "短语猎人",
  sentence: "句型工匠",
  grammar: "语法守护者",
  reading: "阅读探险家",
  wrong: "错题修复师"
};

function normalizePlatformState(raw: Partial<PlatformState> & Record<string, unknown>): PlatformState {
  const initial = getInitialPlatformState();
  const state: PlatformState = {
    students: Array.isArray(raw.students) ? raw.students as Student[] : initial.students,
    teachers: Array.isArray(raw.teachers) ? raw.teachers as Teacher[] : initial.teachers,
    tasks: Array.isArray(raw.tasks) ? raw.tasks as LearningTask[] : [],
    taskAssignments: Array.isArray(raw.taskAssignments) ? raw.taskAssignments as TaskAssignment[] : [],
    studentGroups: Array.isArray(raw.studentGroups) ? raw.studentGroups as StudentGroup[] : [],
    studentProgress: Array.isArray(raw.studentProgress) ? raw.studentProgress as StudentProgress[] : [],
    shopItems: Array.isArray(raw.shopItems) ? raw.shopItems as ShopItem[] : [],
    redemptionOrders: Array.isArray(raw.redemptionOrders) ? raw.redemptionOrders as RedemptionOrder[] : [],
    redemptionHistory: Array.isArray(raw.redemptionHistory) ? raw.redemptionHistory as RedemptionHistory[] : [],
    rewards: Array.isArray(raw.rewards) ? raw.rewards as RewardWallet[] : initial.rewards,
    coinTransactions: Array.isArray(raw.coinTransactions) ? raw.coinTransactions as CoinTransaction[] : []
  };
  state.students = state.students.map((student) => ({
    ...student,
    system: (student.system || (student as unknown as { className?: string }).className || "同步") as StudentSystem
  }));
  state.taskAssignments = state.taskAssignments.map((assignment) => {
    if ((assignment as unknown as { type?: string }).type === "class") {
      return { ...assignment, type: "system", system: ((assignment as unknown as { className?: string }).className || "同步") as StudentSystem };
    }
    if ((assignment as unknown as { type?: string }).type === "group") {
      return { ...assignment, type: "students", studentIds: assignment.studentIds || [] };
    }
    return assignment;
  });
  state.rewards = state.rewards.map((reward) => ({
    ...reward,
    title: reward.title || "英语冒险家",
    titles: reward.titles?.length ? reward.titles : ["英语冒险家"],
    badges: reward.badges || []
  }));
  state.students.forEach((student) => ensureRewardWallet(state, student.id));
  return state;
}

const stopWords = new Set([
  "the", "and", "for", "you", "are", "was", "were", "with", "that", "this", "from", "have", "has",
  "not", "but", "what", "when", "where", "which", "there", "their", "about", "into", "your", "they",
  "them", "she", "her", "his", "him", "our", "can", "could", "should", "will", "would", "may", "might"
]);
