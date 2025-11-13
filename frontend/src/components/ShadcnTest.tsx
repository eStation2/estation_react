import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export default function ShadcnTest() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Shadcn UI Test Component</h1>
      
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>eStation Dashboard</CardTitle>
          <CardDescription>Testing Shadcn UI components in eStation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Enter your search query..." />
          <div className="flex gap-2">
            <Button>Primary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
          </div>
          <div className="flex gap-2">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}