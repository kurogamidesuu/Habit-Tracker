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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[400px] bg-sky-800 border-2 border-amber-400 p-4 rounded-xl shadow-lg flex items-center justify-between gap-2 z-50 text-sky-50">
      <div>
        <h3 className="font-bold text-amber-400">Install Kintsugi</h3>
        <p className="text-sm">Add to home screen for quick access!</p>
      </div>
      <button
        onClick={promptInstall}
        className="bg-amber-400 text-sky-950 px-4 py-2 rounded-md font-bold hover:bg-amber-300 transition-colors cursor-pointer"
      >
        Install
      </button>
      <button
        onClick={handleDismiss}
        className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer font-bold px-2 py-1 text-lg"
        aria-label="Close banner"
      >
        <AiOutlineCloseCircle />
      </button>
    </div>
  )
}

export default InstallBanner