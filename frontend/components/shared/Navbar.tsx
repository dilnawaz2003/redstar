'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogoutMutation } from "@/lib/api/apiSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logout } from "@/lib/redux/slices/authSlice";
import { RootState } from "@/lib/redux/store";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const user = useAppSelector((state:RootState) => state.auth.user)
    
    
    const firstLetter = user?.name?.charAt(0).toUpperCase();


  const handleSignout = async () => {
        dispatch(logout())
        router.replace('/')

  }

  return (
    <div className=" flex items-center justify-end px-6 py-4 border-b border-gray-300">

    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer bg-red-600 text-white hover:bg-red-700 transition size-10">
          <AvatarFallback className="bg-red-600 text-white font-semibold">
            {firstLetter}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-40 rounded-xl border border-red-200 bg-red-50 shadow-lg"
      >
        <DropdownMenuItem
          onClick={handleSignout}
          className="cursor-pointer text-red-600 focus:bg-red-100 focus:text-red-700"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>

  );
}
