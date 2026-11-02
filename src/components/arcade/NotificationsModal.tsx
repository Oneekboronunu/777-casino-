"use client";

import React from "react";
import { X, Bell, Check, Trash2, Sparkles } from "lucide-react";
import { useArcadeStore } from "@/lib/store/useArcadeStore";
import sound from "@/lib/sound";

export default function NotificationsModal() {
  const {
    isNotificationsOpen,
    setIsNotificationsOpen,
    notifications,
    markNotificationAsRead,
    clearNotifications,
  } = useArcadeStore();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#FFF6D4] border-2 border-[#EADBBE] rounded-3xl p-6 shadow-2xl text-[#40243B] space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E0D0A5]">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#91D2BC] flex items-center justify-center text-[#40243B]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight leading-tight">
                Arcade Notifications
              </h3>
              <p className="text-[10px] text-gray-600 font-medium">
                Live platform updates & daily drops
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playChipClick();
              setIsNotificationsOpen(false);
            }}
            className="p-1.5 rounded-full hover:bg-[#F2E5C0] text-[#40243B] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-gray-500 font-medium">
              No new notifications. You are all caught up!
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer flex items-start space-x-3 ${
                  item.read
                    ? "bg-[#F7EDCE]/60 border-[#E8DCBD]"
                    : "bg-[#91D2BC]/30 border-[#7EBEA9] shadow-xs"
                }`}
              >
                <div className="pt-0.5">
                  <Sparkles className="w-4 h-4 text-[#C33355]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-[#40243B] truncate">
                      {item.title}
                    </h4>
                    <span className="text-[9px] text-gray-500 font-mono">
                      {item.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#40243B]/80 font-medium mt-0.5 leading-snug">
                    {item.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#E0D0A5] text-xs">
          <button
            onClick={() => {
              sound.playChipClick();
              clearNotifications();
            }}
            className="flex items-center space-x-1 text-gray-500 hover:text-[#C33355] text-[11px] font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear all</span>
          </button>

          <button
            onClick={() => {
              sound.playChipClick();
              setIsNotificationsOpen(false);
            }}
            className="px-5 py-2 rounded-full bg-[#C33355] hover:bg-[#AA2443] text-white font-black text-xs uppercase tracking-wider transition shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
