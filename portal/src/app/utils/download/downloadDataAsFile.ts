// Create a download  anchor element to "point" to it when downloading data as file
export const downloadAnchor: HTMLAnchorElement = document.createElement('a');
downloadAnchor.style.visibility = 'hidden';

export function downloadDataAsFile(fileName: string, data: Blob|string): void {
  // Create a URL for the blob
  const url: string = URL.createObjectURL(data as unknown as Blob);
  // Create an anchor element to "point" to it
  downloadAnchor.href = url;
  // Set the suggested filename for the file
  downloadAnchor.download = fileName;
  // Simulate a click on our anchor element
  downloadAnchor.click();
  // Discard the object data
  URL.revokeObjectURL(url);
}
