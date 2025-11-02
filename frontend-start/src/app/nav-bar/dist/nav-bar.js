"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NavBar = void 0;
var core_1 = require("@angular/core");
var NavBar = /** @class */ (function () {
    function NavBar() {
        this.showAdminMenu = false;
    }
    // method to open and close dropdown menu
    NavBar.prototype.toggleAdminMenu = function () {
        this.showAdminMenu = !this.showAdminMenu;
    };
    //this Decorator helps the Component to listen any events of DOM of page
    NavBar.prototype.onClickOutside = function (event) {
        var target = event.target;
        if (!target.closest('#adminDropdown')) {
            this.showAdminMenu = false;
        }
    };
    __decorate([
        core_1.HostListener('document:click', ['$event'])
    ], NavBar.prototype, "onClickOutside");
    NavBar = __decorate([
        core_1.Component({
            selector: 'app-nav-bar',
            imports: [],
            templateUrl: './nav-bar.html',
            styleUrl: './nav-bar.css'
        })
    ], NavBar);
    return NavBar;
}());
exports.NavBar = NavBar;
