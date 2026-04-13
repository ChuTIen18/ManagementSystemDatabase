import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError, apiPost } from "../utils/api";

type RegisterRole = "staff" | "pos" | "manager";

type RegisterResponse = {
  success: true;
  message: "REGISTER_SUCCESS";
  data: {
    user: {
      id: number;
      username: string;
      email: string;
      role: RegisterRole | "admin";
      fullName?: string | null;
      isActive: boolean;
    };
  };
};

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

export default function RegisterPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<RegisterRole>("staff");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState<
    | { type: "success" | "error"; message: string }
    | null
  >(null);

  const canSubmit = useMemo(() => {
    return Boolean(username && email && password && role) && !isSubmitting;
  }, [username, email, password, role, isSubmitting]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-[520px] bg-white rounded-[12.75px] border border-black/10 p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="text-[16px] font-semibold text-[#0a0a0a]">
              Tạo tài khoản
            </h1>
            <p className="text-[12.25px] text-[#6a7282]">
              Đăng ký tài khoản để đăng nhập hệ thống
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[12.25px] font-medium text-[#364153] hover:text-[#111827]"
          >
            Quay lại đăng nhập
          </button>
        </div>

        {banner ? <Banner type={banner.type} message={banner.message} /> : null}

        <form
          className="flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsSubmitting(true);
            setBanner(null);
            try {
              const result = await apiPost<RegisterResponse>("/auth/register", {
                username,
                email,
                password,
                role,
                fullName: fullName || undefined,
              });

              if (result.success) {
                setBanner({
                  type: "success",
                  message: "Đăng ký thành công. Đang chuyển về trang đăng nhập…",
                });
                navigate(
                  `/login?identifier=${encodeURIComponent(username || email)}`,
                  { replace: true },
                );
              }
            } catch (err) {
              const apiErr = err instanceof ApiError ? err : null;
              setBanner({
                type: "error",
                message:
                  apiErr?.message || "Đăng ký thất bại. Vui lòng thử lại.",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <label className="flex flex-col gap-1">
            <span className="text-[12.25px] font-medium text-[#364153]">
              Username
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-10 px-3 rounded-[8.75px] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#b3d2ff]"
              placeholder="staff01"
              autoComplete="username"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[12.25px] font-medium text-[#364153]">
              Email
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 px-3 rounded-[8.75px] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#b3d2ff]"
              placeholder="staff01@coffeeshop.com"
              autoComplete="email"
              inputMode="email"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[12.25px] font-medium text-[#364153]">
              Họ tên (tuỳ chọn)
            </span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-10 px-3 rounded-[8.75px] border border-black/10 focus:outline-none focus:ring-2 focus:ring-[#b3d2ff]"
              placeholder="Nguyễn Văn A"
              autoComplete="name"
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
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-[12.25px] font-medium text-[#364153]">
              Vai trò
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(["staff", "pos", "manager"] as RegisterRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`h-9 rounded-[8.75px] border text-[12.25px] font-medium transition-colors ${
                    role === r
                      ? "bg-[#eff6ff] border-[#b3d2ff] text-[#193cb8]"
                      : "bg-white border-black/10 text-[#364153] hover:bg-gray-50"
                  }`}
                >
                  {r === "staff"
                    ? "Nhân viên"
                    : r === "pos"
                      ? "POS"
                      : "Quản lý"}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="h-10 rounded-[8.75px] bg-[#0f172a] text-white font-medium hover:bg-[#0b1220] active:bg-[#070c16] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!canSubmit}
          >
            {isSubmitting ? "Đang tạo tài khoản…" : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
}

