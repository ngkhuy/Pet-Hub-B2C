import { Badge } from "@/components/ui/badge";
import { User } from "@/lib/schemas/user";
import React from "react";

export const UserStaticInfo = React.memo(function UserStaticInfo({
  user,
}: {
  user: User;
}) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-3 border space-y-1">
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">ID</span>
        <Badge>{user.id}</Badge>
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-muted-foreground">Email</span>
        <span className="font-semibold">{user.email}</span>
      </div>
    </div>
  );
});
