export interface Admin {
  id: string;
  email: string;
  role: 'Superadmin' | 'Admin';
  status_approval: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
  updated_at: string | null;
}
