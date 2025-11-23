"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AvatarHeader({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { avatar, name, email } = user;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback className="rounded-lg">A</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <h1 className="text-gray-900 dark:text-white text-base font-medium leading-normal">
              {name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
              {email}
            </p>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
