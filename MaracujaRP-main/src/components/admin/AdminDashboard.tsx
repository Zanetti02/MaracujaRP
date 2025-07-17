import React, { useState } from 'react';
import { RuleSection, AdminUser, Rule } from '../../types';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import RulesManager from './RulesManager';
import AdminStats from './AdminStats';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';
import ActivityLog from './ActivityLog';
import BackupManager from './BackupManager';
import { rulesAPI } from '../../lib/api';

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
  const [activeView, setActiveView] = useState<'stats' | 'rules' | 'account' | 'settings' | 'logs' | 'backup'>('stats');
  const [selectedSection, setSelectedSection] = useState<string>(sections.length > 0 ? sections[0].id : '');

  const addRule = async (sectionId: string, rule: Omit<Rule, 'id'>) => {
    try {
      const response = await rulesAPI.createRule({
        sectionId,
        title: rule.title,
        content: rule.content,
        orderIndex: rule.orderIndex || 0
      });

      // Refresh data from server
      onRefresh();
    } catch (error) {
      console.error('Error creating rule:', error);
      alert('Errore nella creazione della regola');
    }
  };

  const updateRule = async (sectionId: string, ruleId: string, updatedRule: Partial<Rule>) => {
    try {
      await rulesAPI.updateRule(ruleId, {
        title: updatedRule.title!,
        content: updatedRule.content!,
        orderIndex: updatedRule.orderIndex,
        sectionId
      });

      // Refresh data from server
      onRefresh();
    } catch (error) {
      console.error('Error updating rule:', error);
      alert('Errore nell\'aggiornamento della regola');
    }
  };

  const deleteRule = async (sectionId: string, ruleId: string) => {
    try {
      await rulesAPI.deleteRule(ruleId);

      // Refresh data from server
      onRefresh();
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert('Errore nell\'eliminazione della regola');
    }
  };

  const moveRule = async (fromSectionId: string, toSectionId: string, ruleId: string) => {
    const rule = sections.find(s => s.id === fromSectionId)?.rules.find(r => r.id === ruleId);
    if (!rule) return;

    try {
      await rulesAPI.updateRule(ruleId, {
        title: rule.title,
        content: rule.content,
        orderIndex: rule.orderIndex,
        sectionId: toSectionId
      });

      // Refresh data from server
      onRefresh();
    } catch (error) {
      console.error('Error moving rule:', error);
      alert('Errore nello spostamento della regola');
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
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