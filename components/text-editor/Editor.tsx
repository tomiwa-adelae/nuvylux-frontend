"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import { Menubar } from "./Menubar";
import { useEffect } from "react";

// export function RichTextEditor({ field }: { field: any }) {
//   const editor = useEditor({
//     extensions: [
//       StarterKit,
//       TextAlign.configure({ types: ["heading", "paragraph"] }),
//     ],

//     editorProps: {
//       attributes: {
//         class:
//           "min-h-[300px] focus:outline-none p-4 props prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
//       },
//     },

//     onUpdate: ({ editor }) => {
//       field.onChange(JSON.stringify(editor.getJSON()));
//     },

//     content: field.value ? JSON.parse(field.value) : "",

//     immediatelyRender: false,
//   });

//   useEffect(() => {
//     if (editor && field.value) {
//       editor.commands.setContent(JSON.parse(field.value));
//     }
//   }, [editor, field.value]);

//   return (
//     <div className="border w-full border-input rounded-md overflow-hidden dark:bg-input/30">
//       <Menubar editor={editor} />
//       <EditorContent editor={editor} />
//     </div>
//   );
// }

export function RichTextEditor({ field }: { field: any }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 prose-sm sm:prose lg:prose-lg dark:prose-invert",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && field.value) {
      editor.commands.setContent(JSON.parse(field.value));
    }
  }, [editor, field.value]);

  return (
    <div className="border rounded-md overflow-hidden">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
