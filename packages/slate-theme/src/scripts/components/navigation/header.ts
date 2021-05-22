import { CLASS_OPEN } from './../../tools/classes';

const SELECTOR_CONTAINER = '[data-header]';
const SELECTOR_TOGGLE = '[data-header-toggle]';
const SELECTOR_MENU = '[data-header-menu]';
const SELECTOR_LINK = '[data-header-link]';
const SELECTOR_BACK = '[data-header-back]';

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
export const menuClose = () => {
  const menu = menuGet();
  if(!menu) return;
  menu.classList.remove(CLASS_OPEN);
  menu.querySelectorAll<HTMLDivElement>(SELECTOR_MENU).forEach(e => {
    e.classList.remove(CLASS_OPEN);
  });
}

/**
 * Get menu open state.
 * @returns True if menu is opened, otherwise false.
 */
export const menuIsOpen = () => menuGet()?.classList.contains(CLASS_OPEN);

/**
 * Toggles the state of the menu between opened and closed.
 */
export const menuToggle = () => menuIsOpen() ? menuClose() : menuOpen();


// Add event listeners for toggle menu.
document.querySelectorAll<HTMLElement>(SELECTOR_TOGGLE).forEach(button => {
  button.addEventListener('click', e => menuToggle());
});

// Add event listener for link with subchildren click
document.querySelectorAll<HTMLAnchorElement>(SELECTOR_LINK).forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    link.parentElement?.querySelector(SELECTOR_MENU)?.classList.add(CLASS_OPEN);
  })
})

// Add event listener for submenu back
document.querySelectorAll<HTMLButtonElement>(SELECTOR_BACK).forEach(back => {
  back.addEventListener('click', e => {
    e.preventDefault();
    back.closest(SELECTOR_MENU)?.classList.remove(CLASS_OPEN);
  })
})