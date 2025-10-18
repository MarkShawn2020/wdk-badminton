#!/bin/bash

###############################################################################
# 服务器初始化脚本 - 五道口AI创业羽毛球俱乐部
#
# 用途: 在新的Ubuntu/Debian服务器上安装所有必要软件
# 使用: sudo bash deployment/scripts/setup-server.sh
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

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then
    log_error "请使用 sudo 运行此脚本"
fi

log_info "开始服务器初始化..."

# ========== 系统更新 ==========

log_info "更新系统包..."
apt update && apt upgrade -y
log_success "系统包已更新"

# ========== 安装基础工具 ==========

log_info "安装基础工具..."
apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    unzip \
    build-essential \
    ca-certificates \
    gnupg \
    lsb-release

log_success "基础工具已安装"

# ========== 安装 Node.js 18 ==========

log_info "安装 Node.js 18..."

if command -v node &> /dev/null; then
    log_info "Node.js 已安装: $(node --version)"
else
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    log_success "Node.js 已安装: $(node --version)"
fi

# ========== 安装 pnpm ==========

log_info "安装 pnpm..."

if command -v pnpm &> /dev/null; then
    log_info "pnpm 已安装: $(pnpm --version)"
else
    npm install -g pnpm
    log_success "pnpm 已安装: $(pnpm --version)"
fi

# ========== 安装 PM2 ==========

log_info "安装 PM2..."

if command -v pm2 &> /dev/null; then
    log_info "PM2 已安装: $(pm2 --version)"
else
    npm install -g pm2
    pm2 startup systemd -u $SUDO_USER --hp /home/$SUDO_USER
    log_success "PM2 已安装: $(pm2 --version)"
fi

# ========== 安装 Nginx ==========

log_info "安装 Nginx..."

if command -v nginx &> /dev/null; then
    log_info "Nginx 已安装: $(nginx -v 2>&1)"
else
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    log_success "Nginx 已安装: $(nginx -v 2>&1)"
fi

# ========== 安装 Certbot（Let's Encrypt）==========

log_info "安装 Certbot..."

if command -v certbot &> /dev/null; then
    log_info "Certbot 已安装: $(certbot --version)"
else
    apt install -y certbot python3-certbot-nginx
    log_success "Certbot 已安装"
fi

# ========== 安装 PostgreSQL 客户端 ==========

log_info "安装 PostgreSQL 客户端..."

if command -v psql &> /dev/null; then
    log_info "PostgreSQL 客户端已安装: $(psql --version)"
else
    apt install -y postgresql-client
    log_success "PostgreSQL 客户端已安装"
fi

# ========== 配置防火墙 ==========

log_info "配置防火墙..."

if command -v ufw &> /dev/null; then
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    ufw --force enable
    log_success "防火墙已配置"
else
    log_info "UFW 未安装，跳过防火墙配置"
fi

# ========== 创建项目目录 ==========

log_info "创建项目目录..."

mkdir -p /var/www
chown -R $SUDO_USER:$SUDO_USER /var/www

log_success "项目目录已创建: /var/www"

# ========== 配置 swap（可选）==========

log_info "检查 swap..."

if [ $(swapon --show | wc -l) -eq 0 ]; then
    log_info "创建 2GB swap..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    log_success "Swap 已创建"
else
    log_info "Swap 已存在"
fi

# ========== 优化系统配置 ==========

log_info "优化系统配置..."

# 增加文件描述符限制
cat >> /etc/security/limits.conf << EOF
* soft nofile 65536
* hard nofile 65536
EOF

# 优化网络参数
cat >> /etc/sysctl.conf << EOF
net.ipv4.tcp_fin_timeout = 30
net.ipv4.tcp_keepalive_time = 1200
net.core.somaxconn = 4096
EOF
sysctl -p

log_success "系统配置已优化"

# ========== 完成 ==========

echo ""
log_success "=========================================="
log_success "服务器初始化完成！"
log_success "=========================================="
echo ""
log_info "已安装的软件:"
echo "  - Node.js: $(node --version)"
echo "  - pnpm: $(pnpm --version)"
echo "  - PM2: $(pm2 --version)"
echo "  - Nginx: $(nginx -v 2>&1 | cut -d'/' -f2)"
echo "  - Certbot: $(certbot --version | head -n1)"
echo "  - PostgreSQL Client: $(psql --version)"
echo ""
log_info "下一步:"
echo "  1. 克隆项目代码到 /var/www"
echo "  2. 配置环境变量 (.env.production)"
echo "  3. 配置 Nginx (/etc/nginx/sites-available/wdk-badminton)"
echo "  4. 获取 SSL 证书 (certbot --nginx -d your-domain.com)"
echo "  5. 运行部署脚本 (./deployment/scripts/deploy.sh production)"
echo ""
