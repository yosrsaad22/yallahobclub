export type ActionResponse = {
  error?: string;
  success?: string;
  data?: any;
};

export type NavItem = {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
};
