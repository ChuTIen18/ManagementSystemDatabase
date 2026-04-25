# 📦 Public Folder

Chứa static assets cho ứng dụng - các file này sẽ được copy trực tiếp vào build output.

## Cấu trúc

### `assets/images/`
**Hình ảnh cho ứng dụng**
- Product images (ảnh sản phẩm)
- Marketing banners
- UI illustrations
- Background images
- Promotional graphics

**Formats**: JPG, PNG, SVG, WebP

### `assets/icons/`
**App icons và favicon**
- `icon.png` - App icon (1024x1024)
- `icon.ico` - Windows icon
- `icon.icns` - macOS icon
- `favicon.ico` - Browser favicon
- SVG icons cho UI

**Electron icon requirements:**
- Windows: .ico (256x256)
- macOS: .icns (512x512)
- Linux: .png (512x512)

### `assets/fonts/`
**Custom fonts**
- .ttf files
- .woff, .woff2 files
- Font families

**Example:**
```
fonts/
├── Roboto-Regular.ttf
├── Roboto-Bold.ttf
└── Roboto-Medium.ttf
```

## Sử dụng trong code

### Images
```tsx
// In React components
<img src="/assets/images/logo.png" alt="Logo" />
```

### Fonts
```css
/* In CSS */
@font-face {
  font-family: 'Roboto';
  src: url('/assets/fonts/Roboto-Regular.ttf');
}
```

## Optimization

### Images
- Nén images trước khi add vào project
- Use WebP format khi có thể
- Provide multiple sizes (responsive images)

### Icons
- Prefer SVG cho scalability
- Optimize SVG files (remove metadata)

### Fonts
- Use woff2 format (better compression)
- Load only fonts thực sự cần dùng

## Tools

- **Image compression**: TinyPNG, ImageOptim
- **Icon generation**: electron-icon-builder
- **Font conversion**: FontSquirrel
