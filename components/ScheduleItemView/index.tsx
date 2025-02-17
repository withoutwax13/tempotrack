import { useState } from "react";
import CancelIcon from "@/assets/icons/CancelIcon";
import CheckIcon from "@/assets/icons/CheckIcon";
import axios from "axios";
import { toast } from "react-toastify";

interface ScheduleItem {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  tags: string[];
}

interface ScheduleItemViewProps {
  scheduleItem: ScheduleItem;
  onClose: () => void;
  onSave?: (item: ScheduleItem) => void;
}

const ScheduleItemView: React.FC<ScheduleItemViewProps> = ({
  scheduleItem,
  onClose,
  onSave,
}) => {
  const [editableItem, setEditableItem] = useState(scheduleItem);
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({
    title: false,
    description: false,
    start_time: false,
    end_time: false,
    tags: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [originalItem, setOriginalItem] = useState(scheduleItem);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditableItem({ ...editableItem, [name]: value });
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editableItem);
    }
    onClose();
  };

  const toggleEdit = (field: keyof typeof isEditing) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
    if (!isEditing[field]) {
      setOriginalItem(editableItem);
    }
  };

  const handleCancelEdit = (field: keyof typeof isEditing) => {
    setEditableItem(originalItem);
    setIsEditing({ ...isEditing, [field]: false });
  };

  const handleDateChange = (field: keyof ScheduleItem, value: string) => {
    setEditableItem({ ...editableItem, [field]: value });
  };

  const handleDeleteTag = (index: number) => {
    const newTags = editableItem.tags.filter((_, i) => i !== index);
    setEditableItem({ ...editableItem, tags: newTags });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setEditableItem({
        ...editableItem,
        tags: [...editableItem.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleDeletingSchedule = () => {
    axios
      .delete(`/api/schedules?id=${scheduleItem?.id}`)
      .then(() => {
        toast.success("Schedule deleted successfully");
        onClose();
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to delete schedule. Please try again later.");
      });
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl max-h-[calc(100vh-200px)] flex flex-col">
        <div className="title mb-4">
          <h2 className="text-xl font-bold">
            <div className="flex items-center">
              {isEditing.title ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={editableItem.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    autoFocus
                  />
                  <div
                    className="ml-2 cursor-pointer w-4 h-4"
                    onClick={() => handleCancelEdit("title")}
                  >
                    <CancelIcon />
                  </div>
                  <div
                    className="ml-2 cursor-pointer w-4 h-4"
                    onClick={() => toggleEdit("title")}
                  >
                    <CheckIcon />
                  </div>
                </>
              ) : (
                <div className="w-full p-2 border border-transparent rounded">
                  <span
                    className="cursor-pointer"
                    onClick={() => toggleEdit("title")}
                    style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                  >
                    {editableItem.title}
                  </span>
                </div>
              )}
            </div>
          </h2>
        </div>
        <div className="content flex-1 overflow-y-auto mb-4 flex">
          <div className="left-content w-2/3 pr-4 overflow-y-auto">
            <div className="mb-4 flex items-center">
              {isEditing.description ? (
                <span className="flex flex-col w-full">
                  <textarea
                    name="description"
                    value={editableItem.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    rows={Math.max(
                      3,
                      Math.ceil(editableItem.description.length / 500)
                    )}
                    autoFocus
                  />
                  <div className="flex justify-end mt-2">
                    <div
                      className="ml-2 cursor-pointer w-4 h-4"
                      onClick={() => handleCancelEdit("description")}
                    >
                      <CancelIcon />
                    </div>
                    <div
                      className="ml-2 cursor-pointer w-4 h-4"
                      onClick={() => toggleEdit("description")}
                    >
                      <CheckIcon />
                    </div>
                  </div>
                </span>
              ) : (
                <div className="w-full p-2 border border-transparent rounded">
                  <span
                    className="cursor-pointer"
                    onClick={() => toggleEdit("description")}
                    style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                  >
                    {editableItem.description}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="separator w-px bg-gray-800 mx-4" />
          <div className="right-content w-1/3">
            <div className="flex justify-between mb-4">
              <div className="w-full">
                <h3 className="text-sm font-bold ml-2">Start Date & Time</h3>
                {isEditing.start_time ? (
                  <div className="flex items-center">
                    <input
                      type="datetime-local"
                      value={editableItem.start_time}
                      onChange={(e) =>
                        handleDateChange("start_time", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="w-full p-2 border border-transparent rounded">
                    <span
                      className="cursor-pointer text-gray-700"
                      onClick={() => toggleEdit("start_time")}
                      style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                    >
                      {new Date(editableItem.start_time).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full">
                <h3 className="text-sm font-bold ml-2">Due Date & Time</h3>
                {isEditing.end_time ? (
                  <div className="flex items-center">
                    <input
                      type="datetime-local"
                      value={editableItem.end_time}
                      onChange={(e) =>
                        handleDateChange("end_time", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div className="w-full p-2 border border-transparent rounded">
                    <span
                      className="cursor-pointer text-gray-700"
                      onClick={() => toggleEdit("end_time")}
                      style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                    >
                      {new Date(editableItem.end_time).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-4">
              <div className="flex flex-wrap items-center border border-gray-300 rounded-md p-2">
                <div className="flex flex-wrap items-center overflow-y-auto h-20">
                  {editableItem.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 rounded-full px-2 py-1 m-1 cursor-pointer"
                      onClick={() => {
                        const newTags = [...editableItem.tags];
                        newTags[index] = tag;
                        setEditableItem({ ...editableItem, tags: newTags });
                      }}
                    >
                      {isEditing[`tag_${index}`] ? (
                        <>
                          <input
                            type="text"
                            className="text-sm"
                            value={tag}
                            onChange={(e) => {
                              const newTags = [...editableItem.tags];
                              newTags[index] = e.target.value;
                              setEditableItem({
                                ...editableItem,
                                tags: newTags,
                              });
                            }}
                            autoFocus
                          />
                        </>
                      ) : (
                        <>
                          <span
                            className="text-sm"
                            style={{
                              wordBreak: "break-word",
                              whiteSpace: "normal",
                            }}
                          >
                            {tag}
                          </span>
                          <button
                            type="button"
                            className="ml-2 text-gray-600 hover:text-gray-800"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTag(index);
                            }}
                          >
                            &times;
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {isEditing.tags ? (
                  <div className="flex items-center w-full">
                    <input
                      type="text"
                      className="flex-grow p-1 outline-none text-sm"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagInputKeyDown}
                      placeholder="Type and press enter to add tags"
                      autoFocus
                    />
                  </div>
                ) : (
                  <div
                    className="flex-grow p-1 outline-none text-sm cursor-pointer"
                    onClick={() => toggleEdit("tags")}
                  >
                    Add tags...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="footer mt-auto">
          <div className="flex justify-between space-x-2">
            <div>
              <button
                className="px-4 py-2 rounded-md text-white rounded-md bg-red-500"
                onClick={handleDeletingSchedule}
              >
                Delete
              </button>
            </div>
            <div className="flex justify-end space-x-2">
              {JSON.stringify(editableItem) !==
                JSON.stringify(scheduleItem) && (
                <button
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              )}
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleItemView;
