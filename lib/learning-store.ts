export type StageId = "vocab" | "phrase" | "sentence" | "grammar" | "reading" | "exam" | "wrong";
export type QuestionMode = "choice" | "letters" | "blocks";

export interface LearningQuestion {
  id: string;
  stage: StageId;
  title: string;
  prompt: string;
  promptHint?: string;
  mode: QuestionMode;
  answer: string;
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
  status: "draft" | "review" | "published";
  createdAt: string;
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

export interface StudentProgress {
  taskId: string;
  completedQuestionIds: string[];
  currentStage: StageId;
  wrongQuestionIds: string[];
  repairedQuestionIds: string[];
  stars: number;
  coins: number;
}

export interface PlatformState {
  tasks: LearningTask[];
  activeTaskId: string;
  progress: StudentProgress;
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

export function createMockTask(input?: {
  knowledgeText?: string;
  questionText?: string;
  knowledgeFile?: string;
  questionFile?: string;
}): LearningTask {
  const now = new Date().toISOString();
  return {
    id: `task-${Date.now()}`,
    title: "Unit 3 Daily English 闯关任务",
    status: "review",
    createdAt: now,
    rawText: {
      knowledge: input?.knowledgeText || "borrow 借；library 图书馆；look for 寻找；be good at 擅长；现在进行时 be + verb-ing",
      questions: input?.questionText || "What is Tom doing now? He is looking for his book."
    },
    files: {
      knowledge: input?.knowledgeFile,
      questions: input?.questionFile
    },
    extracted: {
      vocabulary: ["borrow / 借", "library / 图书馆", "carefully / 小心地"],
      phrases: ["look for / 寻找", "be good at / 擅长", "on time / 准时"],
      sentences: ["He is looking for his book.", "You should read carefully."],
      grammar: ["现在进行时：be + verb-ing", "should + 动词原形表示建议"],
      readings: ["Tom is in the library. He is looking for his book. He should read carefully."],
      examQuestions: ["What is Tom doing now?", "Where is Tom?"]
    },
    questions: createMockQuestions()
  };
}

export function createMockQuestions(): LearningQuestion[] {
  return [
    q("vocab-1", "vocab", "英译中", "borrow", "选择正确中文意思", "choice", "借", ["借", "还", "读", "写"], "看到 borrow，先想“借入并之后归还”。", "遇到动词词义题，先判断动作方向。", "borrow 和 return 容易混。", "borrow = 借"),
    q("vocab-2", "vocab", "中译英拼词", "借", "点击字母拼出英文单词", "letters", "borrow", undefined, "先想中文对应英文，再按字母顺序点选。", "长单词先分成 bor + row 记忆。", "不要漏掉第二个 r。", "borrow 拼写"),
    q("phrase-1", "phrase", "短语英译中", "look for", "选择正确中文意思", "choice", "寻找", ["寻找", "照顾", "等待", "擅长"], "look for 是一个整体短语。", "短语题不要逐词硬翻，先看固定搭配。", "look after 才是照顾。", "look for = 寻找"),
    q("phrase-2", "phrase", "短语排序", "擅长", "点击词块组成短语", "blocks", "be good at", undefined, "先找核心形容词 good，再补介词 at。", "固定短语按整体记忆。", "不要写成 good in。", "be good at"),
    q("sentence-1", "sentence", "句子排序", "他正在寻找他的书。", "点击词块组成正确句子", "blocks", "He is looking for his book.", undefined, "先识别正在发生的动作，用 be + verb-ing。", "句子排序先定主语，再找谓语结构。", "不要把 looking 放到 is 前面。", "现在进行时；look for"),
    q("grammar-1", "grammar", "语法判断", "Which structure shows an action happening now?", "选择正确语法结构", "choice", "be + verb-ing", ["be + verb-ing", "did + verb", "will + verb", "to + verb"], "now 是现在进行时的重要信号。", "看到 now / right now 先考虑 be + verb-ing。", "不要用过去式 did。", "现在进行时"),
    q("reading-1", "reading", "阅读选择", "Tom is in the library. He is looking for his book.", "Where is Tom?", "choice", "In the library.", ["In the library.", "At home.", "In the shop.", "At school gate."], "先定位问题 Where，再找地点词。", "阅读题先圈题干关键词，再回文定位。", "不要被 book 干扰，问的是地点。", "阅读信息定位"),
    q("exam-1", "exam", "原题训练", "What is Tom doing now?", "选择正确答案", "choice", "He is looking for his book.", ["He is looking for his book.", "He reads yesterday.", "He will buy a book.", "He is good at football."], "now 对应现在进行时。", "原题先找时间标志，再匹配语法结构。", "不要选将来时或过去时。", "现在进行时原题")
  ];
}

function q(
  id: string,
  stage: StageId,
  title: string,
  prompt: string,
  promptHint: string,
  mode: QuestionMode,
  answer: string,
  options: string[] | undefined,
  breakthrough: string,
  method: string,
  warning: string,
  knowledge: string
): LearningQuestion {
  const answerBlocks = mode === "letters" ? answer.split("") : answer.split(" ");
  return {
    id,
    stage,
    title,
    prompt,
    promptHint,
    mode,
    answer,
    options,
    blocks: mode === "choice" ? undefined : shuffle(answerBlocks),
    guidance: [
      {
        prompt: "这题应该先抓哪个线索？",
        answer: breakthrough,
        options: shuffle([breakthrough, "直接看最终答案", "随便选一个最长选项", "先跳过本题"])
      },
      {
        prompt: "最终答案应该由谁完成？",
        answer: "学生自己完成",
        options: ["系统直接填写", "老师直接告诉", "学生自己完成", "不用作答"]
      }
    ],
    summary: { breakthrough, method, warning, knowledge }
  };
}

export function getInitialPlatformState(): PlatformState {
  const task = createMockTask();
  return {
    tasks: [{ ...task, status: "published" }],
    activeTaskId: task.id,
    progress: {
      taskId: task.id,
      completedQuestionIds: [],
      currentStage: "vocab",
      wrongQuestionIds: [],
      repairedQuestionIds: [],
      stars: 0,
      coins: 0
    }
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
    return JSON.parse(raw) as PlatformState;
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

export function getActiveTask(state: PlatformState) {
  return state.tasks.find((task) => task.id === state.activeTaskId && task.status === "published") || state.tasks.find((task) => task.status === "published") || state.tasks[0];
}

export function isStageUnlocked(stage: StageId, task: LearningTask, progress: StudentProgress) {
  if (stage === "wrong") return true;
  const stageIndex = stages.findIndex((item) => item.id === stage);
  if (stageIndex <= 0) return true;
  const previous = stages[stageIndex - 1];
  const previousQuestions = task.questions.filter((question) => question.stage === previous.id);
  return previousQuestions.length > 0 && previousQuestions.every((question) => progress.completedQuestionIds.includes(question.id));
}

export function getStageProgress(stage: StageId, task: LearningTask, progress: StudentProgress) {
  const questions = stage === "wrong"
    ? task.questions.filter((question) => progress.wrongQuestionIds.includes(question.id))
    : task.questions.filter((question) => question.stage === stage);
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
  return pool[0] || task.questions.find((question) => !progress.completedQuestionIds.includes(question.id)) || task.questions[0];
}

export function advanceAfterCorrect(state: PlatformState, question: LearningQuestion) {
  const next = structuredClone(state) as PlatformState;
  const progress = next.progress;
  if (progress.currentStage === "wrong" || question.stage === "wrong") {
    if (!progress.repairedQuestionIds.includes(question.id)) progress.repairedQuestionIds.push(question.id);
  } else if (!progress.completedQuestionIds.includes(question.id)) {
    progress.completedQuestionIds.push(question.id);
  }
  progress.stars += 3;
  progress.coins += 60;

  const task = getActiveTask(next);
  const currentStageQuestions = task.questions.filter((item) => item.stage === progress.currentStage);
  const currentComplete = currentStageQuestions.every((item) => progress.completedQuestionIds.includes(item.id));
  if (currentComplete && progress.currentStage !== "wrong") {
    const index = stages.findIndex((item) => item.id === progress.currentStage);
    const nextStage = stages[index + 1]?.id;
    if (nextStage) progress.currentStage = nextStage;
  }
  return next;
}

export function markWrong(state: PlatformState, questionId: string) {
  const next = structuredClone(state) as PlatformState;
  if (!next.progress.wrongQuestionIds.includes(questionId)) next.progress.wrongQuestionIds.push(questionId);
  return next;
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}
