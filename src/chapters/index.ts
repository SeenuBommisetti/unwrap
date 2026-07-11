import React from 'react';
import type { ChapterId } from '../types/experience';
import { IntroChapter } from './IntroChapter';
import { ScannerChapter } from './ScannerChapter';
import { ChallengeChapter } from './ChallengeChapter';
import { CakeChapter } from './CakeChapter';
import { GiftChapter } from './GiftChapter';
import { FinalChapter } from './FinalChapter';

export const CHAPTER_COMPONENTS: Record<ChapterId, React.ComponentType> = {
  intro: IntroChapter,
  scanner: ScannerChapter,
  challenge: ChallengeChapter,
  cake: CakeChapter,
  gift: GiftChapter,
  final: FinalChapter,
};
