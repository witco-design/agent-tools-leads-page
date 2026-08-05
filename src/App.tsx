import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DevModeProvider, DevModeToggle } from "./devmode";
import { VersionProvider } from "./contexts/VersionContext";
import { VersionToggle } from "./components/shell/VersionToggle";

const Home = lazy(() => import("./components/home"));
const LeadDetailPage = lazy(() => import("./components/lead-detail/LeadDetailPage"));

function App() {
  return (
    <DevModeProvider>
      <VersionProvider>
        <TooltipProvider delayDuration={150}>
          <Suspense fallback={<p>Loading...</p>}>
            <Routes>
              <Route path="/" element={<LeadDetailPage />} />
              <Route path="/design-system" element={<Home />} />
            </Routes>
          </Suspense>

          <DevModeToggle />
          <VersionToggle />
        </TooltipProvider>
      </VersionProvider>
    </DevModeProvider>
  );
}

export default App;
