import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface EffectiveDateRange {
  start: string;
  end: string;
}

interface EditBudgetProps {
  setVisibility: (visibility: boolean) => void;
  budgetItemData: {
    id: string;
    name: string;
    description: string;
    timerange: string;
    start_date: string;
    end_date: string;
    tags: string[];
    total_hours: number;
    status: string;
    membership_id?: string;
    user_id?: string;
  };
}

const EditBudget = (props: EditBudgetProps) => {
  const { setVisibility, budgetItemData } = props;
  const userPublicId = budgetItemData.user_id || budgetItemData.membership_id;
  const [name, setName] = useState<string>(budgetItemData.name);
  const [description, setDescription] = useState<string>(
    budgetItemData.description
  );
  const [timeRange, setTimeRange] = useState<string>(budgetItemData.timerange);
  const [timeAllocation, setTimeAllocation] = useState<number>(
    budgetItemData.total_hours
  );
  const [effectiveDateRange, setEffectiveDateRange] =
    useState<EffectiveDateRange>({
      start: budgetItemData.start_date,
      end: budgetItemData.end_date,
    });
  const [tags, setTags] = useState<string[]>(budgetItemData.tags);
  const [tagInput, setTagInput] = useState<string>("");

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleDeleteTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleCloseModal = () => {
    setVisibility(false);
  };

  const handleSavingBudget = async () => {
    // validation of inputs
    if (name.trim() === "" || description.trim() === "") {
      toast.error("Please fill in all the text fields.");
      return;
    } else if (timeAllocation <= 0) {
      toast.error("Time allocation should be greater than 0 minutes.");
      return;
    } else if (effectiveDateRange.start > effectiveDateRange.end) {
      toast.error("Effective date range is invalid.");
      return;
    } else if (tags.length === 0) {
      toast.error("Please add at least one tag.");
      return;
    }

    // Add budget to the database
    // API: /api/budgets
    // Method: POST
    // Body: { name, description, timerange, start_date, end_date, tags, total_hours, status="pending", isPartOfTeam, user_id/membership_id (depends if the portal is team or individual) }

    axios
      .patch("/api/budgets", {
        id: budgetItemData.id,
        name,
        description,
        timerange: timeRange,
        start_date: effectiveDateRange.start,
        end_date: effectiveDateRange.end,
        tags,
        total_hours: timeAllocation,
        status: "active",
        isPartOfTeam: false,
        user_id: userPublicId,
      })
      .then((res) => {
        console.log(res.data);
        setVisibility(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong: " + err.response.data.error);
      });
  };

  const handleDeletingBudget = async () => {
    axios
      .delete(`/api/budgets/?id=${budgetItemData.id}`)
      .then((res) => {
        console.log(res.data);
        setVisibility(false);
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong: " + err.response.data.error);
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white p-10 rounded-lg shadow-lg w-96"
        style={{ width: "724px" }}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Edit Time Budget
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            />
          </div>
          <div className="flex flex-row space-x-4 justify-between">
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm resize-none p-2"
                rows={7}
                cols={50}
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Tags
              </label>
              <div
                className="flex flex-wrap items-center border border-gray-300 rounded-md p-2 mt-1"
                style={{ width: "260px" }}
              >
                <div
                  className="flex flex-wrap items-center overflow-y-auto"
                  style={{ height: "70px" }}
                >
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 rounded-full px-2 py-1 m-1"
                    >
                      <span className="text-sm">{tag}</span>
                      <button
                        type="button"
                        className="ml-2 text-gray-600 hover:text-gray-800"
                        onClick={() => handleDeleteTag(index)}
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  className="flex-grow p-1 outline-none text-sm"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Type and press enter to add tags"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row space-x-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Time Range
              </label>
              <select
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="bi-weekly">Bi-Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Time Allocation (in minutes)
              </label>
              <input
                type="number"
                value={timeAllocation}
                onChange={(e) => setTimeAllocation(Number(e.target.value))}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Effective Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  value={effectiveDateRange.start}
                  onChange={(e) => {
                    setEffectiveDateRange({
                      ...effectiveDateRange,
                      start: e.target.value,
                    });
                  }}
                />
                <span className="mx-2 self-center">-</span>
                <input
                  type="date"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  value={effectiveDateRange.end}
                  onChange={(e) => {
                    setEffectiveDateRange({
                      ...effectiveDateRange,
                      end: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between space-x-2">
            <button
              className="px-4 py-2 rounded-md text-white rounded-md bg-red-500"
              onClick={handleDeletingBudget}
            >
              Delete
            </button>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-md text-[#2EA2F8]"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-[#2EA2F8] text-white px-4 py-2 rounded-md"
                onClick={handleSavingBudget}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBudget;
