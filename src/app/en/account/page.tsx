import React from 'react';
import type { Metadata } from 'next';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import AccountContent from '../../../components/AccountContent';
import styles from './account.module.css';

export const metadata: Metadata = {
  title: 'Account — Coffee Esto Roastery',
  description: 'Sign in to your Coffee Esto account or create a new one.',
};

export default function AccountPage() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar locale="en" />
      <AccountContent locale="en" />
      <Footer locale="en" />
    </div>
  );
}
