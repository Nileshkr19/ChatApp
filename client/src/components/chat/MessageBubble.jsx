import React from "react";

const ContactSidebar = () => {
  return (
    <div className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Search contacts..."
        className="w-full p-2 border rounded-md"
      />
      <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
        {/* Map contacts here */}
        <li className="p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200">
          John Doe
        </li>
      </ul>
    </div>
  );
};

export default ContactSidebar;
