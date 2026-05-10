import React, { useEffect } from 'react';

interface IAdUnitProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: 'true' | 'false';
  className?: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const AdUnit: React.FC<IAdUnitProps> = ({
  slot,
  format = 'auto',
  responsive = 'false',
  className = '',
}) => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('Erro ao carregar anúncio do AdSense:', error);
    }
  }, [slot]);

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4598431210851382"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      ></ins>
    </div>
  );
};
