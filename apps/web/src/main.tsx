import React, { Suspense } from "react";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import "antd/dist/reset.css";
import "@fontsource-variable/manrope";
import "@fontsource-variable/lora";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { GlobalStyle } from "./styles";
import { AuthGuard } from "./platform/AuthGuard";
import { PlatformLayout } from "./containers/PlatformLayout";
import { SkeletonScreen } from "./ui";

const SurveyPage = React.lazy(() =>
  import("./containers/SurveyTaking").then((m) => ({ default: m.SurveyPage })),
);
const Login = React.lazy(() =>
  import("./containers/Login").then((m) => ({ default: m.Login })),
);
const Dashboard = React.lazy(() =>
  import("./containers/SurveyDashboard").then((m) => ({
    default: m.Dashboard,
  })),
);
const LegacyLogin = React.lazy(() =>
  import("./containers/LegacyLogin").then((m) => ({ default: m.LegacyLogin })),
);
const Register = React.lazy(() =>
  import("./containers/Register").then((m) => ({ default: m.Register })),
);
const PlatformHome = React.lazy(() =>
  import("./containers/SurveyList").then((m) => ({ default: m.PlatformHome })),
);
const SurveyBuilder = React.lazy(() =>
  import("./containers/SurveyBuilder").then((m) => ({
    default: m.SurveyBuilder,
  })),
);
const ProfilePage = React.lazy(() =>
  import("./containers/Profile").then((m) => ({ default: m.ProfilePage })),
);
const PublicProfile = React.lazy(() =>
  import("./containers/PublicProfile").then((m) => ({
    default: m.PublicProfile,
  })),
);
const SuggestInstrument = React.lazy(() =>
  import("./containers/SuggestInstrument").then((m) => ({
    default: m.SuggestInstrument,
  })),
);
const ReviewInstruments = React.lazy(() =>
  import("./containers/ReviewInstruments").then((m) => ({
    default: m.ReviewInstruments,
  })),
);
const AdminCenter = React.lazy(() =>
  import("./containers/AdminCenter").then((m) => ({ default: m.AdminCenter })),
);
const AdminMethodologyEditor = React.lazy(() =>
  import("./containers/AdminMethodologyEditor").then((m) => ({
    default: m.AdminMethodologyEditor,
  })),
);
const ForgotPassword = React.lazy(() =>
  import("./containers/PasswordReset").then((m) => ({
    default: m.ForgotPassword,
  })),
);
const ResetPassword = React.lazy(() =>
  import("./containers/PasswordReset").then((m) => ({
    default: m.ResetPassword,
  })),
);

const protectedPage = (page: React.ReactNode) => <AuthGuard>{page}</AuthGuard>;

function App() {
  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: "#526f5b",
          colorInfo: "#526f5b",
          colorSuccess: "#52785d",
          colorWarning: "#ad8451",
          colorError: "#b85d55",
          colorText: "#26382f",
          colorTextSecondary: "#718078",
          colorBorder: "#d2ddd2",
          colorBgContainer: "#fff",
          borderRadius: 12,
          borderRadiusLG: 20,
          controlHeight: 48,
          fontFamily: "Manrope Variable, sans-serif",
          boxShadowSecondary: "0 12px 34px rgba(48,70,54,.08)",
        },
        components: {
          Button: {
            primaryShadow: "none",
            defaultShadow: "none",
            controlHeightLG: 54,
            defaultHoverBg: "#e2ebe0",
            defaultHoverColor: "#3f5e47",
            defaultHoverBorderColor: "#bfd0bc",
            defaultActiveBg: "#dfeadd",
            defaultActiveColor: "#354f3d",
            defaultActiveBorderColor: "#afc4ae",
          },
          Input: {
            activeShadow: "0 0 0 3px rgba(95,128,104,.12)",
            activeBorderColor: "#78947e",
            hoverBorderColor: "#b9cbb9",
          },
          Select: {
            activeOutlineColor: "rgba(95,128,104,.12)",
            optionSelectedBg: "#e7efe5",
          },
        },
      }}
    >
      <GlobalStyle />
      <Suspense fallback={<SkeletonScreen variant="form" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/register" replace />} />
          <Route path="/s/:slug" element={<SurveyPage />} />
          <Route path="/p/:slug" element={<PublicProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={protectedPage(<PlatformHome />)} />
          <Route path="/app/profile" element={protectedPage(<ProfilePage />)} />
          <Route
            path="/app/methodologies/suggest"
            element={protectedPage(<SuggestInstrument />)}
          />
          <Route
            path="/app/methodologies/review"
            element={protectedPage(<ReviewInstruments />)}
          />
          <Route path="/app/admin" element={protectedPage(<AdminCenter />)} />
          <Route
            path="/app/admin/methodologies"
            element={protectedPage(<AdminMethodologyEditor />)}
          />
          <Route
            path="/app/surveys/new"
            element={protectedPage(<SurveyBuilder />)}
          />
          <Route
            path="/app/surveys/:surveyId/edit"
            element={protectedPage(<SurveyBuilder />)}
          />
          <Route
            path="/app/surveys/:surveyId/results"
            element={protectedPage(
              <PlatformLayout>
                <Dashboard embedded />
              </PlatformLayout>,
            )}
          />
          <Route path="/admin/login" element={<LegacyLogin />} />
          <Route
            path="/admin"
            element={
              <AuthGuard loginPath="/admin/login">
                <Dashboard />
              </AuthGuard>
            }
          />
          <Route path="*" element={<Navigate to="/register" replace />} />
        </Routes>
      </Suspense>
    </ConfigProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
