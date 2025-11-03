import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';



@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar {
    showAdminMenu = false;
    
  
  // method to open and close dropdown menu
  toggleAdminMenu() {
    this.showAdminMenu = !this.showAdminMenu;
  }
  
  //this Decorator helps the Component to listen any events of DOM of page
  @HostListener('document:click', ['$event'])
  onClickOutside(event:Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('#adminDropdown')) {
      this.showAdminMenu = false;
    }
  }
}
