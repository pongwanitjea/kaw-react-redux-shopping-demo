import React, { useEffect, useState } from 'react';
import { useFetchImageQuery } from '../../slices/imageSlice';
interface ImageProps {
  assetId: string;
  alt: string;
}

export const ImageStock: React.FC<ImageProps> = ({ assetId, alt }) => {
  const { data: imageUrl, isLoading, isError } = useFetchImageQuery(assetId);

  // useEffect(() => {
  //   return () => {
  //     if (imageUrl) {
  //       URL.revokeObjectURL(imageUrl);
  //     }
  //   };
  // }, [imageUrl]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading image</div>;

  return <img src={imageUrl} alt={alt} />;
};