# Project Structure

## Directory Organization

项目采用**分层架构 + 插件化设计**，核心目录结构如下：

```
app/
├── api/v1/endpoints/      # API 端点层（HTTP 请求处理）
├── services/              # 业务逻辑层（业务编排）
├── database/
│   ├── models/           # 数据模型层（ORM 定义）
│   └── crud/             # CRUD 层（数据访问）
├── workflows/            # AI 工作流层
│   ├── agent/           # AI Agent 实现
│   ├── graph/            # LangGraph 图定义
│   └── tools/            # 工作流工具
├── integrations/        # 集成层（插件化）
│   ├── plugins/         # 数据源插件
│   ├── facades/         # 统一门面
│   └── interfaces/      # 接口定义
├── schemas/              # Pydantic 数据模型
├── core/                 # 核心功能（配置、上下文、异常）
└── config/               # 配置模块
```

## Architecture Principles

### 1. Layered Architecture（分层架构）

**严格的依赖方向**：API → Service → CRUD → Model

```
API Layer (endpoints/)
    ↓ 只调用 Service
Service Layer (services/)
    ↓ 只调用 CRUD
CRUD Layer (database/crud/)
    ↓ 只访问 Model
Model Layer (database/models/)
```

**规则**：
- API 层不直接访问 CRUD 或 Model，必须通过 Service
- Service 层不直接构建 SQL，必须通过 CRUD
- CRUD 层只负责数据访问，不包含业务逻辑
- Model 层只定义数据结构，不包含业务逻辑

### 2. Short-Lived Sessions（短生命周期会话）

数据库会话不在类初始化时持有，而是在方法内部使用 `async with` 创建：

```python
# ✅ 推荐：使用 async with
async def some_service_method():
    async with get_async_db_session() as session:
        crud = UserCRUD(session)
        user = await crud.get(user_id=1)
        return user
    # 会话自动关闭

# ❌ 不推荐：长生命周期会话
class SomeService:
    def __init__(self):
        self.session = get_session()  # 长期持有
```

### 3. Plugin Architecture（插件化架构）

数据源通过插件系统动态加载：

```
app/integrations/
├── interfaces/          # 接口定义（LogQueryService, MetricQueryService 等）
├── facades/             # 统一门面（封装插件调用）
└── plugins/             # 数据源插件
    ├── elasticsearch/
    ├── datadog/
    ├── prometheus/
    └── doop/
```

**插件组织规范**：
- 每个插件一个顶层目录（以数据源命名）
- 按数据类型分子目录：log/、metric/、trace/、alert/
- 每个数据类型子目录实现对应的 QueryService 接口
- 通过 IntegrationManager 动态加载
- 插件之间互不依赖，完全隔离

### 4. Workflow Organization（工作流组织）

AI Agent 按功能组织：

```
app/workflows/agent/
├── data_exploration_agent/      # 数据探索 Agent
│   ├── processors/              # 按数据类型的处理器
│   ├── recognizers/             # 通用识别器（跨数据类型）
│   └── prompts/                 # Prompt 模板（按识别类型）
├── log_identification_agent/
└── metric_identification_agent/
```

**设计原则**：
- 每个 Agent 是独立的子目录
- Processor 按数据类型组织（Log、Metric、Trace）
- Recognizer 是通用的，可跨 Processor 复用
- Prompt 按识别任务类型组织

## Naming Conventions

### Files
- **API 端点文件**：`snake_case`，功能描述（如：`ci_service.py`）
- **服务类文件**：`snake_case`，以 `_service.py` 结尾
- **数据模型文件**：`snake_case`，实体名称（如：`user.py`）
- **CRUD 文件**：`snake_case`，以 `_crud.py` 结尾
- **Schema 文件**：`snake_case`，与模型对应

### Code
- **类名/类型名**：`PascalCase`（如：`WorkflowExecution`）
- **函数/方法名**：`snake_case`（如：`get_user_by_id()`）
- **常量**：`UPPER_SNAKE_CASE`（如：`MAX_REQUESTS`）
- **变量**：`snake_case`（如：`user_id`）
- **私有成员**：前缀 `_`（如：`_validate_input()`）

### Enum Types
```python
class WorkflowStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
```

## Import Patterns

### Import Order
严格遵循以下顺序，组之间用空行分隔：

1. **标准库导入**
2. **第三方库导入**
3. **本地应用导入**（按层级组织，从 `app` 开始）
4. **相对导入**（仅在模块内部使用）

### Module Organization
- **绝对导入**：优先使用绝对导入（从 `app` 开始）
- **相对导入**：仅在同一包内使用
- **避免循环导入**：使用 `TYPE_CHECKING` 进行类型注解导入

```python
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.services.workflow_service import WorkflowService
```

## Code Organization Principles

### 1. Single Responsibility（单一职责）
每个文件/类/函数应有明确的单一职责

**示例**：
- ✅ `user_service.py`：仅处理用户相关业务逻辑
- ✅ `workflow_execution_crud.py`：仅处理工作流执行的 CRUD 操作
- ❌ `utils.py`：混杂各种不相关的工具函数（应拆分）

### 2. Modularity（模块化）
代码组织为可复用的模块，按功能域划分

### 3. Testability（可测试性）
使用依赖注入（Dependency Injection），避免硬编码依赖，隔离外部依赖

```python
# ✅ 可测试的设计
class ServiceRecognizer:
    def __init__(self, llm_client: LLMClient):
        self.llm_client = llm_client  # 依赖注入
```

### 4. Consistency（一致性）
遵循项目既定的模式和约定

**命名一致性**：
- Service 层方法：`get_*`、`create_*`、`update_*`、`delete_*`
- CRUD 层方法：`get_*`、`create`、`update`、`delete`、`list_*`
- 异步方法：使用 `async/await`

## Code Size Guidelines

### File Size
- **理想范围**：200-500 行
- **最大限制**：1000 行
- **超过 1000 行**：考虑拆分为多个模块

### Function/Method Size
- **理想范围**：10-30 行
- **最大限制**：50 行
- **超过 50 行**：拆分为多个子函数

### Class/Module Complexity
- **方法数量**：< 15 个公共方法
- **嵌套深度**：≤ 4 层
- **圈复杂度**：< 10（每个函数）

## Design Patterns

### 1. Repository Pattern（CRUD 层）
所有 CRUD 类都是 Repository 模式的实现，封装数据访问逻辑

### 2. Factory Pattern（工厂模式）
用于创建不同类型的处理器、识别器等

### 3. Dependency Injection（依赖注入）
通过构造函数注入依赖，提高可测试性

### 4. Facade Pattern（门面模式）
Integration Facades 提供统一的数据查询接口，隐藏插件实现细节

## Module Boundaries

### Core vs Plugins（核心 vs 插件）

**Core**：核心功能，稳定且不易变化
- `app/core/`：配置、上下文、异常、中间件
- `app/database/`：数据模型、CRUD 基础
- `app/api/`：API 框架和路由

**Plugins**：可扩展的插件系统
- `app/integrations/plugins/`：数据源插件
- 每个插件独立实现 `QueryService` 接口
- 通过 `IntegrationManager` 动态加载
- 插件之间互不依赖

### Public API vs Internal（公共 API vs 内部）

**Public API**：暴露给外部的接口
- `app/api/v1/endpoints/`：所有公共 REST API
- 明确的版本控制（v1、v2）
- 完整的文档和类型注解

**Internal**：内部实现细节
- `app/services/`：内部业务逻辑
- `app/database/crud/`：内部数据访问
- 以 `_` 开头的私有函数/类

