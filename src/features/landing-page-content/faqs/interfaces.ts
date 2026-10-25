export interface IFaq {
  id: string;
  question: string;
  questionEn?: string | null;
  answer: string;
  answerEn?: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | Date;
}