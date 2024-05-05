import React from 'react';
import { useRecordContext } from 'react-admin';

const DownloadField = ({ source, label }) => {
  const record = useRecordContext();
  const fileUrl = record[source];
  if (!fileUrl) return <div>{label}: No file</div>;

  return (
    <div className="m-6">
      <a
        href={fileUrl}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 "
        target="_blank"
        rel="noreferrer"
      >
        {label}
      </a>
    </div>
  );
};

export default DownloadField;
