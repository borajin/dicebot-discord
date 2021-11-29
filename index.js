const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const lodash = require('lodash');

const prefix = `/r `;


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

client.on('ready', () => {
    client.user.setActivity('/r 2d6<10 처럼 사용하세요!!', { type: 'WATCHING' });
})

client.on("message", function (message) {

    // message 작성자가 봇이면 그냥 return
    if (message.author.bot) return;
    // message 시작이 prefix가 아니면 return
    if (!message.content.startsWith(prefix)) return;

    //수식과 텍스트 분리
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const diceCommand = args[0]; //수식

    //d 인지 D 인지 
    const dice = diceCommand.includes('d') ? 'd' : diceCommand.includes('D') ? 'D' : 'null';
    const diceArgs = diceCommand.split(dice); //1은 회수, 2는 숫자

    //부등호 추출
    const sign = diceArgs[1].includes('<') ? '<' : diceArgs[1].includes('>') ? '>' : '';
    let number = sign !== '' ? diceArgs[1].split(sign)[1] : '';

    //난수 생성
    const result = [];
    let successText = '';

    for (let i = 0; i < parseInt(diceArgs[0] == '' ? '1' : diceArgs[0]); i++) {
        const rand = randomInt(parseInt(diceArgs[0]), parseInt(diceArgs[1]));
        result.push(rand);
    }

    const sum = lodash.sum(result);

    if (sign == '<') successText = sum <= number ? "success" : "fail";
    else if (sign == '>') successText = sum >= number ? "success" : "fail";


    let colorCode = "#" + Math.round(Math.random() * 0xffffff).toString(16);
    const embed = new MessageEmbed().setColor(colorCode).setTitle(message.content).setDescription(`(${result.join('+')})\n= ${sum} ${successText}`).setAuthor(message.author.username, message.author.displayAvatarURL())

    message.channel.send({ embeds: [embed] });

});

client.login(process.env.BOT_TOKEN);
