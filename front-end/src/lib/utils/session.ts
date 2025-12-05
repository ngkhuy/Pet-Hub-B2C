import { authApi } from "@/lib/api/auth";
import { clientUrl } from "@/lib/data/web-url";

export async function globalLogout(redirect?: string) {
  try {
    await authApi.logout();
  } catch (error) {
    console.error("Error during logout:", error);
  } finally {
    localStorage.clear();
    window.location.reload();
    window.location.href = redirect || clientUrl.login.path;
  }
}
