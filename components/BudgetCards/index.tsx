"use client";
import React, { useState, useMemo } from "react";
import BudgetCard from "../BudgetCard";
import FilterIcon from "@/assets/icons/FilterIcon";
import { BudgetType } from "@/types/Budget";
import PageTitle from "../PageTitle";
import Pagination from "../Pagination";
import SearchIcon from "@/assets/icons/SearchIcon";
import AddBudget from "../AddBudget";

const ITEMS_PER_PAGE = 7;

type FilterModalProps = {
  filterStatus: string;
  setFilterStatus: React.Dispatch<React.SetStateAction<string>>;
  filterStartDate: string;
  setFilterStartDate: React.Dispatch<React.SetStateAction<string>>;
  filterEndDate: string;
  setFilterEndDate: React.Dispatch<React.SetStateAction<string>>;
  filterTimerange: string;
  setFilterTimerange: React.Dispatch<React.SetStateAction<string>>;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleFilter: () => void;
  resetFilter: () => void;
};

const FilterModal = ({
  filterStatus,
  setFilterStatus,
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  filterTimerange,
  setFilterTimerange,
  setShowFilterModal,
  handleFilter,
  resetFilter,
}: FilterModalProps) => {
  // TODO: Implement a standard modal component
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Filter Budgets</h2>
          <button className="text-black text-sm" onClick={resetFilter}>
            Clear
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Time Range
          </label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={filterTimerange}
            onChange={(e) => setFilterTimerange(e.target.value)}
          >
            <option value="">All</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="bi-weekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            onClick={() => setShowFilterModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handleFilter}
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
};

const BudgetCards = (props: { budgetData: BudgetType[] }) => {
  const { budgetData } = props;
  const [filteredData, setFilteredData] = useState<BudgetType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFiltered, setIsFiltered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filterTimerange, setFilterTimerange] = useState("");

  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      if (!isFiltered) {
        const searchResults = budgetData.filter((budget: BudgetType) => {
          return (
            budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            budget.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            budget.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            budget.timerange.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        setFilteredData(searchResults);
        setIsFiltered(true);
        setCurrentPage(1);
      } else {
        const searchResults = filteredData.filter((budget: BudgetType) => {
          return (
            budget.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            budget.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            budget.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            budget.timerange.toLowerCase().includes(searchTerm.toLowerCase())
          );
        });
        setFilteredData(searchResults);
        setIsFiltered(true);
        setCurrentPage(1);
      }
    }
  };

  const handleFilter = () => {
    if (!isFiltered) {
      const butcheredOriginalData = budgetData.filter((budget: BudgetType) => {
        let isFiltered = true;
        if (filterStatus && budget.status !== filterStatus) {
          isFiltered = false;
        }
        if (filterStartDate && budget.start_date < filterStartDate) {
          isFiltered = false;
        }
        if (filterEndDate && budget.end_date > filterEndDate) {
          isFiltered = false;
        }
        if (filterTimerange && budget.timerange !== filterTimerange) {
          isFiltered = false;
        }
        return isFiltered;
      });
      setFilteredData(butcheredOriginalData);
      setIsFiltered(true);
      setShowFilterModal(false);
      setCurrentPage(1);
    } else {
      const butcheredFilteredData = filteredData.filter(
        (budget: BudgetType) => {
          let isFiltered = true;
          if (filterStatus && budget.status !== filterStatus) {
            isFiltered = false;
          }
          if (filterStartDate && budget.start_date < filterStartDate) {
            isFiltered = false;
          }
          if (filterEndDate && budget.end_date > filterEndDate) {
            isFiltered = false;
          }
          if (filterTimerange && budget.timerange !== filterTimerange) {
            isFiltered = false;
          }
          return isFiltered;
        }
      );
      setFilteredData(butcheredFilteredData);
      setIsFiltered(true);
      setShowFilterModal(false);
      setCurrentPage(1);
    }
  };

  const resetFilter = () => {
    setIsFiltered(false);
    setFilteredData([]);
    setCurrentPage(1);
    setFilterStatus("");
    setFilterStartDate("");
    setFilterEndDate("");
    setFilterTimerange("");
    setShowFilterModal(false);
    setSearchTerm("");
  };

  const totalPages = useMemo(() => {
    if (!isFiltered) {
      return Math.ceil(budgetData.length / ITEMS_PER_PAGE);
    } else {
      return Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    }
  }, [filteredData.length, isFiltered, budgetData.length]);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    if (isFiltered) {
      return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }
    return budgetData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, isFiltered, filteredData, budgetData]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="app-header mb-3 flex justify-between items-center">
        <PageTitle title="Time Budgets" />

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value || "");
                if (e.target.value === "") {
                  setIsFiltered(false);
                  setFilteredData([]);
                } else {
                  handleSearch();
                }
              }}
              className="pl-8 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute left-2 top-2 w-6 h-6">
              <SearchIcon />
            </span>
          </div>
          <span
            className="cursor-pointer w-6 h-6"
            onClick={() => setShowFilterModal(true)}
          >
            <FilterIcon />
          </span>
        </div>
        {showFilterModal && (
          <FilterModal
            setShowFilterModal={setShowFilterModal}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterStartDate={filterStartDate}
            setFilterStartDate={setFilterStartDate}
            filterEndDate={filterEndDate}
            setFilterEndDate={setFilterEndDate}
            filterTimerange={filterTimerange}
            setFilterTimerange={setFilterTimerange}
            handleFilter={handleFilter}
            resetFilter={resetFilter}
          />
        )}
      </div>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white shadow-lg rounded-2xl p-4 flex items-center justify-center min-h-[300px]">
            <button
              className="text-sm font-bold text-[#2EA2F8]"
              onClick={() => setShowAddBudgetModal(!showAddBudgetModal)}
            >
              + Add Budget
            </button>
          </div>
          {showAddBudgetModal && (
            <AddBudget setVisibility={setShowAddBudgetModal} />
          )}
          {currentItems.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handleNextPage={handleNextPage}
          handlePreviousPage={handlePreviousPage}
        />
      </div>
    </>
  );
};

export default BudgetCards;
