Démarrer le projet, dans un terminal, sur le projet :
<code>npm run dev</code>

Le projet se lance sur votre port 5173 par défaut :
<a href="http://localhost:5173/">localhost:5173</a>

J'ai fais ca avec un peu d'aide 🤖.
Je pense que ca feat un peu plus avec l'utilisation des formulaires via l'utilisations de la balise select, même si elle est caché, le comportement de ce qui est visible est synchronisé avec le select caché, ce qui permet des interactions via d'autre éléments qui viendrait jouer avec le select via code.

Vu que le select est toujours bien alimenté normalement, il n'y a pas de traitement additionnel à faire avant submit du formulaire via ajax, ou les propriétés href, action.

Fais dans une fonction réutilisable : "setupCustomSelect" du coup applicable partout simplement.