#!/bin/bash

###############################################################################
# 自动化部署脚本 - 五道口AI创业羽毛球俱乐部
#
# 用途: 自动拉取代码、构建、迁移数据库、重启应用
# 使用: ./deployment/scripts/deploy.sh [production|staging]
###############################################################################

set -e  # 遇到错误立即退出
set -u  # 使用未定义变量时报错

# ========== 配置 ==========
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
ENVIRONMENT="${1:-production}"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ========== 函数定义 ==========

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

check_command() {
    if ! command -v "$1" &> /dev/null; then
        log_error "$1 未安装，请先安装: $2"
    fi
}

# ========== 前置检查 ==========

log_info "开始部署 - 环境: $ENVIRONMENT"
log_info "项目目录: $PROJECT_DIR"

# 检查必要命令
check_command "node" "https://nodejs.org/"
check_command "pnpm" "npm install -g pnpm"
check_command "pm2" "npm install -g pm2"
check_command "git" "apt install git"

# 检查环境文件
ENV_FILE="$PROJECT_DIR/.env.$ENVIRONMENT"
if [ ! -f "$ENV_FILE" ]; then
    log_error "环境文件不存在: $ENV_FILE"
fi

# ========== 备份当前版本 ==========

log_info "创建备份..."

BACKUP_DIR="$PROJECT_DIR/backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

# 备份当前构建文件
if [ -d "$PROJECT_DIR/.next" ]; then
    cp -r "$PROJECT_DIR/.next" "$BACKUP_DIR/"
    log_success "已备份 .next 目录"
fi

# 备份数据库（可选）
# pg_dump ... > "$BACKUP_DIR/database.sql"

# ========== 拉取最新代码 ==========

log_info "拉取最新代码..."

cd "$PROJECT_DIR"

# 检查是否有未提交的修改
if [ -n "$(git status --porcelain)" ]; then
    log_warning "检测到未提交的修改，请先提交或暂存"
    git status --short
    read -p "是否继续？(y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "部署已取消"
    fi
fi

# 拉取代码
if [ "$ENVIRONMENT" = "production" ]; then
    git pull origin main
else
    git pull origin develop
fi

CURRENT_COMMIT=$(git rev-parse --short HEAD)
log_success "代码已更新到: $CURRENT_COMMIT"

# ========== 安装依赖 ==========

log_info "安装依赖..."

# 使用缓存加速
pnpm install --frozen-lockfile --prefer-offline

log_success "依赖安装完成"

# ========== 数据库迁移 ==========

log_info "执行数据库迁移..."

# 加载环境变量
export $(cat "$ENV_FILE" | grep -v '^#' | xargs)

# 生成 Prisma Client
pnpm prisma generate

# 执行迁移（生产环境）
pnpm prisma migrate deploy

log_success "数据库迁移完成"

# ========== 构建应用 ==========

log_info "构建应用..."

# 清理旧构建
rm -rf "$PROJECT_DIR/.next"

# 构建
pnpm build

if [ ! -d "$PROJECT_DIR/.next" ]; then
    log_error "构建失败，.next 目录不存在"
fi

log_success "构建完成"

# ========== 重启应用 ==========

log_info "重启应用..."

# PM2 重载（零停机）
if pm2 describe wdk-badminton > /dev/null 2>&1; then
    pm2 reload wdk-badminton --update-env
    log_success "应用已重载"
else
    pm2 start ecosystem.config.js --env "$ENVIRONMENT"
    pm2 save
    log_success "应用已启动"
fi

# 等待应用启动
sleep 5

# 检查应用状态
if ! pm2 describe wdk-badminton | grep -q "online"; then
    log_error "应用启动失败，请检查日志: pm2 logs wdk-badminton"
fi

# ========== 健康检查 ==========

log_info "健康检查..."

# 等待应用完全启动
sleep 3

# 检查应用是否响应
if curl -f -s http://localhost:3000/api/health > /dev/null; then
    log_success "应用健康检查通过"
else
    log_warning "应用健康检查失败，请检查应用状态"
fi

# ========== 清理 ==========

log_info "清理旧备份..."

# 保留最近 5 个备份
cd "$PROJECT_DIR/backups"
ls -t | tail -n +6 | xargs -I {} rm -rf {}

log_success "清理完成"

# ========== 完成 ==========

echo ""
log_success "=========================================="
log_success "部署完成！"
log_success "=========================================="
echo ""
log_info "环境: $ENVIRONMENT"
log_info "版本: $CURRENT_COMMIT"
log_info "时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""
log_info "有用的命令:"
echo "  - 查看日志: pm2 logs wdk-badminton"
echo "  - 查看状态: pm2 status"
echo "  - 重启应用: pm2 restart wdk-badminton"
echo "  - 停止应用: pm2 stop wdk-badminton"
echo ""
