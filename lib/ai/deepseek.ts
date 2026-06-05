export interface DeepSeekParseRequest {
  knowledgeText: string;
  questionText?: string;
  mode: "generate_from_material";
}

export interface DeepSeekVocabularyItem {
  word: string;
  meaning: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface DeepSeekPhraseItem {
  phrase: string;
  meaning: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface DeepSeekSentenceItem {
  sentence: string;
  translation: string;
  wordBlocks: string[];
  question: string;
  answer: string;
  explanation: string;
}

export interface DeepSeekGrammarItem {
  grammarPoint: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface DeepSeekReadingItem {
  passage: string;
  questions: Array<{
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }>;
}

export interface DeepSeekGeneratedExercise {
  stage: string;
  type: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

export interface DeepSeekParseResult {
  courseTitle: string;
  vocabularyItems: DeepSeekVocabularyItem[];
  phraseItems: DeepSeekPhraseItem[];
  sentenceItems: DeepSeekSentenceItem[];
  grammarItems: DeepSeekGrammarItem[];
  readingItems: DeepSeekReadingItem[];
  generatedExercises: DeepSeekGeneratedExercise[];
  reviewStatus: "待老师审核";
}

interface DeepSeekChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
}

export class DeepSeekJsonParseError extends Error {
  rawContent: string;

  constructor(message: string, rawContent: string) {
    super(message);
    this.name = "DeepSeekJsonParseError";
    this.rawContent = rawContent;
  }
}

export async function parseLearningMaterialWithDeepSeek(
  request: DeepSeekParseRequest
): Promise<DeepSeekParseResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY，请在 .env.local 中添加");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      temperature: 0.2,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "你是一个面向中国学生的英语自适应学习任务生成引擎。",
            "你必须严格返回 JSON，不要返回 Markdown，不要返回解释文字。",
            "老师只提供学习资料，你需要自动提取学习内容并自动出题。",
            "所有界面说明用简体中文；英文只用于学习内容。",
            "题目尽量适合点击作答：选择题、字母块、词块排序。",
            "输出题型必须覆盖：单词题、短语题、语法选择题、句型改写题、阅读理解题、完形填空题、错题变式题。",
            "每个明确知识点至少生成：3道基础题、2道提升题、1道挑战题。",
            "generatedExercises.type 必须写清楚题型和难度，例如：单词题-基础、语法选择题-提升、错题变式题-挑战。",
            "如果资料中没有阅读文章，readingItems 可以为空数组。",
            "必须返回完整字段：courseTitle, vocabularyItems, phraseItems, sentenceItems, grammarItems, readingItems, generatedExercises, reviewStatus。",
            "reviewStatus 固定为：待老师审核。"
          ].join("\n")
        },
        {
          role: "user",
          content: buildPrompt(request)
        }
      ]
    })
  });
  console.log(`DeepSeek response status: ${response.status}`);

  const body = await response.json().catch(() => null) as DeepSeekChatResponse | null;
  if (!response.ok) {
    throw new Error(body?.error?.message || `DeepSeek API 调用失败，HTTP ${response.status}`);
  }

  const content = body?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek API 没有返回可解析内容");
  }

  return parseStrictJson(content);
}

function buildPrompt(request: DeepSeekParseRequest) {
  return `
请根据以下英语学习资料生成结构化学习任务。

必须返回这个 JSON 结构：
{
  "courseTitle": "",
  "vocabularyItems": [
    {
      "word": "",
      "meaning": "",
      "question": "",
      "options": [],
      "answer": "",
      "explanation": ""
    }
  ],
  "phraseItems": [
    {
      "phrase": "",
      "meaning": "",
      "question": "",
      "options": [],
      "answer": "",
      "explanation": ""
    }
  ],
  "sentenceItems": [
    {
      "sentence": "",
      "translation": "",
      "wordBlocks": [],
      "question": "",
      "answer": "",
      "explanation": ""
    }
  ],
  "grammarItems": [
    {
      "grammarPoint": "",
      "question": "",
      "options": [],
      "answer": "",
      "explanation": ""
    }
  ],
  "readingItems": [
    {
      "passage": "",
      "questions": [
        {
          "question": "",
          "options": [],
          "answer": "",
          "explanation": ""
        }
      ]
    }
  ],
  "generatedExercises": [
    {
      "stage": "",
      "type": "",
      "question": "",
      "options": [],
      "answer": "",
      "explanation": ""
    }
  ],
  "reviewStatus": "待老师审核"
}

输入：
知识点资料

输出内容必须包含：
1. 单词题
2. 短语题
3. 语法选择题
4. 句型改写题
5. 阅读理解题
6. 完形填空题
7. 错题变式题

生成要求：
1. 提取核心单词，并给中文意思、选择题选项、答案、解析。
2. 提取核心短语，并给中文意思、选择题选项、答案、解析。
3. 提取可用于排序训练或改写训练的英文句子，wordBlocks 必须是句子拆分后的词块。
4. 提取语法点，并生成语法选择题。
5. 如有阅读文章，生成阅读选择题；如没有明显阅读文章，可用资料中的完整段落生成一段短阅读。
6. 必须生成完形填空题，放入 generatedExercises，stage 使用 reading 或 exam。
7. 必须生成错题变式题，放入 generatedExercises，stage 使用 exam。
8. 每个明确知识点至少生成：3道基础题、2道提升题、1道挑战题。
9. generatedExercises 汇总生成适合闯关的题目，stage 可用：vocab, phrase, sentence, grammar, reading, exam。
10. generatedExercises.type 必须包含题型和难度，例如：单词题-基础、短语题-提升、错题变式题-挑战。
11. 每一道题必须返回标准答案和解析。
12. 如果资料很少，也要基于资料生成合理的最小任务，但不要编造与资料无关的内容。

知识点资料：
${request.knowledgeText}

题目/补充资料：
${request.questionText || ""}
`.trim();
}

function parseStrictJson(content: string): DeepSeekParseResult {
  const cleaned = content
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as DeepSeekParseResult;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.vocabularyItems)) {
      throw new Error("JSON 缺少 vocabularyItems 等必要字段");
    }
    return parsed;
  } catch (error) {
    const reason = error instanceof Error ? error.message : "未知错误";
    throw new DeepSeekJsonParseError(`DeepSeek返回内容不是有效JSON：${reason}`, content);
  }
}
