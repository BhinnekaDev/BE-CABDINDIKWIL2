export interface Admin {
  id: string;
  email: string;
  full_name: string | null;
  role: 'Superadmin' | 'Admin';
  status_approval: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  updated_at: string | null;
}
