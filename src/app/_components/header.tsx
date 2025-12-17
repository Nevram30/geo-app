import React from 'react';
import { auth } from '~/server/auth';
import SignOutButton from './sign-out-button';
import AuthButtons from './auth-buttons';

const MainHeader = async () => {
    const session = await auth();
    return (
        <>
            {/* Header */}
            <header className="border-b border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30">
                                <svg className="h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">ZoniTrack+</h1>
                                <p className="text-xs font-medium text-slate-500">Applicant Dashboard</p>
                            </div>
                        </div>
                        {session?.user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="text-sm font-medium text-slate-900">{session.user.name ?? ''}</p>
                                    <p className="text-xs text-slate-500">{session.user.email ?? ''}</p>
                                </div>
                                <SignOutButton />
                            </div>
                        ) : (
                            <AuthButtons />
                        )}
                    </div>
                </div>
            </header>
        </>
    );
};

export default MainHeader;
