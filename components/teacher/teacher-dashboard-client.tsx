"use client";

import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Check,
  ClipboardList,
  Coins,
  FileText,
  GraduationCap,
  ImagePlus,
  Lock,
  PackagePlus,
  Plus,
  Save,
  Trash2,
  UploadCloud,
  Users,
  WandSparkles,
  X
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  createId,
  createTaskFromDeepSeekResult,
  ensureRewardWallet,
  getInitialPlatformState,
  getRewardWallet,
  getStageProgress,
  LearningQuestion,
  LearningTask,
  loadPlatformState,
  PlatformState,
  recordCoinChange,
  savePlatformState,
  ShopItem,
  shopCategories,
  stages,
  Student,
  StudentGroup,
  StudentSystem,
  studentSystems,
  TaskAssignment
} from "@/lib/learning-store";
import type { DeepSeekParseResult } from "@/lib/ai/deepseek";
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

const blankStudent: Student = {
  id: "",
  name: "",
  account: "",
  password: "",
  grade: "",
  system: "同步"
};

const blankItem: ShopItem = {
  id: "",
  name: "",
  price: 100,
  stock: 10,
  category: "零食",
  active: true
};

export function TeacherDashboardClient() {
  const [state, setState] = useState<PlatformState>(getInitialPlatformState());
  const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null);
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [knowledgeText, setKnowledgeText] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [draftTask, setDraftTask] = useState<LearningTask | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [assignMode, setAssignMode] = useState<"students" | "customGroup" | "system" | "all">("students");
  const [assignGroupId, setAssignGroupId] = useState("");
  const [assignSystem, setAssignSystem] = useState<StudentSystem>("同步");
  const [studentForm, setStudentForm] = useState<Student>(blankStudent);
  const [groupName, setGroupName] = useState("");
  const [groupMemberIds, setGroupMemberIds] = useState<string[]>([]);
  const [editingGroupId, setEditingGroupId] = useState("");
  const [itemForm, setItemForm] = useState<ShopItem>(blankItem);
  const [coinStudentId, setCoinStudentId] = useState("");
  const [coinType, setCoinType] = useState<"增加" | "扣减">("增加");
  const [coinAmount, setCoinAmount] = useState(100);
  const [coinReason, setCoinReason] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    setState(loadPlatformState());
  }, []);

  const reviewTasks = state.tasks.filter((task) => task.status === "review");
  const publishedTasks = state.tasks.filter((task) => task.status === "published");
  const activeTask = draftTask || reviewTasks[0] || publishedTasks[0];

  function commit(next: PlatformState, message?: string) {
    setState(next);
    savePlatformState(next);
    if (message) setStatus(message);
  }

  async function handleFile(type: "knowledge" | "questions", event: ChangeEvent<HTMLInputElement>) {
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
    if (ext === "txt" || ext === "md") {
      const text = await file.text();
      if (type === "knowledge") setKnowledgeText(text);
      if (type === "questions") setQuestionText(text);
      setStatus(`${file.name} 已读取真实文本内容，可以点击 AI解析。`);
      return;
    }
    setStatus("PDF/DOCX 暂未接入真实解析，请将内容粘贴到文本框后解析。");
  }

  async function runAiParse() {
    if (!knowledgeText.trim() && !questionText.trim()) {
      setStatus("请先上传 TXT/MD，或手动粘贴内容后再解析。");
      return;
    }
    setStatus("正在调用 DeepSeek API 解析资料，请稍候。");
    try {
      const response = await fetch("/api/ai/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          knowledgeText,
          questionText,
          mode: "generate_from_material"
        })
      });
      const payload = await response.json() as { result?: DeepSeekParseResult; error?: string; provider?: string };
      if (!response.ok || !payload.result) {
        throw new Error(payload.error || "DeepSeek 解析失败，未返回结构化结果");
      }
      const task = createTaskFromDeepSeekResult({
        result: payload.result,
        knowledgeText,
        questionText,
        knowledgeFile: knowledgeFile?.name,
        questionFile: questionFile?.name
      });
      setDraftTask(task);
      commit({ ...state, tasks: [task, ...state.tasks.filter((item) => item.id !== task.id)] }, "DeepSeek 解析成功，结构化结果已进入老师审核区。");
    } catch (error) {
      const message = error instanceof Error ? error.message : "AI解析失败";
      setStatus(`AI解析失败：${message}`);
    }
  }

  function saveDraftTask(task = draftTask) {
    if (!task) return;
    const saved = { ...task, reviewed: true };
    setDraftTask(saved);
    commit({ ...state, tasks: state.tasks.map((item) => item.id === saved.id ? saved : item) }, "审核内容已保存，可以发布任务。");
  }

  function updateDraftQuestion(questionId: string, patch: Partial<LearningQuestion>) {
    if (!draftTask) return;
    setDraftTask({
      ...draftTask,
      reviewed: false,
      questions: draftTask.questions.map((question) => question.id === questionId ? { ...question, ...patch } : question)
    });
  }

  function addQuestion() {
    if (!draftTask) {
      setStatus("请先解析一份任务。");
      return;
    }
    const question: LearningQuestion = {
      id: createId("question"),
      stage: "exam",
      title: "新增原题",
      prompt: "请老师填写题干",
      promptHint: "选择正确答案",
      mode: "choice",
      answer: "待老师补充答案",
      needsAnswer: true,
      options: ["待老师补充答案", "选项B", "选项C", "选项D"],
      guidance: [{ prompt: "这题先看什么？", answer: "先看题干关键词", options: ["先看题干关键词", "直接看答案", "随机选择", "跳过题目"] }],
      summary: {
        breakthrough: "先看题干关键词。",
        method: "用排除法判断。",
        warning: "发布前请补充答案。",
        knowledge: "老师新增题"
      }
    };
    setDraftTask({ ...draftTask, reviewed: false, questions: [...draftTask.questions, question] });
  }

  function deleteQuestion(questionId: string) {
    if (!draftTask) return;
    setDraftTask({ ...draftTask, reviewed: false, questions: draftTask.questions.filter((question) => question.id !== questionId) });
  }

  function saveStudent() {
    if (!studentForm.name || !studentForm.account || !studentForm.password) {
      setStatus("学生姓名、账号、密码不能为空。");
      return;
    }
    const isEditing = Boolean(studentForm.id);
    const student = { ...studentForm, id: studentForm.id || createId("student") };
    const next: PlatformState = {
      ...state,
      students: isEditing ? state.students.map((item) => item.id === student.id ? student : item) : [student, ...state.students]
    };
    ensureRewardWallet(next, student.id);
    setStudentForm(blankStudent);
    commit(next, isEditing ? "学生档案已更新。" : "学生账号已创建。");
  }

  function deleteStudent(studentId: string) {
    const next: PlatformState = {
      ...state,
      students: state.students.filter((student) => student.id !== studentId),
      rewards: state.rewards.filter((reward) => reward.studentId !== studentId),
      studentProgress: state.studentProgress.filter((progress) => progress.studentId !== studentId),
      studentGroups: state.studentGroups.map((group) => ({ ...group, studentIds: group.studentIds.filter((id) => id !== studentId) })),
      taskAssignments: state.taskAssignments.map((assignment) => ({ ...assignment, studentIds: assignment.studentIds.filter((id) => id !== studentId) })),
      redemptionOrders: state.redemptionOrders.filter((order) => order.studentId !== studentId)
    };
    commit(next, "学生已删除。");
  }

  function saveGroup() {
    if (!groupName.trim()) {
      setStatus("请填写小组名称。");
      return;
    }
    const group: StudentGroup = { id: editingGroupId || createId("group"), name: groupName.trim(), studentIds: groupMemberIds };
    const next: PlatformState = {
      ...state,
      studentGroups: editingGroupId ? state.studentGroups.map((item) => item.id === editingGroupId ? group : item) : [group, ...state.studentGroups]
    };
    setGroupName("");
    setGroupMemberIds([]);
    setEditingGroupId("");
    commit(next, editingGroupId ? "小组已更新。" : "小组已创建。");
  }

  function editGroup(group: StudentGroup) {
    setEditingGroupId(group.id);
    setGroupName(group.name);
    setGroupMemberIds(group.studentIds);
  }

  function deleteGroup(groupId: string) {
    commit({
      ...state,
      studentGroups: state.studentGroups.filter((group) => group.id !== groupId),
      taskAssignments: state.taskAssignments.filter((assignment) => assignment.groupId !== groupId)
    }, "小组已删除。");
  }

  function publishTask() {
    const task = draftTask || activeTask;
    if (!task) {
      setStatus("请先解析并审核任务。");
      return;
    }
    const savedTask = state.tasks.find((item) => item.id === task.id) || task;
    if (!savedTask.reviewed) {
      setStatus("请先在 AI解析审核区点击“保存审核”，再发布任务。");
      return;
    }
    let assignment: TaskAssignment | null = null;
    if (assignMode === "students") {
      if (!selectedStudentIds.length) {
        setStatus("请选择至少一名学生。");
        return;
      }
      assignment = { id: createId("assign"), taskId: task.id, type: "students", studentIds: selectedStudentIds, createdAt: new Date().toISOString() };
    }
    if (assignMode === "customGroup") {
      if (!assignGroupId) {
        setStatus("请选择一个自定义小组。");
        return;
      }
      assignment = { id: createId("assign"), taskId: task.id, type: "customGroup", studentIds: [], groupId: assignGroupId, createdAt: new Date().toISOString() };
    }
    if (assignMode === "system") {
      assignment = { id: createId("assign"), taskId: task.id, type: "system", studentIds: [], system: assignSystem, createdAt: new Date().toISOString() };
    }
    if (assignMode === "all") {
      assignment = { id: createId("assign"), taskId: task.id, type: "all", studentIds: [], createdAt: new Date().toISOString() };
    }
    if (!assignment) return;
    const published: LearningTask = { ...savedTask, status: "published" };
    setDraftTask(null);
    commit({
      ...state,
      tasks: [published, ...state.tasks.filter((item) => item.id !== published.id)],
      taskAssignments: [assignment, ...state.taskAssignments]
    }, "任务已发布，学生登录后只能看到分配给自己的任务。");
  }

  async function handleItemImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const imageDataUrl = await fileToDataUrl(file);
    setItemForm((item) => ({ ...item, imageDataUrl }));
  }

  function saveItem() {
    if (!itemForm.name) {
      setStatus("商品名称不能为空。");
      return;
    }
    const isEditing = Boolean(itemForm.id);
    const item = { ...itemForm, id: itemForm.id || createId("shop") };
    const next: PlatformState = {
      ...state,
      shopItems: isEditing ? state.shopItems.map((existing) => existing.id === item.id ? item : existing) : [item, ...state.shopItems]
    };
    setItemForm(blankItem);
    commit(next, isEditing ? "商品已更新。" : "商品已上架到商城。");
  }

  function deleteItem(itemId: string) {
    commit({ ...state, shopItems: state.shopItems.filter((item) => item.id !== itemId) }, "商品已删除。");
  }

  function confirmOrder(orderId: string) {
    const next = structuredClone(state) as PlatformState;
    const order = next.redemptionOrders.find((item) => item.id === orderId);
    if (!order) return;
    const item = next.shopItems.find((shopItem) => shopItem.id === order.itemId);
    const wallet = ensureRewardWallet(next, order.studentId);
    if (!item || item.stock <= 0) {
      setStatus("库存不足，无法确认。");
      return;
    }
    if (wallet.coins < order.price) {
      order.status = "余额不足";
      commit(next, "学员金币余额不足，不能确认订单。");
      return;
    }
    item.stock -= 1;
    recordCoinChange(next, order.studentId, "商品兑换扣除", -order.price, `兑换${order.itemName}`);
    next.redemptionOrders = next.redemptionOrders.filter((itemOrder) => itemOrder.id !== order.id);
    next.redemptionHistory.unshift({ ...order, result: "已确认", handledAt: new Date().toISOString() });
    commit(next, "订单已确认，已扣除学生金币并减少库存。");
  }

  function rejectOrder(orderId: string) {
    const next = structuredClone(state) as PlatformState;
    const order = next.redemptionOrders.find((item) => item.id === orderId);
    if (!order) return;
    next.redemptionOrders = next.redemptionOrders.filter((itemOrder) => itemOrder.id !== order.id);
    next.redemptionHistory.unshift({ ...order, result: "已拒绝", handledAt: new Date().toISOString() });
    commit(next, "订单已拒绝，未扣除金币。");
  }

  function adjustCoins() {
    if (!coinStudentId || coinAmount <= 0) {
      setStatus("请选择学员并填写金币数量。");
      return;
    }
    const next = structuredClone(state) as PlatformState;
    recordCoinChange(
      next,
      coinStudentId,
      coinType === "增加" ? "老师手动增加" : "老师手动扣减",
      coinType === "增加" ? coinAmount : -coinAmount,
      coinReason || "老师手动调整"
    );
    setCoinReason("");
    commit(next, "金币已调整并记录流水。");
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
                <a key={item.name} href={`#teacher-${index}`} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black text-slate-600 transition hover:bg-slate-100", index === 0 && "bg-lime-50 text-lime-700")}>
                  <Icon size={20} /> {item.name}
                </a>
              );
            })}
          </nav>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="green">英语第一阶段 · localStorage 可试用MVP</Badge>
              <h1 className="mt-3 text-3xl font-black text-slate-950">教师教学后台</h1>
              <p className="mt-2 text-sm font-semibold text-slate-500">学生档案 → 资料解析 → 审核保存 → 指定发布 → 商品与金币订单。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline"><Link href="/login/teacher">退出</Link></Button>
              <Button onClick={publishTask}><Save size={18} /> 发布任务</Button>
            </div>
          </header>

          {status ? <div className="mb-5 rounded-3xl bg-yellow-100 p-4 text-sm font-black text-yellow-800">{status}</div> : null}

          <div className="grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
            <div className="grid gap-5">
              <Metrics state={state} />
              <StudentPanel students={state.students} form={studentForm} setForm={setStudentForm} saveStudent={saveStudent} deleteStudent={deleteStudent} />
              <UploadCreator knowledgeFile={knowledgeFile} questionFile={questionFile} knowledgeText={knowledgeText} questionText={questionText} setKnowledgeText={setKnowledgeText} setQuestionText={setQuestionText} handleFile={handleFile} runAiParse={runAiParse} />
              <ReviewPanel draftTask={draftTask} setDraftTask={setDraftTask} updateDraftQuestion={updateDraftQuestion} deleteQuestion={deleteQuestion} addQuestion={addQuestion} saveDraftTask={saveDraftTask} />
              <ShopManager items={state.shopItems} form={itemForm} setForm={setItemForm} saveItem={saveItem} deleteItem={deleteItem} handleImage={handleItemImage} />
            </div>
            <aside className="grid content-start gap-5">
              <TaskPublishPanel task={activeTask} students={state.students} groups={state.studentGroups} selectedStudentIds={selectedStudentIds} setSelectedStudentIds={setSelectedStudentIds} assignMode={assignMode} setAssignMode={setAssignMode} assignGroupId={assignGroupId} setAssignGroupId={setAssignGroupId} assignSystem={assignSystem} setAssignSystem={setAssignSystem} groupName={groupName} setGroupName={setGroupName} groupMemberIds={groupMemberIds} setGroupMemberIds={setGroupMemberIds} editingGroupId={editingGroupId} saveGroup={saveGroup} editGroup={editGroup} deleteGroup={deleteGroup} publishTask={publishTask} />
              <LearningDataPanel state={state} />
              <OrderPanel state={state} confirmOrder={confirmOrder} rejectOrder={rejectOrder} coinStudentId={coinStudentId} setCoinStudentId={setCoinStudentId} coinType={coinType} setCoinType={setCoinType} coinAmount={coinAmount} setCoinAmount={setCoinAmount} coinReason={coinReason} setCoinReason={setCoinReason} adjustCoins={adjustCoins} />
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metrics({ state }: { state: PlatformState }) {
  const items = [
    ["学生", state.students.length],
    ["已发布任务", state.tasks.filter((task) => task.status === "published").length],
    ["商城商品", state.shopItems.length],
    ["待确认订单", state.redemptionOrders.filter((order) => order.status === "待确认" || order.status === "余额不足").length]
  ];
  return (
    <div id="teacher-0" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(([label, value]) => (
        <Card key={label} className="hover:translate-y-0"><CardContent className="p-5"><p className="text-sm font-black text-slate-500">{label}</p><div className="mt-3 text-2xl font-black text-slate-950">{value}</div></CardContent></Card>
      ))}
    </div>
  );
}

