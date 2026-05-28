import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./components/home"));
const LeadDetailPage = lazy(() => import("./components/lead-detail/LeadDetailPage"));

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<LeadDetailPage />} />
          <Route path="/design-system" element={<Home />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
