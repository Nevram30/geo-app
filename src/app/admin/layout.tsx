import { redirect } from 'next/navigation';
import React, { type ReactNode } from 'react';
import { auth } from '~/server/auth';

interface ApplicantUserLayoutProps {
    children: ReactNode;
}

const ApplicantUserLayout: React.FC<ApplicantUserLayoutProps> = async ({ children }) => {
        const session = await auth();
    
        if (!session?.user) {
            redirect("/auth/signin");
        }
    
        if (session.user.role !== "ADMIN") {
            redirect("/");
        }
    return (
        <div className="applicant-user-layout">
            <main>{children}</main>
        </div>
    );
};

export default ApplicantUserLayout;