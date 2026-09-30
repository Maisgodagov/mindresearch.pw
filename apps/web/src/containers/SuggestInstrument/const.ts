import type { Adaptation, SuggestionForm } from "./types";

export const initialSuggestionForm: SuggestionForm = {
  title: "",
  originalAuthor: "",
  publicationYear: "",
  adaptation: "",
};

export const adaptationOptions = [
  { value: "" as Adaptation, label: "Не знаю" },
  { value: "yes" as Adaptation, label: "Да, существует" },
  { value: "no" as Adaptation, label: "Нет или не найдена" },
];
