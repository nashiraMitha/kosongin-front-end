"use client";

import {
  useEffect,
  useState,
} from "react";

import Cookies from "js-cookie";
import { Trash2 } from "lucide-react";

import {
  getAdminUsers,
} from "@/api/sdk.gen";
import { client } from "@/lib/api-client";

export default function UserSection() {

  const [users, setUsers] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  // MODAL DELETE STATE
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
        await getAdminUsers({
          client,
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        });

      setUsers(
        res.data?.data?.data || []
      );

    } catch (err: any) {
      console.log(err);
      setError(
        "Gagal mengambil daftar pengguna"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser?.id) return;
    
    setIsDeleting(true);
    try {
      const token = Cookies.get("admin_token");
      const url = `https://kosongin-backend-production.up.railway.app/api/admin/users/${selectedUser.id}`;
      
      const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Gagal menghapus user");
        }
        // Success
        setIsModalOpen(false);
        setSelectedUser(null);
        fetchUsers(); // Refresh list
      } else {
        // Jika bukan JSON (kemungkinan 404 HTML atau error server)
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error(`Server error (${response.status}): Endpoint tidak ditemukan atau server bermasalah. Pastikan backend terbaru sudah dideploy.`);
      }

    } catch (err: any) {
      console.error(err);
      alert(`Gagal menghapus user: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredUsers =
    users.filter((user) => {

      const keyword =
        search.toLowerCase();

      return (
        user.fullName
          ?.toLowerCase()
          .includes(keyword) ||

        user.nickName
          ?.toLowerCase()
          .includes(keyword) ||

        user.email
          ?.toLowerCase()
          .includes(keyword)
      );
    });

  /* LOADING */
  if (loading) {

    return (
      <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6 mb-8">

        <p className="font-semibold text-[#032119]">
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

        <h2 className="text-3xl font-bold text-[#1F3A37]">
          Data Pengguna
        </h2>

        <p className="text-black font-medium text-sm mt-1">
          Daftar seluruh pengguna platform Kosongin
        </p>

      </div>

      <p className="text-black mb-4">
        Total Users: {users.length}
      </p>

      {/* SEARCH + EXPORT */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-4">

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

              value={search}

              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }

              placeholder="
                Cari nama atau email pengguna...
              "

              className="
                w-full
                outline-none
                text-sm
                bg-transparent
              "
            />

          </div>

        {/* EXPORT BUTTON */}
        <button
          onClick={async () => {

            try {

              const token =
                Cookies.get(
                  "admin_token"
                );

              const response =
                await fetch(
                  "https://kosongin-backend-production.up.railway.app/api/admin/users/export",
                  {
                    method: "GET",
                    headers: {
                      Authorization:
                        `Bearer ${token}`,
                    },
                  }
                );

              if (!response.ok) {

                throw new Error(
                  "Gagal export CSV"
                );

              }

              const blob =
                await response.blob();

              const url =
                window.URL.createObjectURL(
                  blob
                );

              const link =
                document.createElement(
                  "a"
                );

              link.href = url;

              link.download =
                "data-pengguna.csv";

              document.body.appendChild(
                link
              );

              link.click();

              document.body.removeChild(
                link
              );

              window.URL.revokeObjectURL(
                url
              );

            } catch (err) {

              console.log(err);

              alert(
                "Gagal mengunduh CSV"
              );

            }

          }}
          className="flex items-center justify-center gap-2 bg-[#F5BABB] hover:bg-[#E9A7A8] transition-all text-[#032119] font-bold px-5 py-2 rounded-xl whitespace-nowrap"
        >

          <img
            src="/ArrowBwh.png"
            alt="download"
            className="h-[18px] w-[18px] object-contain"
          />

          Export CSV

        </button>

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

              <th className="px-6 py-4 text-center text-sm font-bold">
                Aksi
              </th>

            </tr>

          </thead>

          {/* BODY */}
          <tbody>

            {Array.isArray(users) &&
              users
                .filter((user) => {

                  const keyword =
                    search.toLowerCase();

                  return (

                    user.fullName
                      ?.toLowerCase()
                      .includes(keyword)

                    ||

                    user.name
                      ?.toLowerCase()
                      .includes(keyword)

                    ||

                    user.email
                      ?.toLowerCase()
                      .includes(keyword)

                    ||

                    user.nickname
                      ?.toLowerCase()
                      .includes(keyword)
                  );
                })

                .map((user) => (

                <tr
                  key={user.id}
                  className="border-t border-[#E5E7EB] bg-white hover:bg-[#74A9A5]/5 transition-colors"
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

                  {/* ACTION */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all active:scale-90"
                      title="Hapus Pengguna"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>

                </tr>

              ))}

          </tbody>

          </table>

      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#FFFAF9] rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-[#D7E5E3] animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-[#1F3A37] text-center mb-4">
              Konfirmasi Hapus
            </h3>
            <p className="text-[#032119] text-center mb-8">
              Apakah anda ingin menghapus user <span className="font-bold">"{selectedUser?.fullName || selectedUser?.name}"</span> ini?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                }}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-[#032119] bg-[#D7E5E3] hover:bg-[#C5D6D3] transition-all active:scale-95"
              >
                Tidak
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white bg-[#F5BABB] hover:bg-[#E9A7A8] transition-all active:scale-95 flex items-center justify-center"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Iya"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}