## Introduksjon

Jeg har laget en Gutenberg block der brukeren kan velge en blokk fra editoren. 
Når brukeren trykker på **Dekode API Fnugg**, så vil det dukkle blokk som tar automatisk en API kall fra https://api.fnugg.no/search?q= 

På Back-end editoren, så ser ikke bruker grensesnittet helt nøyaktig som testen sin screenshot, men når brukeren skal publisere/update, så vil det se mer riktig ut på front-end. 

Jeg sørget for at den første treffen den finner utifra API'en, så skal det presentere informasjonen på blocken på back-end.





## Implementering

Jeg har prøvd å bruke [***Autocomplete komponent***](https://developer.wordpress.org/block-editor/components/autocomplete/) som er ferdig laget i Wordpress, men etter mange forsøk med googling, og implementering, så fant jeg ut at Autocomplete komponent er ikke 100% brukbar.



> Unfortunately, this component wasn't really meant to be exported for use in plugins and I highly discourage using this component and see it as experimental. I guess we'll (have to) keep it around in its current form, but at some point I don't expect it to be used by Gutenberg core anymore.
>
> https://github.com/WordPress/gutenberg/issues/10542

Dette endte med at jeg måtte lage ett eget dropdown liste komponent der brukeren kan velge listen fra ulike feriesteder.  

Jeg brukte en allerede ferdig komponent som heter [RichText editor](https://developer.wordpress.org/block-editor/developers/richtext/). Brukeren kan skrive inn input felt. det vil automatisk sørge for at brukeren får frem diverse lister fra dropdown list komponent, og presentasjonen fra blocken vil også endre seg utifra hvilken feriesteder som eksisterer.



## Script

Jeg har brukt Webpack og Babel for å sørge at kodene jeg skriver for Gutenberg block kan være i **development** og **production** mode. Jeg har også implementert Babel for å konvertere kodene jeg skriver **jsx** (React), slikt at jeg kan forholde meg til jsx syntaksene. 







