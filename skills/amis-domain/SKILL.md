---
name: "amis-domain"
description: "总结 Furina Java Domain 的 Amis+AutoTable 约定，并指导将普通 POJO 改造成同风格实体。Invoke when 需要新增/改造 domain 实体、补齐 AmisField/AmisPage/AutoTable 注解时。"
compatibility: opencode
---

# Amis Domain（Furina 约定）

## 适用场景
- 将普通 Java POJO 改造成可直接用于后台 Amis 页面生成的 domain 实体
- 为已有实体补齐/规范化 bronya.core.base.annotation.amis 与 org.dromara.mpe.autotable.annotation 的注解用法
- 需要统一字段展示、搜索、表单（add/edit/detail）渲染、操作按钮（operation/headerToolbar）配置

## 总体特征（从现有类归纳）

### 1) 实体基类与 Lombok
- 实体通常继承 `BaseEntity<ID, Date>`，常见为 `BaseEntity<Long, Date>`
- 统一使用 `@Data`、`@EqualsAndHashCode(callSuper = true)`、`@FieldNameConstants`
- 通过 `Xxx.Fields.xxx` 常量引用字段名，用于排序、JoinCondition、索引等

### 2) AutoTable / 表结构注解（Dromara）
- 类级别：
  - `@Table(comment = "...")`
  - `@MysqlCharset(charset = "utf8mb4", collate = "utf8mb4_general_ci")`
  - 可选：`@TableIndexes/@TableIndex/@IndexField` 定义（唯一）索引
- 主键：
  - `@ColumnId(mode = IdType.AUTO|INPUT, type = MysqlTypeConstant.BIGINT, length = ..., comment = "...")`
  - 主键字段基本都会加 `@AmisField`
- 普通字段：
  - `@Column(comment = "...", notNull = true/false, defaultValue = "...", type = MysqlTypeConstant.VARCHAR, length = ...)`

### 3) Amis 页面级注解（bronya）
- 类级别：
  - `@Amis(ext = @Amis.ExpandField(extBean = XxxExt.class, dataProxy = XxxProxy.class))`
  - `@AmisPage(...)`：配置菜单、排序、按钮、字段分组、操作栏等
- 常见 AmisPage 配置项：
  - `menu = @Menu(group = ..., module = ..., menu = "...", order = n, show = true/false)`
  - `orderBys = {@AmisPage.OrderBy(cols = {Xxx.Fields.id}, type = OrderByType.DESC)}`
  - `btns = @Btns(add = true/false, edit = true/false, delete = true/false, detail = true/false)`
  - `fieldSets = {@AmisPage.FieldSet(position = top, title = "...", fields = {...})}`
  - `headerToolbar = @Operation(optBtns = {...})`
  - `operation = @Operation(optBtns = {...})`（行内/批量操作）

### 4) 字段级 AmisField（展示 / 搜索 / 表单）
- 基本字段：`@AmisField` + 对应 `@Column`
- 搜索：`@AmisField(search = @AmisField.Search(operator = SqlOperator.EQUALS))`
- 控制不同场景渲染（table/add/edit/detail）：
  - `@AmisField(table = @AmisFieldView(type = ...), add = @AmisFieldView(type = ...), edit = @AmisFieldView(type = ...), detail = ...)`
- 常见输入/展示组件：
  - 图片上传：`@AmisInputImage.InputImage(platform = FilePlatformType.RUSTFS)` + `ViewType.上传图片`
  - 文件上传/视频：`@AmisInputFile.InputFile(accept = "*")` + `ViewType.上传文件 / 视频`
  - 编辑器：`@AmisEditor.Editor(language = EditorLanguage.markdown, markdownRender = true)` + `ViewType.代码编辑器`
  - 开关：`@AmisSwitch.Switch(onText = "...", offText = "...")`
  - 步骤条：`@AmisSteps.Steps(bindStatusField = Xxx.Fields.stepStatus)`（需要配套状态字段）

### 5) 关联关系（BindMany2One / BindOne2Many）
- Many-to-One（保存外键列）：
  - 外键字段仍是 `Long xxxId`，加 `@BindMany2One(entity = Target.class, valueField = Target.Fields.id, labelField = Target.Fields.xxx)`
  - 同时加 `@AmisField` 让页面展示为关联字段
- One-to-Many（非表字段，列表聚合展示）：
  - 字段用 `List<Child>`，并标记为非持久化：
    - `@Ignore`
    - `@TableField(exist = false)`
  - 再用 `@BindOne2Many(entity = Child.class, condition = @JoinCondition(selfField = Fields.id, joinField = Child.Fields.parentId, joinFieldLabel = Child.Fields.someLabel))`

