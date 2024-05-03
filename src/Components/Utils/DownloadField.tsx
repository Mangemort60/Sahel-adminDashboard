import React from 'react';
import { useRecordContext } from 'react-admin';

const DownloadField = ({ source, label }) => {
  const record = useRecordContext();
  const fileUrl = record[source];
  if (!fileUrl) return <div>{label}: No file</div>;

  return (
    <div>
      {label}:{' '}
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        Download
      </a>
    </div>
  );
};

export default DownloadField;
