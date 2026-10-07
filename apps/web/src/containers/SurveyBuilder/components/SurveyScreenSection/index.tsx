import { LockKeyhole, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import { TextAreaField } from "../../../../components/TextAreaField";
import { SectionCard } from "../../styles";

type Props = {
  children?: ReactNode;
  kind: "start" | "finish";
  title: string;
  helper: string;
  heading: string;
  body: string;
  headingInvalid?: boolean;
  bodyInvalid?: boolean;
  headingLabel: string;
  bodyLabel: string;
  headingPlaceholder: string;
  bodyPlaceholder: string;
  settingLabel: string;
  settingChecked: boolean;
  onHeadingChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onSettingChange: (checked: boolean) => void;
};

export function SurveyScreenSection({
  children,
  kind,
  title,
  helper,
  heading,
  body,
  headingInvalid,
  bodyInvalid,
  headingLabel,
  bodyLabel,
  headingPlaceholder,
  bodyPlaceholder,
  settingLabel,
  settingChecked,
  onHeadingChange,
  onBodyChange,
  onSettingChange,
}: Props) {
  return (
    <SectionCard className={`fixed-screen-card ${kind}-screen`}>
      <div className="section-head">
        <div className="section-name">
          <b>{title}</b>
          <span>{helper}</span>
        </div>
        <span className="screen-badge">
          <LockKeyhole size={12} /> Закреплён
        </span>
      </div>
      <div className="body screen-body">
        <div className="screen-fields">
          <label className="screen-field">
            <span><Pencil size={12} /> {headingLabel}</span>
            <TextAreaField
              rows={2}
              className={headingInvalid ? "invalid" : undefined}
              data-validation-error={headingInvalid || undefined}
              value={heading}
              placeholder={headingPlaceholder}
              onChange={(event) => onHeadingChange(event.target.value)}
            />
          </label>
          <label className="screen-field">
            <span><Pencil size={12} /> {bodyLabel}</span>
            <TextAreaField
              rows={2}
              className={bodyInvalid ? "invalid" : undefined}
              data-validation-error={bodyInvalid || undefined}
              value={body}
              placeholder={bodyPlaceholder}
              onChange={(event) => onBodyChange(event.target.value)}
            />
          </label>
        </div>
        {children}
        <label className="screen-setting">
          <input
            type="checkbox"
            checked={settingChecked}
            onChange={(event) => onSettingChange(event.currentTarget.checked)}
          />
          <span>{settingLabel}</span>
        </label>
      </div>
    </SectionCard>
  );
}
