"use client";

import {
  useEffect,
  useState,
} from "react";

import Cookies from "js-cookie";

import adminApi from "@/services/adminApi";
const api = adminApi;

export default function MonitoringSection() {

  const [analytics, setAnalytics] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* FETCH ANALYTICS */
  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

    try {

      /* TOKEN */
      const token =
        Cookies.get(
          "admin_token"
        );

      /* API */
      const res =
        await api.get(
          "/api/admin/monitoring",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setAnalytics(
        res.data.data
      );

    } catch (err: any) {

      console.log(err);

      console.log(
        err.response?.status
      );

      console.log(
        err.response?.data
      );

      setError(
        "Gagal mengambil monitoring data"
      );

    } finally {

      setLoading(false);

    }
  };

  /* LOADING */
  if (loading) {

    return (
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">

        <p className="font-semibold text-[#032119]">
          Loading monitoring...
        </p>

      </div>
    );
  }

  /* ERROR */
  if (error) {

    return (
      <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">

        <p className="text-red-500 font-semibold">
          {error}
        </p>

      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">

      <h2 className="text-2xl font-bold text-[#1F3A37] mb-6">
        Monitoring Aktivitas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* USER ACTIVITY */}
        <div className="h-[250px] bg-[#E6F0ED] rounded-2xl border flex items-center justify-center">

          <p className="font-semibold text-gray-600">
            Grafik User Activity
          </p>

        </div>

        {/* CONSUMPTION */}
        <div className="h-[250px] bg-[#F7E1E1] rounded-2xl border flex items-center justify-center">

          <p className="font-semibold text-gray-600">
            Grafik Konsumsi
          </p>

        </div>

      </div>

      {/* TOP CHALLENGES */}
      <div className="mt-6 bg-[#F8FAFA] border rounded-2xl p-5">

        <h3 className="text-xl font-bold text-[#032119] mb-4">
          Top Challenges
        </h3>

        <div className="space-y-3">

          {analytics?.topChallenges?.map(
            (
              challenge: any,
              index: number
            ) => (

              <div
                key={index}
                className="flex items-center justify-between bg-white rounded-xl border p-4"
              >

                <div>

                  <p className="font-semibold text-[#032119]">
                    {challenge.title}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    {challenge.participants} peserta
                  </p>

                </div>

                <span className="text-sm font-bold text-[#6B9080]">

                  #{index + 1}

                </span>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  );
}