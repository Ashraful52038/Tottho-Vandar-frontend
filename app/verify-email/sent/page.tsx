// app/verify-email/sent/page.tsx
'use client';

import { MailOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';

export default function VerificationEmailSentPage() {

  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Tottho Vandar';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Tottho Vandar</h1>
          </Link>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MailOutlined className="text-4xl text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Check your email
            </h2>
            
            <p className="text-gray-600 mb-6">
              We've sent a verification link to your email address. Please click the link to verify your account.
            </p>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h3 className="font-medium text-blue-800 mb-2">Next steps:</h3>
                <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
                  <li>Open your email inbox</li>
                  <li>Find the email from <span className="font-bold">{APP_NAME}</span></li>
                  <li>Click the verification link</li>
                  <li>Return here to continue</li>
                </ol>
              </div>

              <div className="text-sm text-gray-500">
                <p>Didn't receive the email? Check your spam folder or</p>
                <Link href="/verify-email/resend" className="text-green-600 hover:text-green-700 font-medium">
                  click here to resend
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <Link href="/">
                <Button className="w-full">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}