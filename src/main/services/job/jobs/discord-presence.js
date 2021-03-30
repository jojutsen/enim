import _ from 'lodash';

const CLIENT_ID = '781044799716720680';

import RPC from "discord-rpc";
import Job from "../job";

import PresenceConstants from "../../../../shared/presence/presence-constants";
import PresenceState from "../../../../shared/presence/presence-state";

export default class DiscordPresence extends Job {
  constructor(props) {
    super(props);
  }

  name() {
    return "Discord RPC";
  }

  cron() {
    return null;
  }

  async run() {
    RPC.register(CLIENT_ID);

    const store = global.store;

    let prevPresenceData;

    store.subscribe(() => {
      let data = store.getState()['current-presence'], state = data.state;

      if (data && !_.isEqual(prevPresenceData, data)) {
        let statusText = PresenceConstants.STATUS_TO_STATE[state];
        switch (state) {
          case PresenceState.WATCHING_ANIME:
            statusText = `${data.player.anime.title} Episode ${data.player.anime.episode}`;
            break;
          default:
            break;
        }

        let activity = {
          details: PresenceConstants.STATUS_TO_STATE[state],
          state: statusText,
          largeImageKey: PresenceConstants.IMAGE_KEY,
          largeImageText: PresenceConstants.LARGE_TEXT,
          ...(state === PresenceState.WATCHING_ANIME && { smallImageKey: !data.player.paused ? PresenceConstants.PLAYER_ICON_PAUSE : PresenceConstants.PLAYER_ICON_PLAY } ),
          smallImageText: state === PresenceState.WATCHING_ANIME ? (data.player.paused ? PresenceConstants.PLAYER_PAUSED : PresenceConstants.PLAYER_WATCHING) : PresenceConstants.SMALL_TEXT,
          instance: false,
        };

        if (state === PresenceState.WATCHING_ANIME) {
          if (data.startTimestamp) activity.startTimestamp = data.startTimestamp;
          if (data.endTimestamp) activity.endTimestamp = data.endTimestamp;
        }

        if (activity) client.setActivity(activity)

        prevPresenceData = data;
      }
    })

    const client = new RPC.Client({ transport: 'ipc' });

    client.on('ready', () => {
      let startTimestamp = new Date();
      client.setActivity({
        state: PresenceConstants.STATUS_TO_STATE[PresenceState.IDLE],
        startTimestamp,
        largeImageKey: PresenceConstants.IMAGE_KEY,
        largeImageText: PresenceConstants.LARGE_TEXT,
        smallImageText: PresenceConstants.SMALL_TEXT,
        instance: false,
      })
    });

    client.login({
      clientId: CLIENT_ID
    });
  }
}
