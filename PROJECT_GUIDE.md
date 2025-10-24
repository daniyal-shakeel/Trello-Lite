# 🌍 Environment Variable Guide

## Overview
This project uses environment-specific configuration files to manage secrets and app settings.  
Instead of long names like `.env.development`, we use **short, consistent suffixes** for clarity and speed.

---

## 📂 Environment Files

| Environment  | File Name   | Description                            |
|--------------|-------------|----------------------------------------|
| Development  | `.env.dev`  | Used during local development.         |
| Production   | `.env.prod` | Used in live, deployed environments.   |
| Example      | `.env.exp`  | Example file for other developers      |

---

## ⚙️ NODE_ENV Values

Each `.env.*` file must include a `NODE_ENV` variable.  
We use **short identifiers** instead of verbose words.

```bash
# Example: .env.dev
NODE_ENV=dev
```

---
## 🔒 Port Configuration
**Do not change these ports in local environment**
- **Frontend:** `5173`
- **Backend:** `3000`

```bash
# .env.dev
VITE_PORT=5173
SERVER_PORT=3000
```