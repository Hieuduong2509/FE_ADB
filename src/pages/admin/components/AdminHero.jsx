const StatCard = ({ label, value, hint }) => (
  <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 text-white backdrop-blur">
    <div className="text-xs uppercase tracking-[0.24em] text-[#f6ddb0]">{label}</div>
    <div className="mt-3 text-3xl font-semibold">{value}</div>
    <div className="mt-2 text-sm leading-6 text-white/72">{hint}</div>
  </div>
);

const AdminHero = ({ roomTypesCount, highestHolidayUplift, facilitiesCount }) => (
  <section className="relative isolate border-b border-white/30">
    <div className="absolute inset-0 -z-20 bg-[linear-gradient(140deg,_#102a31_0%,_#1d4950_42%,_#e8c993_100%)]" />
    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(251,244,228,0.24),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.16),_transparent_18%)]" />

    <div className="container mx-auto px-4 py-10 md:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="text-white">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[#f6ddb0] backdrop-blur">
            Pullman admin workspace
          </div>
          <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-tight md:text-5xl">
            Trang admin tập trung vào giá phòng, cấu hình ngày lễ và quản trị inventory phòng.
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/78 md:text-lg">
            Luồng này ưu tiên thao tác vận hành: chỉnh base price, cộng phần trăm dịp cao điểm,
            thêm loại phòng mới và gắn facilities, amenities trực tiếp lên từng room type.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Room types"
            value={String(roomTypesCount).padStart(2, "0")}
            hint="Tổng room type đang mở bán trong UI admin."
          />
          <StatCard
            label="Holiday uplift"
            value={`${highestHolidayUplift}%`}
            hint="Mức tăng cao nhất đang được cấu hình."
          />
          <StatCard
            label="Facilities"
            value={String(facilitiesCount).padStart(2, "0")}
            hint="Dịch vụ add-on có thể gắn vào booking flow."
          />
        </div>
      </div>
    </div>
  </section>
);

export default AdminHero;
