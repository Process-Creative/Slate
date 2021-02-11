import chalk from 'chalk';
import ip from 'ip';
import inquirer from'inquirer';
import figures from 'figures';
import { slateToolsConfig } from './../../schema';

const question = {
  type: 'confirm',
  name: 'externalTesting',
  message: ' Continue with external device testing disabled?',
  default: true,
};

export const promptExternalTesting = async () => {
  const external = slateToolsConfig.get('network.externalTesting');
  const address = slateToolsConfig.get('network.externalTesting.address');

  if (external && address) {
    return external;
  }

  if (!ip.isPrivate(ip.address()) && external) {
    console.log(
      `\n${chalk.yellow(
        figures.warning
      )}  It looks like you are connected to the internet with the IP address,
      '${chalk.green(
        ip.address()
      )}', which is publically accessible. This could result
      in security vulnerabilities to your development machine if you want to test
      your dev store from an external device, e.g. your phone. We recommend you
      proceed with external testing disabled until you are connected to the internet
      with a private IP address, e.g. connected to a router which assigns your
      device a private IP.\n`
    );

    const answer:{ externalTesting:boolean } = await inquirer.prompt([
      question
    ]);
    return !answer.externalTesting;
  }

  return external;
};
