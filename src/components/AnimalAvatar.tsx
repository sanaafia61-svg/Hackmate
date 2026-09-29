import React from 'react';

const animals = [
  { name: 'Bear', face: '\u{1F43B}', color: '#ead7c4' },
  { name: 'Koala', face: '\u{1F428}', color: '#dce5ea' },
  { name: 'Tiger', face: '\u{1F42F}', color: '#f5d6a4' },
  { name: 'Fox', face: '\u{1F98A}', color: '#f4d2bd' },
  { name: 'Panda', face: '\u{1F43C}', color: '#e3e7e8' },
  { name: 'Rabbit', face: '\u{1F430}', color: '#f0dce2' },
];

const animalForProfile = (profileId: string) => {
  let hash = 0;
  for (let index = 0; index < profileId.length; index += 1) {
    hash = (hash * 31 + profileId.charCodeAt(index)) >>> 0;
  }
  return animals[hash % animals.length];
};

interface AnimalAvatarProps {
  profileId: string;
  name: string;
  className: string;
}

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({ profileId, name, className }) => {
  const animal = animalForProfile(profileId || name);

  return (
    <div
      aria-label={`${animal.name} avatar for ${name}`}
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--avatar-background)] leading-none ${className}`}
      role="img"
      style={{ '--avatar-background': animal.color } as React.CSSProperties}
    >
      <span aria-hidden="true">{animal.face}</span>
    </div>
  );
};