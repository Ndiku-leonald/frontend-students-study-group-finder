module.exports = {
  apps: [
    {
      name: "study-group-frontend",
      cwd: __dirname,
      script: "node_modules/react-scripts/bin/react-scripts.js",
      interpreter: "node",
      args: "start",
      env: {
        BROWSER: "none",
        PORT: "3001"
      }
    }
  ]
};
