import React, { useState } from 'react';
import { BotProvider, useBot } from './context/BotContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AddBotModal } from './components/AddBotModal';
import { OAuthConnectModal } from './components/OAuthConnectModal';
import { ToastContainer } from './components/ToastContainer';

// 18 Views
import { OverviewView } from './views/OverviewView';
import { MyBotsView } from './views/MyBotsView';
import { BotManagementView } from './views/BotManagementView';
import { CommandsView } from './views/CommandsView';
import { ModerationView } from './views/ModerationView';
import { AutomationsView } from './views/AutomationsView';
import { WelcomeSystemView } from './views/WelcomeSystemView';
import { LeaveMessagesView } from './views/LeaveMessagesView';
import { LoggingView } from './views/LoggingView';
import { AutoRolesView } from './views/AutoRolesView';
import { ReactionRolesView } from './views/ReactionRolesView';
import { TicketSystemView } from './views/TicketSystemView';
import { GiveawaySystemView } from './views/GiveawaySystemView';
import { LevelingSystemView } from './views/LevelingSystemView';
import { CustomEmbedsView } from './views/CustomEmbedsView';
import { AnalyticsView } from './views/AnalyticsView';
import { IntegrationsView } from './views/IntegrationsView';
import { SettingsView } from './views/SettingsView';

const DashboardContent: React.FC = () => {
  const { activeSection, isLoading } = useBot();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(false);

  const renderActiveView = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewView />;
      case 'my-bots':
        return <MyBotsView />;
      case 'bot-management':
        return <BotManagementView />;
      case 'commands':
        return <CommandsView />;
      case 'moderation':
        return <ModerationView />;
      case 'automations':
        return <AutomationsView />;
      case 'welcome-system':
        return <WelcomeSystemView />;
      case 'leave-messages':
        return <LeaveMessagesView />;
      case 'logging':
        return <LoggingView />;
      case 'auto-roles':
        return <AutoRolesView />;
      case 'reaction-roles':
        return <ReactionRolesView />;
      case 'ticket-system':
        return <TicketSystemView />;
      case 'giveaway-system':
        return <GiveawaySystemView />;
      case 'leveling-system':
        return <LevelingSystemView />;
      case 'custom-embeds':
        return <CustomEmbedsView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090d] text-neutral-100 flex flex-col carbon-bg">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showLandingPage={showLandingPage}
        setShowLandingPage={setShowLandingPage}
      />

      {showLandingPage ? (
        <LandingPage onEnterDashboard={() => setShowLandingPage(false)} />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

          <main className="flex-1 lg:pl-72 min-w-0 overflow-y-auto">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {isLoading ? (
                <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-neutral-400 font-medium">Connecting to PulseCord Gateway...</p>
                </div>
              ) : (
                renderActiveView()
              )}
            </div>
          </main>
        </div>
      )}

      {/* Global Modals and Notifications */}
      <AddBotModal />
      <OAuthConnectModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <BotProvider>
        <DashboardContent />
      </BotProvider>
    </ThemeProvider>
  );
}
