import './header.scss';
import { CLASS_OPEN } from './../../tools/classes';

const SELECTOR_CONTAINER = '[data-header]';
const SELECTOR_TOGGLE = '[data-header-toggle]';

/**
 * Retreive the menu.
 * @returns The menu HTML element.
 */
const menuGet = () => document.querySelector<HTMLElement>(SELECTOR_CONTAINER);

/**
 * Opens the menu.
 */
export const menuOpen = () => menuGet()?.classList.add(CLASS_OPEN);

/**
 * Closes the menu.
 */
export const menuClose = () => menuGet()?.classList.remove(CLASS_OPEN);

/**
 * Get menu open state.
 * @returns True if menu is opened, otherwise false.
 */
export const menuIsOpen = () => menuGet()?.classList.contains(CLASS_OPEN);

/**
 * Toggles the state of the menu between opened and closed.
 */
export const menuToggle = () => menuIsOpen() ? menuClose() : menuOpen();


// Add event listeners for buttons.
document.querySelectorAll<HTMLElement>(SELECTOR_TOGGLE).forEach(button => {
  button.addEventListener('click', e => menuToggle());
})