'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useState, useEffect, useCallback } from 'react'; 

import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Blockquote from '@tiptap/extension-blockquote';
import CodeBlock from '@tiptap/extension-code-block';
import Strike from '@tiptap/extension-strike'; 
import '@/styles/textEditor.css';

interface TextEditorProps {
  value: string;
  onChange: (html: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [editorStateVersion, setEditorStateVersion] = useState(0); 

  if (!editor) {
    return null;
  }
  
  const getButtonClass = (isActive: boolean) =>
    `px-2 py-1 text-sm rounded transition-colors duration-150 ` +
    (isActive
      ? `bg-[white] text-black border border-[white] font-bold` 
      : `bg-[--color-surface] text-neutral-100 border border-[--color-border] font-normal hover:bg-neutral-800` 
    );
    
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return; 
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);
    
  useEffect(() => {
    const handleTransaction = () => {
        setEditorStateVersion(prev => prev + 1);
    };

    editor.on('transaction', handleTransaction);
    handleTransaction(); 

    return () => {
        editor.off('transaction', handleTransaction);
    };
  }, [editor]);


  return (
    <div className="flex flex-wrap gap-2 p-2 border-b-2 border-[--color-border] bg-[--color-surface] rounded-t-lg">
      
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={getButtonClass(editor.isActive('bold'))}>Bold</button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={getButtonClass(editor.isActive('italic'))}>Italic</button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={getButtonClass(editor.isActive('strike'))}>Strike</button>
      
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={getButtonClass(editor.isActive('heading', { level: 2 }))}>H2</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={getButtonClass(editor.isActive('heading', { level: 3 }))}>H3</button>
      
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={getButtonClass(editor.isActive('bulletList'))}>• List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={getButtonClass(editor.isActive('orderedList'))}>1. List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={getButtonClass(editor.isActive('blockquote'))}>Quote</button>
      <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={getButtonClass(editor.isActive('codeBlock'))}>Code Block</button>
      
      <button type="button" onClick={setLink} className={getButtonClass(editor.isActive('link'))}>Link</button>
      <button type="button" onClick={addImage} className={getButtonClass(editor.isActive('image'))}>Image</button>
      
      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={getButtonClass(false)}>Undo</button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={getButtonClass(false)}>Redo</button>
    </div>
  );
};

export default function TextEditor({ value, onChange }: TextEditorProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        codeBlock: false, 
        blockquote: false, 
      }), 
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true }),
      Blockquote,
      CodeBlock,
      Strike, 
    ],
    immediatelyRender: false, 
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `min-h-[300px] max-w-none p-4 focus:outline-none bg-[--color-surface] text-neutral-100 border-x-2 border-b-2 border-[--color-border] rounded-b-lg font-['var(--font-body)']`,
      },
    },
  }, [mounted]); 

  if (!mounted || !editor) {
    return <div className="min-h-[300px] p-4 bg-[--color-surface] rounded-lg border-2 border-[--color-border] text-neutral-400">Loading editor...</div>;
  }

  return (
    <div className="editor-content w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}