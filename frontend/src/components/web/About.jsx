import React, { useEffect, useState } from "react";
import aboutImage from "/about.webp";
import contentService from "../../services/contentServices";

const AboutSection = () => {
  const [about, setAbout] = useState([]);

  // Fetch About content
  const fetchAbout = async () => {
    try {
      const res = await contentService.searchContentsByType("about");
      setAbout(res.data.data || []);
    } catch (err) {
      console.error("Failed to load about content", err);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // แยกภาษา
  const aboutEN = about.find((item) => item.language === "en");

  // ฟังก์ชัน highlight คำแดง
  const highlightRed = (text, keyword) => {
    if (!text) return "";
    const parts = text.split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part, idx) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={idx} className="text-red-600 font-semibold">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <section className="relative bg-white overflow-hidden py-20">
      {/* Background Accent */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-50 via-white to-red-100 -z-10"></div>

      <div className="container mx-auto px-4 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
        {/* Image Section */}
        <div className="lg:w-1/2 flex justify-center lg:justify-start">
          <img
            src={aboutEN?.imageUrl || aboutImage}
            alt={aboutEN?.title || "About Kakuta"}
            className="rounded-xl shadow-2xl transform transition-transform duration-500 hover:scale-105 max-w-full h-auto object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="lg:w-1/2 space-y-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900">
            {aboutEN?.title
              ? highlightRed(aboutEN.title, "Kakuta")
              : <>About <span className="text-red-600">Kakuta</span></>}
          </h2>

          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {aboutEN?.detail
              ? highlightRed(aboutEN.detail, "Kakuta toggle clamps")
              : "Originated in Japan, Kakuta was established in 1959 to serve the leading Japanese automobile manufacturing industry. Kakuta toggle clamps have been widely recognized among Japanese automobile assembly plants including Toyota, Nissan, Honda, and Mitsubishi."}
          </p>

          <a
            href="/about"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-transform transform hover:scale-105"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
