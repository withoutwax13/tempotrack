import LoginForm from "@/components/LoginForm";
import TopNavigation from "@/components/TopNavigation";
import "./index.css";

const Login = () => {
  return (
    <div>
      <TopNavigation />
      <main className="element" style={{ height: "calc(100vh - 60px)" }}>
        <LoginForm />
      </main>
    </div>
  );
};

export default Login;
