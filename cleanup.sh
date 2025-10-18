#!/bin/bash
# cleanup.sh - 自动清理 ReelVan 残留
# 五道口AI创业羽毛球俱乐部

set -e

echo "🧹 开始清理 ReelVan 残留..."
echo ""

# 1. 创建归档目录
echo "📁 创建归档目录..."
mkdir -p archive/reelvan-docs

# 2. 移动过时文档
echo "📄 移动过时文档..."
docs_to_archive=(
  "docs/PRD.md"
  "docs/VIDEO_PROCESSING_ARCHITECTURE.md"
  "docs/PIPELINE_IMPLEMENTATION.md"
  "docs/IMPLEMENTATION_COMPLETE.md"
  "docs/SETUP.md"
  "docs/README_VIDEO_FEATURE.md"
  "docs/SUPABASE_STORAGE_SETUP.md"
  "docs/HOMEPAGE_CONDITIONAL_RENDERING.md"
  "docs/DESIGN_SYSTEM.md"
  "docs/COMMIT_SUMMARY.md"
  "docs/QUICK_START_VIDEO.md"
  "docs/VIDEO_FEATURE_SUMMARY.md"
)

for doc in "${docs_to_archive[@]}"; do
  if [ -f "$doc" ]; then
    mv "$doc" archive/reelvan-docs/
    echo "  ✅ 已移动: $doc"
  fi
done

# 移动整个 feishu 目录
if [ -d "docs/feishu" ]; then
  mv docs/feishu archive/reelvan-docs/
  echo "  ✅ 已移动: docs/feishu/"
fi

# 3. 备份旧 README
echo ""
echo "📝 备份旧 README..."
if [ -f "README.md" ]; then
  cp README.md archive/reelvan-docs/README_old.md
  echo "  ✅ 已备份: README.md -> archive/reelvan-docs/README_old.md"
fi

# 4. 更新 .gitignore
echo ""
echo "📌 更新 .gitignore..."
if ! grep -q "^archive/" .gitignore 2>/dev/null; then
  echo "archive/" >> .gitignore
  echo "  ✅ 已添加 archive/ 到 .gitignore"
else
  echo "  ℹ️  archive/ 已在 .gitignore 中"
fi

# 5. 清理完成
echo ""
echo "✅ 清理完成！"
echo ""
echo "📊 清理统计："
echo "  - 已移动文档: ${#docs_to_archive[@]} 个"
echo "  - 归档目录: archive/reelvan-docs/"
echo ""
echo "⚠️  注意："
echo "  - 旧代码和API路由已保留（Phase 1不影响）"
echo "  - Phase 2 再逐步替换后端逻辑"
echo ""
echo "📝 下一步："
echo "  1. 创建新的 README.md（已准备模板）"
echo "  2. 更新 package.json"
echo "  3. 更新 .env.example"
echo "  4. 验证: pnpm dev"
echo ""
