# 🛒 Sklep - Baza Danych w Dockerze

Ten dokument zawiera gotowe instrukcje i komendy pozwalające na błyskawiczne uruchomienie bazy danych MySQL w środowisku Docker, aby móc uruchomić projekt lokalnie na laptopie.

---

## 🛠️ Sposób 1: Uruchomienie przez Docker Compose (Zalecane)

W projekcie znajduje się już plik `docker-compose.yml`, który automatycznie konfiguruje bazę danych MySQL 8.0, zaczytuje dane dostępowe z pliku `.env` oraz automatycznie importuje strukturę i dane z pliku `shop.sql`.

### Komenda do uruchomienia:
Otwórz terminal w głównym folderze projektu (`d:\shop`) i wpisz:

```bash
docker compose up -d
```
*(Jeśli używasz starszej wersji Dockera, komenda może brzmieć: `docker-compose up -d`)*

### Co robi ta komenda?
* Pobiera i uruchamia kontener z bazą MySQL 8.0 w tle (`-d` / detached).
* Wczytuje dane logowania i nazwę bazy z pliku `.env`.
* **Automatycznie importuje plik `shop.sql`** przy pierwszym uruchomieniu kontenera (baza od razu będzie gotowa do pracy!).
* Tworzy wolumen, dzięki czemu dane nie znikną po wyłączeniu kontenera.

### Zatrzymanie bazy:
Aby zatrzymać bazę danych bez usuwania danych:
```bash
docker compose stop
```

Aby całkowicie usunąć kontener (dane w bazie zostaną zachowane w wolumenie):
```bash
docker compose down
```

---

## 🐳 Sposób 2: Uruchomienie bezpośrednio przez Docker CLI (Alternatywne)

Jeśli z jakiegoś powodu nie chcesz używać Docker Compose, możesz uruchomić bazę jedną, gotową komendą `docker run`. 

> [!NOTE]
> Przy tym sposobie musisz ręcznie zaimportować plik `shop.sql`, ponieważ standardowy `docker run` nie zaimportuje go automatycznie tak jak konfiguracja w compose.

### Komenda do uruchomienia:
Skopiuj i wklej w terminalu:

```bash
docker run --name shop_mysql -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=shop_db -e MYSQL_USER=db_user -e MYSQL_PASSWORD=db_password -p 3306:3306 -v shop_db_data:/var/lib/mysql -d mysql:8.0
```

### Ręczny import pliku SQL (tylko przy Sposobie 2):
Po uruchomieniu kontenera z powyższej komendy, możesz wgrać plik `shop.sql` do bazy komendą:
```bash
docker exec -i shop_mysql mysql -u db_user -pdb_password shop_db < shop.sql
```

---

## 🔍 Przydatne komendy do zarządzania kontenerem

### Sprawdzenie statusu kontenera:
```bash
docker ps
```

### Podejrzenie logów bazy danych (przydatne przy problemach z połączeniem):
```bash
docker logs -f shop_mysql
```

### Wejście do konsoli MySQL wewnątrz kontenera:
```bash
docker exec -it shop_mysql mysql -u db_user -pdb_password shop_db
```
