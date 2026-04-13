import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiError, apiPost } from "../utils/api";
import { useAuthStore } from "../store/authStore";

type RoleId = "staff" | "pos" | "manager";

interface RoleOption {
  id: RoleId;
  label: string;
  description: string;
  icon: string;
  iconWidth: number;
  badgeIcon: string;
}

const ROLES: RoleOption[] = [
  {
    id: "staff",
    label: "Nhân viên",
    description: "Chấm công, xử lý hóa đơn, báo cáo",
    icon: "/assets/icons/user-group.svg",
    iconWidth: 21,
    badgeIcon: "/assets/icons/key-black.svg",
  },
  {
    id: "pos",
    label: "Máy POS",
    description: "Gọi món, đánh giá, hoạt động cửa hàng",
    icon: "/assets/icons/monitor.svg",
    iconWidth: 20.15625,
    badgeIcon: "/assets/icons/key-outline.svg",
  },
  {
    id: "manager",
    label: "Quản lý",
    description: "Quản lý kho, nhân viên, nhà cung cấp, tài chính",
    icon: "/assets/icons/coffee-manager.svg",
    iconWidth: 17.265625,
    badgeIcon: "/assets/icons/key-black.svg",
  },
];

function formatVietnameseTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const d = date.getDate();
  const mo = date.getMonth() + 1;
  const y = date.getFullYear();
  return `lúc ${h}:${m} ${d} tháng ${mo}, ${y}`;
}

interface RoleCardProps {
  role: RoleOption;
  onClick: (id: RoleId) => void;
}

function RoleCard({ role, onClick }: RoleCardProps) {
  return (
    <button
      onClick={() => onClick(role.id)}
      className="border-2 border-[#e5e7eb] rounded-[8.75px] px-4 pt-4 pb-[2px] w-full text-left flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors"
      aria-label={`Đăng nhập với vai trò ${role.label}`}
    >
      <div className="flex items-center gap-[10.5px]">
        <img
          src={role.icon}
          alt=""
          className="shrink-0"
          style={{ width: role.iconWidth, height: 21 }}
        />
        <div className="flex flex-col">
          <span className="text-[14px] font-medium leading-[21px] text-[#0a0a0a]">
            {role.label}
          </span>
          <span className="text-[12.25px] text-[#4a5565] leading-[17.5px] max-w-[210px]">
            {role.description}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-[7px] h-[19.5px] px-2 border border-black/10 rounded-[6.75px] shrink-0 ml-3">
        <img
          src={role.badgeIcon}
          alt=""
          style={{ width: 10.5, height: 10.5 }}
        />
        <span className="text-[10.5px] font-medium leading-[14px] text-[#0a0a0a]">
          Tài khoản
        </span>
      </div>
    </button>
  );
}

interface CredentialPillProps {
  bgClassName: string;
  textClassName: string;
  children: string;
}

function CredentialPill({
  bgClassName,
  textClassName,
  children,
}: CredentialPillProps) {
  return (
    <span
      className={`inline-flex items-center px-[7px] py-[3.5px] rounded-[3.5px] font-[Consolas] text-[12.25px] leading-[17.5px] ${bgClassName} ${textClassName}`}
    >
      {children}
    </span>
  );
}

interface CredentialLineProps {
  option: string;
  fieldLabel: string;
  value: string;
  password: string;
  pillBgClassName: string;
  pillTextClassName: string;
  stackPassword?: boolean;
}

