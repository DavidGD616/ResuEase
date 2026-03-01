import HeroSection from '../components/home/HeroSection';
import MainContent from '../components/home/MainContent';

function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--surface)' }}>
      <HeroSection />
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <MainContent />
      </div>
    </div>
  );
}

export default HomePage;
