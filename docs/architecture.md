# AetherFlow 前端架构约定

## 目标

工程按业务域划分模块，组件、状态、领域服务和持久化实现各自内聚。跨模块能力进入 `shared` 或 `database`，业务模块之间只允许依赖对方公开的模型和稳定接口。

## 依赖方向

```text
views / components
        ↓
composables / stores
        ↓
services / repositories
        ↓
models / constants
```

页面和组件可以调用状态或组合式函数；状态层协调领域服务；Repository 处理持久化；SQLite 执行器不了解流水、账户或分类业务。禁止反向依赖，例如模型引用 Store，或数据库基础设施引用页面组件。

## 模块目录

每个业务模块统一使用以下结构，未用到的目录不提前创建：

```text
modules/<domain>/
├── components/       # 仅属于该业务域的交互组件
├── composables/      # 页面和复杂表单的可复用状态逻辑
├── constants/        # 稳定枚举、默认数据
├── database/         # 该域的表结构和种子数据
├── models/           # 实体、输入输出类型
├── repositories/     # 持久化接口与适配器
├── services/         # 纯领域计算、校验、聚合
├── stores/           # Pinia 状态边界
└── views/            # 路由页面
```

## 组件规则

- 一个组件只负责一个界面职责。页面负责编排，子组件负责明确区域。
- 复杂组件拆成容器、展示组件和组合式函数；金额键盘、分类选择、表单字段不与页面混写。
- 通用能力放入 `src/shared/components`，领域能力保留在对应模块。
- 全局样式只保留设计令牌、基础元素和应用壳层；组件样式使用 `scoped`。
- 单个文件出现多类职责时先拆逻辑，再考虑拆样式。

## 路由规则

- 每个业务域在 `src/router/modules` 中声明自己的路由。
- `src/router/index.ts` 只负责组合路由。
- 页面标题等稳定信息放入路由 `meta`。

## 测试规则

- 聚合、金额键盘、校验等纯逻辑放在 `services` 并提供单元测试。
- Repository 集成、浏览器持久化和完整交互通过构建及浏览器验收覆盖。
- 每个核心模块交付时至少执行 `pnpm typecheck`、`pnpm test` 和 `pnpm build`。

## 新增模块检查

1. 模型和常量是否归入对应模块。
2. 页面、表单和列表是否继续拆成独立组件。
3. 业务计算是否位于可测试的 service。
4. 持久化细节是否停留在 Repository 或 `database`。
5. 是否新增独立路由模块，而没有继续扩大全局 `App.vue`。
