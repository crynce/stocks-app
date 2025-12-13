"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

/**
 * Renders the avatar root container used as the main avatar element.
 *
 * @param className - Additional CSS classes to apply to the root; merged with the component's default avatar classes.
 * @returns The underlying AvatarPrimitive.Root element with the provided props and composed className.
 */
function Avatar({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders an avatar image element with slot and default styling.
 *
 * The returned element is a Radix Avatar Image augmented with a `data-slot="avatar-image"` attribute
 * and composed class names (`aspect-square size-full` plus any provided `className`).
 *
 * @returns The rendered avatar image element with applied classes and attributes.
 */
function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  )
}

/**
 * Renders fallback content for an Avatar when the image is unavailable.
 *
 * @param className - Additional CSS classes appended to the default circular, centered fallback styles
 * @returns A Radix Avatar Fallback element styled as a centered, circular fallback
 */
function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  )
}

export { Avatar, AvatarImage, AvatarFallback }