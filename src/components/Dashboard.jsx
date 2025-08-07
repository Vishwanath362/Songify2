import React, { useEffect } from "react";
import { useAuthContext } from "../authentication/Auth";
import UploadAudio from "./uploadAudio";
import { Outlet, useNavigate } from "react-router-dom";
import Library from "./Library";

export const Dashboard = () => {
  const { token } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className="bg-black text-white min-h-screen w-full flex flex-col md:flex-row overflow-x-hidden">
      <aside className="w-full md:w-80 bg-gradient-to-br from-gray-950 via-gray-900 to-green-900 p-2 md:ml-3 rounded-none md:rounded-2xl font-bold min-h-[120px] md:min-h-screen mb-2">
        <Library />
      </aside>
      <main className="flex flex-col w-full max-w-full px-0 md:px-4 py-2 gap-6">
        <div className="w-full max-w-full">
          <Outlet />
        </div>
        <div className="w-full max-w-full ">
          <UploadAudio />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
