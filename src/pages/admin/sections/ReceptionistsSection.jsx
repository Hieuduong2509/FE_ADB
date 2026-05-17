const ReceptionistsSection = ({
  users,
  hotelOptions,
  assigningUserId,
  assignHotelMap,
  onAssignHotelChange,
  onSetReceptionistRole,
  onAssignHotel,
  onRemoveReceptionist,
  isSubmitting,
  isLoading,
  errorMessage,
}) => {
  const receptionistCount = users.filter((user) => user.role === "receptionist").length;
  const nonReceptionistCount = users.length - receptionistCount;

  return (
  <section id="receptionists" className="space-y-4">
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-accent">Receptionist Roles</div>
      <h2 className="mt-2 text-2xl font-semibold text-textPrimary">Phân quyền lễ tân</h2>
      <p className="mt-1 text-sm text-gray-600">Set role receptionist và gán khách sạn cho từng user.</p>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full bg-[#e8f6ee] px-3 py-1 font-semibold text-[#1f7a4f]">
          Receptionist: {receptionistCount}
        </span>
        <span className="rounded-full bg-[#f3ebdc] px-3 py-1 font-semibold text-[#8b5e34]">
          Chưa là receptionist: {nonReceptionistCount}
        </span>
      </div>
    </div>

    {errorMessage ? (
      <div className="rounded-lg border border-[#e7c5bf] bg-[#fff2ee] px-3 py-2 text-sm text-[#aa4f3d]">
        {errorMessage}
      </div>
    ) : null}

    {isLoading ? (
      <div className="rounded-xl border border-dashed border-[#d8ccb8] bg-white p-4 text-sm text-gray-600">
        Loading user...
      </div>
    ) : (
      <div className="space-y-3">
        {users.map((user) => (
          <div key={user.id} className="rounded-xl border border-[#ece2d3] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-textPrimary">{user.fullName || user.email}</div>
                <div className="text-sm text-gray-600">{user.email}</div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2 py-1 font-semibold ${
                      user.role === "receptionist"
                        ? "bg-[#e8f6ee] text-[#1f7a4f]"
                        : "bg-[#f3ebdc] text-[#8b5e34]"
                    }`}
                  >
                    {user.role === "receptionist" ? "Receptionist" : `Role: ${user.role}`}
                  </span>
                  <span className="text-gray-500">Assigned hotel: {user.assignedHotelId || "Chưa gán"}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => onSetReceptionistRole(user.id)}
                  className="rounded-lg bg-[#17363f] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Set Receptionist
                </button>
                <button
                  type="button"
                  disabled={isSubmitting || user.role !== "receptionist"}
                  onClick={() => onRemoveReceptionist(user.id)}
                  className="rounded-lg bg-[#aa4f3d] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Remove Role
                </button>

                <select
                  value={assignHotelMap[user.id] || ""}
                  onChange={(event) => onAssignHotelChange(user.id, event.target.value)}
                  className="rounded-lg border border-[#e7dcc8] bg-[#fcfaf6] px-3 py-2 text-xs"
                >
                  <option value="">Chọn khách sạn</option>
                  {hotelOptions.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={isSubmitting || !assignHotelMap[user.id]}
                  onClick={() => onAssignHotel(user.id)}
                  className="rounded-lg bg-[#8b5e34] px-3 py-2 text-xs font-semibold text-white disabled:opacity-60"
                >
                  Gán Hotel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>
  );
};

export default ReceptionistsSection;

