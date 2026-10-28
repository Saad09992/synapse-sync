export interface Changelog {
  id: number;
  client_id: number;
  document_id: number;
  changelog_type: string;
  client_version: number;
  server_version: number;
  resolution: string;
  description: string;
  created_at: EpochTimeStamp;
}
