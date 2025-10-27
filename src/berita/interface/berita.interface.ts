export interface Berita {
  id: number;
  judul: string;
  penulis?: string;
  tanggal_diterbitkan?: string;
  isi?: string;
  dibuat_pada?: string;
  diperbarui_pada?: string;
}

export interface BeritaGambar {
  id: number;
  berita_id: number;
  url_gambar: string;
  keterangan?: string;
  dibuat_pada?: string;
}

export interface BeritaJoined {
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

export interface BeritaView {
  judul: string;
  penulis?: string | null;
  tanggal_diterbitkan: string;
  isi?: string | null;
  url_gambar?: string | null;
}
