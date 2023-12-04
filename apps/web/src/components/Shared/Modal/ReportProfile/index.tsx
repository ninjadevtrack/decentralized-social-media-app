import type { Profile } from '@hey/lens';

import UserProfile from '@components/Shared/UserProfile';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { PROFILE } from '@hey/data/tracking';
import { Button, Card, Form, Radio, TextArea, useZodForm } from '@hey/ui';
import { Leafwatch } from '@lib/leafwatch';
import { type FC } from 'react';
import toast from 'react-hot-toast';
import { useGlobalModalStateStore } from 'src/store/non-persisted/useGlobalModalStateStore';
import { object, string, z } from 'zod';

const ReportType = z.enum(['MISLEADING_ACCOUNT', 'UNWANTED_CONTENT']);

const reportReportProfileSchema = object({
  description: string()
    .max(300, {
      message: 'Report should not exceed 300 characters'
    })
    .optional(),
  type: ReportType
});

interface ReportProfileProps {
  profile: null | Profile;
}

const ReportProfile: FC<ReportProfileProps> = ({ profile }) => {
  const setShowReportProfileModal = useGlobalModalStateStore(
    (state) => state.setShowReportProfileModal
  );

  const form = useZodForm({
    schema: reportReportProfileSchema
  });

  return (
    <div className="flex flex-col space-y-2 p-5">
      <Form
        className="space-y-4"
        form={form}
        onSubmit={() => {
          const data = form.getValues();
          const { description, type } = data;
          Leafwatch.track(PROFILE.REPORT_PROFILE, {
            type,
            ...(description && { description }),
            profile: profile?.id
          });
          setShowReportProfileModal(false, null);
          toast.success('Reported Successfully!');
        }}
      >
        {profile ? (
          <Card className="p-3">
            <UserProfile profile={profile as Profile} showUserPreview={false} />
          </Card>
        ) : null}

        <div className="space-y-5">
          <Radio
            description="Impersonation or false claims about identity or affiliation"
            heading={<span className="font-medium">Misleading Account</span>}
            value={ReportType.Enum.MISLEADING_ACCOUNT}
            {...form.register('type')}
            checked={form.watch('type') === ReportType.Enum.MISLEADING_ACCOUNT}
            onChange={() => {
              form.setValue('type', ReportType.Enum.MISLEADING_ACCOUNT);
            }}
          />
          <Radio
            description="Spam; excessive mentions or replies"
            heading={
              <span className="font-medium">
                Frequently Posts Unwanted Content
              </span>
            }
            value={ReportType.Enum.UNWANTED_CONTENT}
            {...form.register('type')}
            checked={form.watch('type') === ReportType.Enum.UNWANTED_CONTENT}
            onChange={() => {
              form.setValue('type', ReportType.Enum.UNWANTED_CONTENT);
            }}
          />
        </div>
        <div className="divider my-5" />
        <div>
          <TextArea
            label="Add details to report"
            placeholder="Enter a reason or any other details here..."
            {...form.register('description')}
          />
        </div>
        <Button
          className="flex w-full justify-center"
          disabled={!form.watch('type')}
          icon={<PencilSquareIcon className="h-4 w-4" />}
          type="submit"
          variant="primary"
        >
          Report
        </Button>
      </Form>
    </div>
  );
};

export default ReportProfile;
