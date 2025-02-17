import axios from "axios";
import { useState, useEffect } from "react";
import { ScheduleType } from "@/types/Schedule";
import ScheduleItemView from "../ScheduleItemView";
import UserIcon from "@/assets/icons/UserIcon";

const getReadableTimeDifference = (xTime: Date, yTime: Date) => {
  const xTimeLocale = new Date(xTime.toISOString().toLocaleString());
  const yTimeLocale = new Date(yTime.toISOString().toLocaleString());
  const diffInMs = xTimeLocale.getTime() - yTimeLocale.getTime();

  const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffInMs / (1000 * 60)) % 60);
  const seconds = Math.floor((diffInMs / 1000) % 60);

  const parts = [];
  if (days > 0) parts.push(`${days} day`);
  if (hours > 0) parts.push(`${hours} hr`);
  if (minutes > 0) parts.push(`${minutes} min`);
  if (seconds > 0) parts.push(`${seconds} sec`);
  return parts.join(", ").replace(/,([^,]*)$/, " and$1");
};

const TaskCard = ({
  data,
  onDragStart,
}: {
  data: ScheduleType;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    data: ScheduleType
  ) => void;
}) => {
  const [viewModalVisibility, setViewModalVisibility] = useState(false);
  const [timeBudgetName, setTimeBudgetName] = useState("");

  useEffect(() => {
    if (data.budget_id) {
      axios.get(`/api/budgets?id=${data.budget_id}`).then((res) => {
        setTimeBudgetName(res?.data[0].name);
      });
    }
  }, [data.budget_id]);

  return (
    <div
      className="task-card bg-white p-4 rounded-lg shadow-md mb-4"
      draggable
      onDragStart={(event) => onDragStart(event, data)}
    >
      {viewModalVisibility && (
        <ScheduleItemView
          scheduleItem={data}
          onClose={() => setViewModalVisibility(false)}
        />
      )}
      <div className="task-header flex justify-between items-center mb-2">
        <div
          className="task-title font-semibold text-md cursor-pointer"
          onClick={() => setViewModalVisibility(true)}
        >
          {data.title}
        </div>
        <div className="user-image">
          <div className="w-6 h-6">
            <UserIcon />
          </div>
        </div>
      </div>
      <div className="task-body mb-2">
        <div className="task-description text-gray-700 text-sm">
          {data.description || ""}
        </div>
      </div>
      <div className="task-footer text-sm text-gray-500 flex justify-end my-4">
        <div className="flex flex-col items-end">
          {data.actual_end_time == null && (
            <div className="task-due">
              {new Date(data.end_time) < new Date() ? (
                <span className="text-red-500">
                  {"Overdue by: "}
                  {getReadableTimeDifference(
                    new Date(),
                    new Date(data.end_time + "Z")
                  )}
                </span>
              ) : (
                <span>
                  {"Time before due: "}
                  {data.end_time
                    ? getReadableTimeDifference(
                        new Date(data.end_time + "Z"),
                        new Date()
                      )
                    : "N/A"}
                </span>
              )}
            </div>
          )}
          {data.actual_start_time && !data.actual_end_time && (
            <div className="actual-work-time">
              {`Actual work: `}
              {getReadableTimeDifference(
                new Date(),
                new Date(data.actual_start_time + "Z")
              )}
            </div>
          )}
          {data.actual_start_time && data.actual_end_time && (
            <div className="actual-work-time">
              {`Actual work: `}
              {getReadableTimeDifference(
                new Date(data.actual_end_time + "Z"),
                new Date(data.actual_start_time + "Z")
              )}
            </div>
          )}
        </div>
      </div>
      {timeBudgetName !== "" && (
        <div className="budget-info mt-4 p-2 bg-blue-100 rounded-lg text-blue-700 text-sm border-l-4 border-blue-500">
          <span className="font-semibold">{timeBudgetName}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
