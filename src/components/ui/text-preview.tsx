'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.bubble.css';

interface TextPreviewProps {
  value: string;
}

export const TextPreview = ({ value }: TextPreviewProps) => {
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
  return <ReactQuill theme="bubble" value={value} readOnly />;
};
