import Home from "../views/Home.svelte";
import NotFoundView from "../views/NotFoundView.svelte";
import Tutorial from "../views/Tutorial.svelte";
import Play from "../views/Play.svelte";
import Rules from "../views/Rules.svelte";

export const routes = {
    "/": Home,
    "/rules": Rules,
    "/play": Play,
    "/training": Tutorial,
    "*": NotFoundView,
};
