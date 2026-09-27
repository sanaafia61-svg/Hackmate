import type { Developer, UserProfile } from '../types';

const normalize = (value: string) => value.trim().toLocaleLowerCase();

const arrayOverlap = (left: string[], right: string[]) => {
  const leftValues = new Set(left.map(normalize).filter(Boolean));
  const rightValues = new Set(right.map(normalize).filter(Boolean));
  if (leftValues.size === 0 || rightValues.size === 0) return 0;

  const matches = [...leftValues].filter((value) => rightValues.has(value)).length;
  return matches / Math.max(leftValues.size, rightValues.size);
};

const experienceSimilarity = (left: string, right: string) => {
  const levels = ['beginner', 'intermediate', 'advanced'];
  const leftLevel = normalize(left);
  const rightLevel = normalize(right);
  if (!leftLevel || !rightLevel) return 0;
  if (leftLevel === rightLevel) return 1;

  const leftIndex = levels.indexOf(leftLevel);
  const rightIndex = levels.indexOf(rightLevel);
  if (leftIndex >= 0 && rightIndex >= 0) return 0.5;
  return 0;
};

const roleCompatibility = (left: string, right: string) => {
  const leftRole = normalize(left);
  const rightRole = normalize(right);
  if (!leftRole || !rightRole) return 0;
  if (leftRole === rightRole) return 1;

  const leftTerms = new Set(leftRole.split(/[^a-z0-9]+/).filter(Boolean));
  const rightTerms = new Set(rightRole.split(/[^a-z0-9]+/).filter(Boolean));
  const sharedTerms = [...leftTerms].filter((term) => rightTerms.has(term)).length;
  return sharedTerms / Math.max(leftTerms.size, rightTerms.size);
};

export const calculateCompatibility = (profile: UserProfile, developer: Developer) => {
  const score =
    arrayOverlap(profile.skills, developer.allSkills) * 40 +
    arrayOverlap(profile.interests, developer.interests || []) * 25 +
    experienceSimilarity(profile.experienceLevel, developer.experienceLevel) * 15 +
    roleCompatibility(profile.seekingRole, developer.seekingRoles || '') * 20;

  return Math.round(Math.max(0, Math.min(100, score)));
};