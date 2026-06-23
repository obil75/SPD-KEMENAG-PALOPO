import React, { useState, useEffect } from "react";
import { ArrowLeft, UserPlus, Trash2, Calendar, MapPin, ClipboardList, Info, HelpCircle } from "lucide-react";
import { Sppd, Pegawai, Referensi, Pengikut } from "../types";

interface SppdFormProps {
  sppdToEdit: Sppd | null;
  sppdS: Sppd[];
  pegawaiList: Pegawai[];
  referensi: Referensi;
  onSave: (sppd: Sppd) => void;
  onCancel: () => void;
}

export default function SppdForm({
  sppdToEdit,
  sppdS,
  pegawaiList,
  referensi,
  onSave,
  onCancel,
}: SppdFormProps) {
  // Helper to generate next nomor SPPD
  const getNextNomor = (dateStr: string) => {
    let maxNum = 0; // default start
    let hasValidNum = false;
    if (sppdS && sppdS.length > 0) {
      sppdS.forEach(s => {
        if (s.nomor) {
          const parts = s.nomor.split("/");
          const firstPart = parseInt(parts[0], 10);
          if (!isNaN(firstPart)) {
            hasValidNum = true;
            if (firstPart > maxNum) {
              maxNum = firstPart;
            }
          }
        }
      });
    }
    // If no valid numbers exist in current records, fallback to 170
    if (!hasValidNum) {
      maxNum = 170;
    }
    const nextVal = maxNum + 1;
    const nextPrefix = String(nextVal).padStart(3, "0");
    const dateParts = dateStr.split("-");
    const formattedYear = dateParts[0] || "2026";
    const formattedMonth = dateParts[1] || "06";
    return `${nextPrefix}/Kk.21.14/1-b/KU.02.1/${formattedMonth}/${formattedYear}`;
  };

  // Form states
  const [id] = useState(sppdToEdit?.id || "sppd-" + Date.now().toString());
  const [isNomorTouched, setIsNomorTouched] = useState(false);
  const [nomor, setNomor] = useState(() => {
    if (sppdToEdit) {
      return sppdToEdit.nomor || "";
    }
    const initialDate = new Date().toISOString().split("T")[0];
    return getNextNomor(initialDate);
  });
  const [lembarKe, setLembarKe] = useState(sppdToEdit?.lembarKe || "I / II / III / IV");
  const [kodeNo, setKodeNo] = useState(sppdToEdit?.kodeNo || "-");
  
  const [ppkId, setPpkId] = useState(sppdToEdit?.ppkId || referensi.ppkList[0]?.id || "");
  const [pegawaiId, setPegawaiId] = useState(sppdToEdit?.pegawaiId || "");
  
  // Custom states for the SPPD's specific employee details (falls back on main directory)
  const [namaPegawai, setNamaPegawai] = useState(sppdToEdit?.namaPegawai || "");
  const [nipPegawai, setNipPegawai] = useState(sppdToEdit?.nipPegawai || "");
  const [pangkatGolonganPegawai, setPangkatGolonganPegawai] = useState(sppdToEdit?.pangkatGolonganPegawai || "");
  const [jabatanPegawai, setJabatanPegawai] = useState(sppdToEdit?.jabatanPegawai || "");
  const [tingkatBiaya, setTingkatBiaya] = useState(sppdToEdit?.tingkatBiaya || "Tingkat C");
  
  const [maksudPerjalanan, setMaksudPerjalanan] = useState(sppdToEdit?.maksudPerjalanan || "");
  const [alatAngkutan, setAlatAngkutan] = useState(sppdToEdit?.alatAngkutan || "Kendaraan Pribadi");
  const [tempatBerangkat, setTempatBerangkat] = useState(sppdToEdit?.tempatBerangkat || "Palopo");
  const [tempatTujuan, setTempatTujuan] = useState(sppdToEdit?.tempatTujuan || "Makassar");
  const [lamaPerjalanan, setLamaPerjalanan] = useState(sppdToEdit?.lamaPerjalanan || "3 (Tiga) hari");
  
  const [tanggalBerangkat, setTanggalBerangkat] = useState(sppdToEdit?.tanggalBerangkat || "");
  const [tanggalKembali, setTanggalKembali] = useState(sppdToEdit?.tanggalKembali || "");
  
  // Pengikut (Followers) list
  const [pengikut, setPengikut] = useState<Pengikut[]>(sppdToEdit?.pengikut || []);
  
  const [pembebananAnggaranInstansi, setPembebananAnggaranInstansi] = useState(
    sppdToEdit?.pembebananAnggaranInstansi || "Kantor Kementerian Agama Kota Palopo"
  );
  const [pembebananAnggaranAkun, setPembebananAnggaranAkun] = useState(
    sppdToEdit?.pembebananAnggaranAkun || "524111"
  );
  const [keteranganLain, setKeteranganLain] = useState(
    sppdToEdit?.keteranganLain || "Dipa Kantor Kementerian Agama Kota Palopo Anggaran Tahun 2026"
  );
  
  const [dikeluarkanDi, setDikeluarkanDi] = useState(sppdToEdit?.dikeluarkanDi || "Palopo");
  const [tanggalDikeluarkan, setTanggalDikeluarkan] = useState(
    sppdToEdit?.tanggalDikeluarkan || new Date().toISOString().split("T")[0]
  );

  // Auto update month and year when tanggalDikeluarkan changes (if new SPPD and user has not typed manual Nomor)
  useEffect(() => {
    if (!sppdToEdit && !isNomorTouched) {
      setNomor(getNextNomor(tanggalDikeluarkan));
    }
  }, [tanggalDikeluarkan, isNomorTouched, sppdToEdit]);

  // Setup automatically if adding / choosing a Pegawai
  const handlePegawaiSelect = (id: string) => {
    setPegawaiId(id);
    const selected = pegawaiList.find((p) => p.id === id);
    if (selected) {
      setNamaPegawai(selected.nama);
      setNipPegawai(selected.nip);
      setPangkatGolonganPegawai(selected.pangkatGolongan);
      setJabatanPegawai(selected.jabatan);
      setTingkatBiaya(selected.tingkatBiaya);

      // Match PPK automatically based on Pegawai's unitKerja
      if (selected.unitKerja) {
        const uLower = selected.unitKerja.toLowerCase();
        
        let matchedPpk = referensi.ppkList.find(ppk => {
          const pUnit = ppk.unitKerja.toLowerCase();
          const pLabel = ppk.label.toLowerCase();
          return uLower.includes(pUnit) || pUnit.includes(uLower) || uLower.includes(pLabel) || pLabel.includes(uLower);
        });

        // Fallback keywords for matching
        if (!matchedPpk) {
          if (
            uLower.includes("pendis") || 
            uLower.includes("pendidikan") || 
            uLower.includes("madrasah") || 
            uLower.includes("sekolah") || 
            uLower.includes("haji") || 
            uLower.includes("umrah") || 
            uLower.includes("phu")
          ) {
            matchedPpk = referensi.ppkList.find(ppk => 
              ppk.unitKerja.toLowerCase().includes("pendidikan") || 
              ppk.label.toLowerCase().includes("pendis") || 
              ppk.label.toLowerCase().includes("phu")
            );
          } else if (
            uLower.includes("bimas") || 
            uLower.includes("kua") || 
            uLower.includes("masjid") || 
            uLower.includes("keagamaan")
          ) {
            matchedPpk = referensi.ppkList.find(ppk => 
              ppk.unitKerja.toLowerCase().includes("bimas") || 
              ppk.label.toLowerCase().includes("bimas")
            );
          } else if (
            uLower.includes("tata usaha") || 
            uLower.includes("tu") || 
            uLower.includes("umum") || 
            uLower.includes("sekretariat") || 
            uLower.includes("kepegawaian") || 
            uLower.includes("keuangan")
          ) {
            matchedPpk = referensi.ppkList.find(ppk => 
              ppk.unitKerja.toLowerCase().includes("sekretariat") || 
              ppk.label.toLowerCase().includes("sekretariat") || 
              ppk.label.toLowerCase().includes("tata usaha") || 
              ppk.label.toLowerCase().includes("tu")
            );
          }
        }

        if (matchedPpk) {
          setPpkId(matchedPpk.id);
        }
      }
    }
  };

  // Sync date changes to "Lama Perjalanan" if both are set!
  useEffect(() => {
    if (tanggalBerangkat && tanggalKembali) {
      const d1 = new Date(tanggalBerangkat);
      const d2 = new Date(tanggalKembali);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
      if (!isNaN(diffDays) && diffDays > 0) {
        setLamaPerjalanan(`${diffDays} hari`);
      }
    }
  }, [tanggalBerangkat, tanggalKembali]);

  // Handle followers management
  const handleAddPengikut = () => {
    setPengikut([...pengikut, { nama: "", tanggalLahir: "", keterangan: "" }]);
  };

  const handleRemovePengikut = (idx: number) => {
    setPengikut(pengikut.filter((_, i) => i !== idx));
  };

  const handlePengikutChange = (idx: number, key: keyof Pengikut, val: string) => {
    const updated = [...pengikut];
    updated[idx] = { ...updated[idx], [key]: val };
    setPengikut(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomor) {
      alert("Nomor SPPD tidak boleh kosong!");
      return;
    }
    if (!pegawaiId && !namaPegawai) {
      alert("Pegawai pelaksana tugas harus dipilih atau diisi!");
      return;
    }

    // Lookup chosen PPK and Kepala Kantor from referensi
    const selectedPpk = referensi.ppkList.find((p) => p.id === ppkId) || referensi.ppkList[0];

    const finalSppd: Sppd = {
      id,
      nomor,
      lembarKe,
      kodeNo,
      ppkId,
      pegawaiId,
      namaPegawai,
      nipPegawai,
      pangkatGolonganPegawai,
      jabatanPegawai,
      tingkatBiaya,
      maksudPerjalanan,
      alatAngkutan,
      tempatBerangkat,
      tempatTujuan,
      lamaPerjalanan,
      tanggalBerangkat,
      tanggalKembali,
      pengikut,
      pembebananAnggaranInstansi,
      pembebananAnggaranAkun,
      keteranganLain,
      dikeluarkanDi,
      tanggalDikeluarkan,
      
      // Store frozen signature data so they don't break historic printed copies if metadata changes!
      ppkNama: selectedPpk?.nama || "",
      ppkNip: selectedPpk?.nip || "",
      kepalaKantorNama: referensi.kepalaKantor.nama,
      kepalaKantorNip: referensi.kepalaKantor.nip,
    };

    onSave(finalSppd);
  };

  return (
    <div className="space-y-6">
      {/* Back & Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onCancel}
          className="rounded-xl border border-[#E5E2DD] bg-white p-2.5 text-gray-700 hover:bg-gray-50 transition shadow-xs"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {sppdToEdit ? "Edit Surat Perjalanan Dinas" : "Buat Dokumen SPPD Baru"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Form isian logis untuk memproduksi output cetakan Surat Perjalanan Dinas yang sah.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT FORM COLUMN: Metadata & Pelaksana */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bagian I : DATA PELAKSANA SPPD */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-6">
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-4">
                <ClipboardList size={18} className="text-[#1B3022]" />
                <h3 className="font-bold text-gray-900 text-sm">Bagian I : DATA PELAKSANA SPPD</h3>
              </div>

              {/* Sub-bagian A: Identitas & Penomoran */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Tanggal Dikeluarkan <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                      value={tanggalDikeluarkan}
                      onChange={(e) => setTanggalDikeluarkan(e.target.value)}
                      required
                    />
                  </div>

                  <div className="md:col-span-5 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Nomor SPPD <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 font-mono focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                      placeholder="Contoh: 168/Kk.21.14/1-b/KU.02.1/06/2021"
                      value={nomor}
                      onChange={(e) => {
                        setNomor(e.target.value);
                        setIsNomorTouched(true);
                      }}
                      required
                    />
                  </div>

                  <div className="md:col-span-3 space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">Dikeluarkan di <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                      placeholder="Contoh: Palopo"
                      value={dikeluarkanDi}
                      onChange={(e) => setDikeluarkanDi(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

            {/* Sub-bagian B: Pegawai Pelaksana */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 block">Pilih dari Database Pegawai</label>
                <select
                  className="w-full rounded-xl border border-gray-200 bg-[#E0E7E1]/20 px-3 py-2.5 text-sm font-semibold text-gray-900 focus:border-[#BFA07A] focus:bg-white focus:ring-1 focus:ring-[#BFA07A] outline-none transition"
                  value={pegawaiId}
                  onChange={(e) => handlePegawaiSelect(e.target.value)}
                >
                  <option value="">-- PILIH PEGAWAI --</option>
                  {pegawaiList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nama} - {p.unitKerja || "Umum / Tata Usaha"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fields are auto-populated from selection behind the scenes, no need to show them for manual editing */}
            </div>

            {/* Sub-bagian C: Rincian Tujuan & Perjalanan */}
            <div className="border-t border-gray-100 pt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Maksud Perjalanan Dinas <span className="text-red-500">*</span></label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                  value={maksudPerjalanan}
                  onChange={(e) => setMaksudPerjalanan(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 font-sans">
                  <label className="text-xs font-semibold text-gray-700">Alat Angkutan yang Dipergunakan <span className="text-red-500">*</span></label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                    value={alatAngkutan}
                    onChange={(e) => setAlatAngkutan(e.target.value)}
                    required
                  >
                    <option value="">-- Pilih Alat Angkutan --</option>
                    <option value="Kendaraan Dinas">Kendaraan Dinas</option>
                    <option value="Kendaraan Pribadi">Kendaraan Pribadi</option>
                    <option value="Kendaraan Umum">Kendaraan Umum</option>
                    <option value="Kendaraan Lainnya">Kendaraan Lainnya</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Tempat Berangkat</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                    placeholder="Contoh: Palopo"
                    value={tempatBerangkat}
                    onChange={(e) => setTempatBerangkat(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Tempat Tujuan</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                    placeholder="Contoh: Makassar"
                    value={tempatTujuan}
                    onChange={(e) => setTempatTujuan(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Lamanya Perjalanan Dinas</label>
                  <input
                    type="text"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                    placeholder="e.g. 3 (Tiga) hari"
                    value={lamaPerjalanan}
                    onChange={(e) => setLamaPerjalanan(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Tanggal Berangkat <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white outline-hidden transition"
                      value={tanggalBerangkat}
                      onChange={(e) => setTanggalBerangkat(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Tanggal Harus Kembali / Tiba <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 text-gray-400" size={16} />
                    <input
                      type="date"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 pl-10 pr-3.5 py-2.5 text-sm text-gray-900 focus:border-emerald-500 focus:bg-white outline-hidden transition"
                      value={tanggalKembali}
                      onChange={(e) => setTanggalKembali(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bloking 4: Pengikut (Followers) */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <ClipboardList size={18} className="text-[#1B3022]" />
                <h3 className="font-bold text-gray-900 text-sm">Bagian II: Pengikut (Jika Ada)</h3>
              </div>
                <button
                  type="button"
                  onClick={handleAddPengikut}
                  className="rounded-lg bg-[#E0E7E1]/50 text-[#1B3022] hover:bg-[#E0E7E1] border border-[#2A4533]/15 px-3 py-1.5 text-xs font-bold transition flex items-center gap-1"
                >
                  <span>+ Tambah</span>
                </button>
              </div>

              {pengikut.length > 0 ? (
                <div className="space-y-3">
                  {pengikut.map((item, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 relative items-end md:items-center">
                      <div className="text-xs font-mono font-bold text-gray-400 bg-white w-6 h-6 flex items-center justify-center rounded-full border border-gray-250 shrink-0">
                        {idx + 1}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 w-full text-left">
                        <div className="space-y-0.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
                          <input
                            type="text"
                            placeholder="Isi nama pengikut..."
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-500 outline-none transition uppercase"
                            value={item.nama}
                            onChange={(e) => handlePengikutChange(idx, "nama", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-0.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Tanggal Lahir</label>
                          <input
                            type="date"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-500 outline-none transition"
                            value={item.tanggalLahir}
                            onChange={(e) => handlePengikutChange(idx, "tanggalLahir", e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-0.5">
                          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Keterangan / Hubungan</label>
                          <input
                            type="text"
                            placeholder="Contoh: Pegawai / Anak / Istri"
                            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-900 focus:border-emerald-500 outline-none transition"
                            value={item.keterangan}
                            onChange={(e) => handlePengikutChange(idx, "keterangan", e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemovePengikut(idx)}
                        className="rounded-lg p-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition"
                        title="Hapus Pengikut"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  Tidak ada pengikut. Klik &quot;+ Tambah&quot; untuk memasukkan pengikut jika diperlukan.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Budget, Custom Metadata & Issuance */}
          <div className="space-y-6">
            
            {/* Bloking 5: Pembebanan Anggaran */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                <ClipboardList size={18} className="text-[#1B3022]" />
                <h3 className="font-bold text-gray-900 text-sm">Bagian III: Pembebanan Anggaran</h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Instansi Pembeban</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                  placeholder="Kementerian Agama"
                  value={pembebananAnggaranInstansi}
                  onChange={(e) => setPembebananAnggaranInstansi(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Akun Anggaran Dipa</label>
                <input
                  type="text"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition font-mono"
                  placeholder="Contoh: 524111 atau 524119"
                  value={pembebananAnggaranAkun}
                  onChange={(e) => setPembebananAnggaranAkun(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700 block">Keterangan Lain-lain</label>
                <textarea
                  rows={2}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#BFA07A] focus:bg-white outline-hidden transition"
                  placeholder="Contoh: Dipa Kantor Kementerian Agama Kota Palopo..."
                  value={keteranganLain}
                  onChange={(e) => setKeteranganLain(e.target.value)}
                />
              </div>
            </div>


            {/* Sticky Submit panel */}
            <div className="rounded-2xl border border-[#E5E2DD] bg-white p-5 shadow-sm space-y-3">
              <div className="p-4 bg-[#E0E7E1]/30 border border-[#2A4533]/15 text-[#1B3022] rounded-xl space-y-1.5 text-xs mb-1">
                <div className="font-bold flex items-center gap-1">
                  <Info size={14} />
                  <span>Petunjuk Penting</span>
                </div>
                <p className="leading-relaxed">
                  Data penandatangan ditranskripsikan langsung dari data pejabat referensi aktif yang diinput pada tab <strong>Referensi Pejabat</strong> saat pembuatan ini.
                </p>
              </div>

              <button
                type="submit"
                id="btn-save-sppd"
                className="w-full block rounded-xl bg-[#1B3022] hover:bg-[#2A4533] text-white text-center font-bold px-4 py-3.5 text-sm transition shadow-md hover:shadow-lg"
              >
                {sppdToEdit ? "Simpan Perubahan SPPD" : "Simpan & Rekam SPPD"}
              </button>
              
              <button
                type="button"
                onClick={onCancel}
                className="w-full block rounded-xl border border-gray-200 text-gray-700 text-center font-bold px-4 py-3 text-sm hover:bg-gray-50 transition"
              >
                Batalkan
              </button>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}
