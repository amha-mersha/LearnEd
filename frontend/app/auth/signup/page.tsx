"use client";
import Link from "next/link";
import Image from "next/image";
import logo from "../../../public/Images/LearnEd.svg";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useSignUpMutation } from "@/lib/redux/api/getApi";
import LoadingIndicator from "@/app/components/core/LoadingIndicator";
import { useState } from "react";
import ErrorAlert from "@/app/components/core/ErrorAlert";

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export default function SignUp() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>();

  // rtk query hook
  const [signUp, { isLoading }] = useSignUpMutation();

  //state for error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  //router
  const router = useRouter();

  //submit function
  const onSubmit = async (formData: SignUpFormInputs) => {
    try {
      // Call the signUp mutation with the form data
      const result = await signUp({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: formData.role, // type not role
      }).unwrap();


      // Redirect to login
      router.push("/auth/login");
    } catch (err) {
      const error = err as BackendError; // Cast the error

      console.error("Sign-up failed:", error);

      if (error?.data?.error) {
        setErrorMessage(error.data.error);
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    }
  };

  return (
    <>
      {errorMessage && <ErrorAlert message={errorMessage} />}

      <section className="bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <Link
            href="/"
            className="flex items-center mb-4 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <Image src={logo} className=" w-32 py-4" alt="logo" />
          </Link>
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700 mb-4">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form
                className="space-y-4 md:space-y-6"
                onSubmit={handleSubmit(onSubmit)}
              >
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", {
                      required: "Name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters long",
                      },
                      maxLength: {
                        value: 20,
                        message: "Name must be less than 20 characters long",
                      },
                    })} // Add minLength validation
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Simon"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: "Invalid Email Format",
                      },
                    })}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                      maxLength: {
                        value: 71,
                        message:
                          "You're insane if you have a password whose length is greater than 71",
                      },
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                        message:
                          "Your password must contain at least one lower case, upper case, number and special character",
                      },
                    })}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === watch("password") || "Passwords do not match", // Validate match
                    })}
                    placeholder="••••••••"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Role selection */}
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Select your role
                  </label>
                  <div className="flex space-x-4">
                    <div>
                      <input
                        type="radio"
                        id="role-teacher"
                        value="teacher"
                        {...register("role", {
                          required: "Please select a role",
                        })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="role-teacher"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Teacher
                      </label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        id="role-student"
                        value="student"
                        {...register("role", {
                          required: "Please select a role",
                        })}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <label
                        htmlFor="role-student"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Student
                      </label>
                    </div>
                  </div>
                  {errors.role && (
                    <p className="text-red-500 text-xs">
                      {errors.role.message}
                    </p>
                  )}
                </div>

                {isLoading ? (
                  <button
                    type="button"
                    className="w-full flex justify-center items-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    disabled
                  >
                    <LoadingIndicator />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Create Account
                  </button>
                )}

                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="font-medium text-blue-600 hover:underline dark:text-primary-500"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
