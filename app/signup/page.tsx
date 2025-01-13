export const runtime = "edge";

"use client";
import { useState } from "react";
import AuthForm from "../../components/AuthForm";
import Link from "next/link";

const Signup: React.FC = () => {
  const [message, setMessage] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSignup = async (data: { email?: string; username: string; password: string }) => {
    if (!data.email) {
      console.error("Email is required for signup");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      setMessage(result.message);
      if (res.status === 201) {
        setIsSuccessful(true);
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage("An error occurred during signup");
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        {isSuccessful ? (
          <>
            <p className=" text-center text-lg font-semibold">Check your mail</p>
          </>
        ) : (
          <AuthForm mode="Signup" onSubmit={handleSignup} />
        )}
        {message && (
          <p
            className={`text-center mt-4 ${isSuccess ? "text-green-500" : "text-red-500"}`}
          >
            {message}
          </p>
        )}
        {isSuccessful && (
          <Link href="/login">
            <p className="text-center text-blue-500 font-bold underline py-4">
              Back to login
            </p>
          </Link>
        )}
        {!isSuccessful && (
          <Link href="/login">
            <p className="text-center text-blue-500 font-bold underline py-4">
              Already have an account? LogIn
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Signup;
