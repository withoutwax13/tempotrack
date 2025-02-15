import ReportIcon from "@/assets/icons/ReportIcon";
import { BudgetType } from "@/types/Budget";

const BudgetCard = ({ budget }: { budget: BudgetType }) => (
  <div className="bg-white shadow-lg rounded-2xl p-4 flex flex-col justify-between min-h-[300px]">
    <div>
      <div className="flex justify-between items-center mb-2 cursor-pointer">
        <h2 className="text-lg font-bold">
          {budget.name.length > 20
            ? `${budget.name.substring(0, 20)}...`
            : budget.name}
        </h2>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${
            budget.status === "active"
              ? "bg-green-200 text-green-800"
              : budget.status === "completed"
              ? "bg-gray-200 text-gray-800"
              : budget.status === "pending"
              ? "bg-yellow-200 text-yellow-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {budget.status.toLocaleUpperCase()}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-2 cursor-pointer">
        {budget.description.length > 150
          ? `${budget.description.substring(0, 150)}...`
          : budget.description}
      </p>
      <span className="text-sm text-gray-500 rounded-full border px-2 py-1 inline-block mb-2">
        {new Date(budget.start_date).toLocaleDateString()} -{" "}
        {new Date(budget.end_date).toLocaleDateString()}
      </span>
      <div className="flex space-x-2 mb-2"></div>
      <span className="text-sm text-gray-500 rounded-full border  px-2 py-1">
        {budget.timerange.toUpperCase()}
      </span>
      <span className="text-sm text-gray-500 rounded-full border  px-2 py-1">
        {(budget.total_hours / 60).toFixed(2)} hour(s)
      </span>
      <div className="flex justify-end space-x-2 mt-4">
        <button className="p-1">
          <ReportIcon />
        </button>
        <button className="bg-[#2EA2F8] text-white text-sm font-bold px-3 py-1 rounded">
          Edit
        </button>
      </div>
    </div>
  </div>
);

export default BudgetCard;
