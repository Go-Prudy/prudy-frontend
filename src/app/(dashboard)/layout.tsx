import Nav from '../../components/nav';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col w-full">
      <div className="grow h-full">{children}</div>
    </div>
  );
}
