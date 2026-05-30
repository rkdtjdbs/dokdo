export interface DistanceData {
  name: string;
  distance: number;
  coordinates: string;
  description: string;
  visible: boolean;
}

export interface TerritoryFactor {
  id: string;
  title: string;
  englishTitle: string;
  concept: string;
  implementation: string;
}

export interface HistoricalSource {
  id: string;
  title: string;
  year: string;
  sourceType: 'korean' | 'japanese';
  originalText: string;
  translation: string;
  significance: string;
}

export interface MapData {
  id: string;
  title: string;
  year: string;
  creator: string;
  significance: string;
  details: string;
}

export interface TimelineEvent {
  id: string;
  year: string;
  date?: string;
  title: string;
  description: string;
  impact: string;
}

export interface TextbookActivity {
  koreanStudent: string;
  japaneseStudent: string;
  title: string;
  content: string;
  submittedAt?: string;
}

export interface ReflectionAnswer {
  questionId: number;
  answer: string;
}
