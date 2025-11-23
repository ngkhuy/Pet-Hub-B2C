"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import avatarImage from "@/assets/images/avatar-small.jpg";
import {
  MdDesignServices,
  MdOutlineQueryStats,
  MdStore,
  MdOutlineSupervisorAccount,
  MdPets,
} from "react-icons/md";
import { SidebarItemType } from "./sidebar-node";
import { AvatarHeader } from "@/app/admin/_shared/avatar-header";
import { Separator } from "@/components/ui/separator";
import { NavMain } from "@/app/admin/_shared/nav-main";
import { NavUser } from "@/app/admin/_shared/nav-user";

const navMain: SidebarItemType[] = [
  {
    title: "Tổng quan",
    url: "/admin",
    IconName: MdOutlineQueryStats,
  },
  {
    title: "Quản lí người dùng",
    url: "/admin/users",
    IconName: MdOutlineSupervisorAccount,
  },
  {
    title: "Quản lí thú cưng",
    url: "/admin/pets",
    IconName: MdPets,
  },
  {
    title: "Dịch vụ",
    url: "/admin/services",
    IconName: MdDesignServices,
  },
  {
    title: "Thông tin shop",
    url: "/admin/shop-info",
    IconName: MdStore,
  },
];

const user = {
  name: "Nguyen Van A",
  email: "a@d.com",
  avatar: avatarImage.src,
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AvatarHeader user={user} />
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
