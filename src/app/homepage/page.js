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
      </main>
    </div>
  );
};

export default Homepage;
