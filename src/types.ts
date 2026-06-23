export interface Pegawai {
  id: string;
  nama: string;
  nip: string;
  pangkatGolongan: string;
  jabatan: string;
  unitKerja: string;
  tingkatBiaya: string;
}

export interface KepalaKantor {
  nama: string;
  nip: string;
  unitKerja: string;
}

export interface Ppk {
  id: string;
  label: string; // e.g. "Pejabat Pembuat Komitmen (Seksi Pendis)"
  nama: string;
  nip: string;
  unitKerja: string;
}

export interface Referensi {
  kepalaKantor: KepalaKantor;
  ppkList: Ppk[]; // Must contain exactly 3 PPKs
}

export interface Pengikut {
  nama: string;
  tanggalLahir: string;
  keterangan: string;
}

export interface Sppd {
  id: string;
  nomor: string;
  lembarKe: string;
  kodeNo: string;
  ppkId: string; // selected PPK Reference
  pegawaiId: string; // selected Pegawai Reference
  
  // Custom states in case the user wants to adjust on the fly
  namaPegawai: string;
  nipPegawai: string;
  pangkatGolonganPegawai: string;
  jabatanPegawai: string;
  tingkatBiaya: string;
  
  maksudPerjalanan: string;
  alatAngkutan: string;
  tempatBerangkat: string;
  tempatTujuan: string;
  lamaPerjalanan: string;
  tanggalBerangkat: string;
  tanggalKembali: string;
  pengikut: Pengikut[];
  
  pembebananAnggaranInstansi: string;
  pembebananAnggaranAkun: string;
  keteranganLain: string;
  dikeluarkanDi: string;
  tanggalDikeluarkan: string;
  
  // Signatures
  kepalaKantorNama: string;
  kepalaKantorNip: string;
  ppkNama: string;
  ppkNip: string;
}
