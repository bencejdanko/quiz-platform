import { describe, it, expect } from 'vitest';

interface Session {
    user?: {
        name?: string | null;
        image?: string | null;
    }
}

export function getAuthUIState(session: Session | null) {
    if (!session || !session.user) {
        return {
            type: 'login',
            icon: 'github',
            label: 'Login'
        };
    }
    return {
        type: 'profile',
        image: session.user.image,
        name: session.user.name,
        label: 'Sign out'
    };
}

describe('Auth UI Logic', () => {
    it('should return login state when no session exists', () => {
        const state = getAuthUIState(null);
        expect(state.type).toBe('login');
        expect(state.label).toBe('Login');
    });

    it('should return profile state when session exists', () => {
        const session = { user: { name: 'Test User', image: 'https://example.com/avatar.png' } };
        const state = getAuthUIState(session);
        expect(state.type).toBe('profile');
        expect(state.image).toBe('https://example.com/avatar.png');
    });
});
