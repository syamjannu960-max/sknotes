"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Book, GraduationCap, Library, FileText, LogOut, PanelLeft, Home } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

const menuItems = [
    { href: "/admin/courses", label: "Courses", icon: Book },
    { href: "/admin/semesters", label: "Semesters", icon: GraduationCap },
    { href: "/admin/subjects", label: "Subjects", icon: Library },
    { href: "/admin/units", label: "Units", icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const session = Cookies.get('session');
        if (!session && pathname !== '/admin/login') {
            router.replace('/admin/login');
        }
    }, [pathname, router]);

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <SidebarProvider>
            <Sidebar side="left" variant="sidebar" collapsible="icon">
                <SidebarHeader className="group-data-[collapsible=icon]:justify-center">
                    <Link href="/admin/courses" className="flex items-center gap-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <span className="text-xl font-headline font-bold group-data-[collapsible=icon]:hidden">SKNotes</span>
                    </Link>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <Link href={item.href}>
                                    <SidebarMenuButton
                                        isActive={pathname.startsWith(item.href)}
                                        tooltip={{children: item.label}}
                                    >
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="group-data-[collapsible=icon]:flex-col">
                     <SidebarMenu>
                        <SidebarMenuItem>
                             <Link href="/courses" target="_blank">
                                <SidebarMenuButton tooltip={{children: 'View Site'}}>
                                    <Home/>
                                    <span>View Site</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <form action={logout}>
                                <SidebarMenuButton asChild className="w-full">
                                    <button type="submit">
                                        <LogOut />
                                        <span>Logout</span>
                                    </button>
                                </SidebarMenuButton>
                            </form>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset className="p-4 sm:p-6 lg:p-8">
                <header className="flex items-center justify-between md:hidden mb-4 border-b pb-4">
                    <Link href="/admin/courses" className="flex items-center gap-2">
                        <BookOpen className="h-6 w-6 text-primary" />
                        <span className="text-lg font-headline font-bold">SKNotes</span>
                    </Link>
                    <SidebarTrigger />
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
