import React from "react";

const Navbar = ({ brandName, containerClassName, userName }) => {
  return (
    <nav className={`${containerClassName} fixed top-0 left-0 right-0 z-50`}>
      <div className="flex justify-between items-center px-4 relative">
        <div className="font-normal text-sm text-black">{brandName}</div>
        {userName && (
          <div className="font-normal text-sm text-black absolute left-1/2 transform -translate-x-1/2">
            Player: {userName}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
