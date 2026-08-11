export type Option = { value: string; label: string };
export type SeedQuestion = { code: string; text: string; type: 'single'|'multiple'|'text'|'number'; required?: boolean; options?: Option[]; validation?: Record<string, unknown> };
export type SeedSection = { code: string; title: string; description?: string; questions: SeedQuestion[] };
