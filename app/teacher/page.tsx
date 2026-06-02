import {
  ArrowUpRight,
  Check,
  ClipboardList,
  Coins,
  FileText,
  LockKeyhole,
  PackagePlus,
  Pencil,
  Plus,
  RefreshCw,
  UploadCloud,
  Users,
  WandSparkles
} from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  extractedContent,
  learningPortrait,
  orders,
  shopItems,
  teacherMenu,
  teacherStudents
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function TeacherPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-200 bg-white p-5">
          <BrandLogo />
          <nav className="mt-8 grid gap-2">
            {teacherMenu.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={`#section-${index}`}
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
          <div className="mt-8 rounded-[24px] bg-slate-950 p-5 text-white">
            <div className="text-sm font-black text-lime-300">AI Provider Layer</div>
            <p className="mt-2 text-xs font-semibold leading-6 text-slate-300">
              当前为 mock UI。未来 DeepSeek、OpenAI、Claude、Gemini 都通过后端 API route 调用，API Key 不进入前端。
            </p>
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="green">英语第一阶段</Badge>
              <h1 className="mt-3 text-3xl font-black text-slate-950">教师教学后台</h1>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                创建学生档案、上传资料、审核AI拆解内容、发布任务并追踪学习画像。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline">
                <RefreshCw size={18} /> 同步数据
              </Button>
              <Button asChild variant="outline">
                <Link href="/login/teacher">退出</Link>
              </Button>
              <Button>
                <Plus size={18} /> 新建任务
              </Button>
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-[1.45fr_.85fr]">
            <div className="grid gap-5">
              <DashboardMetrics />
              <StudentManagement />
              <UploadAndReview />
              <LearningData />
            </div>

            <aside className="grid content-start gap-5">
              <TaskPublish />
              <ShopManagement />
              <OrderManagement />
              <SystemSettings />
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardMetrics() {
  const metrics = [
    { label: "已创建学生", value: "128", note: "本周新增 12" },
    { label: "进行中任务", value: "18", note: "英语 16 / 数学预留 2" },
    { label: "平均正确率", value: "86%", note: "较上周 +7%" },
    { label: "待审核AI内容", value: "43", note: "答案推断 18 项" }
  ];
  return (
    <div id="section-0" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((item) => (
        <Card key={item.label} className="hover:translate-y-0">
          <CardContent className="p-5">
            <p className="text-sm font-black text-slate-500">{item.label}</p>
            <div className="mt-3 text-3xl font-black text-slate-950">{item.value}</div>
            <p className="mt-2 text-xs font-bold text-lime-700">{item.note}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function StudentManagement() {
  return (
    <Card id="section-1" className="hover:translate-y-0">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Users className="text-brand-blue" /> 学生管理
          </CardTitle>
          <p className="text-sm font-semibold text-slate-500">
            老师创建姓名、年级、班级、小组、账号和密码；学生不能修改真实姓名与密码。
          </p>
        </div>
        <Button variant="blue">
          <Plus size={18} /> 创建学生档案
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3">
        {teacherStudents.map((student) => (
          <div key={student.account} className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center">
            <div>
              <div className="text-lg font-black text-slate-950">{student.name}</div>
              <div className="text-xs font-bold text-slate-500">{student.grade} · {student.className} · {student.group}</div>
            </div>
            <div className="text-sm font-bold text-slate-600">
              账号：{student.account}<br />密码：{student.password}
            </div>
            <div>
              <div className="mb-2 flex justify-between text-xs font-black text-slate-500">
                <span>{student.stuck}</span>
                <span>{student.progress}%</span>
              </div>
              <Progress value={student.progress} className="h-3" />
            </div>
            <Button variant="outline" size="sm">
              <LockKeyhole size={16} /> 重置密码
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function UploadAndReview() {
  return (
    <div className="grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
      <Card id="section-3" className="hover:translate-y-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadCloud className="text-brand-green" /> 资料上传
          </CardTitle>
          <p className="text-sm font-semibold leading-7 text-slate-500">
            一次学习任务可上传多个文件：知识点文件和题目文件。支持 PDF、DOCX、TXT、MD，单个不超过 50MB。
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <UploadBox title="知识点文件" detail="单词、短语、句型、语法点、重点笔记" />
          <UploadBox title="题目文件" detail="练习题、阅读文章、测试题，可暂不含答案" />
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold leading-7 text-slate-500">
            解析失败时，老师可在此手动粘贴内容。真实文件解析后续接入服务端流程。
          </div>
        </CardContent>
      </Card>

      <Card id="section-4" className="hover:translate-y-0">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <WandSparkles className="text-brand-purple" /> AI解析审核
            </CardTitle>
            <p className="text-sm font-semibold text-slate-500">答案缺失时由AI推断，并标记为待老师审核。</p>
          </div>
          <Button variant="yellow">
            <Check size={18} /> 审核通过
          </Button>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {extractedContent.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.type} className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-lime-50 text-brand-green">
                    <Icon size={22} />
                  </div>
                  <Badge variant={item.status === "已审核" ? "green" : item.status === "AI推断" ? "purple" : "yellow"}>
                    {item.status}
                  </Badge>
                </div>
                <h3 className="mt-4 text-lg font-black text-slate-950">{item.type} · {item.count}</h3>
                <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-slate-500">{item.sample}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["编辑", "删除", "新增", "调序", "难度", "金币", "通关"].map((action) => (
                    <button key={action} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function UploadBox({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="rounded-[26px] border-2 border-dashed border-lime-200 bg-lime-50/70 p-5">
      <FileText className="text-brand-green" size={28} />
      <h3 className="mt-3 text-lg font-black text-slate-950">{title}</h3>
      <p className="mt-1 text-sm font-semibold text-slate-500">{detail}</p>
      <Button variant="outline" className="mt-4">
        <UploadCloud size={18} /> 选择文件
      </Button>
    </div>
  );
}

function TaskPublish() {
  return (
    <Card id="section-6" className="hover:translate-y-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="text-brand-blue" /> 任务发布
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {["单个学生", "小组", "班级"].map((target) => (
          <button key={target} className="flex items-center justify-between rounded-[24px] bg-slate-50 p-4 text-left font-black text-slate-700">
            分配给{target}
            <ArrowUpRight size={18} />
          </button>
        ))}
      </CardContent>
    </Card>
  );
}

function LearningData() {
  return (
    <Card id="section-7" className="hover:translate-y-0">
      <CardHeader>
        <CardTitle>学习数据与画像</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <div className="grid gap-3">
          {[
            ["学习进度", 62],
            ["正确率", 91],
            ["错题修复", 48],
            ["独立完成度", 73]
          ].map(([label, value]) => (
            <div key={label as string}>
              <div className="mb-2 flex justify-between text-sm font-black text-slate-600">
                <span>{label}</span>
                <span>{value}%</span>
              </div>
              <Progress value={value as number} />
            </div>
          ))}
        </div>
        <div className="grid gap-3">
          {learningPortrait.map((item) => (
            <div key={item} className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 text-sm font-bold leading-7 text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ShopManagement() {
  return (
    <Card id="section-8" className="hover:translate-y-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PackagePlus className="text-brand-orange" /> 商城管理
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {shopItems.slice(0, 3).map((item) => (
          <div key={item.name} className="flex items-center justify-between gap-3 rounded-[24px] bg-slate-50 p-4">
            <div>
              <div className="font-black text-slate-950">{item.name}</div>
              <div className="text-xs font-bold text-slate-500">{item.category} · 库存 {item.stock}</div>
            </div>
            <div className="flex items-center gap-1 font-black text-brand-orange">
              <Coins size={18} /> {item.price}
            </div>
          </div>
        ))}
        <Button variant="outline">
          <Pencil size={18} /> 自定义商品
        </Button>
      </CardContent>
    </Card>
  );
}

function OrderManagement() {
  return (
    <Card id="section-9" className="hover:translate-y-0">
      <CardHeader>
        <CardTitle>订单管理</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {orders.map((order) => (
          <div key={`${order.student}-${order.item}`} className="rounded-[24px] border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-black text-slate-950">{order.student} · {order.item}</div>
                <div className="mt-1 text-xs font-bold text-slate-500">{order.price} 金币</div>
              </div>
              <Badge variant={order.status === "待确认" ? "yellow" : order.status === "已拒绝" ? "red" : "green"}>
                {order.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function SystemSettings() {
  return (
    <Card id="section-10" className="hover:translate-y-0">
      <CardHeader>
        <CardTitle>系统设置预留</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-semibold leading-7 text-slate-500">
          暂不做真实登录、数据库、DeepSeek接口、支付、家长端、多校区权限、图片OCR、Excel解析和排行榜。
        </p>
      </CardContent>
    </Card>
  );
}
