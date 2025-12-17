'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, Mail, UserPlus, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {useSendInvitationMutation , useGetWorkspaceMembersQuery } from '@/lib/api/apiSlice';
import { toast } from 'sonner';

const invitationSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'member', 'viewer']).default('member'),
});

interface InviteMemberModalProps {
  onClose: () => void;
  workspaceId: string;
}

export default function InviteMemberModal({  onClose, workspaceId }: InviteMemberModalProps) {
  const [invitations, setInvitations] = useState<Array<{email: string, role: string, status: 'pending' | 'sent' | 'error'}>>([]);
  const [sendInvitation, { isLoading }] = useSendInvitationMutation();
  const { data: membersData } = useGetWorkspaceMembersQuery(workspaceId);
  const [isOpen,setIsOpen] = useState(false);
  
  
  const existingMembers = membersData?.data || [];
  const existingEmails = new Set(existingMembers.map(m => m.user?.email));

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invitationSchema),
    defaultValues: {
      email: '',
      role: 'member' as const,
    },
  });

  const handleInvite = async (data: any) => {
    try {
      await sendInvitation({
        workspaceId,
        email: data.email,
        role: data.role,
      }).unwrap();

      reset();
    } catch (error:any) {
      console.error('Failed to send invitation:', error);
         toast.error(error?.data?.message || 'Failed to create workspace');
    }finally{
      setIsOpen(false);
    }
  };

  const removeInvitation = (email: string) => {
    setInvitations(prev => prev.filter(inv => inv.email !== email));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      } else {
        setIsOpen(true);
      }
    }}>
          <DialogTrigger asChild>
                  <Button className="bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                    Invite Member
                  </Button>
                </DialogTrigger>
      <DialogContent className="sm:max-w-1/2">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Invite to Workspace
          </DialogTitle>
          <DialogDescription>
            Invite team members by email address
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleInvite)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="colleague@example.com"
              {...register('email')}
              className={errors.email && 'border-red-500'}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>


          <Button type="submit" className=" w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Send Invitation
              </>
            )}
          </Button>
        </form>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2">Pending Invitations</h4>
            <div className="space-y-2">
              {invitations.map((invitation) => (
                <div
                  key={invitation.email}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border',
                    invitation.status === 'sent' && 'bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900',
                    invitation.status === 'error' && 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gray-100">
                        {invitation.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{invitation.email}</p>
                      <p className="text-xs text-gray-500 capitalize">{invitation.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {invitation.status === 'sent' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {invitation.status === 'error' && (
                      <span className="text-xs text-red-600">Already a member</span>
                    )}
                    <button
                      onClick={() => removeInvitation(invitation.email)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}