export type Survey = {
  id: string;
  slug: string;
  title: string;
  status: string;
  responses: number;
  completed: number;
  description?: string;
  deletedAt?: string;
  hasBuilderState?: boolean | number;
  createdAt?: string;
  updatedAt?: string;
};
