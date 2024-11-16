"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../../components/AuthForm";
import Link from "next/link";
import { login } from "../../components/http";
import Cookies from "js-cookie";

const Login: React.FC = () => {
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      const response = await login(data);
      if (response) {
        Cookies.set("access_token", response.access_token, { expires: 7, secure: true });

        setMessage("Login successful");
        setIsSuccess(true);

        router.push("/dashboard");
      } else {
        setMessage("Login failed");
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("An error occurred during login");
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <AuthForm mode="Login" onSubmit={handleLogin} />
        {message && (
          <p className={`text-center mt-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <Link href="/signup">
          <p className="text-center text-blue-500 font-bold underline py-4">
            Don't have an account? Signup
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Login;
