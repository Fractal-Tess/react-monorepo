export default {
  schema: {
    directory: "./schema",
    exclude: ["*.test.ts", "*.spec.ts"],
  },
  migrations: {
    directory: "./pb_migrations",
  },
  types: {
    directory: ".",
    filename: "pocketbase-types.ts",
  },
};
