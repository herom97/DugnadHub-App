DugnadHub – funksjonalitet i appen

DugnadHub er en enkel mobilapp.
Målet er å gjøre det lettere å opprette, organisere og delta på dugnader.

TESTET MED IPHONE OG WEB MED EXPO

Kort om hovedfunksjonalitet

1. Innlogging og brukere

Brukere kan registrere seg med e-post og passord
Brukere kan logge inn og logge ut
Kun innloggede brukere får se dugnader og bruke hovedfunksjonene
Innlogget bruker hentes fra Firebase Authentication

(Se testbruker.txt for innloggingsdetaljer til sensor.)

2. Mine dugnader (hovedskjerm)

Viser en liste med alle dugnader fra Firebase Firestore
Hvert dugnadsoppdrag vises som et kort med:

Tittel
Kort beskrivelse
Antall frivillige / maks plasser
Eventuell “liker”-informasjon
Trykk på et kort for å åpne detaljsiden

3. Opprette, redigere og slette dugnader (CRUD)

Innloggede brukere kan:
Opprette nye dugnader via et eget skjema
Redigere eksisterende dugnader
Slette dugnader

Hver dugnad kan ha disse feltene:

Tittel
Beskrivelse
Sted
Dato / tid (som tekst)
Kontaktinformasjon (navn/telefon/e-post)
Påkrevde oppgaver (valgfritt fritekstfelt)
Maks antall frivillige (valgfritt tall)
Valgfritt bilde valgt fra bildegalleri (forhåndsvises i skjemaet)

Alle endringer lagres i Firestore (utenom kommentar), og listen oppdateres.

4. Detaljside for dugnad

Når brukeren trykker på et kort, åpnes en egen detaljside som viser:

Tittel og beskrivelse
Sted
Dato / tid
Kontaktinfo
Hvor mange frivillige som er påmeldt
Hvor mange plasser som er tilgjengelige (hvis maks er satt)

I tillegg kan brukeren:

Melde seg på dugnaden (join)
Melde seg av dugnaden (leave)
Se hvor mange plasser som er fylt / ledig

5. Kommentarer og likerklikk

På detaljsiden finnes det en enkel sosial del:
Bruker kan legge igjen en kommentar på dugnaden
Kommentarene vises under en egen “Kommentarer”-seksjon
Dugnaden har også støtte for en enkel “liker”-funksjon, slik at man kan vise engasjement

6. Min side / profil

Det finnes en enkel profilsiden der brukeren kan:
Se grunnleggende info (f.eks. navn / e-post)
Logge ut via en knapp som kaller signOut fra auth-context

7. Om appen

Egen “Om appen”-side som kort forklarer:
Hva DugnadHub er
Hvilken teknologi som er brukt
Hva appen kan brukes til

Kort om teknologi

React Native + Expo (TypeScript)
Expo Router for navigasjon (tabs + stack)
Context API for delt state (dugnader og auth)
Firebase Authentication (e-post/passord)
Firebase Firestore for lagring av dugnader, deltakere og kommentarer
Firebase Storage forsøkt brukt for bildeopplasting (valgfelt i skjemaet)

Målet med appen er ikke å være perfekt, men å vise at jeg behersker:

tverrplattform-utvikling
kobling mot backend (Firebase)
grunnleggende arkitektur med context, skjermflyt og enkel UI/UX

Takk for meg!
