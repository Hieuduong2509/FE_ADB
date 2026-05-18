const StatCard = ({ label, value, hint }) => (
  <div className="rounded-[28px] border border-white/12 bg-white/10 p-5 text-white backdrop-blur">
    <div className="text-xs uppercase tracking-[0.24em] text-[#f6ddb0]">{label}</div>
    <div className="mt-3 text-3xl font-semibold">{value}</div>
    <div className="mt-2 text-sm leading-6 text-white/72">{hint}</div>
  </div>
);

const AdminHero = ({ totalBookings, totalRevenue, pendingPaymentCount }) => (
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
            Super admin
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-white/78 md:text-lg">
            
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Bookings"
            value={String(totalBookings).padStart(2, "0")}
            hint="Total booking"
          />
          <StatCard
            label="Revenue"
            value={new Intl.NumberFormat("vi-VN").format(totalRevenue)}
            hint="Total final amount."
          />
          <StatCard
            label="Pending payment"
            value={String(pendingPaymentCount).padStart(2, "0")}
            hint="Pending booking payment"
          />
        </div>
      </div>
    </div>
  </section>
);

export default AdminHero;
