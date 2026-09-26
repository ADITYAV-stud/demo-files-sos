import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Phone, KeyRound, CheckCircle2, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import Globe3D from '../components/Globe3D';
import { useDispatch } from '../context/DispatchContext';
import { playBeep, playSuccessChime } from '../utils/soundFx';

export default function LoginPage() {
  const { handleLogin, soundEnabled } = useDispatch();

  // Login form state
  const [username, setUsername] = useState('karthik.ops');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password modal state (1 to 5)
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [otp, setOtp] = useState(['4', '8', '2', '9', '1', '0']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');

  const onLoginSubmit = (e) => {
    e.preventDefault();
    if (soundEnabled) playBeep(900, 0.1);
    handleLogin();
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleForgotNext = () => {
    setResetError('');
    if (forgotStep === 1) {
      if (!phoneNumber.trim()) {
        setResetError('Please enter a valid authorized emergency phone number');
        return;
      }
      setForgotStep(2);
    } else if (forgotStep === 2) {
      if (otp.some(d => !d)) {
        setResetError('Please enter complete 6-digit OTP');
        return;
      }
      setForgotStep(3);
    } else if (forgotStep === 3) {
      if (!newPassword || newPassword.length < 6) {
        setResetError('Password must be at least 6 characters');
        return;
      }
      setForgotStep(4);
    } else if (forgotStep === 4) {
      if (newPassword !== confirmPassword) {
        setResetError('Passwords do not match');
        return;
      }
      setForgotStep(5);
      if (soundEnabled) playSuccessChime();
    }
  };

  const resetForgotFlow = () => {
    setShowForgotModal(false);
    setForgotStep(1);
    setResetError('');
  };

  return (
    <div className="min-h-screen w-full bg-[#040812] text-slate-100 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden select-none">
      {/* Background Starfield and Atmospheric Radiance */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(0,180,216,0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,rgba(0,255,102,0.08),transparent_60%)] pointer-events-none" />

      {/* Main Split Screen Container */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl glass-panel border border-cyan-500/30 shadow-2xl overflow-hidden backdrop-blur-xl relative">
        
        {/* Left Side: 3D Earth Globe & Orbiting Satellite */}
        <div className="lg:col-span-6 bg-gradient-to-b from-[#061224] via-[#040C1A] to-[#02060F] p-8 flex flex-col justify-between items-center border-b lg:border-b-0 lg:border-r border-cyan-500/20 relative min-h-[440px] lg:min-h-[580px]">
          {/* Top Label */}
          <div className="w-full flex items-center justify-between text-xs font-mono text-cyan-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              SATELLITE DOWNLINK: ACTIVE
            </span>
            <span>LEO-SAR-42 ORBIT</span>
          </div>

          {/* 3D Canvas Globe */}
          <div className="w-full flex-1 flex items-center justify-center py-4">
            <Globe3D className="w-full" />
          </div>

          {/* Footer Metadata */}
          <div className="w-full text-center text-[11px] font-mono text-slate-400 pt-2 border-t border-cyan-500/10">
            SECURE QUANTUM-RESISTANT EMERGENCY MESH • FREQ 868.100 MHz
          </div>
        </div>

        {/* Right Side: Login Form & Heading */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-[#070F1E]/90 relative">
          
          {/* Main Title & Subtitle */}
          <div className="mb-8">
            <div className="inline-block px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
              EMERGENCY RESCUE CONSOLE v2.4
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-wider text-slate-100 uppercase">
              OFF-GRID SOS
            </h1>
            <p className="text-sm font-mono text-cyan-400 tracking-wide mt-1">
              Rescue Dispatch System
            </p>
          </div>

          {/* Login Form (Blurred when Forgot Password modal is open) */}
          <form
            onSubmit={onLoginSubmit}
            className={`space-y-5 transition-all duration-300 ${
              showForgotModal ? 'filter blur-md pointer-events-none opacity-40' : ''
            }`}
          >
            {/* Username Input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-2">
                Operator Username / Call Sign
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. karthik.ops"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 text-sm font-mono placeholder:text-slate-600 outline-none transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 hover:underline transition"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-cyan-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 text-sm font-mono placeholder:text-slate-600 outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-cyan-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-700 hover:from-blue-500 hover:to-cyan-500 text-white font-display font-bold tracking-wider text-base uppercase shadow-glow-cyan transition duration-200 flex items-center justify-center gap-2 group mt-6"
            >
              <span>ACCESS RESCUE CONSOLE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Demo Notice */}
            <div className="text-center pt-2">
              <span className="text-[11px] font-mono text-slate-400">
                Authorized Personnel Only • Ready for Satellite Telemetry Ingest
              </span>
            </div>
          </form>

          {/* FORGOT PASSWORD GLASSMORPHISM MODAL OVERLAY (Steps 1 to 5) */}
          {showForgotModal && (
            <div className="absolute inset-0 z-30 p-6 sm:p-10 flex flex-col justify-center rounded-3xl bg-[#030914]/85 backdrop-blur-2xl border border-cyan-500/40 shadow-2xl animate-in fade-in">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6 border-b border-cyan-500/20 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-100 tracking-wider">
                      RECOVERY VERIFICATION
                    </h3>
                    <p className="text-[11px] font-mono text-cyan-400">
                      Step {forgotStep} of 5: {
                        forgotStep === 1 ? 'Authorized Phone Number' :
                        forgotStep === 2 ? '6-Digit OTP Challenge' :
                        forgotStep === 3 ? 'Set New Password' :
                        forgotStep === 4 ? 'Confirm Security Credentials' :
                        'Password Reset Complete'
                      }
                    </p>
                  </div>
                </div>
                {forgotStep !== 5 && (
                  <button
                    onClick={resetForgotFlow}
                    className="text-xs font-mono text-slate-400 hover:text-slate-100 px-2.5 py-1 rounded bg-slate-900 border border-slate-700"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Error Message if any */}
              {resetError && (
                <div className="mb-4 p-2.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                  <span>{resetError}</span>
                </div>
              )}

              {/* Step 1: Phone Number */}
              {forgotStep === 1 && (
                <div className="space-y-4">
                  <p className="text-xs font-mono text-slate-300">
                    Enter the emergency dispatch mobile phone number registered with this station callsign:
                  </p>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-slate-100 text-sm font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={handleForgotNext}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-mono font-bold text-xs uppercase shadow-md hover:from-blue-500 hover:to-cyan-500 transition"
                  >
                    Send Verification Code (SMS)
                  </button>
                </div>
              )}

              {/* Step 2: OTP Verification */}
              {forgotStep === 2 && (
                <div className="space-y-4">
                  <p className="text-xs font-mono text-slate-300">
                    Enter the 6-digit security code transmitted to <strong className="text-cyan-300">{phoneNumber}</strong>:
                  </p>
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`otp-input-${idx}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        className="w-11 h-12 text-center rounded-xl bg-slate-950 border border-cyan-500/50 text-cyan-300 text-lg font-mono font-bold focus:border-cyan-300 focus:ring-1 focus:ring-cyan-300 outline-none"
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Code expires in 02:45</span>
                    <button
                      onClick={() => setOtp(['3', '9', '1', '7', '4', '2'])}
                      className="text-cyan-400 hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setForgotStep(1)}
                      className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      onClick={handleForgotNext}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-mono font-bold text-xs uppercase shadow-md hover:from-blue-500 hover:to-cyan-500 transition"
                    >
                      Verify OTP Code
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: New Password */}
              {forgotStep === 3 && (
                <div className="space-y-4">
                  <p className="text-xs font-mono text-slate-300">
                    Create a strong new password for Operator Access:
                  </p>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-slate-100 text-sm font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={handleForgotNext}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-mono font-bold text-xs uppercase shadow-md transition"
                  >
                    Proceed to Confirm Password
                  </button>
                </div>
              )}

              {/* Step 4: Confirm Password */}
              {forgotStep === 4 && (
                <div className="space-y-4">
                  <p className="text-xs font-mono text-slate-300">
                    Re-enter your new password to verify:
                  </p>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-cyan-500/40 text-slate-100 text-sm font-mono outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setForgotStep(3)}
                      className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                      onClick={handleForgotNext}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-mono font-bold text-xs uppercase shadow-glow-green transition"
                    >
                      Finalize Reset
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Password Reset Successful */}
              {forgotStep === 5 && (
                <div className="text-center space-y-4 py-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 shadow-glow-green">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="font-display font-bold text-xl text-slate-100 tracking-wider">
                    PASSWORD RESET SUCCESSFUL
                  </h4>
                  <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">
                    Your rescue credentials have been updated in the ground station auth ledger. You may now login.
                  </p>
                  <button
                    onClick={resetForgotFlow}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-display font-bold tracking-wider text-sm uppercase shadow-lg transition hover:scale-[1.02]"
                  >
                    RETURN TO SECURE LOGIN
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
