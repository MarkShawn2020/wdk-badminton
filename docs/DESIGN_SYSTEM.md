# ReelVan Design System

> 基于 Claude 官网设计指南构建的专业设计系统

**版本**: 1.0.1
**最后更新**: 2025-10-09
**主色调**: #CC785C (Brand Terracotta)

---

## 🎨 色彩系统

### 主色调 (Primary)

ReelVan 的品牌色采用温暖的赤陶色（Terracotta），传达温暖、专业、可信赖的感觉。

```css
--color-primary-500: oklch(0.61 0.133 35.5); /* #CC785C */
```

**完整色阶**: 50-950 (从最浅到最深)

**色彩特性**:

- **Hex**: #CC785C
- **OKLCH**: L=0.61, C=0.133, H=35.5°
- **色相**: 温暖的橙棕色调
- **饱和度**: 中等饱和度，易于阅读
- **亮度**: 适中亮度，WCAG AA 友好

### 语义化颜色

#### 文本颜色

- `text-main`: #181818 (主要文本)
- `text-faded`: #87867F (次要文本)
- `text-inverse`: #FFFFFF (反色文本，用于深色背景)

#### 背景颜色

- `bg-main`: #F9F9F7 (主背景)
- `bg-ivory`: #F0EEE6 (象牙白背景，柔和分区)
- `bg-oat`: #F7F4EC (燕麦色背景，温暖分区)
- `bg-dark`: #141413 (深色主题背景)
- `bg-faded`: #3D3D3A (暗色背景)

### Swatch 调色板

用于 feature highlights 和图标着色：

| 名称    | 颜色值  | 用途         |
| ------- | ------- | ------------ |
| Fig     | #B49FD8 | 紫色调特性   |
| Olive   | #C2C07D | 黄绿色调特性 |
| Cactus  | #629A90 | 青绿色调特性 |
| Sky     | #97B5D5 | 蓝色调特性   |
| Heather | #D2BEDF | 淡紫色调特性 |

---

## 📏 间距系统

遵循 Claude 设计指南的间距标准：

```css
--spacing-text: 1rem; /* 文本元素间距 */
--spacing-gutter: 2rem; /* 栅栏间距 */
--spacing-s: 1rem; /* 小间距 */
--spacing-m: 1.5rem; /* 中间距 */
--spacing-l: 3rem; /* 大间距 */
--spacing-xl: 4rem; /* 超大间距 */
--spacing-xxl: 6rem; /* 巨大间距 */
```

**Tailwind 映射**:

- `gap-4` → spacing-s
- `gap-6 lg:gap-8` → spacing-m (响应式)
- `gap-12` → spacing-l
- `gap-16` → spacing-xl

---

## 🔤 字体系统

### 字体家族

- **Sans-serif**: Space Grotesk (主要字体)
- **Monospace**: Consolas, Monaco (代码块)

### 排版层级

| 元素       | 类名                   | 字号    | 字重 | 用途      |
| ---------- | ---------------------- | ------- | ---- | --------- |
| H1         | `text-4xl lg:text-6xl` | 36-60px | 700  | Hero 标题 |
| H2         | `text-3xl lg:text-5xl` | 30-48px | 600  | 分区标题  |
| H3         | `text-2xl lg:text-3xl` | 24-30px | 600  | 子标题    |
| Body Large | `text-lg lg:text-xl`   | 18-20px | 400  | 引导段落  |
| Body       | `text-base`            | 16px    | 400  | 正文      |
| Small      | `text-sm`              | 14px    | 400  | 辅助文本  |

---

## 🧱 布局组件

### Section 组件

全宽分区容器，提供主题化背景和标准化间距。

```tsx
import { Section } from '@/components/layout'

;<Section theme="ivory" spacing="large">
  {/* 内容 */}
</Section>
```

**Props**:

- `theme`: `'light' | 'dark' | 'ivory' | 'oat'`
- `spacing`: `'default' | 'large' | 'hero'`

### Container 组件

水平居中容器，限制最大宽度。

```tsx
import { Container } from '@/components/layout'

;<Container size="default">{/* 内容 */}</Container>
```

**Props**:

- `size`: `'narrow' | 'default' | 'wide' | 'full'`
  - narrow: 896px (阅读优化)
  - default: 1280px (标准内容)
  - wide: 1440px (宽屏布局)
  - full: 100% (无限制)

### Grid 组件

12 列响应式网格系统。

```tsx
import { Grid } from '@/components/layout'

;<Grid gap="m">
  <div className="lg:col-span-6">{/* 左半 */}</div>
  <div className="lg:col-span-6">{/* 右半 */}</div>
</Grid>
```

