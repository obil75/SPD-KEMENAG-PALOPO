import React, { useState } from "react";
import { Plus, Search, Printer, Edit, Trash2, Calendar, MapPin, ClipboardList, Check, UserPlus } from "lucide-react";
import { Sppd } from "../types";

interface SppdListProps {
  sppdS: Sppd[];
  onAddNew: () => void;
  onEdit: (sppd: Sppd) => void;
  onDelete: (id: string, nomor: string) => void;
  onPrint: (sppd: Sppd) => void;
}

export default function SppdList({
  sppdS,
  onAddNew,
  onEdit,
  onDelete,
  onPrint,
}: SppdListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; nomor: string; namaPegawai: string } | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id, deleteTarget.nomor);
      showNotification("Arsip SPPD berhasil dihapus!");
      setDeleteTarget(null);
    }
  };

  const formatIndoDate = (dateStr: string): string => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return dateStr;
    }
  };

  const filtered = sppdS.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.nomor.toLowerCase().includes(term) ||
      item.namaPegawai.toLowerCase().includes(term) ||
      item.tempatTujuan.toLowerCase().includes(term) ||
      item.maksudPerjalanan.toLowerCase().includes(term)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    const dateA = a.tanggalBerangkat || "";
    const dateB = b.tanggalBerangkat || "";
    if (dateA !== dateB) {
      return dateA.localeCompare(dateB);
    }
    const issueA = a.tanggalDikeluarkan || "";
    const issueB = b.tanggalDikeluarkan || "";
    if (issueA !== issueB) {
      return issueA.localeCompare(issueB);
    }
    return (a.nomor || "").localeCompare(b.nomor || "");
  });

  return (
    <div className="space-y-3.5">
      {/* Control/Search Bar & Add Button */}
      <div className="rounded-xl border border-gray-100 bg-white px-4 py-2.5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="relative w-full max-w-lg">
          <Search className="absolute top-2.5 left-3.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Cari SPPD berdasarkan nomor, nama pegawai, tujuan, atau maksud perjalanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50/50 py-1.5 pr-4 pl-10 text-sm text-gray-800 placeholder-gray-400 outline-hidden transition focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A]"
          />
        </div>
        <button
          onClick={onAddNew}
          id="btn-add-sppd"
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1B3022] hover:bg-[#2A4533] text-white px-3 py-1.5 text-xs font-semibold transition shadow-sm shrink-0"
        >
          <Plus size={14} />
          <span>Buat SPPD Baru</span>
        </button>
      </div>

      {/* List / Table of SPPDs */}
      {filtered.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 text-[11px] font-semibold uppercase tracking-wider">
                <th className="px-4 py-3.5 text-center w-12">No</th>
                <th className="px-4 py-3.5 min-w-[160px]">Nama / NIP Pelaksana</th>
                <th className="px-4 py-3.5 min-w-[220px]">Nomor & Tanggal SPPD</th>
                <th className="px-4 py-3.5 min-w-[125px]">Tempat Tujuan</th>
                <th className="px-4 py-3.5 min-w-[200px]">Maksud Perjalanan Dinas</th>
                <th className="px-4 py-3.5 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {sorted.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition">
                  <td className="px-4 py-4 text-center text-gray-400 font-mono">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-semibold text-gray-950 text-xs">{item.namaPegawai}</div>
                    <div className="text-[10px] text-gray-400 font-mono mt-0.5">NIP. {item.nipPegawai || "-"}</div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-mono text-[11px] text-gray-700 font-semibold break-all">
                      {item.nomor}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-gray-500">
                      <Calendar size={12} className="text-gray-400 shrink-0" />
                      <div className="text-[10px]">
                        <span className="font-medium text-gray-800">{formatIndoDate(item.tanggalBerangkat)}</span>
                        <span className="text-gray-400 mx-1">s/d</span>
                        <span className="font-medium text-gray-800">{formatIndoDate(item.tanggalKembali)}</span>
                        <span className="ml-1.5 text-[9px] font-bold text-[#BFA07A] bg-[#F7F5F2] border border-[#E5E2DD] px-1 py-0.2 rounded-xs">
                          {item.lamaPerjalanan}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-gray-405 shrink-0" />
                      <span className="font-semibold text-[#1B3022]">{item.tempatTujuan}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 max-w-sm">
                    <div className="line-clamp-2 whitespace-normal break-words leading-relaxed" title={item.maksudPerjalanan}>
                      {item.maksudPerjalanan}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => onPrint(item)}
                        className="rounded-lg p-1.5 text-[#1B3022] hover:bg-[#E0E7E1]/50 hover:text-[#2A4533] transition border border-transparent hover:border-[#2A4533]/20"
                        title="Cetak SPPD"
                        id={`btn-print-${item.id}`}
                      >
                        <Printer size={14} />
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50 transition border border-transparent hover:border-blue-100"
                        title="Ubah SPPD"
                        id={`btn-edit-${item.id}`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ id: item.id, nomor: item.nomor, namaPegawai: item.namaPegawai })}
                        className="rounded-lg p-1.5 text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
                        title="Hapus SPPD"
                        id={`btn-del-${item.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center text-gray-400 shadow-xs">
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
            <ClipboardList size={48} className="text-[#E0E7E1] mb-3 stroke-[1.5]" />
            <h5 className="font-bold text-gray-800 text-base">Arsip SPPD Kosong</h5>
            <p className="text-xs text-gray-500 mt-1 lines-relaxed">
              Belum ada dokumen Surat Perjalanan Dinas yang direkam atau pencarian Anda tidak menghasilkan berkas apapun.
            </p>
            <button
              onClick={onAddNew}
              className="mt-4 outline-none rounded-xl bg-[#E0E7E1]/50 text-[#1B3022] hover:bg-[#E0E7E1] border border-[#2A4533]/15 px-4 py-2 text-xs font-bold transition flex items-center gap-1.5"
            >
              <UserPlus size={14} />
              <span>Rekam SPPD Pertama</span>
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 rounded-xl bg-[#1B3022] px-4.5 py-3 text-white text-xs font-bold shadow-xl border border-[#2A4533]/20 flex items-center gap-2 animate-slide-up-fade">
          <Check size={16} className="text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Custom Confirmation Modal for Deleting SPPD */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-scale-up text-[#2D2A26]">
            {/* Modal Header */}
            <div className="bg-rose-600 px-6 py-4.5 text-white flex items-center gap-3 font-sans">
              <div className="p-1 bg-white/20 rounded-lg">
                <Trash2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Konfirmasi Hapus SPPD</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3 font-sans">
              <p className="text-sm text-gray-600 text-left">
                Apakah Anda yakin ingin menghapus arsip Surat Perjalanan Dinas (SPPD) berikut? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 space-y-1.5 text-left">
                <div className="text-[10px] font-bold text-[#8A847C] uppercase tracking-wider font-mono">Nomor SPPD</div>
                <div className="font-mono text-xs font-bold text-gray-900 break-all">{deleteTarget.nomor}</div>
                <hr className="border-gray-200/65 my-1" />
                <div className="text-[10px] font-bold text-[#8A847C] uppercase tracking-wider">Aparatur Pelaksana</div>
                <div className="font-bold text-gray-800 text-sm">{deleteTarget.namaPegawai}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 pb-6 pt-2 font-sans">
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
