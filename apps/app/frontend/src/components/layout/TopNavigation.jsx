import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileDown, Menu, Home } from "lucide-react";
import { PdfService } from "../../services/PdfService";

function TopNavigation({ onMenuClick, formData, sidebarItems }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const navigate = useNavigate();

  const handleHomeButton = () => {
    navigate("/");
  };

  const handleDownloadClick = async () => {
    setIsDownloading(true);

    try {
      // First test the connection
      const connectionTest = await PdfService.testConnection();

      if (!connectionTest.success) {
        alert(
          "Backend connection failed. Make sure the server is running on port 3001."
        );
        return;
      }

      // Download resume PDF using HTML generation
      // You can change 'harvard' to other templates when you add them
      const result = await PdfService.downloadResumePDF(
        formData,
        sidebarItems,
        "harvard"
      );

      if (!result.success) {
        alert(`PDF generation failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Download error:", error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-2 sm:px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Hamburger Menu */}
          <button
            onClick={onMenuClick}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Home Button */}
          <button
            onClick={handleHomeButton}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* App Title */}
          <div className="flex items-center space-x-2">
            <img
              src="/ResuEase-logo.svg"
              alt="ResuEase Logo"
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <h1 className="text-lg font-semibold text-gray-900">ResuEase</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Download Button */}
          <button
            onClick={handleDownloadClick}
            disabled={isDownloading}
            className={`
              px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2
              ${
                isDownloading
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
          >
            <FileDown
              className={`w-4 h-4 ${isDownloading ? "animate-spin" : ""}`}
            />
            <span className="hidden sm:inline">
              {isDownloading ? "Generating..." : "Download"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default TopNavigation;
