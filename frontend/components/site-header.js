"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { NavigationMenu } from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const pathname = usePathname()
  const isAuthPage = pathname === "/signin" || pathname === "/register"

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-bold"
          >
            <Image
              src="/happy_faces_logo.png"
              alt="Happy Faces Logo"
              className="logo"
              width="168"
              height="55"
              priority
            />
          </motion.span>
        </Link>

        <NavigationMenu className="hidden md:flex">
          {/* Aquí puedes agregar NavigationMenuItems */}
        </NavigationMenu>

        {!isAuthPage && (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/signin">Iniciar Sesión</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  )
}
