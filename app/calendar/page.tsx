"use client";
import axios from "axios";
import supabase from "@/services/supabaseClient";
import { useState, useEffect } from "react";
import PageTitle from "@/components/PageTitle";
import SideNavigation from "@/components/SideNavigation";
import Loader from "@/components/Loader";
import { ToastContainer, toast } from "react-toastify";
import KanbanView from "@/components/KanbanView";
import { BudgetType } from "@/types/Budget";

const ViewTypeDropdown = ({
  viewType,
  changeViewType,
}: {
  viewType: string;
  changeViewType: (newViewType: string) => void;
}) => {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="schedule-view"
        className="text-sm font-medium text-gray-700"
      >
        View:
      </label>
      <select
        id="schedule-view"
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={viewType}
        onChange={(e) => {
          changeViewType(e.target.value);
        }}
      >
        <option value="kanban">Kanban</option>
        <option value="calendar">Calendar</option>
      </select>
    </div>
  );
};

const BudgetFilterDropdown = ({
  selectedBudget,
  changeSelectedBudget,
  availableBudgets,
}: {
  selectedBudget: string;
  changeSelectedBudget: (newBudget: string) => void;
  availableBudgets: BudgetType[];
}) => {
  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="schedule-view"
        className="text-sm font-medium text-gray-700"
      >
        Budget Filter:
      </label>
      <select
        id="schedule-view"
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedBudget}
        onChange={(e) => {
          changeSelectedBudget(e.target.value);
        }}
      >
        <option value="all">All</option>
        {availableBudgets.map((budget) => (
          <option key={budget.id} value={budget.id}>
            {budget.name}
          </option>
        ))}
      </select>
    </div>
  );
};

const Calendar = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState("kanban");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [availableBudgets, setAvailableBudgets] = useState<BudgetType[]>([]);
  const [scheduleData, setScheduleData] = useState([]);
  const isIndividual = true; // TODO: Convert to state when team is implemented
  const [currentUser, setCurrentUser] = useState<string>("");
  const [userPublicId, setUserPublicId] = useState<string>("");

  useEffect(() => {
    const fetchBudgetData = async () => {
      axios
        .get("/api/budgets")
        .then((res) => {
          setAvailableBudgets(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error("Something went wrong: " + err.response.data.error);
        });
    };
    const fetchScheduleData = async () => {
      axios
        .get(
          `/api/schedules${
            isIndividual
              ? `?user_id=${userPublicId}`
              : `?team_id=${userPublicId}`
          }`
        )
        .then((res) => {
          setScheduleData(res.data);
          setIsLoading(false);
        })
        .catch((err) => {
          toast.error("Something went wrong: " + err.response.data.error);
        });
    };
    const checkUserInfo = async () => {
      const user = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(String(user?.data?.user?.id));
      } else {
        toast.error("Something went wrong: User not found.");
      }
    };
    const fetchUserPublicId = async () => {
      axios
        .get("/api/users/?user_id=" + currentUser)
        .then((res) => {
          setUserPublicId(res.data[0].id);
        })
        .catch((err) => {
          toast.error(err);
        });
    };
    if (!currentUser) {
      checkUserInfo();
    }
    if (currentUser && !userPublicId) {
      fetchUserPublicId();
    }
    if (userPublicId) {
      fetchScheduleData();
      fetchBudgetData();
    }
  }, [currentUser, isIndividual, userPublicId]);

  return (
    <div className="flex h-screen">
      <div className="w-60">
        <SideNavigation currentAppUrl="/calendar" />
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {isLoading && (
          <div className="flex h-96 justify-center items-center w-full">
            <Loader />
          </div>
        )}
        {!isLoading && (
          <>
            <ToastContainer />
            <div className="flex justify-between items-center">
              <PageTitle title="Events and Tasks" />
              <div className="flex items-center space-x-4">
                <BudgetFilterDropdown
                  selectedBudget={selectedBudget}
                  changeSelectedBudget={setSelectedBudget}
                  availableBudgets={availableBudgets}
                />
                <ViewTypeDropdown
                  viewType={viewType}
                  changeViewType={setViewType}
                />
              </div>
            </div>
            {viewType === "kanban" && (
              <KanbanView
                scheduleData={scheduleData.filter((schedule) => {
                  if (selectedBudget === "all") {
                    return true;
                  } else {
                    return schedule.budget_id === selectedBudget;
                  }
                })}
                userPublicId={userPublicId}
              />
            )}
            {viewType === "calendar" && (
              <div>Calendar view is not available yet.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Calendar;
