import { CLASS_OPEN, CLASS_STICKY } from './../../tools/classes';

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
  menu.querySelectorAll(SELECTOR_MENU).forEach(e => {
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

// Init the header
document.querySelectorAll(SELECTOR_CONTAINER).forEach(container => {
  // On toggle click, menu toggle.
  container.querySelectorAll(SELECTOR_TOGGLE).forEach(element => {
    element.addEventListener('click', menuToggle);
  });

  // Link, find parent, get menu, add class
  container.querySelectorAll(SELECTOR_LINK).forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      link.parentElement?.
        querySelector(SELECTOR_MENU)?.classList.add(CLASS_OPEN)
      ;
    }); 
  });

  // Submenu back click event listener
  container.querySelectorAll(SELECTOR_BACK).forEach(back => {
    back.addEventListener('click', e => {
      e.preventDefault();
      back.closest(SELECTOR_MENU)?.classList.remove(CLASS_OPEN);
    });
  });
});