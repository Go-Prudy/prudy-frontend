import Image from 'next/image';
import ListIllustration from 'list.png';

export default function NoBudgetHistory() {
  return (
    <div className="flex flex-col items-center gap-4 w-72 mx-auto my-16">
      <Image
        src="/list.png"
        alt="List illustration image showing empty budget history"
        width={123.44}
        height={123.44}
      />

      <div className="flex flex-col gap-2 text-center">
        <p className="font-medium text-graySubtitle">
          You do not have any budget history yet.
        </p>
        <p className="text-grayCaption w-[222px] mx-auto text-sm">
          Click the create button above to get started.
        </p>
      </div>
    </div>
  );
}
