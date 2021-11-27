import userService from "../services/usersService.js";

export function createAuthenticatedUsersOnly(redirectPath) {
    return function authenticatedUsersOnly(ctx, next) {
        if(!userService.isAuthenticated()) {
            ctx.page.redirect(redirectPath);
            return
        }
    
        next();
    }
}

export function createGuestUsersOnlyMiddleware(redirectPath) {
    return function guestUsersOnly(ctx, next) {
        if(userService.isAuthenticated()) {
            ctx.page.redirect(redirectPath);
            return
        }
    
        next();
    }
}