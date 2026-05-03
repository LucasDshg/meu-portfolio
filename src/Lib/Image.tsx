import React from 'react';

interface IImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string; // Tornamos obrigatório para garantir acessibilidade
}

export const Image: React.FC<IImageProps> = ({
  alt,
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  return <img alt={alt} loading={loading} decoding={decoding} {...props} />;
};
