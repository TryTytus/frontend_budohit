"use client"

import { useEffect, useState } from "react"
import { getAdminCategories, createCategory, updateCategory } from "@/lib/api"
import { TreeNode, TreeView } from "@/components/ui/tree-view"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Folder, Save, X, Trash2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { slugify } from "@/lib/utils"
import { Category } from "@/lib/types"

export default function AdminCategoriesPage() {
    const [treeData, setTreeData] = useState<TreeNode[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<TreeNode | null>(null)

    // Form State
    const [isCreating, setIsCreating] = useState(false)
    const [formData, setFormData] = useState({ name: "", slug: "" })
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [saving, setSaving] = useState(false)

    const { toast } = useToast()

    // Function to convert API category to TreeNode
    const toTreeNode = (cat: Category): TreeNode => ({
        id: cat.id.toString(),
        name: cat.name,
        children: [],
        parentId: cat.parent ? cat.parent.toString() : null,
        hasChildren: cat.has_children,
        icon: Folder,
        image: cat.image // Map image from API
    })

    // Fetch Roots
    useEffect(() => {
        fetchCategories()
    }, [])

    // Sync form with selection (if not creating)
    useEffect(() => {
        if (!isCreating && selectedCategory) {
            setFormData({
                name: selectedCategory.name,
                slug: slugify(selectedCategory.name)
            })
            setPreviewUrl(selectedCategory.image || null)
            setSelectedFile(null)
        }
    }, [selectedCategory, isCreating])

    const fetchCategories = async (parentId: string | null = null) => {
        try {
            const data = await getAdminCategories(parentId);

            if (!parentId) {
                setTreeData(data.map(toTreeNode))
                setLoading(false)
            } else {
                return data.map(toTreeNode)
            }
        } catch (error) {
            console.error(error)
            toast({ title: "Błąd", description: "Nie udało się pobrać kategorii", variant: "destructive" })
            setLoading(false)
        }
    }

    const handleExpand = async (node: TreeNode) => {
        if (node.children && node.children.length > 0) return // Already loaded

        // Fetch children
        const children = await fetchCategories(node.id)
        if (children) {
            // Update tree data recursively
            setTreeData(prev => updateTreeNodes(prev, node.id, children))
        }
    }

    const updateTreeNodes = (nodes: TreeNode[], targetId: string, children: TreeNode[]): TreeNode[] => {
        return nodes.map(node => {
            if (node.id === targetId) {
                return { ...node, children: children }
            }
            if (node.children) {
                return { ...node, children: updateTreeNodes(node.children, targetId, children) }
            }
            return node
        })
    }

    // Helper to refresh a node's children (parent of changed item)
    const refreshNodeChildren = async (parentId: string | null) => {
        if (!parentId) {
            await fetchCategories(null); // Refresh root
        } else {
            const children = await getAdminCategories(parentId);
            setTreeData(prev => updateTreeNodes(prev, parentId, children.map(toTreeNode)));
        }
    }

    const handleAddClick = () => {
        setIsCreating(true)
        setFormData({ name: "", slug: "" })
        setPreviewUrl(null)
        setSelectedFile(null)
    }

    const handleCancel = () => {
        setIsCreating(false)
        if (selectedCategory) {
            setFormData({ name: selectedCategory.name, slug: slugify(selectedCategory.name) })
            setPreviewUrl(selectedCategory.image || null)
        } else {
            setFormData({ name: "", slug: "" })
            setPreviewUrl(null)
        }
        setSelectedFile(null)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        try {
            // Construct FormData
            const data = new FormData()
            data.append("name", formData.name)
            data.append("slug", formData.slug)

            if (selectedFile) {
                data.append("uploaded_image", selectedFile)
            }

            if (isCreating) {
                const parentId = selectedCategory ? parseInt(selectedCategory.id) : null
                if (parentId) data.append("parent", parentId.toString())

                await createCategory(data)

                toast({ title: "Sukces", description: "Kategoria dodana pomyślnie." })
                await refreshNodeChildren(selectedCategory ? selectedCategory.id : null)
                setIsCreating(false)
            } else {
                if (!selectedCategory) return

                // For updates, we don't necessarily send parent unless we moved it, which we don't support yet in this form.
                // So just name, slug, image.
                await updateCategory(parseInt(selectedCategory.id), data)

                toast({ title: "Sukces", description: "Zmiany zapisane." })
                await refreshNodeChildren(selectedCategory.parentId || null)
            }
        } catch (err) {
            console.error(err)
            toast({ title: "Błąd", description: "Wystąpił błąd podczas zapisu.", variant: "destructive" })
        } finally {
            setSaving(false)
        }
    }

    const updateSlug = (name: string) => {
        // Only auto-update slug if creating, or if user hasn't heavily modified it? 
        // Simple rule: Always auto-update on name change if creating.
        if (isCreating) {
            setFormData(prev => ({ ...prev, name, slug: slugify(name) }))
        } else {
            setFormData(prev => ({ ...prev, name }))
        }
    }

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Kategorie</h1>
                    <p className="text-zinc-400">Zarządzaj drzewem kategorii produktów</p>
                </div>
                <Button onClick={handleAddClick} disabled={isCreating}>
                    <Plus className="mr-2 h-4 w-4" /> Dodaj Kategorię
                </Button>
            </div>

            <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
                {/* Left: Tree */}
                <Card className="col-span-4 bg-zinc-900 border-white/10 flex flex-col h-full">
                    <CardHeader>
                        <CardTitle className="text-white">Struktura</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                            </div>
                        ) : (
                            <TreeView
                                data={treeData}
                                onExpand={handleExpand}
                                onSelect={(node) => {
                                    setSelectedCategory(node);
                                    setIsCreating(false); // Cancel create if selection changes
                                }}
                                selectedId={selectedCategory?.id}
                                className="text-zinc-300"
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Right: Details / Edit */}
                <Card className="col-span-8 bg-zinc-900 border-white/10 h-full">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            {isCreating ? (
                                <>
                                    <Plus className="h-5 w-5 text-primary" />
                                    Nowa Kategoria
                                </>
                            ) : selectedCategory ? (
                                `Edycja: ${selectedCategory.name}`
                            ) : (
                                "Wybierz kategorię"
                            )}
                        </CardTitle>
                        <CardDescription>
                            {isCreating ? (
                                selectedCategory ? `Dodawanie podkategorii do: ${selectedCategory.name}` : "Dodawanie kategorii głównej (Root)"
                            ) : selectedCategory ? (
                                `ID: ${selectedCategory.id}`
                            ) : (
                                "Kliknij na kategorię w drzewie, aby edytować, lub 'Dodaj Kategorię' aby utworzyć nową."
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {(selectedCategory || isCreating) ? (
                            <form onSubmit={handleSave} className="space-y-6 max-w-xl text-white">
                                <div className="space-y-4">
                                    <div className="flex gap-6">
                                        {/* Image Upload Section */}
                                        <div className="flex-shrink-0">
                                            <Label className="block mb-2">Zdjęcie</Label>
                                            <div
                                                className="w-32 h-32 border-2 border-dashed border-zinc-700 rounded-lg flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors overflow-hidden relative group"
                                                onClick={() => document.getElementById('cat-image-upload')?.click()}
                                            >
                                                {previewUrl ? (
                                                    <>
                                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <p className="text-xs text-white">Zmień</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center p-2 text-zinc-500">
                                                        <Folder className="h-8 w-8 mx-auto mb-1" />
                                                        <span className="text-xs">Dodaj foto</span>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                id="cat-image-upload"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileSelect}
                                            />
                                            {previewUrl && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="mt-1 w-full text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewUrl(null);
                                                        setSelectedFile(null);
                                                        // Note: We don't have an API to explicitly "delete" image yet, 
                                                        // but passing null/empty might work if backed supports it. 
                                                        // For now this just clears selection/preview.
                                                    }}
                                                >
                                                    <Trash2 className="h-3 w-3 mr-1" /> Usuń
                                                </Button>
                                            )}
                                        </div>

                                        <div className="flex-1 space-y-4">
                                            <div className="space-y-2">
                                                <Label>Nazwa kategorii</Label>
                                                <Input
                                                    value={formData.name}
                                                    onChange={(e) => updateSlug(e.target.value)}
                                                    className="bg-black border-white/10"
                                                    placeholder="np. Elektronarzędzia"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Slug (URL)</Label>
                                                <Input
                                                    value={formData.slug}
                                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                    className="bg-black border-white/10"
                                                    placeholder="np. elektronarzedzia"
                                                    required
                                                />
                                                <p className="text-xs text-zinc-500">
                                                    Adres URL: /kategorie/{formData.slug}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {!isCreating && (
                                        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md text-yellow-200 text-sm">
                                            Uwaga: Zmiana nazwy lub sluga może wpłynąć na URL podkategorii i produktów.
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <Button type="submit" disabled={saving} className="bg-primary text-black hover:bg-primary/90">
                                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                        {isCreating ? "Utwórz Kategorię" : "Zapisz Zmiany"}
                                    </Button>

                                    {(isCreating || selectedCategory) && (
                                        <Button type="button" variant="outline" onClick={handleCancel} disabled={saving} className="border-white/10 hover:bg-white/5 text-black">
                                            <X className="mr-2 h-4 w-4" /> Anuluj
                                        </Button>
                                    )}
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
                                <Folder className="h-12 w-12 mb-4 opacity-50" />
                                <p>Brak wybranej kategorii</p>
                                <Button variant="link" onClick={handleAddClick} className="mt-2 text-primary">
                                    Utwórz nową kategorię główną
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
