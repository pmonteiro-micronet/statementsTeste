import React from "react";
import "./styles.css";
import en from "../../../public/locales/english/common.json";

const translations = { en };

const Homepage = () => {

  const locale = "en";
  const t = translations[locale];

  return (
    <div className="min-h-screen flex">
      <main
        className="flex-1 min-h-screen p-8 overflow-y-auto"
      >
        <h2 className="font-semibold text-textPrimaryColor text-2xl mb-4">{t.homepage.title}</h2>

        <div className="flex flex-row gap-5">
          <div className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2">
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">21</h3>
              <p className="text-gray-400 mt-1 uppercase">{t.homepage.cardPending}</p>
            </div>
          </div>
          <div className="border border-gray-300 rounded-lg w-64 flex justify-center text-center py-10 px-2">
            <div className="flex flex-col">
              <h3 className="text-5xl text-primary">8</h3>
              <p className="text-gray-400 mt-1 uppercase">{t.homepage.cardViewed}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
