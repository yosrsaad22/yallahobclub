import { currentUser } from '@/lib/auth';
import { roleOptions } from '@/lib/constants';
import { OnBoardingForm1 } from '../dashboard/forms/on-boarding-one-form';
import { OnBoardingForm2 } from '../dashboard/forms/on-boarding-two-form';
import { OnBoardingForm3 } from '../dashboard/forms/on-boarding-three-form';

interface OnBoardingGateProps {
  children: React.ReactNode;
}

export const OnBoardingGate = async ({ children }: OnBoardingGateProps) => {
  const user = await currentUser();

  if (user?.role !== roleOptions.ADMIN) {
    const renderOnboardingForm = () => {
      switch (user?.onBoarding) {
        case 0:
          return <OnBoardingForm1 />;
        case 1:
          return <OnBoardingForm2 />;
        case 2:
          return <OnBoardingForm3 />;
        case 3:
          return children;
        default:
          return children;
      }
    };

    if (user?.onBoarding !== undefined && user?.onBoarding < 3) {
      return (
        <div className="relative h-full overflow-hidden">
          <div className="absolute inset-0 z-[15] h-full overflow-y-auto backdrop-blur-md">
            <div className="animate-fade-in flex min-h-full items-center justify-center">{renderOnboardingForm()}</div>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
