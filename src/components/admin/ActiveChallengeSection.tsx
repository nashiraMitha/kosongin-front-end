"use client";

import {
  useEffect,
  useState,
} from "react";

import Image from "next/image";
import Cookies from "js-cookie";

import { client } from "@/api/client.gen";

import {
  getAdminChallenges,
} from "@/api/sdk.gen";

import {
  deleteAdminChallengesById,
} from "@/api/sdk.gen";

import ChallengeSection
from "./ChallengeSection";

export default function ActiveChallengeSection() {

  const [openEdit, setOpenEdit] =
    useState(false);

  const [selectedChallenge,
    setSelectedChallenge] =
    useState<any>(null);

  const [challenges, setChallenges] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* FETCH CHALLENGES */
  useEffect(() => {

    const token =
      Cookies.get(
        "admin_token"
      );
      
      console.log(
        "TOKEN:",
        token
      );

    client.setConfig({
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    });

    fetchChallenges();

  }, []);

  const fetchChallenges =
    async () => {

    try {

      setLoading(true);

      const res =
        await getAdminChallenges();

      console.log(
        "CHALLENGES:",
        res.data
      );

      const challengesData =
        Array.isArray(
          res.data?.data
        )
          ? res.data.data
          : [];

      setChallenges(
        challengesData
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
        "Gagal mengambil challenge"
      );

    } finally {

      setLoading(false);

    }
  };

  /* LOADING */
  if (loading) {

    return (
      <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6 mt-8">

        <p className="font-semibold text-[#032119]">
          Loading challenge...
        </p>

      </div>
    );
  }

  /* ERROR */
  if (error) {

    return (
      <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6 mt-8">

        <p className="text-red-500 font-semibold">
          {error}
        </p>

      </div>
    );
  }

  const handleDelete =
    async (id: string) => {

    try {

      await deleteAdminChallengesById({

        path: {
          id,
        },

      });

      /* REFRESH DATA */
      fetchChallenges();

    } catch (err) {

      console.log(err);

    }
  };

  return (
    <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6 mt-8">

      {/* HEADER */}
      <div className="mb-8">

        <h2 className="text-4xl font-bold text-[#032119]">
          Challenge Aktif
        </h2>

        <p className="text-sm text-[#032119] mt-2">
          Daftar challenge yang sedang berjalan di platform Kosongin.
        </p>

      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {Array.isArray(challenges) &&
          challenges.map((challenge) => (

            <div
              key={challenge.id}
              className="bg-[#FFFAF9] rounded-[28px] border shadow-md overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative w-full h-[320px] bg-[#ECECEC] flex items-center justify-center">

                <Image
                  src={
                    challenge.imageUrl ||
                    "/Challenge/one.png"
                  }
                  alt={challenge.title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />

              </div>

              {/* CONTENT */}
              <div className="p-5">

                {/* CATEGORY */}
                <span
                  className={`inline-block text-[#032119] text-xs px-3 py-1 rounded-full mb-4 border ${
                    challenge.challengesCategory ===
                    "Zero Waste"
                      ? "border-[#587700] bg-[#F6FBEF]"
                      :challenge.challengesCategory ===
                      "SecondHand"
                      ? "border-[#994904] bg-[#FFF8F2]"
                      : challenge.challengesCategory ===
                      "Eco Eating"
                      ? "border-[#006093] bg-[#F3FAFF]"
                      : challenge.challengesCategory ===
                      "No Impulse Buy"
                      ? "border-[#BA404D] bg-[#FFF5F6]"
                      : challenge.challengesCategory ===
                      "LowSpend"
                      ? "border-[#064232] bg-[#F4FBF8]"
                      : "border-[#000000] bg-[#F8F8F8]"
                  }`}
                >
                  {challenge.challengesCategory}
                </span>

                {/* TITLE */}
                <h3 className="text-2xl font-bold text-[#032119] leading-snug">
                  {challenge.title}
                </h3>

                {/* DESC */}
                <p className="text-sm text-[#032119] mt-3 leading-relaxed">
                  {challenge.description}
                </p>

                {/* INFO */}
                <div className="flex items-center gap-2 mt-5 text-sm text-[#032119]">

                  <Image
                    src="/user.png"
                    alt="participants"
                    width={20}
                    height={20}
                  />

                  <span>
                    {challenge.participants || 0} peserta |{" "}
                    {challenge.durationDays} hari
                  </span>

                </div>

                {/* BUTTON */}
                <div className="flex gap-3 mt-6">

                  <button

                    onClick={() => {

                      setSelectedChallenge(
                        challenge
                      );

                      setOpenEdit(true);
                    }}

                    className="
                      flex-1
                      bg-[#90BAB7]
                      hover:bg-[#7DA7A4]
                      transition-all
                      text-white
                      font-semibold
                      py-3
                      rounded-xl
                    "
                  >

                    Edit

                  </button>

                  <button className="flex-1 border border-[#D96B6B] text-[#B23838] hover:bg-[#FFE5E5] transition-all font-semibold py-3 rounded-xl"
                    onClick={() =>
                      handleDelete(
                        challenge.id
                      )
                    }
                  >
                    Nonaktifkan
                  </button>

                  {openEdit && (

                    <div className="
                      fixed
                      inset-0
                      z-50
                      flex
                      items-center
                      justify-center
                      bg-black/5
                      backdrop-blur-sm
                      p-4
                    ">

                      <div className="
                        bg-white
                        rounded-2xl
                        w-full
                        max-w-3xl
                        max-h-[90vh]
                        overflow-y-auto
                        relative
                      ">

                        <button

                          onClick={() =>
                            setOpenEdit(false)
                          }

                          className="
                            absolute
                            top-4
                            right-4
                            text-2xl
                            font-bold
                            text-gray-500
                            z-50
                          "
                        >

                          ×

                        </button>

                        <ChallengeSection

                          challenge={
                            selectedChallenge
                          }

                        />

                      </div>

                    </div>

                  )}

                </div>

              </div>

            </div>

          ))}

      </div>

    </div>
  );
}