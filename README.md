# Management System Database
## Cau truc tong quan

```text
ManagementSystemDatabase/
|-- README.md
`-- app/
    |-- .env.example
    |-- .eslintrc.js
    |-- .gitignore
    |-- package.json
    |-- package-lock.json
    |-- tsconfig.json
    |-- tsconfig.main.json
    |-- tsconfig.api.json
    |-- vite.config.ts
    `-- src/
        |-- frontend/
        |   |-- desktop/
        |   |-- web/
        |   `-- ui-reference/
        |-- backend/
        |   |-- domain/
        |   |-- application/
        |   |-- infrastructure/
        |   |-- presentation/
        |   `-- scripts/
        `-- shared/
```

## Nhiem vu cac file o `app/`

- `.env.example`: file mau cho bien moi truong. Copy thanh `.env` khi can cau hinh database, API port, mode chay.
- `.eslintrc.js`: cau hinh ESLint de kiem tra style va loi TypeScript/React.
- `.gitignore`: danh sach file/folder khong dua vao git, vi du `node_modules`, `dist`, file local.
- `package.json`: khai bao dependency, npm scripts, entry Electron, cau hinh build/package app.
- `package-lock.json`: khoa version dependency de cac may cai dat giong nhau.
- `tsconfig.json`: cau hinh TypeScript chung cho frontend React/Vite.
- `tsconfig.main.json`: cau hinh TypeScript rieng cho Electron main/preload va phan can build ra CommonJS.
- `tsconfig.api.json`: cau hinh TypeScript rieng cho backend API.
- `vite.config.ts`: cau hinh Vite cho React renderer, alias import va output build frontend.

## Nhiem vu cac folder trong `app/src/`

### `frontend/`

Chua tat ca code lien quan giao dien va desktop shell.

- `frontend/web/`: React renderer app. Dat component, page, hook, store, style cua UI chinh tai day.
- `frontend/web/renderer/index.html`: HTML entry cua Vite.
- `frontend/web/renderer/main.tsx`: entry React render vao DOM.
- `frontend/web/renderer/App.tsx`: component goc cua giao dien.
- `frontend/web/renderer/styles/`: CSS/style cho frontend.
- `frontend/desktop/`: Electron shell.
- `frontend/desktop/main/`: Electron main process, tao window va start API server noi bo.
- `frontend/desktop/preload/`: preload bridge giua Electron main va renderer.
- `frontend/ui-reference/`: code UI mau/prototype de tham khao hoac copy vao `frontend/web` khi can. Khong phai app chinh.

### `backend/`

Chua tat ca code xu ly nghiep vu, API va database.

- `backend/domain/`: entity, value object, business rules thuan. Khong import Express, React, Electron, Sequelize hay MySQL driver.
- `backend/application/`: use case va application services. Dieu phoi nghiep vu, goi domain, dinh nghia contract/port khi can.
- `backend/infrastructure/`: adapter ky thuat nhu database, external service, file system.
- `backend/infrastructure/database/config/`: cau hinh ket noi database.
- `backend/infrastructure/database/schemas/`: schema SQL, migration source.
- `backend/presentation/`: tang giao tiep voi client.
- `backend/presentation/api/`: Express server, routes, controllers, middleware.
- `backend/presentation/api/routes/`: dinh nghia endpoint.
- `backend/presentation/api/controllers/`: nhan request, goi use case/service, tra response.
- `backend/presentation/api/middleware/`: validation, error handler, not found handler.
- `backend/scripts/`: script thao tac database nhu migrate, seed, reset.

### `shared/`

Chua code dung chung giua frontend/backend.

- `shared/types/`: TypeScript types/interfaces dung chung.
- `shared/constants/`: hang so dung chung.

Luu y: `shared` khong nen import nguoc ve `frontend` hoac `backend/infrastructure`.

## Quy tac dat file moi

- UI React moi: dat trong `app/src/frontend/web/renderer`.
- Electron main/preload moi: dat trong `app/src/frontend/desktop`.
- API route/controller moi: dat trong `app/src/backend/presentation/api`.
- Logic nghiep vu moi: dat trong `app/src/backend/application` hoac `app/src/backend/domain`.
- Database config/schema/adapter moi: dat trong `app/src/backend/infrastructure`.
- Script database moi: dat trong `app/src/backend/scripts`.
- Type/constant dung chung: dat trong `app/src/shared`.

## Cach chay

```powershell
cd app
npm install
npm run dev
```

## Build

```powershell
cd app
npm run build
```

## Database scripts

```powershell
cd app
npm run migrate
npm run seed
npm run db:reset
```

## Nguyen tac phu thuoc

```text
frontend -> backend API contract
backend/presentation -> backend/application -> backend/domain
backend/infrastructure -> backend/application/domain
shared -> khong phu thuoc nguoc vao frontend/backend infrastructure
```

Muc tieu la giu domain nghiep vu sach, de test va it bi anh huong khi doi framework, database hoac UI.
