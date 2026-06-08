# PocketBase MCP Server Notes

## Upstream Bug: `mrwyndham/pocketbase-mcp`

The `createRecord`, `listRecords`, `updateRecord`, and `deleteRecord` tool handlers are
missing the `authWithPassword` call that other handlers (like `createCollection`) have.
This means record CRUD operations silently fail because the PocketBase SDK is not
authenticated as admin.

**Affected methods in `src/index.ts`:**
- `createRecord()` — missing auth
- `listRecords()` — missing auth
- `updateRecord()` — missing auth
- `deleteRecord()` — missing auth

**Working methods that DO authenticate:**
- `createCollection()`, `updateCollection()`, `deleteCollection()` — all call
  `this.pb.collection("_superusers").authWithPassword(...)` before their operation.

**Local patch applied to bun cache:**
Each handler's `try` block now starts with:
```
await this.pb.collection("_superusers").authWithPassword(
  process.env.POCKETBASE_ADMIN_EMAIL ?? '',
  process.env.POCKETBASE_ADMIN_PASSWORD ?? ''
);
```

**To reapply after `bun install`:** run the fix script (not yet created)
**Upstream PR:** not yet submitted
