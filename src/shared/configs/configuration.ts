
export default (): any => ({
  // 这里可以添加更多的配置项
  port: process.env.APP_PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DB_URL,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    synchronize: process.env.DB_SYNCHRONIZE,
    logging: process.env.DB_LOGGING
  },
});