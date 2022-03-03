import React from "react";
import "./App.css";
import { useAuth } from "context/authContext";
import { FullPageErrorFallback } from "components/lib";
import { ErrorBoundary } from "components/errorBoundary";
import { UnauthenticatedApp } from "unAuthenticated";
import { AuthenticatedApp } from "authenticatedApp";
function App() {
  const { user } = useAuth();
  return (
    <div className="App">
      <ErrorBoundary fallbackRender={FullPageErrorFallback}>
        {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
      </ErrorBoundary>
    </div>
  );
}

export default App;
