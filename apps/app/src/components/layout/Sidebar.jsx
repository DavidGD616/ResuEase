import { Plus } from 'lucide-react';

function Sidebar({ sidebarItems, activeSection, setActiveSection, sidebarOpen }) {
  return (
    <div className={`
        ${sidebarOpen ? 'block' : 'hidden'}
        lg:block
        w-64 bg-white border-r border-gray-200 min-h-screen
      `}>
      <div className="p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm ${
                activeSection === item.id 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </button>
          );
        })}
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm text-gray-500 hover:bg-gray-50">
          <Plus className="w-4 h-4" />
          Additional section
        </button>
      </div>
    </div>
  );
}

export default Sidebar;