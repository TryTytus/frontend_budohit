"use client"

import { useEffect, useState } from "react"
import { getAdminCategories } from "@/lib/api"
import { TreeNode, TreeView } from "@/components/ui/tree-view"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Folder, File } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

import { Category } from "@/lib/types"

export default function AdminCategoriesPage() {
    const [treeData, setTreeData] = useState<TreeNode[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState<TreeNode | null>(null)
    const { toast } = useToast()

    // Function to convert API category to TreeNode
    const toTreeNode = (cat: Category): TreeNode => ({
        id: cat.id.toString(),
        name: cat.name,
        children: [], // Initially empty, will load on expand
        hasChildren: true, // Assuming true for now, or check backend count? Backend doesn't send count.
        icon: Folder
    })

    // Fetch Roots
    useEffect(() => {
        fetchCategories()
    }, [])

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
            toast({ title: "Error", description: "Could not load categories", variant: "destructive" })
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

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Kategorie</h1>
                    <p className="text-zinc-400">Zarządzaj drzewem kategorii produktów</p>
                </div>
                <Button>
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
                                onSelect={setSelectedCategory}
                                selectedId={selectedCategory?.id}
                                className="text-zinc-300"
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Right: Details / Edit */}
                <Card className="col-span-8 bg-zinc-900 border-white/10 h-full">
                    <CardHeader>
                        <CardTitle className="text-white">
                            {selectedCategory ? `Edycja: ${selectedCategory.name}` : "Wybierz kategorię"}
                        </CardTitle>
                        <CardDescription>
                            {selectedCategory ? `ID: ${selectedCategory.id}` : "Kliknij na kategorię w drzewie, aby edytować."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {selectedCategory ? (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Nazwa kategorii</label>
                                    <Input value={selectedCategory.name} className="bg-black border-white/10" disabled />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-400">Slug</label>
                                    <Input value="coming-soon" className="bg-black border-white/10" disabled />
                                </div>
                                {/* Full edit form to be implemented */}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-zinc-500">
                                <Folder className="h-12 w-12 mb-4 opacity-50" />
                                <p>Brak wybranej kategorii</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
