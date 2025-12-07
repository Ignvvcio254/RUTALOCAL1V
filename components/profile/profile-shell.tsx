'use client';

import { useState, Suspense, lazy } from 'react';
import { User } from '@/lib/profile';
import { ProfileHeader, ProfileSidebar } from './shared';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load sections
const PersonalInfoSection = lazy(() =>
  import('./personal/personal-info-section').then(mod => ({ default: mod.PersonalInfoSection }))
);
const PreferencesSection = lazy(() =>
  import('./preferences/preferences-section').then(mod => ({ default: mod.PreferencesSection }))
);
const PrivacySection = lazy(() =>
  import('./privacy/privacy-section').then(mod => ({ default: mod.PrivacySection }))
);
const ActivitySection = lazy(() =>
  import('./activity/activity-section').then(mod => ({ default: mod.ActivitySection }))
);

interface ProfileShellProps {
  user: User;
  onUpdateProfile: (data: any) => Promise<void>;
  onUpdateAvatar: (file: File) => Promise<void>;
  onRemoveAvatar: () => Promise<void>;
  onUpdatePreferences: (data: any) => Promise<void>;
  onUpdatePrivacy: (data: any) => Promise<void>;
}

function SectionLoader() {
  return (
    <div className="space-y-4">
      <div className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
      <div className="h-96 bg-gray-100 animate-pulse rounded-2xl" />
    </div>
  );
}

export function ProfileShell({
  user,
  onUpdateProfile,
  onUpdateAvatar,
  onRemoveAvatar,
  onUpdatePreferences,
  onUpdatePrivacy,
}: ProfileShellProps) {
  const [activeSection, setActiveSection] = useState('personal');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <ProfileHeader user={user} />

        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-2">
            <ProfileSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />
          </aside>

          {/* Content */}
          <main>
            <Suspense fallback={<SectionLoader />}>
              {activeSection === 'personal' && (
                <PersonalInfoSection
                  user={user}
                  onUpdateProfile={onUpdateProfile}
                  onUpdateAvatar={onUpdateAvatar}
                  onRemoveAvatar={onRemoveAvatar}
                />
              )}
              {activeSection === 'preferences' && (
                <PreferencesSection
                  user={user}
                  onUpdatePreferences={onUpdatePreferences}
                />
              )}
              {activeSection === 'privacy' && (
                <PrivacySection
                  user={user}
                  onUpdatePrivacy={onUpdatePrivacy}
                />
              )}
              {activeSection === 'activity' && (
                <ActivitySection userId={user.id} />
              )}
            </Suspense>
          </main>
        </div>

        {/* Mobile Layout with Tabs */}
        <div className="lg:hidden">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Info</TabsTrigger>
              <TabsTrigger value="preferences">Prefs</TabsTrigger>
              <TabsTrigger value="privacy">Privac</TabsTrigger>
              <TabsTrigger value="activity">Activ</TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <Suspense fallback={<SectionLoader />}>
                <TabsContent value="personal">
                  <PersonalInfoSection
                    user={user}
                    onUpdateProfile={onUpdateProfile}
                    onUpdateAvatar={onUpdateAvatar}
                    onRemoveAvatar={onRemoveAvatar}
                  />
                </TabsContent>
                <TabsContent value="preferences">
                  <PreferencesSection
                    user={user}
                    onUpdatePreferences={onUpdatePreferences}
                  />
                </TabsContent>
                <TabsContent value="privacy">
                  <PrivacySection
                    user={user}
                    onUpdatePrivacy={onUpdatePrivacy}
                  />
                </TabsContent>
                <TabsContent value="activity">
                  <ActivitySection userId={user.id} />
                </TabsContent>
              </Suspense>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
