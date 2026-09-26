import React, { useState } from 'react';
import {
  HelpCircle,
  PhoneCall,
  Mail,
  FileText,
  AlertOctagon,
  Satellite,
  Radio,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Send,
  CheckCircle2
} from 'lucide-react';

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [supportMessageSent, setSupportMessageSent] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportText, setSupportText] = useState('');

  const faqs = [
    {
      q: "How does the LoRa → Satellite → Ground Station uplink operate without cellular coverage?",
      a: "Off-grid SOS nodes transmit chirp spread-spectrum (CSS) packets on 434 MHz / 868 MHz. Low Earth Orbit (LEO) satellites equipped with software-defined radio payloads receive these uplinks during overhead passes and relay them directly down to connected ground station receivers."
    },
    {
      q: "What is the expected alert latency from device trigger to operator dashboard?",
      a: "Depending on satellite pass elevation and mesh relay routing, standard latency ranges from 120 milliseconds (direct downlink) to 3 minutes (store-and-forward satellite orbit)."
    },
    {
      q: "How does the AES-256-GCM Cryptographic Verification protect SOS transmissions?",
      a: "Each 30-byte plaintext SOS packet is encrypted using AES-256 in Galois/Counter Mode (GCM) with a 12-byte IV and 16-byte Authentication Tag inside a 64-byte radio frame. The receiver verifies both integrity and authenticity before dispatching teams."
    },
    {
      q: "What do the different map marker colors represent?",
      a: "🔴 Red: Pending emergency alert requiring immediate acknowledgment. 🟠 Orange: Acknowledged by dispatch operator. 🟡 Yellow: Rescue team dispatched and en route. 🟢 Green: Rescue operation completed and resolved."
    }
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl select-none">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20 bg-gradient-to-r from-slate-950 via-[#061226] to-slate-950">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              MISSION PROTOCOLS & DOCUMENTATION
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-wide text-slate-100 uppercase mt-1">
            OPERATIONS MANUAL & SUPPORT
          </h1>
          <p className="text-xs sm:text-sm font-mono text-slate-400 mt-1">
            Mission protocols, emergency escalation contacts, and SDR hardware pipeline documentation.
          </p>
        </div>

        <button
          onClick={() => setShowSupportModal(true)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs uppercase shadow-glow-cyan flex items-center gap-2 transition"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Contact Support</span>
        </button>
      </div>

      {/* Emergency Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-950/20 to-slate-950/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <PhoneCall className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-100 uppercase">
                NATIONAL DISPATCH HOTLINE
              </h2>
              <p className="text-xs font-mono text-rose-400">24/7 Priority Emergency Line</p>
            </div>
          </div>
          <div className="text-2xl font-mono font-bold text-slate-100">
            112 / +91 (080) 9988-7711
          </div>
          <p className="text-xs font-mono text-slate-400">
            For critical life-safety escalations, military air rescue, or maritime coast guard coordination.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 to-slate-950/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-100 uppercase">
                SDR & GROUND STATION SUPPORT
              </h2>
              <p className="text-xs font-mono text-cyan-400">Engineering & SDR Mesh Desk</p>
            </div>
          </div>
          <div className="text-lg font-mono font-bold text-slate-100">
            support@offgrid-sos.org
          </div>
          <p className="text-xs font-mono text-slate-400">
            Assistance with demodulation algorithms, bladeRF 2.0 micro xA4 setup, and LoRa SX1278 configurations.
          </p>
        </div>
      </div>

      {/* System Architecture Flow Guide */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-4 bg-slate-950/70">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Satellite className="w-5 h-5 text-cyan-400" />
          <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
            MISSION DISPATCH LIFECYCLE
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-rose-400 font-bold mb-1">1. SOS TRIGGER</div>
            <p className="text-[11px] text-slate-400">ESP32 + LoRa radio broadcasts 64-byte frame</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-cyan-400 font-bold mb-1">2. SATELLITE RELAY</div>
            <p className="text-[11px] text-slate-400">LEO satellite receives uplink and downlinks</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-cyan-300 font-bold mb-1">3. SDR DEMOD</div>
            <p className="text-[11px] text-slate-400">bladeRF recovers packet & decrypts AES-256-GCM</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-amber-400 font-bold mb-1">4. ACK & DISPATCH</div>
            <p className="text-[11px] text-slate-400">Operator assigns rapid rescue unit with ETA</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-emerald-400 font-bold mb-1">5. RESOLVED</div>
            <p className="text-[11px] text-slate-400">Mission marked complete & logged in audit ledger</p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-4 bg-slate-950/70">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h2 className="font-display font-bold text-base text-slate-100 uppercase tracking-wider">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-mono font-bold text-slate-200 hover:text-cyan-300 transition"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs font-mono text-slate-400 border-t border-slate-800/80 leading-relaxed bg-slate-950/40">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-[#091222] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-display font-bold text-slate-100 uppercase tracking-wider">
              CONTACT MISSION SUPPORT
            </h3>
            <p className="text-xs font-mono text-slate-400">
              Submit a high-priority ticket directly to ground station engineering.
            </p>
            
            {supportMessageSent ? (
              <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Ticket #SAR-9821 created. Engineering team notified.</span>
              </div>
            ) : (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">INCIDENT / SYSTEM NOTE</label>
                  <textarea
                    rows={4}
                    value={supportText}
                    onChange={(e) => setSupportText(e.target.value)}
                    placeholder="Describe technical issue, SDR frequency misalignment, or hardware fault..."
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowSupportModal(false);
                  setSupportMessageSent(false);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs"
              >
                Close
              </button>
              {!supportMessageSent && (
                <button
                  onClick={() => {
                    if (!supportText.trim()) return;
                    setSupportMessageSent(true);
                    setTimeout(() => {
                      setShowSupportModal(false);
                      setSupportMessageSent(false);
                      setSupportText('');
                    }, 2000);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-mono font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Ticket</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

