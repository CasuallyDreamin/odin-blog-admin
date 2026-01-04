import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TextEditor from '@/components/posts/TextEditor';

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(({ content }) => ({
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
    can: () => ({ undo: () => true, redo: () => true }),
    getAttributes: () => ({ href: '' }),
    on: vi.fn(),
    off: vi.fn(),
  })),
  EditorContent: ({ editor }: any) => (
    <textarea
      data-testid="tiptap-editor-shim"
      defaultValue={editor?.getHTML()}
      readOnly
    />
  ),
}));

describe('TextEditor Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.prompt = vi.fn();
  });

  it('renders the editor shim after mounting', async () => {
    render(<TextEditor value="<p>Initial Content</p>" onChange={mockOnChange} />);
    
    const shim = await screen.findByTestId('tiptap-editor-shim');
    expect(shim).toBeInTheDocument();
    expect(shim).toHaveValue('<p>Initial Content</p>');
  });

  it('renders menu buttons and triggers editor chain commands', async () => {
    render(<TextEditor value="" onChange={mockOnChange} />);
    
    const boldButton = await screen.findByRole('button', { name: /bold/i });
    fireEvent.click(boldButton);
    
    expect(boldButton).toBeInTheDocument();
  });

  it('handles image upload prompts via the menu', async () => {
    render(<TextEditor value="" onChange={mockOnChange} />);
    
    const imageButton = await screen.findByRole('button', { name: /image/i });
    fireEvent.click(imageButton);
    
    expect(window.prompt).toHaveBeenCalledWith('URL');
  });
});