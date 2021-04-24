# Aivy

<h3 align="center"><strong>Aivy Core</strong></h3>

<p align="center">C'est gratuit ( et ça le restera toujours )</p>

Pas encore fini mais utilisable (discord: https://discord.gg/eCsBNQaP9S si jamais vous avez besoin d'aide, ou des questions, ou si vous voulez juste taper la discu. Je suis ouvert à toute discussions mais je ne suis pas psy non plus... )

MITM PacketSniffer pour 
```
 ______   _______  _______           _______ 
(  __  \ (  ___  )(  ____ \|\     /|(  ____ \
| (  \  )| (   ) || (    \/| )   ( || (    \/
| |   ) || |   | || (__    | |   | || (_____ 
| |   | || |   | ||  __)   | |   | |(_____  )
| |   ) || |   | || (      | |   | |      ) |
| (__/  )| (___) || )      | (___) |/\____) |
(______/ (_______)|/       (_______)\_______)
```

<p align="center">
  <img src="https://camo.githubusercontent.com/de3e9648ad06c6d749236ad24df6170fd599071f/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f456a5f5a656c65585941492d45514e3f666f726d61743d6a7067266e616d653d6d656469756d"/>
</p>

# Pré-requis
    - NodeJs (https://nodejs.org/) UTILISEZ LA VERSION LTS

# Dependances
    - frida (https://frida.re) + fritm script https://github.com/louisabraham/fritm/blob/master/fritm/script.js 
    - botofu parser (https://gitlab.com/botofu/botofu/-/tree/dev/src/botofu/protocol/parser)
    - ws (https://github.com/websockets/ws)
    - react-ace (https://www.npmjs.com/package/react-ace)
  
# Lancement 
   ``yarn`` pour importer tout les modules node ( j'crois mdr )

   ``npm start`` pour lancer

# Usage
    Analyser les packets reçu ou envoyé par votre client.
    Envoyer des packets 'artificiel'
    Exécuter des actions en temps réel à partir d'event pré-fabriqué ( pas encore fini parce que c'est long, répétitif et chiant à écrire )
    Créer vos propres scripts pour détruire le jeu comme les farmeurs chin*is
    Quelque script on déjà était créer, pour voir le code source il suffit de cliquer sur le nom du script depuis l'UI (/home) N'HESITEZ PAS A REGARDER LES SOURCES
    Faire des crêpes sans sucre ( le sucre c'est pas trop bon si on en mange trop )

# Exemples

Handler : 
```javascript
// Si vous créer le script depuis l'UI 
const {d2_handler_class, add_handler, remove_handler} = require(`${__SRC}/dofus/messages/handlers/index`);

// Si vous créer le script depuis le projet importer en fonction de la location du fichier
const {d2_handler_class, add_handler, remove_handler} = require('src/dofus/messages/handlers/index'); // dépendra de la ou vous vous situé

// map info
class _character_selected_success_handler extends d2_handler_class{
    constructor(message_informations, socket){
        super(message_informations, socket);
    }
    
    async handle(){
        console.log('vive les femmes');
    }
}
remove_handler('CharacterSelectedSuccessMessage', _character_selected_success_handler, true);
add_handler('CharacterSelectedSuccessMessage', _character_selected_success_handler);
// vous pourrez ajouter sur 3 handlers différent
// un message spécifique = vous devrez renseigner le nom exacte du message
// tout les messages = add_handler('all', handler_class);
// messages du client = add_handler('client', handler_class);
// messages du server = add_handler('server', handler_class);
```
