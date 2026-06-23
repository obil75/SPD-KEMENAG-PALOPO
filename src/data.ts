import { Pegawai, Referensi, Sppd } from "./types";

export const INITIAL_PEGAWAI: Pegawai[] = [
  {
    id: "peg-1",
    nama: "Hardianti Rahim Sakti, S.E.",
    nip: "198512282011012013",
    pangkatGolongan: "Penata, III/c",
    jabatan: "Penyusun Program Peningkatan dan Tenaga Kependidikan",
    unitKerja: "Seksi Pendidikan Islam",
    tingkatBiaya: "Tingkat C",
  },
  {
    id: "peg-2",
    nama: "Sudirman, S.Ag.",
    nip: "197804122007011011",
    pangkatGolongan: "Penata Tk. I, III/d",
    jabatan: "Analisis Kebijakan / Humas",
    unitKerja: "Sub bagian Tata Usaha",
    tingkatBiaya: "Tingkat C",
  },
  {
    id: "peg-3",
    nama: "Nurhidayah, S.Pd.I.",
    nip: "198909152014022005",
    pangkatGolongan: "Penata Muda, III/a",
    jabatan: "Penyusun Bahan Urusan Agama",
    unitKerja: "Seksi Bimas Islam",
    tingkatBiaya: "Tingkat D",
  },
  {
    id: "peg-4",
    nama: "Hasanuddin, S.Th.I.",
    nip: "197508052009121003",
    pangkatGolongan: "Pembina, IV/a",
    jabatan: "Penyusun Bahan Pendaftaran & Pembatalan Haji",
    unitKerja: "Seksi Penyelenggaraan Haji & Umrah",
    tingkatBiaya: "Tingkat B",
  },
];

export const INITIAL_REFERENSI: Referensi = {
  kepalaKantor: {
    nama: "Dr. H. M. Rusydi Hasyim, M.Ag",
    nip: "197203291997031003",
    unitKerja: "Kantor Kementerian Agama Kota Palopo",
  },
  ppkList: [
    {
      id: "ppk-1",
      label: "PPK Sekretariat / Tata Usaha",
      nama: "H. Mikail, S.Pd, M.H.",
      nip: "196805142006041002",
      unitKerja: "Sekretariat Jenderal",
    },
    {
      id: "ppk-2",
      label: "PPK Pendidikan Islam & PhU",
      nama: "H. Mikail, S.Pd, M.H.",
      nip: "197305102002121004",
      unitKerja: "Pendidikan Islam",
    },
    {
      id: "ppk-3",
      label: "PPK Bimas Islam & Keuangan",
      nama: "H. Muhammad Aslam, S.Sos.I, M.Sos.I",
      nip: "197911222006041003",
      unitKerja: "Bimas Islam",
    },
  ],
};

export const INITIAL_SPPD: Sppd[] = [
  {
    id: "sppd-1",
    nomor: "168/Kk.21.14/1-b/KU.02.1/06/2021",
    lembarKe: "I / II / III / IV",
    kodeNo: "-",
    ppkId: "ppk-1",
    pegawaiId: "peg-1",
    
    namaPegawai: "Hardianti Rahim Sakti, S.E.",
    nipPegawai: "198512282011012013",
    pangkatGolonganPegawai: "Penata, III/c",
    jabatanPegawai: "Penyusun Program Peningkatan dan Tenaga Kependidikan",
    tingkatBiaya: "Tingkat C",
    
    maksudPerjalanan: "Koordinasi dan Konsultasi Mengenai Dana BOS",
    alatAngkutan: "Kendaraan Pribadi",
    tempatBerangkat: "Palopo",
    tempatTujuan: "Makassar",
    lamaPerjalanan: "3 (Tiga) hari",
    tanggalBerangkat: "2021-06-17",
    tanggalKembali: "2021-06-19",
    pengikut: [],
    
    pembebananAnggaranInstansi: "Kementerian Agama Kota Palopo",
    pembebananAnggaranAkun: "524111 (Belanja Perjalanan Dinas Biasa)",
    keteranganLain: "Dipa Kantor Kementerian Agama Kota Palopo Anggaran Tahun 2021",
    dikeluarkanDi: "Palopo",
    tanggalDikeluarkan: "2021-06-11",
    
    kepalaKantorNama: "Dr. H. M. Rusydi Hasyim, M.Ag",
    kepalaKantorNip: "197203291997031003",
    ppkNama: "Drs. H. Ahmad Pattola, M.Pd",
    ppkNip: "196805142006041002",
  },
];
