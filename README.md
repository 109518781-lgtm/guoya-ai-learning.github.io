# 赢未来国雅 AI自适应学习平台 V1.0

高保真网页原型，第一阶段聚焦英语自适应闯关学习系统。

## 技术栈

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui 风格本地组件
- Lucide Icons
- Mock data，无真实数据库、登录、DeepSeek接口、文件解析或订单系统

## 路由

- `/` 首页：只显示 Logo、学生入口、教师入口
- `/login/student` 学生登录，演示账号 `student / 123456`
- `/login/teacher` 教师登录，演示账号 `teacher / 123456`
- `/student` 学生端学习地图
- `/student/practice` 学生沉浸式答题页
- `/student/shop` 学生金币商城
- `/student/cards` 学生抽卡收藏
- `/teacher` 教师端后台
- `/api/ai/extract` Mock AI Provider API route

## 后续接入预留

- `lib/ai/provider.ts`：AI Provider Layer，可切换 DeepSeek、OpenAI、Claude、Gemini
- `lib/mock-data.ts`：当前 UI mock data，未来替换为数据库数据
- `app/api/ai/extract/route.ts`：未来 DeepSeek 调用必须走后端 API route，API Key 不写入前端
- `lib/auth/mock-auth.ts`：Mock authentication provider，未来可替换 Supabase Auth 或 NextAuth
- `lib/learning-store.ts`：localStorage MVP 数据层，保存老师发布任务、AI mock 解析结果、学生进度、错题、星星和金币
- 教师端已预留文件上传、AI解析审核、任务发布、商城管理、订单管理

## MVP 使用流程

1. 进入 `/login/teacher`，使用教师 mock 账号登录。
2. 在 `/teacher` 上传知识点文件和题目文件，或手动粘贴内容。
3. 点击 `AI解析`，生成 mock 单词、短语、句型、语法、阅读题、原题、答案和解析。
4. 在老师审核区编辑、删除或新增内容。
5. 点击 `发布任务`，任务会保存到 localStorage。
6. 进入 `/login/student`，使用学生 mock 账号登录。
7. 在 `/student` 查看 Nintendo 风格冒险地图，点击继续冒险进入 `/student/practice`。
8. 学生完成关卡后获得星星和金币；答错或不会做会进入分步引导；错题进入错题Boss塔修复。

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000
```

## 产品原则

学生端像学习游戏，强调地图、奖励、收藏和持续成功感；教师端保持专业、清爽、直观、高效。