function CredentialLine({
  option,
  fieldLabel,
  value,
  password,
  pillBgClassName,
  pillTextClassName,
  stackPassword,
}: CredentialLineProps) {
  return (
    <div className="text-[12.25px] text-[#4a5565] leading-[17.5px]">
      <div className="flex flex-wrap items-center gap-x-1">
        <span className="font-medium">{option}</span>
        <span className="font-normal">{` ${fieldLabel} `}</span>
        <CredentialPill
          bgClassName={pillBgClassName}
          textClassName={pillTextClassName}
        >
          {value}
        </CredentialPill>
        <span>{` | Mật khẩu: `}</span>
        {!stackPassword ? (
          <CredentialPill
            bgClassName={pillBgClassName}
            textClassName={pillTextClassName}
          >
            {password}
          </CredentialPill>
        ) : null}
      </div>
      {stackPassword ? (
        <div>
          <CredentialPill
            bgClassName={pillBgClassName}
            textClassName={pillTextClassName}
          >
            {password}
          </CredentialPill>
        </div>
      ) : null}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [currentTime, setCurrentTime] = useState(() =>
    formatVietnameseTime(new Date()),
  );
  const [selectedRole, setSelectedRole] = useState<RoleId | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const loginFormRef = useRef<HTMLDivElement | null>(null);
  const identifierInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = useMemo(() => {
    return Boolean(selectedRole && identifier && password) && !isSubmitting;
  }, [selectedRole, identifier, password, isSubmitting]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(formatVietnameseTime(new Date()));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const incomingIdentifier = searchParams.get("identifier");
    if (incomingIdentifier && !identifier) {
      setIdentifier(incomingIdentifier);
    }
  }, [searchParams, identifier]);

  function getLoginErrorMessage(err: unknown): string {
    const apiErr = err instanceof ApiError ? err : null;
    const code = apiErr?.code;

    if (code === "INVALID_CREDENTIALS") return "Sai tài khoản hoặc mật khẩu.";
    if (code === "ROLE_NOT_ALLOWED")
      return "Tài khoản không đúng vai trò đã chọn.";
    if (code === "USER_INACTIVE") return "Tài khoản đã bị khóa.";
    if (code === "VALIDATION_ERROR")
      return apiErr?.message || "Dữ liệu không hợp lệ.";

    return apiErr?.message || "Đăng nhập thất bại. Vui lòng thử lại.";
  }

  function Banner({
    type,
    message,
  }: {
    type: "success" | "error";
    message: string;
  }) {
    const classes =
      type === "success"
        ? "bg-green-50 border-green-200 text-green-800"
        : "bg-red-50 border-red-200 text-red-800";

    return (
      <div className={`border rounded-[8.75px] p-3 text-[12.25px] ${classes}`}>
        {message}
      </div>
    );
  }

  const handleRoleSelect = (role: RoleId) => {
    setIdentifier("");
    setPassword("");
    setBanner(null);
    setIsSubmitting(false);
    setSelectedRole(role);
    requestAnimationFrame(() => {
      loginFormRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      identifierInputRef.current?.focus();
    });
  };

  const selectedRoleOption = selectedRole
    ? ROLES.find((r) => r.id === selectedRole)
    : null;
  const isManagerLogin = selectedRole === "manager";

  return (
    <div
      className="min-h-screen flex items-center justify-center overflow-y-auto px-4 py-[14px]"
      style={{
        backgroundImage:
          "linear-gradient(147.44789421898707deg, #fffbeb 0%, #ffedd4 100%)",
      }}
    >
      <div
        className="w-full max-w-[392px] flex flex-col gap-[21px]"
        style={{ animation: "fadeIn 0.4s ease-out" }}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 rounded-full bg-[#e17100] flex items-center justify-center mb-1">
            <img
              src="/assets/icons/coffee-cup-logo.svg"
              alt="Coffee House logo"
              className="w-7 h-7 invert"
            />
          </div>

          <h1 className="text-[21px] font-medium text-[#101828] leading-tight">
            Coffee House
          </h1>
          <p className="text-sm text-[#4a5565]">Hệ thống quản lý quán cafe</p>

          <div
            className="flex items-center gap-[7px]"
            aria-live="polite"
            aria-atomic="true"
          >
            <img
              src="/assets/icons/clock.svg"
              alt=""
              className="w-3.5 h-3.5 opacity-60"
            />
            <span className="text-[12.25px] text-[#6a7282]">{currentTime}</span>
          </div>
        </div>

        <div className="bg-white rounded-[12.75px] border border-black/10 p-[22px] flex flex-col gap-[7px]">
          <p className="text-[12.25px] font-medium text-[#0a0a0a]">
            Chọn vai trò của bạn
          </p>
          <div className="flex flex-col gap-[7px]">
            {ROLES.map((role) => (
              <RoleCard key={role.id} role={role} onClick={handleRoleSelect} />
            ))}
          </div>
        </div>

        {selectedRoleOption ? (
          <div
            ref={loginFormRef}
            className="bg-white rounded-[12.75px] border border-black/10 p-[22px] flex flex-col gap-3"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col">
                <p className="text-[12.25px] font-medium text-[#0a0a0a]">
                  Đăng nhập với vai trò {selectedRoleOption.label}
                </p>
                <p className="text-[12.25px] text-[#6a7282]">
                  {isManagerLogin
                    ? "Dùng Gmail hoặc tài khoản quản lý"
                    : "Dùng username đã được cấp"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedRole(null);
                  setIdentifier("");
                  setPassword("");
                  setBanner(null);
                  setIsSubmitting(false);
                }}
                className="text-[12.25px] font-medium text-[#364153] hover:text-[#111827]"
              >
                Đổi vai trò
              </button>
            </div>

            {banner ? (
              <Banner type={banner.type} message={banner.message} />
            ) : null}

            <form
              className="flex flex-col gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setIsSubmitting(true);
                setBanner(null);
                try {
                  const result = await apiPost<{
                    success: true;
                    message: "LOGIN_SUCCESS";
                    data: {
                      token: string;
                      user: {
                        id: number;
                        username: string;
                        email: string;
                        role: "staff" | "pos" | "manager" | "admin";
                        fullName?: string | null;
                        isActive: boolean;
                      };
                    };
                  }>("/auth/login", {
                    identifier,
                    password,
                    role: selectedRoleOption.id,
                  });

                  setAuth({ token: result.data.token, user: result.data.user });
                  setBanner({
                    type: "success",
                    message: "Đăng nhập thành công.",
                  });
                } catch (err) {
                  setBanner({
                    type: "error",
                    message: getLoginErrorMessage(err),
                  });
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <label className="flex flex-col gap-1">
                <span className="text-[12.25px] font-medium text-[#364153]">
                  {isManagerLogin ? "Gmail / Email" : "Username"}
                </span>
                <input
                  ref={identifierInputRef}
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="h-10 px-3 rounded-[8.75px] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#b3d2ff]"
                  placeholder={
                    isManagerLogin ? "manager@coffeeshop.com" : "staff1"
                  }
                  autoComplete={isManagerLogin ? "email" : "username"}
                  inputMode={isManagerLogin ? "email" : "text"}
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-[12.25px] font-medium text-[#364153]">
                  Mật khẩu
                </span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="h-10 px-3 rounded-[8.75px] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#b3d2ff]"
                  placeholder="••••••"
                  autoComplete="current-password"
                />
              </label>

              <button
                type="submit"
                className="h-10 rounded-[8.75px] bg-[#e17100] text-white font-medium hover:bg-[#d56500] active:bg-[#c85f00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!canSubmit}
              >
                {isSubmitting ? "Đang đăng nhập…" : "Đăng nhập"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/register")}
                className="h-10 rounded-[8.75px] border border-black/10 bg-white text-[#0a0a0a] font-medium hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                Tạo tài khoản mới
              </button>
            </form>
          </div>
        ) : null}
        {/* 
        <div
          className="rounded-[12.75px] border border-[#b3d2ff] p-[15px] flex flex-col gap-[14px]"
          style={{
            background: "linear-gradient(90deg, #eff6ff 0%, #f0fdf4 100%)",
          }}
        >
          <div className="flex items-center gap-2">
            <img
              src="/assets/icons/shield-blue.svg"
              alt=""
              className="w-[14px] h-[14px] shrink-0"
            />
            <span className="text-sm font-medium text-[#0a0a0a]">
              Tài khoản demo đã được bảo mật
            </span>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-[8.75px] p-[11.5px]">
            <p className="text-[12.25px] font-medium text-[#c10007] leading-[17.5px]">
              🚫 Hệ thống đã bật xác thực - chỉ nhập đúng thông tin mới đăng
              nhập được!
            </p>
          </div>

          <div className="flex flex-col gap-[7px]">
            <div className="flex items-center gap-2">
              <img
                src="/assets/icons/envelope-blue.svg"
                alt=""
                className="w-3.5 h-3.5 shrink-0"
              />
              <span className="text-[12.25px] font-medium text-[#364153]">
                Tài khoản Quản lý:
              </span>
            </div>
            <div className="border border-black/10 rounded-[8.75px] bg-white px-[11.5px] pt-[11.5px] pb-px flex flex-col gap-[7px]">
              <CredentialLine
                option="Option 1:"
                fieldLabel="Gmail:"
                value="manager@coffeeshop.com"
                password="admin123"
                pillBgClassName="bg-[#dbeafe]"
                pillTextClassName="text-[#193cb8]"
                stackPassword
              />
              <CredentialLine
                option="Option 2:"
                fieldLabel="Gmail:"
                value="admin@coffeeshop.com"
                password="admin123"
                pillBgClassName="bg-[#dbeafe]"
                pillTextClassName="text-[#193cb8]"
                stackPassword
              />
            </div>
          </div>

          <div className="flex flex-col gap-[7px]">
            <div className="flex items-center gap-2">
              <img
                src="/assets/icons/key-green.svg"
                alt=""
                className="w-3.5 h-3.5 shrink-0"
              />
              <span className="text-[12.25px] font-medium text-[#364153]">
                Tài khoản Nhân viên &amp; POS:
              </span>
            </div>
            <div className="border border-black/10 rounded-[8.75px] bg-white px-[11.5px] pt-[11.5px] pb-px flex flex-col gap-[7px]">
              <CredentialLine
                option="Option 1:"
                fieldLabel="Username:"
                value="staff1"
                password="admin123"
                pillBgClassName="bg-[#dcfce7]"
                pillTextClassName="text-[#016630]"
              />
              <CredentialLine
                option="Option 2:"
                fieldLabel="Username:"
                value="pos1"
                password="admin123"
                pillBgClassName="bg-[#dcfce7]"
                pillTextClassName="text-[#016630]"
              />
              <CredentialLine
                option="Option 3:"
                fieldLabel="Username:"
                value="manager1"
                password="admin123"
                pillBgClassName="bg-[#dcfce7]"
                pillTextClassName="text-[#016630]"
              />
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
