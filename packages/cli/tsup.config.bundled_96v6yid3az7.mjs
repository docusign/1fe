// tsup.config.ts
import { copy } from "esbuild-plugin-copy";
import { raw } from "esbuild-raw-plugin";
import { defineConfig as defineConfig2 } from "tsup";

// ../../tsup.config.base.ts
import { defineConfig } from "tsup";
var baseConfig = defineConfig({
  // keep test files from output
  // keep all transpiled files to dist, this helps with deep imports
  entry: ["src/index.ts"],
  // clean output directory before each build
  clean: true,
  dts: true,
  treeshake: true
  // by default tsup will exclude monorepo dependencies
  // but we wish to bundle them
  // noExternal: [/@1fe/],
  // noExternal: [/(.*)/],
});

// tsup.config.ts
var tsup_config_default = defineConfig2({
  ...baseConfig,
  entry: [
    "src/index.ts",
    // required by 1fe-app
    "src/utils/externalsUtils.ts",
    // required by validate-pr command and passed to danger.js to execute
    "src/commands/validate-pr/danger-plugin/dangerfiles/dangerfile-init.ts",
    "src/commands/validate-pr/danger-plugin/dangerfiles/dangerfile-refresh.ts",
    "src/commands/validate-pr/danger-plugin/TempAzureDevopsCIProvider.ts",
    // required for consumers of 1fe to import validate-pr checks for customization
    "src/validate-pr.ts",
    // THIS IS USED BY EDGE WORKER TESTS
    "src/commands/edge-worker/jest.edge-worker.config.ts"
  ],
  format: ["cjs"],
  target: "es2022",
  shims: true,
  esbuildPlugins: [
    copy({
      // DO NOT REMOVE
      // THIS IS HOW PLUGINS/WIDGETS SHARE THE SAME .browserslistrc
      resolveFrom: "cwd",
      assets: {
        from: [".browserslistrc"],
        to: ["./dist/.browserslistrc"]
      }
    }),
    raw({
      textExtensions: [".ejs"]
    })
  ]
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiLCAiLi4vLi4vdHN1cC5jb25maWcuYmFzZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX19pbmplY3RlZF9maWxlbmFtZV9fID0gXCIvVXNlcnMvbHVrZS5oYXRjaGVyL2RzL2Rldi1odWIvcGFja2FnZXMvY2xpL3RzdXAuY29uZmlnLnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIi9Vc2Vycy9sdWtlLmhhdGNoZXIvZHMvZGV2LWh1Yi9wYWNrYWdlcy9jbGlcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL1VzZXJzL2x1a2UuaGF0Y2hlci9kcy9kZXYtaHViL3BhY2thZ2VzL2NsaS90c3VwLmNvbmZpZy50c1wiO2ltcG9ydCB7IGNvcHkgfSBmcm9tICdlc2J1aWxkLXBsdWdpbi1jb3B5JztcbmltcG9ydCB7IHJhdyB9IGZyb20gJ2VzYnVpbGQtcmF3LXBsdWdpbic7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd0c3VwJztcbmltcG9ydCB7IGJhc2VDb25maWcgfSBmcm9tICcuLi8uLi90c3VwLmNvbmZpZy5iYXNlJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgLi4uYmFzZUNvbmZpZyxcbiAgZW50cnk6IFtcbiAgICAnc3JjL2luZGV4LnRzJyxcblxuICAgIC8vIHJlcXVpcmVkIGJ5IDFmZS1hcHBcbiAgICAnc3JjL3V0aWxzL2V4dGVybmFsc1V0aWxzLnRzJyxcblxuICAgIC8vIHJlcXVpcmVkIGJ5IHZhbGlkYXRlLXByIGNvbW1hbmQgYW5kIHBhc3NlZCB0byBkYW5nZXIuanMgdG8gZXhlY3V0ZVxuICAgICdzcmMvY29tbWFuZHMvdmFsaWRhdGUtcHIvZGFuZ2VyLXBsdWdpbi9kYW5nZXJmaWxlcy9kYW5nZXJmaWxlLWluaXQudHMnLFxuICAgICdzcmMvY29tbWFuZHMvdmFsaWRhdGUtcHIvZGFuZ2VyLXBsdWdpbi9kYW5nZXJmaWxlcy9kYW5nZXJmaWxlLXJlZnJlc2gudHMnLFxuICAgICdzcmMvY29tbWFuZHMvdmFsaWRhdGUtcHIvZGFuZ2VyLXBsdWdpbi9UZW1wQXp1cmVEZXZvcHNDSVByb3ZpZGVyLnRzJyxcblxuICAgIC8vIHJlcXVpcmVkIGZvciBjb25zdW1lcnMgb2YgMWZlIHRvIGltcG9ydCB2YWxpZGF0ZS1wciBjaGVja3MgZm9yIGN1c3RvbWl6YXRpb25cbiAgICAnc3JjL3ZhbGlkYXRlLXByLnRzJyxcblxuICAgIC8vIFRISVMgSVMgVVNFRCBCWSBFREdFIFdPUktFUiBURVNUU1xuICAgICdzcmMvY29tbWFuZHMvZWRnZS13b3JrZXIvamVzdC5lZGdlLXdvcmtlci5jb25maWcudHMnLFxuICBdLFxuICBmb3JtYXQ6IFsnY2pzJ10sXG4gIHRhcmdldDogJ2VzMjAyMicsXG4gIHNoaW1zOiB0cnVlLFxuICBlc2J1aWxkUGx1Z2luczogW1xuICAgIGNvcHkoe1xuICAgICAgLy8gRE8gTk9UIFJFTU9WRVxuICAgICAgLy8gVEhJUyBJUyBIT1cgUExVR0lOUy9XSURHRVRTIFNIQVJFIFRIRSBTQU1FIC5icm93c2Vyc2xpc3RyY1xuICAgICAgcmVzb2x2ZUZyb206ICdjd2QnLFxuICAgICAgYXNzZXRzOiB7XG4gICAgICAgIGZyb206IFsnLmJyb3dzZXJzbGlzdHJjJ10sXG4gICAgICAgIHRvOiBbJy4vZGlzdC8uYnJvd3NlcnNsaXN0cmMnXSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAgcmF3KHtcbiAgICAgIHRleHRFeHRlbnNpb25zOiBbJy5lanMnXSxcbiAgICB9KSxcbiAgXSxcbn0pO1xuIiwgImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL1VzZXJzL2x1a2UuaGF0Y2hlci9kcy9kZXYtaHViL3RzdXAuY29uZmlnLmJhc2UudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL1VzZXJzL2x1a2UuaGF0Y2hlci9kcy9kZXYtaHViXCI7Y29uc3QgX19pbmplY3RlZF9pbXBvcnRfbWV0YV91cmxfXyA9IFwiZmlsZTovLy9Vc2Vycy9sdWtlLmhhdGNoZXIvZHMvZGV2LWh1Yi90c3VwLmNvbmZpZy5iYXNlLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndHN1cCc7XG5cbi8vIGh0dHBzOi8vdHN1cC5lZ29pc3QuZGV2L1xuZXhwb3J0IGNvbnN0IGJhc2VDb25maWcgPSBkZWZpbmVDb25maWcoe1xuICAvLyBrZWVwIHRlc3QgZmlsZXMgZnJvbSBvdXRwdXRcbiAgLy8ga2VlcCBhbGwgdHJhbnNwaWxlZCBmaWxlcyB0byBkaXN0LCB0aGlzIGhlbHBzIHdpdGggZGVlcCBpbXBvcnRzXG4gIGVudHJ5OiBbJ3NyYy9pbmRleC50cyddLFxuICAvLyBjbGVhbiBvdXRwdXQgZGlyZWN0b3J5IGJlZm9yZSBlYWNoIGJ1aWxkXG4gIGNsZWFuOiB0cnVlLFxuICBkdHM6IHRydWUsXG4gIHRyZWVzaGFrZTogdHJ1ZSxcbiAgLy8gYnkgZGVmYXVsdCB0c3VwIHdpbGwgZXhjbHVkZSBtb25vcmVwbyBkZXBlbmRlbmNpZXNcbiAgLy8gYnV0IHdlIHdpc2ggdG8gYnVuZGxlIHRoZW1cbiAgLy8gbm9FeHRlcm5hbDogWy9AMWZlL10sXG4gIC8vIG5vRXh0ZXJuYWw6IFsvKC4qKS9dLFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStRLFNBQVMsWUFBWTtBQUNwUyxTQUFTLFdBQVc7QUFDcEIsU0FBUyxnQkFBQUEscUJBQW9COzs7QUNGcU4sU0FBUyxvQkFBb0I7QUFHeFEsSUFBTSxhQUFhLGFBQWE7QUFBQTtBQUFBO0FBQUEsRUFHckMsT0FBTyxDQUFDLGNBQWM7QUFBQTtBQUFBLEVBRXRCLE9BQU87QUFBQSxFQUNQLEtBQUs7QUFBQSxFQUNMLFdBQVc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUtiLENBQUM7OztBRFZELElBQU8sc0JBQVFDLGNBQWE7QUFBQSxFQUMxQixHQUFHO0FBQUEsRUFDSCxPQUFPO0FBQUEsSUFDTDtBQUFBO0FBQUEsSUFHQTtBQUFBO0FBQUEsSUFHQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUE7QUFBQSxJQUdBO0FBQUE7QUFBQSxJQUdBO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUSxDQUFDLEtBQUs7QUFBQSxFQUNkLFFBQVE7QUFBQSxFQUNSLE9BQU87QUFBQSxFQUNQLGdCQUFnQjtBQUFBLElBQ2QsS0FBSztBQUFBO0FBQUE7QUFBQSxNQUdILGFBQWE7QUFBQSxNQUNiLFFBQVE7QUFBQSxRQUNOLE1BQU0sQ0FBQyxpQkFBaUI7QUFBQSxRQUN4QixJQUFJLENBQUMsd0JBQXdCO0FBQUEsTUFDL0I7QUFBQSxJQUNGLENBQUM7QUFBQSxJQUNELElBQUk7QUFBQSxNQUNGLGdCQUFnQixDQUFDLE1BQU07QUFBQSxJQUN6QixDQUFDO0FBQUEsRUFDSDtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbImRlZmluZUNvbmZpZyIsICJkZWZpbmVDb25maWciXQp9Cg==
