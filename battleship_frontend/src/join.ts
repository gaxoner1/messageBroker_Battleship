import { Player, PlayerJoined, TopicHelper, GameStart } from "./common/events";
import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { SolaceClient } from "common/solace-client";

/**
 * Class that represents the Join screen for the player
 * @author Thomas Kunnumpurath
 */
@inject(Router, SolaceClient, Player, TopicHelper, GameStart)
export class Join {
  pageState = "PLAYER_DETAILS"; // PLAYER_DETAILS => WAITING
  playerNickname: string = null;

  constructor(private router: Router, private solaceClient: SolaceClient, private player: Player, private topicHelper: TopicHelper, private gameStart: GameStart) {}

  /**
   * Aurelia function that is called once route is activated
   * @param params
   * @param routeConfig
   */
  activate(params, routeConfig) {
    //Connect to the message broker and listen for the game start event
    this.connectToSolace()
      .then(() => {
        console.log("Connected to Solace");
      })
      .catch(ex => {
        console.log(ex);
      });

    //Set the name for the player from the route parameter
    this.player.name = params.player;
  }

  async connectToSolace() {
    await this.solaceClient.connect();
  }

  /**
   * Function to join a game - asks for the Player's name before continuing
   */
  joinGame() {
    if (!this.playerNickname) {
      alert("Please enter a nickname before continuing");
      return;
    }

    this.player.nickname = this.playerNickname;
    let playerJoined: PlayerJoined = new PlayerJoined();
    playerJoined.playerName = this.player.name;
    playerJoined.playerNickname = this.playerNickname;
    //Publish a join event and change the pageState to waiting
    let topicName: string = `${this.topicHelper.prefix}/JOIN/${this.player.name}`;
    this.solaceClient.publish(topicName, JSON.stringify(playerJoined));

    this.pageState = "WAITING";
  }

  detached() {}
}
