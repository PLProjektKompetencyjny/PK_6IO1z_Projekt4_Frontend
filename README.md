# TravelNestUI
Warstwa prezentacji aplikacji [TravelNest](https://github.com/PLProjektKompetencyjny/PK_6IO1z_Projekt4)

## Spis treści
1. [Przygotowania](#przygotowania)
2. [Uruchomienie](#uruchomienie)
3. [Wytyczne](#wytyczne)
4. [Komendy Angular CLI](#komendy-angular-cli)
5. [Dostępne komendy aplikacji](#dostępne-komendy-aplikacji)

## Przygotowania
Przed rozpoczęciem prac należy zainstalować narzędzie [nvm](https://github.com/nvm-sh/nvm) - menedżer do zarządzania wersjami **Node.js** lub [nvm-windows](https://github.com/nvm-sh/nvm) jeśli używasz systemu operacyjnego Windows.
Przy pomocy ww. narzędzia pobieramy [Node.js](https://nodejs.org/en/download/) w wersji **20.11.1 (LTS)**, który domyślnie instaluje również [npm](https://www.npmjs.com/) w wersji **10.2.4**:
```bash
nvm install 20.11.1
```

Następnie aktulizujemy [npm](https://www.npmjs.com/) do wersji **10.5.0**:
```bash
npm install -g npm@10.5.0
```

Możemy teraz zainstalować wszystkie dependencje w projekcie. Otwórz terminal i przejdź do katalogu, w którym znajduje się aktualnie przeglądany plik [README.md](./README.md) i uruchom komendę:
```bash
npm install
```

## Uruchomienie
Otwórz terminal, przejdź do [głównego katalogu](./) projektu np. `C:/Projects/TravelNest/TravelNestUI/` lub `/home/projects/TravelNest/TravelNestUI` a następnie uruchom polecenie:
```bash
npm start
```

> :warning: Na systemie operacyjnym Windows możesz napotkać poniższy błąd:
>```bash
>File C:\path\to\project\ cannot be loaded because running scripts is disabled on this system. For more information, see 
>about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
>At line:1 char:1
>+ ~~~~~
>    + CategoryInfo          : SecurityError: (:) [], PSSecurityException
>    + FullyQualifiedErrorId : UnauthorizedAccess
>```
>W takim przypadku uruchom PowerShell jako administrator i wykonaj polecenie:
>```powershell
>Set-ExecutionPolicy -ExecutionPolicy RemoteSigned
>```
>zmiana `ExecutionPolicy` na `RemoteSigned` pozwala na pobranie i uruchomienie skryptów, które mają podpis cyfrowy. Warto mieć to na uwadze. Nierekomendowane jest ustawianie wartości na `Unrestricted`!

## Wytyczne
Co do strukturyzowania katalogów zaleca się, aby elementy Angular'owe przechowywać w grupach tj.:
- [Moduły](#moduł) w katalogu -> `/src/app/modules/`,
- [Serwisy](#serwis) w katalogu -> `/src/app/services/`,
- [Strażników](#strażnik) w katalogu -> `/src/app/services/`,
- [Dyrektywy](#dyrektywa) w katalogu -> `/src/app/directives/`,
- ["Rury"](#rura) w katalogu -> `/src/app/pipes/`,
- z kolei [Komponenty](#komponent):
- - jeśli są to kontrolki współdzielone czyli używane w wielu różnych miejscach to w katalogu -> `/src/app/shared/components`,
- - jeśli są to elementy widoku w ramach danego [modułu](#moduł) np. panel administratora to odpowiednio w `/src/app/modules/admin/components`, `/src/app/modules/home/components` itp.

W przypadku plików związanych z modelami danych w [komponencie](#komponent) (czyli pliki `<nazwa-modelu>.model.ts`) przechowywać w katalogu [komponentu](#komponent).

Jeśli w [komponencie](#komponent) pojawią się metody lub pola, które odpowiadają za konfigurację kontrolki, to należy je wydelegować do osobnego pliku w katalogu [komponentu](#komponent) o nazwie `<nazwa-komponentu>.config.ts` np.
```javascript
export const showMore: boolean = true;

export const displayFormat = (data: any) => {
  return `${data} PLN`;
}
```

## Komendy Angular CLI
> :warning: Upewnij się, że Terminal wskazuje na [główny katalog](./) projektu (czyli tam gdzie znajduje się aktualnie czytany plik)!

> :information_source: Domyślnie generator wskazuje na ścieżkę `./src/app`. Warto mieć to na uwadze!

### Moduł
Skupia, przechowuje, wyodrębnia pewną część logiki aplikacji. Najczęściej będzie tworzone w momencie tworzenie kompletnie nowego widoku np. `/home`, `/user`, `/admin` etc.

Tworzenie:
```bash
ng generate module modules/<module-name>
```
skrócony zapis:
```bash
ng g m modules/<module-name>
```

### Komponent
Jest to część widoku, którą wykonaliśmy od 0 samodzielnie i zawiera logikę biznesową lub custom'owy element/kontrolka, np. `<tn-time-picker></tn-time-picker>`.
Komendy CLI oparte są na [wytycznych](#wytyczne). Dobrze, aby się z nimi zapoznał.

Tworzenie:
```bash
ng generate component modules/<module-name>/components/<component-name>
```
skrócony zapis:
```bash
ng g c modules/<module-name>/components/<component-name>
```

### Serwis
Zapewnia modularyzację, wstrzykiwanie zależności (dependency injection). W nim powinno być zawarte wszystko co **nie jest** związane z logiką biznesową czyli obsługa żądań HTTP do API, manipulacja danymi w session/local storage'u.

Tworzenie:
```bash
ng generate service <service-name>
```
skrócony zapis:
```bash
ng g s <service-name>
```

### "Rura"
Formatuje dane do pewnej postaci. Przykład:

w komponencie mamy pole `amount = 100`,
które potrzebujemy sformatować do postaci `100.00`. Możemy to uzyskać przy użyciu wbudowanego pipe'a `number`:
`{{ amount | number:'1-2.2' }}`. Wartość pola `amount` zostaje przesłane do formatora `number`, który na widoku pokazuje `100.00`.

Tworzenie:
```bash
ng generate pipe <pipe-name>
```
skrócony zapis:
```bash
ng g p <pipe-name>
```

### Dyrektywa
Pozwala na nałożenie na elementy w DOM'ie pewnych dodatkowych funkcjonalności, styli itp.

Tworzenie:
```bash
ng generate directive <directive-name>
```
skrócony zapis:
```bash
ng g d <directive-name>
```

### Strażnik
Pośrednik, który wykonuje się w momencie wejścia na dany widok. Dzięki temu można zabezpieczyć pewne widoki administracyjne przed zwykłymi użytkownikami.

Tworzenie:
```bash
ng generate guard <guard-name>
```
skrócony zapis:
```bash
ng g g <guard-name>
```

### Inne
Angular CLI ma jeszcze inne opcje jak tworzenie klasy, interfejsu, enum'a.
`ng generate class|interface|enum`

## Dostępne komendy aplikacji
|  Komenda  | Opis |
|:--------:|------:|
| `npm start` | Uruchamia lokalny serwer deweloperski na [localhost:4200](http://localhost:4200). Jeśli chcesz uruchomić serwer lokalny na innym porcie to w [angular.json](/angular.json) w sekcji `projects.TravelNestUI.architect.serve.options` podmień wartość pola `port` a następnie uruchom komendę |
| `npm run build` | Kompiluje projekt aplikacji i wygenerowane pliki wrzuca do katalogu [dist/](dist/) |
| `npm run test` | Uruchamia lokalne testy jednostkowe przy wykorzystaniu [Karma](https://karma-runner.github.io) |
| `npm run watch` | Uruchamia lokalny serwer na podstawie zbudowanej paczki plików w katalogu [dist/](dist/) |
