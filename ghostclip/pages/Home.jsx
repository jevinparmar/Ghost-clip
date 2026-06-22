import { useState } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PopularTools from "../components/PopularTools";
import Features from "../components/Features";
import FAQSection from "../components/FAQSection";
import Footer from "../components/Footer";
import "../styles/home.css";

function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [downloadSession, setDownloadSession] = useState({
    status: "idle",
    type: "",
    url: "",
  });

  const handleDownloadStart = (url, type) => {
    setDownloadSession({
      status: "fetching",
      type: type || activeTab,
      url,
    });

    setTimeout(() => {
      setDownloadSession((prev) => ({
        ...prev,
        status: "ready",
      }));
    }, 3000);
  };

  const handleResetDownload = () => {
    setDownloadSession({
      status: "idle",
      type: "",
      url: "",
    });
  };

  return (
    <div className="home-page-wrapper">
      <div className="container">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        <Hero
          activeTab={activeTab}
          onDownloadStart={handleDownloadStart}
          downloadSession={downloadSession}
          onResetDownload={handleResetDownload}
        />

        <PopularTools activeTab={activeTab} setActiveTab={setActiveTab} />

        <Features />

        <FAQSection />
      </div>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}

export default Home;
