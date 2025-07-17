export interface Rule {
  id: string;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
}

export interface RuleSection {
  id: string;
  title: string;
  icon: string;
  rules: Rule[];
}

export interface AdminUser {
  id: string;
  username: string;
  role: 'admin' | 'super_admin' | 'moderator';
  lastLogin: Date;
}

export interface RuleFormData {
  title: string;
  content: string;
  sectionId: string;
}