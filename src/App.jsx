import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./auth/ProtectedRoute.jsx";
import { AppShell } from "./components/layout/AppShell.jsx";
import { AuthForm } from "./features/auth/AuthForm.jsx";
import { BookingsPage } from "./features/bookings/BookingsPage.jsx";
import { ChatPage } from "./features/chat/ChatPage.jsx";
import { MatchesPage } from "./features/matches/MatchesPage.jsx";
import { PgListPage } from "./features/pg/PgListPage.jsx";
import { ProfilePage } from "./features/profile/ProfilePage.jsx";

const App = () => (
  <Routes>
    <Route path="/login" element={<AuthForm mode="login" />} />
    <Route path="/register" element={<AuthForm mode="register" />} />

    <Route element={<ProtectedRoute />}>
      <Route element={<AppShell />}>
        <Route index element={<PgListPage />} />
        <Route path="/matches" element={<MatchesPage />} />
        <Route path="/bookings" element={<BookingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>
    </Route>

    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
