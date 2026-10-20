# AetherFlow（以太记账）

> **项目代号 (Repo Name)**: `AetherFlow`

> **中文官方名称**: **以太记账**

> **核心愿景**: *A private, local-first personal ledger with automotive telemetry and cross-device seamless synchronization.*（私密优先、深度融合车生活与多端无缝协同的现代化资产账本）

> **工程基准**: 企业级工程化规范（TypeScript、分层解耦、状态机表头嗅探、全局响应式状态、服务抽象），全面重构为移动优先（Mobile-First）与本地优先（Local-First）跨端工程体系。

> **开源定位**: 聚焦 GitHub 独立发布，主打 Android (APK / F-Droid) 与 iOS (IPA / TrollStore / AltStore) 免费分发，无广告、零订阅、端到端数据自决。

## 当前里程碑：本地流水管理

已完成流水领域模型、SQLite 数据层、首页按日流水、账户筛选、金额隐私遮罩，以及新增、详情、在位修改、完整编辑和软删除闭环。报表、车主和设置页面已通过独立路由保留模块入口。

数据在浏览器端使用 SQLite WASM 执行真实 SQL，并将数据库快照持久化到 IndexedDB。业务通过 `TransactionRepository` 与存储实现解耦，后续接入 Capacitor 原生 SQLite 时可复用领域层与页面。

## 本地运行

```bash
pnpm install
pnpm dev
```

开发地址默认为 `http://127.0.0.1:4173`。

## 验证命令

```bash
pnpm typecheck
pnpm test
pnpm build
```

## 工程结构

- `src/modules/transactions`：流水领域模型、服务、数据仓储、状态、组合式逻辑、页面和按职责拆分的组件
- `src/modules/accounts`：账户模型、默认数据和表结构
- `src/modules/categories`：分类模型、默认分类树和表结构
- `src/modules/reports|vehicle|settings`：独立业务模块
- `src/router/modules`：按业务域注册的路由模块
- `src/shared`：跨模块复用的库层组件与组合式函数
- `src/database`：与业务无关的 SQLite 执行器和快照持久化
- `src/styles`：设计令牌、基础样式和全局布局

详细依赖规则和新增模块模板见 `docs/architecture.md`。

首个里程碑暂不包含凭证图片持久化、批量修改、预算、报表、车主和设置功能。
