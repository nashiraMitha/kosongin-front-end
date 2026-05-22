"use client";

import {
  useEffect,
  useState,
} from "react";

import Cookies from "js-cookie";

import { client } from "@/api/client.gen";

import {
  getAdminChallenges,
  postAdminChallenges,
  postUploadSignature,
} from "@/api/sdk.gen";

export default function
ChallengeSection({

  challenge,

}: any){

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");
  const [fieldErrors, setFieldErrors] =
  useState<any>({});

  const [form, setForm] =
  
    useState({
      title: "",
      description: "",
      category: "",
      duration: "",
      startDate: "",
    });

    const [image, setImage] =
      useState<File | null>(null);

    const [preview, setPreview] =
      useState("");

    const [imageUrl, setImageUrl] =
      useState("");
    const [uploadingImage, setUploadingImage] =
      useState(false);

    useEffect(() => {
      if (challenge) {

        setForm({

          title:
            challenge.title || "",

          description:
            challenge.description || "",

          category:
            challenge.challengesCategory || "",

          duration:
            String(
              challenge.durationDays || ""
            ),

          startDate:
            challenge.startDate
              ?.split("T")[0] || "",
        });

        setImageUrl(
          challenge.imageUrl || ""
        );

        setPreview(
          challenge.imageUrl || ""
        );
      }

    }, [challenge]);

  /* FETCH CHALLENGES */
  useEffect(() => {

    const token =
      Cookies.get(
        "admin_token"
      );

    client.setConfig({
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    });

    fetchChallenges();

  }, []);

  const fetchChallenges = async () => {

    try {

      const res =
        await getAdminChallenges();

      console.log(
        "CHALLENGES:",
        res.data
      );

    } catch (err: any) {

      console.log(err);

      console.log(
        err.response?.status
      );

      console.log(
        err.response?.data
      );

    }
  };

  const handleImageChange = async (
    file: File
  ) => {

    try {

      setUploadingImage(true);

      /* SAVE FILE */
      setImage(file);

      /* PREVIEW */
      const localPreview =
        URL.createObjectURL(file);

      setPreview(localPreview);

      /* GET SIGNATURE */
      const token =
        Cookies.get(
          "admin_token"
        );

      console.log(
        "TOKEN:",
        token
      );

      const signatureRes =
        await postUploadSignature({

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: {
            folderType:
              "challenge",
          },

        });

      const responseData =
        signatureRes.data?.data as any;

      const {
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder,
      } = responseData;

      /* FORM DATA */
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "api_key",
        apiKey
      );

      formData.append(
        "timestamp",
        String(timestamp)
      );

      formData.append(
        "signature",
        signature
      );

      formData.append(
        "folder",
        folder
      );

      /* UPLOAD CLOUDINARY */
      const cloudinaryRes =
        await fetch(

          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,

          {
            method: "POST",

            body: formData,
          }
        );

      const cloudinaryData =
        await cloudinaryRes.json();

      console.log(
        "CLOUDINARY:",
        cloudinaryData
      );

      /* SAVE URL */
      setImageUrl(
        cloudinaryData.secure_url
      );

      setUploadingImage(false);

    } catch (err) {

      setUploadingImage(false);

      console.log(err);

    }
  };

  const uploadDefaultImage =
    async () => {

      const token =
        Cookies.get(
          "admin_token"
        );

      /* GET SIGNATURE */
      const signatureRes =
        await postUploadSignature({

          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          body: {
            folderType:
              "challenge",
          },
        });

      const responseData =
        signatureRes.data?.data;

      if (!responseData) {

        throw new Error(
          "Gagal mendapatkan signature"
        );
      }

      const {
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder,
      } = responseData;

      /* FETCH DEFAULT IMAGE */
      const imageResponse =
        await fetch(
          "/Challenge/one.png"
        );

      const blob =
        await imageResponse.blob();

      const file =
        new File(
          [blob],
          "one.png",
          {
            type:
              "image/png",
          }
        );

      /* UPLOAD TO CLOUDINARY */
      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "api_key",
        apiKey || ""
      );

      formData.append(
        "timestamp",
        String(timestamp)
      );

      formData.append(
        "signature",
        signature || ""
      );

      formData.append(
        "folder",
        folder || ""
      );

      const cloudinaryRes =
        await fetch(

          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,

          {
            method: "POST",
            body: formData,
          }
        );

      const cloudinaryData =
        await cloudinaryRes.json();

      return cloudinaryData.secure_url;
  };


  /* SUBMIT */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    try {

      const newErrors: any = {};

      if (!form.title) {
        newErrors.title =
          "Judul wajib diisi";
      }

      if (!form.description) {
        newErrors.description =
          "Deskripsi wajib diisi";
      }

      if (!form.category) {
        newErrors.category =
          "Kategori wajib dipilih";
      }

      if (!form.startDate) {
        newErrors.startDate =
          "Tanggal wajib diisi";
      }

      if (!form.duration) {
        newErrors.duration =
          "Durasi wajib diisi";
      }

      setFieldErrors(
        newErrors
      );

      if (
        Object.keys(newErrors)
          .length > 0
      ) {
        return;
      }

      setLoading(true);

      setError("");

      const token =
      Cookies.get(
        "admin_token"
      );

      let finalImageUrl =
        imageUrl;

      /* DEFAULT IMAGE */
      if (!finalImageUrl) {

        finalImageUrl =
          await uploadDefaultImage();
      }

    if (challenge?.id) {

  await client.put({

    url:
      `/admin/challenges/${challenge.id}`,

    headers: {
      Authorization:
        `Bearer ${token}`,
    },

    body: {

      title:
        form.title,

      description:
        form.description,

      fullDescription:
        form.description,

      rules:
        "Ikuti challenge",

      howTo:
        "Kerjakan challenge",

      challengesCategory:
        form.category,

      imageUrl:
        finalImageUrl,

      durationDays:
        Number(
          form.duration
        ),

      startDate:
        new Date(
          form.startDate
        ).toISOString(),

      endDate:
        new Date(

          new Date(
            form.startDate
          ).getTime()

          +

          Number(form.duration)
          *
          24
          *
          60
          *
          60
          *
          1000

        ).toISOString(),
    },
  });

} else {

  await client.post({

    url:
      "/admin/challenges",

    headers: {
      Authorization:
        `Bearer ${token}`,
    },

    body: {

      title:
        form.title,

      description:
        form.description,

      fullDescription:
        form.description,

      rules:
        "Ikuti challenge",

      howTo:
        "Kerjakan challenge",

      challengesCategory:
        form.category,

      imageUrl:
        finalImageUrl,

      durationDays:
        Number(
          form.duration
        ),

      startDate:
        new Date(
          form.startDate
        ).toISOString(),

      endDate:
        new Date(

          new Date(
            form.startDate
          ).getTime()

          +

          Number(form.duration)
          *
          24
          *
          60
          *
          60
          *
          1000

        ).toISOString(),
    },
  });
}

      /* RESET */
      setForm({
        title: "",
        description: "",
        category: "",
        duration: "",
        startDate: "",
      });

      /* RELOAD PAGE */
      window.location.reload();

    } catch (err: any) {

      console.log(err);

      console.log(
        err.response?.status
      );

      console.log(
        JSON.stringify(
          err.response?.data,
          null,
          2
        )
      );

      setError(
        err.response?.data
          ?.message ||
          "Gagal membuat challenge"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="bg-[#FFFAF9] rounded-2xl border shadow-lg p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">

        <span className="text-3xl text-[#032119]">
          +
        </span>

        <h2 className="text-4xl font-bold text-[#032119]">
          Manajemen Challenge
        </h2>

      </div>


      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >

        {/* JUDUL */}
        <div>

          <label className="block text-sm font-semibold text-[#032119] mb-2">
            Judul Challenge
          </label>

          <input
            type="text"
            placeholder="Nama Challenge..."
            value={form.title}
            onChange={(e) =>
              setForm({
                ...form,
                title:
                  e.target.value,
              })
            }
            className={`
              border
              rounded-xl
              px-4
              py-3
              w-full
              outline-none

              ${
                fieldErrors.title
                  ? "border-red-500"
                  : "border-[#6E8B88]"
              }
            `}
          />

          {fieldErrors.title && (

            <p className="
              text-red-500
              text-sm
              mt-1
            ">

              {fieldErrors.title}

            </p>

          )}

        </div>

        {/* DESKRIPSI */}
        <div>

          <label className="block text-sm font-semibold text-[#032119] mb-2">
            Deskripsi
          </label>

          <textarea
            placeholder="Deskripsi challenge..."
            value={
              form.description
            }
            onChange={(e) => {
              setForm({
                ...form,
                description:
                  e.target.value,
              });

              setFieldErrors({
                ...fieldErrors,
                description: "",
              });
            }}
            className={`
              border
              rounded-xl
              px-4
              py-3
              w-full
              outline-none

              ${
                fieldErrors.description
                  ? "border-red-500"
                  : "border-[#6E8B88]"
              }
            `}
          />

          {fieldErrors.description && (

            <p className="
              text-red-500
              text-sm
              mt-1
            ">

              {fieldErrors.description}

            </p>

          )}

        </div>

        {/* KATEGORI */}
        <div>

          <label className="block text-sm font-semibold text-[#032119] mb-3">
            Kategori
          </label>

          <div className="flex flex-wrap gap-3">

            {[
                {
                  label: "Zero Waste",
                  value: "Zero Waste",
                  border: "border-[#5FAE7B]",
                  bg: "bg-[#EDF8F1]",
                },

                {
                  label: "SecondHand",
                  value: "SecondHand",
                  border: "border-[#C8B07A]",
                  bg: "bg-[#FFF9EB]",
                },

                {
                  label: "Eco Eating",
                  value: "Eco Eating",
                  border: "border-[#6B9BD9]",
                  bg: "bg-[#EEF5FF]",
                },

                {
                  label: "No Impulse Buy",
                  value: "No Impulse Buy",
                  border: "border-[#D96B6B]",
                  bg: "bg-[#FFF1F1]",
                },

                {
                  label: "LowSpend",
                  value: "LowSpend",
                  border: "border-[#8B7AD1]",
                  bg: "bg-[#F3EEFF]",
                },
              ].map((item) => (

              <button
                key={item.value}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    category: item.value,
                  })
                }
                className={`px-4 py-2 rounded-full border text-sm transition-all ${
                  form.category === item.value
                    ? `${item.border} ${item.bg} font-semibold text-[#032119]`
                    : `${item.border} bg-[#FFFAF9] text-[#032119] hover:${item.bg}`
                }`}
              >

                {item.label}

              </button>

            ))}

          </div>

          {fieldErrors.category && (

            <p className="
              text-red-500
              text-sm
              mt-1
            ">

              {fieldErrors.category}

            </p>

          )}

        </div>

        {/* ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* DATE */}
          <div>

            <label className="block text-sm font-semibold text-[#032119] mb-2">
              Tanggal Mulai
            </label>

            <div className="relative">

              <input
                type="date"
                value={
                  form.startDate
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    startDate:
                      e.target.value,
                  })
                }
                className={`
                  border
                  rounded-xl
                  px-4
                  py-3
                  w-full
                  outline-none

                  ${
                    fieldErrors.startDate
                      ? "border-red-500"
                      : "border-[#6E8B88]"
                  }
                `}
              />

              {fieldErrors.startDate && (

                <p className="
                  text-red-500
                  text-sm
                  mt-1
                ">

                  {fieldErrors.startDate}

                </p>

)}

            </div>

          </div>

          {/* DURASI */}
          <div>

            <label className="block text-sm font-semibold text-[#032119] mb-2">
              Durasi (hari)
            </label>

            <input
              type="number"
              placeholder="30"
              min={1}
              step={1}
              value={form.duration}
              onChange={(e) =>
                setForm({
                  ...form,
                  duration:
                    e.target.value,
                })
              }
              className={`
                border
                rounded-xl
                px-4
                py-3
                w-full
                outline-none

                ${
                  fieldErrors.title
                    ? "border-red-500"
                    : "border-[#6E8B88]"
                }
              `}
            />

            {fieldErrors.duration && (

              <p className="
                text-red-500
                text-sm
                mt-1
              ">

                {fieldErrors.duration}

              </p>

            )}

          </div>

        </div>

        {/* IMAGE UPLOAD */}
        <div>

          <label className="block text-sm font-semibold text-[#032119] mb-2">

            Poster image (JPG/PNG, max 5MB, optional)

          </label>

          <div

            onDragOver={(e) =>
              e.preventDefault()
            }

            onDrop={(e) => {

              e.preventDefault();

              const file =
                e.dataTransfer.files?.[0];

              if (file) {

                handleImageChange(file);

              }
            }}

            className="
              border
              border-[#6E8B88]
              rounded-xl
              h-[140px]
              flex
              items-center
              justify-center
              overflow-hidden
              bg-[#F3F3F3]
              relative
              cursor-pointer
            "
          >

            {/* INPUT */}
            <input

              type="file"

              accept="
                image/png,
                image/jpeg
              "

              onClick={(e) => {
                (
                  e.target as HTMLInputElement
                ).value = "";
              }}

              onChange={(e) => {

                const file =
                  e.target.files?.[0];

                if (file) {

                  handleImageChange(file);

                }
              }}

              className="
                absolute
                inset-0
                opacity-0
                cursor-pointer
              "
            />

            {/* PREVIEW */}
            {preview ? (

              <img

                src={preview}

                alt="Preview"

                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              <div className="
                text-sm
                text-[#6E8B88]
                text-center
              ">

                Drag & drop image here

                <br />

                atau klik untuk upload

              </div>

            )}

          </div>

        </div>

        {/* ERROR */}
        {error && (

          <div className="bg-red-100 text-red-600 text-sm p-4 rounded-xl">

            {error}

          </div>

        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#90BAB7] hover:bg-[#7DA7A4] transition-all text-white font-bold py-4 rounded-xl"
        >

          {loading
            ? "Loading..."
            : "Simpan Challenge"}

        </button>

      </form>

    </div>
  );
}