function StudentPanel({ students, form, setForm, saveStudent, deleteStudent }: { students: Student[]; form: Student; setForm: (student: Student) => void; saveStudent: () => void; deleteStudent: (studentId: string) => void }) {
  return (
    <Card id="teacher-1" className="hover:translate-y-0">
      <CardHeader><CardTitle className="flex items-center gap-2"><Users className="text-brand-blue" /> 学生管理</CardTitle></CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 md:grid-cols-3">
          <Input label="姓名" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Input label="账号" value={form.account} onChange={(value) => setForm({ ...form, account: value })} />
          <Input label="密码/重置密码" value={form.password} onChange={(value) => setForm({ ...form, password: value })} />
          <Input label="年级" value={form.grade} onChange={(value) => setForm({ ...form, grade: value })} />
          <Select value={form.system} onChange={(value) => setForm({ ...form, system: value as StudentSystem })} options={studentSystems} placeholder="选择体系" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={saveStudent}><Plus size={18} /> {form.id ? "保存学生" : "新增学生"}</Button>
          {form.id ? <Button variant="outline" onClick={() => setForm(blankStudent)}>取消编辑</Button> : null}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {students.map((student) => (
            <div key={student.id} className="rounded-[24px] bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black text-slate-950">{student.name}</div>
                  <div className="mt-1 text-xs font-bold text-slate-500">{student.grade} · {student.system}</div>
                  <div className="mt-2 text-xs font-black text-slate-500">账号：{student.account} / 密码：{student.password}</div>
                </div>
                <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setForm(student)}>编辑</Button><Button size="sm" variant="outline" onClick={() => deleteStudent(student.id)}><Trash2 size={16} /></Button></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function UploadCreator({ knowledgeFile, questionFile, knowledgeText, questionText, setKnowledgeText, setQuestionText, handleFile, runAiParse }: { knowledgeFile: File | null; questionFile: File | null; knowledgeText: string; questionText: string; setKnowledgeText: (value: string) => void; setQuestionText: (value: string) => void; handleFile: (type: "knowledge" | "questions", event: ChangeEvent<HTMLInputElement>) => void; runAiParse: () => void }) {
  return (
    <Card id="teacher-2" className="hover:translate-y-0">
      <CardHeader><CardTitle className="flex items-center gap-2"><UploadCloud className="text-brand-green" /> 资料上传 / 任务创建</CardTitle></CardHeader>
      <CardContent className="grid gap-5 xl:grid-cols-2">
        <UploadBox title="知识点文件" detail="TXT/MD 真实读取；PDF/DOCX 需粘贴" file={knowledgeFile} onChange={(event) => handleFile("knowledge", event)} />
        <UploadBox title="题目文件" detail="支持识别 A/B/C/D 选择题" file={questionFile} onChange={(event) => handleFile("questions", event)} />
        <TextArea title="手动粘贴知识点内容" value={knowledgeText} onChange={setKnowledgeText} />
        <TextArea title="手动粘贴题目内容" value={questionText} onChange={setQuestionText} />
        <div className="xl:col-span-2"><Button onClick={runAiParse} size="lg" variant="yellow" className="w-full"><WandSparkles size={20} /> AI解析</Button></div>
      </CardContent>
    </Card>
  );
}

function ReviewPanel({ draftTask, setDraftTask, updateDraftQuestion, deleteQuestion, addQuestion, saveDraftTask }: { draftTask: LearningTask | null; setDraftTask: (task: LearningTask) => void; updateDraftQuestion: (questionId: string, patch: Partial<LearningQuestion>) => void; deleteQuestion: (questionId: string) => void; addQuestion: () => void; saveDraftTask: () => void }) {
  return (
    <Card id="teacher-3" className="hover:translate-y-0">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div><CardTitle className="flex items-center gap-2"><WandSparkles className="text-brand-purple" /> AI解析审核</CardTitle><p className="text-sm font-semibold text-slate-500">保存审核后才允许发布。识别不到答案会标记“待老师补充答案”。</p></div>
        <div className="flex gap-2"><Button onClick={addQuestion} variant="outline"><Plus size={18} /> 新增内容</Button><Button onClick={() => saveDraftTask()}><Save size={18} /> 保存审核</Button></div>
      </CardHeader>
      <CardContent className="grid gap-5">
        {!draftTask ? <div className="rounded-[28px] bg-slate-50 p-6 text-sm font-bold text-slate-500">请先上传或粘贴资料，然后点击 AI解析。</div> : (
          <>
            <Input label="任务名称" value={draftTask.title} onChange={(value) => setDraftTask({ ...draftTask, reviewed: false, title: value })} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(draftTask.extracted).map(([key, items]) => <div key={key} className="rounded-[24px] border border-slate-200 bg-white p-4"><div className="text-sm font-black text-slate-500">{extractLabel(key)}</div><div className="mt-2 text-2xl font-black text-slate-950">{items.length}</div><p className="mt-2 line-clamp-2 text-xs font-bold text-slate-500">{items.join(" / ") || "暂无识别内容"}</p></div>)}
            </div>
            <div className="grid gap-3">
              {draftTask.questions.map((question) => (
                <div key={question.id} className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center gap-2"><Badge variant="blue">{stageName(question.stage)}</Badge>{question.needsAnswer ? <Badge variant="yellow">待老师补充答案</Badge> : <Badge variant="green">可发布</Badge>}</div>
                  <div className="grid gap-3 md:grid-cols-2"><Input label="题干" value={question.prompt} onChange={(value) => updateDraftQuestion(question.id, { prompt: value })} /><Input label="答案" value={question.answer} onChange={(value) => updateDraftQuestion(question.id, { answer: value, needsAnswer: value.includes("待老师补充") })} /></div>
                  <Input label="选项（用 / 分隔）" value={(question.options || []).join(" / ")} onChange={(value) => updateDraftQuestion(question.id, { options: value.split("/").map((item) => item.trim()).filter(Boolean) })} />
                  <div className="flex justify-end"><Button onClick={() => deleteQuestion(question.id)} variant="outline" size="sm"><Trash2 size={16} /> 删除</Button></div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function TaskPublishPanel({ task, students, groups, selectedStudentIds, setSelectedStudentIds, assignMode, setAssignMode, assignGroupId, setAssignGroupId, assignSystem, setAssignSystem, groupName, setGroupName, groupMemberIds, setGroupMemberIds, editingGroupId, saveGroup, editGroup, deleteGroup, publishTask }: { task?: LearningTask; students: Student[]; groups: StudentGroup[]; selectedStudentIds: string[]; setSelectedStudentIds: (ids: string[]) => void; assignMode: "students" | "customGroup" | "system" | "all"; setAssignMode: (mode: "students" | "customGroup" | "system" | "all") => void; assignGroupId: string; setAssignGroupId: (value: string) => void; assignSystem: StudentSystem; setAssignSystem: (value: StudentSystem) => void; groupName: string; setGroupName: (value: string) => void; groupMemberIds: string[]; setGroupMemberIds: (ids: string[]) => void; editingGroupId: string; saveGroup: () => void; editGroup: (group: StudentGroup) => void; deleteGroup: (groupId: string) => void; publishTask: () => void }) {
  return (
    <Card id="teacher-4" className="hover:translate-y-0">
      <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="text-brand-blue" /> 任务发布 / 小组管理</CardTitle></CardHeader>
      <CardContent className="grid gap-4">
        <p className="text-sm font-bold leading-7 text-slate-600">当前任务：{task?.title || "暂无任务"}。{task?.reviewed ? "已保存审核，可以发布。" : "请先保存审核。"}</p>
        <div className="rounded-[24px] bg-slate-50 p-4">
          <div className="text-sm font-black text-slate-700">{editingGroupId ? "编辑小组" : "新建小组"}</div>
          <Input label="小组名称" value={groupName} onChange={setGroupName} />
          <div className="mt-3 grid gap-2">
            {students.map((student) => <CheckLine key={student.id} checked={groupMemberIds.includes(student.id)} onChange={(checked) => setGroupMemberIds(checked ? [...groupMemberIds, student.id] : groupMemberIds.filter((id) => id !== student.id))} label={`${student.name} · ${student.system}`} />)}
          </div>
          <Button onClick={saveGroup} size="sm" className="mt-3"><Plus size={16} /> {editingGroupId ? "保存小组" : "创建小组"}</Button>
        </div>
        {groups.map((group) => <div key={group.id} className="rounded-2xl bg-white p-3 text-sm font-black text-slate-700 shadow-sm"><div className="flex items-center justify-between gap-2"><span>{group.name} · {group.studentIds.length}人</span><span className="flex gap-2"><Button size="sm" variant="outline" onClick={() => editGroup(group)}>编辑</Button><Button size="sm" variant="outline" onClick={() => deleteGroup(group.id)}>删除</Button></span></div></div>)}
        <div className="grid grid-cols-2 gap-2">
          {(["students", "customGroup", "system", "all"] as const).map((mode) => <button key={mode} onClick={() => setAssignMode(mode)} className={cn("rounded-full border px-3 py-2 text-xs font-black", assignMode === mode ? "border-brand-green bg-lime-50 text-lime-700" : "border-slate-200 bg-white text-slate-500")}>{mode === "students" ? "单个/多个学生" : mode === "customGroup" ? "自定义小组" : mode === "system" ? "某个体系" : "全部学生"}</button>)}
        </div>
        {assignMode === "students" ? <div className="grid gap-2">{students.map((student) => <CheckLine key={student.id} checked={selectedStudentIds.includes(student.id)} onChange={(checked) => setSelectedStudentIds(checked ? [...selectedStudentIds, student.id] : selectedStudentIds.filter((id) => id !== student.id))} label={`${student.name} · ${student.system}`} />)}</div> : null}
        {assignMode === "customGroup" ? <Select value={assignGroupId} onChange={setAssignGroupId} options={groups.map((group) => group.id)} labels={Object.fromEntries(groups.map((group) => [group.id, group.name]))} placeholder="选择自定义小组" /> : null}
        {assignMode === "system" ? <Select value={assignSystem} onChange={(value) => setAssignSystem(value as StudentSystem)} options={studentSystems} placeholder="选择体系" /> : null}
        <Button onClick={publishTask} className="w-full"><Check size={18} /> 发布任务</Button>
      </CardContent>
    </Card>
  );
}

function LearningDataPanel({ state }: { state: PlatformState }) {
  return (
    <Card id="teacher-5" className="hover:translate-y-0">
      <CardHeader><CardTitle>学习数据</CardTitle></CardHeader>
      <CardContent className="grid gap-3">
        {state.students.map((student) => {
          const progresses = state.studentProgress.filter((progress) => progress.studentId === student.id);
          const latest = progresses[0];
          const task = latest ? state.tasks.find((item) => item.id === latest.taskId) : undefined;
          const totalQuestions = task?.questions.length || 0;
          const complete = latest?.completedQuestionIds.length || 0;
          const wrong = latest?.wrongQuestionIds.length || 0;
          const totalPercent = totalQuestions ? Math.round((complete / totalQuestions) * 100) : 0;
          const attempts = complete + wrong;
          const accuracy = attempts ? Math.round((complete / attempts) * 100) : 0;
          return (
            <div key={student.id} className="rounded-[24px] bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3"><div className="font-black text-slate-950">{student.name}</div><div className="text-2xl font-black text-brand-green">{totalPercent}%</div></div>
              <p className="mt-1 text-xs font-bold text-slate-500">当前任务：{task?.title || "暂无"} · 正确率 {accuracy}% · 错题 {wrong} 道</p>
              <Progress value={totalPercent} className="mt-3 h-4" />
              {task && latest ? <div className="mt-3 grid gap-2">{stages.map((stage) => <div key={stage.id} className="flex items-center gap-2 text-xs font-black text-slate-500"><span className="w-20">{stage.short}</span><Progress value={getStageProgress(stage.id, task, latest)} className="h-2 flex-1" /><span>{getStageProgress(stage.id, task, latest)}%</span></div>)}</div> : null}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ShopManager({ items, form, setForm, saveItem, deleteItem, handleImage }: { items: ShopItem[]; form: ShopItem; setForm: (item: ShopItem) => void; saveItem: () => void; deleteItem: (itemId: string) => void; handleImage: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <Card id="teacher-6" className="hover:translate-y-0">
      <CardHeader><CardTitle className="flex items-center gap-2"><PackagePlus className="text-brand-orange" /> 商城管理</CardTitle></CardHeader>
      <CardContent className="grid gap-5">
        <div className="grid gap-3 md:grid-cols-3">
          <Input label="商品名称" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Input label="金币价格" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: Number(value) })} />
          <Input label="库存" type="number" value={form.stock} onChange={(value) => setForm({ ...form, stock: Number(value) })} />
          <Select value={form.category} onChange={(value) => setForm({ ...form, category: value })} options={shopCategories} placeholder="商品分类" />
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> 上架</label>
          <label className="flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700"><ImagePlus size={18} /> 上传商品图<input type="file" accept="image/*" className="hidden" onChange={handleImage} /></label>
        </div>
        {form.imageDataUrl ? <img src={form.imageDataUrl} alt="商品预览" className="h-28 w-28 rounded-3xl object-cover" /> : null}
        <div className="flex gap-2"><Button onClick={saveItem}><Plus size={18} /> {form.id ? "保存商品" : "新增商品"}</Button>{form.id ? <Button variant="outline" onClick={() => setForm(blankItem)}>取消编辑</Button> : null}</div>
        <div className="grid gap-3 md:grid-cols-2">
          {items.map((item) => <div key={item.id} className="flex gap-4 rounded-[24px] bg-slate-50 p-4"><div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-3xl bg-orange-100 text-brand-orange">{item.imageDataUrl ? <img src={item.imageDataUrl} alt={item.name} className="h-full w-full object-cover" /> : <PackagePlus />}</div><div className="min-w-0 flex-1"><div className="font-black text-slate-950">{item.name}</div><div className="mt-1 text-xs font-bold text-slate-500">{item.category} · {item.price}金币 · 库存{item.stock}</div><Badge className="mt-2" variant={item.active ? "green" : "gray"}>{item.active ? "已上架" : "已下架"}</Badge></div><div className="flex flex-col gap-2"><Button size="sm" variant="outline" onClick={() => setForm(item)}>编辑</Button><Button size="sm" variant="outline" onClick={() => deleteItem(item.id)}><Trash2 size={16} /></Button></div></div>)}
        </div>
      </CardContent>
    </Card>
  );
}

function OrderPanel({ state, confirmOrder, rejectOrder, coinStudentId, setCoinStudentId, coinType, setCoinType, coinAmount, setCoinAmount, coinReason, setCoinReason, adjustCoins }: { state: PlatformState; confirmOrder: (orderId: string) => void; rejectOrder: (orderId: string) => void; coinStudentId: string; setCoinStudentId: (value: string) => void; coinType: "增加" | "扣减"; setCoinType: (value: "增加" | "扣减") => void; coinAmount: number; setCoinAmount: (value: number) => void; coinReason: string; setCoinReason: (value: string) => void; adjustCoins: () => void }) {
  const activeOrders = state.redemptionOrders.filter((order) => order.status === "待确认" || order.status === "余额不足");
  return (
    <Card id="teacher-7" className="hover:translate-y-0">
      <CardHeader><CardTitle className="flex items-center gap-2"><Coins className="text-brand-orange" /> 订单与金币管理</CardTitle></CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-[24px] bg-orange-50 p-4">
          <div className="text-sm font-black text-slate-700">金币调整</div>
          <div className="mt-3 grid gap-2">
            <Select value={coinStudentId} onChange={setCoinStudentId} options={state.students.map((student) => student.id)} labels={Object.fromEntries(state.students.map((student) => [student.id, `${student.name}（${student.account}）`]))} placeholder="选择学员" />
            <Select value={coinType} onChange={(value) => setCoinType(value as "增加" | "扣减")} options={["增加", "扣减"]} placeholder="调整类型" />
            <Input label="金币数量" type="number" value={coinAmount} onChange={(value) => setCoinAmount(Number(value))} />
            <Input label="调整原因" value={coinReason} onChange={setCoinReason} />
            <Button onClick={adjustCoins} size="sm">确认调整</Button>
          </div>
        </div>
        {activeOrders.length ? activeOrders.map((order) => {
          const student = state.students.find((item) => item.id === order.studentId);
          const wallet = getRewardWallet(state, order.studentId);
          const insufficient = wallet.coins < order.price;
          return (
            <div key={order.id} className="rounded-[24px] bg-slate-50 p-4">
              <div className="font-black text-slate-950">{student?.name || "未知学生"} · {order.itemName}</div>
              <div className="mt-1 grid gap-1 text-xs font-bold text-slate-500">
                <span>商品价格：{order.price}金币</span>
                <span>学员当前金币余额：{wallet.coins}</span>
                <span>订单状态：{insufficient ? "余额不足" : order.status}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2"><Button size="sm" disabled={insufficient} onClick={() => confirmOrder(order.id)}>确认</Button><Button size="sm" variant="outline" onClick={() => rejectOrder(order.id)}><X size={16} /> 拒绝</Button></div>
            </div>
          );
        }) : <div className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-500">暂无待确认订单。</div>}
        <div className="rounded-[24px] bg-white p-4 shadow-sm">
          <div className="text-sm font-black text-slate-700">最近金币记录</div>
          <div className="mt-3 grid gap-2">
            {state.coinTransactions.slice(0, 6).map((tx) => <div key={tx.id} className="rounded-2xl bg-slate-50 p-3 text-xs font-bold text-slate-600">{tx.studentName} · {tx.type} · {tx.amount > 0 ? "+" : ""}{tx.amount} · {tx.before} → {tx.after}<br />{tx.reason}</div>)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UploadBox({ title, detail, file, onChange }: { title: string; detail: string; file: File | null; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <label className="block rounded-[28px] border-2 border-dashed border-lime-200 bg-lime-50/80 p-5"><FileText className="text-brand-green" size={30} /><h3 className="mt-3 text-lg font-black text-slate-950">{title}</h3><p className="mt-1 text-sm font-bold text-slate-500">{detail}</p><input type="file" accept=".pdf,.docx,.txt,.md" className="mt-4 block w-full text-sm font-bold" onChange={onChange} /><p className="mt-3 rounded-2xl bg-white p-3 text-sm font-black text-slate-600">{file ? `${file.name} · 已上传，等待解析` : "支持 PDF / DOCX / TXT / MD，单个不超过50MB"}</p></label>;
}

function TextArea({ title, value, onChange }: { title: string; value: string; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-2 block text-sm font-black text-slate-700">{title}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} className="min-h-36 w-full rounded-[24px] border-2 border-slate-200 bg-white p-4 text-sm font-bold leading-7 outline-none focus:border-brand-green" placeholder="TXT/MD 会自动读取；PDF/DOCX 暂未接入真实解析时，可在这里粘贴内容。" /></label>;
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: string) => void; type?: string }) {
  return <label className="block"><span className="mb-2 block text-xs font-black text-slate-500">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-brand-green" /></label>;
}

function Select({ value, onChange, options, placeholder, labels }: { value: string; onChange: (value: string) => void; options: string[]; placeholder: string; labels?: Record<string, string> }) {
  return <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 outline-none focus:border-brand-green"><option value="">{placeholder}</option>{options.map((option) => <option key={option} value={option}>{labels?.[option] || option}</option>)}</select>;
}

function CheckLine({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-black text-slate-700 shadow-sm"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>;
}

function extractLabel(key: string) {
  const map: Record<string, string> = { vocabulary: "单词列表", phrases: "短语列表", sentences: "句型", grammar: "语法点", readings: "阅读题", examQuestions: "原题训练" };
  return map[key] || key;
}

function stageName(stage: string) {
  const map: Record<string, string> = { vocab: "单词关", phrase: "短语关", sentence: "句型关", grammar: "语法关", reading: "阅读关", exam: "原题训练", wrong: "错题修复" };
  return map[stage] || stage;
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
