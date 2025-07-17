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

// Rules API
export const rulesAPI = {
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

  createRule: async (data: { sectionId: string; title: string; content: string; orderIndex?: number }): Promise<Rule> => {
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

  updateRule: async (id: string, data: { title: string; content: string; orderIndex?: number; sectionId?: string }): Promise<Rule> => {
    if (!supabase) {
      throw new Error('Supabase non configurato. Clicca "Connect to Supabase" per configurare il database.');
    }

    console.log('✏️ Updating rule:', id, data);

    const updateData: any = {
      title: data.title,
      content: data.content,
      updated_at: new Date().toISOString(),
    };

    if (data.orderIndex !== undefined) {
      updateData.order_index = data.orderIndex;
    }

    if (data.sectionId) {
      updateData.section_id = data.sectionId;
    }

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

    const { error } = await supabase
      .from('rules')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting rule:', error);
      throw error;
    }

    console.log('✅ Rule deleted successfully');
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
};

export default { rulesAPI, adminAPI };