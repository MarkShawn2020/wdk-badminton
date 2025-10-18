#!/bin/bash

###############################################################################
# 开发环境快速设置脚本 - 五道口AI创业羽毛球俱乐部
#
# 用途: 在本地机器上快速设置开发环境
# 使用: bash scripts/setup-dev.sh
###############################################################################

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo ""
echo "🏸 五道口AI创业羽毛球俱乐部"
echo "   开发环境设置"
echo ""

# ========== 检查 Node.js ==========

log_info "检查 Node.js..."

if ! command -v node &> /dev/null; then
    log_error "Node.js 未安装。请访问 https://nodejs.org/ 下载安装"
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    log_error "Node.js 版本过低 ($(node -v))。需要 18 或更高版本"
fi

log_success "Node.js: $(node -v)"

# ========== 检查 pnpm ==========

log_info "检查 pnpm..."

if ! command -v pnpm &> /dev/null; then
    log_warning "pnpm 未安装，正在安装..."
    npm install -g pnpm
    log_success "pnpm 已安装"
fi

log_success "pnpm: $(pnpm -v)"

# ========== 安装依赖 ==========

log_info "安装项目依赖..."

cd "$PROJECT_DIR"
pnpm install

log_success "依赖安装完成"

# ========== 检查环境变量 ==========

log_info "检查环境变量..."

if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        log_info "创建 .env.local 文件..."
        cp .env.example .env.local
        log_success ".env.local 已创建"
        log_warning "请编辑 .env.local 文件，填入实际的配置信息"
    else
        log_warning ".env.example 不存在，跳过环境变量配置"
    fi
else
    log_success ".env.local 已存在"
fi

# ========== 检查数据库配置 ==========

log_info "检查数据库配置..."

if grep -q "DATABASE_URL" .env.local; then
    DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d'=' -f2)

    if [ -z "$DATABASE_URL" ] || [ "$DATABASE_URL" = "your-database-url" ]; then
        log_warning "DATABASE_URL 未配置"
        echo ""
        echo "请配置 PostgreSQL 数据库："
        echo ""
        echo "选项 1：使用本地 PostgreSQL"
        echo "  brew install postgresql (macOS)"
        echo "  sudo apt install postgresql (Ubuntu)"
        echo ""
        echo "选项 2：使用阿里云 RDS PostgreSQL"
        echo "  访问 https://www.aliyun.com/product/rds"
        echo ""
        echo "配置后，更新 .env.local 中的 DATABASE_URL"
        echo ""
        read -p "按回车键继续..."
    else
        log_success "DATABASE_URL 已配置"
    fi
else
    log_warning "DATABASE_URL 未在 .env.local 中找到"
fi

# ========== Prisma 设置 ==========

log_info "设置 Prisma..."

# 生成 Prisma Client
pnpm prisma generate

log_success "Prisma Client 已生成"

# 询问是否执行数据库迁移
echo ""
read -p "是否立即执行数据库迁移？(y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    log_info "执行数据库迁移..."
    pnpm prisma migrate dev --name init
    log_success "数据库迁移完成"

    # 询问是否填充示例数据
    read -p "是否填充示例数据？(y/n) " -n 1 -r
    echo ""

    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "填充示例数据..."
        # TODO: 创建 seed 脚本
        log_warning "seed 脚本尚未实现，请手动创建测试数据"
    fi
else
    log_info "跳过数据库迁移"
    log_warning "记得稍后运行: pnpm prisma migrate dev"
fi

# ========== 完成 ==========

echo ""
log_success "=========================================="
log_success "开发环境设置完成！"
log_success "=========================================="
echo ""
log_info "下一步："
echo "  1. 检查并编辑 .env.local 配置"
echo "  2. 运行 pnpm prisma studio 查看数据库"
echo "  3. 运行 pnpm dev 启动开发服务器"
echo "  4. 访问 http://localhost:3000"
echo ""
log_info "常用命令："
echo "  - pnpm dev              启动开发服务器"
echo "  - pnpm build            构建生产版本"
echo "  - pnpm prisma studio    打开数据库管理界面"
echo "  - pnpm lint             代码检查"
echo "  - pnpm check-type       类型检查"
echo ""
