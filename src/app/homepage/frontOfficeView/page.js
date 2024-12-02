import React from "react";
import "./styles.css";

const frontOffice = () => {
  return (
    <div className="min-h-screen flex">
      <main
        className="flex-1 min-h-screen p-8 overflow-y-auto"
      >
        <h2 className="font-semibold text-2xl mb-4">Front Office</h2>

        <div className="flex flex-row gap-5">
          <div className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2">
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">13</h3>
              <p className="text-gray-400 mt-1">ARRIVALS</p>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2">
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">20</h3>
              <p className="text-gray-400 mt-1">IN HOUSES</p>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2">
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">10</h3>
              <p className="text-gray-400 mt-1">DEPARTURES</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default frontOffice;
