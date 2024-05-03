#!/bin/bash

npx prisma@5.12.1 migrate deploy --schema ./apps/backend/schema.prisma
nginx
node ./apps/backend/main.js
