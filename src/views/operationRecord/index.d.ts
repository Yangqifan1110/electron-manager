export interface SearchDataType {
  page: number;
  limit: number;
}

export interface TaskRecordDataType {
  log_file: string;
  log_id: string;
  process_name: string;
  run_at: string;
  run_result: null;
}
