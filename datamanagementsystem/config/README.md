# ⚙️ Config Folder

Chứa các configuration files cho ứng dụng.

## Files (sẽ được tạo khi cần)

### `database.config.js`
Database connection configurations cho các môi trường khác nhau
```javascript
module.exports = {
  development: {
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'password',
    database: 'coffee_shop_dev',
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
};
```

### `app.config.js`
General app configurations
```javascript
module.exports = {
  app: {
    name: 'Coffee Shop Management',
    version: '1.0.0',
    port: 3001,
  },
  features: {
    enableQRCode: true,
    enableFeedback: true,
    enableReports: true,
  },
};
```

### `logger.config.js`
Winston logger configuration
```javascript
module.exports = {
  level: process.env.LOG_LEVEL || 'info',
  format: 'json',
  logDir: 'logs',
  maxFiles: 14,
  maxSize: '20m',
};
```

### `electron.config.js`
Electron-specific configurations
```javascript
module.exports = {
  window: {
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
  },
  devTools: process.env.NODE_ENV === 'development',
};
```

## Environment-based Config

Sử dụng package `dotenv` và `.env` files:

```
.env                  # Default (gitignored)
.env.example          # Template (committed)
.env.development      # Development settings
.env.production       # Production settings
.env.test             # Test settings
```

## Best Practices

1. **Separate concerns**: Mỗi config file cho một mục đích riêng
2. **Environment variables**: Sử dụng .env cho sensitive data
3. **Type safety**: Consider using TypeScript cho config files
4. **Validation**: Validate config khi app starts
5. **Documentation**: Comment rõ ràng từng config option

## Loading Config

```javascript
// Load config based on environment
const env = process.env.NODE_ENV || 'development';
const config = require(`./config/${env}.config.js`);
```

## Security

⚠️ **QUAN TRỌNG**:
- KHÔNG commit passwords, API keys vào git
- Sử dụng environment variables cho sensitive data
- Add config files chứa secrets vào .gitignore
- Use config template files (.example) trong git
