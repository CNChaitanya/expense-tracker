import React, { useState } from 'react';
import { Wallet, Mail, Lock, Phone, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuroraBackground } from '../components/visual/AuroraBackground';
import { playSound } from '../lib/sounds';

export const Login: React.FC = () => {
  const [method, setStep] = useState<'options' | 'email' | 'phone' | 'otp'>('options');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const simulateLogin = (user: any) => {
    setLoading(true);
    playSound('success');
    setTimeout(() => {
      localStorage.setItem('exp-auth-user', JSON.stringify(user));
      window.location.href = '/';
    }, 1500);
  };

  const handleGoogleLogin = () => {
    simulateLogin({ name: "Google User", email: "user@gmail.com", avatar: "G" });
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password.length >= 6) {
      simulateLogin({ name: email.split('@')[0], email, avatar: email[0].toUpperCase() });
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setStep('otp');
      playSound('add');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
    if (newOtp.every(d => d !== '')) {
      simulateLogin({ name: `User ${phone}`, email: `${phone}@phone.com`, avatar: "#" });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden bg-[#030712]">
      <AuroraBackground />
      
      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="glass w-full max-w-md p-10 space-y-10 relative z-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
      >
        <div className="text-center space-y-4">
           <motion.div 
             animate={{ rotate: [0, 10, -10, 0] }}
             transition={{ duration: 5, repeat: Infinity }}
             className="w-20 h-20 bg-gradient-to-br from-primary-start to-primary-end rounded-[24px] flex items-center justify-center text-white mx-auto shadow-2xl shadow-primary-start/40"
           >
              <Wallet size={40} strokeWidth={2.5} />
           </motion.div>
           <div>
              <h1 className="text-4xl font-black tracking-tight text-gradient">ExpTracker</h1>
              <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-2">Your money, beautifully tracked</p>
           </div>
        </div>

        <AnimatePresence mode="wait">
          {method === 'options' && (
            <motion.div 
              key="options"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              <button 
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-4 bg-white text-black font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-gray-100 transition-all shadow-xl shadow-white/5 active:scale-95 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.18 1-.72 1.85-1.55 2.43v2.01h2.51c1.48-1.37 2.33-3.39 2.33-5.45z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.01c-.99.66-2.26 1.05-3.72 1.05-2.86 0-5.29-1.93-6.16-4.53H3.18v2.13C5.01 20.59 8.27 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.85c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V8.54H3.18C2.42 10.03 2 11.72 2 13.5s.42 3.47 1.18 4.96l2.66-2.13z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 8.27 1 5.01 3.41 3.18 7.04l2.66 2.13c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 py-2">
                 <div className="h-px flex-1 bg-white/10" />
                 <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">or use</span>
                 <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setStep('email')} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                    <Mail className="text-primary-start" />
                    <span className="text-xs font-bold">Email</span>
                 </button>
                 <button onClick={() => setStep('phone')} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all">
                    <Phone className="text-emerald-500" />
                    <span className="text-xs font-bold">Phone</span>
                 </button>
              </div>
            </motion.div>
          )}

          {method === 'email' && (
            <motion.form 
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleEmailLogin}
              className="space-y-6"
            >
              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative">
                       <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                       <input 
                         type="email" 
                         required 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 font-bold outline-none focus:border-primary-start transition-all"
                         placeholder="name@example.com"
                         value={email}
                         onChange={e => setEmail(e.target.value)}
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
                    <div className="relative">
                       <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                       <input 
                         type={showPassword ? "text" : "password"} 
                         required 
                         className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 font-bold outline-none focus:border-primary-start transition-all"
                         placeholder="••••••••"
                         value={password}
                         onChange={e => setPassword(e.target.value)}
                       />
                       <button 
                         type="button" 
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                       >
                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-primary-start to-primary-end text-white font-black rounded-2xl shadow-xl shadow-primary-start/20 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
              </button>

              <button type="button" onClick={() => setStep('options')} className="w-full text-center text-xs font-bold text-gray-500 hover:text-white transition-colors">Back to options</button>
            </motion.form>
          )}

          {method === 'phone' && (
            <motion.form 
              key="phone"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handlePhoneSubmit}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-500">+91</span>
                   <input 
                     type="tel" 
                     required 
                     pattern="[0-9]{10}"
                     className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-4 py-4 font-bold text-lg outline-none focus:border-emerald-500 transition-all tabular-nums"
                     placeholder="9876543210"
                     value={phone}
                     onChange={e => setPhone(e.target.value)}
                   />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                Send OTP <ArrowRight size={18} />
              </button>

              <button type="button" onClick={() => setStep('options')} className="w-full text-center text-xs font-bold text-gray-500 hover:text-white transition-colors">Back to options</button>
            </motion.form>
          )}

          {method === 'otp' && (
            <motion.div 
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                 <p className="text-sm text-gray-400">Enter the 6-digit code sent to</p>
                 <p className="font-black text-white">+91 {phone}</p>
              </div>

              <div className="flex justify-between gap-2">
                 {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-${i}`}
                      type="text"
                      maxLength={1}
                      className="w-12 h-16 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-black outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all tabular-nums"
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                    />
                 ))}
              </div>

              <div className="text-center space-y-4">
                 <button className="text-xs font-bold text-primary-start hover:underline">Resend code in 0:59</button>
                 <button onClick={() => setStep('phone')} className="block w-full text-center text-xs font-bold text-gray-500 hover:text-white transition-colors">Change phone number</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-relaxed">
              By continuing, you agree to our <br />
              <span className="text-gray-500 hover:text-white cursor-pointer transition-colors underline">Terms of Service</span> and <span className="text-gray-500 hover:text-white cursor-pointer transition-colors underline">Privacy Policy</span>
           </p>
        </div>
      </motion.div>
    </div>
  );
};
