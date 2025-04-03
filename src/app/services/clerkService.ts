import { Injectable, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import {
    ActiveSessionResource, Clerk, ClerkOptions, ClientResource, CreateOrganizationProps,
    InviteMemberParams,
    OrganizationProfileProps, OrganizationResource, SignInProps, SignInRedirectOptions,
    SignUpProps, SignUpRedirectOptions, UserProfileProps, UserResource, Without
} from '@clerk/types';
import { ReplaySubject, take } from 'rxjs';
import { ClerkInitOptions } from '../utils/type';
import { loadClerkJsScript } from '../utils/loadClerkJsScript';

interface HeadlessBrowserClerk extends Clerk {
    load: (opts?: Without<ClerkOptions, 'isSatellite'>) => Promise<void>;
    updateClient: (client: ClientResource) => void;
}

interface BrowserClerk extends HeadlessBrowserClerk {
    onComponentsReady: Promise<void>;
    components: any;
}

declare global {
    interface Window {
        Clerk?: HeadlessBrowserClerk | BrowserClerk;
    }
}

@Injectable({
    providedIn: 'root'
})

export class ClerkService {
    public readonly clerk$: ReplaySubject<HeadlessBrowserClerk | BrowserClerk> = new ReplaySubject(1);
    public readonly client$: ReplaySubject<ClientResource | undefined> = new ReplaySubject(1);
    public readonly session$: ReplaySubject<ActiveSessionResource | undefined | null> = new ReplaySubject(1);
    public readonly user$: ReplaySubject<UserResource | undefined | null> = new ReplaySubject(1);
    public readonly organization$: ReplaySubject<OrganizationResource | undefined | null> = new ReplaySubject(1);

    private _initialized: boolean = false;

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private _router: Router,
        private _ngZone: NgZone
    ) { }

    public __init(options: ClerkInitOptions) {
        if (!isPlatformBrowser(this.platformId)) {
            return; // Can only be used in a browser
        }
        if (this._initialized) {
            console.warn('ClerkService already initialized');
            return;
        }
        this._initialized = true;

        loadClerkJsScript(options).then(async () => {
            if (!window.Clerk) {
                console.error('Clerk failed to load.');
                return;
            }

            await window.Clerk.load({
                routerPush: (to: string) => this._ngZone.run(() => {
                    const url = new URL(to.replace('#/', ''), 'http://dummy.clerk');
                    const queryParams: Record<string, string> = {};
                    url.searchParams.forEach((value, key) => {
                        queryParams[key] = value;
                    });
                    return this._router.navigate([url.pathname], { queryParams });
                }),
                
                routerReplace: (to: string) => this._ngZone.run(() => {
                    const url = new URL(to.replace('#/', ''), 'http://dummy.clerk');
                    const queryParams: Record<string, string> = {};
                    url.searchParams.forEach((value, key) => {
                        queryParams[key] = value;
                    });
                    return this._router.navigate([url.pathname], { queryParams, replaceUrl: true });
                }),
                
                ...options
            });

            if (window.Clerk) {
                this.clerk$.next(window.Clerk);
                this.client$.next(window.Clerk.client);
                this.user$.next(window.Clerk.user);
                this.organization$.next(window.Clerk.organization);

                // Ensure session is active before assigning
                this.session$.next(window.Clerk.session?.status === 'active' ? window.Clerk.session : null);

                window.Clerk.addListener((resources) => {
                    this.client$.next(resources.client);
                    this.session$.next(resources.session?.status === 'active' ? resources.session : null);
                    this.user$.next(resources.user);
                    this.organization$.next(resources.organization);
                    this.clerk$.next(window.Clerk!);
                });
            }
        }).catch(err => {
            console.error('Error loading Clerk:', err);
        });
    }

    private getClerkInstance(): HeadlessBrowserClerk | BrowserClerk | undefined {
        return typeof window !== 'undefined' ? window.Clerk : undefined;
    }

    public updateAppearance(opts: ClerkOptions['appearance']) {
        const clerk = this.getClerkInstance();
        if (clerk) (clerk as any).__unstable__updateProps({ appearance: opts });
    }

    public updateLocalization(opts: ClerkOptions['localization']) {
        const clerk = this.getClerkInstance();
        if (clerk) (clerk as any).__unstable__updateProps({ localization: opts });
    }

    public openSignIn(opts?: SignInProps) {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.openSignIn(opts);
    }

    public closeSignIn() {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.closeSignIn();
    }

    public openSignUp(opts?: SignUpProps) {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.openSignUp(opts);
    }

    public closeSignUp() {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.closeSignUp();
    }

    public openUserProfile(opts?: UserProfileProps) {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.openUserProfile(opts);
    }

    public closeUserProfile() {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.closeUserProfile();
    }

    public openOrganizationProfile(opts?: OrganizationProfileProps) {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.openOrganizationProfile(opts);
    }

    public closeOrganizationProfile() {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.closeOrganizationProfile();
    }

    public openCreateOrganization(opts?: CreateOrganizationProps) {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.openCreateOrganization(opts);
    }

    public closeCreateOrganization() {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.closeCreateOrganization();
    }

    public redirectToSignIn(opts?: SignInRedirectOptions) {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.redirectToSignIn(opts);
    }

    public redirectToSignUp(opts?: SignUpRedirectOptions) {
        const clerk = this.getClerkInstance();
        if (clerk) clerk.redirectToSignUp(opts);
    }

    public inviteMembers(opts : InviteMemberParams){
        const clerk = this.getClerkInstance();
        if(clerk) clerk.organization?.addMember
    }
      
    
}
