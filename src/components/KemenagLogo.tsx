import React, { useState } from "react";

interface KemenagLogoProps {
  className?: string;
  size?: number;
}

export default function KemenagLogo({ className = "", size = 80 }: KemenagLogoProps) {
  // Use the highly reliable googleusercontent format as primary, with drive share and wikimedia fallback
  const firstUrl = "https://lh3.googleusercontent.com/d/1whCAbp5Yb_KgWzGHVV1WRa9tvut6nv3c";
  const secondUrl = "https://drive.google.com/uc?export=view&id=1whCAbp5Yb_KgWzGHVV1WRa9tvut6nv3c";
  const thirdUrl = "https://upload.wikimedia.org/wikipedia/commons/f/f6/Logo_Departemen_Agama_Republik_Indonesia.png";

  const [imgSrc, setImgSrc] = useState(firstUrl);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (imgSrc === firstUrl) {
      setImgSrc(secondUrl);
    } else if (imgSrc === secondUrl) {
      setImgSrc(thirdUrl);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {!hasError ? (
        <img
          src={imgSrc}
          alt="Logo Kementerian Agama"
          width={size}
          height={size}
          className="transition-transform duration-300 hover:scale-105 select-none"
          style={{ objectFit: "contain" }}
          referrerPolicy="no-referrer"
          onError={handleError}
        />
      ) : (
        <div 
          className="bg-green-700 rounded-full flex items-center justify-center text-white"
          style={{ width: size, height: size }}
        >
          <span className="text-[10px] font-bold">KEMENAG</span>
        </div>
      )}
    </div>
  );
}

