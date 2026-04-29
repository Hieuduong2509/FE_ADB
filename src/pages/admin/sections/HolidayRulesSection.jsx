const HolidayRulesSection = ({
  ruleDraft,
  setRuleDraft,
  submitRule,
  editingRuleId,
  resetRuleEditor,
  seasonalRules,
  startRuleEdit,
  deleteRule,
  hotelOptions,
  roomTypes,
}) => {
  const availableCategories = [
    ...new Set(
      roomTypes
        .filter((roomType) => roomType.hotelId === ruleDraft.hotelId)
        .map((roomType) => roomType.category),
    ),
  ];

  return (
    <section
      id="holiday-rules"
      className="rounded-[32px] border border-[#e5dbc9] bg-white p-6 shadow-[0_18px_42px_rgba(34,27,18,0.06)]"
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Holiday uplift
          </div>
          <h2 className="mt-2 text-3xl font-semibold text-textPrimary">
            Tạo rule tăng phần trăm cho ngày lễ
          </h2>

          <form onSubmit={submitRule} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Tên chiến dịch</span>
              <input
                type="text"
                value={ruleDraft.name}
                onChange={(event) =>
                  setRuleDraft((currentDraft) => ({ ...currentDraft, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                placeholder="Ví dụ: Giỗ tổ Hùng Vương"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Khách sạn</span>
                <select
                  value={ruleDraft.hotelId}
                  onChange={(event) =>
                    setRuleDraft((currentDraft) => ({ ...currentDraft, hotelId: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                >
                  {hotelOptions.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Áp dụng cho</span>
                <select
                  value={ruleDraft.appliesTo}
                  onChange={(event) =>
                    setRuleDraft((currentDraft) => ({ ...currentDraft, appliesTo: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                >
                  <option value="all">Tất cả room type</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Ngày bắt đầu</span>
                <input
                  type="date"
                  value={ruleDraft.startDate}
                  onChange={(event) =>
                    setRuleDraft((currentDraft) => ({
                      ...currentDraft,
                      startDate: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-gray-600">Ngày kết thúc</span>
                <input
                  type="date"
                  value={ruleDraft.endDate}
                  onChange={(event) =>
                    setRuleDraft((currentDraft) => ({
                      ...currentDraft,
                      endDate: event.target.value,
                    }))
                  }
                  className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                />
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Phần trăm tăng giá</span>
              <input
                type="number"
                min="0"
                max="100"
                value={ruleDraft.percent}
                onChange={(event) =>
                  setRuleDraft((currentDraft) => ({
                    ...currentDraft,
                    percent: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-gray-600">Ghi chú</span>
              <textarea
                rows="3"
                value={ruleDraft.note}
                onChange={(event) =>
                  setRuleDraft((currentDraft) => ({ ...currentDraft, note: event.target.value }))
                }
                className="w-full rounded-2xl border border-[#e7dcc8] bg-[#fcfaf6] px-4 py-3 text-sm outline-none transition focus:border-[#17363f] focus:ring-4 focus:ring-[#17363f]/10"
                placeholder="Mục tiêu của rule giá này"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="rounded-full bg-[#17363f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#102d34]"
              >
                {editingRuleId ? "Lưu holiday rule" : "Thêm holiday rule"}
              </button>
              {editingRuleId ? (
                <button
                  type="button"
                  onClick={resetRuleEditor}
                  className="rounded-full border border-[#d8ccb8] px-5 py-3 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
            </div>
          </form>
        </div>

        <div className="space-y-4">
          {seasonalRules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-[28px] border border-[#ece2d3] bg-[#fffcf7] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-accent">
                    {hotelOptions.find((hotel) => hotel.id === rule.hotelId)?.name}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold text-textPrimary">{rule.name}</h3>
                </div>
                <div className="rounded-full bg-[#17363f] px-4 py-2 text-sm font-semibold text-white">
                  +{rule.percent}%
                </div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-gray-600 md:grid-cols-3">
                <div className="rounded-2xl bg-[#f7efe2] px-4 py-3">
                  Áp dụng: {rule.appliesTo === "all" ? "Tất cả room type" : rule.appliesTo}
                </div>
                <div className="rounded-2xl bg-[#f7efe2] px-4 py-3">
                  {rule.startDate} → {rule.endDate}
                </div>
                <div className="rounded-2xl bg-[#f7efe2] px-4 py-3">{rule.note}</div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => startRuleEdit(rule)}
                  className="rounded-full border border-[#d8ccb8] px-4 py-2 text-sm font-medium text-textPrimary transition hover:bg-[#faf4ea]"
                >
                  Sửa
                </button>
                <button
                  type="button"
                  onClick={() => deleteRule(rule.id)}
                  className="rounded-full border border-[#e7c5bf] px-4 py-2 text-sm font-medium text-[#aa4f3d] transition hover:bg-[#fff2ee]"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HolidayRulesSection;
