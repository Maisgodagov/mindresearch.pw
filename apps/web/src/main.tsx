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
          colorPrimary: "#52764b",
          colorInfo: "#52764b",
          colorSuccess: "#52764b",
          colorWarning: "#9a7540",
          colorError: "#b85d55",
          colorText: "#1e2c23",
          colorTextSecondary: "#647268",
          colorBorder: "#d9e2d8",
          colorBgContainer: "#fff",
          borderRadius: 9,
          borderRadiusLG: 14,
          controlHeight: 42,
          fontFamily: "Manrope Variable, sans-serif",
          boxShadowSecondary: "0 12px 30px rgba(34,52,37,.12)",
        },
        components: {
          Button: {
            primaryShadow: "none",
            defaultShadow: "none",
            controlHeightLG: 48,
            defaultHoverBg: "#edf4ea",
            defaultHoverColor: "#365532",
            defaultHoverBorderColor: "#b8cbb2",
            defaultActiveBg: "#e3eddf",
            defaultActiveColor: "#304d2d",
            defaultActiveBorderColor: "#a9c09f",
          },
          Input: {
            activeShadow: "0 0 0 3px rgba(82,118,75,.2)",
            activeBorderColor: "#52764b",
            hoverBorderColor: "#a7bda2",
          },
          Select: {
            activeOutlineColor: "rgba(82,118,75,.2)",
            optionSelectedBg: "#e8f1e3",
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
