export const formatCurrency = (amount) =>
  `${new Intl.NumberFormat("vi-VN").format(amount)}đ`;

export const calculateStayNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) {
    return 1;
  }

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const diffInMs = endDate - startDate;

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime()) || diffInMs <= 0) {
    return 1;
  }

  return Math.round(diffInMs / (1000 * 60 * 60 * 24));
};

export const formatDateLabel = (dateValue) => {
  if (!dateValue) {
    return "Chưa chọn";
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
};
