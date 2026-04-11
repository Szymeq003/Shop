package org.example.backend.config;

import lombok.RequiredArgsConstructor;
import org.example.backend.entity.*;
import org.example.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductAttributeRepository productAttributeRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // Cleanup existing data
        productRepository.deleteAll();
        productAttributeRepository.deleteAll();

        // --- Categories ---
        Category laptopy = getOrCreateCategory("Laptopy i komputery", null);
        Category smartfony = getOrCreateCategory("Smartfony i smartwatche", null);
        Category podzespoly = getOrCreateCategory("Podzespoły komputerowe", null);
        Category audio = getOrCreateCategory("Audio i Hi-Fi", null);
        Category gamingAcc = getOrCreateCategory("Akcesoria gamingowe", null);
        Category homeOffice = getOrCreateCategory("Home Office", null);
        Category rtvAgd = getOrCreateCategory("RTV i AGD", null);

        Category laptopyGamingowe = getOrCreateCategory("Laptopy gamingowe", laptopy);
        Category kartyGraficzne = getOrCreateCategory("Karty graficzne", podzespoly);
        Category procesory = getOrCreateCategory("Procesory", podzespoly);

        // Audio Subcategories
        getOrCreateCategory("Słuchawki", audio);
        getOrCreateCategory("Głośniki", audio);
        getOrCreateCategory("Kino domowe", audio);

        // Gaming Subcategories
        getOrCreateCategory("Myszki i klawiatury", gamingAcc);
        getOrCreateCategory("Fotele gamingowe", gamingAcc);
        getOrCreateCategory("Podkładki i akcesoria", gamingAcc);

        // Home Office Subcategories
        getOrCreateCategory("Monitory", homeOffice);
        getOrCreateCategory("Biurka i krzesła", homeOffice);
        getOrCreateCategory("Oprogramowanie", homeOffice);

        // RTV i AGD Subcategories
        getOrCreateCategory("Telewizory", rtvAgd);
        getOrCreateCategory("Ekspresy do kawy", rtvAgd);
        getOrCreateCategory("Małe AGD", rtvAgd);

        // --- Attributes ---
        ProductAttribute producent = getOrCreateAttribute("Producent");
        ProductAttribute kolor = getOrCreateAttribute("Kolor");
        ProductAttribute ram = getOrCreateAttribute("Pamięć RAM");
        ProductAttribute cpu = getOrCreateAttribute("Procesor");
        ProductAttribute gpu = getOrCreateAttribute("Karta graficzna");
        ProductAttribute ekran = getOrCreateAttribute("Ekran");
        ProductAttribute bateria = getOrCreateAttribute("Bateria");
        ProductAttribute storage = getOrCreateAttribute("Pamięć wewnętrzna");
        ProductAttribute odswiezanie = getOrCreateAttribute("Odświeżanie");
        ProductAttribute moc = getOrCreateAttribute("Moc");

        // --- PRODUCTS SEEDING ---
        if (productRepository.count() > 0) {
            return;
        }

        // --- LAPTOPS ---
        seedLaptops(producent, cpu, ram, gpu, ekran, laptopy, laptopyGamingowe);

        // --- SMARTPHONES ---
        seedSmartphones(producent, cpu, ram, storage, ekran, bateria, smartfony);

        // --- AUDIO ---
        Category sluchawki = getOrCreateCategory("Słuchawki", audio);
        Category glosniki = getOrCreateCategory("Głośniki", audio);
        seedAudio(producent, kolor, moc, bateria, cpu, sluchawki, glosniki);

        // --- GAMING ---
        Category myszkiKlawiatury = getOrCreateCategory("Myszki i klawiatury", gamingAcc);
        seedGaming(producent, kolor, storage, myszkiKlawiatury);

        // --- HOME OFFICE ---
        Category monitory = getOrCreateCategory("Monitory", homeOffice);
        seedHomeOffice(producent, ekran, odswiezanie, monitory);

        // --- COMPONENTS ---
        seedComponents(producent, cpu, ram, gpu, storage, podzespoly, kartyGraficzne, procesory);
        
        // --- RTV/AGD ---
        Category telewizory = getOrCreateCategory("Telewizory", rtvAgd);
        seedRtvAgd(producent, ekran, moc, rtvAgd, telewizory);
    }

    private void seedLaptops(ProductAttribute producent, ProductAttribute cpu, ProductAttribute ram, ProductAttribute gpu, ProductAttribute ekran, Category laptopy, Category laptopyGamingowe) {
        // Sample Laptops
        createP("Apple MacBook Air M2", 
            "Przeprojektowany wokół czipa M2 nowej generacji, MacBook Air jest uderzająco smukły i zamknięty w wytrzymałej, aluminiowej obudowie. To niewiarygodnie szybki i wydajny laptop, który pozwala pracować, bawić się i tworzyć niemal wszystko – gdziekolwiek zechcesz. \n\n" +
            "Dzięki czipowi M2 laptop jest oszczędny w zużyciu energii, co przekłada się na wydajność bez konieczności używania wentylatora – pracuje więc bezszelestnie, nawet przy dużym obciążeniu. Wrażenia wizualne zapewnia 13,6-calowy wyświetlacz Liquid Retina, który jest największy i najjaśniejszy w historii modelu Air, wspierając miliard kolorów.", 
            5499, laptopy, 
            List.of("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800", "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800"),
            Map.of(producent, "Apple", cpu, "Apple M2 (8-rdzeniowe CPU)", ram, "8GB Unified Memory", ekran, "13.6 Liquid Retina (2560x1664)", getOrCreateAttribute("Bateria"), "do 18h"));

        createP("Dell XPS 13 Plus 9320", 
            "Dell XPS 13 Plus to najbardziej potężny 13-calowy laptop XPS w historii, zaprojektowany tak, aby był dwukrotnie wydajniejszy od poprzednika przy zachowaniu tej samej kompaktowej obudowy. \n\n" +
            "Urządzenie wyróżnia się nowoczesnym minimalistycznym wyglądem. Klawiatura typu Zero-lattice, haptyczny szklany panel dotykowy oraz funkcyjne przyciski dotykowe nadają mu futurystyczny charakter. Wyświetlacz OLED o rozdzielczości 3.5K zapewnia kinowe wrażenia kolorystyczne, a procesory Intel Core i7 13. generacji gwarantują płynność nawet w wymagających aplikacjach profesjonalnych.", 
            7299, laptopy, 
            List.of("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800"),
            Map.of(producent, "Dell", cpu, "Intel Core i7-1360P", ram, "16GB LPDDR5", ekran, "13.4 OLED 3.5K Touch", getOrCreateAttribute("Kolor"), "Graphite"));

        createP("Lenovo ThinkPad X1 Carbon Gen 11", 
            "Zbudowany we współpracy z firmą Intel®, laptop Lenovo ThinkPad X1 Carbon Gen 11 spełnia wymagania projektowe platformy Intel® Evo™. Legendarna trwałość ThinkPada łączy się tu z najnowocześniejszymi technologiami ochrony danych i łączności. \n\n" +
            "Wyposażony w legendarną klawiaturę odporną na zalanie, Carbon Gen 11 oferuje niesamowitą mobilność dzięki wadze wynoszącej zaledwie 1,12 kg. System głośników Dolby Atmos® zapewnia krystalicznie czysty dźwięk, a zaawansowana kamera z przesłoną ThinkShutter dba o Twoją prywatność. To idealne narzędzie dla liderów biznesu, którzy nie uznają kompromisów.", 
            8999, laptopy, 
            List.of("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800"),
            Map.of(producent, "Lenovo", cpu, "Intel Core i7-1355U", ram, "32GB LPDDR5x", ekran, "14.0 WUXGA IPS Low Power", getOrCreateAttribute("Pojemność dysku"), "1TB SSD NVMe"));

        // Gaming Laptops
        createP("ASUS ROG Zephyrus G14", 
            "ASUS ROG Zephyrus G14 na rok 2024 to najpotężniejszy 14-calowy laptop gamingowy na świecie. Dzięki unikalnemu designowi AniMe Matrix i kompaktowej obudowie, łączy styl z niesamowitą mocą obliczeniową. \n\n" +
            "Sercem maszyny jest procesor AMD Ryzen 9 wspomagany przez kartę graficzną NVIDIA GeForce RTX z serii 40, co pozwala na płynną grę w najnowsze tytuły AAA na fenomenalnym ekranie ROG Nebula. Innowacyjny system chłodzenia z komorą parową i ciekłym metalem dba o niskie temperatury nawet podczas najbardziej intensywnych sesji.", 
            7999, laptopyGamingowe, 
            List.of("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"),
            Map.of(producent, "ASUS", cpu, "AMD Ryzen 9 7940HS", gpu, "RTX 4070", ram, "16GB DDR5"));

        createP("Razer Blade 15", 
            "Razer Blade 15 to szczyt inżynierii laptopów gamingowych. Obudowa wycięta z jednego bloku aluminium przy użyciu CNC skrywa podzespoły, które zawstydzają wiele komputerów stacjonarnych. \n\n" +
            "Wyświetlacz o niesamowitej częstotliwości odświeżania oraz pełne pokrycie gamy kolorów DCI-P3 sprawiają, że to idealny wybór nie tylko dla graczy, ale i dla twórców treści. Klawiatura z podświetleniem Razer Chroma RGB pozwala na personalizację każdego przycisku z osobna, a system chłodzenia oparty na zaawansowanej komorze parowej zapewnia stabilną pracę bez throttlingu.", 
            12499, laptopyGamingowe, 
            List.of("https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800"),
            Map.of(producent, "Razer", cpu, "Intel Core i9-13900H", gpu, "RTX 4080", ram, "32GB DDR5"));
            
        // Add 5 more to reach ~10
        createP("HP Spectre x360", "Laptop 2-w-1.", 6499, laptopy, List.of("https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=800"), Map.of(producent, "HP", cpu, "i7-1355U", ram, "16GB"));
        createP("ASUS Zenbook S 13", "OLED Ultra-Thin.", 5999, laptopy, List.of("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"), Map.of(producent, "ASUS", cpu, "i7-1355U", ram, "16GB", ekran, "13.3 OLED"));
        createP("MSI Raider GE78", "RGB Monster.", 14999, laptopyGamingowe, List.of("https://images.unsplash.com/photo-1580522151917-c205f257bf8c?w=800"), Map.of(producent, "MSI", gpu, "RTX 4090", ram, "64GB"));
        createP("Lenovo Legion 5 Pro", "Balanced Gaming.", 6199, laptopyGamingowe, List.of("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"), Map.of(producent, "Lenovo", gpu, "RTX 4060", ram, "16GB"));
        createP("Acer Predator Helios", "Price Performance King.", 5499, laptopyGamingowe, List.of("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"), Map.of(producent, "Acer", gpu, "RTX 4060", ram, "16GB"));
    }

    private void seedSmartphones(ProductAttribute producent, ProductAttribute cpu, ProductAttribute ram, ProductAttribute storage, ProductAttribute ekran, ProductAttribute bateria, Category smartfony) {
        createP("Apple iPhone 15 Pro", 
            "iPhone 15 Pro to pierwszy iPhone o konstrukcji z tytanu klasy lotniczej, z tego samego stopu, którego używa się w pojazdach kosmicznych wysyłanych na Marsa. Tytan ma jeden z najlepszych relacji wytrzymałości do masy wśród wszystkich metali, dzięki czemu są to nasze najlżejsze modele Pro w historii. \n\n" +
            "Sercem urządzenia jest czip A17 Pro – przełomowy układ, który zapewnia najwyższą wydajność graficzną w historii Apple. Konfigurowalny przycisk czynności pozwala na błyskawiczne uruchomienie ulubionej funkcji, a złącze USB-C obsługuje standard USB 3, oferując niesamowitą szybkość transferu danych. System aparatów z siedmioma profesjonalnymi obiektywami pozwala uchwycić każdy szczegół w niesamowitej jakości.", 
            5999, smartfony, 
            List.of("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800", "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800"),
            Map.of(producent, "Apple", cpu, "A17 Pro", ram, "8GB", storage, "256GB", ekran, "6.1 Super Retina XDR OLED 120Hz", getOrCreateAttribute("Złącze"), "USB-C"));

        createP("Samsung Galaxy S24 Ultra", 
            "Witamy w erze mobilnej sztucznej inteligencji. Z Galaxy S24 Ultra w Twoich rękach możesz uwolnić zupełnie nowe pokłady kreatywności i produktywności. Wszystko zaczyna się od najważniejszego urządzenia w Twoim życiu. \n\n" +
            "Nowa tytanowa obudowa chroni urządzenie lepiej niż kiedykolwiek, a wbudowany rysik S Pen kontynuuje dziedzictwo serii Note, pozwalając na precyzyjne pisanie i rysowanie. Rewolucyjny aparat 200 MP z silnikiem ProVisual Engine rozjaśnia noc i optymalizuje detale, a najpotężniejszy procesor Snapdragon 8 Gen 3 for Galaxy zapewnia płynność w najbardziej wymagających grach z ray tracingiem.", 
            6599, smartfony, 
            List.of("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800"),
            Map.of(producent, "Samsung", cpu, "Snapdragon 8 Gen 3 for Galaxy", ram, "12GB", storage, "512GB", bateria, "5000mAh", getOrCreateAttribute("Aparat"), "200 MP + 50 MP + 12 MP + 10 MP"));

        createP("Google Pixel 8 Pro", 
            "Pixel 8 Pro to profesjonalny telefon zaprojektowany przez Google. Jest elegancki, nowoczesny i wyposażony w najbardziej zaawansowany system aparatów Pixel, który pozwala na robienie niesamowitych zdjęć i filmów nawet w słabym świetle. \n\n" +
            "Dzięki nowemu układowi Google Tensor G3, Pixel 8 Pro jest szybszy i bardziej wydajny, a sztuczna inteligencja Google pomaga Ci w ciągu dnia w zupełnie nowy sposób – od usuwania niechcianych dźwięków z filmów po automatyczne podsumowywanie nagrań głosowych. Ekran Super Actua o jasności do 2400 nitów sprawia, że wszystko jest czytelne nawet w pełnym słońcu.", 
            4499, smartfony, 
            List.of("https://images.unsplash.com/photo-1598327105666-5b89351af9db?w=800"),
            Map.of(producent, "Google", cpu, "Google Tensor G3", ram, "12GB", storage, "128GB", ekran, "6.7 LTPO OLED", getOrCreateAttribute("System"), "Android 14"));

        createP("Xiaomi 14 Ultra", "Optyka Leica nowej generacji. Cztery aparaty 50MP z systemem soczewek przysłony bezstopniowej. Procesor Snapdragon 8 Gen 3 zapewnia bezkompromisową wydajność w najbardziej wymagających aplikacjach i grach.", 5799, smartfony, 
            List.of("https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800"),
            Map.of(producent, "Xiaomi", ram, "16GB LPDDR5X", storage, "512GB UFS 4.0", ekran, "6.73 AMOLED WQHD+", bateria, "5000mAh (90W HyperCharge)"));

        createP("Nothing Phone (2)", "Interfejs Glyph.", 2699, smartfony, List.of("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"), Map.of(producent, "Nothing", storage, "256GB"));
        createP("OnePlus 12", "Szybki jak błyskawica.", 3899, smartfony, List.of("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"), Map.of(producent, "OnePlus", ram, "16GB", bateria, "5400mAh"));
        createP("Sony Xperia 1 V", "Dla twórców wideo.", 5299, smartfony, List.of("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"), Map.of(producent, "Sony", ekran, "6.5 4K OLED"));
        createP("ASUS Zenfone 10", "Kompaktowa moc.", 3399, smartfony, List.of("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"), Map.of(producent, "ASUS", ekran, "5.9 AMOLED"));
        createP("Motorola Edge 40 Pro", "Ekran 165Hz.", 3499, smartfony, List.of("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"), Map.of(producent, "Motorola", ram, "12GB"));
        createP("iPhone 15 Plus", "Dłuższa bateria.", 4999, smartfony, List.of("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"), Map.of(producent, "Apple", storage, "128GB"));
    }

    private void seedAudio(ProductAttribute producent, ProductAttribute kolor, ProductAttribute moc, ProductAttribute bateria, ProductAttribute cpu, Category sluchawki, Category glosniki) {
        createP("Sony WH-1000XM5", 
            "Słuchawki Sony WH-1000XM5 wyznaczają nowe standardy w dziedzinie bezprzewodowej redukcji hałasu i jakości dźwięku. Wyposażone w dwa procesory sterujące ośmioma mikrofonami oraz specjalnie zaprojektowany przetwornik akustyczny, oferują niesamowite wrażenia słuchowe. \n\n" +
            "Innowacyjna technologia Auto NC Optimizer automatycznie optymalizuje redukcję hałasu w zależności od warunków otoczenia, a cztery mikrofony kształtujące wiązkę zapewniają krystaliczną czystość rozmów telefonicznych nawet w wietrzne dni. Bateria wystarczająca na 30 godzin pracy pozwala na wielodniowe słuchanie bez konieczności ładowania.", 
            1399, sluchawki, 
            List.of("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"),
            Map.of(producent, "Sony", kolor, "Czarny", bateria, "30h", getOrCreateAttribute("Złącze"), "Bluetooth 5.2 / Jack 3.5mm"));

        createP("Apple AirPods Max", 
            "AirPods Max to zupełnie nowe spojrzenie na słuchawki wokółuszne. Zaprojektowany przez Apple przetwornik dynamiczny zapewnia wierne odtwarzanie dźwięku o wysokiej jakości. Każdy element konstrukcji – od sklepienia z oddychającej siateczki po poduszki z zapamiętującej kształt pianki – stworzono z myślą o idealnym dopasowaniu. \n\n" +
            "Słuchawki oferują czołową w branży aktywną redukcję hałasu, tryb kontaktu pozwalający słyszeć otoczenie oraz spersonalizowany dźwięk przestrzenny z dynamicznym śledzeniem ruchu głowy, co sprawia, że czujesz się jak w kinie.", 
            2399, sluchawki, 
            List.of("https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800"),
            Map.of(producent, "Apple", kolor, "Silver", bateria, "20h", cpu, "Apple H1 (w każdym nauszniku)"));

        createP("JBL Boombox 3", 
            "JBL Boombox 3 to najpotężniejszy przenośny głośnik Bluetooth, który dostarcza kultowe brzmienie JBL Original Pro Sound z najgłębszym basem. Nowy 3-drożny system głośników zapewnia wyższą czułość i mniejsze zniekształcenia przy każdej głośności. \n\n" +
            "Dzięki certyfikatowi IP67 głośnik jest całkowicie odporny na pył i wodę, więc możesz zabrać go na plażę lub nad basen. Imponująca bateria pozwala na 24 godziny odtwarzania muzyki, a funkcja PartyBoost umożliwia połączenie wielu głośników w celu uzyskania jeszcze potężniejszego brzmienia.", 
            1899, glosniki, 
            List.of("https://images.unsplash.com/photo-1608156639585-340034a060d4?w=800"),
            Map.of(producent, "JBL", moc, "180W (AC) / 136W (Bateria)", bateria, "24h", getOrCreateAttribute("Waga"), "6.7 kg"));
            
        createP("Marshall Stanmore III", 
            "Stanmore III to model ze środka oferty domowej Marshalla, który zapewnia szeroką scenę dźwiękową i wypełnia dom kultowym brzmieniem. Wyposażony w skierowane na zewnątrz głośniki wysokotonowe i zaktualizowane falowody, model ten dostarcza spójny, mocny dźwięk. \n\n" +
            "Funkcja Dynamic Loudness dostosowuje balans tonalny dźwięku, zapewniając doskonałą jakość przy każdym poziomie głośności. Wykonany z dbałością o detale, łączy klasyczny design Marshalla z nowoczesnymi rozwiązaniami, takimi jak Bluetooth 5.2 i wejście RCA.", 
            1499, glosniki, List.of("https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800"), Map.of(producent, "Marshall", moc, "80W", kolor, "Black/Cream", getOrCreateAttribute("Wejścia"), "Bluetooth, RCA, 3.5mm"));

        createP("Sennheiser Momentum 4 Wireless", 
            "Poznaj nową generację legendarnych słuchawek Momentum. Zainspirowane muzyką, oferują audiofilską jakość dźwięku Sennheiser w połączeniu z niesamowitym komfortem i rekordowym czasem pracy na baterii. \n\n" +
            "Dzięki 42-milimetrowemu systemowi przetworników o wysokiej dynamice oraz zaawansowanej adaptacyjnej redukcji szumów, Momentum 4 pozwalają usłyszeć każdy niuans muzyki bez zakłóceń z zewnątrz. Inteligentne funkcje, takie jak Smart Pause, ułatwiają codzienne użytkowanie.", 
            1299, sluchawki, List.of("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"), Map.of(producent, "Sennheiser", bateria, "60h", getOrCreateAttribute("Kodeki"), "SBC, AAC, aptX Adaptive"));
    }

    private void seedGaming(ProductAttribute producent, ProductAttribute kolor, ProductAttribute storage, Category myszki) {
        createP("Logitech G Pro X Superlight 2", 
            "Logitech G Pro X Superlight 2 to ewolucja legendy. Zaprojektowana we współpracy z czołowymi profesjonalistami e-sportowymi, waży zaledwie 60 gramów, co czyni ją jedną z najlżejszych myszek na rynku. \n\n" +
            "Wyposażona w przełączniki hybrydowe LIGHTFORCE, które łączą szybkość optyków z mechanicznym kliknięciem, oraz sensor HERO 2 z czułością do 32 000 DPI. Bezprzewodowa technologia LIGHTSPEED oferuje niezrównaną szybkość reakcji i niezawodność podczas turniejowych zmagań.", 
            749, myszki, 
            List.of("https://images.unsplash.com/photo-1615663248861-2446a95bb0ad?w=800"),
            Map.of(producent, "Logitech G", kolor, "White/Black", storage, "HERO 2 (32000 DPI)", getOrCreateAttribute("Waga"), "60g"));

        createP("Razer BlackWidow V4 Pro", 
            "Zdominuj pole bitwy dzięki klawiaturze, która oferuje pełną kontrolę i nieskazitelną immersję. Razer BlackWidow V4 Pro posiada dedykowane pokrętło kontrolne oraz 8 klawiszy makro, które ułatwiają sterowanie w grach i podczas pracy. \n\n" +
            "Przełączniki mechaniczne Razer zapewniają precyzyjną aktywację i satysfakcjonujące kliknięcie, podczas gdy obustronne podświetlenie Underglow w połączeniu z Razer Chroma™ RGB tworzy spektakularny pokaz świetlny na Twoim biurku.", 
            1149, myszki, 
            List.of("https://images.unsplash.com/photo-1618384800394-2456b89c7d12?w=800"),
            Map.of(producent, "Razer", kolor, "Black", getOrCreateAttribute("Typ przełączników"), "Razer Green/Yellow", getOrCreateAttribute("Podświetlenie"), "Chroma RGB"));
    }

    private void seedHomeOffice(ProductAttribute producent, ProductAttribute ekran, ProductAttribute odswiezanie, Category monitory) {
        createP("LG UltraGear 27GP850", "NanoIPS dla graczy.", 1699, monitory, 
            List.of("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"),
            Map.of(producent, "LG", ekran, "27 QHD", odswiezanie, "165Hz"));

        createP("Dell UltraSharp U2723QE", "Panel IPS Black 4K.", 2899, monitory, 
            List.of("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"),
            Map.of(producent, "Dell", ekran, "27 4K", odswiezanie, "60Hz"));
    }

    private void seedComponents(ProductAttribute producent, ProductAttribute cpu, ProductAttribute ram, ProductAttribute gpu, ProductAttribute storage, Category podzespoly, Category kartyGraficzne, Category procesory) {
        createP("NVIDIA GeForce RTX 4080 Super", 
            "Karta graficzna NVIDIA® GeForce RTX™ 4080 Super zapewnia niezwykłą wydajność dla najbardziej wymagających graczy i twórców. Dzięki architekturze Ada Lovelace i technologii DLSS 3, możesz cieszyć się fotorealistyczną grafiką z ray tracingiem w najwyższych rozdzielczościach. \n\n" +
            "Karta została wyposażona w 16 GB szybkiej pamięci G6X, a jej zaawansowany system chłodzenia pozwala na stabilną pracę pod dużym obciążeniem. To potężne narzędzie zarówno do gier 4K, jak i profesjonalnego montażu wideo czy renderowania 3D.", 
            4899, kartyGraficzne, 
            List.of("https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"),
            Map.of(producent, "NVIDIA Founders Edition", ram, "16GB GDDR6X", gpu, "Ada Lovelace (AD103)", getOrCreateAttribute("TDP"), "320W"));

        createP("Intel Core i9-14900K", 
            "Procesory Intel® Core™ i9 czternastej generacji to szczyt inżynierii procesorowej dla komputerów stacjonarnych. Wyposażony w 24 rdzenie i 32 wątki, i9-14900K oferuje niespotykaną wydajność wielozadaniową i jest najszybszym procesorem do gier. \n\n" +
            "Dzięki technologii Intel® Thermal Velocity Boost zegar procesora może osiągać zawrotną prędkość 6,0 GHz bez potrzeby manualnego podkręcania. Współpraca z pamięciami DDR5 i magistralą PCIe 5.0 sprawia, że jest to fundament najbardziej zaawansowanych konfiguracji PC.", 
            2849, procesory, 
            List.of("https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"),
            Map.of(producent, "Intel", cpu, "24-cores (8P+16E) up to 6.0GHz", storage, "Cache 36MB", getOrCreateAttribute("Socket"), "LGA1700"));
    }

    private void seedRtvAgd(ProductAttribute producent, ProductAttribute ekran, ProductAttribute moc, Category rtvAgd, Category telewizory) {
        createP("Samsung OLED S95C 65", 
            "Przeżyj niesamowite wrażenia wizualne z najnowszym telewizorem OLED firmy Samsung. Dzięki technologii Quantum HDR OLED+, obraz jest niezwykle jasny, a kolory nasycone i realistyczne jak nigdy dotąd. \n\n" +
            "Procesor AI Quantum 4K optymalizuje każdą scenę przy użyciu sztucznej inteligencji, zapewniając płynność ruchu i głęboką czerń. Ultra-smukły design Infinity One sprawia, że telewizor wygląda jak dzieło sztuki, a system dźwięku Dolby Atmos 4.2.2 CH przenosi Cię w samo centrum akcji.", 
            11999, telewizory, 
            List.of("https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800"),
            Map.of(producent, "Samsung", ekran, "65 QD-OLED 4K 144Hz", getOrCreateAttribute("System Smart"), "Tizen OS", getOrCreateAttribute("HDR"), "HDR10+, HLG"));

        createP("DeLonghi Dinamica Plus ECAM 370.70.B", 
            "Dinamica Plus to w pełni automatyczny ekspres do kawy, który łączy w sobie elegancję, wydajność i nowoczesną technologię. Dzięki systemowi LatteCrema, ekspres przygotowuje gęstą i kremową piankę mleczną o idealnej temperaturze za jednym dotknięciem. \n\n" +
            "Kolorowy wyświetlacz dotykowy TFT ułatwia personalizację ulubionych napojów, a funkcja 'My' pozwala dostosować aromat oraz ilość kawy i mleka do własnych preferencji. Ekspres oferuje szeroki wybór przepisów – od klasycznego Espresso po modne Flat White.", 
            3499, rtvAgd, 
            List.of("https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800"),
            Map.of(producent, "DeLonghi", moc, "1450W", getOrCreateAttribute("Ciśnienie"), "19 bar", getOrCreateAttribute("Młynek"), "Stalowy żarnowy"));
    }

    private void createP(String name, String desc, double price, Category cat, List<String> imgs, Map<ProductAttribute, String> attrs) {
        createProduct(name, desc, new BigDecimal(price), cat, imgs, attrs);
    }


    private ProductAttribute getOrCreateAttribute(String name) {
        return productAttributeRepository.findByName(name)
                .orElseGet(() -> productAttributeRepository.save(ProductAttribute.builder().name(name).build()));
    }

    private Category getOrCreateCategory(String name, Category parent) {
        Optional<Category> existing = categoryRepository.findByName(name);
        if (existing.isPresent()) {
            return existing.get();
        }
        Category category = Category.builder()
                .name(name)
                .parent(parent)
                .build();
        return categoryRepository.save(category);
    }

    private void createProduct(String name, String description, BigDecimal price, Category category, List<String> images, Map<ProductAttribute, String> attributes) {
        Product product = Product.builder()
                .name(name)
                .description(description)
                .price(price)
                .category(category)
                .status(Product.Status.AKTYWNY)
                .build();

        if (images != null) {
            for (String img : images) {
                product.getImages().add(ProductImage.builder().product(product).imagePath(img).build());
            }
        }

        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .sku(category.getName().substring(0, 3).toUpperCase() + "-" + Math.abs(name.hashCode()))
                .stockQuantity(10 + new Random().nextInt(50))
                .build();

        if (attributes != null) {
            for (Map.Entry<ProductAttribute, String> entry : attributes.entrySet()) {
                ProductAttributeValue value = ProductAttributeValue.builder()
                        .attribute(entry.getKey())
                        .value(entry.getValue())
                        .build();
                // Note: Values are usually saved via cascade if configured, 
                // but let's ensure they are linked to the variant if needed by your schema
                variant.getAttributeValues().add(value);
            }
        }

        product.getVariants().add(variant);
        productRepository.save(product);
    }
}
