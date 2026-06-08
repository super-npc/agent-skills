---
name: "smzl-java-mt5-enum"
description: "为 MT5(或指定数据源)的 DO 字段生成 MyBatis-Plus 枚举映射并替换字段类型。Invoke when 用户提供字段名与枚举值/描述表，要求自动生成枚举与改造 DO。"
---

# smzl-java-mt5-enum

## 目标

把用户提供的“字段 + 枚举值映射表（ID/值/描述）”自动落地为：
- 新增枚举 `enum Xxx implements IEnum<Integer>`（`@EnumValue value` + `desc` + `of(Integer)`）
- 将目标 DO 字段从 `Integer` 替换为该枚举类型
- 为兼容 `BeanUtil.toBean(Map<String,String>, DO.class)` 等场景，在 DO 中补齐 `set<Field>(Integer)` / `set<Field>(String)` 的入参转换
- 必要时更新 `mybatis-plus.type-enums-package`，确保只对指定包下的枚举生效（避免影响其它数据源/模块）

## 触发场景（何时使用）

当用户说类似：
- “这个字段对应 MT5 文档的某个枚举，帮我生成枚举并把字段改成枚举类型”
- “我给你枚举的 ID/值/描述表，你帮我做 MyBatis-Plus 枚举映射”

## 交互式输入（必须询问并确认）

### 1) 目标信息

询问用户并拿到以下信息（缺一不可）：
- DO 文件绝对路径（例如：`d:\...\OrdersDO.java`）
- 字段名（例如：`reason`）
- 字段当前类型（通常是 `Integer`）
- 枚举名（例如：`EnOrderReason`）
- 枚举包名（建议：`cn.aifo.com.module.risk.mt.enums`）
- 枚举值清单（用户粘贴“ID/值/描述”原文，要求每项至少包含：常量名、数值、描述）

建议用一次多选/填空式提问引导用户粘贴，示例格式（让用户照此粘贴即可）：

```
ORDER_REASON_CLIENT 0 客户通过客户端手动手动下达的订单。
ORDER_REASON_EXPERT 1 客户使用EA下达的订单。
...
```

### 2) 兼容性选项（建议默认开启）

询问用户是否需要为 DO 增加以下 setter（默认都加）：
- `set<Field>(Integer raw)` → `Enum.of(raw)`
- `set<Field>(String raw)` → `Enum.of(Integer.parseInt(raw))`（raw 为 null 时置 null）

### 3) 配置范围（必须确认“仅此数据源/模块”）

询问用户“枚举扫描范围”：
- 推荐：仅在当前模块 `application.yaml` 里配置 `mybatis-plus.type-enums-package` 为“枚举包名”（或追加该包名）
- 如果用户明确说不改配置，则只生成枚举+改 DO，但提示：需要确保项目已开启枚举包扫描，否则 MP 可能不会自动转换

## 实施步骤（执行时严格按顺序）

1. 打开并阅读目标 DO 文件，确认字段存在、当前类型正确、项目 import/注解风格（Lombok / MP 注解）。
2. 在枚举包路径下创建枚举文件：
   - `@Getter`、`@AllArgsConstructor`
   - `implements IEnum<Integer>`
   - 字段：
     - `@EnumValue private final Integer value;`
     - `private final String desc;`
   - 工具方法：
     - `public static Xxx of(Integer value)`：value 为 null 返回 null；循环匹配 `this.value.equals(value)`；找不到返回 null
3. 修改 DO：
   - 将字段类型改为新枚举类型
   - 补齐 import
   - 增加 setter 重载（如果用户选择开启）
4. 更新配置（按用户选择）：
   - 定位当前服务的 `application.yaml`（或用户指定配置文件）
   - 确保 `mybatis-plus.type-enums-package` 包含枚举包名
   - 如果已有多个包，用英文逗号分隔追加（不要覆盖其它包）
5. 自检：
   - 全局检索该字段 getter/setter 的调用点，确认改类型不会造成编译错误
   - 运行 IDE 诊断（GetDiagnostics），保证无红线

## 输出要求

最终回复必须包含：
- 新增枚举文件链接（文件路径）
- DO 修改位置链接（文件路径 + 行号范围）
- 若改了配置，给出配置文件链接（文件路径 + 行号范围）

## 约束

- 不新增任何 Java 代码注释（除非用户明确要求）
- 描述 `desc` 必须“原封不动”使用用户提供的中文文案（包括标点、空格、重复措辞）
- 仅在用户指定/确认的范围内修改枚举扫描配置，避免影响非 MT5 数据源

