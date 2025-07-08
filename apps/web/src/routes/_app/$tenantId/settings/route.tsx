import { createFileRoute } from '@tanstack/react-router';
import type { TagDto } from '@tradelink/shared';
import { Button } from '@tradelink/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tradelink/ui/components/card';
import { DataTable, type Column } from '@tradelink/ui/components/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@tradelink/ui/components/dropdown-menu';
import { Ellipsis, Pencil, Plus, Trash2 } from '@tradelink/ui/icons';
import { useDeleteTag, useGetAllTags } from 'api/tags';
import { PageHeader } from 'components/page-header/PageHeader';
import { TagBadge, TagDialog } from 'components/tags';
import { useBreadcrumbSetup } from 'context/breadcrumb-context';
import { useState } from 'react';

export const Route = createFileRoute('/_app/$tenantId/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isTagDialogOpen, setIsTagDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<TagDto | undefined>();

  useBreadcrumbSetup([{ title: 'Settings', href: '/settings', isActive: true }]);

  const { data: tags = [], isLoading } = useGetAllTags();
  const deleteTag = useDeleteTag();

  const handleEditTag = (tag: TagDto) => {
    setEditingTag(tag);
    setIsTagDialogOpen(true);
  };

  const handleCreateTag = () => {
    setEditingTag(undefined);
    setIsTagDialogOpen(true);
  };

  const handleDeleteTag = async (tagId: number) => {
    if (confirm('Are you sure you want to delete this tag?')) {
      await deleteTag.mutateAsync(tagId);
    }
  };

  const columns: Column<TagDto>[] = [
    {
      title: 'Tag',
      render: tag => <TagBadge tag={tag} />,
    },
    {
      title: 'Color',
      render: tag => (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded border" style={{ backgroundColor: tag.color }} />
          <span className="text-sm font-mono">{tag.color}</span>
        </div>
      ),
    },
    {
      title: 'Created',
      render: tag => new Date(tag.createdAt).toLocaleDateString(),
    },
    {
      title: '',
      render: tag => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Ellipsis className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleEditTag(tag)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteTag(tag.id)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Manage tags to organize your contacts and companies</CardDescription>
            </div>
            <Button onClick={handleCreateTag}>
              <Plus className="mr-2 h-4 w-4" />
              Create Tag
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={tags}
            loading={isLoading}
            emptyMessage="No tags found. Create your first tag to get started."
          />
        </CardContent>
      </Card>

      <TagDialog open={isTagDialogOpen} onOpenChange={setIsTagDialogOpen} tag={editingTag} />
    </div>
  );
}
