import React from 'react';
import { DispatchProvider, useDispatch } from './context/DispatchContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LiveMapPage from './pages/LiveMapPage';
import AlertsPage from './pages/AlertsPage';
import DevicesPage from './pages/DevicesPage';
import DispatchPage from './pages/DispatchPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import { Sidebar, Topbar } from './components/Navigation';
import TransmissionLoading from './components/TransmissionLoading';
import NewAlertPopup from './components/NewAlertPopup';
import AlertDetailModal from './components/AlertDetailModal';

function AppContent() {
  const {
    isAuthenticated,
    isTransmitting,
    handleTransmissionComplete,
    currentPage,
    incomingAlert,
    setIncomingAlert,
    acknowledgeAlert,
    dispatchTeamToAlert,
    selectedAlert,
    setSelectedAlert,
    setFocusedAlertId
  } = useDispatch();

  // If undergoing transmission sequence
  if (isTransmitting) {
    return <TransmissionLoading onComplete={handleTransmissionComplete} />;
  }

  // If not logged in
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Active page renderer
  const renderActivePage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'liveMap':
        return <LiveMapPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'devices':
        return <DevicesPage />;
      case 'dispatch':
        return <DispatchPage />;
      case 'settings':
        return <SettingsPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-cyber-bg text-cyber-text">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderActivePage()}
        </main>
      </div>

      {/* Real-time Incoming Emergency Pop-up */}
      {incomingAlert && (
        <NewAlertPopup
          alert={incomingAlert}
          onClose={() => setIncomingAlert(null)}
          onAcknowledge={(id) => acknowledgeAlert(id)}
          onViewAlert={(al) => {
            setSelectedAlert(al);
            setFocusedAlertId(al.id);
          }}
          onDispatch={(al) => dispatchTeamToAlert(al)}
        />
      )}

      {/* Detailed Alert Telemetry Modal */}
      {selectedAlert && (
        <AlertDetailModal
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <DispatchProvider>
      <AppContent />
    </DispatchProvider>
  );
}
