import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Briefcase, Award, Hash, Check, RefreshCw, Users, ChevronUp, ChevronDown } from "lucide-react";
import { Pegawai } from "../types";

interface PegawaiManagerProps {
  pegawai: Pegawai[];
  setPegawai: React.Dispatch<React.SetStateAction<Pegawai[]>>;
}

export default function PegawaiManager({ pegawai, setPegawai }: PegawaiManagerProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; nama: string } | null>(null);

  // Form states
  const [nama, setNama] = useState("");
  const [nip, setNip] = useState("");
  const [pangkatGolongan, setPangkatGolongan] = useState("");
  const [jabatan, setJabatan] = useState("");
  const [unitKerja, setUnitKerja] = useState("");
  const [tingkatBiaya, setTingkatBiaya] = useState("Tingkat C");

  const [notification, setNotification] = useState<string | null>(null);

  const resetForm = () => {
    setNama("");
    setNip("");
    setPangkatGolongan("");
    setJabatan("");
    setUnitKerja("");
    setTingkatBiaya("Tingkat C");
    setEditId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Pegawai) => {
    setEditId(p.id);
    setNama(p.nama);
    setNip(p.nip);
    setPangkatGolongan(p.pangkatGolongan);
    setJabatan(p.jabatan);
    setUnitKerja(p.unitKerja);
    setTingkatBiaya(p.tingkatBiaya);
    setIsModalOpen(true);
  };

  const handleMoveRow = (id: string, direction: "up" | "down") => {
    setPegawai((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx === -1) return prev;
      
      const newIndex = direction === "up" ? idx - 1 : idx + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const updated = [...prev];
      const temp = updated[idx];
      updated[idx] = updated[newIndex];
      updated[newIndex] = temp;
      return updated;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !nip) {
      alert("Nama dan NIP harus diisi!");
      return;
    }

    if (editId) {
      // Update
      setPegawai((prev) =>
        prev.map((item) =>
          item.id === editId
            ? { ...item, nama, nip, pangkatGolongan, jabatan, unitKerja, tingkatBiaya }
            : item
        )
      );
      showNotification("Data pegawai berhasil diperbarui!");
    } else {
      // Insert
      const newPegawai: Pegawai = {
        id: "peg-" + Date.now().toString(),
        nama,
        nip,
        pangkatGolongan,
        jabatan,
        unitKerja,
        tingkatBiaya,
      };
      setPegawai((prev) => [newPegawai, ...prev]);
      showNotification("Pegawai baru berhasil ditambahkan!");
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string, namaPegawai: string) => {
    setDeleteTarget({ id, nama: namaPegawai });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      setPegawai((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showNotification("Data pegawai berhasil dihapus!");
      setDeleteTarget(null);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredPegawai = pegawai.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.nama.toLowerCase().includes(term) ||
      p.nip.includes(term) ||
      p.jabatan.toLowerCase().includes(term) ||
      p.unitKerja.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-3.5">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl bg-[#15261B] text-white px-5 py-4 shadow-xl transition-all duration-300 animate-slide-up">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#BFA07A] text-white">
            <Check size={14} className="stroke-[3]" />
          </div>
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Control/Search Bar & Add Button */}
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full max-w-md">
          <Search className="absolute top-2.5 left-3.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari pegawai berdasarkan nama, NIP, jabatan, atau unit kerja..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-[#E5E2DD] bg-gray-50/50 py-1.5 pr-4 pl-10 text-sm text-[#2D2A26] placeholder-gray-400 outline-hidden transition focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A]"
          />
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1B3022] hover:bg-[#2A4533] text-white px-3 py-1.5 text-xs font-semibold transition shadow-sm hover:shadow-md shrink-0"
        >
          <Plus size={14} />
          <span>Tambah Pegawai</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-2 py-3.5 text-center w-8">No</th>
                <th className="px-4 py-3.5">Nama / NIP</th>
                <th className="px-4 py-3.5">Pangkat / Golongan</th>
                <th className="px-4 py-3.5">Jabatan</th>
                <th className="px-4 py-3.5">Unit Kerja</th>
                <th className="px-4 py-3.5 text-center">Tingkat Biaya</th>
                <th className="px-4 py-3.5 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredPegawai.length > 0 ? (
                filteredPegawai.map((p, idx) => {
                  const masterIndex = pegawai.findIndex((item) => item.id === p.id);
                  const isFirst = masterIndex === 0;
                  const isLast = masterIndex === pegawai.length - 1;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-2 py-3 text-center text-gray-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-900 text-xs">{p.nama}</div>
                        <div className="text-[10px] text-gray-500 font-mono mt-0.5">NIP. {p.nip || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-700">
                        {p.pangkatGolongan || (
                          <span className="text-gray-300 italic text-[10px]">Belum diatur</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[220px]">
                        <div className="line-clamp-3 whitespace-normal break-words leading-relaxed" title={p.jabatan}>
                          {p.jabatan || <span className="text-gray-300 italic text-[10px]">Belum diatur</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E0E7E1]/50 text-[#1B3022] px-2 py-0.5 text-[10px] font-medium border border-[#2A4533]/15">
                          {p.unitKerja || "Umum / Tata Usaha"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center justify-center rounded-md bg-white text-[#BFA07A] border border-[#E5E2DD] px-1.5 py-0.5 font-mono text-[10px] font-bold">
                          {p.tingkatBiaya || "Tingkat C"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Tombol pengatur posisi baris (Atas/Bawah) gabung satu kolom tanpa garis kotak melingkar */}
                          <div className="flex flex-col items-center">
                            <button
                              onClick={() => handleMoveRow(p.id, "up")}
                              disabled={isFirst}
                              className={`p-1 transition rounded-md ${
                                isFirst
                                  ? "text-gray-200 cursor-not-allowed opacity-35"
                                  : "text-amber-600 hover:bg-amber-50 hover:text-amber-800"
                              }`}
                              title="Pindahkan Ke Atas"
                              id={`btn-move-up-${p.id}`}
                            >
                              <ChevronUp size={12} className="stroke-[3]" />
                            </button>
                            <button
                              onClick={() => handleMoveRow(p.id, "down")}
                              disabled={isLast}
                              className={`p-1 transition rounded-md ${
                                isLast
                                  ? "text-gray-200 cursor-not-allowed opacity-35"
                                  : "text-amber-600 hover:bg-amber-50 hover:text-amber-800"
                              }`}
                              title="Pindahkan Ke Bawah"
                              id={`btn-move-down-${p.id}`}
                            >
                              <ChevronDown size={12} className="stroke-[3]" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="rounded-lg p-1 text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-100"
                            title="Ubah Data"
                            id={`btn-edit-${p.id}`}
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id, p.nama)}
                            className="rounded-lg p-1 text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
                            title="Hapus Data"
                            id={`btn-del-${p.id}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <Users size={36} className="text-gray-300 mb-2 stroke-[1.5]" />
                      <p className="font-medium text-gray-500">Pegawai tidak ditemukan</p>
                      <p className="text-xs text-gray-400 mt-1">Coba masukkan nama atau NIP yang berbeda.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-scale-up">
            {/* Modal Header */}
            <div className="bg-[#1B3022] px-6 py-4.5 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editId ? "Ubah Data Pegawai" : "Tambah Pegawai Baru"}
                </h3>
                <p className="text-xs text-[#E0E7E1] mt-0.5">
                  Isi data di bawah ini secara lengkap dan akurat.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 hover:bg-[#2A4533] text-[#E0E7E1] hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {/* Nama Pegawai */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 tracking-wide block">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition font-semibold"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* NIP */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 tracking-wide block">
                    NIP (Nomor Induk Pegawai) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50 pl-10 pr-3.5 py-2.5 text-sm font-mono text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition"
                      value={nip}
                      onChange={(e) => setNip(e.target.value.replace(/[^0-9]/g, ""))}
                      required
                    />
                  </div>
                </div>

                {/* Pangkat & Golongan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 tracking-wide block">
                    Pangkat dan Golongan
                  </label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 text-gray-400 z-10" size={16} />
                    <select
                      className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition font-semibold"
                      value={pangkatGolongan}
                      onChange={(e) => setPangkatGolongan(e.target.value)}
                    >
                      <option value="">-- Pilih Pangkat dan Golongan --</option>
                      <option value="Pembina Utama, IV/e">Pembina Utama, IV/e</option>
                      <option value="Pembina Utama Madya, IV/d">Pembina Utama Madya, IV/d</option>
                      <option value="Pembina Utama Muda, IV/c">Pembina Utama Muda, IV/c</option>
                      <option value="Pembina Tingkat I, IV/b">Pembina Tingkat I, IV/b</option>
                      <option value="Pembina, IV/a">Pembina, IV/a</option>
                      <option value="Penata Tingkat I, III/d">Penata Tingkat I, III/d</option>
                      <option value="Penata, III/c">Penata, III/c</option>
                      <option value="Penata Muda Tingkat I, III/b">Penata Muda Tingkat I, III/b</option>
                      <option value="Penata Muda, III/a">Penata Muda, III/a</option>
                      <option value="Pengatur Tingkat I, II/d">Pengatur Tingkat I, II/d</option>
                      <option value="Pengatur, II/c">Pengatur, II/c</option>
                      <option value="Pengatur Muda Tingkat I, II/b">Pengatur Muda Tingkat I, II/b</option>
                      <option value="Pengatur Muda, II/a">Pengatur Muda, II/a</option>
                    </select>
                  </div>
                </div>

                {/* Jabatan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700 tracking-wide block">
                    Jabatan / Instansi
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="text"
                      className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition"
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Unit Kerja */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 tracking-wide block">
                      Unit Kerja
                    </label>
                    <select
                      className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition"
                      value={unitKerja}
                      onChange={(e) => setUnitKerja(e.target.value)}
                    >
                      <option value="">-- Pilih Unit Kerja --</option>
                      <option value="Sekretariat Jenderal">Sekretariat Jenderal</option>
                      <option value="Pendidikan Islam">Pendidikan Islam</option>
                      <option value="Bimas Islam">Bimas Islam</option>
                    </select>
                  </div>

                  {/* Tingkat Biaya */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700 tracking-wide block">
                      Tingkat Biaya
                    </label>
                    <select
                      className="w-full rounded-xl border border-[#E5E2DD] bg-gray-50 px-3 py-2.5 text-sm font-semibold text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition"
                      value={tingkatBiaya}
                      onChange={(e) => setTingkatBiaya(e.target.value)}
                    >
                      <option value="Tingkat A">Tingkat A (Pejabat Eselon I dan pejabat lainnya yang setara)</option>
                      <option value="Tingkat B">Tingkat B (Pejabat Eselon II dan pejabat lainnya yang setara)</option>
                      <option value="Tingkat C">Tingkat C (Pejabat Eselon III / PNS Golongan IV, III, II, Non ASN)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-gray-200 text-gray-700 font-semibold px-4.5 py-2.5 text-sm hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#1B3022] hover:bg-[#2A4533] text-white font-bold px-5 py-2.5 text-sm transition shadow-sm"
                >
                  {editId ? "Simpan Perubahan" : "Simpan Baru"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal for Deleting */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-scale-up">
            {/* Modal Header */}
            <div className="bg-rose-600 px-6 py-4.5 text-white flex items-center gap-3">
              <div className="p-1 bg-white/20 rounded-lg">
                <Trash2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Konfirmasi Hapus</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3">
              <p className="text-sm text-gray-600">
                Apakah Anda yakin ingin menghapus data pegawai berikut? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <div className="font-bold text-gray-950 text-base">{deleteTarget.nama}</div>
                <div className="text-xs text-gray-500 font-mono mt-1">
                  NIP. {pegawai.find((p) => p.id === deleteTarget.id)?.nip || "-"}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-gray-200 text-gray-700 font-semibold px-4.5 py-2.5 text-sm hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 text-sm transition shadow-sm"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
