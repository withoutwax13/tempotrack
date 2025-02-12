import SideNavigation from "@/components/SideNavigation";

const Calendar = () => {
  return (
    <div className="flex">
      <div className="w-60">
        <SideNavigation currentAppUrl="/calendar" />
      </div>
      <div className="flex-1 p-4">
        <h1>Calendar</h1>
        <p>Calendar page content goes here.</p>
      </div>
    </div>
  );
};

export default Calendar;
