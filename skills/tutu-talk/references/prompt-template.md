# 生图提示词模板

每张图单独生成。根据正文内容替换变量，不要把多张图拼在一起。

```text
Generate one standalone 16:9 horizontal Chinese article illustration.

Visual DNA:
White-background dominant, with a light green grass patch at the bottom or local area — color block only, no grass blade lines. Simple single-line hand-drawn doodle style, cartoon sketch feel, low-complexity children's doodle texture. Slightly wobbly pen lines. Clean and warm. Sparse handwritten Chinese annotations in light green / orange / light blue. No gradients, no shadows, no textures. No commercial vector style, no PPT infographic look, no dark/absurd aesthetic.

Recurring IP character required:
突突 (Tutu), a light beige  single-color dog with a round head, droopy semi-circle ears, short thick limbs, and a simplified puffy tail. Minimal detail. Happy warm expression with black dot eyes. Black outline only — single flat color fill, no shading. Tutu may optionally wear a light blue  harness or collar. Tutu must perform the core action of the scene, not just sit there as decoration. Make Tutu warm, curious, playful, and childlike.

Theme:
{正文配图主题}

Structure type:
{结构类型：Workflow / 系统局部 / 前后对比 / 角色状态 / 概念隐喻 / 方法分层 / 地图路线 / 小漫画分镜}

Core idea:
{这张图要表达的核心意思}

Composition:
{具体画面：突突在哪里、正在做什么、主要物件是什么、信息如何流动}

Suggested elements:
{element1} / {element2} / {element3} / {element4}

Chinese handwritten labels:
{标注词1} / {标注词2} / {标注词3} / {标注词4} / {可选标注词5}

Color use:
Black for main outlines, dog contours, and primary text. Light beige  for Tutu's body — single flat color, no shading. Light green patch for grass or local accent. Light green for primary label annotations. Orange  for key highlights, important labels, and path arrows. Light blue  for secondary notes, optional Tutu accessories. No red. No dark tones.

Constraints:
One image explains only one core structure. Keep the main subject around 40%-60% of the canvas. Leave enough blank space. Use at most 5-8 short handwritten Chinese labels. Do not write a title in the top-left corner. Do not write the structure type on the image. Do not make it a formal diagram, course slide, or dense explainer. Must be childlike, warm, simple, and clean — like a cute doodle on paper. No dark, absurd, or minimalist-product-sketch aesthetics.

CRITICAL — Color code text ban:
Hex color codes must NEVER appear as visible text or labels in the generated image. The hex codes above are instructions for the model's color selection only — do NOT render them as text on the illustration. All handwritten labels on the image must be meaningful Chinese words or short phrases only.
```

## 图像编辑提示

去掉左上角标题：

```text
Edit the provided image. Remove only the handwritten title "{要删除的文字}" and its underline from the top-left corner. Fill that area with clean white background matching the surrounding area. Preserve everything else exactly: Tutu the dog, labels, paths, line style, composition, aspect ratio, and image quality. Do not add any new text or objects.
```

增强童趣感：

```text
Regenerate this illustration with the same core meaning and simple layout, but make Tutu more central to the action. Tutu should be actively participating in the scene — sniffing, carrying, watching, or running. Make it warmer, more playful, and more childlike. Keep it simple, single-line doodle style, light green grass patch, and light beige dog.
```
