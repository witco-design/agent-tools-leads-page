import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";

const Home = lazy(() => import("./components/home"));
const LeadDetailPage = lazy(() => import("./components/lead-detail/LeadDetailPage"));

function App() {
  return (
    <TooltipProvider delayDuration={150}>
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<LeadDetailPage />} />
          <Route path="/design-system" element={<Home />} />
        </Routes>
      </Suspense>
    </TooltipProvider>
  );
}

export default App;
