import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DevModeProvider } from "./dev/DevModeContext";
import { DevModeToggle } from "./dev/DevModeToggle";

const Home = lazy(() => import("./components/home"));
const LeadDetailPage = lazy(() => import("./components/lead-detail/LeadDetailPage"));

// DIAGNOSTIC_PLUS_SWAP_v1 — temporary plus icons to verify build pipeline
function App() {
  return (
    <DevModeProvider>
      <TooltipProvider delayDuration={150}>
        <Suspense fallback={<p>Loading...</p>}>
          <Routes>
            <Route path="/" element={<LeadDetailPage />} />
            <Route path="/design-system" element={<Home />} />
          </Routes>
        </Suspense>

        {/* Dev tools (only rendered in dev, stripped from production builds) */}
        {import.meta.env.DEV && <DevModeToggle />}
      </TooltipProvider>
    </DevModeProvider>
  );
}

export default App;
