const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-2">Contact</h1>
      <p className="text-gray-600 mb-8">Hỗ trợ đặt phòng Pullman và tư vấn lưu trú.</p>
      <div className="max-w-xl space-y-4 text-gray-600">
        <p>
          <strong>Hotline:</strong> 1900 Pullman
        </p>
        <p>
          <strong>Email:</strong> reservations@pullman-demo.com
        </p>
        <p>
          <strong>Địa chỉ:</strong> Pullman Reservation Office
        </p>
      </div>
    </div>
  );
};

export default Contact;

