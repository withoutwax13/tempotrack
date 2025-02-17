import axios from "axios";
import { ScheduleType } from "@/types/Schedule";
import TaskCard from "../TaskCard";
import { toast } from "react-toastify";

const TaskList = ({
  scheduleData,
  status,
}: {
  scheduleData: ScheduleType[];
  status: string;
}) => {
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    data: ScheduleType
  ) => {
    console.log("onDragStart", data);
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
  };

  const handleDragDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const data = event.dataTransfer.getData("text/plain");
    if (!data) {
      console.error("No data found on drop event");
      return;
    }
    const task = JSON.parse(data) as ScheduleType;
    const newStatus = (event.target as HTMLElement)
      .closest(".task-list")
      ?.getAttribute("data-status");
    console.log("onDragDrop", task, newStatus);

    let targetTask = task;
    if (targetTask.status === "backlog" && newStatus === "pending") {
      targetTask = {
        ...targetTask,
        actual_start_time: new Date().toISOString().toLocaleString(),
      };
    } else if (targetTask.status === "pending" && newStatus === "done") {
      targetTask = {
        ...targetTask,
        actual_end_time: new Date().toISOString().toLocaleString(),
      };
    } else {
      toast.info(`You cannot do this action.`);
      return;
    }

    if (newStatus && task.status !== newStatus) {
      // Update the task status by calling the patch API

      axios
        .patch(`/api/schedules/`, { ...targetTask, status: newStatus })
        .then((res) => {
          console.log(res.data);
          window.location.reload();
        })
        .catch((err) => {
          toast.error("Something went wrong: " + err.response.data.error);
        });
    }
  };

  return (
    <div
      className="task-list overflow-y-auto"
      style={{ height: "calc(100vh - 200px)" }}
      data-status={status}
      onDrop={handleDragDrop}
      onDragOver={(event) => event.preventDefault()}
    >
      {scheduleData
        .filter((task) => task?.status === status)
        .map((task) => (
          <TaskCard key={task.id} data={task} onDragStart={handleDragStart} />
        ))}
    </div>
  );
};

export default TaskList;
