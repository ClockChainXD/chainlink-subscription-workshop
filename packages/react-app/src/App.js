import { Contract } from "@ethersproject/contracts";
import { utils } from "ethers";
import {
  shortenAddress,
  useCall,
  useEthers,
  useLookupAddress,
  useSendTransaction,
  useContractFunction,
} from "@usedapp/core";
import React, { useEffect, useState } from "react";

import { Body, Button, Container, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";
import { addresses, abis } from "@my-app/contracts";

function WalletButton() {
  const [rendered, setRendered] = useState("");

  const { ens } = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers();
  const { sendTransaction } = useSendTransaction();

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <Button
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App() {
  const { account, activateBrowserWallet, deactivate, error } = useEthers();
  const [aboneState, setAboneState] = useState(undefined);
  const { error: contractCallError, value: abonelik } =
    useCall({
      contract: new Contract(addresses.makalelik, abis.makalelik),
      method: "get_abonelik",
      args: [account],
    }) ?? {};
  const { state, send } = useContractFunction(
    new Contract(addresses.makalelik, abis.makalelik),
    "abone_ol",
    {
      gasLimitBufferPercentage: 10,
    }
  );
  const { state: approveState, send: approveAbone } = useContractFunction(
    new Contract(addresses.aboneErc20, abis.erc20),
    "approve",
    {
      gasLimitBufferPercentage: 10,
    }
  );

  const { status } = state;
  useEffect(() => {
    setAboneState(abonelik);
    console.log(abonelik);
    console.log(error);
  }, [account, abonelik]);

  const aboneOl = () => {
    send(
      "AboneReact",
      5000000,
      utils.parseEther("10"),
      addresses.anaAbonmanSozlesmesi
    );
  };
  const approve = () => {
    approveAbone(aboneState.abonmanSozlesmesi, utils.parseEther("10000"));
  };

  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
        <Image src={logo} alt="ethereum-logo" />
        <div>
          {aboneState ? (
            <div>
              <p>
                Abonman Sözleşmesi : {aboneState.abonmanSozlesmesi} <br />
                {aboneState.aktiflik ? "" : "Aktiflik Durumu: Pasif"}
              </p>
              {aboneState.aktiflik == false ? (
                <Button onClick={() => approve()}>
                  Aboneliğini aktifleştir{" "}
                </Button>
              ) : (
                "Aboneliğin aktif! Her ay 1 token hesabından çekilecek."
              )}
              <br />
              <Link
                href={
                  "https://automation.chain.link/chapel/" + aboneState.upkeepId
                }
              >
                Chainlink Otomasyonu görüntüle
              </Link>
            </div>
          ) : (
            <div>
              "Abone değilsin!"
              <Button
                onClick={() => aboneOl()}
                disabled={status == "Mining" || approveState.status == "Mining"}
              >
                Abone olmak için tıkla{" "}
              </Button>
            </div>
          )}
        </div>
        <div>
          {status != "None" || approveState.status != "None" ? (
            status == "Exception" || approveState.status == "Exception" ? (
              <p>{state.errorMessage || approveState.errorMessage}</p>
            ) : (
              <p>{status != "None" ? status : approveState.status}</p>
            )
          ) : (
            ""
          )}
        </div>
      </Body>
    </Container>
  );
}

export default App;
