import LoginCard from "@/components/auth/LoginCard";
import { useDispatch } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   // Check if user is logged in before rendering the component
  //   if (checkIfLoggedIn()) {
  //     navigate("/dashboard");
  //   }
  // });

  return (
    <div>
      <main className="min-h-screen container mx-auto">
        <LoginCard />
      </main>
    </div>
  );
};
export default Login;
