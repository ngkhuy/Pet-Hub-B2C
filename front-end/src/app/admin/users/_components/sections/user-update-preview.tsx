import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatVNPhone } from "@/lib/utils/format";

export const UserPreview = React.memo(function UserPreview({
  email,
  fullName,
  phoneNumber,
  avatarPreview,
}: {
  email: string;
  fullName?: string;
  phoneNumber?: string;
  avatarPreview: string;
}) {
  const name = fullName || "(Chưa có tên)";

  return (
    <div className="border rounded-lg p-4 bg-muted/40">
      <p className="text-sm font-semibold mb-2">Preview</p>

      <div className="flex gap-3 items-center">
        <Avatar className="w-14 h-14">
          <AvatarImage src={avatarPreview} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="text-sm space-y-1">
          <p className="font-semibold">{name}</p>
          <p className="text-muted-foreground text-xs">{email}</p>
          {phoneNumber && (
            <p className="text-xs text-muted-foreground">
              {formatVNPhone(phoneNumber)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
});
