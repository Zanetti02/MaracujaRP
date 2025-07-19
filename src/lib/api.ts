import { createClient } from '@supabase/supabase-js';
import { getPlaceholderSections } from './placeholderData';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Types
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

export interface Rule {
  id: string;
  title: string;
  content: string;
  orderIndex: number;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
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

// Activity logging
const logActivity = async (action: string, targetType: string, targetId?: string, details?: any) => {
  if (!supabase) return;
  
  try {
    await supabase.from('activity_logs').insert({
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      ip_address: null // In a real app, you'd get this from the request
    });
  } catch (error) {
    console.warn('Failed to log activity:', error);
  }
};

// Sections API
export const sectionsAPI = {
  getSections: async (): Promise<RuleSection[]> => {
    try {
      if (!supabase) {
        console.warn('Supabase non configurato, utilizzo dati placeholder');
        return getPlaceholderSections();
      }

      console.log('🔍 Fetching sections from Supabase...');
      
      // Fetch sections
      const { data: sections, error: sectionsError } = await supabase
        .from('rule_sections')
        .select('*')
        .order('order_index');

      if (sectionsError) {
        console.error('Error fetching sections:', sectionsError);
        throw sectionsError;
      }

      console.log('📋 Sections fetched:', sections?.length || 0);

      // Fetch rules for each section
      const sectionsWithRules = await Promise.all((sections || []).map(async (section) => {
        const { data: rules, error: rulesError } = await supabase
          .from('rules')
          .select('*')
          .eq('section_id', section.id)
          .order('order_index');

        if (rulesError) {
          console.error(`Error fetching rules for section ${section.id}:`, rulesError);
          throw rulesError;
        }

        return {
          id: section.id,
          title: section.title,
          description: section.description,
          icon: section.icon,
          orderIndex: section.order_index,
          createdAt: section.created_at,
          updatedAt: section.updated_at,
          createdBy: section.created_by,
          rules: (rules || []).map(rule => ({
            id: rule.id,
            title: rule.title,
            content: rule.content,
            orderIndex: rule.order_index,
            createdBy: rule.created_by,
            createdAt: rule.created_at,
            updatedAt: rule.updated_at,
          })),
        };
      }));

      console.log('✅ Sections fetched successfully:', sectionsWithRules.length);
      
      // Se non ci sono sezioni, restituisci placeholder
      if (sectionsWithRules.length === 0) {
        console.log('📝 Nessuna sezione trovata, utilizzo dati placeholder');
        return getPlaceholderSections();
      }
      
      return sectionsWithRules;
    } catch (error) {
      console.error('❌ Error fetching sections:', error);
      console.log('📝 Errore nel caricamento, utilizzo dati placeholder');
      return getPlaceholderSections();
    }
  },

  createSection: async (data: CreateSectionData): Promise<RuleSection> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('➕ Creating section:', data);

    const { data: section, error } = await supabase
      .from('rule_sections')
      .insert({
        title: data.title,
        description: data.description,
        icon: data.icon,
        order_index: data.orderIndex || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating section:', error);
      throw error;
    }

    await logActivity('Creata sezione', 'section', section.id, { title: data.title });

    console.log('✅ Section created successfully:', section);

    return {
      id: section.id,
      title: section.title,
      description: section.description,
      icon: section.icon,
      orderIndex: section.order_index,
      createdAt: section.created_at,
      updatedAt: section.updated_at,
      createdBy: section.created_by,
      rules: [],
    };
  },

  updateSection: async (id: string, data: UpdateSectionData): Promise<RuleSection> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('✏️ Updating section:', id, data);

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.orderIndex !== undefined) updateData.order_index = data.orderIndex;

    const { data: section, error } = await supabase
      .from('rule_sections')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating section:', error);
      throw error;
    }

    await logActivity('Modificata sezione', 'section', id, data);

    // Fetch rules for the updated section
    const { data: rules } = await supabase
      .from('rules')
      .select('*')
      .eq('section_id', id)
      .order('order_index');

    console.log('✅ Section updated successfully:', section);

    return {
      id: section.id,
      title: section.title,
      description: section.description,
      icon: section.icon,
      orderIndex: section.order_index,
      createdAt: section.created_at,
      updatedAt: section.updated_at,
      createdBy: section.created_by,
      rules: (rules || []).map(rule => ({
        id: rule.id,
        title: rule.title,
        content: rule.content,
        orderIndex: rule.order_index,
        createdBy: rule.created_by,
        createdAt: rule.created_at,
        updatedAt: rule.updated_at,
      })),
    };
  },

  deleteSection: async (id: string): Promise<void> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('🗑️ Deleting section:', id);

    // Get section info for logging
    const { data: section } = await supabase
      .from('rule_sections')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('rule_sections')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting section:', error);
      throw error;
    }

    await logActivity('Eliminata sezione', 'section', id, { title: section?.title });

    console.log('✅ Section deleted successfully');
  },

  reorderSections: async (sectionIds: string[]): Promise<void> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('🔄 Reordering sections:', sectionIds);

    // Update order for each section
    const updates = sectionIds.map((id, index) => 
      supabase
        .from('rule_sections')
        .update({ order_index: index + 1 })
        .eq('id', id)
    );

    await Promise.all(updates);

    await logActivity('Riordinate sezioni', 'section', null, { order: sectionIds });

    console.log('✅ Sections reordered successfully');
  },
};

