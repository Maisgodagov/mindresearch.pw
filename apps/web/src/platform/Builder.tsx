import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Select from "react-select";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Info,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { api } from "../api";
import { Button, Card } from "../ui";
import { MethodologyModal, type Methodology } from "../MethodologyModal";
import { demoInstruments, demoMethodologies } from "./demo";
import { PlatformLayout } from "./Layout";
type Instrument = {
  id: string;
  code?: string;
  title: string;
  description: string;
  questionCount: number;
  isVerified: boolean;
  scoringCode?: string;
  author?: string;
};
type Option = { value: string; label: string };
type Question = {
  id: string;
  text: string;
  type: "single" | "multiple" | "text" | "number";
  required: boolean;
  options: Option[];
};
type Section = {
  id: string;
  kind: "library" | "custom";
  instrumentId?: string;
  title: string;
  questionCount?: number;
  questions?: Question[];
  isVerified?: boolean;
  useSharedOptions?: boolean;
  sharedOptions?: Option[];
};
const Header = styled.div`
  margin-bottom: 18px;
  h1 {
    font:
      500 clamp(32px, 5vw, 44px) var(--font-heading),
      serif;
    color: #304a38;
    margin: 0 0 8px;
  }
  p {
    color: #738077;
    max-width: 720px;
    line-height: 1.6;
  }
`;
const Flow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 18px;
  .step {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    padding: 11px 14px;
    border: 1px solid #dce5da;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.62);
    color: #65746a;
  }
  .number {
    width: 25px;
    height: 25px;
    flex: 0 0 25px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: #e4eee1;
    color: #45614d;
    font-size: 12px;
    font-weight: 800;
  }
  b { color: #3b5242; font-size: 13px; }
  span:last-child { font-size: 11px; }
  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    .step { padding: 9px 12px; }
  }
