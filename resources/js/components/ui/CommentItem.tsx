import { useForm } from '@inertiajs/react'
import { useState } from 'react'
import { CalendarClock, User, Pencil, Trash2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

interface CommentItemProps {
  comment: {
    id: number
    body: string
    created_at: string
    user: {
      id: number
      name: string
      role: string
    }
  }
  currentUser: {
    id: number
    role: string
  } | null
  applicationId: number
  canModify?: boolean
}

export default function CommentItem({ comment, currentUser, applicationId, canModify = true }: CommentItemProps) {
  const [editing, setEditing] = useState(false);

  const editForm = useForm({
    body: comment.body,
  })

  const isEditable = currentUser?.role === 'admin' || currentUser?.id === comment.user.id

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    editForm.put(route('comments.update', [applicationId, comment.id]), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Comment updated')
        setEditing(false)
      },
      onError: () => {
        toast.error('Failed to update comment')
      },
    })
  }

  const handleDelete = () => {
    editForm.delete(route('comments.destroy', comment.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Comment deleted')
      },
      onError: () => {
        toast.error('Failed to delete comment')
      },
    })
  }

  return (
    <div className="border-muted bg-background rounded-xl border p-4 shadow-sm dark:border-gray-700 space-y-2">
      <div className="text-muted-foreground mb-2 flex items-center gap-1 text-xs">
        <CalendarClock className="h-4 w-4" />
        {new Date(comment.created_at).toLocaleString('en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </div>

      <div className="mb-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <div className="text-foreground flex items-center gap-1 text-sm font-medium">
            <User className="h-4 w-4" />
            {comment.user.name}
          </div>
          <span className="inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900 dark:text-blue-200">
            {comment.user.role}
          </span>
        </div>

        {isEditable && !editing && canModify && (
         <div className="flex items-center gap-2 mt-2 sm:mt-0">
         <button
           onClick={() => {
             editForm.setData('body', comment.body)
             setEditing(true)
           }}
           className="flex items-center justify-center text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
           title="Edit Comment"
         >
           <Pencil className="h-4 w-4" />
         </button>
       
         <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="flex items-center justify-center text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                title="Delete Comment"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Comment?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this comment? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                >
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
       </div>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleUpdate} className="space-y-2 mt-2">
          <Label htmlFor={`edit-comment-${comment.id}`}>Edit Comment</Label>
          <Textarea
            id={`edit-comment-${comment.id}`}
            name="body"
            placeholder="Write your comment..."
            className="min-h-[150px]"
            value={editForm.data.body}
            onChange={(e) => editForm.setData('body', e.target.value)}
          />
          {editForm.errors.body && (
            <p className="text-sm text-red-500">{editForm.errors.body}</p>
          )}
          <div className="flex gap-2">
            <Button type="submit" disabled={editForm.processing}>
              {editForm.processing ? 'Saving...' : 'Save'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditing(false)
                editForm.setData('body', comment.body)
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <p className="text-muted-foreground text-sm leading-relaxed">{comment.body}</p>
      )}
    </div>
  )
}