module.exports = {
  apps: [
    {
      name: 'zrsystem-backend',
      cwd: __dirname,
      script: 'dist/main/http/server.js',
      interpreter: 'node',
      exec_mode: 'fork',
      instances: 1,
      autorestart: true,
      watch: false,
      time: true,
      max_memory_restart: '512M',
      restart_delay: 5000,
      min_uptime: '10s',
      kill_timeout: 5000,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
