import React, { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import addressService from "../../services/addressService";

const ContactBanner = () => {
  const [usOffice, setUsOffice] = useState(null);
  const [japanOffice, setJapanOffice] = useState(null);

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAllAddress();
      const data = res.data.data || [];

      const us = data.find((item) => item.addressType?.name === "US Office");
      const jp = data.find((item) => item.addressType?.name === "Japan Office");

      setUsOffice(us);
      setJapanOffice(jp);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <div className="w-full">
      <div className="bg-red-600 text-white py-2 px-4 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-1 md:space-y-0">
          {/* US Office */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>
                US Office: {usOffice?.phone1 || "Loading..."}
              </span>
            </div>
            {usOffice?.phone2 && (
              <div className="flex items-center space-x-2">
                <span>{usOffice.phone2}</span>
              </div>
            )}
          </div>

          {/* Japan Office */}
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4" />
            <span>
              Japan Office: {japanOffice?.phone1 || "Loading..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactBanner;
