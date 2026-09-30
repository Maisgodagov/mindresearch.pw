import { AdminPage } from "../../components/AdminPage";
import { PlatformLayout } from "../PlatformLayout";
import { MethodologyStudio } from "../MethodologyStudio";
import { editorPageCopy } from "./const";

export function AdminMethodologyEditor() {
  return (
    <PlatformLayout>
      <AdminPage>
        <h1>{editorPageCopy.title}</h1>
        <p className="lead">{editorPageCopy.description}</p>
        <MethodologyStudio />
      </AdminPage>
    </PlatformLayout>
  );
}
