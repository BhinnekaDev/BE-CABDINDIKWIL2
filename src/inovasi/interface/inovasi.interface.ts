export interface Inovasi {
  id: number;
  judul: string;
  penulis?: string;
  tanggal_diterbitkan?: string;
  isi?: string;
  dibuat_pada?: string;
  diperbarui_pada?: string;
}

export interface InovasiGambar {
  id: number;
  seputar_id: number;
  url_gambar: string;
  keterangan?: string;
  dibuat_pada?: string;
}

export interface InovasiJoined {
  id: number;
  judul: string;
  penulis?: string;
  tanggal_diterbitkan?: string;
  isi?: string;
  dibuat_pada?: string;
  diperbarui_pada?: string;
  gambar?: {
    id: number;
    url_gambar: string;
    keterangan?: string;
    dibuat_pada?: string;
  }[];
}

export interface InovasiView {
  judul: string;
  penulis?: string | null;
  tanggal_diterbitkan: string;
  isi?: string | null;
  url_gambar?: string | null;
}
