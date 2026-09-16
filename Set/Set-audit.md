# Set audit és javítási javaslat

Dátum: 2026-09-15

A vizsgálat a teljes Set osztályra és a meglévő tesztjeire terjedt ki. A hibákat külön Node-próbák is reprodukálták. Az audit során az implementáció nem módosult.

## Talált problémák

### 1. A törölt rekordok és értékek megmaradnak — magas prioritás

A `Set_basic.js` fájlban a `delete()` csak az `active` mezőt állítja `false`-ra. A `Lib/clear.js` ugyanezt teszi minden rekorddal.

10 000 objektum beszúrása és törlése, majd `clear()` után a mért állapot:

```text
size:                           0
_data.length:                   0
_records.length:            10000
megőrzött objektumreferencia: 10000
```

Ennek három következménye van:

- A Set továbbra is hivatkozik a törölt objektumokra, így azok ezen a hivatkozáson keresztül elérhetők maradnak.
- A `delete()` egyre hosszabb rekordtömbben keres. Ismételt beszúrás–törlés mellett az összes munka négyzetesen nőhet, akkor is, ha egyszerre csak egy elem van a Setben.
- A `clear()` és a teljes bejárás a korábbi beszúrások számával arányos munkát végez.

Az `active` jelölés az élő iterátorok miatt került ide, de a szabvány nem követeli meg a törölt rekordok fizikai megőrzését. Kifejezetten megengedi a tényleges eltávolítást. [ECMAScript: Set.delete](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-set.prototype.delete)

### 2. A lezárt iterátor újra elindul — közepes prioritás

A `Lib/values.js` és a `Lib/entries.js` nem jegyzi meg, hogy egyszer már visszaadott `done: true` eredményt. A `keys()` is érintett, mert a `values()` aliasa.

```javascript
var s = new Set([1]);
var it = s.values();

it.next(); // 1
it.next(); // done: true
s.add(2);
it.next(); // jelenleg: 2, done: false
```

A natív Set iterátora az utolsó hívásnál is lezárt marad. Az élő bejárás csak a lezárásig érvényes.

### 3. Halmazműveletek hibás eredményt adhatnak módosítás közben — közepes prioritás

Az `intersection`, `difference`, `isSubsetOf` és `isDisjointFrom` közvetlenül indexeli a `_data` tömböt, miközben meghívja a másik objektum `has()` metódusát. Ez a metódus módosíthatja a vizsgált Setet.

Például a `Lib/intersection.js` esetében:

- kiinduló Set: `[1, 2]`;
- a másik objektum `has(1)` hívása törli az `1`-et, majd `true`-t ad;
- a kód ezután újra kiolvassa a `_data[i]` értékét, amely ekkor már `2`.

Eredmény: `[2]`; natív Settel: `[1, 2]`. Ráadásul a `2` tagságát az implementáció nem is vizsgálta meg.

A másik három metódusnál is reprodukálható hibás eredmény. A `difference` javításánál külön figyelni kell arra, hogy a vizsgált értékeket az eredményhez készített másolatból vegye.

### 4. A `-0` nincs `+0`-ra normalizálva — alacsony prioritás

A `Set_basic.js` fájlban az `add()` tagsági összehasonlítása megfelelő, de a tárolt érték előjelét megőrzi:

```javascript
1 / new Set([-0]).values().next().value
```

A jelenlegi eredmény `-Infinity`, natív Settel `Infinity`. Ez kis, helyi javítással rendezhető.

### 5. A Set-like iterátorok kezelése hiányos — közepes prioritás

A célzott próbák alapján:

- A `Lib/isSupersetOf.js` és a `Lib/isDisjointFrom.js` korai kilépéskor nem hívja meg az idegen iterátor `return()` metódusát. A natív Set meghívja.
- A halmazműveletek minden lépésben újra kiolvassák az `iterator.next` mezőt. Egy önmagát módosító iterátor ezért itt elromlik, míg natív Settel működik.
- Nem ellenőrzik, hogy a `next()` eredménye objektum-e. Például az `union()` egy hibás, számot visszaadó iterátorból `undefined` elemet vesz fel; a natív Set `TypeError`-t dob.

Ezek a támogatott Set-like bemeneteknél jelentkeznek, nem igényelnek Symbol-alapú iterációt.

### 6. Kisebb inkonzisztenciák

- A `Lib/getSetRecord.js` kétszer olvassa ki a `has` és `keys` tulajdonságokat. Getteres objektumnál ez megfigyelhető eltérés; Node alatt reprodukálva, ESTK alatt nem ellenőrizve.
- A `Lib/reduce.js` dokumentációja olyan típushibákat ígér, amelyeket a kód nem dob. A tesztek kifejezetten megengedik a típusváltást és az `undefined` eredményt.

## Javaslat a `_records` problémájára

Tömör rekordtömb javasolt, növekvő beszúrási sorszámokkal. Így megmaradhat az élő iteráció, miközben a törölt rekordokat ténylegesen eltávolítjuk.

A működés:

1. Minden új rekord kap egy növekvő `id`-t.
2. A `_data` és a `_records` azonos sorrendben csak az aktuális elemeket tartalmazza.
3. A `delete()` mindkét tömbből ugyanazon az indexen töröl. Az `active` mező és a második keresőciklus megszűnik.
4. A `clear()` kiüríti mindkét tömböt. A beszúrási számlálót nem nullázza.
5. Az iterátor az utoljára kiadott sorszámot tárolja, és a Set aktuális rekordtömbjében keresi a következő nagyobbat.
6. Az első `done: true` után végleg lezárul. A `forEach()` is ezt a bejárást használja.

