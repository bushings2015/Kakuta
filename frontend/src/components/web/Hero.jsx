import React, { useEffect, useState } from "react";
import heroImage from "/hero.webp"; // รูป fallback
import contentService from "../../services/contentServices";

const Hero = () => {
  const [hero, setHero] = useState([]);

  const fetchHero = async () => {
    try {
      const res = await contentService.searchContentsByType("hero");
      setHero(res.data.data || []);
    } catch (err) {
      console.error("Failed to load hero content", err);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const heroEN = hero.find((item) => item.language === "en");

  const highlightRed = (text, keyword) => {
    if (!text) return "";
    const parts = text.split(new RegExp(`(${keyword})`, "gi")); // swap keyword
    return parts.map((part, idx) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={idx} className="text-red-600">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <section
      className="relative bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: `url(${heroEN?.imageUrl || heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/30 -z-10"></div> {/* optional overlay for readability */}

      <div className="container mx-auto px-4 lg:px-8 py-24 flex flex-col-reverse lg:flex-row items-center gap-12">
        {/* Text Section */}
        <div className="flex-1 text-center lg:text-left space-y-6 animate-fadeIn text-white">
          <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight">
            {heroEN?.title
              ? highlightRed(heroEN.title, "Kakuta Toggle Clamps")
              : <>Discover <span className="text-red-400">Kakuta Toggle Clamps</span></>}
          </h1>

          <p className="text-lg lg:text-xl max-w-2xl mx-auto lg:mx-0 whitespace-pre-line">
            {heroEN?.detail
              ? highlightRed(heroEN.detail, "Kakuta Toggle Clamps")
              : "Originated in Japan, Kakuta has been providing top-quality toggle clamps for the automobile, aerospace, and manufacturing industries for over 65 years."}
          </p>

          <div className="flex justify-center lg:justify-start gap-4 mt-6">
            <a
              href="/about"
              className="bg-red-600 text-white px-6 py-3 text-lg font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105"
            >
              Learn More
            </a>
            <a
              href="/contact"
              className="border border-red-600 text-red-600 px-6 py-3 text-lg font-semibold rounded-lg hover:bg-red-50 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;