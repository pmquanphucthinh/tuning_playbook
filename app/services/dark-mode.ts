import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { registerDestructor } from '@ember/destroyable';
import type RouterService from '@ember/routing/router-service';
import type LocalStorageService from 'codecrafters-frontend/services/local-storage';
import RouteInfoMetadata, { RouteColorSchemes } from 'codecrafters-frontend/utils/route-info-metadata';
import type RouteInfo from '@ember/routing/route-info';

const LOCAL_STORAGE_KEY = 'dark-mode-preference';

export type UpdateListener = (isEnabled: boolean) => void;

export type LocalStoragePreference = 'system' | 'dark' | 'light' | null;
export type SystemPreference = 'dark' | 'light';

export default class DarkModeService extends Service {
  @service declare router: RouterService;
  @service declare localStorage: LocalStorageService;

  /**
   * Currently loaded localStorage preference value
   */
  @tracked localStoragePreference?: LocalStoragePreference;

  /**
   * Currently loaded system preference value
   */
  @tracked systemPreference?: SystemPreference;

  /**
   * Callback methods currently registered as listeners to Dark Mode environment changes
   * @private
   */
  #registeredListeners: UpdateListener[] = [];

  constructor(properties: object | undefined) {
    super(properties);

    // Load the localStorage preference from localStorage service
    this.localStoragePreference = this.localStorage.getItem(LOCAL_STORAGE_KEY) as LocalStoragePreference;

    // Create a media query to load current system Dark Mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Create a listener for media query result changes
    const mqChangeListener = (e: MediaQueryListEvent) => {
      this.systemPreference = e.matches ? 'dark' : 'light';
      this.invokeUpdateListeners();
    };

    // Load the current system preference by executing the media query
    this.systemPreference = mediaQuery.matches ? 'dark' : 'light';

    // Subscribe to media query result changes
    mediaQuery.addEventListener('change', mqChangeListener);

    // Unsubscribe from media query changes when service is destroyed
    registerDestructor(this, () => {
      mediaQuery.removeEventListener('change', mqChangeListener);
    });
  }

  /**
   * Indicates whether Dark Mode is currently enabled: either because visiting a
   * "dark route", or derived from localStorage & system preference
   */
  get isEnabled(): boolean {
    return this.#isVisitingDarkModeSupportingRoute && (this.#isVisitingDarkRoute || this.#isEnabledViaPreferences);
  }

  /**
   * Returns whether Dark Mode should be enabled based on localStorage & system preference
   * @private
   */
  get #isEnabledViaPreferences(): boolean {
    return this.localStoragePreference === 'dark' || (this.localStoragePreference === 'system' && this.systemPreference === 'dark');
  }

  /**
   * Returns whether current route supports Dark Mode
   * TODO: Make all routes support dark mode and remove this getter
   * @private
   */
  get #isVisitingDarkModeSupportingRoute(): boolean {
    let currentRoute: RouteInfo | null = this.router.currentRoute;

    while (currentRoute) {
      if (
        currentRoute.metadata instanceof RouteInfoMetadata &&
        (currentRoute.metadata.colorScheme === RouteColorSchemes.Dark || currentRoute.metadata.colorScheme === RouteColorSchemes.Both)
      ) {
        return true;
      }

      currentRoute = currentRoute.parent;
    }

    return false;
  }

  /**
   * Returns whether Dark Mode should be enabled because the user is visiting a "dark route"
   * @private
   */
  get #isVisitingDarkRoute(): boolean {
    let currentRoute: RouteInfo | null = this.router.currentRoute;

    while (currentRoute) {
      if (currentRoute.metadata instanceof RouteInfoMetadata && currentRoute.metadata.colorScheme === RouteColorSchemes.Dark) {
        return true;
      }

      currentRoute = currentRoute.parent;
    }

    return false;
  }

  /**
   * Invokes all currently registered update listeners, passing them a new value
   */
  @action invokeUpdateListeners() {
    for (const listener of this.#registeredListeners) {
      listener(this.isEnabled);
    }
  }

  /**
   * Registers a callback to invoke when Dark Mode environment changes
   * @param listener method to invoke, new boolean value will be passed as first argument
   */
  @action registerUpdateListener(listener: UpdateListener) {
    this.#registeredListeners.push(listener);
  }

  /**
   * Unregisters a callback previsouly registered with `registerUpdateListener`
   * @param listener method to unregister, must be exactly the same instance, compared using `===`
   */
  @action unregisterUpdateListener(listener: UpdateListener) {
    if (this.#registeredListeners.includes(listener)) {
      this.#registeredListeners.removeAt(this.#registeredListeners.indexOf(listener));
    }
  }

  /**
   * Writes the new Dark Mode preference to localStorage and executes all currently
   * registered update listeners, passing them a new value
   * @param {'system'|'dark'|'light'|null} newValue New dark mode preference
   */
  @action updateLocalStoragePreference(newValue?: LocalStoragePreference) {
    if (!newValue) {
      this.localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      this.localStorage.setItem(LOCAL_STORAGE_KEY, newValue);
    }

    this.localStoragePreference = newValue;
    this.invokeUpdateListeners();
  }
}

declare module '@ember/service' {
  interface Registry {
    'dark-mode': DarkModeService;
  }
}
