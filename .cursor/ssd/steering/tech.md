# Technology Stack

## Project Type

**AI-Powered Observability Platform (Backend API Service)**

Eagle Eye AI (Castrel AI) 是一个基于 FastAPI 的后端 API 服务，专注于通过 AI 技术自动化数据探索、服务发现和根因分析。该平台作为可观测性数据的智能分析引擎，为运维团队提供自动化的数据处理和洞察能力。

**服务特点**：
- 异步 RESTful API 服务
- AI 驱动的数据分析工作流
- 插件化的数据源集成架构
- 支持多租户的 SaaS 架构

## Core Technologies

### Primary Language

- **Language**: Python 3.13+
- **Runtime**: CPython 3.13
- **Package Manager**: uv (高性能 Python 包管理工具)
- **Dependency Management**: pyproject.toml (PEP 621 标准)

### Key Dependencies

#### Web Framework & ASGI
- **FastAPI** (>=0.104.0): 现代、高性能的 Web 框架，原生异步支持
- **Uvicorn[standard]** (>=0.31.0): ASGI 服务器
- **Gunicorn** (>=23.0.0): 生产环境多进程管理

#### AI & LLM Framework
- **LangGraph** (>=1.0.2): AI 工作流编排框架，支持有状态 Agent
- **LangChain** (>=1.0.5): LLM 应用开发框架
- **LangChain Providers**: OpenAI、Anthropic、DeepSeek 等
- **Langfuse** (>=3.9.1): LLM 可观测性和跟踪

#### Database & ORM
- **SQLAlchemy[asyncio]** (>=2.0.0): 异步 ORM 框架
- **AsyncPG** (>=0.29.0): PostgreSQL 异步驱动
- **Alembic** (>=1.13.0): 数据库迁移工具

#### Cache & Message Queue
- **Redis[hiredis]** (>=5.0.1): 内存数据库，用于会话、分布式锁、消息队列

#### Data Validation & Configuration
- **Pydantic** (>=2.0.0): 数据验证和 Settings 管理
- **Pydantic-settings** (>=2.0.0): 环境变量配置管理

## Application Architecture

**分层架构 + 插件化设计**

```
API Layer (FastAPI Endpoints)
    ↓
Service Layer (Business Logic)
    ↓
CRUD Layer (Data Access)
    ↓
Model Layer (ORM Models)
    ↓
Integration Layer (Plugin-based)
    ↓
Data Sources (Elasticsearch, Datadog, etc.)
```

**架构特点**：
1. **严格分层**：API → Service → CRUD → Model，依赖单向
2. **插件化**：数据源通过插件系统动态加载，易于扩展
3. **异步优先**：全链路异步处理，提高并发性能
4. **多租户支持**：通过 workspace_id 实现数据隔离
5. **AI 工作流**：基于 LangGraph 的可编排 AI Agent

## Data Storage

### Primary Storage
- **PostgreSQL 12+**: 关系型数据库
  - 业务数据、用户数据、工作流状态、CI 配置项
  - 驱动：AsyncPG（异步）、Psycopg v3（同步备用）
  - LangGraph 检查点存储

### Caching
- **Redis 5.0+**: 内存数据库
  - 会话存储、分布式锁、消息队列（Stream）、缓存层

## External Integrations

### Data Source Integrations
- **Elasticsearch**: 日志数据查询
- **Datadog**: 指标、日志、链路查询
- **Prometheus**: 时序指标查询
- **Doop**: 自定义监控平台

**集成方式**：插件化架构，每个数据源实现统一接口，通过 IntegrationManager 动态加载

### LLM Provider Integrations
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude 3.x
- **DeepSeek**: DeepSeek Chat
- **阿里云**: 通义千问
- **Ollama**: 本地 LLM 部署

## Development Environment

### Build & Development Tools
- **Build System**: uv (现代 Python 包管理和构建工具)
- **Code Quality**: Ruff (>=0.12.11) - 高性能 Linter 和 Formatter
- **Testing**: Pytest (>=8.4.1) + Pytest-asyncio

### Code Quality Standards
- **Line Length**: 100 字符
- **Type Checking**: MyPy（推荐使用，未强制）
- **Formatting**: Ruff format（自动运行）

## Deployment

### Production Deployment
- **Server**: Gunicorn + Uvicorn Workers
- **Worker 配置**: `(2 * CPU cores) + 1`（默认）
- **Container**: Docker（推荐生产部署）
- **Orchestration**: Kubernetes（企业部署）

### Performance Requirements
- **API Response Time**: P95 < 500ms（复杂查询）
- **Throughput**: 1000+ requests/second（单机）
- **Concurrency**: 支持 10000+ 并发连接

## Technical Decisions & Rationale

### 1. FastAPI 而非 Flask/Django
- 原生异步支持，性能优异
- 自动 API 文档生成
- 基于 Pydantic 的类型安全验证

### 2. PostgreSQL 而非 MySQL
- JSONB 支持（存储非结构化数据）
- 更强的数据一致性和事务支持
- LangGraph 官方支持 PostgreSQL 检查点

### 3. LangGraph 而非自研工作流引擎
- 专为 AI Agent 设计，支持有状态编排
- 内置检查点和状态持久化
- 与 LangChain 生态无缝集成

### 4. 插件化架构进行数据源集成
- 易于扩展新数据源
- 隔离数据源特定逻辑
- 支持运行时加载和热更新

### 5. Gunicorn + Uvicorn Workers
- 多进程并发处理，充分利用多核 CPU
- 自动 Worker 重启和健康检查
- 生产级稳定性和监控能力

### 6. uv 而非 pip/poetry
- 极快的依赖解析和安装速度（10-100x）
- 统一的包管理和虚拟环境管理
- 兼容 pip 生态，无迁移成本

### 7. Ruff 而非 Black + Flake8 + isort
- 集成多个工具，配置统一
- 极快的性能（Rust 实现，10-100x）
- 自动修复功能

## Known Limitations

1. **LLM API 依赖**：依赖外部 LLM API，受网络和 API 限制影响
2. **单数据库实例**：当前仅支持单 PostgreSQL 实例，未实现读写分离
3. **同步数据源查询**：部分数据源插件使用同步 API，在异步环境中阻塞事件循环
4. **AI 工作流执行时间**：完整的数据探索工作流可能需要 5-10 分钟
5. **内存使用**：AI Agent 和 LangGraph 状态可能占用较大内存

