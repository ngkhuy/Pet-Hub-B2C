"use client";

import { EditProfileDialog } from "@/app/account/profile/_components/edit-profile-dialog";
import { ProfileSkeleton } from "@/app/account/profile/_components/profile-skeleton";
import UserAvatarProfile from "@/app/account/profile/_components/user-avatar-profile";
import { HttpError } from "@/lib/api/client";
import { userManagementApi } from "@/lib/api/user-management";
import { useAuthStore } from "@/lib/stores/auth-store";

import { formatDate } from "@/lib/utils/format";
import { toastError } from "@/lib/utils/toast";
import { useEffect } from "react";

export function UserProfile() {
  const user = useAuthStore.use.user();
  const { setUser } = useAuthStore.use.actions();

  useEffect(() => {
    userManagementApi
      .getMe()
      .then((userData) => {
        setUser(userData);
      })
      .catch((error) => {
        const err = error as HttpError;
        toastError(
          err.message || "Đã có lỗi xảy ra khi tải thông tin người dùng!"
        );
      });
  }, [setUser]);

  return user ? (
    <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
      {/* LEFT: AVATAR + STATUS + EDIT BUTTON */}
      <div className="bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col items-center gap-4">
        <UserAvatarProfile
          imageUrl={user?.avt_url}
          userFullName={user?.full_name}
        />
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {user?.full_name || "Chưa cập nhật tên"}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.email}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <span
            className={`px-2.5 py-1 rounded-full border ${
              user?.is_email_verified
                ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
                : "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
            }`}
          >
            {user?.is_email_verified
              ? "Email đã xác minh"
              : "Email chưa xác minh"}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full border ${
              user?.is_phone_verified
                ? "border-emerald-500 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30"
                : "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
            }`}
          >
            {user?.is_phone_verified ? "SĐT đã xác minh" : "SĐT chưa xác minh"}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full border ${
              user?.active_status
                ? "border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                : "border-gray-300 text-gray-500 dark:border-gray-600 dark:text-gray-400"
            }`}
          >
            {user?.active_status ? "Đang hoạt động" : "Đã khóa"}
          </span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 pt-2">
          Tham gia từ:{" "}
          {formatDate({ date: user?.created_at?.toString(), type: "date" })}
        </p>

        <EditProfileDialog />
      </div>

      {/* RIGHT: DETAIL INFO */}
      <div className="bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 rounded-xl p-5 space-y-5">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Thông tin chi tiết
        </h2>

        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Họ và tên</dt>
            <dd className="text-gray-900 dark:text-gray-100">
              {user?.full_name || "Chưa cập nhật"}
            </dd>
          </div>

          <div>
            <dt className="text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="text-gray-900 dark:text-gray-100">{user?.email}</dd>
          </div>

          <div>
            <dt className="text-gray-500 dark:text-gray-400">Số điện thoại</dt>
            <dd className="text-gray-900 dark:text-gray-100">
              {user?.phone_number || "Chưa cập nhật"}
            </dd>
          </div>

          <div>
            <dt className="text-gray-500 dark:text-gray-400">Ngày sinh</dt>
            <dd className="text-gray-900 dark:text-gray-100">
              {formatDate({
                date: user?.date_of_birth ? user?.date_of_birth : undefined,
                type: "date",
              })}
            </dd>
          </div>

          <div className="md:col-span-2">
            <dt className="text-gray-500 dark:text-gray-400">Giới thiệu</dt>
            <dd className="text-gray-900 dark:text-gray-100 whitespace-pre-line">
              {user?.bio || "Chưa có giới thiệu."}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  ) : (
    <ProfileSkeleton />
  );
}
