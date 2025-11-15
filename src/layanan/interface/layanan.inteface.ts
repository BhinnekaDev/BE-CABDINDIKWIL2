export enum KindServices {
  Rekomendasi_Penelitian = 'Rekomendasi_Penelitian',
  Rekomendasi_Pindah_Sekolah = 'Rekomendasi_Pindah_Sekolah',
  Legalisir_Ijazah_SKHU = 'Legalisir_Ijazah_SKHU',
  Perbaikan_Ijzah_SKHU = 'Perbaikan_Ijzah_SKHU',
  Kehilangan_Ijazah = 'Kehilangan_Ijazah',
  Usulan_Karpeg = 'Usulan_Karpeg',
  Usulan_Karis = 'Usulan_Karis',
  Usulan_Karsu = 'Usulan_Karsu',
  Kenaikan_Pangkat_Fungsional = 'Kenaikan_Pangkat_Fungsional',
  Pensiun = 'Pensiun',
  Tabel_Basis = 'Tabel_Basis',
  Kenaikan_Pangkat_Reguler = 'Kenaikan_Pangkat_Reguler',
}

export interface Layanan {
  id: number;
  judul: string;
  nama_file?: string | null;
  url_file?: string | null;
  ukuran_file?: number | null;
  jenis_file?: string | null;
  jenis_layanan: KindServices;
}

export interface LayananView {
  judul: string;
  nama_file?: string | null;
  url_file?: string | null;
  ukuran_file?: number | null;
  jenis_file?: string | null;
  jenis_layanan: KindServices;
  dibuat_pada: string;
}
