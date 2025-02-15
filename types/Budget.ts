export interface BudgetType {
  id: string;
  name: string;
  status: string;
  description: string;
  start_date: string;
  end_date: string;
  timerange: string;
  total_hours: number;
  tags: string[];
}
