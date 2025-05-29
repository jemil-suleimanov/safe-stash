export class SessionStore {
    private currentUserId: number | null = null;

    public setUserID(id: number) {
        this.currentUserId = id;
    }

    public getUserID(): number | null {
        return this.currentUserId;
    }

    public clearID() {
        this.currentUserId = null;
    }

    public isAuthenticated(): boolean {
        return this.currentUserId !== null;
    }
}

export const sessionStore = new SessionStore();
