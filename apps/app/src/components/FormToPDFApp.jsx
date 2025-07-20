import React, { useState } from 'react';
import { User, Phone, FileDown, Briefcase, GraduationCap, Award } from 'lucide-react';
import TopNavigation from './TopNavigation';
// import Sidebar from './Sidebar';
// import MainContent from './MainContent';
// import PreviewPanel from './PreviewPanel';

function FormToPDFApp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    occupation: '',
    company: '',
    experience: '',
    skills: '',
    about: '',
    website: '',
    linkedin: ''
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [showAdditional, setShowAdditional] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sidebarItems = [
    { id: 'personal', icon: User, label: 'Personal details' },
    { id: 'contact', icon: Phone, label: 'Contact information' },
    { id: 'summary', icon: FileDown, label: 'Professional summary' },
    { id: 'employment', icon: Briefcase, label: 'Employment history' },
    { id: 'skills', icon: Award, label: 'Skills' },
    { id: 'education', icon: GraduationCap, label: 'Education' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation formData={formData} />
      
      <div className="flex max-w-7xl mx-auto">
        {/* <Sidebar 
          sidebarItems={sidebarItems}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          isMobile={isMobile}
        /> */}

        <div className="flex-1 flex">
          {/* <MainContent 
            activeSection={activeSection}
            formData={formData}
            handleInputChange={handleInputChange}
            showAdditional={showAdditional}
            setShowAdditional={setShowAdditional}
          /> */}
          
          {/* <PreviewPanel 
            formData={formData}
            isMobile={isMobile}
          /> */}
        </div>
      </div>
    </div>
  );
}

export default FormToPDFApp;