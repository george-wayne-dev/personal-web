export type NavigationItem = { href: string; label: string };

export type HeaderProps = {
  mark: string;
  name: string;
  navigation: readonly NavigationItem[];
  current?: string;
};
