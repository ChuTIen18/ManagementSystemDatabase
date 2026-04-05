# 🧪 Tests Folder

Chứa tất cả test files cho ứng dụng.

## Cấu trúc

### `unit/`
**Unit Tests** - Test các function/component riêng lẻ
- Test các pure functions
- Test individual React components
- Test utility functions
- Không có dependencies bên ngoài

**Example:**
```javascript
// unit/utils/formatCurrency.test.js
test('formatCurrency formats number correctly', () => {
  expect(formatCurrency(25000)).toBe('25,000 ₫');
});
```

### `integration/`
**Integration Tests** - Test các modules tương tác với nhau
- Test API endpoints
- Test database operations
- Test service layers
- Test component interactions

**Example:**
```javascript
// integration/api/auth.test.js
test('POST /api/auth/login returns token', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ username: 'admin', password: 'admin123' });
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('token');
});
```

### `e2e/`
**End-to-End Tests** - Test toàn bộ user flows
- Test complete user journeys
- Test từ UI đến database
- Simulate real user behavior
- Use tools like Playwright, Cypress

**Example:**
```javascript
// e2e/login-flow.test.js
test('User can login and see dashboard', async () => {
  await page.goto('http://localhost:3000');
  await page.fill('[name=username]', 'admin');
  await page.fill('[name=password]', 'admin123');
  await page.click('button[type=submit]');
  await expect(page.locator('h1')).toContainText('Dashboard');
});
```

## Test Framework

Dự án sử dụng **Jest** làm test framework chính.

## Chạy tests

```bash
# Chạy tất cả tests
npm test

# Watch mode (tự động chạy lại khi file thay đổi)
npm run test:watch

# Chạy riêng unit tests
npm test -- unit/

# Chạy riêng integration tests
npm test -- integration/

# Chạy với coverage report
npm test -- --coverage
```

## Best Practices

1. **Đặt tên test rõ ràng**: Mô tả chính xác test case
2. **AAA Pattern**: Arrange → Act → Assert
3. **Isolate tests**: Mỗi test độc lập, không phụ thuộc nhau
4. **Clean up**: Xóa test data sau mỗi test
5. **Mock external dependencies**: API calls, database, etc.

## Coverage Goals

- **Unit tests**: ≥ 80% coverage
- **Integration tests**: Critical paths
- **E2E tests**: Main user flows
