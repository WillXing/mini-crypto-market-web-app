import Arweave from "arweave/web";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 80,
  protocal: "https",
  timeout: 10000,
  logging: true
});

export default {
  login: async walletKeys => {
    console.log(walletKeys);
    const walletAddress = await arweave.wallets.jwkToAddress(
      JSON.parse(walletKeys)
    );
    console.log(walletAddress);
    const winstonBallance = await arweave.wallets.getBalance(walletAddress);
    const arBallance = await arweave.ar.winstonToAr(winstonBallance);
    return { walletAddress, winstonBallance, arBallance };
  }
};
