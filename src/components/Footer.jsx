import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#0AA1DD] text-white py-8 mt-10 border-t-4 rounded-t-lg border-[#055777]">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
                  <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <div className="text-2xl font-bold flex items-center gap-2">        
              <img src={logo} alt="logo" className="w-26 h-14" />
              <h1 className="text-2xl text-white bor font-bold">wemet</h1>

            </div>
            <p className="mt-2 text-xs">© 2023 Your Company. All rights reserved.</p>
          </div>

          {/* Quick links */}
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            {/* <h3 className="text-lg font-semibold mb-4">Quick Links</h3> */}
            <ul>
              <li><Link to={"/"}   className="hover:text-[#055777] transition-colors duration-300">Home</Link></li>
              <li><Link  to={"/About"} className="hover:text-[#055777] transition-colors duration-300">About Us</Link></li>
              <li><Link  to={"/ContactUs"} className="hover:text-[#055777] transition-colors duration-300">Contact</Link></li>
            </ul>
          </div>

          {/* Social media links */}
          {/* <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-[#055777] transition-colors duration-300"><FaFacebookF size={24} /></a>
              <a href="#" className="hover:text-[#055777] transition-colors duration-300"><FaTwitter size={24} /></a>
              <a href="#" className="hover:text-[#055777] transition-colors duration-300"><FaInstagram size={24} /></a>
              <a href="#" className="hover:text-[#055777] transition-colors duration-300"><FaLinkedinIn size={24} /></a>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}