`;
const Columns = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.72fr);
  grid-template-areas:
    "meta meta"
    "structure library";
  gap: 18px;
  align-items: start;
  > div { display: contents; }
  .meta-panel { grid-area: meta; }
  .library-panel {
    grid-area: library;
    margin-top: 0 !important;
    position: sticky;
    top: 18px;
  }
  .structure-panel { grid-area: structure; }
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "meta"
      "library"
      "structure";
    .library-panel { position: static; }
  }
`;
const Panel = styled(Card)`
  padding: 23px;
  border-radius: 21px;
  h2 {
    font:
      600 20px var(--font-heading),
      serif;
    margin: 0 0 7px;
    color: #354e3c;
  }
  .hint {
    font-size: 12px;
    color: #7c8880;
    line-height: 1.5;
  }
  .field {
    margin-top: 15px;
  }
  label {
    display: block;
    font-size: 12px;
    font-weight: 700;
    color: #65736a;
    margin-bottom: 6px;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 12px;
    border: 1px solid #d7e0d5;
    border-radius: 11px;
    background: #fff;
    outline: none;
  }
  textarea {
    min-height: 92px;
    resize: vertical;
  }
`;
const SurveyBasics = styled.div`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 12px;
  margin-top: 15px;
  .field { margin: 0; }
  textarea { min-height: 48px; height: 48px; }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;
const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
  @media (max-width: 820px) { grid-template-columns: 1fr; }
`;
const PreviewCard = styled.div`
  min-width: 0;
  border: 1px solid #dce5da;
  border-radius: 18px;
  background: linear-gradient(145deg, #fff, #f8fbf6);
  overflow: hidden;
  .preview-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 13px;
    border-bottom: 1px solid #e8ede6;
    color: #728077;
    font-size: 11px;
    font-weight: 700;
  }
  .screen { padding: 18px; min-height: 255px; }
  .eyebrow, .done {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 12px;
    color: #55705e;
    font-size: 11px;
  }
  .done { padding: 5px 8px; border-radius: 999px; background: #e5efe2; }
  .preview-title,
  .preview-copy {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: #304a38;
    resize: none;
  }
  .preview-title {
    min-height: 66px;
    font: 500 clamp(25px, 3vw, 36px)/1.08 var(--font-heading), serif;
  }
  .preview-copy {
    min-height: 72px;
    margin-top: 10px;
    color: #67766c;
    font-size: 13px;
    line-height: 1.6;
  }
  .preview-title:focus,
  .preview-copy:focus { outline: none; background: #f4f7f1; box-shadow: 0 0 0 6px #f4f7f1; }
  .mock-meta { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px; color: #7e8a82; font-size: 10px; }
  .mock-button { display: inline-flex; margin-top: 17px; padding: 9px 14px; border-radius: 10px; background: #56755f; color: white; font-size: 11px; font-weight: 750; }
  .preview-settings { padding: 11px 13px; border-top: 1px solid #e8ede6; background: #f5f8f3; }
  .preview-settings label { display: flex; gap: 8px; align-items: flex-start; margin: 0; line-height: 1.4; }
  .preview-settings input { width: 16px; height: 16px; flex: 0 0 16px; margin-top: 1px; }
`;
const CatalogTools = styled.div`
  display: grid;
  gap: 12px;
  margin-top: 15px;
  .create-custom {
    width: 100%;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 1px solid #b8cbb9;
    border-radius: 13px;
    background: #e8f0e5;
    color: #3f5c47;
    font-weight: 800;
    cursor: pointer;
  }
  .create-custom:hover { background: #dce9d8; }
  .divider { display: flex; align-items: center; gap: 9px; color: #829087; font-size: 11px; }
  .divider::before, .divider::after { content: ""; height: 1px; flex: 1; background: #e1e8df; }
  .search { position: relative; }
  .search svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #728178; }
  .search input { padding-left: 36px; }
`;
const Library = styled.div`
  display: grid;
  gap: 11px;
  max-height: 560px;
  margin-top: 12px;
  padding-right: 5px;
  overflow-y: auto;
  scrollbar-color: #a9bba9 transparent;
  scrollbar-width: thin;
  .item {
    border: 1px solid #dce5da;
    border-radius: 16px;
    padding: 16px;
    background: linear-gradient(145deg, #fff, #fafcf9);
    transition: 0.18s;
  }
  .item:hover {
    border-color: #b9cbb9;
    box-shadow: 0 10px 28px rgba(51, 75, 58, 0.07);
  }
  .top {
    display: flex;
    justify-content: space-between;
    gap: 10px;
  }
  .title {
    font-weight: 750;
    color: #3d5544;
  }
  .verified {
    color: #52745b;
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }
  .author {
    font-size: 11px;
    color: #68776d;
    margin-top: 6px;
  }
  .description {
    font-size: 12px;
    color: #78847c;
    line-height: 1.5;
    margin: 9px 0;
  }
  .bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: #89948c;
    flex-wrap: wrap;
  }
  .links {
    display: flex;
    gap: 5px;
  }
  .more {
    border: 0;
    background: transparent;
    color: #526f5b;
    padding: 7px;
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 650;
  }
  .add {
    border: 0;
    background: #e5eee2;
    color: #46614e;
    border-radius: 9px;
    padding: 8px 11px;
    font-weight: 700;
  }
`;
const Stack = styled.div`
  display: grid;
  gap: 10px;
  margin-top: 15px;
`;
const SectionCard = styled.div<{ $dragging?: boolean }>`
  border: 1px solid #dce5da;
  border-radius: 15px;
  background: #fff;
  overflow: hidden;
  opacity: ${(p) => (p.$dragging ? 0.45 : 1)};
  transition:
    opacity 0.15s,
    border-color 0.15s;
  .section-head {
    padding: 13px;
    display: flex;
    align-items: center;
    gap: 9px;
  }
  .section-name {
    flex: 1;
  }
  .section-name b {
    display: block;
    color: #3b5242;
  }
  .section-name span {
    font-size: 11px;
    color: #819087;
  }
  .section-drag {
    display: grid;
    place-items: center;
    color: #839087;
    cursor: grab;
    padding: 6px 2px;
    border: 0;
    background: transparent;
    touch-action: none;
  }
  .icon {
    border: 0;
    background: transparent;
    color: #75847a;
    padding: 5px;
  }
  .body {
    padding: 0 14px 14px;
    border-top: 1px solid #edf1ec;
  }
  .options { display: grid; gap: 7px; }
  .option { display: flex; align-items: center; gap: 7px; }
  .option input { min-width: 0; flex: 1; }
  .option .tiny {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    display: grid;
    place-items: center;
    padding: 0;
    border: 1px solid #d7e1d5;
    border-radius: 10px;
    background: #fff;
    color: #77867c;
    cursor: pointer;
  }
  .option .tiny:hover { border-color: #c9aaa5; background: #fbf1ef; color: #945f59; }
  .add-option {
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 9px 13px;
    border: 0;
    border-radius: 10px;
    background: #e2ede0;
    color: #486451;
    font-size: 12px;
    font-weight: 750;
    cursor: pointer;
  }
  .add-option:hover { background: #d6e5d3; }
`;
const QuestionBox = styled.div<{ $dragging?: boolean }>`
  padding: 13px;
  margin: 9px 0;
  border: 1px solid #e2e9e0;
  border-radius: 13px;
  background: #fcfdfb;
  opacity: ${(p) => (p.$dragging ? 0.45 : 1)};
  transition: 0.15s;
  .qhead {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 9px;
  }
  .qtitle {
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .drag {
    display: grid;
    place-items: center;
    color: #8b978e;
    cursor: grab;
    border: 0;
    background: transparent;
    padding: 4px 1px;
    touch-action: none;
  }
  .qactions {
    display: flex;
    gap: 2px;
  }
  .qgrid {
    display: grid;
    grid-template-columns: 1fr 150px;
    gap: 8px;
  }
  @media (max-width: 560px) {
    .qgrid {
      grid-template-columns: 1fr;
    }
  }
  .options {
    display: grid;
    gap: 6px;
    margin-top: 8px;
  }
  .option {
    display: flex;
    gap: 6px;
    align-items: center;
  }
  .option input {
    padding: 9px;
    width: auto;
    min-width: 0;
    flex: 1;
  }
  .tiny {
    border: 0;
    background: transparent;
    color: #687970;
    font-size: 12px;
    padding: 5px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  .option .tiny {
    width: 38px;
    height: 38px;
    flex: 0 0 38px;
    justify-content: center;
    border: 1px solid #d7e1d5;
    border-radius: 10px;
    background: #fff;
    color: #77867c;
    cursor: pointer;
  }
  .option .tiny:hover {
    border-color: #c9aaa5;
    background: #fbf1ef;
    color: #945f59;
  }
  .add-option {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    justify-self: start;
    border: 0;
    border-radius: 10px;
    background: #e2ede0;
    color: #486451;
    padding: 9px 13px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
  }
  .add-option:hover { background: #d6e5d3; }
  .required {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #718078;
    margin-top: 8px;
  }
  .required input {
    width: auto;
  }
`;
const AddQuestionButton = styled.button`
  width: 100%;
  min-height: 52px;
  margin-top: 12px;
  border: 1.5px dashed #a9bca9;
  border-radius: 13px;
  background: #f7faf5;
  color: #4d6b56;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  font-weight: 700;
  transition: 0.18s;
  .plus {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #e3eee0;
    display: grid;
    place-items: center;
  }
  &:hover {
    background: #edf4ea;
    border-color: #78947e;
    transform: translateY(-1px);
  }
`;
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin: 22px -23px -23px;
  padding: 18px 23px;
  border-top: 1px solid #e3e9e1;
  background: #f6f8f4;
  > label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    white-space: nowrap;
    margin: 0;
  }
  > label input {
    width: 18px;
    height: 18px;
    margin: 0;
    flex: 0 0 18px;
    accent-color: #5b7a63;
  }
  .actions {
    display: flex;
    gap: 9px;
  }
  @media (max-width: 560px) {
    align-items: stretch;
    flex-direction: column;
    .actions, .actions button { width: 100%; }
  }
  .error {
    color: #a05252;
    font-size: 13px;
  }
