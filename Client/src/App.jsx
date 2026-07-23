import AppProviders from "./context/AppProviders";

function AppContent() {
  return (
    <>
      <h1>markethive</h1>
    </>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}