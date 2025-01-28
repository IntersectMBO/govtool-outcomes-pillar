module.exports = {
    branches: [
      "main",
      {
        name: "beta",
        prerelease: true
      }
    ],
    plugins: [
      [
        "@semantic-release/commit-analyzer",
        {
          preset: "angular",
          releaseRules: [
            { type: "fix", release: "patch" },
            { type: "perf", release: "major" },
            { type: "feat", release: "minor" }
          ]
        }
      ],
      "@semantic-release/release-notes-generator",
      [
        "@semantic-release/npm",
        {
          npmPublish: true,
          tarballDir: "dist"
        }
      ],
      "@semantic-release/github"
    ]
  };