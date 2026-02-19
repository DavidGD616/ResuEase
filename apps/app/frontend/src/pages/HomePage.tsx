import HeroSection from '../components/home/HeroSection';
import MainContent from '../components/home/MainContent';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <MainContent />
      </div>
    </div>
  );
}

export default HomePage;
