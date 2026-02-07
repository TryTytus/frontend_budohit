"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Toggle } from "@/components/ui/toggle";
import {
    Bold, Italic, Underline as UnderlineIcon,
    Strikethrough, Heading1, Heading2, Heading3,
    List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
    Link as LinkIcon, Undo, Redo, Quote, Image as ImageIcon,
    Table as TableIcon, Plus, Trash2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addImage = () => {
        const url = window.prompt('URL obrazka');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border border-white/10 rounded-t-md p-2 bg-zinc-900 flex flex-wrap gap-1 items-center">
            <Toggle
                size="sm"
                pressed={editor.isActive('bold')}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <Bold className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('italic')}
                onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <Italic className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('underline')}
                onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <UnderlineIcon className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('strike')}
                onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <Strikethrough className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 1 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <Heading1 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 2 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <Heading2 className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('heading', { level: 3 })}
                onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <Heading3 className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Toggle
                size="sm"
                pressed={editor.isActive('bulletList')}
                onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <List className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive('orderedList')}
                onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <ListOrdered className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'left' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <AlignLeft className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'center' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <AlignCenter className="h-4 w-4" />
            </Toggle>
            <Toggle
                size="sm"
                pressed={editor.isActive({ textAlign: 'right' })}
                onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                className="data-[state=on]:bg-white/20 hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <AlignRight className="h-4 w-4" />
            </Toggle>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Button
                variant="ghost"
                size="sm"
                onClick={addImage}
                className="hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
                title="Dodaj obrazek URL"
            >
                <ImageIcon className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                className="hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
                title="Wstaw tabelę 3x3"
            >
                <TableIcon className="h-4 w-4" />
            </Button>
            {editor.isActive('table') && (
                <>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                        className="hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
                        title="Dodaj kolumnę"
                    >
                        <Plus className="h-4 w-4 rotate-90" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                        className="hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
                        title="Dodaj wiersz"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        className="hover:bg-red-500/10 text-red-500 h-8 w-8 p-0"
                        title="Usuń tabelę"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </>
            )}
            <div className="w-px h-6 bg-white/10 mx-1" />
            <Button
                variant="ghost"
                size="sm"
                onClick={setLink}
                className={cn('h-8 w-8 p-0', editor.isActive('link') && 'bg-white/20 text-white')}
            >
                <LinkIcon className="h-4 w-4 text-zinc-300" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <Undo className="h-4 w-4" />
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="hover:bg-white/10 text-zinc-300 h-8 w-8 p-0"
            >
                <Redo className="h-4 w-4" />
            </Button>
        </div>
    )
}

export function RichTextEditor({ value, onChange, className }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'border-collapse table-auto w-full border border-white/20 my-4',
                },
            }),
            TableRow,
            TableHeader,
            TableCell.configure({
                HTMLAttributes: {
                    class: 'border border-white/20 p-2',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-primary underline cursor-pointer',
                }
            })
        ],
        immediatelyRender: false,
        content: value,
        base: 'prose prose-invert max-w-none text-zinc-100 placeholder:text-zinc-500/50',
        editorProps: {
            attributes: {
                class:
                    'min-h-[200px] w-full rounded-b-md border border-t-0 border-white/10 bg-black px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-y-auto max-h-[600px]',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className={cn("flex flex-col", className)}>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
