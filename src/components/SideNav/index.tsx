import { CgLogIn, CgLogOut } from "react-icons/cg";
import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineHome } from "react-icons/ai";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IconHoverEffect } from "../IconHoverEffect";

export default function SideNav() {
  const session = useSession();
  const user = session.data?.user;
  return (
    <nav className="sticky top-0 px-4 py-4">
      <ul className="flex flex-col item-start gap-2 whitespace-nowrap">
        <li>
          <Link href="/">
            <IconHoverEffect roundedFull={false}>
              <span className="flex items-center gap-2">
                <AiOutlineHome className="h-8 w-8" />
                <span className="hidden text-lg md:inline">Home</span>
              </span>
            </IconHoverEffect>
          </Link>
        </li>
        {user != null && (
          <li>
            <Link href={`/profiles/${user.id}`}>
              <IconHoverEffect roundedFull={false}>
                <span className="flex items-center gap-2">
                  <AiOutlineUser className="h-8 w-8" />
                  <span className="hidden text-lg md:inline">Profile</span>
                </span>
              </IconHoverEffect>
            </Link>
          </li>
        )}
        {user == null ? (
          <li>
            <button onClick={() => void signIn()}>
              <IconHoverEffect roundedFull={false}>
                <span className="flex items-center gap-2">
                  <CgLogIn className="h-8 w-8" />
                  <span className="hidden text-lg md:inline">Log In</span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        ) : (
          <li>
            <button onClick={() => void signOut()}>
              <IconHoverEffect roundedFull={false}>
                <span className="flex items-center gap-2">
                  <CgLogOut className="h-8 w-8" />
                  <span className="hidden text-lg md:inline">Log Out</span>
                </span>
              </IconHoverEffect>
            </button>
          </li>
        )}
      </ul>
    </nav>
  )
}