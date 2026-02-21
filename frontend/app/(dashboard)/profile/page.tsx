"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion } from "motion/react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { supabase } from '@/lib/supabaseClient'
import Input from '@/components/input'
import Cropper from 'react-easy-crop'
import { Point, Area } from 'react-easy-crop/types'

interface Profile {
  id: string
  email: string
  full_name?: string
  company_name?: string
  role?: string
  avatar_url?: string
}

export default function ProfilePage() {
    const router = useRouter()
    const [profile, setProfile] = useState<Profile | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isChangingPassword, setIsChangingPassword] = useState(false)
    const [showEmailReset, setShowEmailReset] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const [passwordSuccess, setPasswordSuccess] = useState("") 

    // Avatar cropping state
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
    const [showCropModal, setShowCropModal] = useState(false)
    const [imageToCrop, setImageToCrop] = useState<string | null>(null)
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)


    const [formData, setFormData] = useState({
        full_name: "",
        company_name: "",
        role: "",
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            setIsLoading(true)
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                router.push('/auth/login')
                return
            }

            const response = await fetch('/api/settings', {
                headers: {
                'Authorization': `Bearer ${session.access_token}`
                }
            })

            const data = await response.json()
            setProfile(data)
            setFormData({
                full_name: data.full_name || "",
                company_name: data.company_name || "",
                role: data.role || "",
            })
            setAvatarPreview(data.avatar_url || null)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
        const image = new window.Image()
        image.addEventListener('load', () => resolve(image))
        image.addEventListener('error', (error) => reject(error))
        image.src = url
        })

    const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<Blob> => {
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            throw new Error('No 2d context')
        }

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        )

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob)
            }, 'image/jpeg')
        })
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Validation
            if (file.size > 5 * 1024 * 1024) {  // 5MB
                setError("Image must be less than 5MB")
                return
            }

            if (!file.type.startsWith('image/')) {
                setError("File must be an image")
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                setImageToCrop(reader.result as string)
                setShowCropModal(true)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleCropSave = async () => {
        if (!imageToCrop || !croppedAreaPixels) return

        try {
            const croppedImageBlob = await getCroppedImg(imageToCrop, croppedAreaPixels)
            
            // Convert blob to file
            const file = new File([croppedImageBlob], 'avatar.jpg', { type: 'image/jpeg' })
            setAvatarFile(file)

            // Create preview
            const previewUrl = URL.createObjectURL(croppedImageBlob)
            setAvatarPreview(previewUrl)

            setShowCropModal(false)
            setImageToCrop(null)
        } catch (e) {
            console.error(e)
            setError('Failed to crop image')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccess("")
        setIsSaving(true)

        try {
            const { data: { session } } = await supabase.auth.getSession()

            // Upload avatar if changed
            let avatarUrl = profile?.avatar_url
            if (avatarFile) {
                const fileExt = 'jpg'
                const fileName = `${profile?.id}-${Date.now()}.${fileExt}`
                
                const { error: uploadError, data: uploadData } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, avatarFile, { 
                        upsert: true,
                        contentType: 'image/jpeg'
                    })

                if (uploadError) {
                    console.error('Upload error:', uploadError)
                    throw uploadError
                }

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName)
                
                avatarUrl = publicUrl
            }

            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                ...formData,
                avatar_url: avatarUrl
                })
            })

            if (response.ok) {
                setSuccess("Profile updated successfully!")
                setAvatarFile(null)
                fetchProfile()
            } else {
                throw new Error('Failed to update profile')
            }
        } catch (err: any) {
            setError(err.message)
        } finally {
            setIsSaving(false)
        }
    }

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault()
        setPasswordError("")
        setPasswordSuccess("")
        setShowEmailReset(false)

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordError("Passwords don't match")
            return
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordError("Password must be at least 8 characters")
            return
        }

        setIsChangingPassword(true)

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: profile?.email || '',
                password: passwordData.currentPassword,
            })

            if (signInError) {
                setPasswordError('Current password is incorrect')
                setShowEmailReset(true)
                setIsChangingPassword(false)
                return
            }

            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            })

            if (updateError) throw updateError

            setPasswordSuccess("Password changed successfully!")
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
            setShowEmailReset(false)
        } catch (err: any) {
            setPasswordError(err.message)
        } finally {
            setIsChangingPassword(false)
        }
    }

    const handlePasswordReset = async () => {
        setPasswordError("")
        setPasswordSuccess("")

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(
                profile?.email || '',
                {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                }
            )

            if (error) throw error

            setPasswordSuccess("Password reset link sent to your email! Check your inbox.")
            setShowEmailReset(false)
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            })
        } catch (err: any) {
            setPasswordError(err.message)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

  return (
    <div className="text-white min-h-screen">
      <div className="mx-auto max-w-3xl py-20 px-6">
        <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
        <p className="text-white/65 mb-8">Manage your account information</p>

        {isLoading ? (
          <div className="text-white/65">Loading profile...</div>
        ) : (
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
              
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">👤</span>
                  )}
                </div>
                
                <div>
                  <label className="cursor-pointer px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition inline-block">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-white/50 mt-2">JPG, PNG or GIF. Max size 5MB.</p>
                  {avatarFile && (
                    <p className="text-xs text-green-400 mt-1">✓ Image ready to upload</p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-4">Account Information</h2>
              
              <div className="mb-4">
                <label className="block text-sm text-white/50 mb-1">Email</label>
                <p className="text-white">{profile?.email}</p>
                <p className="text-xs text-white/40 mt-1">Email cannot be changed</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-white/50 mb-1">User ID</label>
                <p className="text-white/70 text-xs font-mono">{profile?.id}</p>
              </div>
            </div>

            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="bg-[#1E1E1E] rounded-lg border border-white/10 p-6">
              <h2 className="text-lg font-semibold mb-4">Personal Details</h2>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 text-sm">
                  {success}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Full Name</label>
                  <Input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Company Name</label>
                  <Input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="Zememo baker d.o.o"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">Role</label>
                  <Input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="Founder, Developer, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => router.push('/projects')}
                  className="px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm bg-[#7C5CFF] rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#7C5CFF]/80"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

            {/* Change Password */}
            <form onSubmit={handlePasswordChange} className="bg-[#1E1E1E] rounded-lg border border-white/10 p-6">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>

                {/* Password-specific error */}
                {passwordError && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-sm">
                        {passwordError}
                    </div>
                )}

                {/* Password-specific success */}
                {passwordSuccess && (
                    <div className="mb-4 p-3 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 text-sm">
                        {passwordSuccess}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                    <label className="block text-sm text-white/70 mb-2">Current Password</label>
                    <Input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="••••••••"
                        required
                    />
                    </div>

                    <div>
                    <label className="block text-sm text-white/70 mb-2">New Password</label>
                    <Input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="••••••••"
                        required
                    />
                    <p className="text-xs text-white/50 mt-1">At least 8 characters</p>
                    </div>

                    <div>
                    <label className="block text-sm text-white/70 mb-2">Confirm New Password</label>
                    <Input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        placeholder="••••••••"
                        required
                    />
                    </div>
                </div>

                {/* Email Reset Option - appears after wrong password */}
                {showEmailReset && (
                    <div className="mt-4 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <p className="text-sm text-yellow-200 mb-3">
                        Forgot your current password? We can send you a reset link via email.
                    </p>
                    <button
                        type="button"
                        onClick={handlePasswordReset}
                        className="px-4 py-2 text-sm bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-200 rounded-lg transition"
                    >
                        Send Reset Link to Email
                    </button>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="mt-6 px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-lg transition disabled:opacity-50"
                >
                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                </button>
            </form>

            {/* Danger Zone */}
            <div className="bg-red-500/10 rounded-lg border border-red-500/20 p-6">
              <h2 className="text-lg font-semibold text-red-400 mb-2">Danger Zone</h2>
              <p className="text-sm text-white/70 mb-4">Permanently delete your account and all data</p>
              <button className="px-4 py-2 text-sm bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-lg transition">
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>

    {/* Crop Modal */}
      {showCropModal && imageToCrop && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E1E1E] rounded-lg border border-white/10 p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">Crop Your Image</h2>
            
            <div className="relative w-full h-96 bg-black rounded-lg overflow-hidden">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm text-white/70 mb-2">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCropModal(false)
                  setImageToCrop(null)
                }}
                className="px-4 py-2 text-sm rounded-lg hover:bg-white/5 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCropSave}
                className="px-4 py-2 text-sm bg-[#7C5CFF] rounded-lg font-semibold hover:bg-[#7C5CFF]/80 transition"
              >
                Save Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}