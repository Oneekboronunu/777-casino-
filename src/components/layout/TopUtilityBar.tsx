"use client";

import React from "react";
import Link from "next/link";
import {
  Smartphone,
  Shield,
  HelpCircle,
  Mail,
  ChevronDown,
  LayoutGrid,
  FileText,
} from "lucide-react";

export default function TopUtilityBar() {
  return (
    <div className="w-full bg-[#080B0F] border-b border-[#141A23] text-gray-400 text-[11px] py-1 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left: Quick Tag */}
        <div className="hidden md:flex items-center space-x-2 text-gray-500">
          <span>Official 777 Sportsbook & Casino Platform</span>
        </div>

        {/* Right: Utility Links matching reference screenshot */}
        <div className="w-full md:w-auto flex items-center justify-between md:justify-end space-x-4 sm:space-x-5">
          <Link
            href="/"
            className="flex items-center space-x-1 hover:text-white transition"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-gray-400" />
            <span>777 Hub</span>
          </Link>

          <Link
            href="/"
            className="flex items-center space-x-1 hover:text-white transition"
          >
            <Smartphone className="w-3.5 h-3.5 text-gray-400" />
            <span>Download our app</span>
          </Link>

          <Link
            href="/"
            className="hidden sm:flex items-center space-x-1 hover:text-white transition"
          >
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span>Blog</span>
          </Link>

          <Link
            href="/account"
            className="hidden sm:flex items-center space-x-1 hover:text-white transition"
          >
            <Shield className="w-3.5 h-3.5 text-gray-400" />
            <span>Responsible gaming</span>
          </Link>

          <Link
            href="/account"
            className="flex items-center space-x-1 hover:text-white transition"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span>Help center</span>
          </Link>

          <Link
            href="/account"
            className="hidden lg:flex items-center space-x-1 hover:text-white transition"
          >
            <Mail className="w-3.5 h-3.5 text-gray-400" />
            <span>Contact us</span>
          </Link>

          {/* Language selector */}
          <div className="flex items-center space-x-1 text-gray-300 font-semibold cursor-pointer hover:text-white transition">
            <span>English</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
