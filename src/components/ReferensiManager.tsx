import React, { useState } from "react";
import { Save, User, Shield, Check, Info } from "lucide-react";
import { Referensi, Ppk, KepalaKantor } from "../types";

interface ReferensiManagerProps {
  referensi: Referensi;
  setReferensi: React.Dispatch<React.SetStateAction<Referensi>>;
}

export default function ReferensiManager({ referensi, setReferensi }: ReferensiManagerProps) {
  // Temporary component state to handle edits before saving
  const [kepala, setKepala] = useState<KepalaKantor>({ ...referensi.kepalaKantor });
  const [ppkList, setPpkList] = useState<Ppk[]>([
    { ...referensi.ppkList[0] },
    { ...referensi.ppkList[1] },
    { ...referensi.ppkList[2] },
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const handlePpkChange = (index: number, key: keyof Ppk, val: string) => {
    setPpkList((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: val };
      return copy;
    });
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setReferensi({
      kepalaKantor: kepala,
      ppkList: ppkList,
    });
    setNotification("Referensi Pejabat berhasil diperbarui dan disimpan!");
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Save Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#15261B] text-white px-5 py-4 shadow-xl transition-all duration-300">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#BFA07A] text-white">
            <Check size={14} className="stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6 pb-12">
        {/* 1. Kepala Kantor Section */}
        <div className="rounded-2xl border border-[#E5E2DD] bg-white shadow-xs overflow-hidden">
          <div className="border-b border-[#E5E2DD] bg-[#E0E7E1]/20 px-6 py-4.5 flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-[#1B3022] flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Kepala Kantor Kementerian Agama</h3>
              <p className="text-xs text-gray-500 font-medium font-serif italic">Pejabat tertinggi yang menerbitkan instruksi tugas / surat perintah</p>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">Nama Kepala Kantor</label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition font-semibold"
                value={kepala.nama}
                onChange={(e) => setKepala({ ...kepala, nama: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">NIP Kepala Kantor</label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50/50 px-4 py-2.5 text-xs font-mono text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition"
                value={kepala.nip}
                onChange={(e) => setKepala({ ...kepala, nip: e.target.value.replace(/[^0-9]/g, "") })}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700 block">Unit Kerja / Instansi</label>
              <input
                type="text"
                className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition"
                value={kepala.unitKerja}
                onChange={(e) => setKepala({ ...kepala, unitKerja: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        {/* 2. Pejabat Pembuat Komitmen (3 PPK) Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-[#1B3022]" />
            <h3 className="text-lg font-bold text-gray-900">Pejabat Pembuat Komitmen (PPK)</h3>
            <span className="rounded-full bg-[#E0E7E1]/60 text-[#1B3022] text-xs font-semibold px-2.5 py-1 border border-[#2A4533]/15">
              Terdapat 3 Pejabat
            </span>
          </div>

          <div className="space-y-6">
            {ppkList.map((ppk, idx) => (
              <div
                key={ppk.id}
                className="rounded-2xl border border-[#E5E2DD] bg-white shadow-xs overflow-hidden"
              >
                {/* Form fields in 3 columns - styled exactly like Kepala Kantor */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">Nama Pejabat (PPK)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition font-semibold"
                      value={ppk.nama}
                      onChange={(e) => handlePpkChange(idx, "nama", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">NIP Pejabat (PPK)</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50/50 px-4 py-2.5 text-xs font-mono text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition"
                      value={ppk.nip}
                      onChange={(e) => handlePpkChange(idx, "nip", e.target.value.replace(/[^0-9]/g, ""))}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 block">Unit Kerja / Bagian</label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition"
                      value={ppk.unitKerja}
                      onChange={(e) => handlePpkChange(idx, "unitKerja", e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-4 border-t border-[#E5E2DD]">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1B3022] hover:bg-[#2A4533] text-white font-bold px-6 py-3 transition shadow-md hover:shadow-lg"
          >
            <Save size={18} />
            <span>Simpan Seluruh Referensi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
