export const getMaxLengthMessage = (maxLength: number): string => {
    return `Length must not exceed ${maxLength}`
  }
  
export const getMustNotBeNull = (name: string): string => {
    return `${name} must not be null`
  }
export const formatUnixTimestamp = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const svgToDataURL = (svg) => {
  const svgString = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};