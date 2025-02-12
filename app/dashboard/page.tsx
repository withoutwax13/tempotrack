import SideNavigation from "@/components/SideNavigation";

const Dashboard = () => {
  return (
    <div className="flex">
      <div className="w-60">
        <SideNavigation currentAppUrl="/dashboard" />
      </div>
      <div className="flex-1 p-4">
        <h1>Page Title</h1>
        <p>App page content goes here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
