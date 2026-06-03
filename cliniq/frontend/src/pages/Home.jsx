import React from "react";
import { Link } from "react-router-dom";
import FlowSection from "../components/FlowSection";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-clinic-400 to-clinic-700 flex items-center justify-center shadow-2xl shadow-clinic-500/30">
              <svg
                className="w-11 h-11 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="font-display font-black text-5xl text-white">
              ClinIQ
            </h1>
            <p className="text-slate-400 font-body text-lg leading-relaxed">
              Real-time clinic queue management.
              <br />
              No paper. No shouting. No confusion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/receptionist"
              className="card p-6 hover:border-clinic-500/50 transition-all hover:bg-clinic-500/5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-clinic-500/20 flex items-center justify-center text-clinic-400 mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="font-display font-bold text-white text-lg mb-1">
                Receptionist
              </h2>
              <p className="text-slate-500 text-sm font-body">
                Manage queue, add patients, call tokens
              </p>
            </Link>

            <Link
              to="/display"
              className="card p-6 hover:border-amber-500/50 transition-all hover:bg-amber-500/5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="font-display font-bold text-white text-lg mb-1">
                Patient Display
              </h2>
              <p className="text-slate-500 text-sm font-body">
                Waiting room screen with live queue
              </p>
            </Link>
          </div>

          <p className="text-slate-700 text-xs font-mono">
            Built for real small clinics · Socket.IO powered · No refresh needed
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6">
        <FlowSection />
      </div>
    </>
  );
}
