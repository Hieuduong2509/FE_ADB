const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-2">Liên hệ</h1>
      <p className="text-gray-600 mb-8">
        Hỗ trợ đặt phòng và thông tin các chi nhánh khách sạn.
      </p>
      <div className="max-w-xl space-y-4 text-gray-600">
        <p><strong>Hotline:</strong> 1900 xxxx</p>
        <p><strong>Email:</strong> support@example.com</p>
        <p><strong>Địa chỉ:</strong> (Cập nhật sau)</p>
      </div>
    </div>
  );
};

export default Contact;
