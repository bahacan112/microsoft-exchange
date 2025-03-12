"use client";
import { useState } from "react";
import UserList from "@/components/user-list";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import UserTableStatus from "@/components/tables/user-table-status";
import FolderList from "@/components/folder-list";
const BlankPage = () => {
  const users = [
    { id: "1", displayName: "Bahattin Zenbil" },
    { id: "2", displayName: "Bilet Diogenestravel" },
    { id: "3", displayName: "Bookings Eurotours" },
    { id: "4", displayName: "Emre Aksoy" },
  ];
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };
  return (
    <div>
      <Breadcrumbs>
        <BreadcrumbItem>Utility</BreadcrumbItem>
        <BreadcrumbItem className="text-primary">Dashboard</BreadcrumbItem>
      </Breadcrumbs>

      <div className="ml-5 my-5 text-2xl font-medium text-default-900">
        Exchange Backup System
      </div>
      <Card title="With avatars content">
        <UserTableStatus />
        <div></div>
      </Card>
    </div>
  );
};

export default BlankPage;
