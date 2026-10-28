export interface Document {
  id: number;
  title: string;
  content: string;
  version: number;
  created_at: EpochTimeStamp;
  updated_at: EpochTimeStamp;
}
