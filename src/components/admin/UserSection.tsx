"use client";

import {
  useEffect,
  useState,
} from "react";

import Cookies from "js-cookie";

import adminApi from "@/services/adminApi";
const api = adminApi;

export default function UserSection() {

  const [users, setUsers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* FETCH USERS */
  useEffect(() => {

    fetchUsers();

  }, []);

  const fetchUsers = async () => {

    try {

      /* TOKEN */
      const token =
        Cookies.get(
          "admin_token"
        );

      /* API */
      const res =
        await api.get(
          "/api/admin/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      console.log(
        "USERS RESPONSE:",
        res.data
      );

      /* SAFE ARRAY */
      const usersData =
        Array.isArray(
          res.data.data
        )
          ? res.data.data
          : Array.isArray(
              res.data.data?.users
            )
          ? res.data.data.users
          : [];

      setUsers(
        usersData
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
        "Gagal mengambil data pengguna"
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
          Loading users...
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

  return (
    <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6 mb-8">

      {/* HEADER */}
      <div className="mb-6">

        {/* TITLE */}
        <h2 className="text-4xl font-bold text-[#032119]">
          Data Pengguna
        </h2>

        {/* DESC */}
        <p className="text-sm text-[#032119] mt-1">
          Kelola seluruh akun pengguna terdaftar di platform Kosongin.
        </p>

        {/* SEARCH + BUTTON */}
        <div className="flex items-center gap-4 mt-5">

          {/* SEARCH */}
          <div className="flex items-center bg-white border border-2 border-[#D7E5E3] rounded-xl px-4 py-2 w-full">

            {/* ICON */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-[#032119] mr-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              />

            </svg>

            <input
              type="text"
              placeholder="Cari nama atau email pengguna..."
              className="w-full outline-none text-sm bg-transparent"
            />

          </div>

          {/* EXPORT BUTTON */}
          <button className="flex items-center justify-center gap-2 bg-[#F5BABB] hover:bg-[#E9A7A8] transition-all text-[#032119] font-bold px-5 py-2 rounded-xl whitespace-nowrap">

            <img
              src="/ArrowBwh.png"
              alt="download"
              className="h-[18px] w-[18px] object-contain"
            />

            Export CSV

          </button>

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-[#D7E5E3]">

        <table className="w-full border-collapse">

          {/* HEADER */}
          <thead>

            <tr className="bg-[#74A9A5] text-[#032119]">

              <th className="px-6 py-4 text-left text-sm font-bold">
                Pengguna
              </th>

              <th className="px-6 py-4 text-left text-sm font-bold">
                Email
              </th>

              <th className="px-6 py-4 text-left text-sm font-bold">
                Tanggal Daftar
              </th>

              <th className="px-6 py-4 text-left text-sm font-bold">
                Status
              </th>

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {Array.isArray(users) &&
              users.map((user) => (

                <tr
                  key={user.id}
                  className="border-t border-[#E5E7EB] bg-white"
                >

                  {/* USER */}
                  <td className="px-6 py-4">

                    <div>

                      <p className="text-sm font-medium text-[#032119]">
                        {user.fullName ||
                          user.name ||
                          "-"}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        @
                        {user.nickname ||
                          "unknown"}
                      </p>

                    </div>

                  </td>

                  {/* EMAIL */}
                  <td className="px-6 py-4 text-sm text-[#032119]">
                    {user.email || "-"}
                  </td>

                  {/* DATE */}
                  <td className="px-6 py-4 text-sm text-[#032119]">

                    {user.createdAt
                      ? new Date(
                          user.createdAt
                        ).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "-"}

                  </td>

                  {/* STATUS */}
                  <td className="px-6 py-4">

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        user.isActive
                          ? "bg-[#D7F5E7] text-[#0F7B45]"
                          : "bg-[#FFE2E2] text-[#D62828]"
                      }`}
                    >
                      {user.isActive
                        ? "Aktif"
                        : "Tidak Aktif"}
                    </span>

                  </td>

                </tr>

              ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}