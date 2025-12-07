"use client";

import { useEffect } from "react";
import { differenceInMinutes } from "date-fns";
import { authApi } from "@/lib/api/auth";
import { toastError } from "@/lib/utils/toast";
import { useAuthStore } from "@/lib/stores/auth-store";
import { usePathname } from "next/navigation";
import { clientUrl } from "@/lib/data/web-url";
import { globalLogout } from "@/lib/utils/session";

export default function SlideSession() {
  const tokenPayload = useAuthStore.use.tokenPayload();
  const accessToken = useAuthStore.use.accessToken();
  const { setAuthenticated } = useAuthStore.use.actions();
  const pathName = usePathname();

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!accessToken || !tokenPayload.exp) {
        return;
      }
      const now = new Date();
      const expiresAt = tokenPayload.exp * 1000;

      // If the token will expire in less than or equals to 5 minutes, refresh it
      if (
        differenceInMinutes(expiresAt, now, { roundingMethod: "floor" }) <= 5
      ) {
        try {
          const response = await authApi.refreshToken();
          console.log("Checking slide session...");
          const nextServerResponse = await authApi.slideSession(
            response.access_token
          );

          setAuthenticated(response.access_token, {
            role: nextServerResponse.access_token_payload.role,
            exp: nextServerResponse.access_token_payload.exp,
          });
        } catch (error) {
          await globalLogout(`${clientUrl.login.path}?redirect=${pathName}`);
          toastError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        }
      }
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, [accessToken, tokenPayload]);

  return null;
}
