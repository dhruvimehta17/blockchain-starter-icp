import React from "react";
import CreateSwitch from "./components/CreateSwitch";
import CheckInButton from "./components/CheckInButton";
import StatusDisplay from "./components/StatusDisplay";
import AuthButton from "./components/AuthButton";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">ICP Dead Man's Switch</h1>
      <AuthButton />
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 mt-4">
        <CreateSwitch />
        <CheckInButton />
        <StatusDisplay />
      </div>
    </div>
  );
}
