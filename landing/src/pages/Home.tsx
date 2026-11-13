import { Hero } from '../components/Hero';
import { Marquee } from '../components/Marquee';
import { ComingSoon } from '../components/ComingSoon';
import { Sponsors } from '../components/Sponsors';

export function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <ComingSoon />
      <Sponsors />
    </>
  );
}
