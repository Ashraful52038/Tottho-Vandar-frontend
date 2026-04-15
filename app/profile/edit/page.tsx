'use client';

import { userService } from '@/lib/api/user';
import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { updateUser } from '@/store/slices/authSlice';
import type { User } from '@/types/user';
import { ArrowLeftOutlined, CameraOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Upload, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
    setName(user.name || '');
    setBio(user.bio || '');
  }, [user, router]);

  const onSubmit = async () => {
    if (!name.trim()) { setNameError('Name is required'); return; }
    if (!user) return;
    setLoading(true);
    try {
      const updated = await userService.updateProfile({ name, bio, email: user.email });
      dispatch(updateUser(updated));
      message.success('Profile updated!');
      router.push(`/profile/${user.id}`);
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    setUploading(true);
    try {
      const { avatarUrl } = await userService.uploadAvatar(file);
      dispatch(updateUser({ ...user, avatar: avatarUrl } as User));
      message.success('Avatar updated!');
    } catch {
      message.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <LoadingOutlined className="text-4xl text-green-700" spin />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f4f0] py-6 px-4">
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 transition-colors"
        >
          <ArrowLeftOutlined /> Back
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#e8e5df] overflow-hidden">

          {/* Banner */}
          <div className="h-24 bg-linear-to-r from-[#2d6a4f] via-[#40916c] to-[#74c69d]" />

          {/* Avatar */}
          <div className="px-7">
            <div className="flex items-end gap-4 -mt-11 mb-5">
              <div className="relative shrink-0">
                <Avatar
                  size={84}
                  src={user.avatar}
                  icon={<UserOutlined />}
                  className="border-[3px] border-white shadow-md"
                  style={{ background: '#d8f3dc', color: '#2d6a4f' }}
                />
                <Upload
                  showUploadList={false}
                  beforeUpload={(file) => { handleAvatarUpload(file); return false; }}
                  accept="image/*"
                >
                  <button className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-green-700 border-2 border-white flex items-center justify-center text-white text-xs hover:bg-green-800 transition-colors">
                    {uploading ? <LoadingOutlined /> : <CameraOutlined />}
                  </button>
                </Upload>
              </div>
              <div className="pb-1">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">Click camera to change photo</p>
              </div>
            </div>
          </div>

          <div className="border-t border-[#e8e5df]" />

          {/* Form */}
          <div className="px-7 py-6 flex flex-col gap-5">

            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                value={name}
                onChange={e => { setName(e.target.value); setNameError(''); }}
                placeholder="Your full name"
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-all
                  ${nameError
                    ? 'border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-[#e8e5df] focus:border-green-600 focus:ring-2 focus:ring-green-50'
                  }`}
              />
              {nameError && <p className="text-xs text-red-500 mt-1">{nameError}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Email <span className="text-xs font-normal text-gray-400">(cannot be changed)</span>
              </label>
              <input
                value={user.email}
                disabled
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#e8e5df] bg-[#faf9f7] text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="flex justify-between text-xs font-medium text-gray-500 mb-1.5">
                <span>Bio</span>
                <span className="font-normal text-gray-400">{bio.length}/200</span>
              </label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                maxLength={200}
                rows={4}
                className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-[#e8e5df] outline-none resize-none focus:border-green-600 focus:ring-2 focus:ring-green-50 transition-all"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2.5 pt-2 border-t border-[#e8e5df]">
              <button
                onClick={() => router.back()}
                className="px-5 py-2.5 text-sm font-medium rounded-lg border border-[#d4cfc5] bg-white hover:bg-[#f5f4f0] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-70 transition-colors"
              >
                {loading && <LoadingOutlined />}
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}