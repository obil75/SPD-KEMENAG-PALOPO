import React from "react";
import { ArrowLeft, Printer, AlertTriangle } from "lucide-react";
import { Sppd } from "../types";
import KemenagLogo from "./KemenagLogo";

interface SppdPrintReceiptProps {
  sppd: Sppd;
  onBack: () => void;
}

// Helper to format Indonesian dates to dd Mmmm yyyy
function formatIndoDate(dateStr: string): string {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateStr;
  }
}

export default function SppdPrintReceipt({ sppd, onBack }: SppdPrintReceiptProps) {
  
  const handlePrint = () => {
    // Focus current window context to guarantee browser print targets the parent frame correctly,
    // especially important when running inside iframe preview sandboxes.
    window.focus();
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#15261B]/15 py-8 print:bg-white print:p-0 select-text">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4 portrait;
            margin: 1.2cm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body, #root {
            background-color: white !important;
            color: black !important;
            height: auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .sheet-page {
            width: 100% !important;
            max-width: none !important;
            height: auto !important;
            min-height: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: transparent !important;
            page-break-after: always !important;
            break-after: page !important;
          }
          .sheet-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />
      
      {/* Interactive sticky navigation banner - Hidden from printing! */}
      <div className="max-w-4xl mx-auto mb-6 px-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-[#1B3022] text-white p-5 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="rounded-xl border border-[#2A4533]/25 bg-[#2A4533]/25 p-2 text-white hover:bg-[#2A4533]/55 transition"
              title="Kembali ke Daftar SPPD"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Dokumen Cetak Surat Perjalanan Dinas</h3>
              <p className="text-xs text-[#E0E7E1] mt-0.5">Nomor: {sppd.nomor}</p>
            </div>
          </div>
 
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-[11px] bg-[#BFA07A]/15 text-[#BFA07A] border border-[#BFA07A]/25 px-2.5 py-1 rounded-lg">
              <AlertTriangle size={12} />
              <span>Gunakan opsi portrait saat mengeprint paper / PDF</span>
            </div>
            <button
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#BFA07A] hover:bg-[#a88a65] text-white font-bold px-5 py-2.5 text-sm transition shadow-md"
            >
              <Printer size={16} />
              <span>Mulai Cetak / Cetak PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* DOCUMENT PAGE WRAPPER (Side-by-side on screen, block when printing) */}
      <div className="flex flex-col xl:flex-row gap-6 justify-center items-start w-full max-w-max mx-auto print:block print:space-y-0 print:gap-0 print:max-w-none print:w-full print:mx-0">
        
        {/* SHEET PAGE 1 */}
        <div className="sheet-page w-full max-w-[21cm] bg-white p-[1.2cm] text-black font-sans shadow-2xl border border-gray-300 print:shadow-none print:border-none print:p-0 print:m-0 print:bg-transparent">
          
          {/* ===================================================================== */}
          {/* PAGE 1: SURAT PERJALANAN DINAS (SPD) */}
          {/* ===================================================================== */}
          <section className="relative w-full min-h-[29.7cm] flex flex-col justify-start print:min-h-0 print:mb-[2cm]">
          
          {/* Document Header */}
          <div>
            <div className="flex flex-col items-center justify-center text-center pb-2">
              {/* Official Garland/Logo */}
              <KemenagLogo size={85} className="mb-2" />
              <h1 className="text-base font-bold tracking-widest leading-none">KEMENTERIAN AGAMA</h1>
              <div className="h-5"></div>
            </div>

            {/* Main Metadata Grid - Sub Header with absolute positioning/flex alignment */}
            <div className="grid grid-cols-12 text-[11px] leading-normal py-2">
              <div className="col-span-6 pr-2">
                <div className="flex flex-col">
                  <span className="font-medium whitespace-nowrap">Kementerian Negara/Lembaga :</span>
                  <span className="font-bold text-xs mt-1">KEMENTERIAN AGAMA KOTA PALOPO</span>
                </div>
              </div>

              <div className="col-span-6 space-y-1 pl-6 border-l border-gray-300 print:border-transparent">
                <div className="flex gap-2">
                  <span className="w-24 shrink-0">Lembar Ke</span>
                  <span>:</span>
                  <span className="font-semibold">{sppd.lembarKe || "I / II / III / IV"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-24 shrink-0">Kode No</span>
                  <span>:</span>
                  <span className="font-semibold">{sppd.kodeNo || "-"}</span>
                </div>
                <div className="flex gap-2">
                  <span className="w-24 shrink-0 col-span-3">Nomor</span>
                  <span>:</span>
                  <span className="font-semibold">{sppd.nomor}</span>
                </div>
              </div>
            </div>

            {/* Document Title banner */}
            <div className="text-center py-2.5 bg-gray-50 border border-gray-300 print:bg-transparent tracking-wide mt-1">
              <h2 className="text-xs font-bold underline uppercase tracking-widest leading-none">
                SURAT PERJALANAN DINAS (SPD)
              </h2>
            </div>

            {/* MAIN DATA TABLE: GRID TABLE 10 ITEMS */}
            <div className="border-x border-b border-black text-xs mt-2" style={{ borderTop: "1px solid black" }}>
              
              {/* ROW 1 */}
              <div className="flex border-b border-black">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0">1</div>
                <div className="w-5/12 border-r border-black py-1.5 px-2.5 font-medium">Pejabat Pembuat Komitmen</div>
                <div className="flex-1 py-1.5 px-2.5 font-bold bg-gray-50/20">{sppd.pembebananAnggaranInstansi}</div>
              </div>

              {/* ROW 2 */}
              <div className="flex border-b border-black">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0">2</div>
                <div className="w-5/12 border-r border-black py-1.5 px-2.5 font-medium">
                  Nama/NIP Pegawai yang melaksanakan perjalanan dinas
                </div>
                <div className="flex-1 py-1.5 px-2.5 font-bold leading-tight">
                  {sppd.namaPegawai} <br />
                  <span className="text-[11px] font-mono font-normal tracking-wide">NIP. {sppd.nipPegawai}</span>
                </div>
              </div>

              {/* ROW 3 */}
              <div className="flex border-b border-black">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0">3</div>
                <div className="w-5/12 border-r border-black p-0 flex flex-col justify-between">
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center">a. Pangkat dan Golongan</div>
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center">b. Jabatan / Instansi</div>
                  <div className="py-1 px-2.5 flex-1 flex items-center">c. Tingkat Biaya Perjalanan Dinas</div>
                </div>
                <div className="flex-1 p-0 flex flex-col justify-between font-medium">
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center">
                    a. &nbsp; {sppd.pangkatGolonganPegawai || "-"}
                  </div>
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center leading-normal">
                    b. &nbsp; {sppd.jabatanPegawai || "-"}
                  </div>
                  <div className="py-1 px-2.5 flex-1 flex items-center">
                    c. &nbsp; {sppd.tingkatBiaya || "Tingkat C"}
                  </div>
                </div>
              </div>

              {/* ROW 4 */}
              <div className="flex border-b border-black">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0">4</div>
                <div className="w-5/12 border-r border-black py-1.5 px-2.5 font-medium">Maksud Perjalanan Dinas</div>
                <div className="flex-1 py-1.5 px-2.5 font-semibold leading-normal whitespace-pre-wrap">{sppd.maksudPerjalanan}</div>
              </div>

              {/* ROW 5 */}
              <div className="flex border-b border-black">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0">5</div>
                <div className="w-5/12 border-r border-black py-1.5 px-2.5 font-medium">Alat angkutan yang dipergunakan</div>
                <div className="flex-1 py-1.5 px-2.5 font-medium">{sppd.alatAngkutan}</div>
              </div>

              {/* ROW 6 */}
              <div className="flex border-b border-black">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0">6</div>
                <div className="w-5/12 border-r border-black p-0 flex flex-col justify-between">
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center">a. Tempat berangkat</div>
                  <div className="py-1 px-2.5 flex-1 flex items-center">b. Tempat tujuan</div>
                </div>
                <div className="flex-1 p-0 flex flex-col justify-between font-medium">
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center">
                    a. &nbsp; {sppd.tempatBerangkat}
                  </div>
                  <div className="py-1 px-2.5 flex-1 flex items-center font-bold">
                    b. &nbsp; {sppd.tempatTujuan}
                  </div>
                </div>
              </div>

              {/* ROW 7 */}
              <div className="flex border-b border-black">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0">7</div>
                <div className="w-5/12 border-r border-black p-0 flex flex-col justify-between">
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center">a. Lamanya Perjalanan Dinas</div>
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center">b. Tanggal berangkat</div>
                  <div className="py-1 px-2.5 flex-1 flex items-center">c. Tanggal harus kembali/tiba di tempat baru*)</div>
                </div>
                <div className="flex-1 p-0 flex flex-col justify-between font-medium">
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center font-semibold">
                    a. &nbsp; {sppd.lamaPerjalanan}
                  </div>
                  <div className="py-1 px-2.5 border-b border-black/10 last:border-0 flex-1 flex items-center">
                    b. &nbsp; {formatIndoDate(sppd.tanggalBerangkat)}
                  </div>
                  <div className="py-1 px-2.5 flex-1 flex items-center font-semibold">
                    c. &nbsp; {formatIndoDate(sppd.tanggalKembali)}
                  </div>
                </div>
              </div>

              {/* ROW 8 - PENGIKUT */}
              <div className="flex border-b border-black">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0">8</div>
                
                {/* Middle Section (Pengikut : list No and Nama) */}
                <div className="w-5/12 border-r border-black flex flex-col">
                  <div className="py-1 px-2.5 font-bold uppercase text-[10px] tracking-wider text-gray-800 bg-gray-50/40 border-b border-black/40 h-[25px] flex items-center shrink-0">
                    Pengikut :
                  </div>
                  <div className="flex-1 bg-white">
                    <table className="w-full text-left font-sans border-none text-[11px]">
                      <tbody className="divide-y divide-black/20">
                        {sppd.pengikut.length > 0 ? (
                          sppd.pengikut.map((p, pIdx) => (
                            <tr key={pIdx} className="h-6">
                              <td className="px-2 py-1 text-center w-8 shrink-0">{pIdx + 1}.</td>
                              <td className="px-2 py-1 font-bold">{p.nama}</td>
                            </tr>
                          ))
                        ) : (
                          [1, 2, 3].map((num) => (
                            <tr key={num} className="h-6">
                              <td className="px-2 py-1 text-indigo-950 font-medium text-center w-8 shrink-0">{num}.</td>
                              <td className="px-2 py-1 text-gray-400 font-normal italic">-</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Section (Tanggal Lahir and Keterangan) */}
                <div className="flex-1 flex flex-col">
                  <table className="w-full table-fixed text-left font-sans border-none text-[11px] h-full">
                    <thead>
                      <tr className="border-b border-black/40 text-gray-800 text-[10px] font-bold uppercase tracking-wider bg-gray-50/40 h-[25px]">
                        <th className="px-2 py-1 w-1/3">Tanggal Lahir</th>
                        <th className="px-2 py-1 w-2/3">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/20">
                      {sppd.pengikut.length > 0 ? (
                        sppd.pengikut.map((p, pIdx) => (
                          <tr key={pIdx} className="h-6">
                            <td className="px-2 py-1 w-1/3 truncate">{formatIndoDate(p.tanggalLahir)}</td>
                            <td className="px-2 py-1 w-2/3 break-words">{p.keterangan || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        [1, 2, 3].map((num) => (
                          <tr key={num} className="h-6">
                            <td className="px-2 py-1 text-center text-gray-400 w-1/3">-</td>
                            <td className="px-2 py-1 text-center text-gray-400 w-2/3">-</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ROW 9 */}
              <div className="flex border-b border-black">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0 flex items-center justify-center">9</div>
                <div className="w-5/12 border-r border-black p-0 flex flex-col justify-between">
                  <div className="py-1 px-2.5 border-b border-black/10 flex-1 flex items-center text-gray-500 font-normal">
                    Pembebanan Anggaran :
                  </div>
                  <div className="py-1 px-2.5 border-b border-black/10 flex-1 flex items-center">
                    a. Instansi
                  </div>
                  <div className="py-1 px-2.5 flex-1 flex items-center">
                    b. Akun
                  </div>
                </div>
                <div className="flex-1 p-0 flex flex-col justify-between font-medium">
                  <div className="py-1 px-2.5 border-b border-black/10 flex-1 flex items-center">
                    {/* Spacer matches "Pembebanan Anggaran" label */}
                  </div>
                  <div className="py-1 px-2.5 border-b border-black/10 flex-1 flex items-center gap-1">
                    <span className="w-4 shrink-0">a.</span>
                    <span>{sppd.pembebananAnggaranInstansi}</span>
                  </div>
                  <div className="py-1 px-2.5 flex-1 flex items-center gap-1 font-mono">
                    <span className="w-4 shrink-0 font-sans">b.</span>
                    <span>{sppd.pembebananAnggaranAkun || "-"}</span>
                  </div>
                </div>
              </div>

              {/* ROW 10 */}
              <div className="flex">
                <div className="w-8 border-r border-black py-1.5 px-1 text-center shrink-0">10</div>
                <div className="w-5/12 border-r border-black py-1.5 px-2.5 font-medium">Keterangan lain-lain</div>
                <div className="flex-1 py-1.5 px-2.5 leading-normal text-[11px] italic font-medium">
                  {sppd.keteranganLain || "-"}
                </div>
              </div>

            </div>
          </div>

          {/* Page 1 Signature Section */}
          <div className="flex justify-end text-xs mt-10 mb-2">
            <div className="w-80 space-y-0.5 bg-white pl-4 leading-normal">
              <div className="flex">
                <span className="w-[130px] shrink-0">Dikeluarkan di</span>
                <span>: &nbsp; {sppd.dikeluarkanDi || "Palopo"}</span>
              </div>
              <div className="flex border-b border-black/25 pb-0.5">
                <span className="w-[130px] shrink-0">Pada Tanggal</span>
                <span>: &nbsp; {formatIndoDate(sppd.tanggalDikeluarkan)}</span>
              </div>
              
              <div className="pt-2.5 text-center">
                <p className="font-bold">Pejabat Pembuat Komitmen</p>
                
                {/* Large Signature space */}
                <div className="h-16"></div>
                
                <p className="font-bold underline leading-none">{sppd.ppkNama || "__________________________"}</p>
                <p className="text-[11px] font-mono tracking-wide mt-1">
                  Nip. {sppd.ppkNip || "__________________________"}
                </p>
              </div>
            </div>
          </div>

        </section>
      </div>

      {/* PAGE BREAK / PRINT DIVISION LINE (Visible on screen size < xl, hidden on side-by-side and hidden when printing) */}
      <div className="w-full xl:hidden print:hidden border-t-2 border-dashed border-gray-400 pt-6" />

      {/* SHEET PAGE 2 */}
      <div className="sheet-page w-full max-w-[21cm] bg-white p-[1.2cm] text-black font-sans shadow-2xl border border-gray-300 print:shadow-none print:border-none print:p-0 print:m-0 print:bg-transparent">
        {/* ===================================================================== */}
        {/* PAGE 2: TIMBAL BALIK LAPORAN (VERIFIKASI & TANDA TANGAN KEBERANGKATAN) */}
        {/* ===================================================================== */}
        <section className="relative w-full min-h-[29.7cm] flex flex-col justify-between print:min-h-0 print:pt-4">
          
          {/* Main timeline route grid box - Exactly matches Page 2 screenshot */}
          <div className="border border-black text-[11px] leading-normal font-sans">
            
            {/* ROW I */}
            <div className="flex border-b border-black min-h-[95px]">
              {/* Left Box (Empty cushion) */}
              <div className="w-1/2 border-r border-black p-2 py-1.5 flex flex-col justify-between"></div>
              {/* Right Box (Departure from station) */}
              <div className="w-1/2 p-2 py-1.5 space-y-1">
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-1">I.</span>
                  <span className="col-span-4 font-semibold">Berangkat dari</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-6 font-bold">{sppd.tempatBerangkat}</span>
                </div>
                <div className="grid grid-cols-12 gap-1 text-[9.5px] text-gray-500 italic leading-none">
                  <span className="col-span-1"></span>
                  <span className="col-span-4">(Tempat Kedudukan)</span>
                  <span className="col-span-1"></span>
                  <span className="col-span-6"></span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-1"></span>
                  <span className="col-span-4 font-semibold">Ke</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-6 font-bold text-amber-950">{sppd.tempatTujuan}</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                  <span className="col-span-1"></span>
                  <span className="col-span-4 font-semibold">Pada Tanggal</span>
                  <span className="col-span-1">:</span>
                  <span className="col-span-6 font-bold">{formatIndoDate(sppd.tanggalBerangkat)}</span>
                </div>
                <div className="pt-1.5 text-center w-3/4 mx-auto leading-normal">
                  <p className="font-medium text-[10px]">Kepala Kantor</p>
                  <div className="h-10"></div>
                  <p className="font-bold underline text-[10.5px]">{sppd.kepalaKantorNama}</p>
                  <p className="font-mono text-[9px] leading-none">Nip. {sppd.kepalaKantorNip}</p>
                </div>
              </div>
            </div>

            {/* ROW II (Tiba di / Berangkat dari) */}
            <div className="flex border-b border-black text-[10px]">
              {/* Left Column (Arrival) */}
              <div className="w-1/2 border-r border-black p-2 py-1.5 space-y-1 min-h-[110px] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-12 gap-0.5">
                    <span className="col-span-1">II.</span>
                    <span className="col-span-4 font-semibold">Tiba di</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-4 font-semibold">Pada Tanggal</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-4 font-semibold">Kepala</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                </div>
                
                <div className="pt-2 w-[85%] mx-auto leading-none flex flex-col items-center">
                  <div className="h-14"></div>
                  <div className="text-left w-fit max-w-full">
                    <p className="text-[9px]">( _________________________________________ )</p>
                    <p className="font-mono text-[8.5px] mt-1 pl-1">NIP: </p>
                  </div>
                </div>
              </div>

              {/* Right Column (Departure) */}
              <div className="w-1/2 p-2 py-1.5 space-y-1 min-h-[110px] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-12 gap-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Berangkat dari</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Ke</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Pada Tanggal</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Kepala</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                </div>
                
                <div className="pt-2 w-[85%] mx-auto leading-none flex flex-col items-center">
                  <div className="h-14"></div>
                  <div className="text-left w-fit max-w-full">
                    <p className="text-[9px]">( _________________________________________ )</p>
                    <p className="font-mono text-[8.5px] mt-1 pl-1">NIP: </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW III (Tiba di / Berangkat dari) */}
            <div className="flex border-b border-black text-[10px]">
              {/* Left Column (Arrival) */}
              <div className="w-1/2 border-r border-black p-2 py-1.5 space-y-1 min-h-[110px] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-12 gap-0.5">
                    <span className="col-span-1">III.</span>
                    <span className="col-span-4 font-semibold">Tiba di</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-4 font-semibold">Pada Tanggal</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-4 font-semibold">Kepala</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                </div>
                
                <div className="pt-2 w-[85%] mx-auto leading-none flex flex-col items-center">
                  <div className="h-14"></div>
                  <div className="text-left w-fit max-w-full">
                    <p className="text-[9px]">( _________________________________________ )</p>
                    <p className="font-mono text-[8.5px] mt-1 pl-1">NIP: </p>
                  </div>
                </div>
              </div>

              {/* Right Column (Departure) */}
              <div className="w-1/2 p-2 py-1.5 space-y-1 min-h-[110px] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-12 gap-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Berangkat dari</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Ke</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Pada Tanggal</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Kepala</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                </div>
                
                <div className="pt-2 w-[85%] mx-auto leading-none flex flex-col items-center">
                  <div className="h-14"></div>
                  <div className="text-left w-fit max-w-full">
                    <p className="text-[9px]">( _________________________________________ )</p>
                    <p className="font-mono text-[8.5px] mt-1 pl-1">NIP: </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW IV (Tiba di / Berangkat dari) */}
            <div className="flex border-b border-black text-[10px]">
              {/* Left Column (Arrival) */}
              <div className="w-1/2 border-r border-black p-2 py-1.5 space-y-1 min-h-[110px] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-12 gap-0.5">
                    <span className="col-span-1">IV.</span>
                    <span className="col-span-4 font-semibold">Tiba di</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-4 font-semibold">Pada Tanggal</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-4 font-semibold">Kepala</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                </div>
                
                <div className="pt-2 w-[85%] mx-auto leading-none flex flex-col items-center">
                  <div className="h-14"></div>
                  <div className="text-left w-fit max-w-full">
                    <p className="text-[9px]">( _________________________________________ )</p>
                    <p className="font-mono text-[8.5px] mt-1 pl-1">NIP: </p>
                  </div>
                </div>
              </div>

              {/* Right Column (Departure) */}
              <div className="w-1/2 p-2 py-1.5 space-y-1 min-h-[110px] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-12 gap-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Berangkat dari</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Ke</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Pada Tanggal</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Kepala</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                </div>
                
                <div className="pt-2 w-[85%] mx-auto leading-none flex flex-col items-center">
                  <div className="h-14"></div>
                  <div className="text-left w-fit max-w-full">
                    <p className="text-[9px]">( _________________________________________ )</p>
                    <p className="font-mono text-[8.5px] mt-1 pl-1">NIP: </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW V (Tiba di / Berangkat dari) */}
            <div className="flex border-b border-black text-[10px]">
              {/* Left Column (Arrival) */}
              <div className="w-1/2 border-r border-black p-2 py-1.5 space-y-1 min-h-[110px] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-12 gap-0.5">
                    <span className="col-span-1">V.</span>
                    <span className="col-span-4 font-semibold">Tiba di</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-4 font-semibold">Pada Tanggal</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-4 font-semibold">Kepala</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6"></span>
                  </div>
                </div>
                
                <div className="pt-2 w-[85%] mx-auto leading-none flex flex-col items-center">
                  <div className="h-14"></div>
                  <div className="text-left w-fit max-w-full">
                    <p className="text-[9px]">( _________________________________________ )</p>
                    <p className="font-mono text-[8.5px] mt-1 pl-1">NIP: </p>
                  </div>
                </div>
              </div>

              {/* Right Column (Departure) */}
              <div className="w-1/2 p-2 py-1.5 space-y-1 min-h-[110px] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-12 gap-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Berangkat dari</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Ke</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Pada Tanggal</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                  <div className="grid grid-cols-12 gap-0.5 mt-0.5">
                    <span className="col-span-1"></span>
                    <span className="col-span-5 font-semibold">Kepala</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-5"></span>
                  </div>
                </div>
                
                <div className="pt-2 w-[85%] mx-auto leading-none flex flex-col items-center">
                  <div className="h-14"></div>
                  <div className="text-left w-fit max-w-full">
                    <p className="text-[9px]">( _________________________________________ )</p>
                    <p className="font-mono text-[8.5px] mt-1 pl-1">NIP: </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW VI (Tiba di / Telah diperiksa - Signatures of PPK) */}
            <div className="flex border-b border-black text-[10px]">
              {/* Left Column (PPK Signature Block 1) */}
              <div className="w-1/2 border-r border-black p-2 py-1.5 space-y-1 min-h-[125px] flex flex-col justify-between">
                <div>
                  <div className="grid grid-cols-12 gap-0.5">
                    <span className="col-span-1">VI.</span>
                    <span className="col-span-4 font-semibold">Tiba di</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6">{sppd.tempatBerangkat}</span>
                  </div>
                  <p className="pl-4 text-[8.5px] text-gray-500">(Tempat Kedudukan)</p>
                  
                  <div className="grid grid-cols-12 gap-0.5 mt-1">
                    <span className="col-span-1"></span>
                    <span className="col-span-4 font-semibold">Pada Tanggal</span>
                    <span className="col-span-1">:</span>
                    <span className="col-span-6 font-semibold">{formatIndoDate(sppd.tanggalKembali)}</span>
                  </div>
                </div>

                <div className="pt-2 text-center w-4/5 mx-auto leading-normal">
                  <p className="font-bold text-[9.5px]">Pejabat Pembuat Komitmen</p>
                  <div className="h-14"></div>
                  <p className="font-bold underline text-[10px]">{sppd.ppkNama}</p>
                  <p className="font-mono text-[8.5px] leading-none mt-0.5">Nip. {sppd.ppkNip}</p>
                </div>
              </div>

              {/* Right Column (PPK Signature Block 2 - Inspection Certificate text) */}
              <div className="w-1/2 p-2 py-1.5 space-y-1 min-h-[125px] flex flex-col justify-between">
                <p className="leading-tight text-[9px] text-justify font-sans">
                  Telah diperiksa dengan keterangan bahwa perjalanan tersebut atas perintahnya dan semata-mata untuk kepentingan jabatan dalam waktu yang sesingkat-singkatnya.
                </p>

                <div className="pt-2 text-center w-4/5 mx-auto leading-normal">
                  <p className="font-bold text-[9.5px]">Pejabat Pembuat Komitmen</p>
                  <div className="h-14"></div>
                  <p className="font-bold underline text-[10px]">{sppd.ppkNama}</p>
                  <p className="font-mono text-[8.5px] leading-none mt-0.5">Nip. {sppd.ppkNip}</p>
                </div>
              </div>
            </div>

            {/* ROW VII (Catatan Lain-Lain) */}
            <div className="flex border-b border-black text-[9.5px] min-h-[35px] p-2">
              <div className="w-full">
                <span className="font-bold uppercase tracking-wider block text-[9px]">VII. Catatan Lain-lain:</span>
                <p className="text-gray-400 italic text-[8.5px] mt-0.5 leading-none">Tulis catatan tambahan di sini apabila diperlukan oleh auditor keuangan...</p>
              </div>
            </div>

            {/* ROW VIII (Warning Label Footer) */}
            <div className="flex text-[9.5px] p-2 text-justify leading-snug bg-gray-50/20">
              <div className="w-full">
                <span className="font-bold uppercase tracking-wider block mb-0.5 text-[9px]">VIII.</span>
                <p className="font-medium text-black">
                  PPK yang menerbitkan SPD, pegawai yang melakukan perjalanan dinas, para pejabat yang mengesahkan tanggal berangkat/tiba, serta bendahara pengeluaran bertanggung jawab berdasarkan peraturan-peraturan Keuangan Negara apabila negara menderita rugi akibat kesalahan, kelalaian, dan kealpaannya.
                </p>
              </div>
            </div>

          </div>

        </section>

      </div>
    </div>
  </div>
  );
}
