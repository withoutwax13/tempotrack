import RegisterForm from "@/components/RegisterForm";
import TopNavigation from "@/components/TopNavigation";
import "./index.css";

const Register = () => {
  return (
    <div>
      <TopNavigation displayText="Login" />
      <main className="register-bg" style={{ height: "calc(100vh - 60px)" }}>
        <RegisterForm />
      </main>
    </div>
  );
};

export default Register;
