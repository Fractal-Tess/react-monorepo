#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Ensure PocketBase is running
cd "$DIR"
mkdir -p pb_data
docker compose up --build -d 2>/dev/null

# Wait for PocketBase to be ready
for i in $(seq 1 10); do
  if curl -sf http://localhost:8090/api/health > /dev/null 2>&1; then
    break
  fi
  sleep 1
done

# Get admin token
TOKEN=$(curl -sf http://localhost:8090/api/collections/_superusers/auth-with-password \
  -H "Content-Type: application/json" \
  -d '{"identity":"vgfractal@gmail.com","password":"5MJm45$%a*!&8Y*O6LwpIaXr"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin).get('token',''))" 2>/dev/null)

export POCKETBASE_URL=http://localhost:8090
export POCKETBASE_ADMIN_TOKEN="$TOKEN"

exec bunx pocketbase-mcp
