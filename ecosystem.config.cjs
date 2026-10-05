module.exports = {
  apps: [
    {
      name: "wiradoor-sumbar",
      script: "dist/standalone/server.js",
      cwd: "/var/www/wiradoor-sumbar",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
