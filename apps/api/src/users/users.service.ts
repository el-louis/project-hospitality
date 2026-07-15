import { Injectable, NotFoundException } from '@nestjs/common';

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: 'guest' | 'user' | 'owner';
  phone?: string;
  location?: string;
  bio?: string;
};

@Injectable()
export class UsersService {
  private readonly profiles = new Map<string, UserProfile>();

  constructor() {
    this.profiles.set('user-demo', {
      id: 'user-demo',
      email: 'guest@example.com',
      fullName: 'Guest User',
      role: 'user',
      phone: '+255712345678',
      location: 'Dar es Salaam',
      bio: 'Guest traveler using the platform.',
    });
  }

  getProfile(id: string): UserProfile {
    const profile = this.profiles.get(id);

    if (!profile) {
      throw new NotFoundException('User profile not found.');
    }

    return profile;
  }

  updateProfile(id: string, updates: Partial<UserProfile>): UserProfile {
    const existing = this.profiles.get(id);

    if (!existing) {
      throw new NotFoundException('User profile not found.');
    }

    const updated = { ...existing, ...updates, id };
    this.profiles.set(id, updated);
    return updated;
  }

  seedProfile(profile: UserProfile) {
    this.profiles.set(profile.id, profile);
  }
}
