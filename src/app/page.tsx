import OnboardingSlides from '@/components/home/onboarding-slides';

export default function Home() {
  return (
    //  make this only shrink to a mobile view when its on a desktop screen that its should be centerd at the middle of the screen
    <div className="w-full max-w-[500px] mx-auto">
      <OnboardingSlides />
      {/* test */}
    </div>
  );
}
