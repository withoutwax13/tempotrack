import { useState } from "react";
import AddSchedule from "../AddSchedule";

const AddTaskButton = ({
    status,
    userPublicId,
  }: {
    status: string;
    userPublicId: string;
  }) => {
    const [visibility, setVisibility] = useState(false);
  
    return (
      <div className="add-button text-center mt-4">
        {visibility && (
          <AddSchedule
            setVisibility={setVisibility}
            status={status}
            userPublicId={userPublicId}
          />
        )}
        <button
          className="text-[#2EA2F8] px-4 py-2 rounded-lg"
          onClick={() => setVisibility(true)}
        >
          + Add Task
        </button>
      </div>
    );
  };

export default AddTaskButton;