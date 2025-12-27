"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const USER_NAMES = ["User A", "User B", "User C", "User D", "User E"]

export default function Home() {
  const [selectedUser, setSelectedUser] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0])
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleSubmit = async () => {
    if (!uploadedFile || !selectedUser) {
      toast({
        title: "Missing Information",
        description: "Please select a user and upload a payment slip.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', uploadedFile)
      formData.append('userName', selectedUser)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      toast({
        title: "Success!",
        description: "Your payment slip has been uploaded successfully.",
      })

      // Reset form
      setUploadedFile(null)
      setSelectedUser("")
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload payment slip. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            YouTube Premium Payment
          </h1>
          <p className="text-lg text-gray-600">
            Upload your payment slip for verification
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Payment Slip</CardTitle>
            <CardDescription>
              Select your name and upload an image of your payment slip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Selection */}
            <div className="space-y-2">
              <Label htmlFor="user-select">Your Name</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger id="user-select">
                  <SelectValue placeholder="Select your name" />
                </SelectTrigger>
                <SelectContent>
                  {USER_NAMES.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* File Upload Area */}
            <div className="space-y-2">
              <Label>Payment Slip Image</Label>
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-colors
                  ${isDragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <Upload className="h-12 w-12 text-gray-400" />
                  {uploadedFile ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">{uploadedFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600">
                        {isDragActive
                          ? "Drop the file here"
                          : "Drag & drop your payment slip here, or click to select"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports: PNG, JPG, JPEG, GIF, WEBP
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!uploadedFile || !selectedUser || isUploading}
              className="w-full"
              size="lg"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Slip
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <a
            href="/admin/login"
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Admin Login
          </a>
        </div>
      </div>
    </div>
  )
}