`;
function SortableSection({
  id,
  children,
}: {
  id: string;
  children: (handle: ReactNode, dragging: boolean) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative" as const,
    zIndex: isDragging ? 3 : 1,
  };
  const handle = (
    <button
      type="button"
      className="section-drag"
      aria-label="Перетащить тест"
      {...attributes}
      {...listeners}
    >
      <GripVertical size={17} />
    </button>
  );
  return (
    <SectionCard ref={setNodeRef} style={style} $dragging={isDragging}>
      {children(handle, isDragging)}
    </SectionCard>
  );
}
function SortableQuestion({
  id,
  children,
}: {
  id: string;
  children: (handle: ReactNode, dragging: boolean) => ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    position: "relative" as const,
    zIndex: isDragging ? 3 : 1,
  };
  const handle = (
    <button
      type="button"
      className="drag"
      aria-label="Перетащить вопрос"
      {...attributes}
      {...listeners}
    >
      <GripVertical size={16} />
    </button>
  );
  return (
    <QuestionBox ref={setNodeRef} style={style} $dragging={isDragging}>
      {children(handle, isDragging)}
    </QuestionBox>
  );
}
const questionTypeOptions = [
  { value: "single", label: "Один вариант" },
  { value: "multiple", label: "Несколько вариантов" },
  { value: "text", label: "Текстовый ответ" },
  { value: "number", label: "Числовой ответ" },
] as const;
const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: 44,
    borderRadius: 11,
    borderColor: state.isFocused ? "#78947e" : "#d7e0d5",
    boxShadow: "none",
    background: "#fff",
    "&:hover": { borderColor: "#9caf9d" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 16px 45px rgba(42,64,48,.16)",
    zIndex: 10,
  }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: 13,
    background: state.isSelected
      ? "#5d7b65"
      : state.isFocused
        ? "#edf4ea"
        : "#fff",
    color: state.isSelected ? "#fff" : "#34483a",
    cursor: "pointer",
  }),
  singleValue: (base: any) => ({ ...base, color: "#34483a", fontSize: 13 }),
  indicatorSeparator: () => ({ display: "none" }),
  menuPortal: (base: any) => ({ ...base, zIndex: 50 }),
};
const makeQuestion = (): Question => ({
  id: crypto.randomUUID(),
  text: "",
  type: "single",
  required: true,
  options: [
    { value: "1", label: "" },
    { value: "2", label: "" },
  ],
});
export function SurveyBuilder() {
  const nav = useNavigate();
  const {surveyId}=useParams();
  const [instruments, setInstruments] = useState<Instrument[]>([]),
    [methodologies, setMethodologies] = useState<Record<string, Methodology>>(
      {},
    ),
    [activeMethodology, setActiveMethodology] = useState<Methodology | null>(
      null,
    ),
    [sections, setSections] = useState<Section[]>([]),
    [open, setOpen] = useState<Record<string, boolean>>({}),
    [libraryQuery, setLibraryQuery] = useState(""),
    [saving, setSaving] = useState(false),
    [error, setError] = useState(""),
    [structureLocked,setStructureLocked]=useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const [meta, setMeta] = useState({
    title: "",
    description: "",
    welcomeTitle: "Спасибо, что решили принять участие",
    welcomeText:
      "Здесь нет правильных или неправильных ответов — важен ваш личный опыт.",
    status: "draft" as "draft" | "active",
    showAuthor: true,
    resultPresentation: {
      showResults: true,
      showScores: true,
      title: "Спасибо за ваши ответы",
      text: "",
    },
  });
  useEffect(() => {
    Promise.all([
      api.get("/account/instruments"),
      api.get("/admin/methodologies"),
    ])
      .then(([i, m]) => {
        setInstruments(i.data);
        setMethodologies(m.data);
      })
      .catch(() => {
        if (import.meta.env.DEV) {
          setInstruments(demoInstruments);
          setMethodologies(demoMethodologies);
        }
      });
    if(surveyId)api.get(`/account/surveys/${surveyId}`).then(({data})=>{setMeta({title:data.title,description:data.description??'',welcomeTitle:data.welcomeTitle,welcomeText:data.welcomeText,status:data.status,showAuthor:Boolean(data.showAuthor),resultPresentation:data.resultPresentation});setSections(data.sections.map((section:Section)=>({...section,useSharedOptions:false,sharedOptions:[{value:'1',label:''},{value:'2',label:''}]})));setOpen(Object.fromEntries(data.sections.filter((section:Section)=>section.kind==='custom').map((section:Section)=>[section.id,true])));setStructureLocked(Number(data.responseCount)>0)}).catch(()=>setError('Не удалось загрузить опрос.'));
  }, [surveyId]);
  const count = useMemo(
    () =>
      sections.reduce(
        (sum, s) => sum + (s.questionCount ?? s.questions?.length ?? 0),
        0,
      ),
    [sections],
  );
  const filteredInstruments = useMemo(() => {
    const query = libraryQuery.trim().toLocaleLowerCase("ru");
    if (!query) return instruments;
    return instruments.filter((instrument) =>
      `${instrument.title} ${instrument.author ?? ""}`
        .toLocaleLowerCase("ru")
        .includes(query),
    );
  }, [instruments, libraryQuery]);
  const addInstrument = (i: Instrument) => {
    if (sections.some((s) => s.instrumentId === i.id)) return;
    setSections((s) => [
      ...s,
      {
        id: crypto.randomUUID(),
        kind: "library",
        instrumentId: i.id,
        title: i.title,
        questionCount: i.questionCount,
        isVerified: i.isVerified,
      },
    ]);
  };
  const addCustom = () => {
    const id = crypto.randomUUID();
    setSections((s) => [
      ...s,
      {
        id,
        kind: "custom",
        title: "Свой блок вопросов",
        questions: [makeQuestion()],
        useSharedOptions: false,
        sharedOptions: [
          { value: "1", label: "" },
          { value: "2", label: "" },
        ],
      },
    ]);
    setOpen((o) => ({ ...o, [id]: true }));
  };
  const move = (index: number, delta: number) =>
    setSections((s) => {
      const copy = [...s],
        to = index + delta;
      if (to < 0 || to >= copy.length) return s;
      [copy[index], copy[to]] = [copy[to], copy[index]];
      return copy;
    });
  const reorderSections = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;
    setSections((current) => {
      const from = current.findIndex((section) => section.id === active.id),
        to = current.findIndex((section) => section.id === over.id);
      return from < 0 || to < 0 ? current : arrayMove(current, from, to);
    });
  };
  const updateSection = (id: string, fn: (section: Section) => Section) =>
    setSections((s) => s.map((x) => (x.id === id ? fn(x) : x)));
  const duplicateQuestion = (sectionId: string, question: Question) =>
    updateSection(sectionId, (s) => {
      const questions = [...(s.questions ?? [])],
        index = questions.findIndex((x) => x.id === question.id),
        copy = {
          ...question,
          id: crypto.randomUUID(),
          options: question.options.map((option) => ({ ...option })),
        };
      questions.splice(index + 1, 0, copy);
      return { ...s, questions };
    });
  const moveQuestion = (sectionId: string, index: number, delta: number) =>
    updateSection(sectionId, (s) => {
      const questions = [...(s.questions ?? [])],
        to = index + delta;
      if (to < 0 || to >= questions.length) return s;
      [questions[index], questions[to]] = [questions[to], questions[index]];
      return { ...s, questions };
    });
  const reorderQuestions = (
    sectionId: string,
    { active, over }: DragEndEvent,
  ) => {
    if (!over || active.id === over.id) return;
    updateSection(sectionId, (s) => {
      const questions = [...(s.questions ?? [])],
        from = questions.findIndex((x) => x.id === active.id),
        to = questions.findIndex((x) => x.id === over.id);
      if (from < 0 || to < 0) return s;
      return { ...s, questions: arrayMove(questions, from, to) };
    });
  };
  async function submit() {
    if (!meta.title.trim() || !sections.length) {
      setError("Укажите название и добавьте хотя бы один блок.");
      return;
    }
    for (const section of sections)
      if (
        section.kind === "custom" &&
        section.questions?.some(
          (q) =>
            !q.text.trim() ||
            ((q.type === "single" || q.type === "multiple") &&
              (section.useSharedOptions
                ? section.sharedOptions
                : q.options
              )?.some((o) => !o.label.trim())),
        )
      ) {
        setError("Заполните тексты вопросов и варианты ответов.");
        return;
      }
    setSaving(true);
    setError("");
    const payload = {
      ...meta,
      sections: sections.map((s) =>
        s.kind === "library"
          ? { kind: "library", instrumentId: s.instrumentId }
          : {
              kind: "custom",
              title: s.title,
              description: "",
              questions: s.questions?.map((q) => ({
                text: q.text,
                type: q.type,
                required: q.required,
                options:
                  q.type === "single" || q.type === "multiple"
                    ? (s.useSharedOptions ? s.sharedOptions : q.options)
                    : undefined,
              })),
            },
      ),
    };
    try {
      if(surveyId)await api.put(`/account/surveys/${surveyId}`,payload);else await api.post("/account/surveys", payload);
      nav("/app");
    } catch (err: any) {
      if (import.meta.env.DEV) {
        nav("/app");
        return;
      }
      setError(err.response?.data?.message ?? "Не удалось создать опрос");
    } finally {
      setSaving(false);
    }
  }
  return (
    <PlatformLayout>
      <Header>
        <h1>{surveyId?'Редактирование опроса':'Новый опрос'}</h1>
        <p>
          Соберите исследование из проверенных методик и собственных вопросов.
          Порядок блоков и вопросов можно менять в любой момент.
        </p>
      </Header>
      <Flow aria-label="Этапы создания опроса">
        <div className="step">
          <span className="number">1</span>
          <span><b>Оформление</b><br />Название и экраны</span>
        </div>
        <div className="step">
          <span className="number">2</span>
          <span><b>Содержание</b><br />Методики и вопросы</span>
        </div>
        <div className="step">
          <span className="number">3</span>
          <span><b>Публикация</b><br />Проверка и запуск</span>
        </div>
      </Flow>
      <Columns>
        <div>
          <Panel className="meta-panel">
            <h2>Оформление опроса</h2>
            <p className="hint panel-intro">Редактируйте тексты прямо в макетах — примерно так их увидит респондент.</p>
            <SurveyBasics>
              <div className="field">
                <label>Название опроса</label>
                <input value={meta.title} onChange={(e)=>setMeta({...meta,title:e.target.value})} placeholder="Например, исследование самочувствия" />
              </div>
              <div className="field">
                <label>Короткое описание в кабинете</label>
                <textarea value={meta.description} onChange={(e)=>setMeta({...meta,description:e.target.value})} placeholder="Для вас и других авторов" />
              </div>
            </SurveyBasics>
            <PreviewGrid>
              <PreviewCard>
                <div className="preview-label"><span>Стартовый экран</span><span>Предпросмотр</span></div>
                <div className="screen">
                  <span className="eyebrow">Анонимное исследование</span>
                  <textarea className="preview-title" aria-label="Заголовок приветствия" value={meta.welcomeTitle} onChange={(e)=>setMeta({...meta,welcomeTitle:e.target.value})} placeholder="Заголовок приветствия" />
                  <textarea className="preview-copy" aria-label="Текст перед началом" value={meta.welcomeText} onChange={(e)=>setMeta({...meta,welcomeText:e.target.value})} placeholder="Расскажите участнику об исследовании" />
                  <div className="mock-meta"><span>{count || 0} вопросов</span><span>Можно прерваться</span></div>
                  <span className="mock-button">Начать →</span>
                </div>
                <div className="preview-settings">
                  <label><input type="checkbox" checked={meta.showAuthor} onChange={(e)=>setMeta({...meta,showAuthor:e.target.checked})}/><span>Показывать ссылку на профиль автора<br/><small>Если профиль опубликован</small></span></label>
                </div>
              </PreviewCard>
              <PreviewCard>
                <div className="preview-label"><span>Финальный экран</span><span>Предпросмотр</span></div>
                <div className="screen">
                  <span className="done"><CheckCircle2 size={13}/> Опрос завершён</span>
                  <textarea className="preview-title" aria-label="Заголовок финального экрана" value={meta.resultPresentation.title} onChange={(e)=>setMeta({...meta,resultPresentation:{...meta.resultPresentation,title:e.target.value}})} placeholder="Спасибо за ваши ответы" />
                  <textarea className="preview-copy" aria-label="Сообщение после завершения" value={meta.resultPresentation.text} onChange={(e)=>setMeta({...meta,resultPresentation:{...meta.resultPresentation,text:e.target.value}})} placeholder="Ваши ответы сохранены" />
                </div>
                <div className="preview-settings">
                  <label><input type="checkbox" checked={meta.resultPresentation.showScores} onChange={(e)=>setMeta({...meta,resultPresentation:{...meta.resultPresentation,showScores:e.target.checked,showResults:e.target.checked}})}/><span>Показывать рассчитанные результаты подтверждённых методик</span></label>
                </div>
              </PreviewCard>
            </PreviewGrid>
          </Panel>
          <Panel className="library-panel">
            <h2>Добавить в опрос</h2>
            <p className="hint">
              Подтверждённые методики защищены от изменений и автоматически
              рассчитывают результат. Перед добавлением можно изучить описание,
              ключ, нормативы и источники.
            </p>
            {structureLocked&&<p className="hint" style={{padding:12,background:'#f4efe3',borderRadius:10,color:'#766847'}}>В опросе уже есть ответы, поэтому состав и порядок вопросов зафиксированы. Название, приветствие, профиль автора, публикацию и финальный экран можно редактировать.</p>}
            <div style={structureLocked?{pointerEvents:'none',opacity:.55}:{}}>
            <CatalogTools>
              <button className="create-custom" onClick={addCustom}><Plus size={17}/> Создать собственный тест</button>
              <div className="divider">или выберите методику</div>
              <div className="search">
                <Search size={16}/>
                <input value={libraryQuery} onChange={(e)=>setLibraryQuery(e.target.value)} placeholder="Название или автор" aria-label="Поиск методик" />
              </div>
            </CatalogTools>
            <Library>
              {filteredInstruments.map((i) => {
                const code = i.code ?? i.scoringCode ?? "",
                  methodology = methodologies[code];
                return (
                  <div className="item" key={i.id}>
                    <div className="top">
                      <span className="title">{i.title}</span>
                      {i.isVerified && (
                        <span className="verified">
                          <ShieldCheck size={13} /> Подтверждён
                        </span>
                      )}
                    </div>
                    {i.author && (
                      <div className="author">
                        Авторы оригинальной методики: {i.author}
                      </div>
                    )}
                    <div className="description">{i.description}</div>
                    <div className="bottom">
                      <span>
                        {i.questionCount} вопросов · автоматический расчёт
                      </span>
                      <div className="links">
                        {methodology && (
                          <button
                            className="more"
                            onClick={() => setActiveMethodology(methodology)}
                          >
                            <Info size={13} /> О методике
                          </button>
                        )}
                        <button
                          className="add"
                          disabled={sections.some(
                            (s) => s.instrumentId === i.id,
                          )}
                          onClick={() => addInstrument(i)}
                        >
                          {sections.some((s) => s.instrumentId === i.id)
                            ? "Добавлен"
                            : "+ Добавить"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!filteredInstruments.length&&<p className="hint" style={{padding:12,textAlign:'center'}}>Методики не найдены. Попробуйте изменить запрос.</p>}
            </Library>
            </div>
          </Panel>
        </div>
        <Panel className="structure-panel">
          <h2>Содержание опроса</h2>
          <p className="hint">
            {sections.length
              ? `${sections.length} блоков · ${count} вопросов. Перетаскивайте тесты и вопросы за значок слева или используйте стрелки.`
              : "Добавьте подтверждённую методику или создайте собственный тест."}
          </p>
          <div style={structureLocked?{pointerEvents:'none',opacity:.65}:{}}>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={reorderSections}
          >
            <SortableContext
              items={sections.map((section) => section.id)}
              strategy={verticalListSortingStrategy}
            >
              <Stack>
                {sections.map((section, index) => (
                  <SortableSection key={section.id} id={section.id}>
                    {(sectionHandle) => (
                      <>
                        <div className="section-head">
                          {sectionHandle}
                          <div className="section-name">
                            <b>{section.title}</b>
                            <span>
                              {section.kind === "library"
                                ? "Подтверждённая методика · автоматический расчёт"
                                : `${section.questions?.length ?? 0} собственных вопросов · без автоматического расчёта`}
                            </span>
                          </div>
                          <button
                            className="icon"
                            aria-label="Переместить блок выше"
                            onClick={() => move(index, -1)}
                          >
                            <ArrowUp size={15} />
                          </button>
                          <button
                            className="icon"
                            aria-label="Переместить блок ниже"
                            onClick={() => move(index, 1)}
                          >
                            <ArrowDown size={15} />
                          </button>
                          {section.kind === "custom" && (
                            <button
                              className="icon"
                              aria-label="Развернуть блок"
                              onClick={() =>
                                setOpen((o) => ({
                                  ...o,
                                  [section.id]: !o[section.id],
                                }))
                              }
                            >
                              {open[section.id] ? (
                                <ChevronUp size={16} />
                              ) : (
                                <ChevronDown size={16} />
                              )}
                            </button>
                          )}
                          <button
                            className="icon"
                            aria-label="Удалить блок"
                            onClick={() =>
                              setSections((s) =>
                                s.filter((x) => x.id !== section.id),
                              )
                            }
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        {section.kind === "custom" && open[section.id] && (
                          <div className="body">
                            <div className="field">
                              <label>
                                Название собственного теста или блока
                              </label>
                              <input
                                value={section.title}
                                onChange={(e) =>
                                  updateSection(section.id, (s) => ({
                                    ...s,
                                    title: e.target.value,
                                  }))
                                }
                              />
                            </div>
                            <div className="field" style={{padding:"13px",background:"#f2f6f0",borderRadius:12}}>
                              <label style={{display:"flex",gap:9,alignItems:"center",margin:0}}>
                                <input type="checkbox" style={{width:18}} checked={Boolean(section.useSharedOptions)} onChange={(e)=>updateSection(section.id,(s)=>({...s,useSharedOptions:e.target.checked}))}/>
                                Один список вариантов для всех вопросов теста
                              </label>
                              {section.useSharedOptions&&<div className="options" style={{marginTop:10}}>
                                {(section.sharedOptions??[]).map((option,oi)=><div className="option" key={option.value}>
                                  <input value={option.label} placeholder={`Вариант ${oi+1}`} onChange={(e)=>updateSection(section.id,(s)=>({...s,sharedOptions:(s.sharedOptions??[]).map((item,index)=>index===oi?{...item,label:e.target.value}:item)}))}/>
                                  {(section.sharedOptions?.length??0)>2&&<button className="tiny" onClick={()=>updateSection(section.id,(s)=>({...s,sharedOptions:(s.sharedOptions??[]).filter((_,index)=>index!==oi).map((item,index)=>({...item,value:String(index+1)}))}))}><Trash2 size={14}/></button>}
                                </div>)}
                                <button className="add-option" onClick={()=>updateSection(section.id,(s)=>({...s,sharedOptions:[...(s.sharedOptions??[]),{value:String((s.sharedOptions?.length??0)+1),label:""}]}))}><Plus size={14}/> Вариант ответа</button>
                                <p className="hint">Список будет применён ко всем вопросам с выбором одного или нескольких вариантов.</p>
                              </div>}
                            </div>
                            <DndContext
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={(event) =>
                                reorderQuestions(section.id, event)
                              }
                            >
                              <SortableContext
                                items={(section.questions ?? []).map(
                                  (question) => question.id,
                                )}
                                strategy={verticalListSortingStrategy}
                              >
                                {section.questions?.map((q, qi) => (
                                  <SortableQuestion key={q.id} id={q.id}>
                                    {(questionHandle) => (
                                      <>
                                        <div className="qhead">
                                          <div className="qtitle">
                                            {questionHandle}
                                            <b>Вопрос {qi + 1}</b>
                                          </div>
                                          <div className="qactions">
                                            <button
                                              className="tiny"
                                              aria-label="Выше"
                                              onClick={() =>
                                                moveQuestion(section.id, qi, -1)
                                              }
                                            >
                                              <ArrowUp size={14} />
                                            </button>
                                            <button
                                              className="tiny"
                                              aria-label="Ниже"
                                              onClick={() =>
                                                moveQuestion(section.id, qi, 1)
                                              }
                                            >
                                              <ArrowDown size={14} />
                                            </button>
                                            <button
                                              className="tiny"
                                              onClick={() =>
                                                duplicateQuestion(section.id, q)
                                              }
                                            >
                                              <Copy size={14} /> Копировать
                                            </button>
                                            <button
                                              className="tiny"
                                              onClick={() =>
                                                updateSection(
                                                  section.id,
                                                  (s) => ({
                                                    ...s,
                                                    questions:
                                                      s.questions?.filter(
                                                        (x) => x.id !== q.id,
                                                      ),
                                                  }),
                                                )
                                              }
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                        </div>
                                        <div className="qgrid">
                                          <input
                                            value={q.text}
                                            onChange={(e) =>
                                              updateSection(
                                                section.id,
                                                (s) => ({
                                                  ...s,
                                                  questions: s.questions?.map(
                                                    (x) =>
                                                      x.id === q.id
                                                        ? {
                                                            ...x,
                                                            text: e.target
                                                              .value,
                                                          }
                                                        : x,
                                                  ),
                                                }),
                                              )
                                            }
                                            placeholder="Текст вопроса"
                                          />
                                          <Select
                                            value={questionTypeOptions.find(
                                              (option) =>
                                                option.value === q.type,
                                            )}
                                            options={questionTypeOptions}
                            styles={selectStyles}
                            isSearchable={false}
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuPortalTarget={document.body}
                                            aria-label="Тип вопроса"
                                            onChange={(option) => {
                                              if (!option) return;
                                              const type =
                                                option.value as Question["type"];
                                              updateSection(
                                                section.id,
                                                (s) => ({
                                                  ...s,
                                                  questions: s.questions?.map(
                                                    (x) =>
                                                      x.id === q.id
                                                        ? {
                                                            ...x,
                                                            type,
                                                            options:
                                                              type ===
                                                                "single" ||
                                                              type ===
                                                                "multiple"
                                                                ? x.options
                                                                    .length
                                                                  ? x.options
                                                                  : [
                                                                      {
                                                                        value:
                                                                          "1",
                                                                        label:
                                                                          "",
                                                                      },
                                                                      {
                                                                        value:
                                                                          "2",
                                                                        label:
                                                                          "",
                                                                      },
                                                                    ]
                                                                : [],
                                                          }
                                                        : x,
                                                  ),
                                                }),
                                              );
                                            }}
                                          />
                                        </div>
                                        {(q.type === "single" ||
                                          q.type === "multiple") && !section.useSharedOptions && (
                                          <div className="options">
                                            {q.options.map((option, oi) => (
                                              <div
                                                className="option"
                                                key={option.value}
                                              >
                                                <input
                                                  value={option.label}
                                                  onChange={(e) =>
                                                    updateSection(
                                                      section.id,
                                                      (s) => ({
                                                        ...s,
                                                        questions:
                                                          s.questions?.map(
                                                            (x) =>
                                                              x.id === q.id
                                                                ? {
                                                                    ...x,
                                                                    options:
                                                                      x.options.map(
                                                                        (
                                                                          o,
                                                                          i,
                                                                        ) =>
                                                                          i ===
                                                                          oi
                                                                            ? {
                                                                                ...o,
                                                                                label:
                                                                                  e
                                                                                    .target
                                                                                    .value,
                                                                              }
                                                                            : o,
                                                                      ),
                                                                  }
                                                                : x,
                                                          ),
                                                      }),
                                                    )
                                                  }
                                                  placeholder={`Вариант ${oi + 1}`}
                                                />
                                                {q.options.length > 2 && (
                                                  <button
                                                    className="tiny"
                                                    onClick={() =>
                                                      updateSection(
                                                        section.id,
                                                        (s) => ({
                                                          ...s,
                                                          questions:
                                                            s.questions?.map(
                                                              (x) =>
                                                                x.id === q.id
                                                                  ? {
                                                                      ...x,
                                                                      options:
                                                                        x.options.filter(
                                                                          (
                                                                            _,
                                                                            i,
                                                                          ) =>
                                                                            i !==
                                                                            oi,
                                                                        ),
                                                                    }
                                                                  : x,
                                                            ),
                                                        }),
                                                      )
                                                    }
                                                  >
                                                    <Trash2 size={14} />
                                                  </button>
                                                )}
                                              </div>
                                            ))}
                                            <button
                                              className="tiny"
                                              onClick={() =>
                                                updateSection(
                                                  section.id,
                                                  (s) => ({
                                                    ...s,
                                                    questions: s.questions?.map(
                                                      (x) =>
                                                        x.id === q.id
                                                          ? {
                                                              ...x,
                                                              options: [
                                                                ...x.options,
                                                                {
                                                                  value: String(
                                                                    x.options
                                                                      .length +
                                                                      1,
                                                                  ),
                                                                  label: "",
                                                                },
                                                              ],
                                                            }
                                                          : x,
                                                    ),
                                                  }),
                                                )
                                              }
                                            >
                                              + Вариант ответа
                                            </button>
                                          </div>
                                        )}
                                        <label className="required">
                                          <input
                                            type="checkbox"
                                            checked={q.required}
                                            onChange={(e) =>
                                              updateSection(
                                                section.id,
                                                (s) => ({
                                                  ...s,
                                                  questions: s.questions?.map(
                                                    (x) =>
                                                      x.id === q.id
                                                        ? {
                                                            ...x,
                                                            required:
                                                              e.target.checked,
                                                          }
                                                        : x,
                                                  ),
                                                }),
                                              )
                                            }
                                          />{" "}
                                          Обязательный вопрос
                                        </label>
                                      </>
                                    )}
                                  </SortableQuestion>
                                ))}
                              </SortableContext>
                            </DndContext>
                            <AddQuestionButton
                              onClick={() =>
                                updateSection(section.id, (s) => ({
                                  ...s,
                                  questions: [
                                    ...(s.questions ?? []),
                                    {...makeQuestion(),options:s.useSharedOptions?(s.sharedOptions??[]).map(option=>({...option})):makeQuestion().options},
                                  ],
                                }))
                              }
                            >
                              <span className="plus">
                                <Plus size={15} />
                              </span>{" "}
                              Добавить вопрос
                            </AddQuestionButton>
                          </div>
                        )}
                      </>
                    )}
                  </SortableSection>
                ))}
              </Stack>
            </SortableContext>
          </DndContext>
          </div>
          <Footer>
            <label>
              <input
                type="checkbox"
                checked={meta.status === "active"}
                onChange={(e) =>
                  setMeta({
                    ...meta,
                    status: e.target.checked ? "active" : "draft",
                  })
                }
              />{" "}
              Сразу опубликовать
            </label>
            <div className="actions">
              <Button disabled={saving} onClick={submit}>
                {saving ? "Сохраняем…" : surveyId?"Сохранить изменения":"Создать опрос"}{" "}
                <CheckCircle2 size={16} />
              </Button>
            </div>
          </Footer>
          {error && <p className="error">{error}</p>}
        </Panel>
      </Columns>
      {activeMethodology && (
        <MethodologyModal
          methodology={activeMethodology}
          onClose={() => setActiveMethodology(null)}
        />
      )}
    </PlatformLayout>
  );
}
