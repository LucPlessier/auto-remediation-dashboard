"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> {}
interface TabsListProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {}
interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {}
interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {}

export function Tabs({ className = '', ...props }: TabsProps) {
  return (
    <TabsPrimitive.Root
      className={`${className}`}
      {...props}
    />
  )
}

export function TabsList({ className = '', ...props }: TabsListProps) {
  return (
    <TabsPrimitive.List
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${className}`}
      {...props}
    />
  )
}

export function TabsTrigger({ className = '', ...props }: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ${className}`}
      {...props}
    />
  )
}

export function TabsContent({ className = '', ...props }: TabsContentProps) {
  return (
    <TabsPrimitive.Content
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      {...props}
    />
  )
}
