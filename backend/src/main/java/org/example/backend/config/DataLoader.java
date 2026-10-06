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
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    private static final List<String> LAPTOP_IMAGES = List.of(
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
            "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800",
            "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800",
            "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"
    );
    private static final List<String> LAPTOP_GAMING_IMAGES = List.of(
            "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800",
            "https://images.unsplash.com/photo-1580522151917-c205f257bf8c?w=800",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800"
    );
    private static final List<String> MONITOR_IMAGES = List.of(
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
            "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800",
            "https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=800",
            "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800",
            "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800"
    );
    private static final List<String> HEADPHONES_IMAGES = List.of(
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
            "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800",
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800"
    );
    private static final List<String> SPEAKER_IMAGES = List.of(
            "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800",
            "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800",
            "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
            "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800",
            "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800",
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800"
    );
    private static final List<String> MOUSE_IMAGES = List.of(
            "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800",
            "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=800",
            "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800",
            "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=800",
            "https://images.unsplash.com/photo-1613141411244-0e4ac259d217?w=800",
            "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800"
    );
    private static final List<String> KEYBOARD_IMAGES = List.of(
            "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800",
            "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800",
            "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?w=800",
            "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800",
            "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=800"
    );
    private static final List<String> TABLET_IMAGES = List.of(
            "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
            "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800",
            "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800"
    );
    private static final List<String> CONSOLE_IMAGES = List.of(
            "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800",
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800",
            "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800",
            "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800"
    );
    private static final List<String> CAMERA_IMAGES = List.of(
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800",
            "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800",
            "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800"
    );
    private static final List<String> ROUTER_IMAGES = List.of(
            "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800",
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
            "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800",
            "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800"
    );

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();

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

        // Subcategories
        Category sluchawki = getOrCreateCategory("Słuchawki", audio);
        Category glosniki = getOrCreateCategory("Głośniki", audio);
        Category kinoDomowe = getOrCreateCategory("Kino domowe", audio);

        Category myszkiKlawiatury = getOrCreateCategory("Myszki i klawiatury", gamingAcc);
        Category foteleGamingowe = getOrCreateCategory("Fotele gamingowe", gamingAcc);
        Category podkladkiAkcesoria = getOrCreateCategory("Podkładki i akcesoria", gamingAcc);
        Category konsole = getOrCreateCategory("Konsole do gier", gamingAcc);

        Category monitory = getOrCreateCategory("Monitory", homeOffice);
        Category biurkaKrzesla = getOrCreateCategory("Biurka i krzesła", homeOffice);
        Category oprogramowanie = getOrCreateCategory("Oprogramowanie", homeOffice);
        Category sieci = getOrCreateCategory("Urządzenia sieciowe", homeOffice);
        Category kamery = getOrCreateCategory("Kamery i aparaty", homeOffice);

        Category telewizory = getOrCreateCategory("Telewizory", rtvAgd);
        Category ekspresy = getOrCreateCategory("Ekspresy do kawy", rtvAgd);
        Category maleAgd = getOrCreateCategory("Małe AGD", rtvAgd);

        Category tablety = getOrCreateCategory("Tablety", smartfony);

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
        // Seeding each category (createProduct will handle existence check)
        seedLaptops(producent, cpu, ram, gpu, ekran, laptopy, laptopyGamingowe);
        seedSmartphones(producent, cpu, ram, storage, ekran, bateria, smartfony);
        seedAudio(producent, kolor, moc, bateria, cpu, sluchawki, glosniki);
        seedGaming(producent, kolor, storage, myszkiKlawiatury);
        seedHomeOffice(producent, ekran, odswiezanie, monitory);
        seedComponents(producent, cpu, ram, gpu, storage, podzespoly, kartyGraficzne, procesory);
        seedRtvAgd(producent, ekran, moc, telewizory, ekspresy);

        // --- MASSIVE FAKE DATA LOADER ---
        seedMassiveFakeProducts(producent, kolor, ram, storage,
                laptopy, laptopyGamingowe, monitory, sluchawki, glosniki, myszkiKlawiatury, tablety, konsole, sieci, kamery);
        seedRandomOrders();
    }

    private void seedRandomOrders() {
        Random rand = new Random(42);
        List<User> users = userRepository.findAll();
        List<ProductVariant> variants = productVariantRepository.findAll();
        
        if (users.isEmpty() || variants.isEmpty()) return;

        // Ensure users have addresses
        List<User> usersWithAddresses = new ArrayList<>();
        for (User u : users) {
            if (!u.getAddresses().isEmpty()) {
                usersWithAddresses.add(u);
            }
        }
        
        if (usersWithAddresses.isEmpty()) return; // Needs addresses for orders
        
        int ordersCount = (int) cartRepository.count() + 100; // Let's add 100 fake orders
        
        for (int i = 0; i < 100; i++) {
            User user = usersWithAddresses.get(rand.nextInt(usersWithAddresses.size()));
            Address address = user.getAddresses().get(0);
            
            Order order = Order.builder()
                .user(user)
                .address(address)
                .status(Order.Status.values()[rand.nextInt(Order.Status.values().length)])
                .paymentStatus("Opłacone")
                .paymentMethod("Karta")
                .shippingMethod("Kurier")
                .shippingFee(new BigDecimal("15.00"))
                .items(new ArrayList<>())
                .build();
                
            int numItems = 1 + rand.nextInt(4);
            BigDecimal total = BigDecimal.ZERO;
            
            for (int j = 0; j < numItems; j++) {
                ProductVariant variant = variants.get(rand.nextInt(variants.size()));
                int quantity = 1 + rand.nextInt(3);
                BigDecimal price = variant.getPrice() != null ? variant.getPrice() : variant.getProduct().getPrice();
                
                OrderItem item = OrderItem.builder()
                    .order(order)
                    .product(variant.getProduct())
                    .variantId(variant.getId())
                    .quantity(quantity)
                    .price(price)
                    .build();
                    
                order.getItems().add(item);
                total = total.add(price.multiply(BigDecimal.valueOf(quantity)));
            }
            
            order.setTotalPrice(total.add(order.getShippingFee()));
            orderRepository.save(order);
        }
    }

    private void seedMassiveFakeProducts(ProductAttribute producent, ProductAttribute kolor, ProductAttribute ram, ProductAttribute storage,
            Category laptopy, Category laptopyGamingowe, Category monitory, Category sluchawki, Category glosniki,
            Category myszkiKlawiatury, Category tablety, Category konsole, Category sieci, Category kamery) {
        Random rand = new Random(42); // deterministic

        List<String> adjectives = List.of("Pro", "Max", "Ultra", "Lite", "Gaming", "Business", "Home", "Smart", "Eco", "Premium");
        List<String> nouns = List.of("Laptop", "Monitor", "Headphones", "Speaker", "Mouse", "Keyboard", "Router", "Camera", "Tablet", "Console");
        List<String> brands = List.of("Samsung", "Apple", "Lenovo", "Dell", "HP", "Asus", "Acer", "Sony", "JBL", "Logitech");
        List<String> colors = List.of("Black", "White", "Silver", "Gray", "Red", "Blue", "Green", "Rose Gold");
        List<String> rams = List.of("4GB", "8GB", "16GB", "32GB", "64GB");
        List<String> storages = List.of("128GB", "256GB", "512GB", "1TB", "2TB");
        
        List<User> users = userRepository.findAll();
        if (users.isEmpty()) return;
        List<String> reviewComments = List.of("Świetny produkt, polecam!", "Działa jak należy.", "Trochę za drogi, ale jakość super.", "Bateria trzyma krócej niż zakładałem.", "Wykonanie bardzo solidne.", "Jeden z najlepszych zakupów w tym roku.", "Nie polecam, szybko się zepsuł.", "Wszystko zgodnie z opisem.", "Idealny na prezent.", "Sprzęt godny uwagi.");

        // Generate 250 products
        for (int i = 0; i < 250; i++) {
            String brand = brands.get(rand.nextInt(brands.size()));
            String noun = nouns.get(rand.nextInt(nouns.size()));
            String adj = adjectives.get(rand.nextInt(adjectives.size()));
            String name = brand + " " + noun + " " + adj + " " + (1000 + rand.nextInt(9000));

            Category cat;
            List<String> pool;
            switch (noun) {
                case "Laptop":
                    if ("Gaming".equals(adj)) {
                        cat = laptopyGamingowe;
                        pool = LAPTOP_GAMING_IMAGES;
                    } else {
                        cat = laptopy;
                        pool = LAPTOP_IMAGES;
                    }
                    break;
                case "Monitor":
                    cat = monitory;
                    pool = MONITOR_IMAGES;
                    break;
                case "Headphones":
                    cat = sluchawki;
                    pool = HEADPHONES_IMAGES;
                    break;
                case "Speaker":
                    cat = glosniki;
                    pool = SPEAKER_IMAGES;
                    break;
                case "Mouse":
                case "Keyboard":
                    cat = myszkiKlawiatury;
                    pool = noun.equals("Mouse") ? MOUSE_IMAGES : KEYBOARD_IMAGES;
                    break;
                case "Tablet":
                    cat = tablety;
                    pool = TABLET_IMAGES;
                    break;
                case "Console":
                    cat = konsole;
                    pool = CONSOLE_IMAGES;
                    break;
                case "Camera":
                    cat = kamery;
                    pool = CAMERA_IMAGES;
                    break;
                case "Router":
                    cat = sieci;
                    pool = ROUTER_IMAGES;
                    break;
                default:
                    cat = laptopy;
                    pool = LAPTOP_IMAGES;
                    break;
            }

            String desc = "Niesamowity " + noun.toLowerCase() + " od " + brand + ", zaprojektowany dla " + adj.toLowerCase() + " użytkowników. Oferuje najwyższą jakość wykonania i doskonałą wydajność.";
            double price = 100 + rand.nextInt(8900) + 0.99;
            
            Map<ProductAttribute, String> attrs = new HashMap<>();
            attrs.put(producent, brand);
            attrs.put(kolor, colors.get(rand.nextInt(colors.size())));
            
            if (noun.equals("Laptop") || noun.equals("Tablet")) {
                attrs.put(ram, rams.get(rand.nextInt(rams.size())));
                attrs.put(storage, storages.get(rand.nextInt(storages.size())));
            }

            int imgIdx1 = (name.hashCode() & 0x7fffffff) % pool.size();
            int imgIdx2 = (imgIdx1 + 1) % pool.size();
            List<String> productImgs = pool.size() > 1 ? List.of(pool.get(imgIdx1), pool.get(imgIdx2)) : List.of(pool.get(imgIdx1));

            createProductWithReviews(name, desc, new BigDecimal(price), cat, 
                productImgs, 
                attrs, rand, users, reviewComments);
        }
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("pracownik@example.com")) {
            User employee = User.builder()
                    .name("Pracownik Sklepu")
                    .email("pracownik@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.pracownik)
                    .emailVerifiedAt(java.time.LocalDateTime.now())
                    .build();
            userRepository.save(employee);
        }

        if (!userRepository.existsByEmail("admin@example.com")) {
            User admin = User.builder()
                    .name("Administrator")
                    .email("admin@example.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(User.Role.admin)
                    .emailVerifiedAt(java.time.LocalDateTime.now())
                    .build();
            userRepository.save(admin);
        }
    }

    private void seedLaptops(ProductAttribute producent, ProductAttribute cpu, ProductAttribute ram,
            ProductAttribute gpu, ProductAttribute ekran, Category laptopy, Category laptopyGamingowe) {
        // Sample Laptops
        createP("Apple MacBook Air M2",
                "Przeprojektowany wokół czipa M2 nowej generacji, MacBook Air jest uderzająco smukły i zamknięty w wytrzymałej, aluminiowej obudowie. To niewiarygodnie szybki i wydajny laptop, który pozwala pracować, bawić się i tworzyć niemal wszystko – gdziekolwiek zechcesz. \n\n"
                        +
                        "Dzięki czipowi M2 laptop jest oszczędny w zużyciu energii, co przekłada się na wydajność bez konieczności używania wentylatora – pracuje więc bezszelestnie, nawet przy dużym obciążeniu. Wrażenia wizualne zapewnia 13,6-calowy wyświetlacz Liquid Retina, który jest największy i najjaśniejszy w historii modelu Air, wspierając miliard kolorów.",
                5499, laptopy,
                List.of("https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
                        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800"),
                Map.of(producent, "Apple", cpu, "Apple M2 (8-rdzeniowe CPU)", ram, "8GB Unified Memory", ekran,
                        "13.6 Liquid Retina (2560x1664)", getOrCreateAttribute("Bateria"), "do 18h"));

        createP("Dell XPS 13 Plus 9320",
                "Dell XPS 13 Plus to najbardziej potężny 13-calowy laptop XPS w historii, zaprojektowany tak, aby był dwukrotnie wydajniejszy od poprzednika przy zachowaniu tej samej kompaktowej obudowy. \n\n"
                        +
                        "Urządzenie wyróżnia się nowoczesnym minimalistycznym wyglądem. Klawiatura typu Zero-lattice, haptyczny szklany panel dotykowy oraz funkcyjne przyciski dotykowe nadają mu futurystyczny charakter. Wyświetlacz OLED o rozdzielczości 3.5K zapewnia kinowe wrażenia kolorystyczne, a procesory Intel Core i7 13. generacji gwarantują płynność nawet w wymagających aplikacjach profesjonalnych.",
                7299, laptopy,
                List.of("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800"),
                Map.of(producent, "Dell", cpu, "Intel Core i7-1360P", ram, "16GB LPDDR5", ekran, "13.4 OLED 3.5K Touch",
                        getOrCreateAttribute("Kolor"), "Graphite"));

        createP("Lenovo ThinkPad X1 Carbon Gen 11",
                "Zbudowany we współpracy z firmą Intel®, laptop Lenovo ThinkPad X1 Carbon Gen 11 spełnia wymagania projektowe platformy Intel® Evo™. Legendarna trwałość ThinkPada łączy się tu z najnowocześniejszymi technologiami ochrony danych i łączności. \n\n"
                        +
                        "Wyposażony w legendarną klawiaturę odporną na zalanie, Carbon Gen 11 oferuje niesamowitą mobilność dzięki wadze wynoszącej zaledwie 1,12 kg. System głośników Dolby Atmos® zapewnia krystalicznie czysty dźwięk, a zaawansowana kamera z przesłoną ThinkShutter dba o Twoją prywatność. To idealne narzędzie dla liderów biznesu, którzy nie uznają kompromisów.",
                8999, laptopy,
                List.of("https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800"),
                Map.of(producent, "Lenovo", cpu, "Intel Core i7-1355U", ram, "32GB LPDDR5x", ekran,
                        "14.0 WUXGA IPS Low Power", getOrCreateAttribute("Pojemność dysku"), "1TB SSD NVMe"));

        // Gaming Laptops
        createP("ASUS ROG Zephyrus G14",
                "ASUS ROG Zephyrus G14 na rok 2024 to najpotężniejszy 14-calowy laptop gamingowy na świecie. Dzięki unikalnemu designowi AniMe Matrix i kompaktowej obudowie, łączy styl z niesamowitą mocą obliczeniową. \n\n"
                        +
                        "Sercem maszyny jest procesor AMD Ryzen 9 wspomagany przez kartę graficzną NVIDIA GeForce RTX z serii 40, co pozwala na płynną grę w najnowsze tytuły AAA na fenomenalnym ekranie ROG Nebula. Innowacyjny system chłodzenia z komorą parową i ciekłym metalem dba o niskie temperatury nawet podczas najbardziej intensywnych sesji.",
                7999, laptopyGamingowe,
                List.of("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"),
                Map.of(producent, "ASUS", cpu, "AMD Ryzen 9 7940HS", gpu, "RTX 4070", ram, "16GB DDR5"));

        createP("Razer Blade 15",
                "Razer Blade 15 to szczyt inżynierii laptopów gamingowych. Obudowa wycięta z jednego bloku aluminium przy użyciu CNC skrywa podzespoły, które zawstydzają wiele komputerów stacjonarnych. \n\n"
                        +
                        "Wyświetlacz o niesamowitej częstotliwości odświeżania oraz pełne pokrycie gamy kolorów DCI-P3 sprawiają, że to idealny wybór nie tylko dla graczy, ale i dla twórców treści. Klawiatura z podświetleniem Razer Chroma RGB pozwala na personalizację każdego przycisku z osobna, a system chłodzenia oparty na zaawansowanej komorze parowej zapewnia stabilną pracę bez throttlingu.",
                12499, laptopyGamingowe,
                List.of("https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800"),
                Map.of(producent, "Razer", cpu, "Intel Core i9-13900H", gpu, "RTX 4080", ram, "32GB DDR5"));

        // Add 5 more to reach ~10
        createP("HP Spectre x360", "Laptop 2-w-1.", 6499, laptopy,
                List.of("https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?w=800"),
                Map.of(producent, "HP", cpu, "i7-1355U", ram, "16GB"));
        createP("ASUS Zenbook S 13", "OLED Ultra-Thin.", 5999, laptopy,
                List.of("https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800"),
                Map.of(producent, "ASUS", cpu, "i7-1355U", ram, "16GB", ekran, "13.3 OLED"));
        createP("MSI Raider GE78", "RGB Monster.", 14999, laptopyGamingowe,
                List.of("https://images.unsplash.com/photo-1580522151917-c205f257bf8c?w=800"),
                Map.of(producent, "MSI", gpu, "RTX 4090", ram, "64GB"));
        createP("Lenovo Legion 5 Pro", "Balanced Gaming.", 6199, laptopyGamingowe,
                List.of("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"),
                Map.of(producent, "Lenovo", gpu, "RTX 4060", ram, "16GB"));
        createP("Acer Predator Helios", "Price Performance King.", 5499, laptopyGamingowe,
                List.of("https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"),
                Map.of(producent, "Acer", gpu, "RTX 4060", ram, "16GB"));
    }

    private void seedSmartphones(ProductAttribute producent, ProductAttribute cpu, ProductAttribute ram,
            ProductAttribute storage, ProductAttribute ekran, ProductAttribute bateria, Category smartfony) {
        createP("Apple iPhone 15 Pro",
                "iPhone 15 Pro to pierwszy iPhone o konstrukcji z tytanu klasy lotniczej, z tego samego stopu, którego używa się w pojazdach kosmicznych wysyłanych na Marsa. Tytan ma jeden z najlepszych relacji wytrzymałości do masy wśród wszystkich metali, dzięki czemu są to nasze najlżejsze modele Pro w historii. \n\n"
                        +
                        "Sercem urządzenia jest czip A17 Pro – przełomowy układ, który zapewnia najwyższą wydajność graficzną w historii Apple. Konfigurowalny przycisk czynności pozwala na błyskawiczne uruchomienie ulubionej funkcji, a złącze USB-C obsługuje standard USB 3, oferując niesamowitą szybkość transferu danych. System aparatów z siedmioma profesjonalnymi obiektywami pozwala uchwycić każdy szczegół w niesamowitej jakości.",
                5999, smartfony,
                List.of("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800",
                        "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=800"),
                Map.of(producent, "Apple", cpu, "A17 Pro", ram, "8GB", storage, "256GB", ekran,
                        "6.1 Super Retina XDR OLED 120Hz", getOrCreateAttribute("Złącze"), "USB-C"));

        createP("Samsung Galaxy S24 Ultra",
                "Witamy w erze mobilnej sztucznej inteligencji. Z Galaxy S24 Ultra w Twoich rękach możesz uwolnić zupełnie nowe pokłady kreatywności i produktywności. Wszystko zaczyna się od najważniejszego urządzenia w Twoim życiu. \n\n"
                        +
                        "Nowa tytanowa obudowa chroni urządzenie lepiej niż kiedykolwiek, a wbudowany rysik S Pen kontynuuje dziedzictwo serii Note, pozwalając na precyzyjne pisanie i rysowanie. Rewolucyjny aparat 200 MP z silnikiem ProVisual Engine rozjaśnia noc i optymalizuje detale, a najpotężniejszy procesor Snapdragon 8 Gen 3 for Galaxy zapewnia płynność w najbardziej wymagających grach z ray tracingiem.",
                6599, smartfony,
                List.of("https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800"),
                Map.of(producent, "Samsung", cpu, "Snapdragon 8 Gen 3 for Galaxy", ram, "12GB", storage, "512GB",
                        bateria, "5000mAh", getOrCreateAttribute("Aparat"), "200 MP + 50 MP + 12 MP + 10 MP"));

        createP("Google Pixel 8 Pro",
                "Pixel 8 Pro to profesjonalny telefon zaprojektowany przez Google. Jest elegancki, nowoczesny i wyposażony w najbardziej zaawansowany system aparatów Pixel, który pozwala na robienie niesamowitych zdjęć i filmów nawet w słabym świetle. \n\n"
                        +
                        "Dzięki nowemu układowi Google Tensor G3, Pixel 8 Pro jest szybszy i bardziej wydajny, a sztuczna inteligencja Google pomaga Ci w ciągu dnia w zupełnie nowy sposób – od usuwania niechcianych dźwięków z filmów po automatyczne podsumowywanie nagrań głosowych. Ekran Super Actua o jasności do 2400 nitów sprawia, że wszystko jest czytelne nawet w pełnym słońcu.",
                4499, smartfony,
                List.of("https://images.unsplash.com/photo-1598327105666-5b89351af9db?w=800"),
                Map.of(producent, "Google", cpu, "Google Tensor G3", ram, "12GB", storage, "128GB", ekran,
                        "6.7 LTPO OLED", getOrCreateAttribute("System"), "Android 14"));

        createP("Xiaomi 14 Ultra",
                "Optyka Leica nowej generacji. Cztery aparaty 50MP z systemem soczewek przysłony bezstopniowej. Procesor Snapdragon 8 Gen 3 zapewnia bezkompromisową wydajność w najbardziej wymagających aplikacjach i grach.",
                5799, smartfony,
                List.of("https://images.unsplash.com/photo-1567581935884-3349723552ca?w=800"),
                Map.of(producent, "Xiaomi", ram, "16GB LPDDR5X", storage, "512GB UFS 4.0", ekran, "6.73 AMOLED WQHD+",
                        bateria, "5000mAh (90W HyperCharge)"));

        createP("Nothing Phone (2)", "Interfejs Glyph.", 2699, smartfony,
                List.of("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"),
                Map.of(producent, "Nothing", storage, "256GB"));
        createP("OnePlus 12", "Szybki jak błyskawica.", 3899, smartfony,
                List.of("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"),
                Map.of(producent, "OnePlus", ram, "16GB", bateria, "5400mAh"));
        createP("Sony Xperia 1 V", "Dla twórców wideo.", 5299, smartfony,
                List.of("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"),
                Map.of(producent, "Sony", ekran, "6.5 4K OLED"));
        createP("ASUS Zenfone 10", "Kompaktowa moc.", 3399, smartfony,
                List.of("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"),
                Map.of(producent, "ASUS", ekran, "5.9 AMOLED"));
        createP("Motorola Edge 40 Pro", "Ekran 165Hz.", 3499, smartfony,
                List.of("https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800"),
                Map.of(producent, "Motorola", ram, "12GB"));
        createP("iPhone 15 Plus", "Dłuższa bateria.", 4999, smartfony,
                List.of("https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800"),
                Map.of(producent, "Apple", storage, "128GB"));
    }

    private void seedAudio(ProductAttribute producent, ProductAttribute kolor, ProductAttribute moc,
            ProductAttribute bateria, ProductAttribute cpu, Category sluchawki, Category glosniki) {
        createP("Sony WH-1000XM5",
                "Słuchawki Sony WH-1000XM5 wyznaczają nowe standardy w dziedzinie bezprzewodowej redukcji hałasu i jakości dźwięku. Wyposażone w dwa procesory sterujące ośmioma mikrofonami oraz specjalnie zaprojektowany przetwornik akustyczny, oferują niesamowite wrażenia słuchowe. \n\n"
                        +
                        "Innowacyjna technologia Auto NC Optimizer automatycznie optymalizuje redukcję hałasu w zależności od warunków otoczenia, a cztery mikrofony kształtujące wiązkę zapewniają krystaliczną czystość rozmów telefonicznych nawet w wietrzne dni. Bateria wystarczająca na 30 godzin pracy pozwala na wielodniowe słuchanie bez konieczności ładowania.",
                1399, sluchawki,
                List.of("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"),
                Map.of(producent, "Sony", kolor, "Czarny", bateria, "30h", getOrCreateAttribute("Złącze"),
                        "Bluetooth 5.2 / Jack 3.5mm"));

        createP("Apple AirPods Max",
                "AirPods Max to zupełnie nowe spojrzenie na słuchawki wokółuszne. Zaprojektowany przez Apple przetwornik dynamiczny zapewnia wierne odtwarzanie dźwięku o wysokiej jakości. Każdy element konstrukcji – od sklepienia z oddychającej siateczki po poduszki z zapamiętującej kształt pianki – stworzono z myślą o idealnym dopasowaniu. \n\n"
                        +
                        "Słuchawki oferują czołową w branży aktywną redukcję hałasu, tryb kontaktu pozwalający słyszeć otoczenie oraz spersonalizowany dźwięk przestrzenny z dynamicznym śledzeniem ruchu głowy, co sprawia, że czujesz się jak w kinie.",
                2399, sluchawki,
                List.of("https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=800"),
                Map.of(producent, "Apple", kolor, "Silver", bateria, "20h", cpu, "Apple H1 (w każdym nauszniku)"));

        createP("JBL Boombox 3",
                "JBL Boombox 3 to najpotężniejszy przenośny głośnik Bluetooth, który dostarcza kultowe brzmienie JBL Original Pro Sound z najgłębszym basem. Nowy 3-drożny system głośników zapewnia wyższą czułość i mniejsze zniekształcenia przy każdej głośności. \n\n"
                        +
                        "Dzięki certyfikatowi IP67 głośnik jest całkowicie odporny na pył i wodę, więc możesz zabrać go na plażę lub nad basen. Imponująca bateria pozwala na 24 godziny odtwarzania muzyki, a funkcja PartyBoost umożliwia połączenie wielu głośników w celu uzyskania jeszcze potężniejszego brzmienia.",
                1899, glosniki,
                List.of("https://images.unsplash.com/photo-1608156639585-340034a060d4?w=800"),
                Map.of(producent, "JBL", moc, "180W (AC) / 136W (Bateria)", bateria, "24h",
                        getOrCreateAttribute("Waga"), "6.7 kg"));

        createP("Marshall Stanmore III",
                "Stanmore III to model ze środka oferty domowej Marshalla, który zapewnia szeroką scenę dźwiękową i wypełnia dom kultowym brzmieniem. Wyposażony w skierowane na zewnątrz głośniki wysokotonowe i zaktualizowane falowody, model ten dostarcza spójny, mocny dźwięk. \n\n"
                        +
                        "Funkcja Dynamic Loudness dostosowuje balans tonalny dźwięku, zapewniając doskonałą jakość przy każdym poziomie głośności. Wykonany z dbałością o detale, łączy klasyczny design Marshalla z nowoczesnymi rozwiązaniami, takimi jak Bluetooth 5.2 i wejście RCA.",
                1499, glosniki, List.of("https://images.unsplash.com/photo-1589003077984-894e133dabab?w=800"),
                Map.of(producent, "Marshall", moc, "80W", kolor, "Black/Cream", getOrCreateAttribute("Wejścia"),
                        "Bluetooth, RCA, 3.5mm"));

        createP("Sennheiser Momentum 4 Wireless",
                "Poznaj nową generację legendarnych słuchawek Momentum. Zainspirowane muzyką, oferują audiofilską jakość dźwięku Sennheiser w połączeniu z niesamowitym komfortem i rekordowym czasem pracy na baterii. \n\n"
                        +
                        "Dzięki 42-milimetrowemu systemowi przetworników o wysokiej dynamice oraz zaawansowanej adaptacyjnej redukcji szumów, Momentum 4 pozwalają usłyszeć każdy niuans muzyki bez zakłóceń z zewnątrz. Inteligentne funkcje, takie jak Smart Pause, ułatwiają codzienne użytkowanie.",
                1299, sluchawki, List.of("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"),
                Map.of(producent, "Sennheiser", bateria, "60h", getOrCreateAttribute("Kodeki"),
                        "SBC, AAC, aptX Adaptive"));
    }

    private void seedGaming(ProductAttribute producent, ProductAttribute kolor, ProductAttribute storage,
            Category myszki) {
        createP("Logitech G Pro X Superlight 2",
                "Logitech G Pro X Superlight 2 to ewolucja legendy. Zaprojektowana we współpracy z czołowymi profesjonalistami e-sportowymi, waży zaledwie 60 gramów, co czyni ją jedną z najlżejszych myszek na rynku. \n\n"
                        +
                        "Wyposażona w przełączniki hybrydowe LIGHTFORCE, które łączą szybkość optyków z mechanicznym kliknięciem, oraz sensor HERO 2 z czułością do 32 000 DPI. Bezprzewodowa technologia LIGHTSPEED oferuje niezrównaną szybkość reakcji i niezawodność podczas turniejowych zmagań.",
                749, myszki,
                List.of("https://images.unsplash.com/photo-1615663248861-2446a95bb0ad?w=800"),
                Map.of(producent, "Logitech G", kolor, "White/Black", storage, "HERO 2 (32000 DPI)",
                        getOrCreateAttribute("Waga"), "60g"));

        createP("Razer BlackWidow V4 Pro",
                "Zdominuj pole bitwy dzięki klawiaturze, która oferuje pełną kontrolę i nieskazitelną immersję. Razer BlackWidow V4 Pro posiada dedykowane pokrętło kontrolne oraz 8 klawiszy makro, które ułatwiają sterowanie w grach i podczas pracy. \n\n"
                        +
                        "Przełączniki mechaniczne Razer zapewniają precyzyjną aktywację i satysfakcjonujące kliknięcie, podczas gdy obustronne podświetlenie Underglow w połączeniu z Razer Chroma™ RGB tworzy spektakularny pokaz świetlny na Twoim biurku.",
                1149, myszki,
                List.of("https://images.unsplash.com/photo-1618384800394-2456b89c7d12?w=800"),
                Map.of(producent, "Razer", kolor, "Black", getOrCreateAttribute("Typ przełączników"),
                        "Razer Green/Yellow", getOrCreateAttribute("Podświetlenie"), "Chroma RGB"));
    }

    private void seedHomeOffice(ProductAttribute producent, ProductAttribute ekran, ProductAttribute odswiezanie,
            Category monitory) {
        createP("LG UltraGear 27GP850", "NanoIPS dla graczy.", 1699, monitory,
                List.of("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"),
                Map.of(producent, "LG", ekran, "27 QHD", odswiezanie, "165Hz"));

        createP("Dell UltraSharp U2723QE", "Panel IPS Black 4K.", 2899, monitory,
                List.of("https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800"),
                Map.of(producent, "Dell", ekran, "27 4K", odswiezanie, "60Hz"));
    }

    private void seedComponents(ProductAttribute producent, ProductAttribute cpu, ProductAttribute ram,
            ProductAttribute gpu, ProductAttribute storage, Category podzespoly, Category kartyGraficzne,
            Category procesory) {
        createP("NVIDIA GeForce RTX 4080 Super",
                "Karta graficzna NVIDIA® GeForce RTX™ 4080 Super zapewnia niezwykłą wydajność dla najbardziej wymagających graczy i twórców. Dzięki architekturze Ada Lovelace i technologii DLSS 3, możesz cieszyć się fotorealistyczną grafiką z ray tracingiem w najwyższych rozdzielczościach. \n\n"
                        +
                        "Karta została wyposażona w 16 GB szybkiej pamięci G6X, a jej zaawansowany system chłodzenia pozwala na stabilną pracę pod dużym obciążeniem. To potężne narzędzie zarówno do gier 4K, jak i profesjonalnego montażu wideo czy renderowania 3D.",
                4899, kartyGraficzne,
                List.of("https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"),
                Map.of(producent, "NVIDIA Founders Edition", ram, "16GB GDDR6X", gpu, "Ada Lovelace (AD103)",
                        getOrCreateAttribute("TDP"), "320W"));

        createP("Intel Core i9-14900K",
                "Procesory Intel® Core™ i9 czternastej generacji to szczyt inżynierii procesorowej dla komputerów stacjonarnych. Wyposażony w 24 rdzenie i 32 wątki, i9-14900K oferuje niespotykaną wydajność wielozadaniową i jest najszybszym procesorem do gier. \n\n"
                        +
                        "Dzięki technologii Intel® Thermal Velocity Boost zegar procesora może osiągać zawrotną prędkość 6,0 GHz bez potrzeby manualnego podkręcania. Współpraca z pamięciami DDR5 i magistralą PCIe 5.0 sprawia, że jest to fundament najbardziej zaawansowanych konfiguracji PC.",
                2849, procesory,
                List.of("https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800"),
                Map.of(producent, "Intel", cpu, "24-cores (8P+16E) up to 6.0GHz", storage, "Cache 36MB",
                        getOrCreateAttribute("Socket"), "LGA1700"));
    }

    private void seedRtvAgd(ProductAttribute producent, ProductAttribute ekran, ProductAttribute moc, Category telewizory,
            Category ekspresy) {
        createP("Samsung OLED S95C 65",
                "Przeżyj niesamowite wrażenia wizualne z najnowszym telewizorem OLED firmy Samsung. Dzięki technologii Quantum HDR OLED+, obraz jest niezwykle jasny, a kolory nasycone i realistyczne jak nigdy dotąd. \n\n"
                        +
                        "Procesor AI Quantum 4K optymalizuje każdą scenę przy użyciu sztucznej inteligencji, zapewniając płynność ruchu i głęboką czerń. Ultra-smukły design Infinity One sprawia, że telewizor wygląda jak dzieło sztuki, a system dźwięku Dolby Atmos 4.2.2 CH przenosi Cię w samo centrum akcji.",
                11999, telewizory,
                List.of("https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800",
                        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800"),
                Map.of(producent, "Samsung", ekran, "65 QD-OLED 4K 144Hz", getOrCreateAttribute("System Smart"),
                        "Tizen OS", getOrCreateAttribute("HDR"), "HDR10+, HLG"));

        createP("DeLonghi Dinamica Plus ECAM 370.70.B",
                "Dinamica Plus to w pełni automatyczny ekspres do kawy, który łączy w sobie elegancję, wydajność i nowoczesną technologię. Dzięki systemowi LatteCrema, ekspres przygotowuje gęstą i kremową piankę mleczną o idealnej temperaturze za jednym dotknięciem. \n\n"
                        +
                        "Kolorowy wyświetlacz dotykowy TFT ułatwia personalizację ulubionych napojów, a funkcja 'My' pozwala dostosować aromat oraz ilość kawy i mleka do własnych preferencji. Ekspres oferuje szeroki wybór przepisów – od klasycznego Espresso po modne Flat White.",
                3499, ekspresy,
                List.of("https://images.unsplash.com/photo-1580915411954-282cb1b0d780?w=800",
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800"),
                Map.of(producent, "DeLonghi", moc, "1450W", getOrCreateAttribute("Ciśnienie"), "19 bar",
                        getOrCreateAttribute("Młynek"), "Stalowy żarnowy"));
    }

    private void createP(String name, String desc, double price, Category cat, List<String> imgs,
            Map<ProductAttribute, String> attrs) {
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

    private void createProduct(String name, String description, BigDecimal price, Category category,
            List<String> images, Map<ProductAttribute, String> attributes) {
        
        Optional<Product> existingOpt = productRepository.findByName(name);
        Product product;
        
        if (existingOpt.isPresent()) {
            product = existingOpt.get();
            // Update basic info if needed
            product.setDescription(description);
            product.setPrice(price);
            product.setCategory(category);
        } else {
            product = Product.builder()
                    .name(name)
                    .description(description)
                    .price(price)
                    .category(category)
                    .status(Product.Status.AKTYWNY)
                    .build();
        }

        // Ensure images exist
        if (images != null && product.getImages().isEmpty()) {
            for (String img : images) {
                product.getImages().add(ProductImage.builder().product(product).imagePath(img).build());
            }
        }

        // Ensure at least one variant exists
        if (product.getVariants().isEmpty()) {
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
                    variant.getAttributeValues().add(value);
                }
            }
            product.getVariants().add(variant);
        }

        productRepository.save(product);
    }

    private void createProductWithReviews(String name, String description, BigDecimal price, Category category,
            List<String> images, Map<ProductAttribute, String> attributes, Random rand, List<User> users, List<String> reviewComments) {
        
        Optional<Product> existingOpt = productRepository.findByName(name);
        Product product;
        
        if (existingOpt.isPresent()) {
            product = existingOpt.get();
            product.setCategory(category);
            boolean hasPlaceholder = product.getImages().stream().anyMatch(i -> i.getImagePath().contains("photo-1550009158"));
            if (hasPlaceholder || product.getImages().isEmpty()) {
                product.getImages().clear();
                if (images != null) {
                    for (String img : images) {
                        product.getImages().add(ProductImage.builder().product(product).imagePath(img).build());
                    }
                }
            }
        } else {
            product = Product.builder()
                    .name(name)
                    .description(description)
                    .price(price)
                    .category(category)
                    .status(Product.Status.AKTYWNY)
                    .build();
        }

        if (images != null && product.getImages().isEmpty()) {
            for (String img : images) {
                product.getImages().add(ProductImage.builder().product(product).imagePath(img).build());
            }
        }

        if (product.getVariants().isEmpty()) {
            ProductVariant variant = ProductVariant.builder()
                    .product(product)
                    .sku(category.getName().substring(0, 3).toUpperCase() + "-" + Math.abs(name.hashCode()))
                    .stockQuantity(10 + rand.nextInt(50))
                    .build();

            if (attributes != null) {
                for (Map.Entry<ProductAttribute, String> entry : attributes.entrySet()) {
                    ProductAttributeValue value = ProductAttributeValue.builder()
                            .attribute(entry.getKey())
                            .value(entry.getValue())
                            .build();
                    variant.getAttributeValues().add(value);
                }
            }
            product.getVariants().add(variant);
        }

        // Add 1 to 5 random reviews
        if (product.getReviews().isEmpty()) {
            int numReviews = 1 + rand.nextInt(5);
            for (int i = 0; i < numReviews; i++) {
                User reviewUser = users.get(rand.nextInt(users.size()));
                int rating = 3 + rand.nextInt(3); // 3 to 5 stars
                String comment = reviewComments.get(rand.nextInt(reviewComments.size()));
                
                Review review = Review.builder()
                    .product(product)
                    .user(reviewUser)
                    .rating(rating)
                    .comment(comment)
                    .status(Review.Status.APPROVED)
                    .build();
                    
                product.getReviews().add(review);
            }
        }

        productRepository.save(product);
    }
}
