'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';

interface TextEditorProps {
  onChange: (value: string) => void;
  value: string;
  disabled: boolean;
}

export const TextEditor = ({ disabled, onChange, value }: TextEditorProps) => {
  const ReactQuill = useMemo(
    () =>
      dynamic(
        async () => {
          const { default: ReactQuill } = await import('react-quill');
          const Quill = ReactQuill.Quill || (await import('quill')).default;

          const Link = Quill.import('formats/link');
          Link.sanitize = function (url: string) {
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
              return `http://${url}`;
            }

            return url;
          };

          return ReactQuill;
        },
        { ssr: false },
      ),
    [],
  );
  return (
    <div className="bg-background">
      <ReactQuill className="custom-ql" readOnly={disabled} theme="snow" value={value} onChange={onChange} />
    </div>
  );
};
