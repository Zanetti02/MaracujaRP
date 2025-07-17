export interface Rule {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface RuleSection {
  id: string;
  title: string;
  description?: string;
  icon: string;
  orderIndex: number;
  rules: Rule[];
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
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

export interface CreateSectionData {
  title: string;
  description?: string;
  icon: string;
  orderIndex?: number;
}

export interface UpdateSectionData {
  title?: string;
  description?: string;
  icon?: string;
  orderIndex?: number;
}

export interface CreateRuleData {
  sectionId: string;
  title: string;
  content: string;
  orderIndex?: number;
}

export interface UpdateRuleData {
  title?: string;
  content?: string;
  orderIndex?: number;
  sectionId?: string;
}

export interface ActivityLog {
  id: string;
  userId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}