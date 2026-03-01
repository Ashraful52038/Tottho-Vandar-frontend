// components/layout/Header.tsx (আপনার হেডার কম্পোনেন্ট)
import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Link from 'next/link';

// নেভবারের মধ্যে যোগ করুন:
<Link href="/posts/create">
  <Button type="primary" icon={<EditOutlined />} className="bg-green-600 hover:bg-green-700">
    Write
  </Button>
</Link>