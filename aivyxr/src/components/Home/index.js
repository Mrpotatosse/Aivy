import './home.css';

import Card from './../Card';

import { useState } from 'react';

const DONATION_WALLET = '0xEe575CC8BC977f608Fb25e4639427496E0Fb127D';

export default function Home({}){
    const [don, setDon] = useState('0');
    fetch('https://bsc-dataseed1.ninicoin.io/', {
        method: 'POST',
        headers: {            
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_call',
            params: [
                {
                    data: `0x70a08231000000000000000000000000${DONATION_WALLET.substr(2).toLowerCase()}`,
                    to: '0x8076c74c5e3f5852037f31ff0093eeb8c8add8d3'
                },
                'latest'
            ]
        })
    })
        .then(res => res.json())
        .then(json => {
            setDon(parseInt(json.result) / (10 ** 9));
        });

    return (<div className="App-home">
        <Card
        height="50vh"
        title="La nouvelle version Aivy x React"
        text={
            <div>
            <span className="centered bold">Vous vous sentez généreux ?</span><br></br>
            Bonjour les amis. C'est la nouvelle version de Aivy, celle qui se rapprochera plus de la version finale. <br></br>
            Pour l'instant le developpement de nouvelle feature me prend énormement de temps parce que mon PC bug énormement et que j'ai quelque soucis IRL,
            mais on s'en fout de ça ( C'est mon PC le plus important x) ). <br></br>
            Bref, tout ça pour dire que si jamais vous avez envie de faire une petite donation, c'est désormais possible. 
            Et je m'excuse d'avance pour les futurs donateurs, car je ne vais pas vous faciliter la tâche. <br></br>
            J'ai regarder quelque plateforme pour faire des cagnottes et tout, mais j'ai pas trop envie de partager des informations personnelles ( et il le faut si je veux récupérer les sous ), 
            ducoup j'ai chercher un autre moyen, et le seul que j'ai trouvé c'est d'utiliser des cryptomonnaies. ( C'était pas le seul mais bon vous avez compris ) <br></br>
            Ducoup si jamais vous voulez faire un don <span className="bold">(CE N'EST PAS OBLIGATOIRE)</span>, c'est possible, mais il faudra le faire via <a href="https://safemoon.net/guide" target="_blank" rel="noreferrer" style={{
                color: 'red'
            }}><span className="bold">#SAFEMOON</span></a><br></br>
            L'adresse de mon wallet c'est : <span className="bold">{DONATION_WALLET}</span><br></br><br></br>

            Je sais qu'il y a une taxe qui peut paraître élever (10% de la transaction) sur le <a href="https://safemoon.net/whitepaper" target="_blank" rel="noreferrer" style={{
                color: 'red'
            }}><span className="bold">#SAFEMOON</span></a> mais on sait jamais si ça pète, ça vous évitera de faire des dons énormes tout en soutenant de ouf ( Et si ça casse, tempis x) ).<br></br><br></br>
            Merci à toute les personnes qui feront des dons, et sachez qu'il n'y a pas de petit don. Lorsque vous faites un don, notifier moi sur discord que je puisse noter tout ça. ( Pour un petit projet qui n'a aucun rapport avec Aivy )<br></br><br></br>
            Total don : <span className="bold">{don} SFM</span>
            </div>
        }
        />
        <div className="App-home-lnews">
            <Card
            height="36vh"
            title="Doc"
            text={
                <div>
                    <span className="bold centered">Comment lancer le MITM ? </span><br></br>
                    <span>1) Modifiez l'emplacement de votre dossier Dofus. ( Lors de la première utilisation ou pour un changement )</span><br></br>
                    <span>Cliquez sur </span><span className="bold">Aivy</span><span>. Ensuite enfoncez la touche </span><span className="bold">Ctrl</span><span> et en même temps appuyez sur le boutton portant le nom </span>
                    <span className="bold">global</span>.<br></br>
                    <span>Lorsque l'éditeur est ouvert il faudra modifier </span><span className="bold">global.DOFUS_FOLDER = 'DOSSIER DOFUS';</span><br></br>
                    <span>Puis appuyez sur </span><span className="bold">Save</span> <span> ou utilisez le raccourci </span><span className="bold">Ctrl</span><span> + </span> <span className="bold">S</span>. <br></br><br></br>
                    <span>2) Démarrez le serveur MITM. ( A chaque démarrage de Aivy )</span><br></br>
                    <span>Cliquez sur </span><span className="bold">Aivy</span><span>. </span><span>Ensuite appuyez sur le boutton portant le nom </span><span className="bold">modules</span>.<br></br>
                    <span>Séléctionnez </span> <span className="bold">MITM Server Dashboard</span>. <span>Ensuite démarrez le serveur on mettant le switch sur </span> <span className="bold">On</span>.<br></br><br></br>
                    <span>3) Lancez une instance de Dofus.</span><br></br>
                    <span>Cliquez sur </span><span className="bold">Aivy</span>. <span>Ensuite appuyez sur le boutton portant l'icon </span><span className="bold">Dofus</span>.
                </div>
            }
            onClick={_ => {
                window.location = '/doc'
            }}
            />
            <div className="mid"></div>
            <Card
            height="36vh"
            title="Changelog"
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            />
        </div>
    </div>);
}