"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";

import {
  getAdminStats,
} from "@/api/sdk.gen";

export default function OverviewStats() {

  const [stats, setStats] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats = async () => {

    try {

      const token =
        Cookies.get(
          "admin_token"
        );

      const res =
        await getAdminStats({
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        });

        console.log(
          "OVERVIEW DATA:",
          res.data
        );

        console.log(
          "OVERVIEW INNER:",
          res.data?.data
        );

      /* SET DATA */
      setStats(
        res.data?.data
      );

    } catch (err: any) {

      console.log(
        err.response?.data
      );

      console.log(
        err.response?.status
      );

      setError(
        "Gagal mengambil statistik"
      );

    } finally {

      setLoading(false);

    }
  };

  /* LOADING */
  if (loading) {

    return (
      <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6 mb-8">

        <p className="text-[#032119] font-semibold">
          Loading statistics...
        </p>

      </div>
    );
  }

  /* ERROR */
  if (error) {

    return (
      <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6 mb-8">

        <p className="text-red-500 font-semibold">
          {error}
        </p>

      </div>
    );
  }

  const statsData = [
    {
      title: "Total pengguna",
      value:
        stats?.totalUsers || 0,
      icon: "/Pengguna.png",
    },
    {
      title: "Item tercatat",
      value:
        stats?.totalConsumptionLogs || 0,
      icon: "/Item.png",
    },
    {
      title:
        "Impulse berhasil dibatalkan",
      value:
        stats?.totalCancelledImpulse || 0,
      icon: "/impulse.png",
    },
    {
      title: "Challenge Aktif",
      value:
        stats?.totalActiveChallenges || 0,
      icon: "/target.png",
    },
  ];

  return (
    <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6 mb-8">

      {/* TITLE */}
      <div className="mb-6">

        <h2 className="text-3xl font-bold text-[#1F3A37]">
          Overview Stats
        </h2>

        <p className="text-black font-medium text-sm mt-1">
          Ringkasan kondisi platform Kosongin secara keseluruhan hari ini
        </p>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

        {statsData.map((item) => (

          <div
            key={item.title}
            className="bg-[#F1F6F6] p-6 rounded-2xl border"
          >

            {/* TOP */}
            <div className="flex items-start justify-between">

              {/* VALUE */}
              <h2 className="text-5xl font-bold font-heading text-[#032119] leading-none">
                {item.value}
              </h2>

              {/* ICON */}
              <Image
                src={item.icon}
                alt={item.title}
                width={48}
                height={48}
                className="object-contain"
              />

            </div>

            {/* TITLE */}
            <p className="text-[#032119] font-medium mt-4">
              {item.title}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}