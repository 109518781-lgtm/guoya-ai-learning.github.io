"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  ClipboardList,
  Coins,
  FileText,
  GraduationCap,
  Lock,
  PackageCheck,
  PackagePlus,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  Users,
  WandSparkles
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  createMockTask,
  getInitialPlatformState,
  LearningTask,
  loadPlatformState,
  PlatformState,
  savePlatformState
} from "@/lib/learning-store";
import { orders, shopItems, teacherStudents } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const menu = [
  { name: "工作台", icon: GraduationCap },
  { name: "学生管理", icon: Users },
  { name: "资料上传", icon: UploadCloud },
  { name: "AI解析审核", icon: WandSparkles },
  { name: "任务发布", icon: ClipboardList },
  { name: "学习数据", icon: BookOpen },
  { name: "商城管理", icon: PackagePlus },
  { name: "订单管理", icon: Coins },
  { name: "系统设置", icon: Lock }
];

export function TeacherDashboardClient() {
  const [state, setState] = useState<PlatformState>(getInitialPlatformState());
  const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null);
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [knowledgeText, setKnowledgeText] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [draftTask, setDraftTask] = useState<LearningTask | null>(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    setState(loadPlatformState());
  }, []);

  const activeTask = useMemo(() => state.tasks.find((task) => task.id === state.activeTaskId) || state.tasks[0], [state]);

  function handleFile(type: "knowledge" | "questions", event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt", "md"].includes(ext || "")) {
      setStatus("仅支持 PDF、DOCX、TXT、MD。");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setStatus("单个文件不能超过50MB。");
      return;
    }
    if (type === "knowledge") setKnowledgeFile(file);
    if (type === "questions") setQuestionFile(file);
    setStatus(`${file.name} 已上传，等待解析。`);
  }

  function runAiParse() {
    const task = createMockTask({
      knowledgeText,
      questionText,
      knowledgeFile: knowledgeFile?.name,
      questionFile: questionFile?.name
    });
    setDraftTask(task);
    setStatus("AI mock 解析完成，结果已进入老师审核。");
  }

  function updateQuestionTitle(questionId: string, value: string) {
    if (!draftTask) return;
    setDraftTask({
      ...draftTask,
      questions: draftTask.questions.map((question) => question.id === questionId ? { ...question, prompt: value } : question)
    });
  }

  function deleteQuestion(questionId: string) {
    if (!draftTask) return;
    setDraftTask({
      ...draftTask,
      questions: draftTask.questions.filter((question) => question.id !== questionId)
    });
  }

  function addQuestion() {
    if (!draftTask) return;
    setDraftTask({
      ...draftTask,
      questions: [
        ...draftTask.questions,
        {
          ...draftTask.questions[0],
          id: `custom-${Date.now()}`,
          stage: "exam",
          title: "新增原题",
          prompt: "Which sentence is correct?",
          answer: "He is looking for his book."
        }
      ]
    });
  }

  function publishTask() {
    if (!draftTask) {
      setStatus("请先点击 AI解析 生成任务。");
      return;
    }
    const published: LearningTask = { ...draftTask, status: "published" };
    const next: PlatformState = {
      tasks: [published, ...state.tasks.filter((task) => task.id !== published.id)],
      activeTaskId: published.id,
      progress: {
        taskId: published.id,
        completedQuestionIds: [],
        currentStage: "vocab",
        wrongQuestionIds: [],
        repairedQuestionIds: [],
        stars: state.progress.stars,
        coins: state.progress.coins
      }
    };
    setState(next);
    savePlatformState(next);
    setStatus("任务已发布，学生端可以开始学习。");
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-5">
          <BrandLogo />
          <nav className="mt-8 grid gap-2">
            {menu.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={`#teacher-${index}`}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100",
                    index === 0 && "bg-lime-50 text-lime-700"
                  )}
                >
                  <Icon size={20} />
                  {item.name}
                </a>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="green">英语第一阶段 · 可体验MVP</Badge>
              <h1 className="mt-3 text-3xl font-black text-slate-950">教师教学后台</h1>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                上传/粘贴资料 → AI mock 解析 → 老师审核 → 发布给学生。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <Link href="/login/teacher">退出</Link>
              </Button>
              <Button onClick={publishTask}>
                <Save size={18} /> 发布任务
              </Button>
            </div>
          </header>

          {status ? <div className="mb-5 rounded-3xl bg-yellow-100 p-4 text-sm font-black text-yellow-800">{status}</div> : null}

          <div className="grid gap-5 xl:grid-cols-[1.35fr_.75fr]">
            <div className="grid gap-5">
              <Metrics activeTask={activeTask} />
              <UploadCreator
                knowledgeFile={knowledgeFile}
                questionFile={questionFile}
                knowledgeText={knowledgeText}
                questionText={questionText}
                setKnowledgeText={setKnowledgeText}
                setQuestionText={setQuestionText}
                handleFile={handleFile}
                runAiParse={runAiParse}
              />
              <ReviewPanel draftTask={draftTask} updateQuestionTitle={updateQuestionTitle} deleteQuestion={deleteQuestion} addQuestion={addQuestion} />
            </div>
            <aside className="grid content-start gap-5">
              <StudentPanel />
              <TaskPublishPanel activeTask={activeTask} publishTask={publishTask} />
              <ShopAndOrders />
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metrics({ activeTask }: { activeTask?: LearningTask }) {
  const items = [
    ["当前任务", activeTask?.title || "暂无"],
    ["任务状态", activeTask?.status === "published" ? "已发布" : "待发布"],
    ["题目数量", activeTask?.questions.length || 0],
    ["AI审核项", activeTask ? Object.values(activeTask.extracted).flat().length : 0]
  ];
  return (
    <div id="teacher-0" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <Card key={label} className="hover:translate-y-0">
          <CardContent className="p-5">
            <p className="text-sm font-black text-slate-500">{label}</p>
            <div className="mt-3 text-2xl font-black text-slate-950">{value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function UploadCreator({
  knowledgeFile,
  questionFile,
  knowledgeText,
  questionText,
  setKnowledgeText,
  setQuestionText,
  handleFile,
  runAiParse
}: {
  knowledgeFile: File | null;
  questionFile: File | null;
  knowledgeText: string;
  questionText: string;
  setKnowledgeText: (value: string) => void;
  setQuestionText: (value: string) => void;
  handleFile: (type: "knowledge" | "questions", event: ChangeEvent<HTMLInputElement>) => void;
  runAiParse: () => void;
}) {
  return (
    <Card id="teacher-2" className="hover:translate-y-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UploadCloud className="text-brand-green" /> 资料上传 / 任务创建
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 xl:grid-cols-2">
        <UploadBox title="知识点文件" detail="单词、短语、句型、语法" file={knowledgeFile} onChange={(event) => handleFile("knowledge", event)} />
        <UploadBox title="题目文件" detail="练习题、阅读题、试题" file={questionFile} onChange={(event) => handleFile("questions", event)} />
        <TextArea title="手动粘贴知识点内容" value={knowledgeText} onChange={setKnowledgeText} />
        <TextArea title="手动粘贴题目内容" value={questionText} onChange={setQuestionText} />
        <div className="xl:col-span-2">
          <Button onClick={runAiParse} size="lg" variant="yellow" className="w-full">
            <WandSparkles size={20} /> AI解析
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UploadBox({ title, detail, file, onChange }: { title: string; detail: string; file: File | null; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="block rounded-[28px] border-2 border-dashed border-lime-200 bg-lime-50/80 p-5">
      <FileText className="text-brand-green" size={30} />
      <h3 className="mt-3 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-sm font-bold text-slate-500">{detail}</p>
      <input type="file" accept=".pdf,.docx,.txt,.md" className="mt-4 block w-full text-sm font-bold" onChange={onChange} />
      <p className="mt-3 rounded-2xl bg-white p-3 text-sm font-black text-slate-600">
        {file ? `${file.name} · 已上传，等待解析` : "支持 PDF / DOCX / TXT / MD，单个不超过50MB"}
      </p>
    </label>
  );
}

function TextArea({ title, value, onChange }: { title: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-black text-slate-700">{title}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-36 w-full rounded-[24px] border-2 border-slate-200 bg-white p-4 text-sm font-bold leading-7 outline-none focus:border-brand-green"
        placeholder="解析失败或暂不支持 PDF/DOCX 时，可在这里手动粘贴内容。"
      />
    </label>
  );
}

function ReviewPanel({
  draftTask,
  updateQuestionTitle,
  deleteQuestion,
  addQuestion
}: {
  draftTask: LearningTask | null;
  updateQuestionTitle: (questionId: string, value: string) => void;
  deleteQuestion: (questionId: string) => void;
  addQuestion: () => void;
}) {
  return (
    <Card id="teacher-3" className="hover:translate-y-0">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <WandSparkles className="text-brand-purple" /> 老师审核
          </CardTitle>
          <p className="text-sm font-semibold text-slate-500">AI mock 解析结果必须经过老师审核后发布。</p>
        </div>
        <Button onClick={addQuestion} variant="outline">
          <Plus size={18} /> 新增内容
        </Button>
      </CardHeader>
      <CardContent className="grid gap-5">
        {!draftTask ? (
          <div className="rounded-[28px] bg-slate-50 p-6 text-sm font-bold text-slate-500">请先上传或粘贴资料，然后点击 AI解析。</div>
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(draftTask.extracted).map(([key, items]) => (
                <div key={key} className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <div className="text-sm font-black text-slate-500">{extractLabel(key)}</div>
                  <div className="mt-2 text-2xl font-black text-slate-950">{items.length}</div>
                  <p className="mt-2 line-clamp-2 text-xs font-bold text-slate-500">{items.join(" / ")}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3">
              {draftTask.questions.map((question) => (
                <div key={question.id} className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1fr_auto] lg:items-center">
                  <input
                    value={question.prompt}
                    onChange={(event) => updateQuestionTitle(question.id, event.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-brand-green"
                  />
                  <div className="flex gap-2">
                    <Badge variant="yellow">{question.stage}</Badge>
                    <Button onClick={() => deleteQuestion(question.id)} variant="outline" size="sm">
                      <Trash2 size={16} /> 删除
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function StudentPanel() {
  return (
    <Card id="teacher-1" className="hover:translate-y-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="text-brand-blue" /> 学生管理
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {teacherStudents.map((student) => (
          <div key={student.account} className="rounded-[24px] bg-slate-50 p-4">
            <div className="font-black text-slate-950">{student.name}</div>
            <div className="mt-1 text-xs font-bold text-slate-500">{student.className} · {student.group}</div>
            <div className="mt-3 flex justify-between text-xs font-black text-slate-500">
              <span>{student.stuck}</span>
              <span>{student.progress}%</span>
            </div>
            <Progress value={student.progress} className="mt-2 h-3" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TaskPublishPanel({ activeTask, publishTask }: { activeTask?: LearningTask; publishTask: () => void }) {
  return (
    <Card id="teacher-4" className="hover:translate-y-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="text-brand-blue" /> 任务发布
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-bold leading-7 text-slate-600">
          当前发布任务：{activeTask?.title || "暂无"}。支持后续扩展到单个学生、小组、班级。
        </p>
        <Button onClick={publishTask} className="mt-4 w-full">
          <Check size={18} /> 发布任务
        </Button>
      </CardContent>
    </Card>
  );
}

function ShopAndOrders() {
  return (
    <Card className="hover:translate-y-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackageCheck className="text-brand-orange" /> 商城与订单
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {shopItems.slice(0, 2).map((item) => (
          <div key={item.name} className="rounded-[24px] bg-slate-50 p-4 text-sm font-black text-slate-700">
            {item.name} · {item.price}金币
          </div>
        ))}
        {orders.slice(0, 2).map((order) => (
          <div key={`${order.student}-${order.item}`} className="rounded-[24px] bg-white p-4 text-sm font-black text-slate-700 shadow-sm">
            {order.student} · {order.item} · {order.status}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function extractLabel(key: string) {
  const map: Record<string, string> = {
    vocabulary: "单词列表",
    phrases: "短语列表",
    sentences: "句型",
    grammar: "语法点",
    readings: "阅读题",
    examQuestions: "原题训练"
  };
  return map[key] || key;
}
