export type AiProviderName = "deepseek" | "openai" | "claude" | "gemini";

export interface AiExtractRequest {
  knowledgeFileIds: string[];
  questionFileIds: string[];
  subject: "english" | "math" | "chinese" | "physics";
}

export interface AiExtractResult {
  vocabulary: string[];
  phrases: string[];
  sentencePatterns: string[];
  grammarPoints: string[];
  readings: string[];
  questions: Array<{
    prompt: string;
    answer: string;
    explanation: string;
    needsTeacherReview: boolean;
  }>;
}

export interface AiProvider {
  name: AiProviderName;
  extractLearningTask(request: AiExtractRequest): Promise<AiExtractResult>;
}

export class MockAiProvider implements AiProvider {
  name: AiProviderName = "deepseek";

  async extractLearningTask(): Promise<AiExtractResult> {
    return {
      vocabulary: ["borrow", "library", "carefully"],
      phrases: ["look for", "on time", "be good at"],
      sentencePatterns: ["He is looking for his book."],
      grammarPoints: ["现在进行时", "should + 动词原形"],
      readings: ["Tom is in the library. He is looking for his book."],
      questions: [
        {
          prompt: "What is Tom doing now?",
          answer: "He is looking for his book.",
          explanation: "先识别 now，再用现在进行时。",
          needsTeacherReview: true
        }
      ]
    };
  }
}

export const aiProvider = new MockAiProvider();
