import React, { useEffect, useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { LOGIN_PATH } from "../../configs/constants";
import addressService from './../../services/addressService';

const Footer = () => {
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    try {
      const res = await addressService.getAllAddress();
      setAddresses(res.data.data || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  return (
    <footer className="bg-red-900 text-white pt-12">
      <div className="container mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Office Addresses */}
        {addresses.map((item) => (
          <div key={item.id} className="space-y-4">
            <h4 className="font-bold text-xl">{item.addressType?.name}</h4>
            <p className="flex items-start gap-3">
              <MapPin size={20} className="mt-1 text-red-200" />
              {item.address}
            </p>
            <p className="flex items-center gap-3">
              <Phone size={20} className="text-red-200" />
              {item.phone1} {item.phone2 && `| ${item.phone2}`}
            </p>
            <p className="flex items-center gap-3">
              <Mail size={20} className="text-red-200" />
              <a
                href={`mailto:${item.email}`}
                className="hover:text-red-300 transition-colors"
              >
                {item.email}
              </a>
            </p>
          </div>
        ))}

        {/* Quicklinks */}
        <div className="space-y-4">
          <h4 className="font-bold text-xl">Quicklinks</h4>
          <ul className="space-y-2">
            <li>
              <a href="/" className="hover:text-red-300 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/products" className="hover:text-red-300 transition-colors">
                Products
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-red-300 transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-red-300 transition-colors">
                Contact Us
              </a>
            </li>
            <li>
              <a href="/privacy-policy" className="hover:text-red-300 transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/refunds-returns" className="hover:text-red-300 transition-colors">
                Refunds & Returns Policy
              </a>
            </li>
            <li>
              <a href={LOGIN_PATH} className="hover:text-red-300 transition-colors">
                Control System
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-sm mt-12 pb-6 border-t border-red-700">
        Copyright © 2015-2025 Kakuta Co. USA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
