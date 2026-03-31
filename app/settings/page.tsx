'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks/reduxHooks';
import { changePassword, forgetPassword } from '@/store/slices/authSlice';
import {
    ArrowLeftOutlined,
    CheckCircleFilled,
    KeyOutlined,
    LockOutlined,
    MailOutlined,
    QuestionCircleOutlined,
    SafetyOutlined,
    SendOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Avatar, Button, Card, Collapse, Form, Input, message, Tabs, Typography } from 'antd';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const { Title, Text } = Typography;

export default function SettingsPage() {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [changePasswordForm] = Form.useForm();
    const [forgotPasswordForm] = Form.useForm();

    // Redirect if not logged in
    if (!user) {
        router.push('/login');
        return null;
    }

    // Change Password Handler
    const handleChangePassword = async (values: {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
    }) => {
        if (values.newPassword !== values.confirmPassword) {
            message.error('New passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await dispatch(changePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            })).unwrap();

            changePasswordForm.resetFields();
            message.success('Password changed successfully!');
        } catch (error: any) {
            console.error('Change password error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Forgot Password Handler (from settings)
    const handleForgotPassword = async (values: { email: string }) => {
        setLoading(true);
        try {
            await dispatch(forgetPassword(values.email)).unwrap();
            forgotPasswordForm.resetFields();
            message.success('Reset link sent to your email!');
        } catch (error: any) {
            console.error('Forgot password error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Format member since date safely
    const memberSince = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
          })
        : 'Unknown';

    // FAQ items
    const faqItems = [
        {
            key: '1',
            label: 'How do I change my password?',
            children: 'Go to the "Change Password" tab, enter your current password and your new password, then click "Update Password".'
        },
        {
            key: '2',
            label: 'What if I forgot my current password?',
            children: 'If you forgot your password, use the "Forgot Password?" tab. Enter your email and we\'ll send you a reset link.'
        },
        {
            key: '3',
            label: 'How long is the reset link valid?',
            children: 'The password reset link expires in 1 hour for security reasons. If it expires, you can request a new one.'
        },
        {
            key: '4',
            label: 'Why do I need to enter my current password to change it?',
            children: 'Requiring your current password prevents unauthorized changes. It ensures only you can modify your password.'
        },
        {
            key: '5',
            label: 'Can I use a password I used before?',
            children: 'For security, we recommend using a completely new password that you haven\'t used recently. This helps protect your account.'
        },
        {
            key: '6',
            label: 'What makes a strong password?',
            children: 'A strong password is at least 8 characters long and includes a mix of uppercase and lowercase letters, numbers, and symbols.'
        }
    ];

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        Account Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Manage your password and security preferences
                    </p>
                </div>

                {/* Profile Summary Card */}
                <Card className="mb-8 shadow-lg rounded-2xl border-0 overflow-hidden">
                    {/* ✅ Back Button Row */}
                    <div className="flex justify-between items-start mb-4">
                        <Button
                            type="text"
                            icon={<ArrowLeftOutlined />}
                            onClick={() => router.back()}
                            className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
                        >
                            Back
                        </Button>
                        <div></div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-4">
                        <Avatar
                            size={96}
                            src={user.avatar}
                            icon={<UserOutlined />}
                            className="border-4 border-green-500 shadow-md"
                        />
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-black">
                                {user.name}
                                {user.verified && (
                                    <CheckCircleFilled className="ml-2 text-green-500 text-xl" />
                                )}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                                <UserOutlined className="mr-1" /> Member since {memberSince}
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="h-3"></div>

                {/* Main Card with Tabs and FAQ Sidebar */}
                <Card className="shadow-lg rounded-2xl border-0 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left: Tabs */}
                        <div className="lg:col-span-2">
                            <Tabs
                                defaultActiveKey="change-password"
                                tabBarGutter={32}
                                items={[
                                    {
                                        key: 'change-password',
                                        label: (
                                            <span className="flex items-center gap-2">
                                                <KeyOutlined /> Change Password
                                            </span>
                                        ),
                                        children: (
                                            <div className="py-4">
                                                <Title level={4} className="mb-4">Update your password</Title>
                                                <Text type="secondary" className="block mb-6">
                                                    For security, please enter your current password before setting a new one.
                                                </Text>
                                                <Form
                                                    form={changePasswordForm}
                                                    onFinish={handleChangePassword}
                                                    layout="vertical"
                                                    className="max-w-xl"
                                                >
                                                    <Form.Item
                                                        name="currentPassword"
                                                        label="Current Password"
                                                        rules={[{ required: true, message: 'Please input your current password!' }]}
                                                    >
                                                        <Input.Password
                                                            prefix={<LockOutlined />}
                                                            placeholder="Enter current password"
                                                            size="large"
                                                            className="rounded-lg"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        name="newPassword"
                                                        label="New Password"
                                                        rules={[
                                                            { required: true, message: 'Please input your new password!' },
                                                            { min: 6, message: 'Password must be at least 6 characters!' }
                                                        ]}
                                                    >
                                                        <Input.Password
                                                            prefix={<LockOutlined />}
                                                            placeholder="Enter new password"
                                                            size="large"
                                                            className="rounded-lg"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item
                                                        name="confirmPassword"
                                                        label="Confirm New Password"
                                                        dependencies={['newPassword']}
                                                        rules={[
                                                            { required: true, message: 'Please confirm your new password!' },
                                                            ({ getFieldValue }) => ({
                                                                validator(_, value) {
                                                                    if (!value || getFieldValue('newPassword') === value) {
                                                                        return Promise.resolve();
                                                                    }
                                                                    return Promise.reject(new Error('The two passwords do not match!'));
                                                                },
                                                            }),
                                                        ]}
                                                    >
                                                        <Input.Password
                                                            prefix={<LockOutlined />}
                                                            placeholder="Confirm new password"
                                                            size="large"
                                                            className="rounded-lg"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item>
                                                        <Button
                                                            type="primary"
                                                            htmlType="submit"
                                                            loading={loading}
                                                            icon={<KeyOutlined />}
                                                            className="bg-green-600 hover:bg-green-700 rounded-lg"
                                                            size="large"
                                                        >
                                                            Update Password
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            </div>
                                        ),
                                    },
                                    {
                                        key: 'reset-password',
                                        label: (
                                            <span className="flex items-center gap-2">
                                                <SendOutlined /> Forgot Password?
                                            </span>
                                        ),
                                        children: (
                                            <div className="py-4">
                                                <Title level={4} className="mb-4">Reset your password</Title>
                                                <Text type="secondary" className="block mb-6">
                                                    If you've forgotten your password, enter your email and we'll send a reset link.
                                                </Text>
                                                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3">
                                                    <SafetyOutlined className="text-blue-500 text-xl mt-0.5" />
                                                    <div>
                                                        <Text strong>What happens next?</Text>
                                                        <Text type="secondary" className="block text-sm">
                                                            You'll receive an email with a secure link. Click it to set a new password. The link expires in 1 hour.
                                                        </Text>
                                                    </div>
                                                </div>

                                                <Form
                                                    form={forgotPasswordForm}
                                                    onFinish={handleForgotPassword}
                                                    layout="vertical"
                                                    className="max-w-xl"
                                                >
                                                    <Form.Item
                                                        name="email"
                                                        label="Email Address"
                                                        rules={[
                                                            { required: true, message: 'Please input your email!' },
                                                            { type: 'email', message: 'Please enter a valid email!' }
                                                        ]}
                                                    >
                                                        <Input
                                                            prefix={<MailOutlined />}
                                                            placeholder="Enter your registered email"
                                                            size="large"
                                                            defaultValue=""
                                                            className="rounded-lg"
                                                        />
                                                    </Form.Item>

                                                    <Form.Item>
                                                        <Button
                                                            type="primary"
                                                            htmlType="submit"
                                                            loading={loading}
                                                            icon={<SendOutlined />}
                                                            className="bg-blue-600 hover:bg-blue-700 rounded-lg"
                                                            size="large"
                                                        >
                                                            Send Reset Link
                                                        </Button>
                                                    </Form.Item>
                                                </Form>
                                            </div>
                                        ),
                                    },
                                ]}
                            />
                        </div>

                        {/* Right: FAQ Sidebar */}
                        <div className="lg:col-span-1 border-l border-gray-200 dark:border-gray-700 pl-6">
                            <div className="flex items-center gap-2 mb-4">
                                <QuestionCircleOutlined className="text-xl text-blue-500" />
                                <Title level={4} className="mb-0">Frequently Asked Questions</Title>
                            </div>
                            <Collapse
                                accordion
                                bordered={false}
                                expandIconPosition="end"
                                items={faqItems}
                                className="bg-transparent"
                            />
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}