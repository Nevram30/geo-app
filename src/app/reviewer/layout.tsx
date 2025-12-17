import { redirect } from 'next/navigation';
import React, { type ReactNode } from 'react';
import { auth } from '~/server/auth';

interface ReviewerLayoutProps {
    children: ReactNode;
}

const ReviewerLayout: React.FC<ReviewerLayoutProps> = async ({ children }) => {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/signin");
    }

    if (session.user.role !== "REVIEWER") {
        redirect("/");
    }
    return (
        <div className="reviewer-layout">
            <main>{children}</main>
        </div>
    );
};

export default ReviewerLayout;
