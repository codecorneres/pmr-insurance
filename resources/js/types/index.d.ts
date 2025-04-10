import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    is_admin?: boolean;
    is_reviewer?: boolean;
    is_user?: boolean;
    [key: string]: unknown; // This allows for additional properties...
}

export interface PageProps {
    auth: {
        user: User
    };
    [key: string]: unknown;
}

export type QuestionType = 'text' | 'number' | 'textarea' | 'select';

export interface Question {
  id: number;
  label: string;
  key: string;
  type: QuestionType;
  options: string[] | null;
  order: number;
  is_required: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Application {
    id: number;
    name: string;
    email: string;
    status: 'Submitted' | 'Under Review' | 'Reviewed' | 'Approved' | 'Needs Update';
    answers: Record<string, string>;
    created_at: string;
    updated_at: string;
    user_id?: User;
  }