// Rules API
export const rulesAPI = {
  getSections: sectionsAPI.getSections, // Alias for backward compatibility

  createRule: async (data: CreateRuleData): Promise<Rule> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('➕ Creating rule:', data);

    const { data: rule, error } = await supabase
      .from('rules')
      .insert({
        section_id: data.sectionId,
        title: data.title,
        content: data.content,
        order_index: data.orderIndex || 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating rule:', error);
      throw error;
    }

    await logActivity('Creata regola', 'rule', rule.id, { title: data.title, sectionId: data.sectionId });

    console.log('✅ Rule created successfully:', rule);

    return {
      id: rule.id,
      title: rule.title,
      content: rule.content,
      orderIndex: rule.order_index,
      createdBy: rule.created_by,
      createdAt: rule.created_at,
      updatedAt: rule.updated_at,
    };
  },

  updateRule: async (id: string, data: UpdateRuleData): Promise<Rule> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('✏️ Updating rule:', id, data);

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.orderIndex !== undefined) updateData.order_index = data.orderIndex;
    if (data.sectionId !== undefined) updateData.section_id = data.sectionId;

    const { data: rule, error } = await supabase
      .from('rules')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating rule:', error);
      throw error;
    }

    await logActivity('Modificata regola', 'rule', id, data);

    console.log('✅ Rule updated successfully:', rule);

    return {
      id: rule.id,
      title: rule.title,
      content: rule.content,
      orderIndex: rule.order_index,
      createdBy: rule.created_by,
      createdAt: rule.created_at,
      updatedAt: rule.updated_at,
    };
  },

  deleteRule: async (id: string): Promise<void> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('🗑️ Deleting rule:', id);

    // Get rule info for logging
    const { data: rule } = await supabase
      .from('rules')
      .select('title')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('rules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting rule:', error);
      throw error;
    }

    await logActivity('Eliminata regola', 'rule', id, { title: rule?.title });

    console.log('✅ Rule deleted successfully');
  },

  reorderRules: async (sectionId: string, ruleIds: string[]): Promise<void> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('🔄 Reordering rules in section:', sectionId, ruleIds);

    // Update order for each rule
    const updates = ruleIds.map((id, index) => 
      supabase
        .from('rules')
        .update({ order_index: index + 1 })
        .eq('id', id)
    );

    await Promise.all(updates);

    await logActivity('Riordinate regole', 'rule', null, { sectionId, order: ruleIds });

    console.log('✅ Rules reordered successfully');
  },

  moveRule: async (ruleId: string, fromSectionId: string, toSectionId: string, newOrderIndex?: number): Promise<void> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('📦 Moving rule:', ruleId, 'from', fromSectionId, 'to', toSectionId);

    const updateData: any = { section_id: toSectionId };
    if (newOrderIndex !== undefined) {
      updateData.order_index = newOrderIndex;
    }

    const { error } = await supabase
      .from('rules')
      .update(updateData)
      .eq('id', ruleId);

    if (error) {
      console.error('Error moving rule:', error);
      throw error;
    }

    await logActivity('Spostata regola', 'rule', ruleId, { 
      fromSectionId, 
      toSectionId, 
      newOrderIndex 
    });

    console.log('✅ Rule moved successfully');
  },
};

// Admin API
export const adminAPI = {
  getStats: async () => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('📊 Fetching admin stats...');

    // Get total sections count
    const { count: sectionsCount, error: sectionsError } = await supabase
      .from('rule_sections')
      .select('*', { count: 'exact', head: true });

    if (sectionsError) {
      console.error('Error fetching sections count:', sectionsError);
      throw sectionsError;
    }

    // Get total rules count
    const { count: rulesCount, error: rulesError } = await supabase
      .from('rules')
      .select('*', { count: 'exact', head: true });

    if (rulesError) {
      console.error('Error fetching rules count:', rulesError);
      throw rulesError;
    }

    const stats = {
      totalSections: sectionsCount || 0,
      totalRules: rulesCount || 0,
    };

    console.log('✅ Admin stats fetched:', stats);
    return stats;
  },

  getActivityLogs: async (limit: number = 50) => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    const { data: logs, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching activity logs:', error);
      throw error;
    }

    return logs || [];
export { sectionsAPI, rulesAPI, adminAPI };
