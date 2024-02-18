import React, { useState, useEffect, ChangeEvent } from "react";
interface File {
  path: string;
  name: string;
}
export const Reports: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  useEffect(() => {
    const apiUrl = 'https://api.github.com/repos/att/qujata/contents/reports?ref=main';
    fetch(apiUrl)
      .then(response => response.json())
      .then((data: File[]) => {
        setFiles(data);
        if (data[0]) { // Check if there are any files
          setSelectedFile(data[0].path); // Set the first file as the default selected file
        }
      })
      .catch(error => console.error("Error fetching files: ", error));
  }, []);
  useEffect(() => {
    if (selectedFile) {
    fetch(`https://raw.githubusercontent.com/att/qujata/main/${selectedFile}`)
        .then(response => response.json())
        .then((data: any) => {
          const fileContent = JSON.stringify(data, null, 2); // Decode the base64 content
          setFileContent(fileContent);
        })
        .catch(error => console.error("Error fetching file content: ", error));
    }
  }, [selectedFile]); // This useEffect hook is dependent on selectedFile
  const handleFileChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedFile(value);
  };
  return (
    <div><select value={selectedFile || ''} onChange={handleFileChange}>
    {files.map((file, index) => (
      <option key={index} value={file.path}>
        {file.name}
      </option>
    ))}
  </select><br/><br/><pre>
    {fileContent}
  </pre></div>
  );
}