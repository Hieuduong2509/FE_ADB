const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-2">Giới thiệu</h1>
      <p className="text-gray-600 mb-6">
        Hệ thống đặt phòng khách sạn đa chi nhánh toàn Việt Nam.
      </p>
      <div className="max-w-2xl text-gray-600 space-y-4">
        <p>
          Chúng tôi cung cấp nền tảng đặt phòng tập trung cho nhiều chi nhánh khách sạn,
          giúp khách hàng dễ dàng tìm và đặt phòng với giá tốt nhất.
        </p>
        <p>
          Dự án sử dụng React, Tailwind CSS; backend và cơ sở dữ liệu (MongoDB, PostgreSQL)
          sẽ được tích hợp ở các giai đoạn tiếp theo.
        </p>
      </div>
    </div>
  );
};

export default About;
