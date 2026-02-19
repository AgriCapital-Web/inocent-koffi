import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Quote, Undo, Redo, 
  Link as LinkIcon, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Highlighter, Palette,
  Table as TableIcon, Plus, Minus, Trash2
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const COLORS = [
  '#000000', '#374151', '#6b7280', '#991b1b', '#dc2626', '#ef4444',
  '#b45309', '#f59e0b', '#fbbf24', '#15803d', '#22c55e', '#4ade80',
  '#0369a1', '#3b82f6', '#60a5fa', '#6d28d9', '#8b5cf6', '#a78bfa',
  '#be185d', '#ec4899', '#f472b6', '#ffffff',
];

const HIGHLIGHT_COLORS = [
  '#fef08a', '#bbf7d0', '#bfdbfe', '#ddd6fe', '#fecdd3', '#fed7aa',
  '#fde68a', '#d1fae5', '#e0e7ff', '#ede9fe', '#fce7f3', '#ffedd5',
];

const RichTextEditor = ({ content, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({ openOnClick: false }),
      Image,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[320px] p-5 focus:outline-none',
        'data-placeholder': placeholder || 'Écrivez votre contenu ici...',
      },
    },
  });

  // Sync external content changes (e.g. from AI generation)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (content !== current && content !== '<p></p>') {
      // Use setTimeout to avoid conflicts with ongoing editor transactions
      const timer = setTimeout(() => {
        editor.commands.setContent(content);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [content]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt('URL du lien:');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const ToolbarButton = ({ 
    onClick, active, disabled, children, title 
  }: { 
    onClick: () => void; active?: boolean; disabled?: boolean; children: React.ReactNode; title?: string 
  }) => (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      size="sm"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0 flex-shrink-0"
    >
      {children}
    </Button>
  );

  return (
    <div className="border rounded-lg overflow-hidden bg-background shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 p-2 border-b bg-muted/50 sticky top-0 z-10">
        {/* Text Formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras (Ctrl+B)">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique (Ctrl+I)">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Souligné (Ctrl+U)">
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px bg-border mx-1 self-stretch" />

        {/* Headings */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Titre H1">
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre H2">
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre H3">
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px bg-border mx-1 self-stretch" />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Aligner à gauche">
          <AlignLeft className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centrer">
          <AlignCenter className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Aligner à droite">
          <AlignRight className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px bg-border mx-1 self-stretch" />

        {/* Lists & Blockquote */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste à puces">
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Liste numérotée">
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citation">
          <Quote className="h-4 w-4" />
        </ToolbarButton>

        <div className="w-px bg-border mx-1 self-stretch" />

        {/* Colors */}
        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Couleur du texte">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <p className="text-xs font-medium mb-2 text-muted-foreground">Couleur du texte</p>
            <div className="grid grid-cols-6 gap-1">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button onClick={() => editor.chain().focus().unsetColor().run()} className="mt-2 text-xs text-muted-foreground hover:text-foreground block">
              Réinitialiser
            </button>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Surligner">
              <Highlighter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="start">
            <p className="text-xs font-medium mb-2 text-muted-foreground">Couleur de fond</p>
            <div className="grid grid-cols-6 gap-1">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => editor.chain().focus().toggleHighlight({ color }).run()}
                  className="w-6 h-6 rounded border border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            <button onClick={() => editor.chain().focus().unsetHighlight().run()} className="mt-2 text-xs text-muted-foreground hover:text-foreground block">
              Retirer
            </button>
          </PopoverContent>
        </Popover>

        <div className="w-px bg-border mx-1 self-stretch" />

        {/* Link & Table */}
        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Lien">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant={editor.isActive('table') ? 'secondary' : 'ghost'} size="sm" className="h-8 w-8 p-0" title="Tableau">
              <TableIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-52 p-2" align="start">
            <p className="text-xs font-semibold mb-2 text-foreground">Tableau</p>
            <div className="space-y-1">
              <button onClick={insertTable} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded w-full text-left">
                <Plus className="h-3 w-3" /> Insérer un tableau 3×3
              </button>
              {editor.isActive('table') && (
                <>
                  <div className="border-t my-1" />
                  <button onClick={() => editor.chain().focus().addColumnBefore().run()} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded w-full">
                    <Plus className="h-3 w-3" /> Colonne avant
                  </button>
                  <button onClick={() => editor.chain().focus().addColumnAfter().run()} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded w-full">
                    <Plus className="h-3 w-3" /> Colonne après
                  </button>
                  <button onClick={() => editor.chain().focus().addRowBefore().run()} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded w-full">
                    <Plus className="h-3 w-3" /> Ligne avant
                  </button>
                  <button onClick={() => editor.chain().focus().addRowAfter().run()} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded w-full">
                    <Plus className="h-3 w-3" /> Ligne après
                  </button>
                  <div className="border-t my-1" />
                  <button onClick={() => editor.chain().focus().deleteColumn().run()} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded w-full text-destructive">
                    <Minus className="h-3 w-3" /> Supprimer colonne
                  </button>
                  <button onClick={() => editor.chain().focus().deleteRow().run()} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded w-full text-destructive">
                    <Minus className="h-3 w-3" /> Supprimer ligne
                  </button>
                  <button onClick={() => editor.chain().focus().deleteTable().run()} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded w-full text-destructive">
                    <Trash2 className="h-3 w-3" /> Supprimer tableau
                  </button>
                  <button onClick={() => editor.chain().focus().mergeCells().run()} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded w-full">
                    Fusionner cellules
                  </button>
                  <button onClick={() => editor.chain().focus().splitCell().run()} className="flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted rounded w-full">
                    Diviser cellule
                  </button>
                </>
              )}
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex-1" />

        {/* Undo/Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Annuler (Ctrl+Z)">
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Rétablir (Ctrl+Y)">
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Editor Area */}
      <div className="relative">
        <EditorContent editor={editor} className="[&_.ProseMirror]:min-h-[320px] [&_.ProseMirror]:p-5 [&_.ProseMirror]:focus:outline-none [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:my-4 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:my-3 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:my-2 [&_.ProseMirror_p]:my-3 [&_.ProseMirror_p]:leading-7 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6 [&_.ProseMirror_ol]:my-3 [&_.ProseMirror_li]:my-1 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-accent [&_.ProseMirror_blockquote]:pl-4 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:my-4 [&_.ProseMirror_table]:w-full [&_.ProseMirror_table]:border-collapse [&_.ProseMirror_table]:my-4 [&_.ProseMirror_th]:border [&_.ProseMirror_th]:border-border [&_.ProseMirror_th]:p-3 [&_.ProseMirror_th]:bg-primary [&_.ProseMirror_th]:text-primary-foreground [&_.ProseMirror_th]:font-semibold [&_.ProseMirror_td]:border [&_.ProseMirror_td]:border-border [&_.ProseMirror_td]:p-3 [&_.ProseMirror_td]:align-top [&_.ProseMirror_tr:nth-child(even)_td]:bg-muted/30" />
      </div>
    </div>
  );
};

export default RichTextEditor;
