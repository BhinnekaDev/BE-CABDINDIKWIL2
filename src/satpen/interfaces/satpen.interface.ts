export interface SatpenView {
  npsn: number;
  nama: string;
  status: string;
  alamat: string;
  nama_jenis: string;
  kelurahan: string | null;
}

export interface Satpen {
  id: number;
  npsn: string;
  nama: string;
  jenis_id: number;
  status: string;
  alamat: string;
  lokasi_id: number;
  created_at: string;
}

export interface SatpenJoined {
  npsn: number;
  nama: string;
  status: string;
  alamat?: string;
  jenis_id?: number;
  jenis_nama?: string;
  lokasi_id?: number;
  lokasi?: {
    kelurahan?: string;
  };
  created_at?: string;
}

export interface Location {
  id: number;
  kelurahan: string;
}

export interface Kind {
  id: number;
  nama_jenis: string;
}
