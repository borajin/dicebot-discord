const { Client, Intents, MessageEmbed } = require("discord.js");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const lodash = require("lodash");

const prefix = `/r `;

const solveDexp = (dExp) => {
  const args = dExp.split(/d/i);
  const results = [];

  for (let i = 0; i < Number(args[0] === "" ? 1 : args[0]); i++) {
    const rand = randomInt(1, Number(args[1]));
    results.push(rand);
  }

  return results;
};

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

client.on("ready", () => {
  client.user.setActivity("/r 2d6<10 처럼 사용하세요!!", { type: "WATCHING" });
});

client.on("message", function (message) {
  // message 작성자가 봇이면 그냥 return
  if (message.author.bot) return;
  // message 시작이 prefix가 아니면 return
  if (!message.content.startsWith(prefix)) return;

  //수식과 텍스트 분리
  const command = message.content.slice(prefix.length).replace(" ", "").trim();

  if (command.match(/<|>/g) === null || command.match(/<|>/g)?.length === 1) {
    const commandArgs = command.split(/<|>/);

    if (
      !commandArgs[0].replace(/\+|-|\*|\/|d|D|\d/g, "") === "" ||
      commandArgs[1].match(/^\d*/)[0] === ""
    ) {
      message.channel.send(
        "사용법 : /r 2d5+2d6<10 text 와 같이 부등호는 한개, 부등호 앞은 수식, 부등호 뒤는 숫자를 넣어주세요."
      );
    } else {
      const sign = command.match(/<|>/)[0];
      const oriDexps = commandArgs[0].match(/\d*d\d*/gi);
      const signNum = commandArgs[1].match(/^\d*/)[0];
      const text = commandArgs[1].slice(signNum.length);

      //수식 계산
      const resutls = oriDexps.map((item, index) => {
        const resultArr = solveDexp(item);

        commandArgs[0] = commandArgs[0].replace(
          oriDexps[index],
          resultArr.reduce((sum, curValue) => sum + curValue)
        );

        return resultArr;
      });

      const diceResult = Math.round(eval(commandArgs[0]));

      if (sign === "<")
        successText = diceResult <= Number(signNum) ? "success" : "fail";
      else if (sign === ">")
        successText = diceResult >= Number(signNum) ? "success" : "fail";

      let colorCode = "#" + Math.round(Math.random() * 0xffffff).toString(16);
      const embed = new MessageEmbed()
        .setColor(colorCode)
        .setTitle(message.content)
        .setDescription(`(${resutls})\n= ${diceResult} ${successText}`)
        .setAuthor(message.author.username, message.author.displayAvatarURL());

      message.channel.send({ embeds: [embed] });
    }
  } else {
    message.channel.send(
      "사용법 : /r 2d5+2d6<10 text 와 같이 부등호는 한개, 부등호 앞은 수식, 부등호 뒤는 숫자를 넣어주세요."
    );
  }
});

client.login(process.env.BOT_TOKEN);
