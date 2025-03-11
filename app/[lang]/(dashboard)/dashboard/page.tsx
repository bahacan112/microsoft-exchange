"use client";
import { Breadcrumbs, BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Card } from "@/components/ui/card";
import UserTableStatus from "@/components/tables/user-table-status";
const BlankPage = () => {
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
      </Card>
    </div>
  );
};

export default BlankPage;
