export interface Prakata {
  id: number;
  judul: string;
  sub_judul?: string | null;
  isi: string;
  penutup?: string | null;
  dibuat_pada?: string;
  diperbarui_pada?: string;
}

export interface PrakataView {
  judul: string;
  sub_judul?: string | null;
  isi: string;
  penutup?: string | null;
}
