const AdminSectionTabs = ({ sectionLinks, activeSection, onChangeSection }) => (
  <div className="rounded-[28px] border border-[#e5dbc9] bg-white p-3 shadow-[0_18px_42px_rgba(34,27,18,0.06)]">
    <div className="flex gap-3 overflow-x-auto pb-1">
      {sectionLinks.map((section) => {
        const isActive = section.id === activeSection;

        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onChangeSection(section.id)}
            className={`shrink-0 rounded-2xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? "bg-[#17363f] text-white shadow-[0_10px_24px_rgba(23,54,63,0.18)]"
                : "border border-[#eadfce] bg-[#fcfaf6] text-textPrimary hover:bg-[#f5ecde]"
            }`}
          >
            {section.label}
          </button>
        );
      })}
    </div>
  </div>
);

export default AdminSectionTabs;
