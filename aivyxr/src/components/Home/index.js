import './home.css';

import Card from './../Card';

export default function Home({}){
    return (<div className="App-home">
        <Card
        height="50vh"
        title="La nouvelle version Aivy x React"
        text={
            <div>Bonjour les amis. C'est la nouvelle version de Aivy, celle qui se rapprochera plus de la version finale. <br></br>
            Pour l'instant le developpement de nouvelle feature me prend énormement de temps parce que mon PC bug énormement et que j'ai quelque soucis IRL,
            mais on s'en fout de ça ( C'est mon PC le plus important x) ). <br></br>
            Bref, tout ça pour dire que si jamais vous avez envie de faire une petite donation, c'est désormais possible. 
            Et je m'excuse d'avance pour les futurs donateurs, car je ne vais pas vous faciliter la tâche. <br></br>
            J'ai regarder quelque plateforme pour faire des cagnottes et tout, mais j'ai pas trop envie de partager des informations personnelles ( et il le faut si je veux récupérer les sous ), 
            ducoup j'ai chercher un autre moyen, et le seul que j'ai trouvé c'est d'utiliser des cryptomonnaies. ( C'était pas le seul mais bon vous avez compris ) <br></br>
            Ducoup si jamais vous voulez faire un don <span className="bold">(CE N'EST PAS OBLIGATOIRE)</span>, c'est possible, mais il faudra le faire via <a href="https://safemoon.net/guide" target="_blank" rel="noreferrer" style={{
                color: 'red'
            }}><span className="bold">#SAFEMOON</span></a><br></br>
            L'adresse de mon wallet c'est : <span className="bold">0xEe575CC8BC977f608Fb25e4639427496E0Fb127D</span><br></br><br></br>

            Je sais qu'il y a une taxe qui peut paraître élever (10% de la transaction) sur le <a href="https://safemoon.net/whitepaper" target="_blank" rel="noreferrer" style={{
                color: 'red'
            }}><span className="bold">#SAFEMOON</span></a> mais on sait jamais si ça pète, ça vous évitera de faire des dons énorme tout en soutenant de ouf ( Et si ça casse, tempis x) ).<br></br><br></br>
            Merci à toute les personnes qui feront des dons. Lorsque vous faites un don, notifier moi sur discord que je puisse noter tout ça. ( Pour un petit projet qui n'a aucun rapport avec Aivy )
            </div>
        }
        />
        <div className="App-home-lnews">
            <Card
            height="36vh"
            title="Doc"
            text="Je n'ai pas encore eu le temps de finir la doc ( J'rigole j'ai juste trop la flemme de la faire xD ). Elle sera disponible très bientôt."
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