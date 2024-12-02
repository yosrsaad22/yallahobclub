import { currentUser } from '@/lib/auth';
import { roleOptions } from '@/lib/constants';
import { OnBoardingForm } from '../dashboard/forms/on-boarding-form';
import AwaitingDocumentApprovalCard from '../dashboard/cards/awaiting-document-approval-card';

interface OnBoardingGateProps {
  children: React.ReactNode;
}

export const OnBoardingGate = async ({ children }: OnBoardingGateProps) => {
  const user = await currentUser();

  if (user?.boarded === 0 && user?.role !== roleOptions.ADMIN) {
    return (
      <div className="relative h-full">
        <div className="absolute inset-0 z-[15] h-full  overflow-y-auto backdrop-blur-md">
          <div className=" mt-0 animate-fade-in md:mt-4">
            <OnBoardingForm />
          </div>
        </div>
        <div className="h-screen overflow-hidden">{children}</div>
      </div>
    );
  } else if (user?.boarded === 1 && user?.role !== roleOptions.ADMIN) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 z-[15] flex items-center justify-center overflow-y-auto p-6 backdrop-blur-md">
          <div className="animate-fade-in">
            <AwaitingDocumentApprovalCard />
          </div>
        </div>
        <div className="h-screen overflow-hidden">{children}</div>
      </div>
    );
  }
  return <>{children}</>;
};
