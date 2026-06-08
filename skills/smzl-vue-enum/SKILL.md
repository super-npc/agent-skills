---
name: smzl-vue-enum
description: 当用户意图为“改造枚举”、“替换字典”、“关于枚举键值对问题”、“使用接口映射枚举”时触发。用于在 Vue3 + Element Plus 项目中，交互式引导用户将硬编码的字典或枚举替换为从后端统一接口动态获取，并自动改造相关的表单组件和表格列。
---

# smzl-vue-enum 技能指南

你当前正在执行 `smzl-vue-enum` 技能。你的任务是引导用户进行 Vue 文件的枚举改造，将原本基于字典功能或硬编码的枚举，替换为通过统一接口进行映射。

## 1. 交互式引导（信息收集）

在开始修改代码之前，**必须**首先向用户确认以下信息。你可以直接在回复中向用户提问，或者使用 `AskUserQuestion` 工具：

1. **目标文件**：需要进行枚举改造的 Vue 文件路径（或所在目录）是什么？
2. **接口信息**：获取所有枚举的 API 方法及其引入路径是什么？（例如：`import { getRiskAllEnums } from '@/api/risk/commons'`）
3. **涉及的枚举类名**：当前文件中涉及到哪些具体的枚举字典映射？（例如：`RuleStatus`, `RiskLevel` 等，以便在 `v-for` 中准确使用 `allEnums.RuleStatus`）

*如果用户在初始请求中已经提供了上述信息（例如刚才已经在上下文中提供），则可以跳过对应问题的询问，直接进行总结并询问是否开始执行。*

## 2. 分析与规划

获取信息后，使用 `Read` 或 `Grep` 工具读取目标 Vue 文件，重点分析以下内容：
- **`<script setup>`**：检查是否已有 `onMounted`，是否需要合并。
- **表单录入**：查找 `<el-select>`、`<el-radio-group>` 等需要选择枚举的组件。
- **表格展示**：查找 `<el-table-column>` 等需要回显枚举文案的组件。

## 3. 执行改造规范

使用 `SearchReplace` 工具按以下规范改造目标文件：

### 3.1 引入接口并初始化枚举响应式变量

在 `<script setup>` 中添加：
```typescript
import { ref, onMounted } from 'vue'
import { getRiskAllEnums } from '@/api/risk/commons' // 根据用户提供的实际路径替换

const allEnums = ref<Record<string, any>>({})

onMounted(async () => {
  allEnums.value = await getRiskAllEnums() || {}
  // 如果已有 onMounted，请将上述赋值逻辑合并到现有的 onMounted 顶部
})
```

### 3.2 改造表格数据回显 (el-table-column)

增加一个通用的 `getEnumLabel` 方法（如果该文件内有表格）：
```typescript
const getEnumLabel = (enumKey: string, value: any) => {
  if (!allEnums.value[enumKey] || value === undefined || value === null) return value
  // 处理逗号分隔的多选值
  if (typeof value === 'string' && value.includes(',')) {
    return value.split(',').map(v => allEnums.value[enumKey][v] || v).join(', ')
  }
  return allEnums.value[enumKey][value] || value
}
```

将原本直接展示 `prop` 的 `<el-table-column>` 改造为使用插槽和 `getEnumLabel` 回显文案：
```html
<!-- 改造前 -->
<el-table-column label="状态" align="center" prop="status" />

<!-- 改造后 -->
<el-table-column label="状态" align="center" prop="status">
  <template #default="scope">
    {{ getEnumLabel('RuleStatus', scope.row.status) }}
  </template>
</el-table-column>
```

### 3.3 改造表单组件 (el-select / el-radio-group)

将硬编码或旧字典的 `<el-option>` / `<el-radio>` 替换为动态遍历 `allEnums`。
**el-select 示例：**
```html
<el-select v-model="formData.status" placeholder="请选择状态">
  <el-option v-for="(label, value) in allEnums.RuleStatus" :key="value" :label="label" :value="value" />
</el-select>
```

**el-radio-group 示例：**
```html
<el-radio-group v-model="formData.status">
  <el-radio v-for="(label, value) in allEnums.RuleStatus" :key="value" :value="value">
    {{ label }}
  </el-radio>
</el-radio-group>
```

## 4. 验证与总结

1. 确保所有相关的 `SearchReplace` 均成功执行。
2. 确保 `getEnumLabel` 没有语法错误，且 `allEnums` 被正确赋值。
3. 向用户汇报修改结果，并询问是否需要对其他文件进行同样的改造。
