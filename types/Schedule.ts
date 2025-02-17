export interface ScheduleType {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  user_id?: string;
  team_id?: string;
  budget_id?: string;
  status: string;
  actual_start_time?: string | Date;
  actual_end_time?: string | Date;
  description: string;
  change_log: any[];
  tags: string[];
  time_estimate: number;
}
