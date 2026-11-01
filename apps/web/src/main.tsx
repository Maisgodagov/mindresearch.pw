import "./theme/colors.css";
import { resolveThemeValue } from "./theme/resolveThemeValue";
import { ProductAnalytics } from "./analytics";
import { PageTitles } from "./pageTitle";
import React, { Suspense } from "react";
import { ConfigProvider } from "antd";
import ruRU from "antd/locale/ru_RU";
import "antd/dist/reset.css";
import "@fontsource-variable/manrope";
import "@fontsource-variable/lora";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { GlobalStyle } from "./styles";
import { AuthGuard } from "./platform/AuthGuard";
import { PlatformLayout } from "./containers/PlatformLayout";
import { RouteSkeleton } from "./components/RouteSkeleton";
import { ActionSkeleton } from "./components/LoadingSkeleton";
const PublicMethods = React.lazy(() => import('./containers/PublicMethods').then(m => ({default:m.PublicMethods})));
const PublicMethodPage = React.lazy(() => import('./containers/PublicMethods').then(m => ({default:m.PublicMethodPage})));
const PublicAssessment = React.lazy(() => import('./containers/PublicMethods').then(m => ({default:m.PublicAssessment})));
const PublicAssessmentResult = React.lazy(() => import('./containers/PublicMethods').then(m => ({default:m.PublicAssessmentResult})));
const PublicMethodsAdmin = React.lazy(() => import('./containers/PublicMethods/Admin').then(m => ({default:m.PublicMethodsAdmin})));
const SurveyInvitation = React.lazy(() => import('./components/SurveySharing').then(m=>({default:m.SurveyInvitation})));
const SharedSurveyPreview = React.lazy(() => import('./components/SurveySharing').then(m=>({default:m.SharedSurveyPreview})));

const Community = React.lazy(() => import("./containers/Community").then(m => ({ default: m.Community })));
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
const Landing = React.lazy(() => import("./containers/Landing").then(m => ({ default: m.Landing })));
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
const AdminUserPage=React.lazy(()=>import('./containers/AdminCenter/AdminUserPage').then(m=>({default:m.AdminUserPage})));
const AdminSurveyPage=React.lazy(()=>import('./containers/AdminCenter/AdminSurveyPage').then(m=>({default:m.AdminSurveyPage})));
const AdminSurveyStatistics=React.lazy(()=>import('./containers/AdminCenter/AdminSurveyPage').then(m=>({default:m.AdminSurveyStatistics})));
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

function HomeRedirect() {
  const {search, hash} = useLocation();
  return (
    <AuthGuard loginPath={"/for-researchers" + search + hash}>
      <Navigate to={{pathname: "/app", search, hash}} replace />
    </AuthGuard>
  );
}

function App() {
  return (
    <ConfigProvider
      locale={ruRU}
      select={{ loadingIcon: <ActionSkeleton /> }}
      theme={{
        token: {
          colorPrimary: resolveThemeValue("var(--color-brand)"),
          colorInfo: resolveThemeValue("var(--color-brand)"),
          colorSuccess: resolveThemeValue("var(--color-brand)"),
          colorWarning: resolveThemeValue("var(--color-palette-9a7540)"),
          colorError: resolveThemeValue("var(--color-palette-b85d55)"),
          colorText: resolveThemeValue("var(--color-ink)"),
          colorTextSecondary: resolveThemeValue("var(--color-muted)"),
          colorBorder: resolveThemeValue("var(--color-border)"),
          colorBgContainer: resolveThemeValue("var(--color-surface)"),
          borderRadius: 8,
          borderRadiusLG: 16,
          controlHeight: 44,
          fontFamily: "Manrope Variable, sans-serif",
          fontWeightStrong: 600,
          boxShadowSecondary: resolveThemeValue("0 8px 24px var(--color-brand-alpha-080)"),
        },
        components: {
          Button: {
            primaryShadow: "none",
            defaultShadow: "none",
            controlHeightLG: 48,
            defaultHoverBg: resolveThemeValue("var(--color-brand-soft)"),
            defaultHoverColor: resolveThemeValue("var(--color-brand)"),
            defaultHoverBorderColor: "transparent",
            defaultActiveBg: resolveThemeValue("var(--color-brand-soft)"),
            defaultActiveColor: resolveThemeValue("var(--color-ink)"),
            defaultActiveBorderColor: "transparent",
          },
          Input: {
            activeShadow: resolveThemeValue("0 0 0 3px var(--color-brand-alpha-200)"),
            activeBorderColor: resolveThemeValue("var(--color-brand)"),
            hoverBorderColor: resolveThemeValue("var(--color-border-strong)"),
          },
          Select: {
            activeOutlineColor: resolveThemeValue("var(--color-brand-alpha-200)"),
            optionSelectedBg: resolveThemeValue("var(--color-brand-soft)"),
          },
        },
      }}
    >
      <GlobalStyle />
      <Suspense fallback={<RouteSkeleton />}>
        <Routes>
          <Route path="/methods" element={<PublicMethods/>}/>
          <Route path="/methods/:slug" element={<PublicMethodPage/>}/>
          <Route path="/methods/:slug/start" element={<PublicAssessment/>}/>
          <Route path="/assessment/result" element={<PublicAssessmentResult/>}/>
          <Route path="/app/admin/public-methods" element={<AuthGuard adminOnly><PublicMethodsAdmin/></AuthGuard>}/>
          <Route path="/" element={<HomeRedirect />} />
          <Route path="/for-researchers" element={<Landing />} />
          <Route path="/s/:slug" element={<SurveyPage />} />
          <Route path="/p/:slug" element={<PublicProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/register" element={<Register />} />
          <Route path="/invite/:token" element={<SurveyInvitation />} />
          <Route path="/app/surveys/:surveyId/preview" element={protectedPage(<SharedSurveyPreview/>)} />
          <Route path="/app" element={protectedPage(<PlatformHome />)} />
          <Route path="/app/community" element={<AuthGuard adminOnly><Community /></AuthGuard>} />
          <Route path="/app/profile" element={protectedPage(<ProfilePage />)} />
          <Route
            path="/app/methodologies/suggest"
            element={protectedPage(<SuggestInstrument />)}
          />
          <Route
            path="/app/methodologies/review"
            element={protectedPage(<ReviewInstruments />)}
          />
          <Route path="/app/admin/users/:userId" element={protectedPage(<AdminUserPage/>)} />
          <Route path="/app/admin/users/:userId/surveys/:surveyId" element={protectedPage(<AdminSurveyPage/>)} />
          <Route path="/app/admin/users/:userId/surveys/:surveyId/results" element={protectedPage(<AdminSurveyStatistics/>)} />
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
    <BrowserRouter><PageTitles/><ProductAnalytics />
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
