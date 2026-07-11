import { useContext } from 'react';
import { ExperienceContext } from '../context/ExperienceContext';
import type { ExperienceContextType } from '../types/experience';

export const useExperience = (): ExperienceContextType => {
  const context = useContext(ExperienceContext);
  if (context === undefined) {
    throw new Error('useExperience must be used within an ExperienceProvider');
  }
  return context;
};
