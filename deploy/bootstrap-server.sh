#!/usr/bin/env bash
set -euo pipefail

apt-get update
DEBIAN_FRONTEND=noninteractive apt-get install -y nginx nodejs npm certbot python3-certbot-nginx ufw fail2ban

id deploy >/dev/null 2>&1 || useradd --create-home --shell /bin/bash deploy
install -d -o deploy -g deploy -m 700 /home/deploy/.ssh
install -o deploy -g deploy -m 600 /tmp/mindresearch_deploy.pub /home/deploy/.ssh/authorized_keys
install -d -o deploy -g www-data -m 2750 /opt/mindresearch /opt/mindresearch/releases

install -o root -g root -m 644 /tmp/mindresearch.service /etc/systemd/system/mindresearch.service
install -o root -g root -m 644 /tmp/mindresearch.nginx /etc/nginx/sites-available/mindresearch
ln -sfn /etc/nginx/sites-available/mindresearch /etc/nginx/sites-enabled/mindresearch
rm -f /etc/nginx/sites-enabled/default

printf '%s\n' 'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart mindresearch, /usr/bin/systemctl reload nginx' >/etc/sudoers.d/mindresearch-deploy
chmod 440 /etc/sudoers.d/mindresearch-deploy

if [[ ! -f /etc/mindresearch.env ]]; then
  jwt_secret="$(openssl rand -hex 32)"
  cat >/etc/mindresearch.env <<EOF
PORT=4000
DB_HOST=10.16.0.2
DB_PORT=3306
DB_USER=mindresearch
DB_PASSWORD=CHANGE_ME
DB_NAME=mindresearch
JWT_SECRET=$jwt_secret
ADMIN_EMAIL=mgodagov@vk.com
ADMIN_PASSWORD=CHANGE_ME
CLIENT_URL=https://mindresearch.pw
EOF
  chmod 600 /etc/mindresearch.env
fi

systemctl daemon-reload
systemctl enable nginx mindresearch fail2ban
nginx -t
systemctl restart nginx

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo 'Bootstrap complete. Edit /etc/mindresearch.env before the first deployment.'
