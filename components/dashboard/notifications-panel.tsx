"use client";
import {Modal} from '@/components/ui';
import {Inbox} from '@/components/insights/inbox';
import type {User} from '@/types/auth';
export function NotificationsPanel({user,open,onClose}:{user:User;open:boolean;onClose:()=>void}){return <Modal open={open} onClose={onClose} title="Your notifications" description="Updates for your account.">{open&&<Inbox user={user} compact onNavigate={onClose}/>}</Modal>;}
