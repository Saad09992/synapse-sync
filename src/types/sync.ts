export type MutationAction = "INSERT" | "UPDATE" | "DELETE";

export interface Mutation {
  mutation_id: string;
  sequence_no: number;
  entity: "document";
  entity_id: string;
  action: MutationAction;
  base_version: number;
  client_timestamp: string;
  payload: Record<string, any>;
}

export interface SyncPushRequest {
  batch_id: string;
  client_id: string;
  mutations: Mutation[];
}

export type MutationStatus = "APPLIED" | "CONFLICT" | "SKIPPED" | "FAILED";

export interface MutationResult {
  mutation_id: string;
  entity_id: string;
  status: MutationStatus;
  server_version?: number;
  server_payload?: Record<string, any>;
  error?: string;
}

export interface SyncPushResponse {
  batch_id: string;
  status: "COMPLETED" | "PARTIAL";
  processed_at: string;
  results: MutationResult[];
}
