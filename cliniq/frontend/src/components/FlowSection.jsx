import React, { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function RotatingBox() {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.6;
      ref.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <mesh ref={ref} rotation={[0.6, 0.8, 0]}>
      <boxGeometry args={[1.6, 1.6, 1.6]} />
      <meshStandardMaterial color="#06b6d4" metalness={0.4} roughness={0.15} />
    </mesh>
  );
}

export default function FlowSection() {
  return (
    <section className="mt-12 bg-gradient-to-br from-clinic-900/40 to-clinic-800/30 p-6 rounded-2xl shadow-lg">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: translateY(0);} }
        .fade-delay-1 { animation: fadeUp 520ms ease forwards; animation-delay: 100ms; }
        .fade-delay-2 { animation: fadeUp 520ms ease forwards; animation-delay: 220ms; }
        .fade-delay-3 { animation: fadeUp 520ms ease forwards; animation-delay: 340ms; }
        .dash { stroke-dasharray: 60; stroke-dashoffset: 60; animation: dash 1.2s ease forwards 0.2s; }
        @keyframes dash { to { stroke-dashoffset: 0; } }
      `}</style>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">How to use ClinIQ</h3>
          <p className="text-slate-400">
            Simple three-step flow to manage patients — illustrated with emojis
            and an interactive 3D model.
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 bg-clinic-800/40 rounded-lg flex flex-col items-start gap-2 fade-delay-1">
              <div className="text-3xl">📝</div>
              <h4 className="font-semibold text-white">Add Patient</h4>
              <p className="text-slate-400 text-sm">
                Receptionist adds a patient to the queue from the dashboard.
              </p>
            </div>
            <div className="p-4 bg-clinic-800/40 rounded-lg flex flex-col items-start gap-2 fade-delay-2">
              <div className="text-3xl">📣</div>
              <h4 className="font-semibold text-white">Call Next</h4>
              <p className="text-slate-400 text-sm">
                Call the next token; display updates in the waiting room.
              </p>
            </div>
            <div className="p-4 bg-clinic-800/40 rounded-lg flex flex-col items-start gap-2 fade-delay-3">
              <div className="text-3xl">✅</div>
              <h4 className="font-semibold text-white">Complete</h4>
              <p className="text-slate-400 text-sm">
                Mark consultation complete and view logs & stats.
              </p>
            </div>
          </div>

          {/* Animated SVG flow diagram */}
          <div className="mt-6">
            <svg viewBox="0 0 800 80" className="w-full h-20">
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <g transform="translate(40,40)">
                <circle
                  cx="0"
                  cy="0"
                  r="20"
                  fill="#0ea5a4"
                  filter="url(#glow)"
                />
                <text
                  x="0"
                  y="6"
                  textAnchor="middle"
                  fontSize="14"
                  fill="#062023"
                >
                  📝
                </text>

                <path
                  className="dash"
                  d="M30 0 L220 0"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />

                <g transform="translate(260,0)">
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill="#f59e0b"
                    filter="url(#glow)"
                  />
                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#2a1301"
                  >
                    📣
                  </text>
                </g>

                <path
                  className="dash"
                  d="M290 0 L480 0"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                />

                <g transform="translate(520,0)">
                  <circle
                    cx="0"
                    cy="0"
                    r="20"
                    fill="#10b981"
                    filter="url(#glow)"
                  />
                  <text
                    x="0"
                    y="6"
                    textAnchor="middle"
                    fontSize="14"
                    fill="#08200a"
                  >
                    ✅
                  </text>
                </g>
              </g>
            </svg>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <div className="text-slate-400 text-sm">Flow:</div>
            <div className="inline-flex items-center gap-2 text-white">
              <span>📝 Add</span>
              <span className="text-clinic-400">→</span>
              <span>📣 Call</span>
              <span className="text-clinic-400">→</span>
              <span>✅ Done</span>
            </div>
          </div>
        </div>

        <div className="h-64 md:h-48 w-full bg-gradient-to-t from-clinic-700/40 to-clinic-800/20 rounded-xl flex items-center justify-center">
          <Suspense
            fallback={<div className="text-slate-400">Loading 3D...</div>}
          >
            <Canvas
              style={{ height: "100%", width: "100%" }}
              camera={{ position: [0, 0, 5] }}
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} />
              <RotatingBox />
              <OrbitControls enablePan={false} enableZoom={false} />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </section>
  );
}