**Props**:

- `gap`: `'s' | 'm' | 'l' | 'xl'`

---

## 🔘 Button 变体

### 标准变体

```tsx
import { Button } from '@/components/components/ui/button'

// Primary (默认)
<Button>Try ReelVan</Button>

// Claude-inspired Secondary
<Button variant="claude-secondary">Learn More</Button>

// Soft (柔和背景)
<Button variant="soft">View Pricing</Button>
```

### 所有变体

| 变体               | 描述       | 使用场景  |
| ------------------ | ---------- | --------- |
| `default`          | 品牌色背景 | 主要 CTA  |
| `claude-secondary` | 透明边框   | 次要操作  |
| `soft`             | 半透明背景 | 柔和操作  |
| `outline`          | 边框按钮   | 中性操作  |
| `ghost`            | 无背景     | 导航链接  |
| `destructive`      | 危险操作   | 删除/取消 |

---

## 🎯 使用示例

### 典型页面结构

```tsx
import { Section, Container, Grid } from '@/components/layout'
import { Button } from '@/components/components/ui/button'

export default function FeaturePage() {
  return (
    <>
      {/* Hero Section */}
      <Section theme="light" spacing="hero">
        <Container>
          <Grid>
            <div className="lg:col-span-6">
              <h1 className="text-text-main mb-6 text-4xl font-bold lg:text-6xl">
                Transform Your AI Videos
              </h1>
              <p className="text-text-faded mb-8 text-xl leading-relaxed">
                Professional video enhancement in seconds.
              </p>
              <div className="flex gap-4">
                <Button size="lg">Get Started</Button>
                <Button variant="claude-secondary" size="lg">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="lg:col-span-6">{/* Image/Video */}</div>
          </Grid>
        </Container>
      </Section>

      {/* Features Section */}
      <Section theme="ivory" spacing="large">
        <Container>
          <h2 className="mb-16 text-center text-3xl font-bold lg:text-5xl">Powerful Features</h2>
          <Grid gap="l">{/* Feature cards */}</Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section theme="dark" spacing="default">
        <Container className="text-center">
          <h2 className="mb-6 text-3xl font-bold lg:text-5xl">Ready to enhance your videos?</h2>
          <Button size="lg">Start Free Trial</Button>
        </Container>
      </Section>
    </>
  )
}
```

---

## 📐 响应式断点

遵循 Tailwind CSS 默认断点：

| 断点 | 最小宽度 | 设备   |
| ---- | -------- | ------ |
| sm   | 640px    | 大手机 |
| md   | 768px    | 平板   |
| lg   | 1024px   | 桌面   |
| xl   | 1280px   | 大屏幕 |
| 2xl  | 1536px   | 超大屏 |

**最佳实践**: 优先使用 `lg:` 前缀进行桌面适配。

---

## 🎨 设计原则

### 1. 留白是奢侈品

不要害怕空白。使用 `py-24 lg:py-32` 而不是 `py-8`。

### 2. 柔和的层次

善用 `bg-ivory` 和 `bg-oat` 创造视觉层次，而不是只用白色和黑色。

### 3. 微交互增加魅力

- 按钮有 `hover:scale-105` 效果
- 所有过渡使用 `duration-200`
- 保持动画流畅自然

### 4. 移动优先

始终从移动端开始设计，然后向上扩展到桌面。

---

## 🚀 快速开始

### 1. 使用布局组件

```bash
import { Section, Container, Grid } from '@/components/layout'
```

### 2. 使用语义化颜色

```tsx
<div className="bg-bg-ivory text-text-main">
  <p className="text-text-faded">Secondary text</p>
</div>
```

### 3. 使用 Claude 风格按钮

```tsx
<Button variant="claude-secondary">Learn More</Button>
```

---

## 📚 参考资源

- **设计指南**: `/Users/mark/projects/lovpen-web/docs/design-guide.md`
- **Tailwind 配置**: `css/tailwind.css`
- **组件源码**: `components/layout/`

---

## 🔄 版本历史

### v1.0.1 (2025-10-09)

- 🔧 修正主题色为 #CC785C (Terracotta)
- 🔧 更新所有 OKLCH 色阶值
- 🔧 更新移动端主题色配置

### v1.0.0 (2025-10-09)

- ✅ 初始化设计系统
- ✅ 添加语义化色彩系统
- ✅ 创建 Section/Container/Grid 组件
- ✅ 增强 Button 组件（Claude 风格）
- ✅ 标准化间距系统

---

**问题反馈**: 请在项目 Issues 中提出设计系统相关问题。
