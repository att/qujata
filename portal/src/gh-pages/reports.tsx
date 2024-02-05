// import React, { useState, useEffect } from 'react';
// interface Report {
//     cpu: string;
//     revision: number;
//     status: string;
// }
// export const Reports: React.FC = () => {

    
//   const [data, setData] = useState<Report[]>([]);
//   useEffect(() => {
//     fetch('https://api.github.com/repos/open-quantum-safe/profiling/contents/perf/aws')
//       .then(response => response.json())
//       .then((files: { name: string; download_url: string }[]) => {
//         return Promise.all(
//           files.map(file =>
//             fetch(file.download_url)
//               .then(response => response.json())
//               .then(json => ({
//                 cpu: json.cpu,
//                 revision: json.revision,
//                 status: json.status,
//               }))
//               .catch(err => console.error(err))
//           )
//         );
//       })
//       .then(jsonArray => setData(jsonArray as Report[]))
//       .catch(err => console.error(err));
//   }, []);
//   return (
//     <pre>
//       {JSON.stringify(data, null, 2)}
//     </pre>
//   );
// };

// import React, { useState, useEffect, ChangeEvent } from "react";
// import axios from "axios";
// interface File {
//   path: string;
//   name: string;
// }
// export const Reports: React.FC = () => {
//   const [files, setFiles] = useState<File[]>([]);
//   const [selectedFile, setSelectedFile] = useState<string | null>(null);
//   const [fileContent, setFileContent] = useState<string>("");
//   useEffect(() => {
//     // const apiUrl = `https://api.github.com/repos/att/qujata/contents/reports?ref=static-web-page/US63/conditional-main-page`;
//     const apiUrl = `https://api.github.com/repos/open-quantum-safe/profiling/contents/perf/aws`;
//     axios.get<File[]>(apiUrl)
//       .then(response => {
//         setFiles(response.data);
//       })
//       .catch(error => console.error("Error fetching files: ", error));
//   }, []);
//   const handleFileChange = (e: ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedFile(value);
//     axios.get(`https://api.github.com/repos/att/qujata/contents/${e.target.value}`)
//       .then(response => {
//         const fileContent = atob(response.data.content); // Decode the base64 content
//         setFileContent(fileContent);
//       })
//       .catch(error => console.error("Error fetching file content: ", error));
//   };
//   return (
//     <div><select onChange={handleFileChange}>
//         {files.map((file, index) => (
//           <option key={index} value={file.path}>
//             {file.name}
//           </option>
//         ))}
//       </select><div>
//         {fileContent}
//       </div></div>
//   );
// }


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
    const apiUrl = 'https://api.github.com/repos/att/qujata/contents/reports?ref=static-web-page/US63/conditional-main-page';
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setFiles(data);
      })
      .catch(error => console.error("Error fetching files: ", error));
  }, []);
  const handleFileChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedFile(value);
    fetch(`https://raw.githubusercontent.com/att/qujata/static-web-page/US63/conditional-main-page/${value}`)
      .then(response => response.json())
      .then(data => {
        const fileContent = JSON.stringify(data, null, 2); // Decode the base64 content
        setFileContent(fileContent);
      })
      .catch(error => console.error("Error fetching file content: ", error));
  };
  return (
    <div><select onChange={handleFileChange}>
        {files.map((file, index) => (
          <option key={index} value={file.path}>
            {file.name}
          </option>
        ))}
      </select><div>
        {fileContent}
      </div></div>
  );
}
