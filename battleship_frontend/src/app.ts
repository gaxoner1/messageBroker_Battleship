import { TopicHelper } from "./common/events";
import { gameConfig } from "common/game-config";
import { PLATFORM } from "aurelia-pal";
import { inject } from "aurelia-framework";
import { GameParams } from "common/game-params";

import "./css/style.css";

/**
 * Aurelia Router Object - this object sets the paths for the various pages in the app.
 * @author Thomas Kunnumpurath, Andrew Roberts
 */
@inject(GameParams, TopicHelper)
export class App {
  router: any;

  constructor(gameParams: GameParams, topicHelper: TopicHelper) {
    //Initializing the game params
    gameParams.allowedShips = gameConfig.allowed_ships;
    gameParams.gameboardDimensions = gameConfig.gameboard_dimensions;
    //The Global Prefix for the Solace Battleship Game
    topicHelper.prefix = "SOLACE/BATTLESHIP";
  }

  configureRouter(config, router) {
    config.title = "Battleship";
    config.options.pushState = true; // No # in URL
    config.map([
      { route: "/", moduleId: PLATFORM.moduleName("controller-app/landing-page"), name: "" },
      {
        route: "/join/:player",
        moduleId: PLATFORM.moduleName("player-app/join"),
        name: "join"
      }
    ]);
    this.router = router;
  }

  attached() {
    //Load the particlesJS library by appending an HTML element to the end of the Body - its the only way to load it in
    let script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = 'particlesJS.load("particles-js", "particles.json", null);';
    document.querySelector("body").appendChild(script);
  }
}
