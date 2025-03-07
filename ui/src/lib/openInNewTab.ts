export const openInNewTab = (url: string, ipfsGateway: string) => {
  // Ensure the URL is absolute
  const fullUrl =
    url.startsWith("http://") || url.startsWith("https://")
      ? url
      : url.startsWith("ipfs")
      ? `${ipfsGateway}/${url.slice(7)}`
      : `https://${url}`;

  const newWindow = window.open(fullUrl, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};
