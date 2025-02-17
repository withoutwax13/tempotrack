import { ScheduleType } from "@/types/Schedule";
import TaskList from "../TaskList";
import AddTaskButton from "../AddTaskButton";

const KanbanView = (props: {
  scheduleData: ScheduleType[];
  userPublicId: string;
}) => {
  const { scheduleData, userPublicId } = props;
  return (
    <div className="flex space-x-4">
      <div className="task-container flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="status-title text-lg font-semibold mb-2 text-center">
          Backlog (
          {
            scheduleData.filter((schedule) => schedule.status === "backlog")
              .length
          }
          )
        </div>
        <TaskList scheduleData={scheduleData} status="backlog" />
        <AddTaskButton status="backlog" userPublicId={userPublicId} />
      </div>
      <div className="task-container flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="status-title text-lg font-semibold mb-2 text-center">
          Pending (
          {
            scheduleData.filter((schedule) => schedule.status === "pending")
              .length
          }
          )
        </div>
        <TaskList scheduleData={scheduleData} status="pending" />
        <AddTaskButton status="pending" userPublicId={userPublicId} />
      </div>
      <div className="task-container flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="status-title text-lg font-semibold mb-2 text-center">
          Done (
          {scheduleData.filter((schedule) => schedule.status === "done").length}
          )
        </div>
        <TaskList scheduleData={scheduleData} status="done" />
        <AddTaskButton status="done" userPublicId={userPublicId} />
      </div>
    </div>
  );
};

export default KanbanView;
