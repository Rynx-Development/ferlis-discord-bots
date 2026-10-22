import {Client,GatewayIntentBits,EmbedBuilder,ActionRowBuilder,ButtonBuilder,ButtonStyle} from 'discord.js';
import {openStore} from './core.js';
const client=new Client({intents:[GatewayIntentBits.Guilds]}),db=openStore(process.env.DATA_DIR||'./data');
try{
 await client.login(process.env.UTILITY_TOKEN);
 const channel=await client.channels.fetch('1562499165332967605');
 if(channel.guildId!==process.env.GUILD_ID)throw Error('Wrong server');
 const invite=db.prepare("SELECT value FROM settings WHERE key='server-invite'").get()?.value;
 if(!invite?.startsWith('https://discord.gg/'))throw Error('Missing permanent server invite');
 const key='brand:discord-link-panel',saved=db.prepare('SELECT value FROM settings WHERE key=?').get(key)?.value;
 const payload={content:'Welcome to **Ferlis**!',embeds:[],components:[],allowedMentions:{parse:[]}};
 const old=saved?await channel.messages.fetch(saved).catch(()=>null):null;
 if(!old)throw Error('No extra welcome panel to restore. No new message posted.');
 const message=await old.edit(payload);
 db.prepare('INSERT INTO settings VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').run(key,message.id);
 console.log('NORMAL_WELCOME_RESTORED '+message.url);
}finally{db.close();client.destroy();}
