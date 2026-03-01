// app/verify-email/resend/page.tsx
'use client';

import { useAppDispatch } from '@/store/hooks/reduxHooks';
import { MailOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
// import { resendVerificationEmail } from '@/store/slices/authSlice';

export default function ResendVerificationPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    setError('');
    try {
      // You'll need to implement this action
      // await dispatch(resendVerificationEmail(values.email)).unwrap();
      setSuccess(true);
      setTimeout(() => {
        router.push('/verify-email/sent');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-serif font-bold text-gray-900">Tottho Vandar</h1>
          </Link>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">Resend Verification Email</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <Alert
              message="Email Sent Successfully!"
              description="Please check your inbox for the verification link."
              type="success"
              showIcon
            />
          ) : (
            <>
              {error && (
                <Alert
                  message="Error"
                  description={error}
                  type="error"
                  showIcon
                  className="mb-4"
                />
              )}

              <Form
                name="resend-verification"
                onFinish={onFinish}
                layout="vertical"
              >
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined className="text-gray-400" />} 
                    placeholder="Enter your email"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    block
                    size="large"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Resend Verification Email
                  </Button>
                </Form.Item>
              </Form>

              <div className="mt-4 text-center text-sm">
                <Link href="/login" className="text-green-600 hover:text-green-700">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}