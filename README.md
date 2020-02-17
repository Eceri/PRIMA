# PRIMA

Checkliste


|Nr|Bezeichnung|Inhalt|
|:--:|:--| :--|
|-|Titel|Knights Quest|
|-|Name|Michael Lorens|
|-|Matrikelnummer|256488|
|1|Nutzerinteraktion| Die Spielerfigur wird mit "A" und "D" seitlich bewegt, mit "W" springt sie, "Q" wechselt die waffe und "E" löst einen Angriff, einen Axtschwung oder ein Feuerball aus einem Zepter, je nach Waffe. Über "ESC" kann das Spiel pausiert/fortgesetzt werden. Hier kann man den Sound stumm stellen.|
|2|Objektinteraktion|Der Spieler und seine Geschosse interagieren mit den Platformen im Spiel. Kollidiert der Spieler mit einer Plattform, wird er von dieser anghalten angehalten, und an die richtige Position geschoben. Die Resolution der Kollisionen des Spielers wird anhand der Sprite größen berechnet. Ist es eine bewegende Plattform, wird der Spieler auch von dieser mitgenommen. (Bewegt sich die plattform runter, fällt der Spieler, das ist ungewollt, aber ich habe noch keine Lösung gefunden). Der Feuerball zerstört sich bei einer Kollision und verschwindet (die Animation dafür gibts noch nicht). Er verschwindet auch nach einer gewissen Distanz. Gegner Gibt es Leider noch nicht. |
|3|Objektanzahl variabel|Die Projektile des Spielers werden zur lauf zeit erzeugt und zerstört.|
|4|Szenenhierarchie|An oberster stelle steht eine game-Node. Dieser Node sind das Level und der Spieler untergeornet. Im Level befinden sich "Floor"-Objekte, diese stellen die Plattformen dar. Zudem hat das level einen "Background" dieser dient zur Darstellungen des Hintergrund und hat bislang 3 NodeSprites, die letzendlich die Einzelteile des Hintergrunds sind. Der Spieler hat 7 SpriteNodes die im untergeordnet sind, sie stellen die verschiedenen Animation für die Spieler bewegungen dar. Attack, Walk, und Idle jeweils für beide Waffen. Zudem hat er eine Fall-animation, Leider nur mit dem Zepter.|
|5|Sound|Es gibt Backgroundmusik und einen Sound sobald der Spieler einen Feuerball erzeugt. Beides lässt sich über das Pausenmenü stumm stellen. |
|6|GUI|Der Startscreen und das Pausenmenü sind über HTML elemente dargestellt. Wenn diese nicht sichtbar sein sollen werden sie per CSS (z-Index) nach hinten geschoben und sind so nicht mehr sichtbar. Entsprechen werden sie beim pausieren in den Vordergrund gezogen.|
|7|Externe Daten|Es ist möglich das Level in der Levels.json zu ändern. Diese Datei wird beim Laden der Seite gelsen und daraus wird das Level generiert. Das erfolgt über einen fetch|
|8|Verhaltensklassen|Das Level wird in der Level.ts erzeugt, diese Klasse bekommt von außen (aus der Main.ts) die zuvor gelesenen Level aus der JSON, und generiert aus dießer das Level. Die Floor Klasse beschreibt Statische Plattformen, die haben lediglich einen Coat und eine Position. Moving floors haben zusätzlich einen Bewegungsrichtung und Geschwindigkeit. Die Character.ts beschreibt die Spielerfigur, die einige Verhaltensmethoden für die sprünge, kollision und animation hat.|
|9|Subklassen|Die Klassen Floor und Projectile erben von der CollidableObject Klasse. Diese beschreibt die geimeinsame getRectWorld(), hier Sollte eventuell noch der Spieler erben, da dieser auch eine getRectWorld() hat, das erforder jedoch einen größen umbau. Die MovingFloor Klasse erbt von der Floor klasse und erweitert diese um die oben genannten punkte. Character, CollidableObject, Level und Background erben von f.Node.|
|10|Maße & Positionen|Der Spieler ist etwa eine Spieleinheit groß und breit. Die Plattformen sind variabel und können beliebig in die breite skaliert werden, die höhe ist fest auf 1 oder 1/5 Spieleinheit beschränkt. Die Hitbox des Projektils ist etwa 2/5 Spieleinheiten groß. Diese Maße sahen und fühlten sich nach einigem Rumprobieren am besten an.|
|11|Event-System| Das Event System wurde nach der Vorlesung bislang nicht erweitert, jedoch wurden einige Dinge verschoben und abgeändert sodas die FPS des Spiels und der Animationen nicht mehr so stark zusammenhängen.|

Resource:
Character: https://uilleaggodwin.itch.io/roguelike-dungeon-asset-bundle
Hintergrund: https://vnitti.itch.io/taiga-asset-pack
Hintergrund-Musik: https://opengameart.org/content/platformer-game-music-pack
Feuerball-Sound: http://rpg.hamsterrepublic.com/wiki-images/4/43/FlameMagic.ogg
