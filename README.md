# SkiSense — wersja na telefon (Android)

Aplikacja webowa (PWA), która łączy się z czujnikiem ESP32 przez **Web Bluetooth**, rysuje wykres na żywo,
nagrywa zjazdy i liczy ocenę techniki tymi samymi regułami co aplikacja desktopowa.
Działa **tylko w Chrome na Androidzie** (iPhone/Safari nie obsługuje Web Bluetooth) i **tylko przez https**.

## 1. Opublikowanie na GitHub Pages (5 minut, za darmo)

1. Załóż konto na github.com i utwórz nowe, publiczne repozytorium, np. `skisense`.
2. Wgraj do niego **zawartość folderu `web/`** (pliki `index.html`, `style.css`, `sw.js`, `manifest.webmanifest`,
   foldery `js/` i `icons/`). Przycisk *Add file → Upload files*, przeciągnij pliki i foldery. Testów (`tests/`)
   i `package.json` wgrywać nie trzeba.
3. *Settings → Pages → Source: Deploy from a branch → Branch: main, folder / (root) → Save*.
4. Po minucie strona działa pod adresem `https://TWOJA-NAZWA.github.io/skisense/`.

## 2. Pierwsze uruchomienie na telefonie

1. Otwórz adres w **Chrome** na Androidzie. Włącz Bluetooth w telefonie.
2. Wybierz źródło **Demo**, kliknij *Połącz*, potem *Rozpocznij trening*: sprawdzisz całą aplikację bez czujnika.
3. Menu Chrome (⋮) → **Dodaj do ekranu głównego**: aplikacja otwiera się jak zwykła i **działa offline**
   (po pierwszym wczytaniu, więc na stoku nie potrzebujesz zasięgu).

## 3. Z prawdziwym czujnikiem

1. Wgraj na ESP32 szkic `stage2_ble.ino` i zasil go (np. powerbankiem).
2. W aplikacji wybierz **ESP32 przez Bluetooth**, kliknij *Połącz* i na liście wybierz **SKI-IMU**.
   (Chrome prosi o wybór urządzenia za każdym razem, to wymóg bezpieczeństwa Web Bluetooth.)
3. Połóż nartę/but nieruchomo i kliknij *Kalibruj (postój)*: 3 sekundy, zerują dryf żyroskopu.
4. Jeśli czujnik jest zamontowany „bokiem", ustaw *Osie…*, tak aby wykres „Przyspieszenie boczne" reagował
   na skręt w lewo/prawo, a „Prędkość kątowa" na obrót goleni.
5. *Rozpocznij trening*, jedź, *Zakończ i zapisz*. Zjazdy zapisują się w pamięci telefonu (Historia).
6. Eksport CSV pobiera plik do folderu Pobrane. Ten sam plik można odtworzyć w aplikacji desktopowej.

Podczas połączenia ekran jest utrzymywany jako włączony (Wake Lock). Android może wstrzymać Bluetooth
w tle, więc nie blokuj ekranu przyciskiem zasilania w trakcie nagrywania.

## 4. Testy

```
cd web
node --test tests/*.test.mjs                 # analiza (zgodność z Pythonem), dekoder BLE, reconnect, zapis, CSV
python tests/e2e_browser.py                  # cały przepływ w Chromium w widoku telefonu (wymaga: pip install playwright)
```

Wzorce zgodności z aplikacją desktopową generuje `python tests/make_web_fixtures.py` (z katalogu głównego projektu).

## 5. Ograniczenia

* Web Bluetooth nie istnieje na iOS i w Firefoksie. Na iPhonie użyj aplikacji desktopowej lub trybu CSV.
* Porównywanie sesji i raport PDF są w aplikacji desktopowej; na telefonie są wyniki, notatki, historia i CSV.
* Oceny (SSI, kształt skrętu) są heurystyczne i wymagają dostrojenia na prawdziwych danych z jazdy.
* Dane są tylko na telefonie (IndexedDB). Wyczyszczenie danych przeglądarki je usuwa, więc eksportuj ważne zjazdy.
