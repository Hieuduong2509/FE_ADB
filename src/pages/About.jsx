const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-textPrimary mb-2">About</h1>
      <p className="text-gray-600 mb-6">A booking website dedicated to the Pullman brand.</p>
      <div className="max-w-2xl text-gray-600 space-y-4">
        <p>
          The interface is built around a single-brand experience for better consistency:
          guests choose Pullman hotels, browse room types, and move to booking quickly.
        </p>
        <p>
          The project uses React, Tailwind CSS, and a Node.js/PostgreSQL backend.
          The current priority is polishing the booking UI and authentication flow.
        </p>
      </div>
    </div>
  );
};

export default About;

