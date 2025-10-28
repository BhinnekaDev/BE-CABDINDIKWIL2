export interface SeputarCabdin {
  id: number;
  judul: string;
  penulis?: string;
  tanggal_diterbitkan?: string;
  isi?: string;
  dibuat_pada?: string;
  diperbarui_pada?: string;
}

export interface SeputarCabdinGambar {
  id: number;
  seputar_id: number;
  url_gambar: string;
  keterangan?: string;
  dibuat_pada?: string;
}

export interface SeputarCabdinJoined {
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

export interface SeputarCabdinView {
  judul: string;
  penulis?: string | null;
  tanggal_diterbitkan: string;
  isi?: string | null;
  url_gambar?: string | null;
}
