任务:重新设计 Form 组件

## 任务前
1. 读 CLAUDE.md(必须的,不要跳)
2. 读完后,quote 一条 section 9 的规则给我看
3. 读现有的 Form: @evo-ui/src/Form/、@evo-ui/src/css/form.module.scss
4. 读现有的文档: @evo-docs/src/pages/FormPage.tsx
5. 读 2-3 个参考实现:Radix UI Form Primitive、Mantine Form、shadcn Form
   (只看 API 设计,不看视觉)

## 这次的具体要求
- API 风格:compose-based(Form.Field / Form.Label / Form.Control / Form.Error / Form.Description)
- 支持受控和非受控两种模式
- 字段验证:接受同步函数和异步 Promise
- 响应式:在 375px 宽下所有 label + input 垂直堆叠,≥768px 水平排列
- a11y:label 必须关联 input,error 必须用 aria-describedby

## 视觉参考
- 我们的库现有视觉风格(看 EvoButton、EvoInput),不要从零设计
- Dark mode + Light mode 都要验证
- 错误状态用 --evo-color-danger,不要新增颜色

## 输出顺序(严格)
1. 先输出新 API 的 TypeScript interface(我审)
2. 我点头后,你列出会破坏的现有用法(我审)
3. 我再点头后,你才开始改代码
4. 改完按 CLAUDE.md section 8 给我 summary

不要跳步骤。不要"顺手"改别的文件。不要加新依赖。