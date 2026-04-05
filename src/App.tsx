import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import OngoingPage from "@/pages/OngoingPage";
import CompletedPage from "@/pages/CompletedPage";
import AnimeDetailPage from "@/pages/AnimeDetailPage";
import WatchPage from "@/pages/WatchPage";
import SearchPage from "@/pages/SearchPage";
import GenrePage from "@/pages/GenrePage";
import SchedulePage from "@/pages/SchedulePage";
import FavoritesPage from "@/pages/FavoritesPage";
import HistoryPage from "@/pages/HistoryPage";
import AllAnimePage from "@/pages/AllAnimePage";
import BatchPage from "@/pages/BatchPage";
import NotFoundPage from "@/pages/NotFoundPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import AboutPage from "@/pages/AboutPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/ongoing" element={<OngoingPage />} />
            <Route path="/completed" element={<CompletedPage />} />
            <Route path="/anime/:slug" element={<AnimeDetailPage />} />
            <Route path="/watch/:slug" element={<WatchPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/genre" element={<GenrePage />} />
            <Route path="/genre/:slug" element={<GenrePage />} />
            <Route path="/schedule" element={<SchedulePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/all-anime" element={<AllAnimePage />} />
            <Route path="/batch" element={<BatchPage />} />
            <Route path="/batch/:slug" element={<BatchPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfServicePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" theme="dark" richColors />
    </QueryClientProvider>
  );
}
