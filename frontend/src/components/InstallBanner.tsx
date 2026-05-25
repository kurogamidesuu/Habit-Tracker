import { useState } from "react";
import { AiOutlineCloseCircle } from 'react-icons/ai';

interface InstallBannerProps {
  isInstallable: boolean;
  promptInstall: () => Promise<void>;
}

const InstallBanner = ({ isInstallable, promptInstall }: InstallBannerProps) => {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('install-banner-dismissed') === 'true';
  });

  const handleDismiss = () => {
    localStorage.setItem('install-banner-dismissed', 'true');
    setIsDismissed(true);
  }

  if (!isInstallable || isDismissed) {
    return null;
  }

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-sky-900/90 backdrop-blur-xl border border-sky-700/60 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-4 z-50 overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500" />

      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-sm font-bold text-sky-50 tracking-wide">Install Kintsugi</h3>
        <p className="text-[11px] text-sky-300/80 mt-0.5">Add to home screen for native access.</p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={promptInstall}
          className="bg-amber-400/10 border border-amber-400/30 text-amber-400 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-400/20 hover:text-amber-300 transition-colors shadow-sm"
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="text-sky-400/60 hover:text-sky-300 transition-colors p-1"
          aria-label="Close banner"
        >
          <AiOutlineCloseCircle className="text-[22px]" />
        </button>
      </div>
    </div>
  )
}

export default InstallBanner