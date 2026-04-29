import { useState } from "react";
import { AdminHero, AdminSidebar } from "./components";
import { sectionLinks } from "./adminData";
import { renderAdminSection } from "./renderAdminSection.jsx";
import useAdminWorkspace from "./useAdminWorkspace";

const AdminDashboard = () => {
  const workspace = useAdminWorkspace();
  const [activeSection, setActiveSection] = useState(sectionLinks[0]?.id || "price-control");

  return (
    <div className="overflow-hidden">
      <AdminHero
        roomTypesCount={workspace.roomTypes.length}
        highestHolidayUplift={workspace.highestHolidayUplift}
        facilitiesCount={workspace.facilities.length}
      />

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          <AdminSidebar
            sectionLinks={sectionLinks}
            activeSection={activeSection}
            onChangeSection={setActiveSection}
            hotelOptions={workspace.hotelOptions}
            selectedHotelId={workspace.selectedHotelId}
            setSelectedHotelId={workspace.setSelectedHotelId}
            selectedHotel={workspace.selectedHotel}
            filteredRoomTypesCount={workspace.filteredRoomTypes.length}
          />

          <div>{renderAdminSection(activeSection, workspace)}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
