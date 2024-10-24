"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Sidebar, {
  SidebarItem,
  SubMenuItem,
} from "@/components/Sidebar/Layout/Sidebar";
import { IoIosStats } from "react-icons/io";
import { useState } from "react";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const showSidebar =
    pathname &&
    !pathname.includes("/homepage/jsonView") &&
    !pathname.includes("/auth");
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="min-h-screen flex">
      {showSidebar && (
        <Sidebar setExpanded={setExpanded}>
          <SidebarItem
            text="Statements"
            icon={<IoIosStats size={20} />}
            active
            alert={false}
          >
            {/* Aqui você aninha os SubMenuItems dentro de SidebarItem */}
            <SubMenuItem text="Pendentes" filter="pendentes" />
            <SubMenuItem text="Vistos" filter="vistos" />
          </SidebarItem>
          <SidebarItem
            text="View"
            icon={<IoIosStats size={20} />}
            active
            alert={false}
          >
            {/* Aqui você pode adicionar SubMenuItems se necessário */}
            <SubMenuItem text="Partidas" filter="partidas" />
          </SidebarItem>
        </Sidebar>
      )}

      <main
        className={`flex-1 min-h-screen overflow-y-auto transition-all duration-300`}
        style={{
          marginLeft: showSidebar ? (expanded ? "16rem" : "4rem") : "0",
          padding: "0",
        }}
      >
        {children}
      </main>
    </div>
  );
}
