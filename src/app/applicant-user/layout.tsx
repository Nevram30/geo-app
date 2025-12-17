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

    if (session.user.role !== "APPLICANT") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
};

export default ApplicantUserLayout;
