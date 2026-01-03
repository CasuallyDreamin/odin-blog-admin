import React from 'react';
import { vi } from 'vitest';
    
vi.mock('@tiptap/react', () => {
  return {
    useEditor: ({ content, onUpdate }: any) => {
      return {
        getHTML: () => content,
        chain: () => ({
          focus: () => ({
            toggleBold: () => ({ run: vi.fn() }),
            toggleItalic: () => ({ run: vi.fn() }),
            toggleStrike: () => ({ run: vi.fn() }),
            toggleHeading: () => ({ run: vi.fn() }),
            toggleBulletList: () => ({ run: vi.fn() }),
            toggleOrderedList: () => ({ run: vi.fn() }),
            toggleBlockquote: () => ({ run: vi.fn() }),
            toggleCodeBlock: () => ({ run: vi.fn() }),
            setImage: () => ({ run: vi.fn() }),
            setLink: () => ({ run: vi.fn() }),
            unsetLink: () => ({ run: vi.fn() }),
            extendMarkRange: () => ({ run: vi.fn() }),
            undo: () => ({ run: vi.fn() }),
            redo: () => ({ run: vi.fn() }),
          }),
        }),
        isActive: vi.fn(() => false),
        can: () => ({
          undo: () => true,
          redo: () => true,
        }),
        getAttributes: () => ({ href: '' }),
        on: vi.fn(),
        off: vi.fn(),
      };
    },
    EditorContent: ({ editor }: any) => (
      <textarea
        data-testid="tiptap-editor-shim"
        defaultValue={editor?.getHTML()}
        onChange={(e) => {
          if (editor) {
          }
        }}
      />
    ),
  };
});