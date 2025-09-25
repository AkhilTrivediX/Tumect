export interface PredictionResult {
  predictedClass: number;
  className: string;
  confidence: number;
  probabilities: ClassProbability[];
}

export interface ClassProbability {
  class: string;
  probability: number;
}

export type TumorClass = 'Glioma' | 'Meningioma' | 'No Tumor' | 'Pituitary';

export const CLASS_LABELS: TumorClass[] = ['Glioma', 'Meningioma', 'No Tumor', 'Pituitary'];
