const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-2">Giới thiệu</h1>
      <p className="text-gray-600 mb-6">Website đặt phòng dành riêng cho thương hiệu Pullman.</p>
      <div className="max-w-2xl text-gray-600 space-y-4">
        <p>
          Giao diện đang được xây theo hướng một brand duy nhất để trải nghiệm nhất quán hơn:
          khách hàng chọn khách sạn Pullman, xem loại phòng và đi vào booking nhanh.
        </p>
        <p>
          Dự án dùng React, Tailwind CSS và backend Node.js/PostgreSQL. Trước mắt ưu tiên hoàn
          thiện UI booking và luồng đăng nhập thử nghiệm.
        </p>
      </div>
    </div>
  );
};

export default About;
