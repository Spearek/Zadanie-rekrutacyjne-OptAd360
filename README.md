## Zawartość katalogu 

***/src/*** - folder zawierający dwa podkatalogi (`scss` oraz `scripts`), znajdują się w nich bazowe pliki z rozwiązaniem zadania.  
***/compiled/*** - folder z przekompilowanym kodem do `ES5` oraz `css`.  
***gulpfile.js*** - plik konfiguracyjny Gulpa, który umożliwił kompilację kodu.  

## Funkcjonalność

Skrypt uruchamia popup wyłącznie na stronach z protokołem `https`.  
Po zaakceptowaniu/odrzuceniu warunków, tworzone są 2 - 3 ciasteczek, których data życia to 24h.  
Po tym czasie, jeśli użytkownik odświeży stronę - będzie musiał zdecydować ponownie.  
Ciastka przechowują zarówno decyzję, jak i ID zaakceptowanych/odrzuconych partnerów.  



