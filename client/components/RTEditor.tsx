import React, { FC } from 'react'
import dynamic from "next/dynamic";
import { EditorProps } from "react-draft-wysiwyg";

const Editor = dynamic<EditorProps>(
    () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
    { ssr: false }
  );
  

export const RTEditor:FC = () => {
  return (
    <Editor />
  )
}
