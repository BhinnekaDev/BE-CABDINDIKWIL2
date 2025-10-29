export interface CeritaPraktikBaik {
  id: number;
  judul: string;
  penulis?: string;
  tanggal_diterbitkan?: string;
  isi?: string;
  dibuat_pada?: string;
  diperbarui_pada?: string;
}

export interface CeritaPraktikBaikGambar {
  id: number;
  seputar_id: number;
  url_gambar: string;
  keterangan?: string;
  dibuat_pada?: string;
}

export interface CeritaPraktikBaikJoined {
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

export interface CeritaPraktikBaikView {
  judul: string;
  penulis?: string | null;
  tanggal_diterbitkan: string;
  isi?: string | null;
  url_gambar?: string | null;
}