A sorszámok rendezettek, ezért a következő rekord bináris kereséssel megtalálható. Ennek ára `O(log n)` keresés lépésenként; cserébe a tárolás az aktuális elemszámmal arányos, és nem kell nyilvántartani a félbehagyott iterátorokat.

Egy egyszerű `_records = []` vagy `splice()` önmagában nem elég: a jelenlegi iterátorok a régi tömböt és annak indexeit őrzik.

### A javasolt modell ellenőrzése

A tárolási modell külön, ideiglenes Node-prototípusban lett ellenőrizve:

- 50 000 vegyes művelet;
- 117 581 iterátorhívás összevetése a natív Settel;
- bejárás közbeni törlés, ürítés és beszúrás;
- 10 000 beszúrás–törlés után 0 megmaradt rekord.

Minden ellenőrzés sikerült. Ez a modell próbája; a projektbe még nincs beépítve.

## Ellenőrzési állapot

A meglévő 13 standard és 15 nonstandard teszt sikeres, de a fenti hibákat nem fedik le. A Node verziója: `v26.5.0`.

ESTK-futtatás nem történt; az operátorteszteket Node kihagyta.

Első javításként a rekordtárolást és az iterátorlezárást érdemes együtt kezelni, majd Node/ESTK ellenőrzés után következhetnek a halmazműveletek.

## Megvalósítási állapot: 1-es verzió

Az 1. és 2. pont javítva: tömör rekordtömb, beszúrási sorszámok, végleges iterátorlezárás. A 3–6. pont továbbra is hátravan.

Node: 17 standard és 15 nonstandard teszt sikeres. A beépített változaton 50 000 vegyes művelet és 117581 natív iterátor-összehasonlítás is sikeres. ESTK-ellenőrzés még nem történt.

A kiinduló állapot a `History/0`, az 1-es fejlesztési verzió a `History/1` mappában található.

## Megvalósítási állapot: 2-es verzió

Az 1-es verzió ESTK-tesztjeit a felhasználó sikeresnek jelezte.

A 3. pont javítva: az `intersection`, `isSubsetOf` és `isDisjointFrom` a saját Setet élő iterátorral járja be. A `difference` a művelet elején készített eredménymásolatot járja be.

Az új regressziós tesztek a javítás előtt elbuktak, utána sikeresek. A tesztmátrix 20 módosítási esetet ellenőriz a projekt Setjén és Node alatt a natív Seten is. Külön teszt ellenőrzi a `difference` megmaradó elemeit a forrás ürítése után.

Node: 19 standard és 15 nonstandard teszt sikeres. A 2-es verzió ESTK-ellenőrzése még hátravan. Az audit 4–6. pontja továbbra is nyitott. A változat a `History/2` mappában is megtalálható.

## Megvalósítási állapot: 3-as verzió

A 2-es verzió standard ESTK-harnessére a felhasználó 19 sikeres tesztet és 0 hibát jelzett.

A 4. pont javítva: az `add()` tárolás előtt a `-0` értéket `+0`-ra normalizálja. A közös Node/ESTK regressziós teszt ellenőrzi a konstruktort, beszúrást, iterátorokat, callback-argumentumokat, törlést, újrabeillesztést és a nullához hasonló egyéb értékek megőrzését. A teszt a javítás előtt elbukott, utána sikeres.

Node: 20 standard és 15 nonstandard teszt sikeres. A 3-as verzió ESTK-ellenőrzése még hátravan. Az audit 5–6. pontja nyitott. A fejlesztési változat a `History/3` mappában is megtalálható.

## Megvalósítási állapot: 4-es verzió

A 3-as verzió standard ESTK-tesztjeire a felhasználó 20 sikeres tesztet és 0 hibát jelzett.

Az 5. pont javítva. A `Lib/setIterator.js` közös belső segédje egyszer rögzíti a `next` metódust, megőrzi a hívás fogadóját, és ellenőrzi az iterátor eredményének típusát. Az `isSupersetOf` és az `isDisjointFrom` korai kilépéskor lezárja az idegen iterátort a rendelkezésre álló `return()` metódussal. A lezárás hibái továbbterjednek.

A négy új közös Node/ESTK teszt ellenőrzi a rögzített `next` használatát, a primitív eredmények elutasítását, a korai lezárást és a `next()` hibáinak továbbadását. Node alatt a natív Set is ugyanazokat az eseteket futtatja. A javítás előtt három új teszt elbukott.

Node: 24 standard és 15 nonstandard teszt sikeres. A 4-es verzió ESTK-ellenőrzése még hátravan. A 6. auditpont továbbra is nyitott. Mentés: `History/4`.

Referencia: [ECMAScript IteratorClose](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-iteratorclose).

## Megvalósítási állapot: 5-ös verzió

A 4-es verzió standard ESTK-harnessére a felhasználó 24 sikeres tesztet és 0 hibát jelzett.

A 6. pont javítva: a `__getSetRecord__` belső segéd a `has` és `keys` tulajdonságokat egyszer, ebben a sorrendben olvassa ki, ellenőrzi és eltárolja. Hibás `has` esetén a `keys` kiolvasása elmarad. Ez a javítás a rekordazonosítóktól független. A segéd a standard halmazműveleteket szolgálja, nem publikus Set-metódus.

A `reduce` dokumentációjából kikerült a két nem létező típushiba, és a callback négy argumentuma is pontosítva lett. A futó kód nem változott.

Node: 26 standard és 15 nonstandard teszt sikeres. A standard harnessből 25 teszt közös Node/ESTK teszt; az egyetlen getteres kiolvasásszámláló teszt csak Node alatt fut. Ez a teszt a javítás előtt elbukott. ESTK alatt erre külön SKIP sor jelenik meg. Az 5-ös verzió ESTK-ellenőrzése még hátravan.

Mind a hat auditponthoz elkészült a javítás. Mentés: `History/5`.
