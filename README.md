# Management System Database

Day la repo duoc chuan bi de phat trien du an `He thong quan ly quan ca phe`.

Du an huong toi viec xay dung mot ung dung quan ly tong the cho quan ca phe, ket hop van hanh tai quay, theo doi nhan su, quan ly kho, tai chinh va bao cao kinh doanh trong cung mot he thong. Giao dien tham chieu cua du an duoc doc tu bo UI `Coffee Shop Management App UI (Community)` va cho thay pham vi nghiep vu kha day du cho mo hinh quan ca phe quy mo nho den vua.

## Muc tieu du an

He thong duoc xay dung de giai quyet cac bai toan van hanh chinh trong quan ca phe:

- Quan ly dang nhap va phan quyen theo vai tro.
- Ho tro goi mon, xu ly don tai quan va don online.
- Quan ly hoa don, dong tien theo ca va quy trinh thanh toan.
- Theo doi ban, menu, khuyen mai va trai nghiem khach hang.
- Quan ly kho nguyen lieu, thiet bi va nha cung cap.
- Quan ly nhan vien, lich lam, cham cong va phe duyet cham cong.
- Theo doi tai chinh, loi nhuan va bao cao kinh doanh.
- Thu thap danh gia khach hang de cai thien dich vu.

## Vai tro chinh trong he thong

Theo bo UI tham chieu, he thong duoc to chuc quanh 3 nhom nguoi dung chinh:

- `Manager`: quan ly cua hang, kho, nhan vien, nha cung cap, tai chinh, khuyen mai, bao cao va danh gia khach hang.
- `POS`: may POS tai quay, phuc vu goi mon, xu ly don tai quan, don online, hoa don, menu, khuyen mai va phan hoi van hanh.
- `Staff`: nhan vien thao tac cham cong, xem lich lam, xu ly hoa don cuoi ca va gui bao cao noi bo.

Ngoai ra bo UI con the hien 2 luong mo rong:

- `Invoice demo`: hien thi hoa don kem QR.
- `Feedback demo`: nhan danh gia tu khach hang.

## Cac phan he nghiep vu du kien

Tu bo UI tham chieu, repo nay dang duoc chuan bi cho cac phan he sau:

- `Xac thuc va phan quyen`: dang nhap theo vai tro, xu ly quen mat khau, tach quyen manager / staff / pos.
- `Ban hang tai quay`: giao dien POS, goi mon, cap nhat trang thai don, xu ly hoa don theo ca.
- `Don hang online`: nhap va theo doi don den tu kenh truc tuyen.
- `Quan ly menu`: cap nhat mon, gia, trang thai phuc vu.
- `Quan ly ban va khong gian`: floor management, tinh trang ban, suc chua va phan bo khu vuc.
- `Quan ly kho`: nguyen lieu, muc ton, canh bao thieu hang.
- `Quan ly thiet bi`: theo doi trang thai may moc va bao tri.
- `Quan ly nha cung cap`: thong tin nha cung cap, cong no, lich su nhap hang.
- `Nhan su`: ho so nhan vien, lich lam, cham cong, phe duyet cham cong.
- `Tai chinh`: doanh thu, chi phi, loi nhuan, bien loi nhuan.
- `Bao cao`: bao cao ban hang, dong tien, nguyen lieu, hieu suat.
- `Khuyen mai`: thiet lap va quan ly chuong trinh uu dai.
- `Danh gia khach hang`: tiep nhan phan hoi ve dich vu, mon an va khong gian.

## Dinh huong trien khai trong repo

Repo duoc sap xep theo huong tach ro `frontend` va `backend`, de sau nay co the phat trien mo rong ma van giu duoc nghiep vu sach:

- `frontend`: giao dien React va Electron desktop shell.
- `backend`: API, nghiep vu, database va cac script van hanh.
- `shared`: type va constant dung chung giua cac phan.

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

- `.env.example`: file mau cho bien moi truong nhu database, port va che do chay.
- `.eslintrc.js`: cau hinh lint cho TypeScript va React.
- `.gitignore`: bo qua file sinh ra trong qua trinh dev/build.
- `package.json`: khai bao dependency, npm scripts, Electron entry va cau hinh package.
- `package-lock.json`: khoa version dependency de moi may cai dat giong nhau.
- `tsconfig.json`: cau hinh TypeScript chung cho frontend.
- `tsconfig.main.json`: cau hinh TypeScript cho Electron main/preload.
- `tsconfig.api.json`: cau hinh TypeScript cho backend API.
- `vite.config.ts`: cau hinh build frontend bang Vite.

## Nhiem vu cac folder trong `app/src/`

- `frontend/web`: ung dung giao dien chinh cho he thong.
- `frontend/desktop`: Electron main process va preload bridge.
- `frontend/ui-reference`: bo UI tham chieu duoc dua vao de doi chieu va trich xuat man hinh/luong nghiep vu.
- `backend/domain`: entity, value object va business rules.
- `backend/application`: use case va service dieu phoi nghiep vu.
- `backend/infrastructure`: ket noi database, schema va adapter ky thuat.
- `backend/presentation`: Express API, routes, controllers, middleware.
- `backend/scripts`: migrate, seed, reset database.
- `shared`: types va constants dung chung.

## Quy tac dat file moi

- Man hinh UI moi: dat trong `app/src/frontend/web`.
- Electron main/preload: dat trong `app/src/frontend/desktop`.
- API route/controller: dat trong `app/src/backend/presentation/api`.
- Logic nghiep vu: dat trong `app/src/backend/application` hoac `app/src/backend/domain`.
- Database va adapter: dat trong `app/src/backend/infrastructure`.
- Script database: dat trong `app/src/backend/scripts`.
- Types/constants dung chung: dat trong `app/src/shared`.

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

Muc tieu la bien repo nay thanh nen tang de trien khai day du he thong quan ly quan ca phe, tu giao dien van hanh den backend xu ly nghiep vu va du lieu.
