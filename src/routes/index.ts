import Home from "../views/Home.svelte";
import NotFoundView from "../views/NotFoundView.svelte";
import Play from "../views/Play.svelte";
import Rules from "../views/Rules.svelte";

export const routes = {
    "/": Home,
    "/rules": Rules,
    "/play": Play,
    "*": NotFoundView,
};
