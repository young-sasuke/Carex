"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

type FormData = {
  username: string;
  email: string;
  role: "student" | "host";
  age?: number;
  schoolName?: string;
  stream?: string;
  grade?: string;
  preferences?: {
    freeOrPaid: string;
    location: string;
    category: string;
    interests: string;
  };
};

export default function Onboarding() {
  const [userRole, setUserRole] = useState<"student" | "host" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const [isSignedIn, setSignedIn] = useState(false);

  useEffect(() => {
    if (isSignedIn && !isSubmitting) {
      router.push("/");
    }
  }, [isSignedIn]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    console.log(data);

    try {
      const response = await fetch("/api/userPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          role: userRole,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Welcome, ${result.user.username}! You have signed up as a ${result.user.role.toLowerCase()}.`);        
        console.log(result);
        const userId = result.id;
        const userRole = result.role;
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("userId", userId);
        setSignedIn(true);
      } else {
        alert(result.error || "Failed to sign up. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while signing up. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-800">
        <h1 className="text-4xl font-semibold mb-8">Onboarding</h1>

        {/* Role Selection */}
        <div className="mb-6">
          <button
            type="button"
            disabled={isSubmitting}
            className={`px-4 py-2 mr-4 ${
              userRole === "student" ? "bg-blue-500 text-white" : "bg-gray-200"
            } rounded transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            onClick={() => setUserRole("student")}
          >
            Student
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            className={`px-4 py-2 ${
              userRole === "host" ? "bg-green-500 text-white" : "bg-gray-200"
            } rounded transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
            onClick={() => setUserRole("host")}
          >
            Host
          </button>
        </div>

        {/* Student Form */}
        {userRole === "student" && (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-6 border rounded-lg bg-white shadow-md">
            <h2 className="text-2xl font-bold mb-4">Student Onboarding</h2>

            {/* Username Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Username</label>
              <input
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                })}
                type="text"
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Age Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Age</label>
              <input
                {...register("age", { required: "Age is required", valueAsNumber: true })}
                type="number"
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
              )}
            </div>

            {/* School Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">School Name</label>
              <input
                {...register("schoolName", { required: "School name is required" })}
                type="text"
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
                placeholder="Enter your school name"
              />
              {errors.schoolName && (
                <p className="text-red-500 text-sm mt-1">{errors.schoolName.message}</p>
              )}
            </div>

            {/* Grade */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Grade</label>
              <input
                {...register("grade", { required: "Grade is required" })}
                type="text"
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
                placeholder="Enter your grade"
              />
              {errors.grade && (
                <p className="text-red-500 text-sm mt-1">{errors.grade.message}</p>
              )}
            </div>

            {/* Stream */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Stream</label>
              <select
                {...register("stream", { required: "Stream is required" })}
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
              >
                <option value="" disabled>Select your stream</option>
                <option value="science">Science</option>
                <option value="commerce">Commerce</option>
                <option value="arts">Arts</option>
              </select>
              {errors.stream && (
                <p className="text-red-500 text-sm mt-1">{errors.stream.message}</p>
              )}
            </div>
            

            {/* Preferences */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Free or Paid</label>
              <select
                {...register("preferences.freeOrPaid", { required: "This field is required" })}
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
              >
                <option value="">Select</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>
              {errors.preferences?.freeOrPaid && (
                <p className="text-red-500 text-sm mt-1">{errors.preferences.freeOrPaid.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Location</label>
              <input
                {...register("preferences.location", { required: "Location is required" })}
                type="text"
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
                placeholder="Enter your location"
              />
              {errors.preferences?.location && (
                <p className="text-red-500 text-sm mt-1">{errors.preferences.location.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Interests</label>
              <input
                {...register("preferences.interests", { required: "Interests are required" })}
                type="text"
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
                placeholder="Enter your interests"
              />
              {errors.preferences?.interests && (
                <p className="text-red-500 text-sm mt-1">{errors.preferences.interests.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 mt-4 bg-blue-500 text-white rounded ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600 transition-colors"
              }`}
            >
              {isSubmitting ? "Processing..." : "Complete Student Onboarding"}
            </button>
          </form>
        )}

        {userRole === "host" && (
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-6 border rounded-lg bg-white shadow-md">
            <h2 className="text-2xl font-bold mb-4">Host Onboarding</h2>

            {/* Username Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Username</label>
              <input
                {...register("username", {
                  required: "Username is required",
                  minLength: { value: 3, message: "Username must be at least 3 characters" },
                })}
                type="text"
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                disabled={isSubmitting}
                className="w-full p-2 rounded border border-gray-300"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 mt-4 bg-green-500 text-white rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600 transition-color"}`
              }
            >
              {isSubmitting ? "Processing..." : "Complete Host Onboarding"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
