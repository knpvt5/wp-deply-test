module.exports = {
    apps: [
        {
            name: 'wealthpsychology-app',
            script: './server.js',
            instances: '4',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'development', // Default  development
            },
            env_production: {
                NODE_ENV: 'production',
            },
            max_memory_restart: '500M', 
            merge_logs: true, 
            // wait_ready: true,
        },
    ],
};
