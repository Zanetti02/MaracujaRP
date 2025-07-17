import React, { useState } from 'react';
import { RuleSection, AdminUser, Rule } from '../../types';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import RulesManager from './RulesManager';
import SectionsManager from './SectionsManager';
import AdminStats from './AdminStats';
import AccountManagement from './AccountManagement';
import SystemSettings from './SystemSettings';
import ActivityLog from './ActivityLog';
import BackupManager from './BackupManager';
import { rulesAPI, sectionsAPI } from '../../lib/api';

interface AdminDashboardProps {
  sections: RuleSection[];
  setSections: React.Dispatch<React.SetStateAction<RuleSection[]>>;
  currentAdmin: AdminUser;
  onLogout: () => void;
  onRefresh: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  sections,
  setSections,
  currentAdmin,
  onLogout,
  onRefresh
}) => {
  const [activeView, setActiveView] = useState<'stats' | 'rules' | 'sections' | 'account' | 'settings' | 'logs' | 'backup'>('stats');
  const [selectedSection, setSelectedSection] = useState<string>(sections.length > 0 ? sections[0].id : '');

  // Rules management
  const addRule = async (sectionId: string, rule: Omit<Rule, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await rulesAPI.createRule({
        sectionId,
        title: rule.title,
        content: rule.content,
        orderIndex: rule.orderIndex || 0
      });
      onRefresh();
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Errore nella creazione della regola');
    }
  };

  const updateRule = async (sectionId: string, ruleId: string, updatedRule: Partial<Rule>) => {
    try {
      await rulesAPI.updateRule(ruleId, {
        title: updatedRule.title,
        content: updatedRule.content,
        orderIndex: updatedRule.orderIndex,
        sectionId
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating rule:', error);
      alert('Errore nell\'aggiornamento della regola');
    }
  };

  const deleteRule = async (sectionId: string, ruleId: string) => {
    try {
      await rulesAPI.deleteRule(ruleId);
      onRefresh();
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Errore nell\'eliminazione della regola');
    }
  };

  const moveRule = async (fromSectionId: string, toSectionId: string, ruleId: string) => {
    try {
      await rulesAPI.moveRule(ruleId, fromSectionId, toSectionId);
      onRefresh();
    } catch (error) {
      console.error('Error moving rule:', error);
      alert('Errore nello spostamento della regola');
    }
  };

  const reorderRules = async (sectionId: string, ruleIds: string[]) => {
    try {
      await rulesAPI.reorderRules(sectionId, ruleIds);
      onRefresh();
    } catch (error) {
      console.error('Error reordering rules:', error);
      alert('Errore nel riordinamento delle regole');
    }
  };

  // Sections management
  const addSection = async (sectionData: { title: string; description?: string; icon: string }) => {
    try {
      await sectionsAPI.createSection({
        title: sectionData.title,
        description: sectionData.description,
        icon: sectionData.icon,
        orderIndex: sections.length + 1
      });
      onRefresh();
    } catch (error) {
      console.error('Error creating section:', error);
      alert('Errore nella creazione della sezione');
    }
  };

  const updateSection = async (sectionId: string, sectionData: { title?: string; description?: string; icon?: string }) => {
    try {
      await sectionsAPI.updateSection(sectionId, sectionData);
      onRefresh();
    } catch (error) {
      console.error('Error updating section:', error);
      alert('Errore nell\'aggiornamento della sezione');
    }
  };

  const deleteSection = async (sectionId: string) => {
    try {
      await sectionsAPI.deleteSection(sectionId);
      onRefresh();
    } catch (error) {
      console.error('Error deleting section:', error);
      alert('Errore nell\'eliminazione della sezione');
    }
  };

  const reorderSections = async (sectionIds: string[]) => {
    try {
      await sectionsAPI.reorderSections(sectionIds);
      onRefresh();
    } catch (error) {
      console.error('Error reordering sections:', error);
      alert('Errore nel riordinamento delle sezioni');
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'stats':
        return <AdminStats sections={sections} />;
      case 'rules':
        return (
          <RulesManager
            sections={sections}
            selectedSection={selectedSection}
            onAddRule={addRule}
            onUpdateRule={updateRule}
            onDeleteRule={deleteRule}
            onMoveRule={moveRule}
            onReorderRules={reorderRules}
          />
        );
      case 'sections':
        return (
          <SectionsManager
            sections={sections}
            onAddSection={addSection}
            onUpdateSection={updateSection}
            onDeleteSection={deleteSection}
            onReorderSections={reorderSections}
          />
        );
      case 'account':
        return <AccountManagement currentAdmin={currentAdmin} onLogout={onLogout} />;
      case 'settings':
        return <SystemSettings />;
      case 'logs':
        return <ActivityLog />;
      case 'backup':
        return <BackupManager sections={sections} />;
      default:
        return <AdminStats sections={sections} />;
    }
  };

  return (
    <div className="min-h-screen bg-custom-gradient">
      <AdminHeader currentAdmin={currentAdmin} onLogout={onLogout} />
      
      <div className="flex">
        <AdminSidebar 
          activeView={activeView}
          setActiveView={setActiveView}
          sections={sections}
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
        
        <main className="flex-1 ml-64 p-8 pt-24">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;