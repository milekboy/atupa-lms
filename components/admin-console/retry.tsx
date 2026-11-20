'use client';
import {useTransition} from 'react';
import {useRouter} from 'next/navigation';
import {Button} from '@/components/ui';
export function AdminRetry(){const router=useRouter();const [pending,start]=useTransition();return <Button disabled={pending} onClick={()=>start(()=>router.refresh())}>{pending?'Checking access…':'Retry'}</Button>;}