### 6) 扩展字段 Ext（通过 Proxy 注入）
- 常见模式：定义一个 `public static class XxxExt`，字段使用 `@AmisField(...)` 描述展示与搜索
- Ext 字段可按需要加 `@Column(...)`（当 Ext 也需要复用 Column 元信息时）
- Ext 由 `@Amis.ExpandField(extBean = XxxExt.class, dataProxy = XxxProxy.class)` 提供数据

### 7) 操作确认表单 ConfirmForm（Operation.confirmForm）
- 常见模式：`public static class XxxConfirmForm implements Serializable`
- 字段用 `@AmisField(...)` 指定选择器/下拉框/默认值等
- 参数映射：用 `@JsonProperty("EntityName__fieldName")` 约定后端接收结构

### 8) 枚举（用于展示色彩/步骤）
- 普通枚举：实现 `AmisEnum`，具备 `desc + color`
- 步骤枚举：实现 `AmisStepsEnum`，具备 `desc + color + step`
- 统一使用 `@Getter @AllArgsConstructor`

## 改造流程（把普通类改成同风格 Domain）

### Step 1：明确实体职责
- 是否需要落库：落库字段用 `@Column/@ColumnId`，非落库字段走 `@Ignore + @TableField(exist = false)`
- 是否需要后台页面：需要则补齐 `@Amis/@AmisPage/@AmisField`
- 是否需要扩展态字段：需要则创建 `XxxExt` + `dataProxy`

### Step 2：补齐类级注解
- `@Data @EqualsAndHashCode(callSuper = true) @FieldNameConstants`
- `@Table(comment = "...") @MysqlCharset(...)`
- `@Amis(ext = @Amis.ExpandField(...))`
- `@AmisPage(menu=..., orderBys=..., btns=..., operation/headerToolbar/fieldSets=...)`

### Step 3：补齐主键与基础字段
- 增加 `id` 字段：`@ColumnId(...) @AmisField private Long id;`
- 为每个持久化字段补齐：`@Column(...) + @AmisField(...)`
- 若字段需要筛选：补齐 `search = @AmisField.Search(operator = SqlOperator.EQUALS)`
- 若字段是媒体类：配置 `AmisInputImage/AmisInputFile` 与 `AmisFieldView`

### Step 4：补齐关联关系
- 外键列用 `@BindMany2One`（同时保留 `Long xxxId`）
- 子表集合用 `@BindOne2Many` + `@JoinCondition`，并标记为非持久化

### Step 5：补齐操作按钮与确认表单（可选）
- 需要批量/单行操作：在 `@AmisPage(operation = @Operation(optBtns = {...}))` 添加 `OptBtn`
- 需要弹窗参数：为 `OptBtn.confirmForm` 创建 `static class XxxConfirmForm implements Serializable`
- 需要字段名映射：使用 `@JsonProperty("Entity__field")`

## 输出要求（调用本技能时的期望产物）
- 给出改造后的完整类代码（保持项目现有 import 与注解风格）
- 若引入了 Ext/ConfirmForm/枚举，确保都放在同一个实体类内部（与现有类一致）
- 若涉及关联关系，补齐 `BindMany2One/BindOne2Many/JoinCondition` 所需的字段常量引用
- 不新增无关依赖；优先复用项目已有类型（Color、AmisEnum、FilePlatformType、StepStatus 等）

## 最小骨架（可直接套用并按需裁剪）

```java
@Data
@Table(comment = "TODO")
@MysqlCharset(charset = "utf8mb4", collate = "utf8mb4_general_ci")
@EqualsAndHashCode(callSuper = true)
@FieldNameConstants
@Amis(ext = @Amis.ExpandField(extBean = Xxx.XxxExt.class, dataProxy = XxxProxy.class))
@AmisPage(
    menu = @Menu(group = TODO_GROUP.class, module = TODO_MODULE.class, menu = "TODO", order = 1),
    orderBys = {@AmisPage.OrderBy(cols = {Xxx.Fields.id}, type = OrderByType.DESC)}
)
public class Xxx extends BaseEntity<Long, Date> {
    @ColumnId(mode = IdType.AUTO, comment = "id主键", type = MysqlTypeConstant.BIGINT, length = 32)
    @AmisField
    private Long id;

    @Column(notNull = true, comment = "名称")
    @AmisField(search = @AmisField.Search(operator = SqlOperator.EQUALS))
    private String name;

    @Data
    public static class XxxExt {
        @AmisField(comment = "扩展字段")
        private String extField;
    }
}
```

