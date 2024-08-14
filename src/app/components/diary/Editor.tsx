import { String } from 'aws-sdk/clients/cloudwatchevents';
import { Dispatch, SetStateAction, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface EditorProps {
  value: String;
  onChange: Dispatch<SetStateAction<string>>;
}

export default function Editor({ value, onChange }: EditorProps) {
  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6] }],
        ['bold', 'italic', 'underline', 'strike'],
        ['link', 'image'],
      ],
    },
  };

  useEffect(() => {
    const preview = document.getElementById('preview');
    if (preview) {
      preview.innerHTML = value;
    }
  }, [value]);

  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      value={value}
      onChange={onChange}
    />
  );
}
