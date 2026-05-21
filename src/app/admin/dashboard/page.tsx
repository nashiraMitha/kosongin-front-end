"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import OverviewStats from "@/components/admin/OverviewStats";
import MonitoringSection from "@/components/admin/MonitoringSection";
import UserSection from "@/components/admin/UserSection";
import ChallengeSection from "@/components/admin/ChallengeSection";
import ActiveChallengeSection from "@/components/admin/ActiveChallengeSection";

export default function AdminDashboardPage() {

  return (
    <div
      id="top"
      className="min-h-screen bg-[#F1F6F6]"
    >

      {/* NAVBAR */}
      <AdminNavbar />

      {/* CONTENT */}
      <div className="p-10">

        {/* HEADLINE */}
        <h1 className="pb-10 text-5xl font-bold font-heading text-[#1F3A37]">
          Dashboard Admin
        </h1>

        {/* OVERVIEW */}
        <div id="overview">
          <OverviewStats />
        </div>

        {/* MONITORING */}
        <div id="monitoring">
          <MonitoringSection />
        </div>

        {/* USER */}
        <div id="users">
          <UserSection />
        </div>

        {/* CHALLENGE */}
        <div id="challenges">

          {/* FORM CHALLENGE */}
          <ChallengeSection />

          {/* ACTIVE CHALLENGE */}
          <ActiveChallengeSection />

        </div>

      </div>

    </div>
  );
}