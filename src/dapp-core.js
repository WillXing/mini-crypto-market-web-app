import Arweave from "arweave/web";
import fetch from "node-fetch";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 80,
  protocal: "https",
  timeout: 10000,
  logging: true
});

const login = async walletKeys => {
  const walletAddress = await arweave.wallets.jwkToAddress(
    JSON.parse(walletKeys)
  );
  const winstonBallance = await arweave.wallets.getBalance(walletAddress);
  const arBallance = await arweave.ar.winstonToAr(winstonBallance);
  const favoriteCoins = await getFavoriteCoins(walletAddress);
  return { walletAddress, winstonBallance, arBallance, favoriteCoins };
};

const saveFavoriteCoin = async (coinId, walletAddress) => {
  return new Promise((resolve, reject) => {
    fetch(`https://kvdb.io/WBNbaiNsCuPYBQbr8m455S/${walletAddress}`)
      .then(res => {
        if (res.status === 404) {
          return fetch(
            `https://kvdb.io/WBNbaiNsCuPYBQbr8m455S/${walletAddress}`,
            {
              method: "POST",
              body: coinId
            }
          );
        } else {
          return res;
        }
      })
      .then(res => res.text())
      .then(text => {
        if (text.length > 0 && !text.includes(coinId)) {
          return fetch(
            `https://kvdb.io/WBNbaiNsCuPYBQbr8m455S/${walletAddress}`,
            {
              method: "POST",
              body: `${text},${coinId}`
            }
          );
        }
      })
      .then(res => resolve())
      .catch(err => {
        reject(err);
      });
  });
};

const getFavoriteCoins = async walletAddress => {
  return new Promise((resolve, reject) => {
    fetch(`https://kvdb.io/WBNbaiNsCuPYBQbr8m455S/${walletAddress}`)
      .then(res => res.text())
      .then(text => {
        console.log(text);
        resolve(text);
      })
      .catch(err => reject(err));
  });
};
export default {
  login,
  saveFavoriteCoin,
  getFavoriteCoins
};
