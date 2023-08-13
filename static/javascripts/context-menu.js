class ContextMenu {
  constructor(targetId, items) {
    this.targetId = targetId;
    this.items = items;

    this.addStyles();
    this.initializeContextMenu();
  }

  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* CSS styles for the context menu */
    `;
    document.head.appendChild(style);
  }

  initializeContextMenu() {
    const target = document.getElementById(this.targetId);
    target.innerHTML = `
      <div id="context-menu" class="context-menu"></div>
      ${target.innerHTML}
    `;

    this.target = target;
    this.menu = target.querySelector('.context-menu');

    this.target.addEventListener('contextmenu', (e) => this.showContextMenu(e));
    document.addEventListener('click', () => this.hideContextMenu());
  }

  showContextMenu(event) {
    event.preventDefault();

    const x = event.clientX;
    const y = event.clientY;

    this.menu.innerHTML = ''; // Clear existing menu items
    this.menu.style.left = `${x}px`;
    this.menu.style.top = `${y}px`;

    for (const item of this.items) {
      if (item === null) {
        const separator = document.createElement('div');
        separator.classList.add('separator');
        this.menu.appendChild(separator);
      } else {
        const menuItem = document.createElement('div');
        menuItem.textContent = item.text;
        menuItem.addEventListener('click', item.onclick);
        menuItem.classList.add('menu-item');
        
        if (item.disabled) {
          menuItem.classList.add('disabled');
        }

        if (item.hotkey) {
          const hotkeySpan = document.createElement('span');
          hotkeySpan.textContent = item.hotkey;
          hotkeySpan.classList.add('hotkey');
          menuItem.appendChild(hotkeySpan);
        }
        
        this.menu.appendChild(menuItem);
      }
    }

    this.menu.style.display = 'block';
  }

  hideContextMenu() {
    this.menu.style.display = 'none';
  }
}

window.ContextMenu = ContextMenu;