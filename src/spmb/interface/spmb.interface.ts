export interface Spmb {
  id: number;
  judul: string;
  link_text?: string | null;
  link_url?: string | null;
  dibuat_pada?: string;
  diperbarui_pada?: string;
}

export interface SpmbMediaImage {
  id: number;
  spmb_id: number;
  image_url: string;
  dibuat_pada?: string;
}

export interface SpmbMediaFile {
  id: number;
  spmb_id: number;
  file_url: string;
  dibuat_pada?: string;
}

export interface SpmbJoined {
  id: number;
  judul: string;
  link_text?: string | null;
  link_url?: string | null;
  dibuat_pada?: string;
  diperbarui_pada?: string;
  spmb_media_image?: {
    id: number;
    image_url: string;
    dibuat_pada?: string;
  }[];
  spmb_media_file?: {
    id: number;
    file_url: string;
    dibuat_pada?: string;
  }[];
}

export interface SpmbView {
  judul: string;
  link_text?: string | null;
  link_url?: string | null;
  image_url?: string | null;
  file_url?: string | null;
}
