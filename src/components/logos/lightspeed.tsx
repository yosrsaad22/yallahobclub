import Image from 'next/image';
export const LightSpeedLogo = ({ className }: { className?: string }) => (
  <Image
    src="/img/lightspeed-white-horizontal.png"
    className="mx-4"
    height={50}
    width={230}
    alt="LightSpeed Logo"></Image>
);
